import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { jwtDecode } from "jwt-decode";
import { Loader2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { refreshToken } from "../helpers/refresh";
import { Button } from "../components/ui/button";

export default function Profile() {
	const [decodedToken, setDecodedToken] = useState(
		!localStorage.getItem("token") ||
			localStorage.getItem("token") !== "undefined"
			? jwtDecode(localStorage.getItem("token"))
			: null
	);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!decodedToken) {
			localStorage.removeItem("token");
			localStorage.removeItem("refresh");
			navigate("/login");
			return;
		}

		fetch("http://localhost:8000/user/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw res;
				}
				return res;
			})
			.then((res) => res.json())
			.then((data) => {
				setUser(data);
				console.log(data);
			})
			.catch((err) => {
				if (err.status === 401) {
					refreshToken(setDecodedToken, navigate);
				} else {
					localStorage.removeItem("token");
					localStorage.removeItem("refresh");
					navigate("/login");
				}
			});
	}, [decodedToken, navigate]);

	if (!user)
		return (
			<div className="grow flex items-center justify-center">
				<Loader2
					className="animate-spin"
					size={48}
					absoluteStrokeWidth
				/>
			</div>
		);

	return (
		<div className="grow flex flex-col gap-4 items-center w-full">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Profile</CardTitle>
				</CardHeader>
				<Separator />
				<CardContent className="pt-6">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label className="text-xl font-bold">Email</Label>
							<p className="text-xl font-mono">{user.email}</p>
						</div>
						<div className="flex flex-col gap-2">
							<Label className="text-xl font-bold">
								Username
							</Label>
							<p className="text-xl font-mono">{user.username}</p>
						</div>
					</div>
				</CardContent>
			</Card>
			{decodedToken.admin && (
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Add coffee</CardTitle>
					</CardHeader>
					<Separator />
					<CardContent className="pt-6">
						<Button className="w-full">
							<Link to="/admin">Coffee submission panel</Link>
						</Button>
					</CardContent>
				</Card>
			)}
			{user.user_ratings.length > 0 ? (
				<Card className="w-full">
					<CardContent className="pt-6">
						<Table>
							<TableCaption>
								<h2 className="font-mono">Your reviews</h2>
							</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Score</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{user.user_ratings.map((rating) => (
									<TableRow
										key={rating.coffee_name}
										className="hover:cursor-pointer text-lg"
										onClick={() =>
											navigate("/coffee/" + rating.coffee)
										}
									>
										<TableCell>
											{rating.coffee_name}
										</TableCell>
										<TableCell className="flex items-center gap-2">
											<span>{rating.rating}</span>
											<Star
												className="text-accent-foreground"
												size={16}
												fill="currentColor"
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			) : (
				<Card className="w-full">
					<CardContent className="pt-6">
						<div className="flex flex-col gap-4 text-center text-accent-foreground">
							<span>You haven't rated anything yet.</span>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
