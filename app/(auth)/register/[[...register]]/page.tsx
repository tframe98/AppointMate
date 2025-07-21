import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-slate-100 p-4 animate-fade-in">
      <SignUp/>
    </main>
  )
}