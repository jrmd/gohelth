import Router, {route} from 'preact-router';
import {useAuth} from "../../helpers";

const Test = () => {
    return <p>Test</p>
}

const Dashboard = () => {
    return <p>Dashboard</p>
}

export const Admin = () => {
    const {user, isLoading} = useAuth();

    if (isLoading) {
        return <p>Loading...</p>
    }

    console.log(1, user);

    if (user.userLevel !== "ADMIN") {
        route("/unauthorized")
        return null;
    }

    return (
        <Router>
            <Dashboard path="/admin" />
            <Test path="/admin/test" />
        </Router>
    )
}