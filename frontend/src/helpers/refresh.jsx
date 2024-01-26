import { jwtDecode } from "jwt-decode";

export function refreshToken(setDecodedToken, navigate) {
	fetch("http://localhost:8000/signin/refresh/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refresh: localStorage.getItem("refresh") }),
	})
		.then((res) => {
			if (!res.ok) {
				throw res;
			}
			return res;
		})
		.then((res) => res.json())
		.then((data) => {
			localStorage.setItem("token", data.token);
			localStorage.setItem("refresh", data.refresh);
			setDecodedToken(jwtDecode(data.token));
			return true;
		})
		.catch((err) => {
			localStorage.removeItem("token");
			localStorage.removeItem("refresh");
			navigate("/login");
		});
}
