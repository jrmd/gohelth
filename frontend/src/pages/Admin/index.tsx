import Router, {route} from 'preact-router';
import {useAuth} from "../../helpers";
import { Dashboard } from "./Pages/Dashboard";
import { Categories } from "./Pages/Categories";
import { Exercises } from "./Pages/Exercises";

const Test = () => {
    return <p>Test</p>
}


export const Admin = () => {
    const {user, isLoading} = useAuth();

    if (!user && isLoading) {
        return <p>Loading...</p>
    }

    if (user.userLevel !== "ADMIN") {
        route("/unauthorized")
        return null;
    }

    return (
        <Router>
            <Dashboard path="/admin" />
            <Categories path="/admin/categories" />
            <Exercises path="/admin/exercises" />
        </Router>
    )
}