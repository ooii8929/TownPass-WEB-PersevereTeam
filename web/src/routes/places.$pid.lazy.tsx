import { Button } from "@/components/ui/button";
import { conversationsQueryOptions } from "@/lib/queries";
import { SystemMessage, UserMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/places/$pid")({
  component: GamePage,
});

function GamePage() {
  // const { pid } = Route.useParams();

  const { data } = useQuery(
    conversationsQueryOptions("498801e1-2f50-4265-8ae1-8216972729d7", 4),
  );

  function handleClick(index: number) {
    // window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col p-4 pb-16">
      <div className="animate-fade mb-4 overflow-clip rounded-lg bg-neutral-800 bg-cover text-center text-lg font-medium text-white [background-image:url('https://img.ltn.com.tw/Upload/house/page/2020/09/18/200918-10395-1-saZAR.jpg')]">
        <div className="bg-black/60 p-20">迪化街中街</div>
      </div>
      <div className="animate-fade prose prose-p:my-3 first:prose-p:mt-0 opacity-0 delay-300">
        {/* <p>
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
        </p> */}
        {/* {messages.length === 0 ? (
          <Button
            className="animate-fade mx-auto my-2 w-full opacity-0 delay-700"
            size="lg"
            onClick={() => handleClick(0)}
          >
            出發吧
          </Button>
        ) : null} */}
        {data?.conversations.map((message, index) => {
          if (message.category === "user" && message.reply)
            return <UserBlock key={index} message={message} />;
          if (message.category === "system" && message.type === "option")
            return (
              <QuestionBlock
                key={index}
                isLast={index === data.conversations.length - 1}
                message={message}
                userAnswer={
                  (data?.conversations.at(index + 1) as UserMessage | undefined)
                    ?.answer
                }
              />
            );
          if (message.category === "system" && message.type === "open")
            return (
              <>
                <p className="animate-fade">{message.content}</p>
                <hr className="animate-fade my-4" />
                <p className="animate-fade">{message.question}</p>
              </>
            );
          if (message.category === "system" && message.type === "next")
            return (
              <>
                <p className="animate-fade">{message.content}</p>
                <hr className="animate-fade my-4" />
                <p className="animate-fade">{message.question}</p>
                <div className="animate-fade space-y-4">
                  {message.options.map((option, index) => (
                    <Button
                      key={index}
                      className="animate-fade w-full"
                      variant="secondary"
                      // size="lg"
                    >
                      {option.task_name}
                    </Button>
                  ))}
                </div>
              </>
            );
        })}
      </div>
      {/* <pre>{JSON.stringify(data?.conversations, null, 2)}</pre> */}
    </div>
  );
}

interface QuestionBlockProps {
  isLast: boolean;
  message: Extract<SystemMessage, { type: "option" }>;
  userAnswer?: string;
}

function QuestionBlock(props: QuestionBlockProps) {
  function handleClick(choice: string) {}

  return (
    <>
      <p className="animate-fade">{props.message.content}</p>
      <hr className="animate-fade my-4" />
      <p className="animate-fade">{props.message.question}</p>
      <div className="animate-fade space-y-4">
        {props.message.options.map((option, index) => (
          <Button
            key={index}
            className={cn(
              "animate-fade w-full justify-start",
              // TODO: What is the correct answer?
              props.userAnswer === option.label &&
                "bg-emerald-100 text-emerald-800",
            )}
            variant="secondary"
            // size="lg"
            onClick={() => handleClick(option.label)}
          >
            {option.option}
            {props.userAnswer === option.label && (
              <CheckIcon className="ml-auto h-4 w-4" />
            )}
          </Button>
        ))}
      </div>
    </>
  );
}

function UserBlock(props: { message: UserMessage }) {
  return (
    <div className="my-4 flex">
      <div className="animate-fade ml-auto rounded-3xl rounded-br-md bg-secondary px-4 py-2 pr-3.5">
        {props.message.reply}
      </div>
    </div>
  );
}
