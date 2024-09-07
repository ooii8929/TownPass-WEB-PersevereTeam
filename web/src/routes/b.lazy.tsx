import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/b')({
  component: () => <div>Hello /map!</div>
})