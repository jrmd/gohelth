import { useTitle } from "hoofd";
import { useEffect, useRef, useState } from "preact/hooks";
import {Button} from "../../../components/Button";

export const ExerciseImport = () => {
    useTitle("Exercises");
    const [categories, setCategories] = useState([]);
    const [logs, setLogs] = useState([]);
    const textAreaRef = useRef();

    const createExercise = async ({ name,
                                      instructions,
                                      equipment,
                                      mechanic,
                                      level,
                                      force,
                                      categories,
                                      primaryMuscles,
                                      secondaryMuscles,
                                      supportsWeight,
                                      supportsDistance,
                                      supportsTime,
                                      public: isPublic, }) => {
        const fd = new FormData();
        fd.set("name", name);
        fd.set("instructions", instructions);
        fd.set("equipment", equipment);
        fd.set("mechanic", mechanic);
        fd.set("level", level);
        fd.set("force", force);
        fd.set("categories", categories);
        fd.set("primaryMuscles", primaryMuscles);
        fd.set("secondaryMuscles", secondaryMuscles);
        fd.set("supportsWeight", supportsWeight);
        fd.set("supportsDistance", supportsDistance);
        fd.set("supportsTime", supportsTime);
        fd.set("public", isPublic);


        const resp = await fetch('/api/v1/admin/exercise', {
            method: "PUT",
            body: fd
        })

        if (!resp.ok) {
            setLogs((logs) => [...logs, 'Failed to create exercise with name' + name])
            return;
        }

        const item = await resp.json();

        setLogs((logs) => [...logs, `Created ${name} with ID of ${item.ID}`]);
    }

    const importExercises = async () => {
        const input = textAreaRef.current.value
        await Promise.allSettled(
            JSON.parse(input)
                .map(createExercise)
        );
    }

    return (
        <div className="p-8 pt-6 container">
            <h2 className="text-3xl font-bold tracking-tight">Import Exercises</h2>
            <div className="my-4">
                <textarea
                    ref={textAreaRef}
                    className="flex h-32 mb-5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
                <Button onClick={importExercises}>Import</Button>
            </div>
            <div className="my-4">
                <ul>
                    {logs.map((log) => {
                        return <li>{log}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}