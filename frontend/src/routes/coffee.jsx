import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../helpers/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Star, Map, Bean, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

export default function Coffee() {
	let { coffeeId } = useParams();
	const { coffeeData, error, isLoading } = useCoffee(coffeeId);

	if (isLoading) {
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
		<div className="grow flex flex-col items-center w-full">
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="flex justify-start items-center gap-4">
						{coffeeData.name}
					</CardTitle>
				</CardHeader>
				<Separator />
				<CardContent className="pt-6">
					<div className="flex gap-5 items-center">
						<img
							src="/coffee.jpg"
							width={128}
							height={128}
							className="rounded-md"
						/>
						<div className="text-lg flex-grow flex flex-col gap-2">
							<div className="grid grid-cols-2">
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
									<span>{coffeeData.species ?? "?"}</span>
								</div>
							</div>
							<div className="flex gap-2 flex-wrap items-center flex-grow">
								{coffeeData.flavors.map((tag) => (
									<Badge key={tag}>{tag}</Badge>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
