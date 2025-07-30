import type { JSX } from "react";
import { LoginForm } from "@/components/login-form";



/**
 * @description
 * Login page component for the Next.js application.
 * It renders a login form for user authentication.
 *
 * @returns {JSX.Element} The login page component.
 */
export default function LoginPage(): JSX.Element {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
