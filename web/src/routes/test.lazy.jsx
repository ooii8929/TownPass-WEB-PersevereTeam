import { createLazyFileRoute } from "@tanstack/react-router";
import TTS from "../components/tts";

export const Route = createLazyFileRoute("/test")({
  component: TestPage,
});

function TestPage() {
  return (
    // <TTS text="這是一個測試訊息" language="中文" rate={1} pitch={1} />
    // <TTS text="This is a test message" language="英文" rate={1} pitch={1} />
    <TTS text="これはテストメッセージです" language="日文" rate={1} pitch={1} />
  )
}
