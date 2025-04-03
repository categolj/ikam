import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  "inline-flex items-center border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "rounded-full border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "rounded-full border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "rounded-full border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "rounded-full text-foreground",
        // Category: rounded-md (やや角張った形)
        geekStyle: "rounded-md border-amber-500 bg-background text-amber-600 shadow-[0_0_2px] shadow-amber-500 dark:border-yellow-400 dark:text-yellow-400 dark:shadow-yellow-400",
        // Tag: square shape with diagonal (四角形)
        tag: "rounded-none border-amber-500 bg-background text-amber-600 shadow-[0_0_2px] shadow-amber-500 dark:border-yellow-400 dark:text-yellow-400 dark:shadow-yellow-400",
        // Keyword: pill shape (丸みがより強い長方形)
        keyword: "rounded-full border-amber-500 bg-background text-amber-600 shadow-[0_0_2px] shadow-amber-500 dark:border-yellow-400 dark:text-yellow-400 dark:shadow-yellow-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
