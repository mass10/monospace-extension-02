import 'webextension-polyfill';
import 'construct-style-sheets-polyfill';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { debounce } from 'lodash-es';
import { twind, config, cssom, observe, stringify } from './twind';
import { proxyStore } from '../app/proxyStore';
import Content from './Content';
import { Logger } from '../utils/Logger';

/**
 * 要素のフォントを等幅に設定します。
 *
 * @param element HTML 要素
 */
function setMonospace(element: Element): void {
  try {
    const el = element as HTMLElement;
    const styles = el.style;
    if (styles.fontFamily !== "'BIZ UD明朝 Medium', monospace") {
      styles.fontFamily = "'BIZ UD明朝 Medium', monospace";
    }
  } catch (error) {
    Logger.error(error);
  }
}

/**
 * Google Drive の行アイテムを見やすくします。
 */
async function testSearchGoogleDriveItems(): Promise<void> {
  try {
    const driveMainPage = document.querySelector('div[id="drive_main_page"]');
    if (!driveMainPage) {
      // 起点となる要素が見つからない場合は何もしません。
      return;
    }

    {
      // ツリーアイテムの等幅(by role)
      for (const navigation of document.querySelectorAll('nav[role="navigation"]')) {
        for (const item of navigation.querySelectorAll('div[role="treeitem"]')) {
          setMonospace(item);
        }
      }
    }

    {
      // リストアイテムの等幅(by class)
      for (const item of driveMainPage.querySelectorAll('div[class="KL4NAf"]')) {
        setMonospace(item);
      }
    }

    // {
    //   const query = 'div[data-tooltip^="Google Drive Folder:"]';
    //   const items = driveMainPage.querySelectorAll(query);
    //   // const items = document.querySelectorAll(query);
    //   for (const item of items) {
    //     // Logger.debug(`Google Drive Folder:`, item);
    //     setMonospace(item);
    //   }
    // }

    // {
    //   const query = 'div[data-tooltip^="Image:"]';
    //   const items = driveMainPage.querySelectorAll(query);
    //   // const items = document.querySelectorAll(query);
    //   for (const item of items) {
    //     // Logger.debug(`Image:`, item);
    //     setMonospace(item);
    //   }
    // }
  } catch (error) {
    Logger.error(error);
  }
}

function onReadyStore(): void {
  Logger.debug(`(CONTENT READY)`);

  // Google Drive の行アイテムを見やすくします。
  window.setInterval(testSearchGoogleDriveItems, 1000 * 6);

  const contentRoot = document.createElement('div');
  contentRoot.id = 'my-extension-root';
  contentRoot.style.display = 'contents';
  document.body.append(contentRoot);

  const shadowRoot = contentRoot.attachShadow({ mode: 'open' });
  const sheet = cssom(new CSSStyleSheet());

  // shadowRoot.adoptedStyleSheet bug in firefox
  // see: https://bugzilla.mozilla.org/show_bug.cgi?id=1827104
  if (navigator?.userAgent.includes('Firefox')) {
    const style = document.createElement('style');
    const debouncedSyncCss = debounce(() => {
      style.textContent += stringify(sheet.target);
    }, 100);

    const originalSheetInsert = sheet.insert;
    (sheet.insert as typeof originalSheetInsert) = (...params) => {
      originalSheetInsert(...params);
      debouncedSyncCss();
    };
    shadowRoot.appendChild(style);
  } else {
    shadowRoot.adoptedStyleSheets = [sheet.target];
  }

  const tw = twind(config, sheet);
  observe(tw, shadowRoot);

  const shadowWrapper = document.createElement('div');
  shadowWrapper.id = 'root';
  shadowWrapper.style.display = 'contents';
  shadowRoot.appendChild(shadowWrapper);

  createRoot(shadowWrapper).render(
    <React.StrictMode>
      <Provider store={proxyStore}>
        <Content />
      </Provider>
    </React.StrictMode>
  );
}

/**
 * Content ページのエントリーポイント
 */
function main(): void {
  proxyStore
    .ready()
    .then(onReadyStore)
    .catch((error) => {
      Logger.error(error);
    });

  proxyStore.subscribe(() => {
    Logger.debug(`(CONTENT UPDATE)`);
  });
}

main();
