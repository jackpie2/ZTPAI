import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import Card from "./Card";
import Divider from "./Divider";
import { useState } from "react";

export default function Login({ type = "login" }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordsMatch, setPasswordsMatch] = useState(true);

	const signup = (email, password) => {
		fetch("http://127.0.0.1:8000/signup/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				password: password,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (!data.error) {
					window.location.href = "/login";
				}
			});
	};

	const login = (email, password) => {
		fetch("http://127.0.0.1:8000/signin/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				password: password,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if (!data.error) {
					localStorage.setItem("token", data.token);
					localStorage.setItem("refresh", data.refresh);
					window.location.href = "/";
				}
			});
	};

	const validateAndSignup = (email, password, confirmPassword) => {
		if (password !== confirmPassword) {
			setPasswordsMatch(false);
			return;
		}
		if (!email || !password || !confirmPassword) {
			return;
		}
		setPasswordsMatch(true);
		signup(email, password);
	};

	return (
		<div className="flex flex-col flex-grow justify-center">
			<Card className="w-1/2 mx-auto">
				<div className="flex flex-col gap-4 items-center">
					<div className="pt-4 flex gap-2 text-2xl items-center">
						<FontAwesomeIcon
							className="text-muted"
							icon={faMugHot}
						/>
						CoffeeDB
					</div>
					<Divider />
					<div className="pb-4 flex flex-col gap-2 text-lg">
						<div>
							<h2 className="font-mono">Email</h2>
							<input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							></input>
						</div>
						<div>
							<h2 className="font-mono">Password</h2>
							<input
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type="password"
								className={
									!passwordsMatch
										? "border-red-500"
										: undefined
								}
							></input>
						</div>
						{type === "signup" && (
							<div>
								<h2 className="font-mono">Confirm Password</h2>
								<input
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									className={
										!passwordsMatch
											? "border-red-500"
											: undefined
									}
									type="password"
								></input>
							</div>
						)}
						<div className="flex flex-col gap-2 mt-8">
							{type === "login" && (
								<button
									className="flex-grow text-md"
									onClick={() => login(email, password)}
								>
									Log In
								</button>
							)}
							<button
								className="flex-grow text-md"
								onClick={
									type === "login"
										? () =>
												(window.location.href =
													"/signup")
										: () =>
												validateAndSignup(
													email,
													password,
													confirmPassword
												)
								}
							>
								Sign Up
							</button>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
