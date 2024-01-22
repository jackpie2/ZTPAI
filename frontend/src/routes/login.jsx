import PropTypes from "prop-types";
import Login from "../components/Login";

export default function Root({ type = "login" }) {
	return <Login type={type} />;
}
