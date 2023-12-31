import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMugHot,
	faArrowRightToBracket,
	faArrowRightFromBracket,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<div className="bg-overlay shadow-md border-b border-divider flex w-full justify-center items-center text-white font-mono text-3xl p-3">
			<Link to="/" className="flex items-center gap-2 flex-grow">
				<FontAwesomeIcon className="text-muted" icon={faMugHot} />
				CoffeeDB
			</Link>
			{localStorage.getItem("token") ? (
				<div className="flex gap-4">
					<Link
						to="/profile"
						className="text-muted text-xl flex items-center gap-2"
					>
						<FontAwesomeIcon icon={faUser} />
						Profile
					</Link>
					<Link
						className="text-muted text-xl flex items-center gap-2"
						to="/"
						onClick={() => {
							localStorage.removeItem("token");
							localStorage.removeItem("refresh");
							window.location.href = "/";
						}}
					>
						<FontAwesomeIcon icon={faArrowRightFromBracket} />
						Logout
					</Link>
				</div>
			) : (
				<Link
					href="/login"
					className="text-muted text-xl flex items-center gap-2"
				>
					<FontAwesomeIcon icon={faArrowRightToBracket} />
					Login
				</Link>
			)}
		</div>
	);
}
