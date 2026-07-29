import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="max-w-xl space-y-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          404
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          This page does not exist.
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          The requested route could not be found. Return to the homepage to keep
          exploring the platform.
        </p>
        <Link href="/" className={buttonVariants({ variant: "default", size: "default" })}>
          Back to home
        </Link>
      </div>
    </div>
  );
}