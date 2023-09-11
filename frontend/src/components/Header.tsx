import { useLocation } from 'preact-iso';
import { useAuth } from '../helpers'

export function Header() {
	const { url } = useLocation();
	const {user} = useAuth();

	return (
		<header>
			{user ? user.email : null}
			<nav>
				<a href="/" class={url == '/' && 'active'}>
					Home
				</a>
				{user ? <a href="/auth/sign-out" data-native>Sign Out</a> : <><a href="/auth/sign-in">Sign In</a><a href="/auth/sign-up">Sign Up</a></>}
			</nav>
		</header>
	);
}
