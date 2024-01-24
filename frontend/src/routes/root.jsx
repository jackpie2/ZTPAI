import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Bean, Flame, Loader2, Map, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../helpers/fetcher";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

function useCoffeeList(search, page) {
	console.log(search.length);
	const { data, error, isLoading } = useSWR(
		"http://localhost:8000/coffees/" +
			`?page=${page}` +
			(search.length > 0 ? `&search=${search}` : ""),
		fetcher
	);
	return {
		coffeeData: data,
		error,
		isLoading,
	};
}

export default function Root() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const { coffeeData, error, isLoading } = useCoffeeList(search, page);

	useEffect(() => {
		if (!isLoading) {
			setMaxPage(Math.ceil(coffeeData.count / 5));
		}
	}, [isLoading, coffeeData]);

	return (
		<div className="flex flex-col gap-4 w-full">
			<Card>
				<CardContent className="pt-6 w-full flex">
					<div className="flex grow w-full items-center space-x-2">
						<Input
							placeholder="Your search..."
							className="grow"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
				</CardContent>
			</Card>
			{isLoading ? (
				<div className="grow flex items-center justify-center">
					<Loader2
						className="animate-spin"
						size={48}
						absoluteStrokeWidth
					/>
				</div>
			) : coffeeData.results.length === 0 ? (
				<div className="flex items-center justify-center grow">
					<span className="text-xl font-mono text-accent-foreground">
						No results
					</span>
				</div>
			) : (
				<>
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
													<span>
														{coffee.species ?? "?"}
													</span>
												</div>
											</div>
											<div className="flex gap-2 flex-wrap items-center flex-grow">
												{coffee.flavors.map((tag) => (
													<Badge key={tag}>
														{tag}
													</Badge>
												))}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
					{maxPage > 1 && (
						<Pagination>
							<PaginationContent>
								{page > 1 && (
									<PaginationItem>
										<PaginationPrevious
											href="#"
											onClick={() => {
												if (page > 1) {
													setPage(page - 1);
												}
											}}
										/>
									</PaginationItem>
								)}
								{
									<>
										{page > 3 && <PaginationEllipsis />}
										{page > 1 && (
											<PaginationItem>
												<PaginationLink
													href="#"
													onClick={() => {
														setPage(page - 1);
													}}
												>
													{page - 1}
												</PaginationLink>
											</PaginationItem>
										)}
										<PaginationItem>
											<PaginationLink
												href="#"
												isActive
												onClick={() => {
													setPage(page);
												}}
											>
												{page}
											</PaginationLink>{" "}
										</PaginationItem>
										{page < maxPage && (
											<PaginationItem>
												<PaginationLink
													href="#"
													onClick={() => {
														setPage(page + 1);
													}}
												>
													{page + 1}
												</PaginationLink>
											</PaginationItem>
										)}
										{page < maxPage - 2 && (
											<PaginationEllipsis />
										)}
									</>
								}
								{page !== maxPage && (
									<PaginationItem>
										<PaginationNext
											href="#"
											onClick={() => {
												if (page < maxPage) {
													setPage(page + 1);
												}
											}}
										/>
									</PaginationItem>
								)}
							</PaginationContent>
						</Pagination>
					)}
				</>
			)}
		</div>
	);
}
