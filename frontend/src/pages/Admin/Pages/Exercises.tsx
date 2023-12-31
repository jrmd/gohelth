import { useTitle } from "hoofd";
import { useEffect, useState } from "preact/hooks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons"

const displayExercise = (cats, level = 0) => (
    <Table>
        <TableHeader>
            <TableRow>
                {/*<TableHead>ID</TableHead>*/}
                <TableHead>Name</TableHead>
                {/*<TableHead>Supports Weight</TableHead>*/}
                {/*<TableHead>Supports Time</TableHead>*/}
                {/*<TableHead>Supports Distance</TableHead>*/}
                <TableHead>Categories</TableHead>
                <TableHead>Primary Muscles</TableHead>
                <TableHead>Secondary Muscles</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Force</TableHead>
                <TableHead>Mechanic</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Public</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>

            {cats.map(exercise => {
                return (
                    <TableRow>
                        {/*<TableCell>{exercise.ID}</TableCell>*/}
                        <TableCell>{exercise.name}</TableCell>
                        {/*<TableCell>{exercise.SupportsWeight ? 'true' : 'false'}</TableCell>*/}
                        {/*<TableCell>{exercise.SupportsTime ? 'true' : 'false'}</TableCell>*/}
                        {/*<TableCell>{exercise.SupportsDistance ? 'true' : 'false'}</TableCell>*/}
                        <TableCell>{exercise.categories.map(category => category.name).join(',')}</TableCell>
                        <TableCell>{exercise.primaryMuscles.map(category => category.name).join(',')}</TableCell>
                        <TableCell>{exercise.secondaryMuscles.map(category => category.name).join(',')}</TableCell>
                        <TableCell>{exercise.level}</TableCell>
                        <TableCell>{exercise.force}</TableCell>
                        <TableCell>{exercise.mechanic}</TableCell>
                        <TableCell>{exercise.equipment}</TableCell>
                        <TableCell>{exercise.public ? 'Public' : 'Private'}</TableCell>
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
    const [perPage, setPerPage] = useState("20");

    const fetchExercises = async (signal) => {
        try {
            const url = new URL(window.location.origin + '/api/v1/admin/exercises');
            url.searchParams.set("page", page.toString());
            url.searchParams.set("perPage", perPage);
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
    }, [page, search, level, force, mechanic, primaryMuscle, secondaryMuscle, perPage, categoryFilter]);

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
                    <div className="flex items-center justify-end space-x-6 lg:space-x-8 col-span-3">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${perPage}`}
                                onValueChange={(value) => {
                                    setPage(1);
                                    setPerPage(value)
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={perPage} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                            Page {page} of{" "}
                            {maxPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => setPage((page) => 1)}
                                disabled={page <= 1}
                            >
                                <span className="sr-only">Go to first page</span>
                                <DoubleArrowLeftIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setPage((page) => page - 1)}
                                disabled={page <= 1}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeftIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setPage((page) => page + 1)}
                                disabled={page === maxPages}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => setPage(maxPages)}
                                disabled={page === maxPages}
                            >
                                <span className="sr-only">Go to last page</span>
                                <DoubleArrowRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-6 gap-2 mb-2">
                    <div>
                        <Label className="mb-2 block">Level</Label>
                        <Select onValueChange={(value) => {
                            setPage(1)
                            setLevel(value)
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Any</SelectItem>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-2 block">Force</Label>
                        <Select onValueChange={(value) => {
                            setPage(1)
                            setForce(value)
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Any</SelectItem>
                                <SelectItem value="push">Push</SelectItem>
                                <SelectItem value="pull">Pull</SelectItem>
                                <SelectItem value="static">Static</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-2 block">Mechanic</Label>
                        <Select onValueChange={(value) => {
                            setPage(1)
                            setMechanic(value)
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Any</SelectItem>
                                <SelectItem value="isolation">Isolation</SelectItem>
                                <SelectItem value="compound">Compound</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-2 block">Category</Label>
                        <Select onValueChange={(value) => {
                            setPage(1);
                            setCategoryFilter(value);
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Any</SelectItem>
                                {categories.map((category) => {
                                    return (
                                        <SelectItem value={category.id}>{category.name}</SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-2 block">Primary Muscle</Label>
                        <Select onValueChange={(value) => {
                            setPage(1)
                            setPrimaryMuscle(value)
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Any</SelectItem>
                                {muscles.map((muscle) => (
                                    <SelectItem value={muscle.id}>{muscle.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-2 block">Secondary Muscle</Label>
                        <Select onValueChange={(value) => {
                            console.log(value);
                            setPage(1)
                            setSecondaryMuscle(value)
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Any</SelectItem>
                                <SelectItem value="">Secondary</SelectItem>
                                {muscles.map((muscle) => (
                                    <SelectItem value={muscle.id}>{muscle.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {displayExercise(exercises)}
            </div>
        </div>
    )
}