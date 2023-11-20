import { useEffect } from "react";
import { useWatch, type Control, type FieldValues } from "react-hook-form";
import { type ZodSchema } from "zod";
import superjson from "superjson";

interface PersistReturn<T extends FieldValues> {
  clear: () => void;
  getState: () => T | null;
}

export const usePersist = <T extends FieldValues, S extends FieldValues>(
  key: string,
  control: Control<T>,
  schema: ZodSchema<S>,
  active = true,
  shouldLoadState: (_1: S, _2: Date) => boolean
): PersistReturn<S> => {
  const values = useWatch({
    control,
  });

  useEffect(() => {
    if (active && values) {
      localStorage.setItem(key, superjson.stringify(values));
      localStorage.setItem(
        `${key}.lastModified`,
        superjson.stringify(new Date())
      );
    }
  }, [key, values, active]);

  return {
    clear: () => {
      if (window.localStorage) {
        localStorage.removeItem(key);
      }
    },
    getState: (): S | null => {
      try {
        const persistedState = localStorage.getItem(key);
        const persistedStateModifed = localStorage.getItem(
          `${key}.lastModified`
        );

        if (persistedState) {
          const parsedState = superjson.parse(persistedState);
          const validatedState = schema.parse(parsedState);

          if (persistedStateModifed) {
            const parsedStateModifed = superjson.parse(persistedStateModifed);

            if (
              parsedStateModifed instanceof Date &&
              !shouldLoadState(validatedState, parsedStateModifed)
            ) {
              return null;
            }
          }

          return validatedState;
        }
      } catch (e) {}
      return null;
    },
  };
};
