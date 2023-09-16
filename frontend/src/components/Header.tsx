import { useAuth } from '../helpers'

export function Header() {
	const {user} = useAuth();

	if (['/auth/sign-in', '/auth/sign-up'].includes(location.pathname)) {
		return null;
	}

	return (
		// <header>
		// 	{user ? user.email : null}
		// 	<nav>
		// 		<a href="/" class={url == '/' && 'active'}>
		// 			Home
		// 		</a>
		// 	</nav>
		// </header>


	<header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
		<div className="container flex h-14 items-center">
			<div className="mr-4 hidden md:flex">
				<a href="/" className="mr-6 flex items-center space-x-2">
					<img
						width={24}
						height={24}
						src="/assets/logo.svg"
						className="h-6 w-6"
						alt="Helth.lol logo, a mixture of dark greens in a wavy pattern with the letter H in the middle"
					/>
					<span className="hidden font-bold sm:inline-block">Helth.lol</span>
				</a>
				{user ? <a href="/auth/sign-out" data-native>Sign Out</a> : <><a href="/auth/sign-in">Sign In</a><a href="/auth/sign-up">Sign Up</a></>}

				{/*<NavigationDropdown />*/}
			</div>
			<div className="flex flex-1 items-center justify-end space-x-2">
				<nav className="flex items-center">

				</nav>
			</div>
		</div>
	</header>
	);
}
