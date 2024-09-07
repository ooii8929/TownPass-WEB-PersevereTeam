import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { useConnectionMessage } from "@/hooks/useConnectionMessage";
import { useHandleConnectionData } from "@/hooks/useHandleConnectionData";
import { useUserStore } from "@/stores/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createLazyFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { user, setUser } = useUserStore();
  const sendMessage = useConnectionMessage();

  const handleMessage = useCallback(
    (event: { data: string }) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (parsedData.name === "userinfo") {
          setUser(parsedData.data);
        } else {
          console.log("Received general message:", parsedData);
          // 在這裡處理其他類型的消息
        }
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    },
    [setUser],
  );

  useHandleConnectionData(handleMessage);

  useEffect(() => {
    sendMessage("userinfo", null);
  }, [sendMessage]);

  // if (!user)
  //   return (
  //     <div className="my-8 h-full w-full text-center">Please open in app.</div>
  //   );

  return (
    <div className="flex h-screen flex-col p-8">
      {/* <div className="my-auto">
        <div className="mx-auto size-48 rounded-full bg-neutral-50"></div>
      </div> */}
      <div className="my-auto flex flex-col gap-4">
        {/* <Input placeholder="你的名字" defaultValue={user.realName} /> */}
        <Input type="number" pattern="\d*" />
        <Select defaultValue="zh">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button asChild variant="secondary" size="lg">
        <Link to="/map" className="w-full">
          開始
        </Link>
      </Button>
      {/* <h1 className="mb-2 text-3xl font-bold">My App</h1>
      <h2 className="mb-1 mt-4 text-xl font-medium">Basic Information</h2>
      <p>Username: {user.username}</p>
      <p>Real Name: {user.realName}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNo}</p>
      <h2 className="mb-1 mt-4 text-xl font-medium">Address</h2>
      {user.addresses && user.addresses.length > 0 && (
        <p>
          {user.addresses[0].city} {user.addresses[0].town}{" "}
          {user.addresses[0].street}
        </p>
      )}
      <h2 className="mb-1 mt-4 text-xl font-medium">Other Details</h2>
      <p>Member Type: {user.memberType}</p>
      <p>Verify Level: {user.verifyLevel}</p> */}
    </div>
  );
}
