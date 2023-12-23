import React from 'react';
import { Logger } from '../utils/Logger';

const Welcome = () => {
  React.useEffect(() => {
    Logger.debug('Welcome page loaded');
    return () => {
      Logger.debug('Welcome page unloaded');
    };
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <h1>Welcome</h1>
    </div>
  );
};

export default Welcome;
