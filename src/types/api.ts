export interface ChatRequest {
  messages: { role: string; content: string }[];
}

export interface ChatResponse {
  message: string;
  error?: string;
}