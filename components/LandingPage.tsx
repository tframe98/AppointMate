"use client";
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-slate-100">
      {/* NavBar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white/80 shadow-sm sticky top-0 z-10">
        <div className="text-2xl font-bold text-blue-700 tracking-tight">AppointMate</div>
        <div className="flex gap-4 items-center">
          <Link href="/" className="text-blue-700 font-semibold hover:underline">Home</Link>
          <Link href="/dashboard" className="text-blue-700 font-semibold hover:underline">Dashboard</Link>
          <Link href="/settings" className="text-blue-700 font-semibold hover:underline">Settings</Link>
          <Link href="/bookings" className="text-blue-700 font-semibold hover:underline">Bookings</Link>
          <SignedOut>
            <SignInButton>
              <button className="ml-2 text-blue-700 font-semibold hover:underline">Sign In</button>
            </SignInButton>
            <SignUpButton>
              <button className="ml-2 bg-blue-600 text-white rounded-lg font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-blue-700 transition">Sign Up</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-cover bg-center bg-no-repeat h-[80vh] flex items-center justify-center" style={{ backgroundImage: "url('/assets/heroimg.png')" }}>
        <div className="bg-white/80 backdrop-blur-md text-center px-8 py-12 rounded-2xl shadow-lg max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-900">Effortless Appointment Scheduling</h1>
          <p className="text-lg md:text-xl mb-6 text-blue-800">Streamline your booking process with our intuitive, modern scheduling platform.</p>
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-lg font-semibold text-white text-lg shadow-lg"
            aria-label="Sign up for AppointMate"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-100 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-2xl shadow flex flex-col items-center w-full">
            <div className="text-6xl mb-6">📅</div>
            <h3 className="text-2xl text-blue-900 font-bold mb-3">Easy Scheduling</h3>
            <p className="text-blue-700 text-lg text-center leading-relaxed">Allow clients to book appointments effortlessly from your website.</p>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow flex flex-col items-center w-full">
            <div className="text-6xl mb-6">📊</div>
            <h3 className="text-2xl text-blue-900 font-bold mb-3">Dashboard Overview</h3>
            <p className="text-blue-700 text-lg text-center leading-relaxed">Get a quick glance at your upcoming bookings and business performance.</p>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow flex flex-col items-center w-full">
            <div className="text-6xl mb-6">👥</div>
            <h3 className="text-2xl text-blue-900 font-bold mb-3">Client Management</h3>
            <p className="text-blue-700 text-lg text-center leading-relaxed">Keep track of client details and appointment history with ease.</p>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow flex flex-col items-center w-full">
            <div className="text-6xl mb-6">⚙️</div>
            <h3 className="text-2xl text-blue-900 font-bold mb-3">Customizable Services</h3>
            <p className="text-blue-700 text-lg text-center leading-relaxed">Define and customize the services you offer with ease.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center px-4 gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Start Booking Smarter Today</h2>
            <p className="mb-6 text-lg">Sign up now and let your clients schedule with ease.</p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li>✅ Instant Booking - Clients can book in just a few clicks.</li>
              <li>✅ Automated Reminders - Reduce no-shows effortlessly.</li>
              <li>✅ Client Management - Keep track of your client history.</li>
              <li>✅ Custom Schedules - Set availability and prevent overbooking.</li>
            </ul>
            <Link
              href="/register"
              className="mt-6 inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-100 transition shadow"
              aria-label="Sign up now"
            >
              Sign Up Now
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/assets/man.png" alt="Booking App Preview" className="w-full max-w-sm mx-auto rounded-xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-blue-100">
        <h2 className="text-center text-blue-900 text-3xl font-bold mb-10">Choose Your Plan</h2>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow text-center flex flex-col items-center">
            <h3 className="text-xl text-blue-900 font-semibold mb-2">Basic</h3>
            <p className="text-blue-700 mb-4">Perfect for freelancers</p>
            <div className="text-2xl text-blue-900 font-bold mb-6">$9.99<span className="text-base font-normal">/month</span></div>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              aria-label="Sign up for Basic plan"
            >
              Get Started
            </Link>
          </div>
          <div className="bg-gradient-to-b from-blue-600 to-blue-400 p-8 rounded-2xl shadow text-center flex flex-col items-center border-4 border-blue-300">
            <h3 className="text-xl text-white font-semibold mb-2">Pro</h3>
            <p className="text-blue-100 mb-4">Great for small businesses</p>
            <div className="text-2xl text-white font-bold mb-6">$19.99<span className="text-base font-normal">/month</span></div>
            <Link
              href="/register"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-100 transition font-semibold"
              aria-label="Sign up for Pro plan"
            >
              Get Started
            </Link>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow text-center flex flex-col items-center">
            <h3 className="text-xl text-blue-900 font-semibold mb-2">Enterprise</h3>
            <p className="text-blue-700 mb-4">For larger teams and enterprises</p>
            <div className="text-2xl text-blue-900 font-bold mb-6">$49.99<span className="text-base font-normal">/month</span></div>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              aria-label="Sign up for Enterprise plan"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-white text-blue-900 text-center py-6 mt-8 border-t border-blue-100">
        <p>&copy; {new Date().getFullYear()} AppointMate. All Rights Reserved.</p>
        <p>
          <a href="mailto:support@appointmate.com" rel="noopener noreferrer" className="text-blue-600 underline">
            support@appointmate.com
          </a>
        </p>
      </footer>
    </main>
  );
}