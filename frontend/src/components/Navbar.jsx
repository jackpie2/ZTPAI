import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
	return (
		<div className="bg-overlay shadow-md border-b border-divider flex w-full justify-center items-center text-white font-mono text-3xl p-3">
			<a href="/" className="flex items-center gap-2 flex-grow">
				<FontAwesomeIcon className="text-muted" icon={faMugHot} />
				CoffeeDB
			</a>
			<a href="/login" className="text-muted text-2xl">
				Login
			</a>
		</div>
	);
}
