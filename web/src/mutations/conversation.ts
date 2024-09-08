import axios from "@/lib/axios";
import { conversationsQueryKey } from "@/lib/queries";
import { Conversations, ConversationBody, Conversation } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ConversationMutation = ConversationBody & { tid: string };

type ConversationData = {
  conversation: Conversation;
  score: number;
  task_id: string;
  user_uid: string;
};

export function useConversation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ tid, ...body }: ConversationMutation) => {
      // const { data } = await axios.post<ConversationData>(
      await axios.post<ConversationData>(
        `/api/v1/tasks/${tid}/conversation`,
        body,
      );
      return { uid: body.user_uid, tid };
    },
    onMutate: (data) => {
      queryClient.setQueryData(
        conversationsQueryKey(data.user_uid, data.tid),
        (oldData: Conversations | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            conversations: [
              ...oldData.conversations,
              { ...data, category: "user" },
            ],
          };
        },
      );
    },
    onSettled: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({
        queryKey: conversationsQueryKey(data.uid, data.tid),
      });
    },
  });

  return mutation;
}
