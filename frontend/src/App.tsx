import { Anchor, AppShell, Flex, Title } from "@mantine/core"
import { Homepage } from './pages/Homepage.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DeckPage from "./pages/DeckPage.tsx";
import CardPage from "./pages/CardPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />
  },
  {
    path: "/decks/:id",
    element: <DeckPage />
  },
  {
    path: "/cards",
    element: <CardPage />
  }
])

function App() {

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Flex gap={30} align="center">
          <Anchor href="/"><Title order={1}>kioku</Title></Anchor>
          <Anchor href="/decks">decks</Anchor>
        </Flex>
      </AppShell.Header>
      <AppShell.Main>
        <RouterProvider router={router} />
      </AppShell.Main>
      <AppShell.Footer>
        kioku
      </AppShell.Footer>
    </AppShell>
  )
}

export default App
