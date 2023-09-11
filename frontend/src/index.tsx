import { render } from 'preact';
import Router from 'preact-router';
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
import {SignOut} from "./pages/Auth/SignOut";


export function App() {
	useTitleTemplate('%s - Helth');

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
						<NotFound default />
					</Router>
				</main>
			</AuthProvider>
	);
}

render(<App />, document.getElementById('app'));
