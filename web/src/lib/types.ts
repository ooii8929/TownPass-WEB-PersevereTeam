export type OptionSystemMessage = {
  type: "option";
  options: {
    label: string;
    option: string;
  }[];
};

type OpenSystemMessage = {
  type: "open";
};

type NextSystemMessage = {
  type: "next";
  options: {
    task_id: number;
    task_name: string;
  }[];
};

export type SystemMessage = (
  | OptionSystemMessage
  | OpenSystemMessage
  | NextSystemMessage
) & {
  category: "system";
  ts: string;
  uid: string;
  content: string;
  question: string;
};

export type UserMessage = {
  category: "user";
  user_uid: string;
  last_uid: string;
  reply: string;
  answer: string;
};

export type Conversation = SystemMessage | UserMessage;

export type Conversations = {
  conversations: Conversation[];
  score: number;
  task_id: string;
  user_id: string;
};

export type ConversationBody = Omit<UserMessage, "category">;
