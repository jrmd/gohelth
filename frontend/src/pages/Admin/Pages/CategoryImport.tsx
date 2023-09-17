import { useTitle } from "hoofd";
import { useEffect, useRef, useState } from "preact/hooks";
import {Button} from "../../../components/Button";

export const CategoryImport = () => {
    useTitle("Categories");
    const [categories, setCategories] = useState([]);
    const [logs, setLogs] = useState([]);
    const textAreaRef = useRef();

    const fetchCategories = async () => {
        const resp = await fetch('/api/v1/category')
        if (!resp.ok) {
            return;
        }
        const response = await resp.json();

        setCategories((categories) => {
            return [...categories, ...response.data];
        });
    }

    useEffect(() => {
        fetchCategories();
    }, [false]);

    const createCategory = async ([name, parent]) => {
        const fd = new FormData();
        fd.set("name", name);
        if (parent > 0) {
            fd.set("parent", parent);
        }

        const resp = await fetch('/api/v1/admin/category', {
            method: "PUT",
            body: fd
        })

        if (!resp.ok) {
            setLogs((logs) => [...logs, 'Failed to create category with name' + name])
            return;
        }

        const item = await resp.json();

        setLogs((logs) => [...logs, `Created ${name} with ID of ${item.ID}`]);
    }

    const importCategories = async () => {
        const input = textAreaRef.current.value
        await Promise.allSettled(
            input.split('\n').map(val => {
                const [name, parent = "-1"] = val.split('\t');
                return [name, Number.parseInt(parent, 10)];
            })
                .map(createCategory)
        );
    }

    return (
        <div className="p-8 pt-6 container">
            <h2 className="text-3xl font-bold tracking-tight">Import Categories</h2>
            <div className="my-4">
                <textarea
                    ref={textAreaRef}
                    className="flex h-32 mb-5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
                <Button onClick={importCategories}>Import</Button>
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