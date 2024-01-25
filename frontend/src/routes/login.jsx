import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Coffee } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "../components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle } from "lucide-react";

export default function Login({ type = "login" }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordsMatch, setPasswordsMatch] = useState(true);
	const [username, setUsername] = useState("");
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
				username: username,
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

	const alert = (text) => {
		toast({
			title: (
				<div className="flex gap-2 items-center">
					<AlertTriangle className="text-accent-foreground" />
					<span>{text}</span>
				</div>
			),
		});
	};

	const validateAndSignup = (email, password, confirmPassword) => {
		if (password !== confirmPassword) {
			alert("Passwords don't match");
			return;
		}
		if (!email || !password || !confirmPassword) {
			alert("Please fill in all fields.");
			return;
		}
		if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			alert("Please enter a valid email address.");
			return;
		}
		signup(email, password);
	};

	const validateAndLogin = (email, password) => {
		if (!email || !password) {
			alert("Please fill in all fields.");
			return;
		}
		if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			alert("Please enter a valid email address.");
			return;
		}
		login(email, password);
	};

	const { toast } = useToast();

	return (
		<div className="flex flex-col flex-grow justify-center max-w-lg">
			<Card>
				<CardHeader>
					<CardTitle>
						<div className="flex text-2xl font-bold gap-2 justify-center items-center">
							<Coffee />
							<span>CoffeeDB</span>
						</div>
					</CardTitle>
				</CardHeader>
				<Separator />
				<CardContent className="pt-6">
					<div className="flex flex-col gap-4 items-center">
						<div className="pb-4 flex flex-col gap-2 text-lg">
							<div>
								<Label className="font-bold text-lg">
									Email
								</Label>
								<Input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									type="email"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											validateAndLogin(email, password);
										}
									}}
								/>
							</div>
							{type === "signup" && (
								<div>
									<Label className="font-bold text-lg">
										Username
									</Label>
									<Input
										value={username}
										onChange={(e) =>
											setUsername(e.target.value)
										}
									/>
								</div>
							)}
							<div>
								<Label className="font-bold text-lg">
									Password
								</Label>
								<Input
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									type="password"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											validateAndLogin(email, password);
										}
									}}
								/>
							</div>
							{type === "signup" && (
								<>
									<div>
										<Label className="font-bold text-lg">
											Confirm password
										</Label>
										<Input
											value={confirmPassword}
											onChange={(e) =>
												setConfirmPassword(
													e.target.value
												)
											}
											type="password"
										/>
									</div>
								</>
							)}
							<div className="flex flex-col gap-2 mt-8">
								{type === "login" && (
									<Button
										className="flex-grow text-md"
										onClick={() =>
											validateAndLogin(email, password)
										}
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
