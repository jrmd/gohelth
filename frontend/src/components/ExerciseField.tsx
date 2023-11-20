import { MoreHorizontal, MoreVertical } from "lucide-react";
import z from "zod";
import {
    type UseFormReturn,
    type UseFieldArrayInsert,
    type UseFieldArraySwap,
    type UseFieldArrayRemove,
    useFieldArray,
} from "react-hook-form";
import { useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from "@/components/ui/form";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Input } from "@/components/ui/input";

import { ExerciseSelect } from "@/components/ExerciseSelect";
import { Typography } from "@/components/ui/typography";
import { exerciseTypeSchema, type exerciseSchema, type workoutSchema } from "@/helpers/schemas";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Flame, Fan } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "preact/hooks";

interface ExerciseProps {
    field: z.infer<typeof exerciseSchema>;
    index: number;
    form: UseFormReturn<z.infer<typeof workoutSchema>>;
    remove: UseFieldArrayRemove;
    swap: UseFieldArraySwap;
    insert: UseFieldArrayInsert<z.infer<typeof workoutSchema>, "exercises">;
    count: number;
    exerciseId: string;
}

const defaultSet = {
    reps: 0,
    weight: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    distance: 0,
    type: "main",
    notes: "",
} as const;

const defaultExercise: z.infer<typeof exerciseSchema> = {
    exerciseTypeId: "",
    sets: [defaultSet],
    completed: false,
};

