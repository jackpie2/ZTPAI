import { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
	return (
		<>
			<Navbar />
			<h1>Vite + React</h1>
			<h1 className="text-3xl font-bold underline">Hello world!</h1>
			<div className="card">
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
