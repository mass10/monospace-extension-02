import React from 'react';
import { Counter } from '../app/features/counter';
import { Logger } from '../utils/Logger';

const Popup = () => {
  React.useEffect(() => {
    Logger.debug('Popup page loaded');
    return () => {
      Logger.debug('Popup page unloaded');
    };
  }, []);

  document.body.className = 'w-[30rem] h-[15rem]';

  return (
    <>
      <div className="flex justify-center mt-2 text-base">Popup Counter</div>
      <Counter />
    </>
  );
};

export default Popup;
