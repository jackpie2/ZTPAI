import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "./Card";
import Divider from "./Divider";
import {
	faEarth,
	faFire,
	faSeedling,
	faStar,
} from "@fortawesome/free-solid-svg-icons";
import Tag from "./Tag";
import { fetcher } from "../helpers/fetcher";
import useSWR from "swr";

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
		<div className="py-5 flex flex-col items-center">
			<div className="md:w-[768px] w-[97%] flex flex-col gap-4">
				{coffeeData.results.map((coffee) => (
					<Card key={coffee.name}>
						<div className="p-3 flex justify-center text-xl">
							{coffee.name}
						</div>
						<Divider />
						<div className="flex p-5 gap-5 items-center">
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
											className="text-muted"
										/>
										<span>4.5</span>
									</div>
									<div className="flex items-center gap-2">
										<FontAwesomeIcon
											icon={faEarth}
											className="text-muted"
										/>
										<span>{coffee.origin}</span>
									</div>
									<div className="flex items-center gap-2">
										<FontAwesomeIcon
											icon={faFire}
											className="text-muted"
										/>
										<span>{coffee.roast}</span>
									</div>
									<div className="flex items-center gap-2">
										<FontAwesomeIcon
											icon={faSeedling}
											className="text-muted"
										/>
										<span>{coffee.species ?? "?"}</span>
									</div>
								</div>
								<div className="flex gap-2 flex-wrap items-center flex-grow">
									{coffee.flavors.map((tag) => (
										<Tag key={tag}>{tag}</Tag>
									))}
								</div>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
