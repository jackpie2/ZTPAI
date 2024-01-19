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

	if (isLoading) {
		return (
			<div className="py-5 flex flex-col items-center">
				<div className="md:w-[768px] w-[97%] flex flex-col gap-4">
					<Card>
						<div className="p-3 flex justify-center text-xl">
							Loading...
						</div>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="md:w-[768px] w-[97%] flex flex-col gap-4">
			{coffeeData.results.map((coffee) => (
				<Link to={`/coffee/${coffee.id}`} key={coffee.name}>
					<Card>
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
											<FontAwesomeIcon
												icon={faStar}
												className="text-accent-foreground"
											/>
											<span>4.5</span>
										</div>
										<div className="flex items-center gap-2">
											<FontAwesomeIcon
												icon={faEarth}
												className="text-accent-foreground"
											/>
											<span>{coffee.origin}</span>
										</div>
										<div className="flex items-center gap-2">
											<FontAwesomeIcon
												icon={faFire}
												className="text-accent-foreground"
											/>
											<span>{coffee.roast}</span>
										</div>
										<div className="flex items-center gap-2">
											<FontAwesomeIcon
												icon={faSeedling}
												className="text-accent-foreground"
											/>
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
