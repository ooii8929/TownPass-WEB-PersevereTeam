import axios from "@/lib/axios";
import { conversationsQueryKey } from "@/lib/queries";
import { Conversations, ConversationBody } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ConversationMutation = ConversationBody & { tid: string };

export function useConversation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ tid, ...body }: ConversationMutation) => {
      await axios.post(`/api/v1/tasks/${tid}/conversation`, body);
      return { uid: body.user_uid, tid };
    },
    onMutate: (data) => {
      queryClient.setQueryData(
        conversationsQueryKey(data.user_uid, data.tid),
        (oldData: Conversations | undefined) => {
          console.log(oldData);
          if (!oldData) return;
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
