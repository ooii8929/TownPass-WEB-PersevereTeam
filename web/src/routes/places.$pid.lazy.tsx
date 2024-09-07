import { Button } from "@/components/ui/button";
import { conversationsQueryOptions } from "@/lib/queries";
import { SystemMessage, UserMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/places/$pid")({
  component: GamePage,
});

function GamePage() {
  // const { pid } = Route.useParams();
  const [len, setLen] = useState(0);

  const { data } = useQuery(
    conversationsQueryOptions("498801e1-2f50-4265-8ae1-8216972729d7", 4),
  );

  // function handleClick(index: number) {
  //   window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  // }

  const conversations = data?.conversations.slice(0, len) ?? [];

  useEffect(() => {
    if (!data) return;
    if (data.conversations.length <= len) return;
    setTimeout(() => {
      setLen((prev) => prev + 1);
    }, 150);
  }, [data?.conversations.length, len]);

  return (
    <div className="flex flex-col p-4 pb-16">
      <div className="animate-fadeGrow mb-4 overflow-clip rounded-xl bg-neutral-800 bg-cover bg-center text-center text-xl font-medium text-white [background-image:url('https://img.ltn.com.tw/Upload/house/page/2020/09/18/200918-10395-1-saZAR.jpg')]">
        <div className="bg-black/60">
          <span className="animate-fadeGrow flex items-center justify-center">
            迪化街中街
          </span>
        </div>
      </div>
      <div className="animate-fade prose prose-p:my-3 first:prose-p:mt-0">
        {conversations.map((message, index) => {
          const isLast = index === conversations.length - 1;
          if (message.category === "user" && message.reply)
            return <UserBlock key={index} message={message} />;
          if (message.category === "system" && message.type === "option")
            return (
              <OptionSystemBlock
                key={index}
                isLast={isLast}
                message={message}
                prev={conversations.at(index + 1) as UserMessage | undefined}
              />
            );
          if (message.category === "system" && message.type === "open")
            return <OpenSystemBlock key={index} message={message} />;
          if (message.category === "system" && message.type === "next")
            return <NextSystemBlock key={index} message={message} />;
        })}
      </div>
      {/* <pre>{JSON.stringify(data?.conversations, null, 2)}</pre> */}
    </div>
  );
}

interface OpenSystemBlockProps {
  message: Extract<SystemMessage, { type: "open" }>;
}

function OpenSystemBlock(props: OpenSystemBlockProps) {
  return (
    <>
      <SystemBlock message={props.message.content} />
      <hr className="animate-fade my-4" />
      <SystemBlock message={props.message.question} />
    </>
  );
}

interface OptionSystemBlockProps {
  isLast: boolean;
  message: Extract<SystemMessage, { type: "option" }>;
  prev?: UserMessage;
}

function OptionSystemBlock(props: OptionSystemBlockProps) {
  // function handleClick(choice: string) {}

  return (
    <>
      <SystemBlock message={props.message.content} />
      <hr className="animate-fade my-4" />
      <SystemBlock message={props.message.question} />
      <div className="animate-fade space-y-4">
        {props.message.options.map((option, index) => (
          <Button
            key={index}
            className={cn(
              "animate-fade h-auto w-full justify-start py-3 text-left",
              // TODO: What is the correct answer?
              props.prev?.answer === option.label &&
                "bg-emerald-100 text-emerald-800",
            )}
            variant="secondary"
            // size="lg"
            // onClick={() => handleClick(option.label)}
          >
            <span className="mr-4 whitespace-pre-wrap">{option.option}</span>
            {props.prev?.answer === option.label && (
              <CheckIcon className="ml-auto h-4 w-4 shrink-0" />
            )}
          </Button>
        ))}
      </div>
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
      <hr className="animate-fade my-4" />
      <SystemBlock message={props.message.question} />
      <div className="animate-fade space-y-4">
        {props.message.options.map((option, index) => (
          <Button
            key={index}
            className="animate-fade h-auto w-full justify-start py-3 text-left"
            variant="secondary"
            // size="lg"
          >
            {option.task_name}
          </Button>
        ))}
        <Button className="animate-fade w-full" variant="link" asChild>
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
    <div className="my-4 flex">
      <div className="animate-fade ml-auto rounded-3xl rounded-br-md bg-secondary px-4 py-2 pr-3.5">
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
    // <p className="animate-fade relative ml-7">
    <p className="animate-fade relative">
      {/* <span className="absolute -left-7 top-1 inline-block size-5 rounded-full bg-cover [background-image:url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f8d87a38-2116-457c-aacd-06d78324acd0/d8a4fkf-644b096d-642e-484c-8bbd-5c7c3d86e980.jpg/v1/fit/w_638,h_638,q_70,strp/inside_out_02_disgust_by_miacat7_d8a4fkf-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjM4IiwicGF0aCI6IlwvZlwvZjhkODdhMzgtMjExNi00NTdjLWFhY2QtMDZkNzgzMjRhY2QwXC9kOGE0ZmtmLTY0NGIwOTZkLTY0MmUtNDg0Yy04YmJkLTVjN2MzZDg2ZTk4MC5qcGciLCJ3aWR0aCI6Ijw9NjM4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.7DjaJcth22iJnexivWZaoSFUJbDM0r6znyrvbvV5IjU')]" /> */}
      {/* <span className="absolute -left-7 top-1 inline-block size-5 rounded-full bg-cover [background-image:url('https://avatarfiles.alphacoders.com/695/thumb-350-69545.jpg')]" /> */}
      {props.message}
    </p>
  );
}
