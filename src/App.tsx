import React from 'react';
import Chat from './components/Chat';

const App: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-lg mx-auto">
        <Chat />
      </div>
    </div>
  );
};

export default App;
