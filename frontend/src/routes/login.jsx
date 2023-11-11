import Navbar from "../components/Navbar";
import Login from "../components/Login";

export default function Root() {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <Navbar />
            <Login />
        </div>
    );
}
