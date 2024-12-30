import { RouterProvider, createBrowserRouter } from "react-router";

import Root from "@/pages/Root";
import ErrorPage from "@/pages/Error";
import HomePage from "@/pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, path: "", element: <HomePage /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
