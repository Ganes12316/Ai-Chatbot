const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Use OpenRouter's free model router — it automatically picks 
// from currently available free models
const MODEL = "openrouter/auto";

export async function sendToAI(
  messages: { role: string; content: string }[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "API key is missing. Please add VITE_OPENROUTER_API_KEY to your .env.local file."
    );
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "AI Chatbot",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg =
      errorData?.error?.message || `API returned status ${response.status}`;

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `Authentication failed. Your API key may be invalid or expired. Please get a new key from https://openrouter.ai/keys`
      );
    }

    if (response.status === 429) {
      throw new Error(
        "Rate limited. Please wait a moment and try again."
      );
    }

    throw new Error(errorMsg);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response received from the AI model.");
  }

  return data.choices[0].message.content;
}