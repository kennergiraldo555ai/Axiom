export interface BasePromptResult {
  systemPrompt: string;
  userPrompt: string;
}

export type PromptFunction<TInput> = (input: TInput) => BasePromptResult;
