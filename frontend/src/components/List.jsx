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

export default function List() {
	return (
		<div className="py-5 flex flex-col items-center">
			<div className="md:w-[768px] w-[97%]">
				<Card>
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
									<span>Blend</span>
								</div>
								<div className="flex items-center gap-2">
									<FontAwesomeIcon
										icon={faFire}
										className="text-muted"
									/>
									<span>Medium</span>
								</div>
								<div className="flex items-center gap-2">
									<FontAwesomeIcon
										icon={faSeedling}
										className="text-muted"
									/>
									<span>Arabica</span>
								</div>
							</div>
							<div className="flex gap-2 flex-wrap items-center flex-grow">
								<Tag>Tag 1</Tag>
								<Tag>Tag 1</Tag>
								<Tag>Tag 1</Tag>
								<Tag>Tag 1</Tag>
								<Tag>Tag 1</Tag>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
