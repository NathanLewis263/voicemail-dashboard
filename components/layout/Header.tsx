import { Search, Inbox, Archive, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentView: "inbox" | "resolved";
  onViewChange: (view: "inbox" | "resolved") => void;
  inboxCount: number;
}

export function Header({
  searchTerm,
  onSearchChange,
  currentView,
  onViewChange,
  inboxCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-vm-border bg-vm-surface px-5 gap-4">
      {/* Brand */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-vm-primary/15 flex items-center justify-center">
          <Activity className="h-3.5 w-3.5 text-vm-primary" />
        </div>
        <span className="font-display text-sm font-bold tracking-tight text-vm-text">
          Triage
        </span>
      </div>

      {/* Navigation tabs */}
      <nav className="flex items-center gap-3 bg-vm-bg rounded-lg p-0.5 flex-shrink-0 ml-12">
        <button
          onClick={() => onViewChange("inbox")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150",
            currentView === "inbox"
              ? "bg-vm-card text-vm-text shadow-sm"
              : "text-vm-text-tertiary hover:text-vm-text-secondary",
          )}
        >
          <Inbox className="h-3.5 w-3.5" />
          Inbox
          {inboxCount > 0 && (
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none",
                currentView === "inbox"
                  ? "bg-vm-primary/15 text-vm-primary"
                  : "bg-vm-elevated text-vm-text-tertiary",
              )}
            >
              {inboxCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onViewChange("resolved")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150",
            currentView === "resolved"
              ? "bg-vm-card text-vm-text shadow-sm"
              : "text-vm-text-tertiary hover:text-vm-text-secondary",
          )}
        >
          <Archive className="h-3.5 w-3.5" />
          Resolved
        </button>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-vm-text-tertiary" />
          <input
            type="search"
            placeholder="Search..."
            className="w-[400px] h-8 pl-8 pr-3 rounded-lg bg-vm-bg border border-vm-border text-xs text-vm-text placeholder:text-vm-text-tertiary focus:outline-none focus:ring-1 focus:ring-vm-primary/30 focus:border-vm-primary/40 transition-all font-sans"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
