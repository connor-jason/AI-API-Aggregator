import React, { useState, useEffect } from 'react';
import { aiModels, AIModel } from '../models/aiModels';

type ModelSelectorProps = {
  selectedModel: AIModel;
  selectedSpecificModel: string;
  onModelChange: (model: AIModel, specificModel: string) => void;
};

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  selectedSpecificModel, 
  onModelChange 
}) => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    if (selectedModel) {
      setAvailableModels(selectedModel.models);
    }
  }, [selectedModel]);

  return (
    <div className="mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Provider:</label>
        <select
          className="block w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedModel.id}
          onChange={(e) => {
            const selected = aiModels.find((model) => model.id === e.target.value);
            if (selected) {
              onModelChange(selected, selected.models[0]);
            }
          }}
        >
          {aiModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

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
    </div>
  );
};

export default ModelSelector;
