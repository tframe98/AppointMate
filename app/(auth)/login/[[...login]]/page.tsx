import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return(
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-slate-100 p-4 animate-fade-in">
      <SignIn afterSignInUrl="/dashboard" />
    </main>
  );
}