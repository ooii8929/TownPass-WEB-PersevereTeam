import axios from "@/lib/axios";
import { User } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

type UserMutation = User;

export function useUser() {

    const mutation = useMutation({
        mutationFn: async ({ ...body }: UserMutation) => {
            const res = await axios.post(`/api/v1/users`, body);
            return { uid: res.data.uid };
        },
        onSettled: (data) => {
            if (!data) return;
            localStorage.setItem('userData', JSON.stringify(data.uid));
          },
    });

    return mutation;
}
