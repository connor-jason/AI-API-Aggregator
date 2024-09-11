import React from 'react';
import Chat from './components/Chat';

const App: React.FC = () => {

  return (
    <div className="flex flex-col min-h-[100dvh] h-[100dvh] max-h-[100dvh] p-2 gap-2">
      <Chat />
    </div>
  );
};

export default App;
