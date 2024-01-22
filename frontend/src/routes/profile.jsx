import { jwtDecode } from "jwt-decode";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useSWR from "swr";
import { fetcher } from "../helpers/fetcher";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// function useUser(decodedToken) {
// 	if (!decodedToken) return { user: null, isLoading: true, error: null };

// 	const { data, error, isLoading } = useSWR(
// 		"http://localhost:8000/users/" + decodedToken.user_id,
// 		fetcher
// 	);

// 	return {
// 		user: data,
// 		isLoading: isLoading,
// 		error: error,
// 	};
// }

function refreshToken(setDecodedToken, navigate) {
	return fetch("http://localhost:8000/signin/refresh/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refresh: localStorage.getItem("refresh") }),
	})
		.then((res) => {
			if (!res.ok) {
				throw res;
			}
			return res;
		})
		.then((res) => res.json())
		.then((data) => {
			localStorage.setItem("token", data.token);
			localStorage.setItem("refresh", data.refresh);
			setDecodedToken(jwtDecode(data.token));
		})
		.catch((err) => {
			localStorage.removeItem("token");
			localStorage.removeItem("refresh");
			navigate("/login");
		});
}

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

		fetch("http://localhost:8000/users/" + decodedToken.user_id, {
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
					console.log(err);
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
							<h2 className="text-2xl font-mono">Email</h2>
							<p className="text-xl font-mono">{user.email}</p>
						</div>
					</div>
				</CardContent>
			</Card>
			{user.user_ratings.length > 0 ? (
				<Card className="w-full">
					<CardContent className="pt-6">
						<Table>
							<TableCaption>
								<h2 className="font-mono">Your rated coffee</h2>
							</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Rating</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{user.user_ratings.map((rating) => (
									<TableRow
										key={rating.coffee_name}
										className="hover:cursor-pointer"
										onClick={() =>
											navigate("/coffee/" + rating.coffee)
										}
									>
										<TableCell>
											{rating.coffee_name}
										</TableCell>
										<TableCell>{rating.rating}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			) : (
				<Card className="w-full">
					<CardContent className="pt-6">
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<h2 className="text-2xl font-mono">
									You haven&apos;t rated any coffee yet!
								</h2>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
