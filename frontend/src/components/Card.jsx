export default function Card({ children }) {
	return (
		<div className="bg-overlay shadow-md rounded-md border border-divider">
			{children}
		</div>
	);
}
