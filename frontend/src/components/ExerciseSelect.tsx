import { useEffect, useState } from 'preact/hooks';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';


export const ExerciseSelect = ({
    selected,
    onSelect = (id: string) => { }
}) => {
    const [query, setQuery] = useState<string>('');
    const [category, setCategory] = useState<string>('');

    const [categories, setCategories] = useState([]);
    const [exercises, setExercises] = useState([]);

    const getExercises = async (signal: AbortSignal) => {
        try {
            const url = new URL(`http://${window.location.host}/api/v1/exercise`);
            url.searchParams.append('name', query);
            if (category) {
                url.searchParams.append('categories', category);
            }

            console.log(url.toString());

            const resp = await fetch(url.toString(), {
                signal,
            });

            if (!resp.ok) {
                console.log('no bueno');
                return;
            }

            const body = await resp.json();
            console.log(body);
            setExercises(body.data);
        } catch (e) {
            console.log(e);
        }
    };

    const getCategories = async (signal: AbortSignal) => {
        try {
            const resp = await fetch('/api/v1/category?per_page=-1', {
                signal,
            });

            if (!resp.ok) {
                console.log('no bueno');
                return;
            }

            const body = await resp.json();
            setCategories(body.data);
        } catch (e) {
            // do something
        }
    };

    useEffect(() => {
        const controller = new AbortController();

        getExercises(controller.signal);

        return () => {
            controller.abort();
        };
    }, [query, category]);

    useEffect(() => {
        const controller = new AbortController();
        getCategories(controller.signal);

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <Dialog>
            <DialogTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">Select an exercise...</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Exercises</DialogTitle>
                </DialogHeader>
                <Input type="search" onChange={(event) => {
                    setQuery(event.target.value);
                }} />
                {!!category && (
                    <button className="p-0 text-left" onClick={() => {
                        setCategory('');
                    }}>&lt; Clear category</button>
                )}
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    {!query && !category && categories.length > 0 && (
                        <>
                            {categories.map((category) => (
                                <>
                                    <button key={category.id} onClick={() => {
                                        setCategory(category.id)
                                    }}>{category.name}</button>

                                    <Separator className="my-2" />
                                </>
                            ))}
                        </>
                    )}

                    {(!!query || !!categories) && exercises.length === 0 && (
                        <p>no exercises</p>
                    )}

                    {(!!query || !!category) && exercises.length > 0 && (
                        <>
                            {exercises.map(exercise => (
                                <>
                                    <DialogTrigger key={exercise.id} onClick={() => onSelect(exercise.id)} className="text-left">{exercise.name}</DialogTrigger>
                                    <Separator className="my-2" />
                                </>
                            ))}
                        </>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}