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
import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle } from "lucide-react";

export default function Admin() {
	const [name, setName] = useState("");
	const [roast, setRoast] = useState("");
	const [origin, setOrigin] = useState("");
	const [species, setSpecies] = useState("");
	const [flavors, setFlavors] = useState("");
	const [desc, setDesc] = useState("");
	const [image, setImage] = useState(null);

	const { toast } = useToast();

	const alert = (text) => {
		toast({
			title: (
				<div className="flex gap-2 items-center">
					<AlertTriangle className="text-accent-foreground" />
					<span>{text}</span>
				</div>
			),
		});
	};

	const sendImage = (coffee_id) => {
		const formData = new FormData();
		formData.append("image", image);
		fetch(`http://localhost:8000/add-coffee-image/${coffee_id}/`, {
			method: "POST",
			body: formData,
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
				species: species.length > 0 ? species.split(", ") : [],
				flavors: flavors.length > 0 ? flavors.split(", ") : [],
				description: desc,
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
				alert("Coffee added!");
				if (image) {
					sendImage(data.id);
				}
			})
			.catch((err) => {
				console.log(err);
				alert(err.statusText);
			});
	};

	useEffect(() => {
		console.log(image);
	}, [image]);

	return (
		<div className="w-full flex flex-col grow items-center">
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
						<SelectTrigger>
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
					<Select onValueChange={(value) => setSpecies(value)}>
						<SelectTrigger>
							<SelectValue placeholder="Species" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Species</SelectLabel>
								<SelectItem value="Arabica">Arabica</SelectItem>
								<SelectItem value="Robusta">Robusta</SelectItem>
								<SelectItem value="Robusta, Arabica">
									Robusta, Arabica
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Input
						placeholder="Flavors, separated by commas"
						value={flavors}
						onChange={(e) => setFlavors(e.target.value)}
					/>
					<Input
						id="picture"
						type="file"
						onChange={(e) => setImage(e.target.files[0])}
					/>
					<Textarea
						placeholder="Description"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
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
