import { Button } from "@/components/ui/button";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/map")({
  component: StartPage,
});

function StartPage() {
  return (
    <div className='relative h-screen bg-cover [background-image:url("https://imgur.com/ganQHp8.png")]'>
      <Button asChild size="sm" className="absolute left-[150px] top-[470px]">
        <Link to="/map">大稻埕</Link>
      </Button>
    </div>
  );
}
