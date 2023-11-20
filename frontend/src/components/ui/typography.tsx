import { cn } from "@/lib/utils";
import React from "react";

const types = {
  h1: {
    variants: {
      default: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      title: "scroll-m-20 text-4xl font-bold tracking-tight",
    },
  },
  h2: {
    variants: {
      default:
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
    },
  },
  h3: {
    variants: {
      default: "scroll-m-20 text-2xl font-semibold tracking-tight",
    },
  },
  h4: {
    variants: {
      default: "scroll-m-20 text-xl font-semibold tracking-tight",
    },
  },
  p: {
    variants: {
      default: "leading-7 [&:not(:first-child)]:mt-6",
      lead: "text-xl text-muted-foreground",
      muted: "text-sm text-muted-foreground",
    },
  },
} as const;

type TypographyTypes = typeof types;
type H1Typrd = keyof TypographyTypes["h1"]["variants"];
type TypographyKey = keyof TypographyTypes;

const createText =
  (
    tagName: keyof preact.JSX.IntrinsicElements,
    variants: Record<string, string> & { default: string }
  ): React.FC<{
    children: React.ReactNode;
    variant?: string;
    className?: string;
  }> =>
    // eslint-disable-next-line react/display-name
    ({
      children,
      className = "",
      variant,
    }: {
      children: React.ReactNode;
      variant?: string;
      className?: string;
    }): React.ReactNode => {
      const Text = tagName;

      return (
        <Text className={cn(variants[variant || "default"], className)}>
          {children}
        </Text>
      );
    };

export const Typography = {
  h1: createText("h1", types.h1.variants),
  h2: createText("h2", types.h2.variants),
  h3: createText("h3", types.h3.variants),
  h4: createText("h4", types.h4.variants),
  p: createText("p", types.p.variants),
};
