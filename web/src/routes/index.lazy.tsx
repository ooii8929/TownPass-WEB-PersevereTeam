import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useConnectionMessage } from "@/hooks/useConnectionMessage";
import { useHandleConnectionData } from "@/hooks/useHandleConnectionData";
import { useUserStore } from "@/stores/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/mutations/user";
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

const characters = [
  {
    url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f8d87a38-2116-457c-aacd-06d78324acd0/d8a4fkd-e5da9651-be1b-4d64-adcb-153be80d7663.jpg/v1/fit/w_638,h_638,q_70,strp/inside_out_01_joy_by_miacat7_d8a4fkd-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjM4IiwicGF0aCI6IlwvZlwvZjhkODdhMzgtMjExNi00NTdjLWFhY2QtMDZkNzgzMjRhY2QwXC9kOGE0ZmtkLWU1ZGE5NjUxLWJlMWItNGQ2NC1hZGNiLTE1M2JlODBkNzY2My5qcGciLCJ3aWR0aCI6Ijw9NjM4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.g5PYF0dg1HbJTYVfR8FIYhFiLrUReFe1sW-kzqtXGNM",
    name: "happy",
    chineseName: "樂樂",
  },
  {
    url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f8d87a38-2116-457c-aacd-06d78324acd0/d8a4fkf-644b096d-642e-484c-8bbd-5c7c3d86e980.jpg/v1/fit/w_638,h_638,q_70,strp/inside_out_02_disgust_by_miacat7_d8a4fkf-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjM4IiwicGF0aCI6IlwvZlwvZjhkODdhMzgtMjExNi00NTdjLWFhY2QtMDZkNzgzMjRhY2QwXC9kOGE0ZmtmLTY0NGIwOTZkLTY0MmUtNDg0Yy04YmJkLTVjN2MzZDg2ZTk4MC5qcGciLCJ3aWR0aCI6Ijw9NjM4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.7DjaJcth22iJnexivWZaoSFUJbDM0r6znyrvbvV5IjU",
    name: "disgust",
    chineseName: "厭厭",
  },
  {
    url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f8d87a38-2116-457c-aacd-06d78324acd0/d8a4fkq-33bbd5a1-752e-45ab-841c-a44a392a9359.jpg/v1/fit/w_638,h_638,q_70,strp/inside_out_05_sadness_by_miacat7_d8a4fkq-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjM4IiwicGF0aCI6IlwvZlwvZjhkODdhMzgtMjExNi00NTdjLWFhY2QtMDZkNzgzMjRhY2QwXC9kOGE0ZmtxLTMzYmJkNWExLTc1MmUtNDVhYi04NDFjLWE0NGEzOTJhOTM1OS5qcGciLCJ3aWR0aCI6Ijw9NjM4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.eEPqWV3MXMVAooEoBAyhTFc1G0UVqRT0eNPwaOcWfug",
    name: "sadness",
    chineseName: "憂憂",
  },
  {
    url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f8d87a38-2116-457c-aacd-06d78324acd0/d8a4fkj-add91711-fe73-40d2-a9ca-6003ea7348a1.jpg/v1/fit/w_638,h_638,q_70,strp/inside_out_03_anger_by_miacat7_d8a4fkj-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjM4IiwicGF0aCI6IlwvZlwvZjhkODdhMzgtMjExNi00NTdjLWFhY2QtMDZkNzgzMjRhY2QwXC9kOGE0ZmtqLWFkZDkxNzExLWZlNzMtNDBkMi1hOWNhLTYwMDNlYTczNDhhMS5qcGciLCJ3aWR0aCI6Ijw9NjM4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.ZI07i62KRyxldYpZCGwea2RfEw3sCuGafiUY62gqtnY",
    name: "anger",
    chineseName: "怒怒",
  },
  {
    url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f8d87a38-2116-457c-aacd-06d78324acd0/d8a4fkl-cd4e0321-8692-4efa-a6d0-5b23b1c7b706.jpg/v1/fit/w_638,h_638,q_70,strp/inside_out_04_fear_by_miacat7_d8a4fkl-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjM4IiwicGF0aCI6IlwvZlwvZjhkODdhMzgtMjExNi00NTdjLWFhY2QtMDZkNzgzMjRhY2QwXC9kOGE0ZmtsLWNkNGUwMzIxLTg2OTItNGVmYS1hNmQwLTViMjNiMWM3YjcwNi5qcGciLCJ3aWR0aCI6Ijw9NjM4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.PVEqZtf9P3lZDLwt_4JOCO8-0tJIgtc2ukIDXvAuvio",
    name: "fear",
    chineseName: "驚驚",
  },
];

function HomePage() {
  const { user, setUser } = useUserStore();
  const [userInfo, setUserInfo] = useState({ age: 12, lang: "tw" });
  const [imageIndex, setImageIndex] = useState(0);
  const sendMessage = useConnectionMessage();

  const { mutateAsync } = useUser();

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

  const handlePrevClick = () => {
    setImageIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };
  const handleNextClick = () => {
    setImageIndex((prev) => (prev + 1) % characters.length);
  };

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
      <div className="relative my-auto mb-0 flex items-center justify-center">
        <button className="absolute left-0" onClick={handlePrevClick}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15 6L9 12L15 18" stroke="black" strokeWidth="2" />
          </svg>
        </button>

        {/* Image Display */}
        <div className="mx-auto size-48 rounded-full bg-neutral-50">
          <img
            src={characters[imageIndex].url}
            alt="User provided"
            className="h-48 w-48 rounded-full object-cover"
          />
        </div>

        {/* Right Arrow Button */}
        <button className="absolute right-0" onClick={handleNextClick}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 6L15 12L9 18" stroke="black" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Centered Text to show character emotion */}
      <h1 className="mt-2 text-center text-2xl font-bold">
        {characters[imageIndex].chineseName}
      </h1>

      <div className="my-auto flex flex-col gap-4">
        {/* <Input placeholder="你的名字" defaultValue={user.realName} /> */}
        <Input
          type="number"
          pattern="\d*"
          value={userInfo.age}
          placeholder="年齡"
          onChange={(event) =>
            setUserInfo((prev) => ({
              ...prev,
              age: parseInt(event.target.value),
            }))
          }
        />
        <Select
          value={userInfo.lang}
          onValueChange={(value) =>
            setUserInfo((prev) => ({ ...prev, lang: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tw">中文</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button asChild variant="secondary" size="lg">
        <Link
          to="/map"
          className="w-full"
          onClick={() => {
            mutateAsync({
              name: user?.realName || "",
              age: userInfo.age,
              lang: userInfo.lang,
              style: characters[imageIndex].name,
            });
          }}
        >
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
