import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Input } from "../components/ui/input";

export default function Admin() {
	const [name, setName] = useState("");
	const [roast, setRoast] = useState("");
	const [origin, setOrigin] = useState("");
	const [species, setSpecies] = useState("");
	const [flavors, setFlavors] = useState("");

	const handleAddCoffee = () => {
		fetch("http://localhost:8000/add-coffee/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name,
				roast: roast,
				origin: origin,
				species: species.split(", "),
				flavors: flavors.split(", "),
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
				console.log(err);
			});
	};

	return (
		<div className="w-full">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Add coffee</CardTitle>
				</CardHeader>
				<Separator />
				<CardContent className="pt-6 space-y-2">
					<Input
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Select onValueChange={(value) => setRoast(value)}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Roast" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Roast level</SelectLabel>
								<SelectItem value="Light">Light</SelectItem>
								<SelectItem value="Medium">Medium</SelectItem>
								<SelectItem value="Dark">Dark</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Input
						placeholder="Origin"
						value={origin}
						onChange={(e) => setOrigin(e.target.value)}
					/>
					<Input
						placeholder="Species"
						value={species}
						onChange={(e) => setSpecies(e.target.value)}
					/>
					<Input
						placeholder="Flavors"
						value={flavors}
						onChange={(e) => setFlavors(e.target.value)}
					/>
					<Button
						onClick={() => {
							handleAddCoffee();
						}}
					>
						Add
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
