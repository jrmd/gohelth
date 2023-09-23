import { useTitle } from "hoofd";
import { useEffect, useRef, useState } from "preact/hooks";
import {Button} from "@/components/ui/button";

export const MuscleImport = () => {
    useTitle("Muscles");
    const [muscles, setMuscles] = useState([]);
    const [logs, setLogs] = useState([]);
    const textAreaRef = useRef();

    const fetchMuscles = async () => {
        const resp = await fetch('/api/v1/muscle')
        if (!resp.ok) {
            return;
        }
        const response = await resp.json();

        setMuscles((muscles) => {
            return [...muscles, ...response.data];
        });
    }

    useEffect(() => {
        fetchMuscles();
    }, [false]);

    const createMuscle = async ([name, parent]) => {
        const fd = new FormData();
        fd.set("name", name);
        if (parent > 0) {
            fd.set("parent", parent);
        }

        const resp = await fetch('/api/v1/admin/muscle', {
            method: "PUT",
            body: fd
        })

        if (!resp.ok) {
            setLogs((logs) => [...logs, 'Failed to create muscle with name' + name])
            return;
        }

        const item = await resp.json();

        setLogs((logs) => [...logs, `Created ${name} with ID of ${item.ID}`]);
    }

    const importMuscles = async () => {
        const input = textAreaRef.current.value
        await Promise.allSettled(
            input.split('\n').map(val => {
                const [name, parent = "-1"] = val.split('\t');
                return [name, Number.parseInt(parent, 10)];
            })
                .map(createMuscle)
        );
    }

    return (
        <div className="p-8 pt-6 container">
            <h2 className="text-3xl font-bold tracking-tight">Import Muscles</h2>
            <div className="my-4">
                <textarea
                    ref={textAreaRef}
                    className="flex h-32 mb-5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
                <Button onClick={importMuscles}>Import</Button>
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