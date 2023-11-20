import { ExerciseSelect } from "@/components/ExerciseSelect";
import { exerciseSchema, workoutSchema } from "@/helpers/schemas";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { usePersist } from "@/helpers/usePersist";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Typography } from "@/components/ui/typography";
import { Switch } from "@/components/ui/switch";
import { ExerciseField } from "./ExerciseField";

const convertDateToLocalDate = (
    date: Date | null | undefined,
    alwaysReturnDate = true
): string => {
    const defaultValue = alwaysReturnDate ? new Date() : "";

    if (!date && !(defaultValue instanceof Date) && !alwaysReturnDate) {
        return defaultValue;
    }

    let obj = new Date(date || "");
    obj = obj instanceof Date && !isNaN(obj.valueOf()) ? obj : new Date();
    const local = new Date(obj.getTime() - obj.getTimezoneOffset() * 60000);
    const localISO = local.toISOString().slice(0, -1);
    return localISO;
};

const defaultExercise: z.infer<typeof exerciseSchema> = {
    exerciseTypeId: "",
    sets: [
        {
            reps: 0,
            weight: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            distance: 0,
            type: "main",
            notes: "",
        },
    ],
    completed: false,
};

const defaultValue = {
    name: "",
    startTime: new Date(),
    weight: 0,
    private: true,
    exercises: [defaultExercise],
};

type WorkoutFormProps = {
    onSubmit: (input: {
        values: z.infer<typeof workoutSchema>;
        clear: () => void;
    }) => void | Promise<void>;
    initialValues?: z.infer<typeof workoutSchema>;
    isLoading: boolean;
    stateKey?: string;
    shouldLoadFromState?: (
        state: z.infer<typeof partialSchema>,
        lastModified: Date
    ) => boolean;
};

const partialSchema = workoutSchema.deepPartial();


export const WorkoutForm = ({
    onSubmit,
    initialValues = defaultValue,
    isLoading,
    stateKey = "create",
    shouldLoadFromState = () => true,
}: WorkoutFormProps) => {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const form = useForm<z.infer<typeof workoutSchema>>({
        resolver: zodResolver(workoutSchema),
        defaultValues: initialValues,
    });

    const { getState, clear: clearForm } = usePersist<
        z.infer<typeof workoutSchema>,
        z.infer<typeof partialSchema>
    >(
        `workout.${stateKey}`,
        form.control,
        partialSchema,
        isMounted,
        shouldLoadFromState
    );

    const {
        fields: exercisesFields,
        remove,
        insert,
        swap,
        append,
    } = useFieldArray({
        name: "exercises",
        control: form.control,
    });

    useWatch({
        control: form.control,
        name: "exercises",
    });

    useEffect(() => {
        if (!isMounted) {
            form.reset({ ...initialValues, ...getState() });
            setIsMounted(true);
        }
    }, [isMounted, getState, form]);

    const handleSubmit = (values: z.infer<typeof workoutSchema>) => {
        const input = {
            values,
            clear: () => {
                clearForm();
                form.reset({
                    name: "",
                    startTime: new Date(),
                    weight: 0,
                    private: true,
                    exercises: [defaultExercise],
                });
            },
        };
        return onSubmit(input);
    };

    return (
        <Form {...form}>
            <form
                className="mt-5"
                method="post"
                onSubmit={(event) => {
                    event.preventDefault();
                    void form.handleSubmit(handleSubmit)(event);
                }}
            >
                <Typography.h3 variant="default">Details</Typography.h3>
                <Card className="mt-4">
                    <CardContent className="pt-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Upper body..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Name of the workout. This will be displayed on your profile.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Weight:</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="100kg"
                                            {...field}
                                            onBlur={(event) => {
                                                console.log("settingValue");
                                                form.setValue(`weight`, parseFloat(event.target.value));

                                                void form.trigger(`weight`);
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Weight of the user during the workout.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Start time:</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            {...field}
                                            value={convertDateToLocalDate(field.value)}
                                            onChange={(event) => {
                                                form.setValue(
                                                    `startTime`,
                                                    new Date(event.target.value)
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        When did you start working out? This will be used to
                                        calculate total workout time
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>End time:</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            {...field}
                                            value={convertDateToLocalDate(field.value, false)}
                                            onChange={(event) => {
                                                form.setValue(`endTime`, new Date(event.target.value));
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        When did you stop working out? If you leave this blank then
                                        it will set the end time based on when you saved.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="private"
                            render={({ field }) => (
                                <FormItem className="mt-4 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Private workout:</FormLabel>
                                        <FormDescription>
                                            Should this workout be private? Private workouts are only
                                            visible to you and cannot be shared with other users.
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Typography.h3 className="mt-6" variant="default">
                    Exercises
                </Typography.h3>
                {exercisesFields.map((field, index) => {
                    const exerciseId = form.getValues(
                        `exercises.${index}.exerciseTypeId`
                    );

                    return (
                        <ExerciseField
                            key={field.id}
                            index={index}
                            form={form}
                            field={field}
                            remove={remove}
                            insert={insert}
                            swap={swap}
                            exerciseId={exerciseId}
                            count={exercisesFields.length}
                        />
                    );
                })}
                <div className="mt-4 flex justify-end space-x-4">
                    <Button
                        variant="outline"
                        onClick={(event) => {
                            event.preventDefault();
                            append(defaultExercise);
                        }}
                        disabled={isLoading}
                    >
                        Add exercise
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}