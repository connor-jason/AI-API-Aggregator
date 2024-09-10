import React, { useState } from 'react';
import { callAIModel } from '../utils/api';
import { AIModel, aiModels, Prompt, prompts } from '../models/aiModels';
import OptionsPicker from './OptionsPicker';

export interface Message {
  role: string;
  content: string;
}

const Chat: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>(aiModels[0]);
  const [selectedSpecificModel, setSelectedSpecificModel] = useState<string>(aiModels[0].models[0]);
  const [selectedPrompt, setPrompt] = useState<Prompt>(prompts[0]);
  const [messages, setMessages] = useState<Message[]>([{ role: 'system', content: selectedPrompt.prompt }]);

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

  const handlePromptChange = (prompt: Prompt) => {
    setPrompt(prompt);
    setMessages([{ role: 'system', content: prompt.prompt }, ...messages.slice(1)]);
  }

  return (
    <div className="flex flex-row gap-2 rounded shadow-xl h-full">
      <div className="h-full border border-white rounded-xl p-2">
        {/* Model Selector */}
        <OptionsPicker 
          onPromptChange={handlePromptChange}
          selectedPrompt={selectedPrompt}
          selectedModel={selectedModel} 
          selectedSpecificModel={selectedSpecificModel}
          onModelChange={handleModelChange}
        />
      </div>
      <div className="flex flex-col border border-white rounded-xl h-full w-full p-4">
        {/* Chat Messages */}
        <div className="overflow-y-auto rounded mb-4 h-full">
          {messages.slice(1).map((msg, idx) => (
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
        <div className="flex flex-row gap-2">
          {/* User Input */}
          <input
            type="text"
            className="w-full p-2 border border-white bg-background-gray rounded"
            placeholder="Type your message"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
          />
          
          {/* Send Button */}
          <button
            className="px-4 bg-blue-500 text-white rounded h-10"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
