export type AIModel = {
  id: string;
  name: string;
  models: string[];
  apiKey?: string;
};

export const aiModels: AIModel[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: ['claude-3-5-sonnet-20240620', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
  },
];
