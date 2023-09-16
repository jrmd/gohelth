import { render } from 'preact';
import Router from 'preact-router';
import { useEffect } from 'preact/hooks';
import { useTitleTemplate } from 'hoofd';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home';
import { NotFound } from './pages/_404.jsx';
import './style.css';
import {ActivateError} from "./pages/Auth/ActivateError";
import {ActivateEmail} from "./pages/Auth/ActivateEmail";
import {AuthProvider} from "./helpers";
import {SignIn} from "./pages/Auth/SignIn";
import {SignUp} from "./pages/Auth/SignUp";
import {Admin} from "./pages/Admin";
import {SignOut} from "./pages/Auth/SignOut";


export function App() {
	useTitleTemplate('%s - Helth');

	useEffect(() => {
		const checkCurrentPreferredTheme = (e) => {
			if (localStorage.theme === 'system') {
				if (e.matches) {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
			}
		};

		let theme = localStorage.theme ?? 'system'

		if (window.matchMedia('(prefers-color-scheme: dark)').matches && theme === 'system') {
			theme = 'dark';
		} else if (theme == 'system') {
			theme = 'light';
		}

		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkCurrentPreferredTheme);

		return () => {
			window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', checkCurrentPreferredTheme);
		}
	}, []);

	return (
			<AuthProvider>
				<Header />
				<main>
					<Router>
						<Home path="/" />
						<SignIn path="/auth/sign-in" />
						<SignUp path="/auth/sign-up" />
						<ActivateError path="/auth/activate/error" />
						<ActivateEmail path="/auth/activate/success" />
						<Admin path="/admin/:rest?" />
						<NotFound default />
					</Router>
				</main>
			</AuthProvider>
	);
}

render(<App />, document.getElementById('app'));
