import { useTitle } from "hoofd";
import { useEffect, useState } from "preact/hooks";
import {Table, TableBody, TableDefinition, TableHead, TableHeading, TableRow} from "../../../components/Table";
import {Input} from "../../../components/Input";
import {Button} from "../../../components/Button";

const displayExercise = (cats, level = 0) => (
    <Table>
        <TableHead>
            {/*<TableHeading>ID</TableHeading>*/}
            <TableHeading>Name</TableHeading>
            {/*<TableHeading>Supports Weight</TableHeading>*/}
            {/*<TableHeading>Supports Time</TableHeading>*/}
            {/*<TableHeading>Supports Distance</TableHeading>*/}
            <TableHeading>Categories</TableHeading>
            <TableHeading>Primary Muscles</TableHeading>
            <TableHeading>Secondary Muscles</TableHeading>
            <TableHeading>Level</TableHeading>
            <TableHeading>Force</TableHeading>
            <TableHeading>Mechanic</TableHeading>
            <TableHeading>Equipment</TableHeading>
            <TableHeading>Public</TableHeading>
        </TableHead>
        <TableBody>

        {cats.map(exercise => {
            return (
                <TableRow>
                    {/*<TableDefinition>{exercise.ID}</TableDefinition>*/}
                    <TableDefinition>{exercise.Name}</TableDefinition>
                    {/*<TableDefinition>{exercise.SupportsWeight ? 'true' : 'false'}</TableDefinition>*/}
                    {/*<TableDefinition>{exercise.SupportsTime ? 'true' : 'false'}</TableDefinition>*/}
                    {/*<TableDefinition>{exercise.SupportsDistance ? 'true' : 'false'}</TableDefinition>*/}
                    <TableDefinition>{exercise.Categories.map(category => category.Name).join(',')}</TableDefinition>
                    <TableDefinition>{exercise.PrimaryMuscles.map(category => category.Name).join(',')}</TableDefinition>
                    <TableDefinition>{exercise.SecondaryMuscles.map(category => category.Name).join(',')}</TableDefinition>
                    <TableDefinition>{exercise.Level}</TableDefinition>
                    <TableDefinition>{exercise.Force}</TableDefinition>
                    <TableDefinition>{exercise.Mechanic}</TableDefinition>
                    <TableDefinition>{exercise.Equipment}</TableDefinition>
                    <TableDefinition>{exercise.Public ? 'Public' : 'Private'}</TableDefinition>
                </TableRow>
            )
        })}
        </TableBody>
    </Table>
);

export const Exercises = () => {
    useTitle("Exercises");
    const [exercises, setExercises] = useState([]);
    const [categories, setCategories] = useState([]);
    const [muscles, setMuscles] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPages, setMaxPage] = useState(1);
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState("");
    const [force, setForce] = useState("");
    const [mechanic, setMechanic] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [primaryMuscle, setPrimaryMuscle] = useState("");
    const [secondaryMuscle, setSecondaryMuscle] = useState("");

    const fetchExercises = async (signal) => {
        try {
            const url = new URL(window.location.origin + '/api/v1/admin/exercises');
            url.searchParams.set("page", page);
            if (search.length > 0) {
                url.searchParams.set("name", search);
            }
            if (level.length > 0) {
                url.searchParams.set("level", level);
            }
            if (force.length > 0) {
                url.searchParams.set("force", force);
            }
            if (mechanic.length > 0) {
                url.searchParams.set("mechanic", mechanic);
            }
            if (categoryFilter.length > 0) {
                url.searchParams.set("categories", categoryFilter);
            }
            if (primaryMuscle.length > 0) {
                url.searchParams.set("primary", primaryMuscle);
            }
            if (secondaryMuscle.length > 0) {
                url.searchParams.set("secondary", secondaryMuscle);
            }
            const resp = await fetch(url.toString(), { signal })
            if (!resp.ok) {
                return;
            }
            const response = await resp.json();
    
            setExercises(() => {
               return [...response.data]
            });
            setMaxPage(response.maxPages)
        } catch (e) {
            console.log(e);
        }
    }

    const fetchMuscles = async () => {
        const resp = await fetch('/api/v1/muscles?page=-1')
        if (!resp.ok) {
            return;
        }
        const response = await resp.json();

        setMuscles(response.data);
    };

    const fetchCategories = async () => {
        const resp = await fetch('/api/v1/category?page=-1')
        if (!resp.ok) {
            return;
        }
        const response = await resp.json();

        setCategories(response.data);
    }

    useEffect(() => {
        const signal = new AbortController()
        void fetchExercises(signal.signal);

        return () => {
            signal.abort()
        }
    }, [page, search, level, force, mechanic, primaryMuscle, secondaryMuscle, categoryFilter]);

    useEffect(() => {
        void fetchCategories();
        void fetchMuscles();
    }, []);

    return (
        <div className="p-8 pt-6 container">
            <h2 className="text-3xl font-bold tracking-tight">Exercises</h2>
            <div className="my-4">
                <div className="grid grid-cols-4 mb-2">
                    <Input placeholder="Search Exercises..." onChange={(event) => {
                        setPage(1)
                        setSearch(event.target.value)
                    }} />
                    <div>

                        <select onChange={(event) => {
                            setPage(1)
                            setLevel(event.target.value)
                        }}>
                            <option value="">Level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="expert">Expert</option>
                        </select>
                        <select onChange={(event) => {
                            setPage(1)
                            setForce(event.target.value)
                        }}>
                            <option value="">Force</option>
                            <option value="push">Push</option>
                            <option value="pull">Pull</option>
                            <option value="static">Static</option>
                        </select>
                        <select onChange={(event) => {
                            setPage(1)
                            setMechanic(event.target.value)
                        }}>
                            <option value="">Mechanic</option>
                            <option value="isolation">Isolation</option>
                            <option value="compound">Compound</option>
                        </select>
                    </div>
                    <div>
                        <select onChange={(event) => {
                            setPage(1)
                            setCategoryFilter(event.target.value)
                        }}>
                            <option value="">Category</option>
                            {categories.map((category) => {
                                console.log(category)
                                return (
                                    <option value={category.ID}>{category.Name}</option>
                                )
                            })}
                        </select>
                        <select onChange={(event) => {
                            setPage(1)
                            setPrimaryMuscle(event.target.value)
                        }}>
                            <option value="">Primary</option>
                            {muscles.map((muscle) => (
                                <option value={muscle.ID}>{muscle.Name}</option>
                            ))}
                        </select>
                        <select onChange={(event) => {
                            setPage(1)
                            setSecondaryMuscle(event.target.value)
                        }}>
                            <option value="">Secondary</option>
                            {muscles.map((muscle) => (
                                <option value={muscle.ID}>{muscle.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div></div>
                        { page > 1 && (
                            <Button onClick={() => {
                                setPage((currentPage) => currentPage - 1)
                            }}>Previous Page</Button>
                        )}
                        { page < maxPages && (
                            <Button onClick={() => {
                                setPage((currentPage) => currentPage + 1)
                            }}>Next Page</Button>
                        )}
                    </div>
                </div>
                {displayExercise(exercises)}
            </div>
        </div>
    )
}