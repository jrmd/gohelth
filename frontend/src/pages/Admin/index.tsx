import Router, {route} from 'preact-router';
import {useAuth} from "../../helpers";
import { Dashboard } from "./Pages/Dashboard";
import { Categories } from "./Pages/Categories";
import { Exercises } from "./Pages/Exercises";
import {CategoryImport} from "./Pages/CategoryImport";
import {MuscleImport} from "./Pages/MuscleImport";
import {Muscles} from "./Pages/Muscles";
import {ExerciseImport} from "./Pages/ExerciseImport";

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
            <CategoryImport path="/admin/categories/import" />
            <Categories path="/admin/categories" />
            <MuscleImport path="/admin/muscles/import" />
            <Muscles path="/admin/muscles" />
            <ExerciseImport path="/admin/exercises/import" />
            <Exercises path="/admin/exercises" />
        </Router>
    )
}