import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/test")({
  component: TestPage,
});

function TestPage() {
  return "test";
}
