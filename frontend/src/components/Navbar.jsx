import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
	faArrowRightFromBracket,
	faArrowRightToBracket,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";
import { useNavigate } from "react-router-dom";
import { Menu, LogIn, UserRound } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";

export default function Navbar() {
	const navigate = useNavigate();

	return (
		<div className="shadow-sm border-b flex w-full justify-start items-center text-2xl p-3 gap-4">
			<NavigationMenu className={"w-full max-w-full justify-start"}>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link
							to="/"
							className="flex items-center gap-2 flex-grow font-bold"
						>
							<Coffee />
							CoffeeDB
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
				<div className="grow"></div>
				<NavigationMenuList>
					<NavigationMenuItem>
						<ModeToggle />
					</NavigationMenuItem>
					<Sheet>
						<SheetTrigger className="md:hidden w-9 h-9 flex items-center justify-center">
							<Menu />
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Navigation</SheetTitle>
							</SheetHeader>
							<div className="pt-6 flex flex-col gap-2">
								{localStorage.getItem("token") ? (
									<>
										<Button className="w-full">
											<Link to="/profile">
												<div className="text-xl flex items-center gap-2">
													<UserRound />
													<span>Profile</span>
												</div>
											</Link>
										</Button>
										<Button className="w-full">
											<Link
												onClick={() => {
													localStorage.removeItem(
														"token"
													);
													localStorage.removeItem(
														"refresh"
													);
													navigate("/");
												}}
											>
												<div className="text-xl flex items-center gap-2">
													<FontAwesomeIcon
														icon={
															faArrowRightFromBracket
														}
													/>
													Logout
												</div>
											</Link>
										</Button>
									</>
								) : (
									<Button className="w-full">
										<Link to="/login">
											<div className="text-xl flex items-center gap-2">
												<LogIn />
												Login
											</div>
										</Link>
									</Button>
								)}
							</div>
						</SheetContent>
					</Sheet>

					{localStorage.getItem("token") ? (
						<>
							<NavigationMenuItem className="md:block hidden">
								<Link to="/profile">
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
									>
										<div className="text-xl flex items-center gap-2">
											<FontAwesomeIcon icon={faUser} />
											Profile
										</div>
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem className="md:block hidden">
								<Link
									onClick={() => {
										localStorage.removeItem("token");
										localStorage.removeItem("refresh");
										navigate("/");
									}}
								>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
									>
										<div className="text-xl flex items-center gap-2">
											<FontAwesomeIcon
												icon={faArrowRightFromBracket}
											/>
											Logout
										</div>
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</>
					) : (
						<NavigationMenuItem className="md:block hidden">
							<Link to="/login">
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
								>
									<div className="text-xl flex items-center gap-2">
										<FontAwesomeIcon
											icon={faArrowRightToBracket}
										/>
										Login
									</div>
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					)}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
