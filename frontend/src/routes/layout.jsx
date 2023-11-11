import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
	return (
		<div className="min-h-screen flex flex-col gap-4 items-center">
			<Navbar />
			<div className="flex-grow flex justify-center md:w-[768px] w-[97%]">
				<Outlet />
			</div>
		</div>
	);
}
