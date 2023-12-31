import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Root from "./routes/root.jsx";
import Login from "./routes/login.jsx";
import Layout from "./routes/layout.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Profile from "./routes/profile.jsx";
import Coffee from "./routes/coffee.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Root />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/signup",
				element: <Login type="signup" />,
			},
			{
				path: "/profile",
				element: <Profile />,
			},
			{
				path: "/coffee/:coffeeId",
				element: <Coffee />,
			}
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
