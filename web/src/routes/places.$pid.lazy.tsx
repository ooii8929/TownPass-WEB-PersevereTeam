import { Button } from "@/components/ui/button";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/places/$pid")({
  component: GamePage,
});

function GamePage() {
  // const { pid } = Route.useParams();
  const [messages, setMessages] = useState<any[]>([]);

  function getQuestion(index: number) {
    return [
      "這是一個問題",
      "這是一個問題",
      "這是一個問題",
      "這是一個問題",
      "這是一個問題",
      "這是一個問題",
    ][index];
  }

  function handleClick(index: number) {
    setMessages((prev) => [
      ...prev,
      { type: "choice", msg: getQuestion(index) },
    ]);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col p-4 pb-16">
      <div className="animate-fade mb-4 overflow-clip rounded-lg bg-neutral-800 bg-cover text-center text-lg font-medium text-white [background-image:url('https://img.ltn.com.tw/Upload/house/page/2020/09/18/200918-10395-1-saZAR.jpg')]">
        <div className="bg-black/60 p-20">迪化街</div>
      </div>
      <div className="animate-fade prose prose-p:my-3 first:prose-p:mt-0 opacity-0 delay-300">
        <p>
          迪化街位於臺灣臺北市大同區，初建於清咸豐年間 1850 年代，19
          世紀末以來一直是臺北重要的南北貨、茶葉、中藥材及布匹的集散中心。為大稻埕地區最重要的市街。19
          世紀至 20
          世紀中期，臺北的商業發展約等於大稻埕商圈的發展，而大稻埕的發展約略就等於迪化街的發展。
        </p>
        <p>
          經過 1980 年代的廢存爭議之後，1996
          年開始，保存原狀的迪化街除了成為臺北市保留最完整的老街外，也於每年農曆春節前夕擴展成規模盛大的「台北年貨大街」。不僅如此，迪化街也同樣維持相同的批發商業功能。據統計，2005
          年的迪化街附近共有 100 多家的紡織公司、300 多家布行、200
          多家中藥材鋪，年產值則超過 30 億美金。
        </p>
        {messages.length === 0 ? (
          <div className="flex w-full">
            <Button
              className="animate-fade mx-auto my-4 opacity-0 delay-700"
              size="lg"
              onClick={() => handleClick(0)}
            >
              出發吧
            </Button>
          </div>
        ) : null}
        {messages.map(
          (message, index) =>
            message.type === "choice" && (
              <QuestionBlock
                key={index}
                message={message.msg}
                onClick={() => handleClick(index + 1)}
              />
            ),
        )}
      </div>
    </div>
  );
}

interface QuestionBlockProps {
  message: string;
  onClick: () => void;
}

function QuestionBlock(props: QuestionBlockProps) {
  const [answer, setAnswer] = useState<string | null>(null);

  function handleClick(choice: string) {
    setAnswer(choice);
    props.onClick();
  }

  const answers: Record<string, string> = {
    A: "這是答案 A",
    B: "這是答案 B",
    C: "這是答案 C",
    D: "這是答案 D",
  };

  return (
    <>
      <hr className="animate-fade my-4" />
      <p className="animate-fade">{props.message}</p>
      {answer ? (
        <p className="animate-fade">你的回答：{answers[answer]}</p>
      ) : (
        <div className="animate-fade flex flex-col justify-stretch gap-4">
          {Object.entries(answers).map(([choice, answer], index) => (
            <Button
              key={index}
              className="animate-fade w-full justify-start"
              variant="secondary"
              onClick={() => handleClick(choice)}
            >
              {answer}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
