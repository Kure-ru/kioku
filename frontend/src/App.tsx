import { Homepage } from './pages/Homepage.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DeckPage from "./pages/DeckPage.tsx";
import CardPage from "./pages/CardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import AddCardPage from "./pages/AddCardPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import Layout from './Components/AppLayout.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: 'deck/:id', element: <DeckPage /> },
      { path: 'deck/:id/new', element: <AddCardPage /> },
      { path: 'deck/:id/cards', element: <CardPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />

export default App;
