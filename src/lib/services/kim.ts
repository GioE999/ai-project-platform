/**
 * NVIDIA KIM API Service
 * LLM wrapper for the platform's AI operations.
 */

const KIM_API_URL = process.env.NVIDIA_KIM_API_URL || "https://integrate.api.nvidia.com/v1";
const KIM_API_KEY = process.env.NVIDIA_KIM_API_KEY || "";

interface KimMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface KimOptions {
  systemPrompt?: string;
  userPrompt: string;
  messages?: KimMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface KimResponse {
  content: string;
  tokensUsed: number;
  model: string;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e as Error;
      if (i < retries) await new Promise(r => setTimeout(r, delayMs * Math.pow(2, i)));
    }
  }
  throw lastError;
}

export async function callKim(options: KimOptions): Promise<KimResponse> {
  const messages: KimMessage[] = [];
  if (options.systemPrompt) messages.push({ role: "system", content: options.systemPrompt });
  if (options.messages) messages.push(...options.messages);
  messages.push({ role: "user", content: options.userPrompt });

  const response = await withRetry(async () => {
    const res = await fetch(`${KIM_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${KIM_API_KEY}`,
      },
      body: JSON.stringify({
        model: options.model || "nvidia/llama-3.1-nemotron-70b-instruct",
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
      }),
    });
    if (!res.ok) throw new Error(`KIM API error: ${res.status} ${await res.text()}`);
    return res.json();
  });

  return {
    content: response.choices?.[0]?.message?.content || "",
    tokensUsed: response.usage?.total_tokens || 0,
    model: response.model || options.model || "nvidia/llama-3.1-nemotron-70b-instruct",
  };
}
