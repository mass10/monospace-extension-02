import browser from 'webextension-polyfill';
import store, { initializeWrappedStore } from '../app/store';
import { Logger } from '../utils/Logger';

/**
 * バックグラウンドスクリプトのエントリーポイント
 */
function main(): void {
  Logger.info('background script started.');

  initializeWrappedStore();

  store.subscribe(() => {
    // access store state
    // const state = store.getState();
    // console.log('state', state);
  });

  // show welcome page on new install
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      //show the welcome page
      const url = browser.runtime.getURL('src/welcome/welcome.html');
      await browser.tabs.create({ url });
    }
  });
}

// バックグラウンドスクリプトの実行
main();
