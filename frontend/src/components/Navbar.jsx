import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMugHot,
	faArrowRightToBracket,
	faArrowRightFromBracket,
	faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
	return (
		<div className="bg-overlay shadow-md border-b border-divider flex w-full justify-center items-center text-white font-mono text-3xl p-3">
			<a href="/" className="flex items-center gap-2 flex-grow">
				<FontAwesomeIcon className="text-muted" icon={faMugHot} />
				CoffeeDB
			</a>
			{localStorage.getItem("token") ? (
				<div className="flex gap-4">
					<a
						href="/profile"
						className="text-muted text-xl flex items-center gap-2"
					>
						<FontAwesomeIcon icon={faUser} />
						Profile
					</a>
					<a
						className="text-muted text-xl flex items-center gap-2"
						href="/"
						onClick={() => {
							localStorage.removeItem("token");
							localStorage.removeItem("refresh");
							window.location.href = "/";
						}}
					>
						<FontAwesomeIcon icon={faArrowRightFromBracket} />
						Logout
					</a>
				</div>
			) : (
				<a
					href="/login"
					className="text-muted text-xl flex items-center gap-2"
				>
					<FontAwesomeIcon icon={faArrowRightToBracket} />
					Login
				</a>
			)}
		</div>
	);
}
