"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff } from "lucide-react";

type SpeechRecognitionResultItem = {
  transcript: string;
};

type SpeechRecognitionResultListItem = {
  isFinal: boolean;
  0: SpeechRecognitionResultItem;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultListItem>;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type BrowserWithSpeechRecognition = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const pageRoutes = [
  { keywords: ["overview", "owner home", "home"], href: "/dashboard/owner" },
  { keywords: ["pipelines", "pipeline list", "lanes"], href: "/dashboard/owner/pipelines" },
  { keywords: ["groupchat", "openclaw", "chat room", "owner chat"], href: "/dashboard/owner/groupchat" },
  { keywords: ["suggestions", "ideas", "improvements"], href: "/dashboard/owner/suggestions" },
  { keywords: ["import bot", "imports", "openclaw json"], href: "/dashboard/owner/import-bot" },
  { keywords: ["bot management", "manage bots", "bot roster"], href: "/dashboard/owner/bot-management" },
  { keywords: ["outputs", "drafts", "generated work"], href: "/dashboard/owner/outputs" },
  { keywords: ["refinements", "code refinements", "execution specs"], href: "/dashboard/owner/code-refinements" },
  { keywords: ["settings", "api keys", "routing rules"], href: "/dashboard/owner/settings" },
];

const pipelineRoutes = [
  { keywords: ["code pipeline", "code lane"], href: "/dashboard/owner/pipelines/code" },
  { keywords: ["marketing pipeline", "marketing lane"], href: "/dashboard/owner/pipelines/marketing" },
  { keywords: ["social pipeline", "social lane"], href: "/dashboard/owner/pipelines/social" },
  { keywords: ["product pipeline", "product lane"], href: "/dashboard/owner/pipelines/product" },
  { keywords: ["seo pipeline", "seo lane"], href: "/dashboard/owner/pipelines/seo" },
  { keywords: ["experiments pipeline", "experiments lane"], href: "/dashboard/owner/pipelines/experiments" },
  { keywords: ["research pipeline", "custom research"], href: "/dashboard/owner/pipelines/custom-research" },
];

export const OwnerVoiceCommander = () => {
  const router = useRouter();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const listeningRef = useRef(false);

  useEffect(() => {
    listeningRef.current = listening;
  }, [listening]);

  const processVoiceCommand = useCallback(
    async (command: string) => {
      const normalizedCommand = command.trim().toLowerCase();

      if (!normalizedCommand) {
        return;
      }

      if (normalizedCommand.includes("stop listening") || normalizedCommand.includes("mute voice")) {
        setListening(false);
        return;
      }

      const pipelineMatch = pipelineRoutes.find((route) =>
        route.keywords.some((keyword) => normalizedCommand.includes(keyword)),
      );

      if (pipelineMatch) {
        router.push(pipelineMatch.href);
        return;
      }

      const pageMatch = pageRoutes.find((route) => route.keywords.some((keyword) => normalizedCommand.includes(keyword)));

      if (pageMatch) {
        router.push(pageMatch.href);
        return;
      }

      if (normalizedCommand.includes("approve top")) {
        console.log("Owner voice command captured: approve top");
        return;
      }

      try {
        await fetch("/api/claws/command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channelId: "owner-hq",
            content: `(Voice) ${command}`,
          }),
        });
      } catch (error) {
        console.error("Unable to send owner voice command", error);
      }
    },
    [router],
  );

  useEffect(() => {
    const browserWindow = window as BrowserWithSpeechRecognition;
    const SpeechRecognition = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];

        if (result?.isFinal && result[0]) {
          finalTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        void processVoiceCommand(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      if (!listeningRef.current) {
        return;
      }

      try {
        recognition.start();
      } catch {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      listeningRef.current = false;
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [processVoiceCommand]);

  useEffect(() => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      return;
    }

    if (listening) {
      try {
        recognition.start();
      } catch {
        // Ignore duplicate start attempts.
      }

      return;
    }

    recognition.stop();
  }, [listening]);

  return (
    <button
      type="button"
      onClick={() => setListening((current) => !current)}
      className={`fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border shadow-[0_24px_60px_-28px_rgba(15,23,42,0.4)] transition ${
        listening
          ? "border-rose-200 bg-rose-500 text-white"
          : "border-white/80 bg-white/90 text-slate-700 backdrop-blur-xl"
      }`}
      title={transcript ? `Last command: ${transcript}` : "Toggle owner voice command"}
      aria-pressed={listening}
    >
      {listening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
    </button>
  );
};
