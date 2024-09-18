import { AppShell, Title } from "@mantine/core"
import { Homepage } from './pages/Homepage.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />
  }
])

function App() {

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Title order={1}>kioku</Title>
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
