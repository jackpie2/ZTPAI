import { useParams } from "react-router-dom";
import Card from "../components/Card";

export default function Coffee() {
    let { coffeeId} = useParams();
	return (
        <div>
            <Card>
                <div className="p-3 flex justify-center text-xl">
                    Coffee {coffeeId}
                </div>
            </Card>
        </div>
    );
}