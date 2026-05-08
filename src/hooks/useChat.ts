import { useState, useCallback } from "react";
import type { Message } from "../types/chat";
import { generateId } from "../lib/utils";
import { sendToAI } from "../lib/ai";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);
      setError(null);

      try {
        const reply = await sendToAI(
          updatedMessages.map((m) => ({ role: m.role, content: m.content }))
        );

        const aiMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to get a response.";
        setError(message);
        console.error("Chat error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}