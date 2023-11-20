import { ExerciseSelect } from "@/components/ExerciseSelect";
import { WorkoutForm } from "@/components/WorkoutForm";
import { useAuth } from "@/helpers";
import { exerciseSchema } from "@/helpers/schemas";
import { useTitle } from "hoofd"
import { route } from "preact-router";
import type z from 'zod';

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
    exercises: [defaultExercise, defaultExercise],
};


export const CreateWorkoutPage = () => {
    useTitle('Create a workout');

    const { user, isLoading } = useAuth();

    if (!user && isLoading) {
        return <p>Loading...</p>
    }

    if (!user) {
        route("/auth/sign-in", true);
        return null;
    }

    return (
        <div className="container">
            <WorkoutForm
                onSubmit={() => { }}
                isLoading={false}
                initialValues={defaultValue}
            />
        </div>
    );
}