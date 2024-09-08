import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { conversationsQueryOptions } from "@/lib/queries";
import { SystemMessage, UserMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useConversation } from "@/mutations/conversation";
import { CheckIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import TTS from "@/components/tts";

// TODO
const USER_ID = "ea48f1c4-2d85-4411-913c-feeea5df97aa";

export const Route = createLazyFileRoute("/tasks/$tid")({
  component: GamePage,
});

function GamePage() {
  const { tid } = Route.useParams();
  const [len, setLen] = useState(0);

  const { mutateAsync, isPending } = useConversation();
  const { data } = useQuery(conversationsQueryOptions(USER_ID, tid));

  const conversations = data?.conversations.slice(0, len) ?? [];

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    if (!data) return;
    if (data.conversations.length <= len) return;
    setTimeout(() => setLen(data.conversations.length), 500);
  }, [data?.conversations.length, len]);

  useEffect(() => {
    if (!data) return;
    if (data.conversations.length > 0) return;
    mutateAsync({
      tid,
      user_uid: USER_ID,
      last_uid: "init",
      reply: "",
      answer: "",
    });
  }, [data]);

  return (
    <div className="flex flex-col p-4 pb-16">
      <div className="mb-4 animate-fadeGrow overflow-clip rounded-xl bg-neutral-800 bg-cover bg-center text-center text-xl font-medium text-white [background-image:url('https://img.ltn.com.tw/Upload/house/page/2020/09/18/200918-10395-1-saZAR.jpg')]">
        <div className="bg-black/60">
          <span className="flex animate-fadeGrow items-center justify-center">
            迪化街中街
          </span>
        </div>
      </div>
      <div className="prose animate-fade prose-p:my-3 first:prose-p:mt-0">
        {conversations.map((message, index) => {
          const isLast = index === conversations.length - 1;
          if (message.category === "user" && message.reply)
            return <UserBlock key={index} message={message} />;
          if (message.category === "system" && message.type === "option")
            return (
              <OptionSystemBlock
                key={index}
                prev={conversations.at(index + 1) as UserMessage | undefined}
                isLast={isLast}
                message={message}
              />
            );
          if (message.category === "system" && message.type === "open")
            return (
              <OpenSystemBlock key={index} isLast={isLast} message={message} />
            );
          if (message.category === "system" && message.type === "next")
            return <NextSystemBlock key={index} message={message} />;
        })}
        {isPending && <PendingBlock />}
      </div>
      {/* <pre>{JSON.stringify(data?.conversations, null, 2)}</pre> */}
    </div>
  );
}

interface OpenSystemBlockProps {
  isLast: boolean;
  message: Extract<SystemMessage, { type: "open" }>;
}

function OpenSystemBlock(props: OpenSystemBlockProps) {
  const { mutateAsync, isPending } = useConversation();
  const { tid } = Route.useParams();

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    if (event.nativeEvent.isComposing) return;
    mutateAsync({
      tid,
      user_uid: USER_ID,
      last_uid: props.message.uid,
      reply: event.currentTarget.value,
      answer: "",
    });
  }

  return (
    <>
      <SystemBlock message={props.message.content} />
      <hr className="my-4 animate-fade" />
      <SystemBlock message={props.message.question} />
      {props.isLast && !isPending && (
        <Input onKeyDown={handleKeyDown} className="my-4 w-full animate-fade" />
      )}
      {isPending && <PendingBlock />}
    </>
  );
}

interface OptionSystemBlockProps {
  prev: UserMessage | undefined;
  isLast: boolean;
  message: Extract<SystemMessage, { type: "option" }>;
}

function OptionSystemBlock(props: OptionSystemBlockProps) {
  const { tid } = Route.useParams();
  const { mutateAsync, isPending } = useConversation();

  function handleClick(answer: string) {
    mutateAsync({
      tid,
      user_uid: USER_ID,
      last_uid: props.message.uid,
      reply: "",
      answer,
    });
  }

  return (
    <>
      <SystemBlock message={props.message.content} />
      <hr className="my-4 animate-fade" />
      <SystemBlock message={props.message.question} />
      <div className="ml-8 animate-fade space-y-4">
        {props.message.options.map((option, index) => (
          <Button
            key={index}
            disabled={!props.isLast}
            className={cn(
              "h-auto w-full animate-fade justify-start py-3 text-left transition-colors",
              // TODO: What is the correct answer?
              // has answered, not the correct option
              props.prev?.answer && "text-neutral-500",
              // has answered, the answer is correct
              props.prev?.answer === option.label &&
                "bg-emerald-100 text-emerald-800",
            )}
            variant="secondary"
            // size="lg"
            onClick={() => handleClick(option.label)}
          >
            <span className="mr-4 whitespace-pre-wrap">{option.option}</span>
            {props.prev?.answer === option.label && (
              <CheckIcon className="ml-auto h-4 w-4 shrink-0" />
            )}
          </Button>
        ))}
      </div>
      {isPending && <PendingBlock />}
    </>
  );
}

