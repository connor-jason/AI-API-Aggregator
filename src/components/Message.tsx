import React from 'react';

type MessageProps = {
  text: string;
  sender: 'user' | 'ai';
};

const Message: React.FC<MessageProps> = ({ text, sender }) => {
  return (
    <div className={`p-2 mb-2 rounded ${sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
      <strong>{sender === 'user' ? 'You' : 'AI'}:</strong> {text}
    </div>
  );
};

export default Message;
