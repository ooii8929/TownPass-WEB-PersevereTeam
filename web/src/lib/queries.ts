import { queryOptions } from "@tanstack/react-query";
import { Conversation } from "@/lib/types";
import axios from "@/lib/axios";

export function conversationsQueryOptions(uid: string, tid: number) {
  return queryOptions({
    queryKey: [uid, "conversations", tid],
    queryFn: async () => {
      const { data } = await axios.post<{
        conversations: Conversation[];
        score: number;
        task_id: string;
        user_id: string;
      }>(`/api/v1/tasks/${tid}/conversations`, { user_uid: uid });
      return data;
    },
    // staleTime: 24 * 60 * 60 * 1000,
  });
}
