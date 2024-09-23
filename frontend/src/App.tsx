import { Anchor, AppShell, Flex, Title } from "@mantine/core"
import { Homepage } from './pages/Homepage.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DeckPage from "./pages/DeckPage.tsx";
import CardPage from "./pages/CardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import AddCardPage from "./pages/AddCardPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />
  },
  {
    path: "/deck/:id",
    element: <DeckPage />,
  },
  {
    path: "/deck/:id/new",
    element: <AddCardPage />
  },
  {
    path: "/deck/:id/cards",
    element: <CardPage />,
  },
  {
    path: "/login",
    element: <LoginPage />
  },
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
