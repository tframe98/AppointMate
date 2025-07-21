import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function PublicNavBar() {
  return (
    <nav className="flex justify-between items-center w-full h-20 px-6 py-4 bg-white/80 shadow-sm sticky top-0 z-20">
      <div className="text-2xl font-bold text-blue-700 tracking-tight">AppointMate</div>
      <div className="flex gap-4 items-center">
        <Link href="/dashboard" className="text-blue-700 font-semibold hover:underline">Dashboard</Link>
        <Link href="/bookings" className="text-blue-700 font-semibold hover:underline">Bookings</Link>
        <Link href="/event-types" className="text-blue-700 font-semibold hover:underline">Event Types</Link>
        <Link href="/availability" className="text-blue-700 font-semibold hover:underline">Availability</Link>
        <Link href="/settings" className="text-blue-700 font-semibold hover:underline">Settings</Link>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}