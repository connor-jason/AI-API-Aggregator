import React, { useState, useEffect } from 'react';
import { aiModels, AIModel, Prompt, prompts } from '../models/aiModels';

type ModelSelectorProps = {
  selectedPrompt: Prompt;
  selectedModel: AIModel;
  selectedSpecificModel: string;
  onModelChange: (model: AIModel, specificModel: string) => void;
  onPromptChange: (prompt: Prompt) => void;
};

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
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
    <div className="mb-4">
      {/* Provider Selector */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Provider:</label>
        <select
          className="block w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label className="block text-gray-700 font-bold mb-2">Model:</label>
        <select
          className="block w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label className="block text-gray-700 font-bold mb-2">Prompt:</label>
        <select
          className="block w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default ModelSelector;