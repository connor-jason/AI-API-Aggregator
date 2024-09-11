import React, { useState, useEffect } from 'react';
import { aiModels, AIModel, Prompt, prompts } from '../models/aiModels';

type ModelSelectorProps = {
  selectedPrompt: Prompt;
  selectedModel: AIModel;
  selectedSpecificModel: string;
  onModelChange: (model: AIModel, specificModel: string) => void;
  onPromptChange: (prompt: Prompt) => void;
};

const OptionsPicker: React.FC<ModelSelectorProps> = ({ 
  selectedPrompt,
  selectedModel, 
  selectedSpecificModel, 
  onModelChange,
  onPromptChange 
}) => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availablePrompts, setAvailablePrompts] = useState<string[]>([]);

  useEffect(() => {
    if (selectedModel) {
      setAvailableModels(selectedModel.models);
    }
  }, [selectedModel]);

  useEffect(() => {
    setAvailablePrompts(prompts.map(prompt => prompt.name));
  }, []);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = aiModels.find((model) => model.id === e.target.value);
    if (selected) {
      onModelChange(selected, selected.models[0]);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPrompt = prompts.find(prompt => prompt.name === e.target.value);
    if (selectedPrompt) {
      onPromptChange(selectedPrompt);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Provider Selector */}
      <div className="">
        <label className="block font-bold mb-2">Provider:</label>
        <select
          className="block w-full p-2 border border-white bg-background-gray rounded focus:outline-none focus:animate-outer-glow-cycle transition-shadow duration-300lg"
          value={selectedModel.id}
          onChange={handleModelChange}
        >
          {aiModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      {/* Model Selector */}
      <div>
        <label className="block font-bold mb-2">Model:</label>
        <select
          className="block w-full p-2 border border-white bg-background-gray rounded focus:outline-none focus:animate-outer-glow-cycle transition-shadow duration-300lg"
          value={selectedSpecificModel}
          onChange={(e) => {
            onModelChange(selectedModel, e.target.value);
          }}
        >
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
      {/* Prompt Picker */}
      <div>
        <label className="block font-bold mb-2">Prompt:</label>
        <select
          className="block w-full p-2 border border-white bg-background-gray rounded focus:outline-none focus:animate-outer-glow-cycle transition-shadow duration-300lg"
          value={selectedPrompt.name}
          onChange={handlePromptChange}
        >
          {availablePrompts.map((prompt) => (
            <option key={prompt} value={prompt}>
              {prompt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OptionsPicker;
