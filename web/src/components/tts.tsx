import { PauseIcon, PlayIcon } from "lucide-react";
import { useTts } from "tts-react";

interface TTSProps {
  text: string;
  lang: string;
  rate?: number;
}

export default function TTS({ text, lang, rate }: TTSProps) {
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
    lang,
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
