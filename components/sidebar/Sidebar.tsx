"use client";

import { useStore } from "@/stores/store";
import { DocumentList } from "./DocumentList";
import { Plus, FileText, ChevronRight } from "lucide-react";

export function Sidebar() {
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const createDocument = useStore((state) => state.createDocument);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-sidebar sm:hidden transition-opacity duration-250
                    ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />
      <aside
        className={`fixed sm:relative w-sidebar shrink-0 bg-bg-sidebar h-dvh flex flex-col z-sidebar
                    transition-all duration-250
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0 sm:-ml-[270px]"}`}
      >
        <div className="pt-4" />
        <nav className="flex-1 overflow-auto px-4">
          <CollapsibleSection
            label="Open files"
            panelId="documents-panel"
            icon={<FileText size={14} />}
            isOpen
          >
            <DocumentList />
          </CollapsibleSection>
        </nav>

        <div className="p-4 border-t border-border-settings">
          <button
            onClick={createDocument}
            className="w-full bg-plum text-bg-sidebar py-2 px-4 rounded font-medium
                       hover:opacity-90 active:scale-[0.97] transition-all flex items-center justify-center gap-2
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-bg-sidebar"
          >
            <Plus size={18} />
            New Document
          </button>
        </div>
      </aside>
    </>
  );
}

function CollapsibleSection({
  label,
  panelId,
  icon,
  isOpen,
  children,
}: {
  label: string;
  panelId: string;
  icon: React.ReactNode;
  isOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="w-full flex items-center justify-between py-2 text-text-muted text-xs uppercase tracking-wider">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <ChevronRight size={14} className={isOpen ? "rotate-90" : ""} />
      </div>
      <div id={panelId}>
        <div className="ml-2 space-y-1 mt-1">{children}</div>
      </div>
    </div>
  );
}
