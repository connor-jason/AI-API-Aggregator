import { AIModel, Prompt } from '../models/aiModels';
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
      case 'google':
        return await callGoogle(specificModel, model.apiKey!, conversation);
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
      system: messages[0].content,
      messages: messages.slice(1).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    });

    const content = response.content;
    if (content.length === 0) {
      return 'No response from Claude';
    }

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

const callGoogle = async (model: string, apiKey: string, messages: { role: string; content: string }[]): Promise<string> => {

  const configuration = new GoogleGenerativeAI(apiKey);
  const gemini = configuration.getGenerativeModel({ model: model });

  try {
    const currentMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = gemini.startChat({
      history: currentMessages,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;
    const responseText = response.text();

    return responseText || 'No response from Gemini';
  } catch (error) {
    console.error('Error in callGemini:', error);
    throw new Error('Failed to get response from Gemini');
  }
};