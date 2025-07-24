import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Login from './Components/Login';
import DashBoard from './Components/DashBoard';
import Callback from './Components/Callback';
import Artist from './Components/ArtistDashboard';
import PrivateRoute from './Routes/PrivateRoute';
import PublicRoute from './Routes/PublicRoute'
import { PageNotFound } from './Components/PageNotFound';

const router = createBrowserRouter([
  {
    path: "/Login",
    element:
      <PublicRoute >
        <Login />
      </PublicRoute>

  },
  {
    path: "/",
    element:
      <PrivateRoute>
        <DashBoard />
      </PrivateRoute>
  },
  {
    path: '/Callback',
    element: <Callback />,
  },
  {
    path: "/artist/:id",
    element: <Artist />
  },
  {
    path: "/not-found",
    element: <PageNotFound />
  },
  {
    path: "*",
    element: <PageNotFound />
  }
]);

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
