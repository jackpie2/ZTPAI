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
import { useEffect, useState } from "react";

export default function List() {
	const [coffeeData, setCoffeeData] = useState([]);

	useEffect(() => {
		fetch("http://localhost:8000/coffees", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => setCoffeeData(data.results));
	}, []);

	console.log(coffeeData);

	return (
		<div className="py-5 flex flex-col items-center">
			<div className="md:w-[768px] w-[97%] flex flex-col gap-4">
				{coffeeData.map((coffee) => (
					<Card key={coffee.name}>
						<div className="p-3 flex justify-center text-xl">
							Nazwa kawy
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
								{/* <div className="flex gap-2 flex-wrap items-center flex-grow">
									{coffee.tags.map((tag) => (
										<Tag key={tag}>{tag}</Tag>
									))}
								</div> */}
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
