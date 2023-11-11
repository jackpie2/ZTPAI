export default function Card({ className = "", children }) {
	return (
		<div
			className={
				"bg-overlay shadow-md rounded-md border border-divider " +
				className
			}
		>
			{children}
		</div>
	);
}
