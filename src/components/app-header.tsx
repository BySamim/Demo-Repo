import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sparkles,
  LayoutDashboard,
  BookOpen,
  Upload,
  BarChart3,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chapters", label: "Chapters", icon: BookOpen },
  { to: "/submit", label: "Submit Answers", icon: Upload },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
];

export function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 md:gap-8">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="truncate font-display text-lg font-bold tracking-tight">
            Sharma<span className="text-primary">AI</span>
          </span>
        </Link>
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="hidden text-right md:block">
            <div className="text-sm font-semibold leading-tight">Aarav Sharma</div>
            <div className="text-xs text-muted-foreground">Class X · CBSE</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-hero font-display font-bold text-primary-foreground shadow-soft">
            AS
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,calc(100vw-2rem))]">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2 font-display">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-glow">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  Sharma<span className="text-primary">AI</span>
                </SheetTitle>
                <SheetDescription>Aarav Sharma · Class X · CBSE</SheetDescription>
              </SheetHeader>
              <nav className="mt-8 grid gap-2">
                {nav.map(({ to, label, icon: Icon }) => {
                  const active =
                    pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
                  return (
                    <SheetClose asChild key={to}>
                      <Link
                        to={to}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                          active
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
