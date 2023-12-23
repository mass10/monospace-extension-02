import React from 'react';
import { Logger } from '../utils/Logger';

const Options = () => {
  React.useEffect(() => {
    Logger.debug('Options page loaded');
    return () => {
      Logger.debug('Options page unloaded');
    };
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <h1>Options</h1>
    </div>
  );
};

export default Options;
