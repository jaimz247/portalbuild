import React, { useState } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Filter,
  FileSpreadsheet,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Send,
  MessageSquare,
  ShieldCheck,
  Building,
} from "lucide-react";

export interface PartnerReferral {
  id: string;
  name: string;
  email: string;
  referralCode?: string;
  clientProgramUrl: string;
  cohortDate?: string;
  notes?: string;
  previewRecipient?: string;
  status?: string;
  createdAt: string;
}

export interface PartnerSignup {
  id: string;
  name: string;
  email: string;
  whatYouDo: string;
  groupClientsCount: string;
  websiteOrLinkedIn?: string;
  status?: string;
  createdAt: string;
}

interface PartnerSubmissionsViewProps {
  referrals: PartnerReferral[];
  signups: PartnerSignup[];
  onUpdateReferralStatus: (id: string, status: string) => void;
  onUpdateSignupStatus: (id: string, status: string) => void;
  onTriggerTestNotification?: () => void;
  isTestingNotification?: boolean;
}

export default function PartnerSubmissionsView({
  referrals,
  signups,
  onUpdateReferralStatus,
  onUpdateSignupStatus,
  onTriggerTestNotification,
  isTestingNotification,
}: PartnerSubmissionsViewProps) {
  const [subTab, setSubTab] = useState<"referrals" | "signups">("referrals");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredReferrals = referrals.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.clientProgramUrl?.toLowerCase().includes(q) ||
      r.referralCode?.toLowerCase().includes(q) ||
      r.notes?.toLowerCase().includes(q)
    );
  });

  const filteredSignups = signups.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.whatYouDo?.toLowerCase().includes(q) ||
      s.websiteOrLinkedIn?.toLowerCase().includes(q)
    );
  });

  const exportCSV = (type: "referrals" | "signups") => {
    let headers: string[];
    let rows: string[][];

    if (type === "referrals") {
      headers = ["ID", "Partner Name", "Partner Email", "Ref Code", "Client Program URL", "Cohort Date", "Delivery Route", "Notes", "Status", "Created At"];
      rows = referrals.map((r) => [
        r.id || "",
        `"${r.name || ""}"`,
        r.email || "",
        r.referralCode || "",
        `"${r.clientProgramUrl || ""}"`,
        r.cohortDate || "",
        r.previewRecipient || "",
        `"${(r.notes || "").replace(/"/g, '""')}"`,
        r.status || "pending",
        r.createdAt || "",
      ]);
    } else {
      headers = ["ID", "Applicant Name", "Email", "What They Do", "Group Clients Count", "Website / LinkedIn", "Status", "Created At"];
      rows = signups.map((s) => [
        s.id || "",
        `"${s.name || ""}"`,
        s.email || "",
        `"${s.whatYouDo || ""}"`,
        s.groupClientsCount || "",
        `"${s.websiteOrLinkedIn || ""}"`,
        s.status || "pending",
        s.createdAt || "",
      ]);
    }

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `portalbuild-partner-${type}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 space-y-4">
      {/* Top Bar with Counts and Subtab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-white/[0.08] p-4 rounded-xl shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Partner Programme Submissions</h2>
            <span className="text-[10px] font-mono uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded">
              Live Forms Tracker
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Direct intake from <code className="text-orange-300">/partners</code> (Client Referrals & Partner Code Requests).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportCSV(subTab)}
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

      {/* Subtab Selector */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 shrink-0">
        <button
          onClick={() => {
            setSubTab("referrals");
            setSelectedItem(null);
          }}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            subTab === "referrals"
              ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
              : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
          }`}
        >
          <span>1. Client Referrals</span>
          <span className="px-1.5 py-0.2 bg-white/10 rounded text-[10px]">{referrals.length}</span>
        </button>

        <button
          onClick={() => {
            setSubTab("signups");
            setSelectedItem(null);
          }}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            subTab === "signups"
              ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
              : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
          }`}
        >
          <span>2. Partner Code & Kit Signups</span>
          <span className="px-1.5 py-0.2 bg-white/10 rounded text-[10px]">{signups.length}</span>
        </button>

        {/* Search */}
        <div className="ml-auto relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${subTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/[0.1] focus:border-orange-500/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Content Split or Table */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        {/* Left Table / List */}
        <div className={`flex-1 border border-white/[0.08] bg-slate-900/40 rounded-xl overflow-y-auto scrollbar-thin ${selectedItem ? "hidden lg:block lg:w-1/2" : "w-full"}`}>
          {subTab === "referrals" ? (
            filteredReferrals.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                {referrals.length === 0 ? "No partner client referrals recorded yet." : "No referrals match your search."}
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {filteredReferrals.map((ref) => {
                  const isSelected = selectedItem?.id === ref.id;
                  return (
                    <div
                      key={ref.id}
                      onClick={() => setSelectedItem(ref)}
                      className={`p-4 hover:bg-white/[0.02] cursor-pointer transition-colors ${
                        isSelected ? "bg-orange-500/[0.06] border-l-2 border-orange-500" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">{ref.name}</span>
                            {ref.referralCode && (
                              <span className="font-mono text-[10px] uppercase font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                                {ref.referralCode}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{ref.email}</span>
                        </div>

                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                            ref.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : ref.status === "in_contact"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {ref.status || "pending"}
                        </span>
                      </div>

                      <div className="mt-2 text-xs">
                        <span className="text-slate-500 text-[11px] font-mono">Client Link: </span>
                        <a
                          href={ref.clientProgramUrl.startsWith("http") ? ref.clientProgramUrl : "https://" + ref.clientProgramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-orange-400 hover:underline inline-flex items-center gap-1 font-mono break-all"
                        >
                          <span>{ref.clientProgramUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>

                      {ref.notes && (
                        <p className="mt-1.5 text-xs text-slate-400 bg-slate-950/40 p-2 rounded border border-white/[0.04] line-clamp-2 italic">
                          "{ref.notes}"
                        </p>
                      )}

                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>Cohort: {ref.cohortDate || "Flexible"}</span>
                        <span>{new Date(ref.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            filteredSignups.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                {signups.length === 0 ? "No partner signups recorded yet." : "No signups match your search."}
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {filteredSignups.map((sign) => {
                  const isSelected = selectedItem?.id === sign.id;
                  return (
                    <div
                      key={sign.id}
                      onClick={() => setSelectedItem(sign)}
                      className={`p-4 hover:bg-white/[0.02] cursor-pointer transition-colors ${
                        isSelected ? "bg-orange-500/[0.06] border-l-2 border-orange-500" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-semibold text-sm text-white block">{sign.name}</span>
                          <span className="text-xs text-slate-400">{sign.email}</span>
                        </div>

                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                            sign.status === "code_issued"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {sign.status || "pending"}
                        </span>
                      </div>

                      <div className="mt-2 text-xs font-mono text-slate-300">
                        <span className="text-slate-500">Service: </span>
                        <span className="text-orange-300">{sign.whatYouDo}</span>
                        <span className="text-slate-500 ml-2">Clients: </span>
                        <span className="text-white font-bold">{sign.groupClientsCount}</span>
                      </div>

                      {sign.websiteOrLinkedIn && (
                        <div className="mt-1 text-xs">
                          <a
                            href={sign.websiteOrLinkedIn.startsWith("http") ? sign.websiteOrLinkedIn : "https://" + sign.websiteOrLinkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                          >
                            <span>{sign.websiteOrLinkedIn}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </div>
                      )}

                      <div className="mt-2 text-[10px] font-mono text-slate-500 text-right">
                        {new Date(sign.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Right Detail Pane */}
        {selectedItem && (
          <div className="flex-1 border border-white/[0.08] bg-slate-900/60 rounded-xl p-5 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 block">
                  {subTab === "referrals" ? "Client Referral Dossier" : "Partner Application Dossier"}
                </span>
                <h3 className="text-lg font-bold text-white">{selectedItem.name}</h3>
                <a href={`mailto:${selectedItem.email}`} className="text-xs text-orange-400 hover:underline font-mono">
                  {selectedItem.email}
                </a>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs font-mono text-slate-500 hover:text-white px-2 py-1 rounded border border-white/5"
              >
                Close ✕
              </button>
            </div>

            {/* Quick Status Setter */}
            <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-lg border border-white/[0.04]">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide block">
                Update Submission Pipeline Stage:
              </span>
              <div className="flex gap-2 flex-wrap">
                {subTab === "referrals" ? (
                  <>
                    {["pending_partner_review", "in_contact", "completed", "archived"].map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateReferralStatus(selectedItem.id, st)}
                        className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider border cursor-pointer ${
                          selectedItem.status === st
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-slate-900 text-slate-400 border-white/10 hover:border-white/30"
                        }`}
                      >
                        {st.replace(/_/g, " ")}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {["pending_partner_approval", "code_issued", "rejected"].map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateSignupStatus(selectedItem.id, st)}
                        className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider border cursor-pointer ${
                          selectedItem.status === st
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-slate-900 text-slate-400 border-white/10 hover:border-white/30"
                        }`}
                      >
                        {st.replace(/_/g, " ")}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Detailed Properties */}
            <div className="space-y-3 text-xs">
              {subTab === "referrals" ? (
                <>
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-white/[0.05] space-y-2">
                    <div>
                      <span className="text-slate-500 font-mono text-[10px] uppercase block">Client Program Page</span>
                      <a
                        href={selectedItem.clientProgramUrl.startsWith("http") ? selectedItem.clientProgramUrl : "https://" + selectedItem.clientProgramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:underline font-mono text-sm inline-flex items-center gap-1.5 break-all mt-0.5"
                      >
                        <span>{selectedItem.clientProgramUrl}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04]">
                      <div>
                        <span className="text-slate-500 font-mono text-[10px] uppercase block">Partner Ref Code</span>
                        <span className="font-mono font-bold text-white">{selectedItem.referralCode || "None specified"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-mono text-[10px] uppercase block">Target Cohort Date</span>
                        <span className="text-slate-300 font-mono">{selectedItem.cohortDate || "Not specified"}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 font-mono text-[10px] uppercase block">Preview Hand-off Mode</span>
                      <span className="text-emerald-400 font-medium font-sans">
                        {selectedItem.previewRecipient === "to_client"
                          ? "Send preview directly to Client (cc Partner)"
                          : "Send preview to Partner to present to client"}
                      </span>
                    </div>

                    {selectedItem.notes && (
                      <div>
                        <span className="text-slate-500 font-mono text-[10px] uppercase block mb-1">Context & Intake Notes</span>
                        <div className="bg-slate-900 p-2.5 rounded border border-white/[0.08] text-slate-200 leading-relaxed font-sans">
                          {selectedItem.notes}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selectedItem.email}?subject=Your%20Client%20Referral%20to%20PortalBuild%20(${encodeURIComponent(selectedItem.clientProgramUrl)})`}
                      className="flex-1 py-2 px-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-center rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Partner ({selectedItem.name})</span>
                    </a>

                    <button
                      onClick={() => copyToClipboard(JSON.stringify(selectedItem, null, 2), selectedItem.id)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 font-mono"
                    >
                      {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === selectedItem.id ? "Copied" : "JSON"}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-white/[0.05] space-y-2">
                    <div>
                      <span className="text-slate-500 font-mono text-[10px] uppercase block">Applicant Role / Specialization</span>
                      <span className="text-sm font-semibold text-white block mt-0.5">{selectedItem.whatYouDo}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-mono text-[10px] uppercase block">Number of Group Programme Clients</span>
                      <span className="text-sm text-emerald-400 font-bold font-mono">{selectedItem.groupClientsCount}</span>
                    </div>

                    {selectedItem.websiteOrLinkedIn && (
                      <div>
                        <span className="text-slate-500 font-mono text-[10px] uppercase block">Website or LinkedIn</span>
                        <a
                          href={selectedItem.websiteOrLinkedIn.startsWith("http") ? selectedItem.websiteOrLinkedIn : "https://" + selectedItem.websiteOrLinkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline font-mono inline-flex items-center gap-1 mt-0.5"
                        >
                          <span>{selectedItem.websiteOrLinkedIn}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/[0.04]">
                      <span className="text-slate-500 font-mono text-[10px] uppercase block">Submitted At</span>
                      <span className="font-mono text-slate-400">{new Date(selectedItem.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selectedItem.email}?subject=Your%20PortalBuild%20Partner%20Code%20%26%20Partner%20Kit&body=Hi%20${encodeURIComponent(selectedItem.name)},%0A%0AWelcome%20to%20the%20PortalBuild%20Partner%20Programme!%0A%0AYour%20referral%20code%20is:%20${encodeURIComponent(selectedItem.name.replace(/\s+/g, '').toUpperCase().slice(0, 8))}%0A%0AYou%20can%20start%20referring%20clients%20here:%20https://getportalbuild.com/partners`}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Issue Code to {selectedItem.name}</span>
                    </a>

                    <button
                      onClick={() => copyToClipboard(JSON.stringify(selectedItem, null, 2), selectedItem.id)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 font-mono"
                    >
                      {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === selectedItem.id ? "Copied" : "JSON"}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
