import { Anchor, AppShell, Button, Flex, Title } from "@mantine/core"
import { Homepage } from './pages/Homepage.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DeckPage from "./pages/DeckPage.tsx";
import CardPage from "./pages/CardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import AddCardPage from "./pages/AddCardPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";

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
    path: "new",
    element: <AddCardPage />
  },
  {
    path: "cards",
    element: <CardPage />,
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  },
])

function App() {

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Flex gap={30} align="center">
          <Anchor href="/"><Title order={1}>kioku</Title></Anchor>
          <Button>logout</Button>
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
