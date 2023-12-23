/**
 * Popup ページのエントリーポイント
 */

import '../global.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { proxyStore } from '../app/proxyStore';
import Popup from './Popup';
import { Logger } from '../utils/Logger';

Logger.info('Popup page loaded');

proxyStore.ready().then(() => {
  createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Provider store={proxyStore}>
        <Popup />
      </Provider>
    </React.StrictMode>
  );
});
