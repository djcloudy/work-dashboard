import { useState, useRef, useEffect } from "react";
import { Send, Trash2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardCard } from "@/components/DashboardCard";

interface Message {
  role: "user" | "agent";
  content: string;
  time: string;
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim(), time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Mock agent response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "Agent responses will appear here once your n8n chat URL is configured in Settings.", time: now() },
      ]);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <DashboardCard title="Chat">
        <div className="flex h-[60vh] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {messages.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Start a conversation with your n8n agent.
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "agent" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    {msg.role === "user" ? <><User className="h-3 w-3" /> You</> : <><Bot className="h-3 w-3" /> Agent</>}
                    · {msg.time}
                  </p>
                  <div
                    className={`rounded-lg px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1"
            />
            <Button onClick={send} className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
            <Button variant="ghost" onClick={() => setMessages([])}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Messages proxy to /api/agent/chat → N8N_CHAT_URL. Configure the URL in Settings.
          </p>
        </div>
      </DashboardCard>
    </div>
  );
}
