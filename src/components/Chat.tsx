import React, { useState } from 'react';
import { callAIModel } from '../utils/api';
import { AIModel, aiModels } from '../models/aiModels';
import ModelSelector from './ModelSelector';

export interface Message {
  role: string;
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>(aiModels[0]);
  const [selectedSpecificModel, setSelectedSpecificModel] = useState<string>(aiModels[0].models[0]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: Message = { role: 'user', content: userInput };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await callAIModel(selectedModel, selectedSpecificModel, updatedMessages);
      const newAiMessage: Message = { role: 'assistant', content: aiResponse };
      setMessages([...updatedMessages, newAiMessage]);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'There was an error with the AI model. Please try again later.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      messages.pop();
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (model: AIModel, specificModel: string) => {
    setSelectedModel(model);
    setSelectedSpecificModel(specificModel);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      {/* Model Selector */}
      <ModelSelector 
        selectedModel={selectedModel} 
        selectedSpecificModel={selectedSpecificModel}
        onModelChange={handleModelChange}
      />

      {/* Chat Messages */}
      <div className="h-64 overflow-y-auto bg-gray-100 p-4 rounded mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.role === 'user' ? 'You:' : 'AI:'}</strong> {msg.content}
          </div>
        ))}
        {error && (
          <div className="text-red-500">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* User Input */}
      <input
        type="text"
        className="w-full p-2 mb-2 border rounded"
        placeholder="Type your message"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        disabled={isLoading}
      />
      
      {/* Send Button */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={sendMessage}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default Chat;
