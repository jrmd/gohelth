import { useTitle } from "hoofd";
import { useEffect, useState } from "preact/hooks";
import { cn } from "../../../helpers/cn"

const displayCategory = (cats, level = 0) => (
    <ul className={cn("list-disc", level === 0 ? '' : `ml4`)}>
        {cats.map(category => {
            return (
                <li>{category.name}
                    {category.children.length > 0  && displayCategory(category.children, level + 1)}
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

export const Categories = () => {
    useTitle("Categories");
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const resp = await fetch('/api/v1/category')
        if (!resp.ok) {
            return;
        }
        const response = await resp.json();

        setCategories((categories) => {
            const all = [...categories, ...response.data];
            const [parents, children] =  all.reduce(([parents, children], current) => {
                if (!current.parentId) {
                    parents[current.id] = current;
                    return [parents, children];
                }

                if (!children[current.parentId]) {
                    children[current.parentId] = [];
                }

                children[current.parentId].push(current);
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
        fetchCategories();
    }, [false]);


    return (
        <div className="p-8 pt-6 container">
            <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
            <div className="my-4">
                {displayCategory(categories)}
            </div>
        </div>
    )
}