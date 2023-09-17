import { useTitle } from "hoofd";
import { useEffect, useState } from "preact/hooks";
import { cn } from "../../../helpers/cn"

const displayMuscle = (cats, level = 0) => (
    <ul className={cn("list-disc", level === 0 ? '' : `ml4`)}>
        {cats.map(muscle => {
            return (
                <li>{muscle.Name}
                    {muscle.children.length > 0  && displayMuscle(muscle.children, level + 1)}
                </li>
            )
        })}
    </ul>
);

const getRecursiveChildren = (id, allChildren) => {
    if (!allChildren[id]) {
        return [];
    }

    const children = [];

    allChildren[id].forEach(child => {
        child.children = getRecursiveChildren(child.ID, allChildren);
        children.push(child);
    });

    return children;
}

export const Muscles = () => {
    useTitle("Muscles");
    const [muscles, setMuscles] = useState([]);

    const fetchMuscles = async () => {
        const resp = await fetch('/api/v1/muscle')
        if (!resp.ok) {
            return;
        }
        const response = await resp.json();

        setMuscles((muscles) => {
            const all = [...muscles, ...response.data];
            const [parents, children] =  all.reduce(([parents, children], current) => {
                if (!current.ParentId) {
                    parents[current.ID] = current;
                    return [parents, children];
                }

                if (!children[current.ParentId]) {
                    children[current.ParentId] = [];
                }

                children[current.ParentId].push(current);
                return [parents, children];
            }, [{}, {}]);

            return Object.keys(parents).reduce((carry, key) => {
                const parent = parents[key];
                parent.children = getRecursiveChildren(key, children);

                return [...carry, parent];
            }, []);
        });
    }

    useEffect(() => {
        fetchMuscles();
    }, [false]);


    return (
        <div className="p-8 pt-6 container">
            <h2 className="text-3xl font-bold tracking-tight">Muscles</h2>
            <div className="my-4">
                {displayMuscle(muscles)}
            </div>
        </div>
    )
}