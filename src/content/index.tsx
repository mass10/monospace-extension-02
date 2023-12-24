import 'webextension-polyfill';
import 'construct-style-sheets-polyfill';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { twind, config, cssom, observe } from './twind';
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
    if (styles.fontFamily.indexOf('BIZ UD明朝 Medium') === -1) {
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
    // Finding the starting element
    const driveMainPage = document.querySelector('div[id="drive_main_page"]');
    if (!driveMainPage) {
      Logger.warn(`(CONTENT) drive_main_page not found`);
      return;
    }

    // Make tree items monospace
    {
      for (const navigation of document.querySelectorAll('nav[role="navigation"]')) {
        for (const item of navigation.querySelectorAll('div[role="treeitem"]')) {
          setMonospace(item);
        }
      }
    }

    // Make grid lines monospace
    {
      for (const row of driveMainPage.querySelectorAll('div[role="gridcell"]')) {
        for (const item of row.querySelectorAll('div[class="KL4NAf"]')) {
          // Name
          setMonospace(item);
        }
        for (const item of row.querySelectorAll('span[class="rprYvc"]')) {
          // Owner
          setMonospace(item);
        }
        for (const item of row.querySelectorAll('span[class="jApF8d"]')) {
          // Last modified, Size
          setMonospace(item);
        }
      }
    }

    //
    {
      for (const main of driveMainPage.querySelectorAll('div[role="main"]')) {
        for (const item of main.querySelectorAll('div[jscontroller="NEq59c"]')) {
          setMonospace(item);
        }
      }
    }
  } catch (error) {
    Logger.error(error);
  }
}

function onReadyStore(): void {
  Logger.debug(`(CONTENT READY)`);

  // Google Drive の行アイテムを見やすくします。
  window.setInterval(testSearchGoogleDriveItems, 1000 * 6);

  createContentRoot();
}

function createContentRoot(): void {
  const contentRoot = document.createElement('div');
  contentRoot.id = 'my-extension-root';
  contentRoot.style.display = 'contents';
  document.body.append(contentRoot);

  const shadowRoot = contentRoot.attachShadow({ mode: 'open' });
  const sheet = cssom(new CSSStyleSheet());

  if (navigator?.userAgent.includes('Firefox')) {
    //
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
