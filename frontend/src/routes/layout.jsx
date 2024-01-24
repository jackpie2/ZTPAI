import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
	return (
		<div className="min-h-screen flex flex-col gap-4 items-center">
			<Navbar />
			<div className="flex-grow flex justify-center max-w-3xl w-full px-1 pb-10">
				<Outlet />
			</div>
		</div>
	);
}
