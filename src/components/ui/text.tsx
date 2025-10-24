import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";


const textVariants = cva("text-foreground text-base font-poppins", {
  variants: {
    variant: {
      default: "",
      h1: "text-center text-4xl font-bold tracking-tight",
      h2: "border-b pb-2 text-3xl tracking-tight",
      h3: "text-2xl font-bold tracking-tight",
      h4: "text-xl font-bold tracking-tight",
      p: "mt-3 leading-7 sm:mt-6",
      blockquote: "mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6",
      code: "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-muted-foreground text-xl",
      large: "text-lg font-semibold",
      small: "text-sm font-bold",
      muted: "text-muted-foreground text-xs",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type TextVariantProps = VariantProps<typeof textVariants>;

const TextClassContext = React.createContext<string | undefined>(undefined);


type TextProps<C extends React.ElementType = "span"> = TextVariantProps & {
  as?: C;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<C>, "as" | "className">;


function Text<C extends React.ElementType = "span">({
  as,
  variant = "default",
  className,
  ...props
}: TextProps<C>) {
  const Component = as || "span";
  const textClass = React.useContext(TextClassContext);

  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      {...props}
    />
  );
}

export { Text, TextClassContext };
