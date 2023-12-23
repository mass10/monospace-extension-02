import React from 'react';
import { Counter } from '../app/features/counter';
import { Logger } from '../utils/Logger';

const Content = () => {
  React.useEffect(() => {
    Logger.debug('Content page loaded');
    return () => {
      Logger.debug('Content page unloaded');
    };
  }, []);

  if (new Date().getTime()) {
    return <></>;
  }

  return (
    <div className="fixed z-[999] bottom-2 right-2 shadow-xl border-[1px] bg-white bg-opacity-10">
      <div className="flex justify-center mt-2 text-base">Content Counter</div>
      <Counter />
    </div>
  );
};

export default Content;
