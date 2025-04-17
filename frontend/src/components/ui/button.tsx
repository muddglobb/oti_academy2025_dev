import { cva } from "class-variance-authority";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg text-sm hover:",
    {
        variants: {
            variant: {
                default: "bg-primary-500 text-neutral-50 hover:bg-primary-700",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        }
    }
)