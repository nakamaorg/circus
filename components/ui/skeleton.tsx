import { cn } from "@/lib/utils";



/**
 * @description
 * Skeleton component for displaying loading states.
 * It uses Tailwind CSS for styling and applies a pulse animation.
 *
 * @param root0 - The props for the skeleton component.
 * @param root0.className - Additional class names to apply to the skeleton.
 * @param root0.props - Additional HTML attributes to apply to the skeleton.
 * @returns {JSX.Element} The skeleton component.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
