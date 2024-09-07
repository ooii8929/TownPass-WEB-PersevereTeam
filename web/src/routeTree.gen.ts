/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const TestLazyImport = createFileRoute('/test')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const TestLazyRoute = TestLazyImport.update({
  path: '/test',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/test.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/test': {
      id: '/test'
      path: '/test'
      fullPath: '/test'
      preLoaderRoute: typeof TestLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/test': typeof TestLazyRoute
}

interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/test': typeof TestLazyRoute
}

interface FileRoutesById {
  '/': typeof IndexLazyRoute
  '/test': typeof TestLazyRoute
}

interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/test'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/test'
  id: '/' | '/test'
  fileRoutesById: FileRoutesById
}

interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  TestLazyRoute: typeof TestLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  TestLazyRoute: TestLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/test"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/test": {
      "filePath": "test.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
