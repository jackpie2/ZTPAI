import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
// import Card from "./Card";
import Divider from "./Divider";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Coffee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Login({ type = "login" }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordsMatch, setPasswordsMatch] = useState(true);
	const navigate = useNavigate();

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
					navigate("/login");
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
					navigate("/");
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
				<CardHeader>
					<CardTitle>
						<div className="flex text-lg gap-2 justify-center items-center">
							<Coffee />
							CoffeeDB
						</div>
					</CardTitle>
				</CardHeader>
				<Separator />
				<CardContent className="pt-6">
					<div className="flex flex-col gap-4 items-center">
						<div className="pb-4 flex flex-col gap-2 text-lg">
							<div>
								<h2 className="font-mono">Email</h2>
								<Input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div>
								<h2 className="font-mono">Password</h2>
								<Input
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									type="password"
									className={
										!passwordsMatch
											? "border-red-500"
											: undefined
									}
								/>
							</div>
							{type === "signup" && (
								<div>
									<h2 className="font-mono">
										Confirm Password
									</h2>
									<Input
										value={confirmPassword}
										onChange={(e) =>
											setConfirmPassword(e.target.value)
										}
										type="password"
										className={
											!passwordsMatch
												? "border-red-500"
												: undefined
										}
									/>
								</div>
							)}
							<div className="flex flex-col gap-2 mt-8">
								{type === "login" && (
									<Button
										className="flex-grow text-md"
										onClick={() => login(email, password)}
									>
										Log In
									</Button>
								)}
								<Button
									className="flex-grow text-md"
									onClick={
										type === "login"
											? () => navigate("/signup")
											: () =>
													validateAndSignup(
														email,
														password,
														confirmPassword
													)
									}
								>
									Sign Up
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