interface NextSystemBlockProps {
  message: Extract<SystemMessage, { type: "next" }>;
}

function NextSystemBlock(props: NextSystemBlockProps) {
  return (
    <>
      <SystemBlock message={props.message.content} />
      <hr className="my-4 animate-fade" />
      <SystemBlock message={props.message.question} />
      <div className="ml-8 animate-fade space-y-4">
        {props.message.options.map((option, index) => (
          <Button
            key={index}
            className="h-auto w-full animate-fade justify-start py-3 text-left"
            variant="secondary"
            // size="lg"
          >
            {option.task_name}
          </Button>
        ))}
        <Button className="w-full animate-fade" variant="link" asChild>
          <Link to="/map" className="w-full">
            返回
          </Link>
        </Button>
      </div>
    </>
  );
}

interface UserBlockProps {
  message: UserMessage;
}

function UserBlock(props: UserBlockProps) {
  return (
    <div className="my-4 ml-8 flex">
      <div className="ml-auto animate-fade rounded-3xl rounded-br-md bg-secondary px-4 py-2 pr-3.5">
        {props.message.reply}
      </div>
    </div>
  );
}

interface SystemBlockProps {
  message: string;
}

function SystemBlock(props: SystemBlockProps) {
  if (!props.message) return null;

  return (
    <div className="relative ml-8 animate-fade whitespace-pre-line">
      {/* <p className="animate-fade relative"> */}
      <Avatar />
      <TTS text={props.message} lang="zh-TW" rate={1.1} />
      {/* https://cc.tvbs.com.tw/img/program/upload/2023/01/07/20230107160037-8041c9f6.jpg */}
      {props.message.includes("台灣小吃") && (
        <div className="mb-4 animate-fadeGrow overflow-clip rounded-xl bg-neutral-800 bg-cover bg-center text-center text-xl font-medium text-white [background-image:url('https://img.ltn.com.tw/Upload/house/page/2020/09/18/200918-10395-1-saZAR.jpg')]">
          <div className="bg-black/60">
            <span className="flex animate-fadeGrow items-center justify-center">
              迪化街中街
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function PendingBlock() {
  return (
    <div className="relative ml-8 animate-fade whitespace-pre-line delay-500">
      <Avatar />
      {Array.from({ length: 3 }).map((_, index) => (
        <p
          key={index}
          className={cn(
            "relative top-1.5 h-4 w-full animate-pulse rounded bg-neutral-200",
            index === 2 && "w-3/4",
          )}
        />
      ))}
    </div>
  );
}

function Avatar() {
  return (
    <span className="absolute -left-8 top-1 inline-block size-5 rounded-full bg-cover [background-image:url('https://imgur.com/CFYWzI5.png')]" />
    // <span className="absolute -left-7 top-1 inline-block size-5 rounded-full bg-cover [background-image:url('https://avatarfiles.alphacoders.com/695/thumb-350-69545.jpg')]" />
  );
}

// https://toppng.com/uploads/preview/happy-inside-out-disgust-11549856093dh0jxuxlus.png

// https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f8d87a38-2116-457c-aacd-06d78324acd0/d8a4fkf-644b096d-642e-484c-8bbd-5c7c3d86e980.jpg/v1/fit/w_638,h_638,q_70,strp/inside_out_02_disgust_by_miacat7_d8a4fkf-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjM4IiwicGF0aCI6IlwvZlwvZjhkODdhMzgtMjExNi00NTdjLWFhY2QtMDZkNzgzMjRhY2QwXC9kOGE0ZmtmLTY0NGIwOTZkLTY0MmUtNDg0Yy04YmJkLTVjN2MzZDg2ZTk4MC5qcGciLCJ3aWR0aCI6Ijw9NjM4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.7DjaJcth22iJnexivWZaoSFUJbDM0r6znyrvbvV5IjU
