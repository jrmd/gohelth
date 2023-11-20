import z from "zod";

export const exerciseSetSchema = z.array(
  z.object({
    id: z.string().optional(),
    reps: z.number(),
    weight: z.number(),
    distance: z.number(),
    hours: z.number(),
    minutes: z.number(),
    seconds: z.number(),
    type: z.enum(["warmup", "main", "cooldown"]).default("main"),
    notes: z.string().default(""),
  })
);

export const exerciseSchema = z.object({
  id: z.string().optional(),
  exerciseTypeId: z.string(),
  sets: exerciseSetSchema,
  completed: z.boolean(),
});

export const exerciseTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  supportsWeight: z.boolean(),
  supportsTime: z.boolean(),
  supportsDistance: z.boolean(),
  category: z.string(),
  createdById: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  superSetId: z.string().nullable(),
  public: z.boolean(),
});

export const workoutSchema = z.object({
  name: z.string(),
  startTime: z.date(),
  endTime: z.date().optional(),
  weight: z.number().optional().default(0),
  exercises: z.array(exerciseSchema),
  private: z.boolean(),
});

export const routineExerciseSchema = z.object({
  exerciseTypeId: z.string(),
  sets: z.number().min(1),
  reps: z.number(),
});

export const routineSchema = z.object({
  name: z.string(),
  public: z.boolean(),
  exercises: z.array(routineExerciseSchema),
});
