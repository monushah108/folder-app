import { createBrowserRouter, RouterProvider } from "react-router-dom"; // ✅ import router stuff
import Register from "./pages/register.jsx";
import Login from "./pages/Login.jsx";
import DirectoryView from "./directoryView.jsx";
import "./App.css";
import PasswordForm from "./pages/PasswordForm.jsx";
import privateRoutes from "./admin/routes/privateRoutes.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />,
    children: [
      {
        path: "/dirItem/:id",
        element: <DirectoryView />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/login/password",
    element: <PasswordForm />,
  },
  privateRoutes(),
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
