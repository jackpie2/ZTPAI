import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Card from "./Card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	faEarth,
	faFire,
	faSeedling,
	faStar,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../helpers/fetcher";
import { Loader2 } from "lucide-react";
import { Star, Map, Bean, Flame } from "lucide-react";

function useCoffeeList() {
	const { data, error, isLoading } = useSWR(
		"http://localhost:8000/coffees",
		fetcher
	);
	return {
		coffeeData: data,
		error,
		isLoading,
	};
}

export default function List() {
	const { coffeeData, error, isLoading } = useCoffeeList();

	console.log(coffeeData);

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
		<div className="flex flex-col gap-4 w-full">
			{coffeeData.results.map((coffee) => (
				<Link
					to={`/coffee/${coffee.id}`}
					key={coffee.name}
					className="w-full"
				>
					<Card className="w-full">
						<CardHeader>
							<CardTitle>{coffee.name}</CardTitle>
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
											<span>{coffee.score}</span>
										</div>
										<div className="flex items-center gap-2">
											<Map className="text-accent-foreground" />
											<span>{coffee.origin}</span>
										</div>
										<div className="flex items-center gap-2">
											<Flame className="text-accent-foreground" />
											<span>{coffee.roast}</span>
										</div>
										<div className="flex items-center gap-2">
											<Bean className="text-accent-foreground" />
											<span>{coffee.species ?? "?"}</span>
										</div>
									</div>
									<div className="flex gap-2 flex-wrap items-center flex-grow">
										{coffee.flavors.map((tag) => (
											<Badge key={tag}>{tag}</Badge>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	);
}
