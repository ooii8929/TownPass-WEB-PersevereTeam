import { PauseIcon, PlayIcon } from "lucide-react";
import { useTts } from "tts-react";

interface TTSProps {
  text: string;
  rate?: number;
}

const langs: Record<string, string> = {
  en: "en-US",
  tw: "zh-TW",
};

export default function TTS({ text, rate }: TTSProps) {
  const lang = localStorage.getItem("lang") || "zh";

  const {
    ttsChildren,
    state,
    // set,
    play,
    pause,
    // replay,
    // stop,
    // toggleMute
  } = useTts({
    lang: langs[lang],
    rate,
    children: text,
    markTextAsSpoken: true,
  });

  const Icon = state.isPlaying ? PauseIcon : PlayIcon;

  return (
    <p onClick={state.isPlaying ? pause : play}>
      <span className="mr-1">{ttsChildren}</span>
      <Icon
        size={14}
        className="mb-[3px] inline-block fill-current text-neutral-500"
      />
      {/* <RotateCcwIcon
        size={14}
        strokeWidth={3}
        className="mb-[3px] ml-1.5 inline-block text-neutral-500"
        onClick={replay}
      /> */}
    </p>
  );
}
