import React, { useState } from "react";
import {
  FileText,
  Search,
  ExternalLink,
  Mail,
  Copy,
  Check,
  FileSpreadsheet,
  Send,
  Calendar,
  Sparkles,
  Tag,
  Clock,
} from "lucide-react";

export interface PreviewRequest {
  id: string;
  email: string;
  programUrl: string;
  cohortStartDate: string;
  ref?: string;
  a?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

interface PreviewRequestsViewProps {
  requests: PreviewRequest[];
  onUpdateStatus: (id: string, status: string) => void;
  onTriggerTestNotification?: () => void;
  isTestingNotification?: boolean;
}

export default function PreviewRequestsView({
  requests,
  onUpdateStatus,
  onTriggerTestNotification,
  isTestingNotification,
}: PreviewRequestsViewProps) {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<PreviewRequest | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredRequests = requests.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.email?.toLowerCase().includes(q) ||
      r.programUrl?.toLowerCase().includes(q) ||
      r.cohortStartDate?.toLowerCase().includes(q) ||
      r.ref?.toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    const headers = ["ID", "Email", "Program URL", "Cohort Start Date", "Referral Ref", "Attribution Tag", "Status", "Created At"];
    const rows = requests.map((r) => [
      r.id || "",
      r.email || "",
      `"${r.programUrl || ""}"`,
      r.cohortStartDate || "",
      r.ref || "",
      r.a || "",
      r.status || "pending_preview",
      r.createdAt || "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `portalbuild-preview-requests-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 space-y-4">
      {/* Top Bar with Counts and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-white/[0.08] p-4 rounded-xl shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Free Cohort Preview Leads</h2>
            <span className="text-[10px] font-mono uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded">
              24h Build Queue
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Direct inbound submissions from the homepage preview modal (<code className="text-orange-300">#preview</code>).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 bg-slate-950/80 hover:bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {onTriggerTestNotification && (
            <button
              onClick={onTriggerTestNotification}
              disabled={isTestingNotification}
              className="px-3 py-1.5 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-xs font-mono text-orange-400 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTestingNotification ? "Sending..." : "Test Notification"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 shrink-0">
        <div className="text-xs font-mono text-slate-400">
          Total Leads: <span className="text-white font-bold">{requests.length}</span>
        </div>

        <div className="ml-auto relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email, program URL, or ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/[0.1] focus:border-orange-500/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        {/* Left List */}
        <div className={`flex-1 border border-white/[0.08] bg-slate-900/40 rounded-xl overflow-y-auto scrollbar-thin ${selectedItem ? "hidden lg:block lg:w-1/2" : "w-full"}`}>
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              {requests.length === 0 ? "No preview requests submitted yet." : "No preview requests match your query."}
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {filteredRequests.map((req) => {
                const isSelected = selectedItem?.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedItem(req)}
                    className={`p-4 hover:bg-white/[0.02] cursor-pointer transition-colors ${
                      isSelected ? "bg-orange-500/[0.06] border-l-2 border-orange-500" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-sm text-white block">{req.email}</span>
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="text-slate-500 text-[11px] font-mono">Cohort Starts: </span>
                          <span className="text-orange-400 font-mono text-[11px] font-bold bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                            {req.cohortStartDate}
                          </span>
                          {req.ref && (
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1 py-0.5 rounded font-bold">
                              REF: {req.ref}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          req.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : req.status === "contacted"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {req.status || "pending_preview"}
                      </span>
                    </div>

                    <div className="mt-2 text-xs">
                      <a
                        href={req.programUrl.startsWith("http") ? req.programUrl : "https://" + req.programUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-300 hover:text-orange-400 hover:underline inline-flex items-center gap-1 font-mono break-all"
                      >
                        <span>{req.programUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>ID: {req.id.slice(0, 14)}...</span>
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail Pane */}
        {selectedItem && (
          <div className="flex-1 border border-white/[0.08] bg-slate-900/60 rounded-xl p-5 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 block">
                  Cohort Preview Request Dossier
                </span>
                <h3 className="text-lg font-bold text-white">{selectedItem.email}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Submitted {new Date(selectedItem.createdAt).toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs font-mono text-slate-500 hover:text-white px-2 py-1 rounded border border-white/5"
              >
                Close ✕
              </button>
            </div>

            {/* Quick Status Selector */}
            <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-lg border border-white/[0.04]">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide block">
                Update Preview Build Status:
              </span>
              <div className="flex gap-2 flex-wrap">
                {["pending_preview", "in_build", "preview_delivered", "completed", "archived"].map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(selectedItem.id, st)}
                    className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider border cursor-pointer ${
                      selectedItem.status === st
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-slate-900 text-slate-400 border-white/10 hover:border-white/30"
                    }`}
                  >
                    {st.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Detail Specs */}
            <div className="bg-slate-950/50 p-4 rounded-lg border border-white/[0.05] space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-mono text-[10px] uppercase block">Curriculum / Program Sales Page</span>
                <a
                  href={selectedItem.programUrl.startsWith("http") ? selectedItem.programUrl : "https://" + selectedItem.programUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:underline font-mono text-sm inline-flex items-center gap-1.5 break-all mt-0.5"
                >
                  <span>{selectedItem.programUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.04]">
                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Next Cohort Start Date</span>
                  <span className="font-mono font-bold text-orange-400 text-sm">{selectedItem.cohortStartDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Partner Referral Code</span>
                  <span className="font-mono text-slate-300 text-sm font-semibold">{selectedItem.ref || "Direct Lead (None)"}</span>
                </div>
              </div>

              {selectedItem.a && (
                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Attribution Tag</span>
                  <span className="font-mono text-slate-300">{selectedItem.a}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <a
                href={`mailto:${selectedItem.email}?subject=Your%20Custom%20PortalBuild%20Preview%20is%20Ready%20%E2%80%94%20Review%20Link&body=Hi%20there,%0A%0AWe%20reviewed%20your%20cohort%20curriculum%20at%20${encodeURIComponent(selectedItem.programUrl)}%20and%20have%20provisioned%20your%20interactive%20custom%20preview%20portal.%0A%0AYou%20can%20test%20the%20member%20experience%20and%20operator%20dashboard%20here...`}
                className="flex-1 py-2 px-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-center rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Deliver Preview Link</span>
              </a>

              <button
                onClick={() => copyToClipboard(JSON.stringify(selectedItem, null, 2), selectedItem.id)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 font-mono text-xs"
              >
                {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === selectedItem.id ? "Copied" : "JSON"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
