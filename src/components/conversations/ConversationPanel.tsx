"use client";
import { useState } from "react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  authorType: "user" | "agent";
  createdAt: string;
}

export function ConversationPanel({
  messages,
  onSendMessage,
}: {
  messages: Message[];
  onSendMessage: (content: string) => void;
}) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] rounded-lg p-3 text-sm ${
              msg.authorType === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          type="submit"
          className="rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
