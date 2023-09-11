import './style.css';

import { useTitle } from "hoofd";

export function Home() {
	useTitle('Home');

	return (
		<div>
			<p>Hello from preact!</p>
		</div>
	);
}