export function ExerciseField({
    index,
    form,
    remove,
    swap,
    insert,
    count,
    exerciseId,
}: ExerciseProps) {
    const [exercise, setExercise] = useState<boolean | z.infer<typeof exerciseTypeSchema>>(false)
    const isComplete = form.getValues(`exercises.${index}.completed`);
    const [isEditing, setIsEditing] = useState(false);
    const [showSets, setShowSets] = useState(!exerciseId || isComplete);
    const [showInstructions, setShowInstructions] = useState(false);

    const {
        fields: sets,
        append,
        remove: removeSet,
    } = useFieldArray({
        name: `exercises.${index}.sets`,
        control: form.control,
    });

    let totalSets = 0;

    const getExercise = async (id, signal?: AbortSignal) => {
        try {
            if (!id) {
                return;
            }

            const resp = await fetch(`/api/v1/exercise/${id}`, {
                signal,
            });
            if (!resp.ok) {
                return;
            }

            const body = await resp.json();
            setExercise(body);
            setShowSets(true);
            console.log(body)
        } catch (e) {

        }
    }

    useEffect(() => {
        const abortController = new AbortController();
        getExercise(exerciseId, abortController.signal);

        return () => {
            abortController.abort();
        }
    }, [exerciseId]);

    return (
        <Card className="mt-4">
            <Collapsible open={showSets} onOpenChange={setShowSets}>
                <CardHeader
                    className={cn(
                        "w-full flex-row justify-between space-y-0",
                        showSets && "pb-0"
                    )}
                >
                    {(!exercise || isEditing) && (
                        <div>
                            <Typography.h4>Select an exercise...</Typography.h4>

                            <CardDescription>
                                Select an exercise from the dropdown below...
                            </CardDescription>
                        </div>
                    )}
                    {exercise && !isEditing && (
                        <CollapsibleTrigger>
                            <Typography.h4
                                className={cn(
                                    isComplete &&
                                    "text-green-600	line-through decoration-slate-400"
                                )}
                            >
                                {exercise.name}
                            </Typography.h4>
                        </CollapsibleTrigger>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-9 px-0">
                                <MoreVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {exercise && (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            form.setValue(
                                                `exercises.${index}.completed`,
                                                !isComplete
                                            );
                                            setShowSets(isComplete);
                                        }}
                                    >
                                        {!isComplete ? "Mark as complete" : "Mark as incomplete"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setIsEditing((value) => !value);
                                            setShowSets(true);
                                        }}
                                    >
                                        {isEditing ? "Stop Editing" : "Edit Exercise"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}
                            <DropdownMenuItem
                                disabled={index === 0}
                                onClick={() => {
                                    swap(index, index - 1);
                                }}
                            >
                                Move up
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    swap(index, index + 1);
                                }}
                                disabled={index === count - 1}
                            >
                                Move down
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    insert(index, defaultExercise);
                                }}
                            >
                                Insert Before
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    insert(index + 1, defaultExercise);
                                }}
                            >
                                Insert After
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    remove(index);
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent>
                        {(!exercise || isEditing) && (
                            <FormField
                                control={form.control}
                                name={`exercises.${index}.exerciseTypeId`}
                                render={({ field }) => (
                                    <FormItem className="mt-4">
                                        <FormLabel>Exercise:</FormLabel>
                                        <FormControl>
                                            {/* <ExerciseSelect
                                                exercises={exerciseTypes}
                                                {...form.register(`exercises.${index}.exerciseTypeId`)}
                                                value={field.value}
                                                onChange={(value: string) => {
                                                    form.setValue(
                                                        `exercises.${index}.exerciseTypeId`,
                                                        value
                                                    );
                                                    setIsEditing(false);
                                                }}
                                                onBlur={() => null}
                                            /> */}
                                            <ExerciseSelect
                                                {...form.register(`exercises.${index}.exerciseTypeId`)}
                                                value={field.value}
                                                onSelect={(value: string) => {
                                                    form.setValue(
                                                        `exercises.${index}.exerciseTypeId`,
                                                        value
                                                    );
                                                    setIsEditing(false);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {exercise && !isEditing && (
                            <>
                                <Collapsible
                                    open={showInstructions}
                                    onOpenChange={setShowInstructions}
                                    className="mb-4 mt-4 space-y-2 rounded-md border px-4 py-2 text-sm shadow-sm"
                                >
                                    <div className="flex items-center justify-between space-x-4">
                                        <h4 className="text-sm font-semibold">Instructions</h4>
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <CaretSortIcon className="h-4 w-4" />
                                                <span className="sr-only">Show instructions</span>
                                            </Button>
                                        </CollapsibleTrigger>
                                    </div>
                                    <CollapsibleContent className="space-y-2">
                                        <div className="mb-2 text-sm">
                                            <ol className="ml-4 list-decimal space-y-3">
                                                {(exercise?.instructions || "")
                                                    .split("\n")
                                                    .map((line, i) => (
                                                        <li key={i}>{line}</li>
                                                    ))}
                                            </ol>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                                <div className="space-y-4">
                                    {sets.map((set, i) => {
                                        const type = form.getValues(
                                            `exercises.${index}.sets.${i}.type`
                                        );
                                        return (
                                            <article className="flex" key={set.id}>
                                                <aside className="mr-5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-medium">
                                                    {type === "warmup" && <Flame width={16} />}
                                                    {type === "main" || !type ? ++totalSets : null}
                                                    {type === "cooldown" && <Fan width={16} />}
                                                </aside>
                                                <section className="flex w-full flex-wrap gap-4 sm:flex-nowrap">
                                                    <div className="flex flex-col gap-2">
                                                        {exercise.supportsWeight && (
                                                            <div className="flex gap-4">
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`exercises.${index}.sets.${i}.weight`}
                                                                    render={({ field }) => (
                                                                        <FormItem className="">
                                                                            <FormLabel className="text-xs text-muted-foreground">
                                                                                Weight
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    className="w-[60px]"
                                                                                    onBlur={(event) => {
                                                                                        form.setValue(
                                                                                            `exercises.${index}.sets.${i}.weight`,
                                                                                            parseFloat(event.target.value)
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`exercises.${index}.sets.${i}.reps`}
                                                                    render={({ field }) => (
                                                                        <FormItem className="">
                                                                            <FormLabel className="text-xs text-muted-foreground">
                                                                                Reps
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    className="w-[60px]"
                                                                                    onBlur={(event) => {
                                                                                        form.setValue(
                                                                                            `exercises.${index}.sets.${i}.reps`,
                                                                                            parseFloat(event.target.value)
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        )}
                                                        {exercise.supportsDistance && (
                                                            <div className="flex gap-4">
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`exercises.${index}.sets.${i}.distance`}
                                                                    render={({ field }) => (
                                                                        <FormItem className="">
                                                                            <FormLabel className="text-xs text-muted-foreground">
                                                                                Distance
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    className="w-[60px]"
                                                                                    onBlur={(event) => {
                                                                                        form.setValue(
                                                                                            `exercises.${index}.sets.${i}.distance`,
                                                                                            parseFloat(event.target.value)
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        )}
                                                        {exercise.supportsTime && (
                                                            <div className="flex gap-4">
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`exercises.${index}.sets.${i}.hours`}
                                                                    render={({ field }) => (
                                                                        <FormItem className="">
                                                                            <FormLabel className="text-xs text-muted-foreground">
                                                                                Hours
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    className="w-[60px]"
                                                                                    onBlur={(event) => {
                                                                                        form.setValue(
                                                                                            `exercises.${index}.sets.${i}.hours`,
                                                                                            parseFloat(event.target.value)
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`exercises.${index}.sets.${i}.minutes`}
                                                                    render={({ field }) => (
                                                                        <FormItem className="">
                                                                            <FormLabel className="text-xs text-muted-foreground">
                                                                                Minutes
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    className="w-[60px]"
                                                                                    onBlur={(event) => {
                                                                                        form.setValue(
                                                                                            `exercises.${index}.sets.${i}.minutes`,
                                                                                            parseFloat(event.target.value)
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`exercises.${index}.sets.${i}.seconds`}
                                                                    render={({ field }) => (
                                                                        <FormItem className="">
                                                                            <FormLabel className="text-xs text-muted-foreground">
                                                                                Seconds
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    className="w-[60px]"
                                                                                    onBlur={(event) => {
                                                                                        form.setValue(
                                                                                            `exercises.${index}.sets.${i}.seconds`,
                                                                                            parseFloat(event.target.value)
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <FormField
                                                        control={form.control}
                                                        name={`exercises.${index}.sets.${i}.notes`}
                                                        render={({ field }) => (
                                                            <FormItem className="order-2 w-full sm:order-1">
                                                                <FormLabel className="text-xs text-muted-foreground">
                                                                    Notes
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="" />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="order-1 ml-auto mt-[34px] w-9  shrink-0 px-0 sm:order-2 sm:ml-0"
                                                            >
                                                                <MoreHorizontal />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuSub>
                                                                <DropdownMenuSubTrigger>
                                                                    Set Type
                                                                </DropdownMenuSubTrigger>
                                                                <DropdownMenuPortal>
                                                                    <DropdownMenuSubContent>
                                                                        <DropdownMenuRadioGroup
                                                                            value={type}
                                                                            onValueChange={(value) => {
                                                                                const typeSchema = z.enum([
                                                                                    "warmup",
                                                                                    "main",
                                                                                    "cooldown",
                                                                                ]);
                                                                                const newType = typeSchema.parse(value);
                                                                                form.setValue(
                                                                                    `exercises.${index}.sets.${i}.type`,
                                                                                    newType
                                                                                );
                                                                            }}
                                                                        >
                                                                            <DropdownMenuRadioItem value="warmup">
                                                                                Warmup
                                                                            </DropdownMenuRadioItem>
                                                                            <DropdownMenuRadioItem value="main">
                                                                                Main Set
                                                                            </DropdownMenuRadioItem>
                                                                            <DropdownMenuRadioItem value="cooldown">
                                                                                Cooldown
                                                                            </DropdownMenuRadioItem>
                                                                        </DropdownMenuRadioGroup>
                                                                    </DropdownMenuSubContent>
                                                                </DropdownMenuPortal>
                                                            </DropdownMenuSub>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    removeSet(i);
                                                                }}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </section>
                                            </article>
                                        );
                                    })}
                                    <Button
                                        variant="outline"
                                        className="ml-[50px]"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            append(defaultSet);
                                        }}
                                    >
                                        Add Set
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
