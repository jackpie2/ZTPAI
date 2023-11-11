import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
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
    return (
        <div className="py-5 flex flex-col items-center flex-grow justify-center">
            <Card>
                <div className="flex flex-col gap-4 items-center md:w-[768px] w-[97%]">
                    <div>
                        <FontAwesomeIcon className="text-muted" icon={faMugHot} />
                        CoffeeDB
                    </div></div>
            </Card>
        </div>
    );
}
