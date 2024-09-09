import { AIModel } from '../models/aiModels';
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export const callAIModel = async (
  model: AIModel,
  specificModel: string,
  conversation: { role: string; content: string }[]
): Promise<string> => {
  try {
    switch (model.id) {
      case 'openai':
        return await callOpenAI(specificModel, model.apiKey!, conversation);
      case 'anthropic':
        return await callAnthropic(specificModel, model.apiKey!, conversation);
      default:
        throw new Error('Unknown AI model');
    }
  } catch (error) {
    console.error('Error in callAIModel:', error);
    throw error;
  }
};

const callOpenAI = async (model: string, apiKey: string, messages: { role: string; content: string }[]): Promise<string> => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages.map(msg => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content
      })),
    });

    return response.choices[0].message.content || 'No response from OpenAI';
  } catch (error) {
    console.error('Error in callOpenAI:', error);
    throw new Error('Failed to get response from OpenAI');
  }
};

const callAnthropic = async (model: string, apiKey: string, messages: { role: string; content: string }[]): Promise<string> => {
  const anthropic = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
  
  try {
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 1000,
      temperature: 0,
      system: "You are a helpful assistant.",
      messages: messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    });

    // Extract the content from the response
    const content = response.content;
    if (content.length === 0) {
      return 'No response from Claude';
    }

    // Combine all text blocks into a single string
    const responseText = content
      .filter(block => block.type === 'text')
      .map(block => (block as { text: string }).text)
      .join('\n');

    return responseText || 'No text response from Claude';
  } catch (error) {
    console.error('Error in callClaude:', error);
    throw new Error('Failed to get response from Claude');
  }
};