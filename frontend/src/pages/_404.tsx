import { useTitle } from 'hoofd';

export function NotFound() {
	useTitle('Not Found');
	return (
		<section>
			<h1>404: Not Found</h1>
			<p>It's gone :(</p>
		</section>
	);
}
