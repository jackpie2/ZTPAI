import { jwtDecode } from "jwt-decode";

export default function Profile() {
	console.log(jwtDecode(localStorage.getItem("token")));

	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-4xl font-mono">Profile</h1>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-mono">Token</h2>
					<p className="text-xl font-mono">
						{localStorage.getItem("token")}
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-mono">Refresh</h2>
					<p className="text-xl font-mono">
						{localStorage.getItem("refresh")}
					</p>
				</div>
			</div>
		</div>
	);
}
