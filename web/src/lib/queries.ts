import { queryOptions } from "@tanstack/react-query";
import { Conversations } from "@/lib/types";
import axios from "@/lib/axios";

export function conversationsQueryKey(uid: string, tid: string) {
  return [uid, "conversations", tid];
}

export function conversationsQueryOptions(uid: string, tid: string) {
  return queryOptions({
    queryKey: conversationsQueryKey(uid, tid),
    queryFn: async () => {
      const { data } = await axios.post<Conversations>(
        `/api/v1/tasks/${tid}/conversations`,
        { user_uid: uid },
      );
      return data;
    },
    // staleTime: 24 * 60 * 60 * 1000,
  });
}
