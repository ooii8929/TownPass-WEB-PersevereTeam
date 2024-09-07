import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { useConnectionMessage } from "../hooks/useConnectionMessage";
import { useHandleConnectionData } from "../hooks/useHandleConnectionData";
import { useUserStore } from "../stores/user";

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
    [setUser]
  );

  useHandleConnectionData(handleMessage);

  useEffect(() => {
    sendMessage("userinfo", null);
  }, [sendMessage]);

  if (!user)
    return (
      <div className="my-8 h-full w-full text-center">Please open in app.</div>
    );

  return (
    <div className="p-4">
      <Link
        to="/test"
        className="my-4 block text-center bg-black text-white py-2 rounded-md"
      >
        Go to Test Page
      </Link>
      <h1 className="mb-2 text-3xl font-bold">My App</h1>
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
      <p>Verify Level: {user.verifyLevel}</p>
    </div>
  );
}
