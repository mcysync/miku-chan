import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, Globe, LayoutTemplate, Palette, ShoppingBag, Wand2 } from "lucide-react";
import mikuAsset from "@/assets/miku-chan.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const mascot = mikuAsset.url;

const SUGGESTIONS = [
  { icon: LayoutTemplate, label: "Portfolio site", prompt: "Build me a single-page portfolio for a graphic designer named Aiko. Include hero, projects grid, about, and contact." },
  { icon: ShoppingBag, label: "Product landing", prompt: "Build a landing page for a pastel-themed bubble tea brand called Mochi Sip. Hero, menu, story, and email signup." },
  { icon: Palette, label: "Anime fan page", prompt: "Build a fan page for Hatsune Miku with a gallery, bio, discography, and a starry animated background." },
  { icon: Globe, label: "SaaS homepage", prompt: "Build a homepage for a note-taking app called Kumo. Hero, features, pricing, and testimonials." },
];

function Index() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { if (status === "ready") inputRef.current?.focus(); }, [status]);

  const submit = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    void sendMessage({ text });
    setInput("");
  };

  const usePrompt = (p: string) => {
    if (isLoading) return;
    void sendMessage({ text: p });
  };

  return (
    <div className="min-h-screen starfield">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-5 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full miku-border animate-pulse-glow">
              <img src={mascot} alt="Miku-Chan" className="h-full w-full object-cover" width={48} height={48} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider miku-text animate-gradient">MIKU-CHAN</h1>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">website builder · online</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground sm:flex backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] animate-pulse" />
            Ready to build ~
          </div>
        </header>

        {/* Messages / Hero */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto py-4">
          {messages.length === 0 ? (
            <Hero onPick={usePrompt} />
          ) : (
            <div className="space-y-6">
              {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
              {status === "submitted" && <TypingIndicator />}
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive-foreground animate-slide-up">
                  Connection glitch: {error.message}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Composer */}
        <div className="sticky bottom-0 pb-6 pt-3">
          <div className="glass-panel miku-border rounded-2xl p-2 transition hover:shadow-[var(--shadow-glow-cyan)]">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
                }}
                placeholder="Describe the website you want Miku-Chan to build..."
                rows={1}
                className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <button
                onClick={submit}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent via-primary to-primary text-primary-foreground shadow-[var(--shadow-glow-pink)] transition hover:scale-110 hover:rotate-3 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:rotate-0 animate-gradient"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Miku-Chan builds websites and answers anything. ⚡ Powered by Lovable AI
          </p>
        </div>
      </div>
    </div>
  );
}

function Hero({ onPick }: { onPick: (p: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-8 py-10 text-center animate-slide-up">
      <div className="relative animate-float">
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-accent/40 to-primary/50 blur-3xl animate-pulse-glow" />
        <div className="absolute -inset-4 -z-10 rounded-full border border-accent/30 animate-spin-slow" />
        <img
          src={mascot}
          alt="Miku-Chan mascot"
          width={200}
          height={200}
          className="h-48 w-48 rounded-full object-cover ring-2 ring-accent/60 shadow-[0_0_80px_var(--color-miku-cyan)]"
        />
      </div>
      <div className="space-y-3">
        <h2 className="text-4xl font-black tracking-wide sm:text-6xl">
          <span className="miku-text animate-gradient">Konnichiwa</span>
          <span className="text-foreground">, senpai ~</span>
        </h2>
        <p className="mx-auto max-w-lg text-base text-muted-foreground sm:text-lg">
          I'm <span className="text-accent font-semibold">Miku-Chan</span>, your anime AI web developer.
          Tell me what to build and I'll ship a full <span className="text-primary font-semibold">website</span> — code, styles, animations, all of it. ✨
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => onPick(s.prompt)}
            style={{ animationDelay: `${i * 80}ms` }}
            className="group glass-panel flex items-start gap-3 rounded-xl p-4 text-left transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--shadow-glow-pink)] animate-slide-up"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent/25 to-primary/25 text-accent group-hover:from-accent/40 group-hover:to-primary/40 group-hover:text-primary transition">
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{s.label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{s.prompt}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <Wand2 className="h-3 w-3 text-accent animate-pulse" />
        Just describe it — I'll build it
        <Sparkles className="h-3 w-3 text-primary animate-pulse" />
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-br from-primary to-primary/80 px-4 py-2.5 text-primary-foreground shadow-[var(--shadow-glow-pink)]">
          <div className="msg-md text-[15px] leading-relaxed whitespace-pre-wrap">{text}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-accent/60 shadow-[0_0_15px_var(--color-miku-cyan)]">
        <img src={mascot} alt="" className="h-full w-full object-cover" width={36} height={36} />
      </div>
      <div className="msg-md flex-1 pt-1 text-[15px] leading-relaxed text-foreground min-w-0">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-accent/60 animate-pulse-glow">
        <img src={mascot} alt="" className="h-full w-full object-cover" width={36} height={36} />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-accent" />
        </div>
        <span className="text-xs text-muted-foreground italic">Miku-Chan is coding...</span>
      </div>
    </div>
  );
}
