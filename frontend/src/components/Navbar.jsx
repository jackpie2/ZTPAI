import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
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

export default function Navbar() {
	return (
		<div className="shadow-sm border-b flex w-full justify-start items-center font-mono text-3xl p-3 gap-4">
			<NavigationMenu className={"w-full max-w-full justify-start"}>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link
							to="/"
							className="flex items-center gap-2 flex-grow"
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

					{localStorage.getItem("token") ? (
						<>
							<NavigationMenuItem>
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
							<NavigationMenuItem>
								<Link
									to="/"
									onClick={() => {
										localStorage.removeItem("token");
										localStorage.removeItem("refresh");
										window.location.href = "/";
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
						<NavigationMenuItem>
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
