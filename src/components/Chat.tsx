import React, { useState } from 'react';
import { callAIModel } from '../utils/api';
import { AIModel, aiModels, Prompt, prompts } from '../models/aiModels';
import OptionsPicker from './OptionsPicker';
import { MenuIcon } from '@heroicons/react/outline';

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
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false); // State to toggle options visibility

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
  };

  return (
    <>
      {/* OptionsPicker is hidden by default on mobile, but shown when the hamburger is clicked */}
      {isOptionsOpen && (
        <div className="w-full min-h-[49%] md:hidden p-4 border border-white rounded-xl">
          <div className="p-2">
            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="text-white focus:outline-none"
            >
              {/* Hamburger icon */}
              <MenuIcon className="h-8 w-8 text-white rotate-90" />
            </button>
          </div>
          <OptionsPicker 
            onPromptChange={handlePromptChange}
            selectedPrompt={selectedPrompt}
            selectedModel={selectedModel} 
            selectedSpecificModel={selectedSpecificModel}
            onModelChange={handleModelChange}
          />
        </div>
      )}
    <div className="flex flex-row gap-2 rounded shadow-xl h-full">
      {/* Model Selector for desktop */}
      <div className="hidden md:block h-full border border-white rounded-xl p-4">
        <OptionsPicker 
          onPromptChange={handlePromptChange}
          selectedPrompt={selectedPrompt}
          selectedModel={selectedModel} 
          selectedSpecificModel={selectedSpecificModel}
          onModelChange={handleModelChange}
        />
      </div>

      {/* Chat Section */}
      <div className={`flex flex-col border border-white rounded-xl ${isOptionsOpen ? 'max-h-[50%]' : 'h-full'} md:h-full w-full p-4 ${isLoading ? 'animate-inner-glow-cycle' : ''}`}>
        {/* Hamburger for mobile screens */}
        {!isOptionsOpen && (
        <div className="md:hidden p-2">
          <button
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            className="text-white focus:outline-none"
          >
            {/* Hamburger icon */}
            <MenuIcon className="h-8 w-8 text-white" />
          </button>
        </div>
        )}
        <div className="overflow-y-auto rounded mb-4 h-full">
          {messages.slice(1).map((msg, idx) => (
            <div key={idx} className="mb-4">
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
          <input
            type="text"
            className="w-full p-2 border border-white bg-background-gray rounded focus:outline-none focus:animate-outer-glow-cycle transition-shadow duration-300"
            placeholder={`Message ${selectedSpecificModel}${selectedPrompt.name !== 'Default' ? ` as a ${selectedPrompt.name}` : ''}`}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="px-4 border border-white text-white rounded h-10 hover:animate-outer-glow-cycle transition-shadow duration-300"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Chat;
