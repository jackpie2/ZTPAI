import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../helpers/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Star, Map, Bean, Flame, Coffee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "../helpers/refresh";
import { useNavigate } from "react-router-dom";
import { CardFooter } from "../components/ui/card";

function useCoffee(coffeeId) {
	const { data, error, isLoading } = useSWR(
		"http://localhost:8000/coffees/" + coffeeId,
		fetcher
	);
	return {
		coffeeData: data,
		error,
		isLoading,
	};
}

function Stars({ score, setStars, size }) {
	const handleStarClick = (i) => {
		if (i + 1 === score) {
			setStars(0);
		} else {
			setStars(i + 1);
		}
	};

	return (
		<div className="flex">
			{[...Array(5)].map((_, i) => (
				<Star
					key={i}
					className={
						i < score
							? "text-accent-foreground fill-accent-foreground"
							: "text-accent-foreground opacity-50"
					}
					onClick={() => handleStarClick(i)}
					size={size ?? 24}
				/>
			))}
		</div>
	);
}

function rate({ score, userId, coffeeId, navigate, setDecodedToken, comment }) {
	fetch("http://localhost:8000/rate/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
		body: JSON.stringify({
			coffee: coffeeId,
			rating: score,
			comment: comment,
		}),
	})
		.then((res) => {
			if (!res.ok) {
				throw res;
			}
			return res;
		})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
		})
		.catch((err) => {
			if (err.status === 401) {
				refreshToken(setDecodedToken, navigate);
			}
		});
}

export default function Root() {
	const [userScore, setUserScore] = useState(0);
	const [userComment, setUserComment] = useState("");
	const [userReviewLoading, setUserReviewLoading] = useState(true);
	const [allReviewsLoading, setAllReviewLoading] = useState(true);
	const [allReviews, setAllReviews] = useState([]);
	const [decodedToken, setDecodedToken] = useState(
		localStorage.getItem("token") !== "undefined"
			? localStorage.getItem("token")
				? jwtDecode(localStorage.getItem("token"))
				: null
			: null
	);
	const { coffeeId } = useParams();
	const { coffeeData, error, isLoading } = useCoffee(coffeeId);
	const navigate = useNavigate();

	const sendReview = () => {
		rate({
			score: userScore,
			userId: decodedToken ? decodedToken.user_id : null,
			coffeeId: coffeeId,
			navigate: navigate,
			setDecodedToken: setDecodedToken,
			comment: userComment,
		});
	};

	useEffect(() => {
		if (!decodedToken) {
			return;
		}
		fetch("http://localhost:8000/user-review/" + coffeeId, {
			method: "Get",
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
				setUserScore(data.rating);
				setUserComment(data.comment);
				setUserReviewLoading(false);
			})
			.catch((err) => {
				if (err.status === 401) {
					refreshToken(setDecodedToken, navigate);
				}
			});
	}, [coffeeId, navigate, decodedToken]);

	useEffect(() => {
		fetch("http://localhost:8000/all-reviews/" + coffeeId, {
			method: "Get",
			headers: {
				"Content-Type": "application/json",
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
				setAllReviews(data.results);
				setAllReviewLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [coffeeId]);

	if (isLoading || (decodedToken && userReviewLoading) || allReviewsLoading) {
		return (
			<div className="grow flex items-center justify-center">
				<Loader2
					className="animate-spin"
					size={48}
					absoluteStrokeWidth
				/>
			</div>
		);
	}

	return (
		<div className="grow flex flex-col items-center w-full gap-4">
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="flex justify-start items-center gap-4">
						{coffeeData.name}
					</CardTitle>
				</CardHeader>
				<Separator />
				<CardContent className="pt-6">
					<div className="flex gap-5 items-center">
						{coffeeData.image_url ? (
							<img
								src={
									"http://localhost:8000/" +
									coffeeData.image_url
								}
								width={128}
								height={128}
								className="rounded-md"
							/>
						) : (
							<div className="w-32 h-32 flex items-center justify-center text-muted-foreground border rounded-md">
								<Coffee size={48} />
							</div>
						)}
						<div className="text-lg flex-grow flex flex-col gap-2">
							<div className="grid md:grid-cols-2 grid-cols-1">
								<div className="flex items-center gap-2">
									<Star className="text-accent-foreground" />
									<span>{coffeeData.score}</span>
								</div>
								<div className="flex items-center gap-2">
									<Map className="text-accent-foreground" />
									<span>{coffeeData.origin}</span>
								</div>
								<div className="flex items-center gap-2">
									<Flame className="text-accent-foreground" />
									<span>{coffeeData.roast}</span>
								</div>
								<div className="flex items-center gap-2">
									<Bean className="text-accent-foreground" />
									<span>
										{coffeeData.species.join(", ") ?? "?"}
									</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter className="text-xs font-mono justify-center text-muted-foreground">
					<span>
						Added on{" "}
						{new Date(coffeeData.date_added).toLocaleDateString()}
					</span>
				</CardFooter>
			</Card>
			{coffeeData.description.length > 0 && (
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Description</CardTitle>
					</CardHeader>
					<Separator />
					<CardContent className="pt-6">
						{coffeeData.description}
					</CardContent>
				</Card>
			)}
			{coffeeData.flavors.length > 0 && (
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Flavors</CardTitle>
					</CardHeader>
					<Separator />
					<CardContent className="pt-6 flex flex-wrap gap-2">
						{coffeeData.flavors.map((tag) => (
							<Badge key={tag}>{tag}</Badge>
						))}
					</CardContent>
				</Card>
			)}
			{decodedToken && (
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Your review</CardTitle>
					</CardHeader>
					<Separator />
					<CardContent className="pt-6 flex flex-col gap-2">
						<Textarea
							placeholder="Type your review here."
							value={userComment}
							onChange={(e) => setUserComment(e.target.value)}
						/>
						<div className="flex items-center">
							<div className="flex">
								<Stars
									score={userScore}
									setStars={setUserScore}
								/>
							</div>
							<div className="flex-grow"></div>
							<div>
								<Button
									onClick={() => {
										sendReview();
									}}
								>
									Save
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			<Card className="w-full">
				<CardHeader>
					<CardTitle>All reviews</CardTitle>
				</CardHeader>
				<Separator />
				{allReviews && allReviews.length > 0 ? (
					<CardContent
						className="pt-6 flex flex-col gap-2
					"
					>
						{allReviews.map((review) => (
							<>
								<div
									className="flex flex-col gap-2"
									key={review.user_name}
								>
									<div className="text-sm text-wrap break-words">
										{review.comment}
									</div>
									<div className="flex gap-4">
										<Stars
											score={review.rating}
											size={16}
										/>
										<div className="flex-grow"></div>
										<div className="text-xs">
											@{review.user_name}
										</div>
									</div>
								</div>
								<Separator />
							</>
						))}
					</CardContent>
				) : (
					<CardContent className="pt-6 flex flex-col gap-2">
						<div className="text-sm text-accent-foreground">
							No reviews yet.
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
