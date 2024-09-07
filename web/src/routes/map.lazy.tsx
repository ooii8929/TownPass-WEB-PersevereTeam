import { Button } from "@/components/ui/button";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/map")({
  component: StartPage,
});

function StartPage() {
  const [click, setClick] = useState(false);

  return click ? (
    <div
      className='animate-fade relative h-screen bg-cover [background-image:url("https://imgur.com/uSR5cVr.png")]'
      onClick={() => setClick(false)}
    >
      <Button asChild className="absolute left-[250px] top-[390px]">
        <Link to="/places/$pid" params={{ pid: "123" }}>
          迪化街
        </Link>
      </Button>
    </div>
  ) : (
    <div className='animate-fade relative h-screen bg-cover [background-image:url("https://imgur.com/ganQHp8.png")]'>
      <Button
        className="absolute left-[150px] top-[470px]"
        onClick={() => setClick(true)}
      >
        大稻埕
      </Button>
    </div>
  );
}
