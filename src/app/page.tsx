import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    title: "Kanban Boards",
    description:
      "Visualize your workflow and move tasks between columns with ease",
  },
  {
    icon: <Users className="h-6 w-6 text-blue-500" />,
    title: "Team Collaboration",
    description:
      "Invite team members, assign tasks and track who is doing what",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-green-500" />,
    title: "Project Tracking",
    description:
      "Set deadlines, priorities and track progress across all projects",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b bg-white sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-xl font-bold text-slate-900">Flowboard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Free to get started
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 max-w-3xl leading-tight">
          Manage projects with your team effortlessly
        </h1>

        <p className="text-xl text-slate-500 mb-10 max-w-2xl">
          Flowboard helps teams organize work, track progress and ship faster.
          Kanban boards, task assignments and team collaboration in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="px-8">
              Start for free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="px-8">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            Everything your team needs
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
            Simple and powerful tools to keep your team aligned and productive
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-slate-900 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to get organized?
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Join teams already using Flowboard to ship projects faster
        </p>
        <Link href="/register">
          <Button size="lg" variant="secondary" className="px-8">
            Create free account
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 px-6 flex justify-between items-center text-sm text-slate-500">
        <span>© 2026 Flowboard</span>
        <span>Built with ❤️</span>
      </footer>
    </div>
  );
}
