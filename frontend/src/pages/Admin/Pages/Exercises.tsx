import { useTitle } from "hoofd";
import { useEffect, useState } from "preact/hooks";
import { cn } from "../../../helpers/cn"

const displayExercise = (cats, level = 0) => (
    <ul className={cn("list-disc", level === 0 ? '' : `ml4`)}>
        {cats.map(exercise => {
            return (
                <li>{exercise.Name}
                    <pre>

                    {JSON.stringify(exercise, null, 4)}
                    </pre>
                </li>
            )
        })}
    </ul>
);

export const Exercises = () => {
    useTitle("Exercises");
    const [exercises, setExercises] = useState([]);

    const fetchExercises = async () => {
        const resp = await fetch('/api/v1/exercise')
        if (!resp.ok) {
            return;
        }
        const response = await resp.json();

        setExercises((exercises) => {
           return [...exercises, ...response.data]
        });
    }

    useEffect(() => {
        fetchExercises();
    }, [false]);


    return (
        <div className="p-8 pt-6 container">
            <h2 className="text-3xl font-bold tracking-tight">Exercises</h2>
            <div className="my-4">
                {displayExercise(exercises)}
            </div>
        </div>
    )
}