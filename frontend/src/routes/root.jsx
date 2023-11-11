import Navbar from "../components/Navbar";
import List from "../components/List";

export default function Root() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<List />
		</div>
	);
}
