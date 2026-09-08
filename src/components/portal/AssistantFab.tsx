/**
 * Knowledge-base assistant (v0).
 *
 * Planned architecture:  Chat UI → Convex action → AI API → Knowledge Base.
 * Current demo: answers are retrieved client-side strictly from the official
 * KB (FAQ entries + tariff register + shutdown list), so the assistant never
 * invents tariffs or legal facts. Swap the matcher for a server action
 * (convex/assistant.ts) when an LLM provider is wired up.
 */
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useI18n } from "@/lib/i18n";
import { PHONES, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChatMsg {
  role: "user" | "bot";
  text: string;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?()«»"'`:;—–-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findBestAnswer(
  question: string,
  faq: { question: { ru: string; kk: string }; answer: { ru: string; kk: string } }[],
  lang: "ru" | "kk",
  tariffBlurb: string,
  outageBlurb: string,
): string {
  const q = normalize(question);
  const words = q.split(" ").filter((w) => w.length > 2);

  const tariffWords = ["тариф", "сколько стоит", "цена", "стоимость", "оплат", "tarif", "баға", "қанша"];
  if (tariffWords.some((w) => q.includes(w))) return tariffBlurb;
  if (q.includes("отключ") || q.includes("вода отключ") || q.includes("когда дадут") || q.includes("өшір")) {
    return outageBlurb;
  }

  let best: { score: number; answer: string } | null = null;
  for (const item of faq) {
    const text = normalize(`${item.question[lang]} ${item.answer[lang]}`);
    const score = words.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0);
    if (!best || score > best.score) {
      best = { score, answer: item.answer[lang] };
    }
  }
  if (best && best.score > 0) return best.answer;
  return "";
}

export function AssistantFab() {
  const { t, lang, dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "bot", text: dict["assistant.hello"] },
  ]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const faq = useQuery(api.content.listFaq);
  const tariffs = useQuery(api.content.listTariffs);
  const outages = useQuery(api.content.listOutages);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const tariffBlurb = tariffs?.length
    ? tariffs
        .filter((t2) => t2.audience === "physical")
        .slice(0, 4)
        .map((t2) => `${t2.service[lang]} — ${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(t2.price)} ₸/${t2.unit[lang]}`)
        .join("; ") + ". " + t("tariffs.demoNote")
    : t("tariffs.demoNote");

  const activeOutages = (outages ?? []).filter((o) => o.status === "active").slice(0, 2);
  const outageBlurb = activeOutages.length
    ? activeOutages
        .map((o) => `${o.district[lang]}: ${o.streets[lang]} — ${o.reason[lang]}`)
        .join("; ") + ". " + t("outages.notice")
    : t("outages.empty");

  const suggestions = (faq ?? []).slice(0, 3).map((f) => f.question[lang]);

  const answer = async (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    // simulate a short retrieval round-trip
    await new Promise((r) => setTimeout(r, 550));
    const found = findBestAnswer(text, faq ?? [], lang, tariffBlurb, outageBlurb);
    setTyping(false);
    setMessages((m) => [
      ...m,
      {
        role: "bot",
        text: found || t("assistant.fallback"),
      },
    ]);
  };

  return (
    <>
      {/* FAB */}
      <Button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 right-4 z-40 h-14 rounded-full px-5 shadow-lg md:bottom-6 md:right-6"
        aria-label={t("assistant.fab")}
      >
        {open ? <X className="size-5" /> : <Sparkles className="size-5" />}
        <span className="hidden sm:inline">{t("assistant.fab")}</span>
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-36 right-4 z-40 flex h-[min(560px,calc(100dvh-10rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl md:bottom-24 md:right-6"
          >
            <div className="flex items-center gap-3 border-b bg-slate-950 px-4 py-3 text-white">
              <span className="flex size-9 items-center justify-center rounded-xl bg-sky-400/20 text-sky-300">
                <Bot className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold">{t("assistant.title")}</p>
                <p className="truncate text-[11px] text-slate-400">{t("assistant.kb")}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
                aria-label={t("common.close")}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-5",
                      m.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm border bg-muted/60",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing ? (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border bg-muted/60 px-3.5 py-3">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                        style={{ animationDelay: `${d * 0.12}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {messages.length === 1 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void answer(s)}
                      className="cursor-pointer rounded-full border bg-background px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="border-t p-3">
              <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void answer(input);
                    }
                  }}
                  placeholder={t("assistant.placeholder")}
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                  aria-label={t("assistant.placeholder")}
                />
                <Button
                  size="icon"
                  className="size-8 shrink-0"
                  disabled={!input.trim() || typing}
                  onClick={() => void answer(input)}
                  aria-label={t("assistant.send")}
                >
                  <Send className="size-3.5" />
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageCircle className="size-3" />
                  {t("assistant.note")}
                </span>
                <a href={telHref(PHONES.callCenter)} className="shrink-0 font-bold text-primary hover:underline">
                  {t("assistant.call")}
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
