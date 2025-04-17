import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg text-sm hover:cursor-pointer font-bold",
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

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

function Button({
    className,
    variant,
    size, 
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        >
            {children}
        </button>
    )
}

export { Button, buttonVariants }
