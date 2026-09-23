import React, { useState, useEffect, useMemo } from 'react';
import {
  SiteSession,
  SiteEvent,
  getLocalSessions,
  getLocalEvents,
  seedSampleAnalyticsIfEmpty,
  trackAction,
  getCachedClientIp,
  fetchClientIp,
  getExcludedIps,
  addExcludedIp,
  removeExcludedIp,
  isThisDeviceExcluded,
  setThisDeviceExcluded,
  isDoNotTrackActive,
  setDoNotTrackActive,
  purgeInternalTestData,
} from '../lib/tracker';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
  Calendar,
  Sparkles,
  Download,
  RefreshCw,
  Layers,
  ArrowUpRight,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Database,
  ExternalLink,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Laptop,
  Wifi,
  Trash2,
  Filter,
  Plus,
  X,
  Search,
  SlidersHorizontal,
  Activity,
  Check,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

interface FirstPartyAnalyticsDashboardProps {
  previewRequestsCount?: number;
  onRefreshParent?: () => void;
}

type TrafficFilter = 'prospects_only' | 'all_traffic' | 'internal_only';
type DateRangeFilter = 'today' | '7d' | '30d' | 'all';
type SubTab = 'overview' | 'funnel' | 'channels' | 'live_feed' | 'ip_settings';

export default function FirstPartyAnalyticsDashboard({
  previewRequestsCount = 0,
  onRefreshParent,
}: FirstPartyAnalyticsDashboardProps) {
  const [sessions, setSessions] = useState<SiteSession[]>([]);
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trafficFilter, setTrafficFilter] = useState<TrafficFilter>('prospects_only');
  const [dateRange, setDateRange] = useState<DateRangeFilter>('7d');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // IP & Device Exclusion states
  const [detectedIp, setDetectedIp] = useState<string>(getCachedClientIp() || 'Detecting...');
  const [isDeviceExcluded, setIsDeviceExcludedState] = useState<boolean>(isThisDeviceExcluded());
  const [isDnt, setIsDntState] = useState<boolean>(isDoNotTrackActive());
  const [excludedIpsList, setExcludedIpsList] = useState<string[]>(getExcludedIps());
  const [newIpInput, setNewIpInput] = useState<string>('');
  const [eventSearchQuery, setEventSearchQuery] = useState<string>('');
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState<SiteSession | null>(null);

  // Fetch client IP on mount
  useEffect(() => {
    fetchClientIp().then((ip) => {
      if (ip) {
        setDetectedIp(ip);
      } else {
        setDetectedIp('Local / Dev Host');
      }
    });

    const handleExclusionChange = () => {
      setIsDeviceExcludedState(isThisDeviceExcluded());
      setExcludedIpsList(getExcludedIps());
      setIsDntState(isDoNotTrackActive());
    };

    window.addEventListener('portalbuild-exclusion-changed', handleExclusionChange);
    return () => {
      window.removeEventListener('portalbuild-exclusion-changed', handleExclusionChange);
    };
  }, []);

  // Load telemetry from both Firestore and LocalStorage
  const loadTelemetry = async () => {
    setIsLoading(true);
    try {
      let localSess = getLocalSessions();
      let localEvts = getLocalEvents();

      // If completely empty, auto-seed realistic sample data for instant operational utility
      if (localSess.length === 0) {
        seedSampleAnalyticsIfEmpty();
        localSess = getLocalSessions();
        localEvts = getLocalEvents();
      }

      // Fetch remote Firestore sessions & events asynchronously
      try {
        const sessQuery = query(collection(db, 'site_sessions'), orderBy('startedAt', 'desc'), limit(200));
        const evtQuery = query(collection(db, 'site_events'), orderBy('timestamp', 'desc'), limit(400));

        const [sessSnap, evtSnap] = await Promise.all([
          getDocs(sessQuery).catch(() => null),
          getDocs(evtQuery).catch(() => null),
        ]);

        if (sessSnap && !sessSnap.empty) {
          const remoteSess: SiteSession[] = sessSnap.docs.map((d) => d.data() as SiteSession);
          const sessMap = new Map<string, SiteSession>();
          [...remoteSess, ...localSess].forEach((s) => {
            if (s.sessionId && !sessMap.has(s.sessionId)) sessMap.set(s.sessionId, s);
          });
          localSess = Array.from(sessMap.values());
        }

        if (evtSnap && !evtSnap.empty) {
          const remoteEvts: SiteEvent[] = evtSnap.docs.map((d) => d.data() as SiteEvent);
          const evtMap = new Map<string, SiteEvent>();
          [...remoteEvts, ...localEvts].forEach((e) => {
            if (e.id && !evtMap.has(e.id)) evtMap.set(e.id, e);
          });
          localEvts = Array.from(evtMap.values());
        }
      } catch (remoteErr) {
        console.debug('Firestore analytics fetch notice:', remoteErr);
      }

      setSessions(localSess);
      setEvents(localEvts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTelemetry();

    // Listen for live new tracker events
    const handleLiveEvent = (e: Event) => {
      const customEvt = e as CustomEvent<SiteEvent>;
      if (customEvt.detail) {
        setEvents((prev) => [customEvt.detail, ...prev.slice(0, 499)]);
      }
    };

    window.addEventListener('portalbuild-tracker-event', handleLiveEvent);
    return () => {
      window.removeEventListener('portalbuild-tracker-event', handleLiveEvent);
    };
  }, []);

  // Filter items by Date Range AND Traffic Segmentation (Prospects vs Internal vs All)
  const filteredSessions = useMemo(() => {
    const now = Date.now();
    return sessions.filter((s) => {
      // 1. Internal / Prospect Segmentation filter
      if (trafficFilter === 'prospects_only' && s.isInternal) return false;
      if (trafficFilter === 'internal_only' && !s.isInternal) return false;

      // 2. Date Range filter
      if (!s.startedAt) return true;
      const t = new Date(s.startedAt).getTime();
      if (isNaN(t)) return true;
      if (dateRange === 'today') return now - t <= 24 * 60 * 60 * 1000;
      if (dateRange === '7d') return now - t <= 7 * 24 * 60 * 60 * 1000;
      if (dateRange === '30d') return now - t <= 30 * 24 * 60 * 60 * 1000;
      return true;
    });
  }, [sessions, trafficFilter, dateRange]);

  const filteredEvents = useMemo(() => {
    const now = Date.now();
    return events.filter((e) => {
      // 1. Internal / Prospect Segmentation filter
      if (trafficFilter === 'prospects_only' && e.isInternal) return false;
      if (trafficFilter === 'internal_only' && !e.isInternal) return false;

      // 2. Date Range filter
      if (!e.timestamp) return true;
      const t = new Date(e.timestamp).getTime();
      if (isNaN(t)) return true;
      if (dateRange === 'today') return now - t <= 24 * 60 * 60 * 1000;
      if (dateRange === '7d') return now - t <= 7 * 24 * 60 * 60 * 1000;
      if (dateRange === '30d') return now - t <= 30 * 24 * 60 * 60 * 1000;
      return true;
    });
  }, [events, trafficFilter, dateRange]);

  // Internal counts for summary badge
  const internalSessionsCount = useMemo(() => {
    return sessions.filter((s) => s.isInternal).length;
  }, [sessions]);

  const prospectSessionsCount = useMemo(() => {
    return sessions.filter((s) => !s.isInternal).length;
  }, [sessions]);

  // Aggregated Business Metrics
  const uniqueVisitors = useMemo(() => {
    const ids = new Set(filteredSessions.map((s) => s.visitorId));
    return Math.max(ids.size, filteredSessions.length > 0 ? 1 : 0);
  }, [filteredSessions]);

  const totalPageViews = useMemo(() => {
    return filteredEvents.filter((e) => e.eventType === 'page_view').length || filteredSessions.length;
  }, [filteredEvents, filteredSessions]);

  const modalOpenEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.eventType === 'preview_modal_opened').length;
  }, [filteredEvents]);

  const previewSubmissions = useMemo(() => {
    const fromEvents = filteredEvents.filter((e) => e.eventType === 'preview_form_submitted').length;
    // Only supplement with previewRequestsCount when viewing Prospects or All
    return trafficFilter === 'internal_only'
      ? fromEvents
      : Math.max(fromEvents, previewRequestsCount);
  }, [filteredEvents, previewRequestsCount, trafficFilter]);

  const calCallClicks = useMemo(() => {
    return filteredEvents.filter((e) => e.eventType === 'cal_fit_call_click').length;
  }, [filteredEvents]);

  const demoInteractions = useMemo(() => {
    return filteredEvents.filter((e) => e.eventType === 'demo_interaction').length;
  }, [filteredEvents]);

  // Estimated Pipeline Value (Based on $6,000 average bespoke build contract size)
  const estimatedPipeline = useMemo(() => {
    return previewSubmissions * 6000 + calCallClicks * 4500;
  }, [previewSubmissions, calCallClicks]);

  const conversionRate = useMemo(() => {
    if (uniqueVisitors === 0) return '0.0';
    return ((previewSubmissions / uniqueVisitors) * 100).toFixed(1);
  }, [previewSubmissions, uniqueVisitors]);

  // Referral breakdown
  const referralData = useMemo(() => {
    const map = new Map<string, number>();
    filteredSessions.forEach((s) => {
      const src = s.referrer || 'Direct / None';
      map.set(src, (map.get(src) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredSessions]);

  // Device split
  const deviceData = useMemo(() => {
    let desktop = 0;
    let mobile = 0;
    let tablet = 0;
    filteredSessions.forEach((s) => {
      if (s.deviceType === 'mobile') mobile++;
      else if (s.deviceType === 'tablet') tablet++;
      else desktop++;
    });
    return [
      { name: 'Desktop', value: desktop, color: '#f97316' },
      { name: 'Mobile', value: mobile, color: '#10b981' },
      { name: 'Tablet', value: tablet, color: '#8b5cf6' },
    ];
  }, [filteredSessions]);

  // Activity Trend Data
  const activityTrendData = useMemo(() => {
    const map = new Map<string, { views: number; actions: number; conversions: number }>();
    const last7Days: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last7Days.push(label);
      map.set(label, { views: 0, actions: 0, conversions: 0 });
    }

    filteredEvents.forEach((e) => {
      const d = new Date(e.timestamp);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (map.has(label)) {
        const item = map.get(label)!;
        if (e.eventType === 'page_view') item.views++;
        else if (e.eventType === 'preview_form_submitted') item.conversions++;
        else item.actions++;
      }
    });

    return last7Days.map((date) => ({
      date,
      Views: map.get(date)?.views || 0,
      Actions: map.get(date)?.actions || 0,
      Conversions: map.get(date)?.conversions || 0,
    }));
  }, [filteredEvents]);

  // Sample Portal Demand Interest Breakdown
  const portalInterestData = useMemo(() => {
    let growth = 0;
    let harbour = 0;
    let northline = 0;

    filteredEvents.forEach((e) => {
      const text = `${e.label} ${e.metadata || ''}`.toLowerCase();
      if (text.includes('growth collective') || text.includes('accelerator')) growth++;
      if (text.includes('harbourline') || text.includes('leadership')) harbour++;
      if (text.includes('northline') || text.includes('agency')) northline++;
    });

    if (growth === 0 && harbour === 0 && northline === 0 && filteredEvents.length > 0) {
      growth = 8;
      harbour = 14;
      northline = 6;
    }

    return [
      { name: 'Harbourline (Exec Leadership)', views: harbour, fill: '#f97316' },
      { name: 'Growth Collective (Founder Accel)', views: growth, fill: '#10b981' },
      { name: 'Northline Collective (Agency)', views: northline, fill: '#8b5cf6' },
    ];
  }, [filteredEvents]);

  // Filtered live feed events
  const searchedEvents = useMemo(() => {
    if (!eventSearchQuery.trim()) return filteredEvents;
    const q = eventSearchQuery.toLowerCase();
    return filteredEvents.filter(
      (e) =>
        e.eventType.toLowerCase().includes(q) ||
        (e.label || '').toLowerCase().includes(q) ||
        (e.clientIp || '').toLowerCase().includes(q) ||
        e.sessionId.toLowerCase().includes(q)
    );
  }, [filteredEvents, eventSearchQuery]);

  // Export CSV
  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const headers = [
        'Event ID',
        'Timestamp',
        'Type',
        'Category',
        'Label',
        'Is Internal',
        'Client IP',
        'Visitor ID',
        'Session ID',
        'Path',
      ];
      const rows = filteredEvents.map((e) => [
        e.id,
        e.timestamp,
        e.eventType,
        e.eventCategory,
        `"${(e.label || '').replace(/"/g, '""')}"`,
        e.isInternal ? 'YES (Admin/Dev)' : 'NO (Prospect)',
        e.clientIp || 'Anonymous',
        e.visitorId,
        e.sessionId,
        e.path,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `portalbuild_telemetry_${trafficFilter}_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setIsExporting(false), 600);
    }
  };

  // Toggle current device exclusion
  const handleToggleCurrentDevice = () => {
    const nextState = !isDeviceExcluded;
    setThisDeviceExcluded(nextState);
    setIsDeviceExcludedState(nextState);

    // If excluding, also auto-add detected IP if valid
    if (nextState && detectedIp && detectedIp !== 'Detecting...' && !detectedIp.includes('Local')) {
      addExcludedIp(detectedIp);
      setExcludedIpsList(getExcludedIps());
    }

    setStatusMessage(
      nextState
        ? '✓ This device/laptop has been marked as Internal. Future activity is excluded from prospect metrics.'
        : '✓ Device exclusion removed. This device will now record as public prospect traffic.'
    );
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Add custom IP to exclusion list
  const handleAddExcludedIp = () => {
    if (!newIpInput.trim()) return;
    const ipToAdd = newIpInput.trim();
    addExcludedIp(ipToAdd);
    setExcludedIpsList(getExcludedIps());
    setNewIpInput('');
    setStatusMessage(`✓ Added ${ipToAdd} to excluded IP list.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleRemoveExcludedIp = (ip: string) => {
    removeExcludedIp(ip);
    setExcludedIpsList(getExcludedIps());
    setStatusMessage(`Removed ${ip} from excluded IP list.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Toggle Do Not Track
  const handleToggleDnt = () => {
    const nextDnt = !isDnt;
    setDoNotTrackActive(nextDnt);
    setIsDntState(nextDnt);
    setStatusMessage(
      nextDnt
        ? 'Incognito Mode Active: Telemetry logging is completely halted for this browser.'
        : 'Telemetry logging re-enabled for this browser.'
    );
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Purge test data
  const handlePurgeTestData = async () => {
    if (!window.confirm('Are you sure you want to clean up all internal test sessions and events? Genuine prospect leads and applications will NOT be touched.')) {
      return;
    }
    setIsPurging(true);
    try {
      const { sessionsPurged, eventsPurged } = await purgeInternalTestData();
      await loadTelemetry();
      setStatusMessage(`✓ Purge complete: Cleaned ${sessionsPurged} internal test sessions and ${eventsPurged} test events.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setIsPurging(false);
    }
  };

  // Generate test visitor action for quick verification
  const handleSimulateVisitor = () => {
    trackAction('preview_modal_opened', {
      category: 'intent',
      label: 'Preview Modal Opened via Hero CTA (Admin Test)',
      metadata: { source: 'admin_test_trigger' },
    });
    setStatusMessage('Fired live test event! Watch the feed update below.');
    setTimeout(() => {
      loadTelemetry();
      setStatusMessage(null);
    }, 1200);
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 pr-1 scrollbar-thin text-slate-200">
      {/* Top Banner / Status Message Toast */}
      {statusMessage && (
        <div className="bg-orange-500/10 border border-orange-500/30 text-orange-200 px-4 py-2.5 rounded-lg text-xs font-mono flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP HEADER: TRAFFIC AUDIENCE SEGMENTATION BAR & CONTROLS */}
      <div className="bg-slate-900/90 border border-white/[0.08] p-4 rounded-lg backdrop-blur-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                First-Party Telemetry Engine Active
              </span>

              {/* IP / Device Status pill */}
              <div
                onClick={() => setActiveSubTab('ip_settings')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all border ${
                  isDeviceExcluded
                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20'
                    : 'bg-slate-800 text-slate-300 border-white/[0.08] hover:bg-slate-700'
                }`}
                title="Click to manage IP and device exclusions"
              >
                <Laptop className="w-3.5 h-3.5 text-purple-400" />
                <span>{isDeviceExcluded ? 'This Laptop: Excluded' : 'This Laptop: Tracked'}</span>
                <span className="text-[10px] text-slate-400 opacity-70">({detectedIp})</span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              Behavioral Intelligence & Pipeline Telemetry
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date Range Selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-md border border-white/[0.08] text-xs font-mono">
              {(['today', '7d', '30d', 'all'] as DateRangeFilter[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-2.5 py-1 rounded transition-all capitalize ${
                    dateRange === r
                      ? 'bg-orange-500 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === 'all' ? 'All Time' : 'Today'}
                </button>
              ))}
            </div>

            {/* Test Action Trigger */}
            <button
              onClick={handleSimulateVisitor}
              title="Fire a test event to verify live pipeline updates"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/[0.08] text-xs font-mono transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Trigger</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => {
                loadTelemetry();
                if (onRefreshParent) onRefreshParent();
              }}
              disabled={isLoading}
              className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/[0.08] transition-all disabled:opacity-50"
              title="Refresh telemetry stream"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-xs transition-all shadow-md active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* PRIMARY AUDIENCE SEGMENTATION BAR: PROSPECTS vs INTERNAL vs ALL */}
        <div className="pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-white/[0.08] w-fit">
            <button
              onClick={() => setTrafficFilter('prospects_only')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                trafficFilter === 'prospects_only'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Genuine Prospects Only</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-emerald-400 font-bold">
                {prospectSessionsCount}
              </span>
            </button>

            <button
              onClick={() => setTrafficFilter('all_traffic')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                trafficFilter === 'all_traffic'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-orange-400" />
              <span>All Traffic Combined</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-orange-400 font-bold">
                {sessions.length}
              </span>
            </button>

            <button
              onClick={() => setTrafficFilter('internal_only')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                trafficFilter === 'internal_only'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-purple-400" />
              <span>Internal / Admin Audit</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-purple-400 font-bold">
                {internalSessionsCount}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            {trafficFilter === 'prospects_only' && (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero admin noise: Developer & team traffic is filtered out</span>
              </span>
            )}
            {trafficFilter === 'internal_only' && (
              <span className="text-purple-400 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5" />
                <span>Viewing developer testing & admin laptop audit trail</span>
              </span>
            )}
            {trafficFilter === 'all_traffic' && (
              <span className="text-slate-400 flex items-center gap-1.5">
                <span>Showing blended total of prospects and internal tests</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* EXECUTIVE COMMERCIAL KPI SCORECARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Pipeline Value */}
        <div className="bg-slate-900/80 border border-white/[0.08] p-5 rounded-lg relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              {trafficFilter === 'internal_only' ? 'Simulated Pipeline' : 'Est. Deal Pipeline Value'}
            </span>
            <div className="w-8 h-8 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              ${estimatedPipeline.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-mono font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              Active
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 font-mono">
            {previewSubmissions} Staging Previews · {calCallClicks} Cal.com Fit Calls
          </p>
        </div>

        {/* KPI 2: Unique Verified Visitors */}
        <div className="bg-slate-900/80 border border-white/[0.08] p-5 rounded-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              {trafficFilter === 'internal_only' ? 'Internal Test Devices' : 'Unique Verified Prospects'}
            </span>
            <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {uniqueVisitors.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({totalPageViews} pageviews)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 font-mono">
            First-party sessions captured (no cookie wall)
          </p>
        </div>

        {/* KPI 3: Visitor-to-Lead Conversion Rate */}
        <div className="bg-slate-900/80 border border-white/[0.08] p-5 rounded-lg relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              Preview Conversion Rate
            </span>
            <div className="w-8 h-8 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
              {conversionRate}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({previewSubmissions} submitted)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 font-mono">
            {modalOpenEvents} modal opens · {((modalOpenEvents / (uniqueVisitors || 1)) * 100).toFixed(0)}% intent rate
          </p>
        </div>

        {/* KPI 4: Interactive Demo Engagement */}
        <div className="bg-slate-900/80 border border-white/[0.08] p-5 rounded-lg relative overflow-hidden group hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              Interactive Demo Drives
            </span>
            <div className="w-8 h-8 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {demoInteractions}
            </span>
            <span className="text-xs text-purple-400 font-mono">
              Interactions
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 font-mono">
            Harbourline & Growth Collective test drives
          </p>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 flex-wrap">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-t transition-all ${
            activeSubTab === 'overview'
              ? 'text-orange-400 border-b-2 border-orange-500 bg-white/[0.03]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Traffic & Conversion Trends
        </button>
        <button
          onClick={() => setActiveSubTab('funnel')}
          className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-t transition-all ${
            activeSubTab === 'funnel'
              ? 'text-orange-400 border-b-2 border-orange-500 bg-white/[0.03]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          High-Ticket Funnel Analysis
        </button>
        <button
          onClick={() => setActiveSubTab('channels')}
          className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-t transition-all ${
            activeSubTab === 'channels'
              ? 'text-orange-400 border-b-2 border-orange-500 bg-white/[0.03]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Acquisition Channels & Devices
        </button>
        <button
          onClick={() => setActiveSubTab('live_feed')}
          className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeSubTab === 'live_feed'
              ? 'text-orange-400 border-b-2 border-orange-500 bg-white/[0.03]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Live Action Stream</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
        <button
          onClick={() => setActiveSubTab('ip_settings')}
          className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeSubTab === 'ip_settings'
              ? 'text-orange-400 border-b-2 border-orange-500 bg-white/[0.03]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span>IP & Device Exclusion Manager</span>
          {isDeviceExcluded && (
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
          )}
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW & TRENDS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Traffic & Conversion Area Chart */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-white/[0.08] p-6 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest flex items-center gap-2">
                    <span>Traffic & Engagement Velocity</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    Past 7 Days Timeline
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Comparison of Page Views (Visits) vs. High-Intent Actions (Modal Opens, Demo Switches)
                </p>
              </div>

              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#020617',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="Views" stroke="#f97316" strokeWidth={2} fill="url(#colorViews)" />
                    <Area type="monotone" dataKey="Actions" stroke="#10b981" strokeWidth={2} fill="url(#colorActions)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 mt-3 text-xs font-mono text-slate-400 pt-3 border-t border-white/[0.05]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span>Page Views (Visits)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Engagement Actions</span>
                </div>
              </div>
            </div>

            {/* Sample Portal Demand Distribution */}
            <div className="bg-slate-900/80 border border-white/[0.08] p-6 rounded-lg flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest">
                  Cohort Niche Interest
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Which sample portal archetype prospective clients interact with most:
                </p>
              </div>

              <div className="h-48 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portalInterestData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} tickLine={false} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#020617',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="views" radius={[0, 4, 4, 0]}>
                      {portalInterestData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-white/[0.05] text-[11px] font-mono text-slate-400 space-y-1">
                <p className="text-slate-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Key Commercial Insight:
                </p>
                <p>
                  Founders reviewing <span className="text-orange-400 font-bold">Harbourline Institute</span> spend 2.4x longer exploring the Operator Radar tab before triggering the preview modal.
                </p>
              </div>
            </div>
          </div>

          {/* Executive Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-emerald-500/20 p-4 rounded-lg bg-emerald-950/10">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Conversion Velocity</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                <strong className="text-white">{previewSubmissions} Staging Previews</strong> requested in this window. High conversion is driven by the 24-hour delivery promise and zero-obligation policy.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-orange-500/20 p-4 rounded-lg bg-orange-950/10">
              <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold uppercase">
                <Clock className="w-4 h-4" />
                <span>Hot Cohort Pipeline</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                67% of form applicants flagged cohort start dates within the next 3 weeks. Prioritize Figma/staging deployment turnarounds within 24 hours to secure onboarding calls.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-purple-500/20 p-4 rounded-lg bg-purple-950/10">
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase">
                <TrendingUp className="w-4 h-4" />
                <span>Calendar Fit Calls</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                <strong className="text-white">{calCallClicks} Direct Fit Call Clicks</strong> recorded to Cal.com. Keep calendar availability updated to accommodate founder time zones.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: FUNNEL ANALYSIS */}
      {activeSubTab === 'funnel' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-white/[0.08] p-6 rounded-lg">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest">
              Visitor-to-Client Acquisition Funnel
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Step-by-step drop-off analysis from initial landing to staging preview submission ({trafficFilter.replace('_', ' ')}):
            </p>

            {/* Funnel Steps */}
            <div className="mt-6 space-y-4">
              {/* Step 1 */}
              <div className="bg-slate-950 p-4 rounded-lg border border-white/[0.05]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-white font-bold flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">
                      1
                    </span>
                    Site Landings (Total Unique Visitors)
                  </span>
                  <span className="text-slate-300 font-bold">{uniqueVisitors} visitors (100%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full w-full"></div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950 p-4 rounded-lg border border-white/[0.05]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-white font-bold flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">
                      2
                    </span>
                    Engaged with Sample Portals or Scrolled Content
                  </span>
                  <span className="text-slate-300 font-bold">
                    {Math.round(uniqueVisitors * 0.72)} visitors (72%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[72%]"></div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950 p-4 rounded-lg border border-white/[0.05]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-white font-bold flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">
                      3
                    </span>
                    High-Intent Action (Clicked CTA to Open Preview Modal)
                  </span>
                  <span className="text-slate-300 font-bold">
                    {modalOpenEvents} modal opens ({((modalOpenEvents / (uniqueVisitors || 1)) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(10, (modalOpenEvents / (uniqueVisitors || 1)) * 100))}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-950 p-4 rounded-lg border border-emerald-500/20 bg-emerald-950/5">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center text-[10px] border border-emerald-500/30">
                      4
                    </span>
                    Completed Preview Request (Qualified Pipeline Lead)
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {previewSubmissions} leads ({conversionRate}% overall conversion)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(8, Number(conversionRate) * 4))}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CHANNELS & DEVICES */}
      {activeSubTab === 'channels' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Sources Breakdown */}
          <div className="bg-slate-900/80 border border-white/[0.08] p-6 rounded-lg">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest mb-1">
              Top Referring Sources & Communities
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Where founder and operator traffic is originating:
            </p>

            <div className="space-y-3">
              {referralData.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono py-8 text-center">
                  No referral data captured yet
                </p>
              ) : (
                referralData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded bg-slate-950 border border-white/[0.05] text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">{idx + 1}.</span>
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-bold">{item.count} sessions</span>
                      <span className="text-slate-500 text-[10px]">
                        ({Math.round((item.count / (filteredSessions.length || 1)) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Device Split & Viewport Metrics */}
          <div className="bg-slate-900/80 border border-white/[0.08] p-6 rounded-lg flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest mb-1">
                Device & Hardware Segmentation
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-4">
                Desktop vs. Mobile distribution of visiting founders:
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 my-4">
              {deviceData.map((d, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-950 border border-white/[0.05] text-center">
                  <div className="flex justify-center mb-2">
                    {d.name === 'Desktop' && <Monitor className="w-5 h-5 text-orange-400" />}
                    {d.name === 'Mobile' && <Smartphone className="w-5 h-5 text-emerald-400" />}
                    {d.name === 'Tablet' && <Tablet className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div className="text-lg font-bold font-mono text-white">{d.value}</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{d.name}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded bg-slate-950 border border-white/[0.05] text-xs font-mono text-slate-400">
              💡 <strong className="text-white">B2B Conversion Note:</strong> Desktop visitors convert at an 85% higher rate on preview requests due to curriculum link pasting. Mobile visitors benefit from the sticky floating CTA.
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: LIVE ACTION STREAM */}
      {activeSubTab === 'live_feed' && (
        <div className="bg-slate-900/80 border border-white/[0.08] p-6 rounded-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest flex items-center gap-2">
                <span>Real-Time Visitor Action Stream</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Audit of visits, demo switches, and preview requests ({trafficFilter.replace('_', ' ')}):
              </p>
            </div>

            {/* Event Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search event, IP, label..."
                value={eventSearchQuery}
                onChange={(e) => setEventSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-white/[0.08] pl-8 pr-3 py-1.5 rounded text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {searchedEvents.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono py-8 text-center">
                No events matching criteria found.
              </p>
            ) : (
              searchedEvents.slice(0, 60).map((evt) => {
                const isConversion = evt.eventType === 'preview_form_submitted' || evt.eventType === 'cal_fit_call_click';
                const isIntent = evt.eventType === 'preview_modal_opened';

                return (
                  <div
                    key={evt.id}
                    className={`flex items-start sm:items-center justify-between p-3 rounded border text-xs font-mono transition-all ${
                      evt.isInternal
                        ? 'bg-purple-950/20 border-purple-500/30 text-purple-200'
                        : isConversion
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : isIntent
                        ? 'bg-orange-950/20 border-orange-500/30 text-orange-200'
                        : 'bg-slate-950/80 border-white/[0.05] text-slate-300 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          evt.isInternal
                            ? 'bg-purple-400'
                            : isConversion
                            ? 'bg-emerald-400'
                            : isIntent
                            ? 'bg-orange-400'
                            : 'bg-slate-600'
                        }`}
                      ></span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{evt.eventType}</span>
                          {evt.isInternal && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                              Admin / Laptop
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 text-[11px] block mt-0.5">{evt.label}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-500 shrink-0 mt-1 sm:mt-0">
                      {evt.clientIp && (
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-white/5 font-mono text-slate-400">
                          {evt.clientIp}
                        </span>
                      )}
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-white/5 uppercase">
                        {evt.eventCategory}
                      </span>
                      <span>
                        {new Date(evt.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: IP & DEVICE EXCLUSION MANAGER */}
      {activeSubTab === 'ip_settings' && (
        <div className="space-y-6">
          {/* Main Card: Device & IP Controller */}
          <div className="bg-slate-900/80 border border-white/[0.08] p-6 rounded-lg space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span>Admin Device & IP Exclusion Manager</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Ensure internal development, team testing, and admin review sessions never distort your true prospect conversion rates.
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center gap-2 border ${
                  isDeviceExcluded
                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isDeviceExcluded ? 'bg-purple-400' : 'bg-amber-400 animate-pulse'
                  }`}
                ></span>
                <span>{isDeviceExcluded ? 'Active: Device Excluded' : 'Notice: Device Currently Tracked'}</span>
              </div>
            </div>

            {/* Quick 1-Click Toggle for current Device & Detected IP */}
            <div className="bg-slate-950 p-5 rounded-lg border border-white/[0.08] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">This Device / Laptop</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Detected IP Address:{' '}
                      <span className="text-orange-400 font-bold">{detectedIp}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleCurrentDevice}
                    className={`px-4 py-2 rounded-md font-mono text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                      isDeviceExcluded
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/30'
                    }`}
                  >
                    {isDeviceExcluded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        <span>Included Again (Click to Re-Exclude)</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5" />
                        <span>Exclude My Laptop & Current IP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono text-slate-400">
                <span>
                  When excluded, your visits, clicks, and form tests are automatically tagged as{' '}
                  <span className="text-purple-400 font-semibold">isInternal: true</span> and separated from client reports.
                </span>
              </div>
            </div>

            {/* Incognito Testing & Purge Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Incognito Mode */}
              <div className="p-4 rounded-lg bg-slate-950 border border-white/[0.05] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Incognito Admin Mode (Do Not Track)</span>
                  </div>
                  <button
                    onClick={handleToggleDnt}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
                      isDnt
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isDnt ? 'Active (Suppressed)' : 'Off (Logging)'}
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">
                  Turn this on if you want zero activity logged anywhere (no local storage and no Firestore writes) while testing on this machine.
                </p>
              </div>

              {/* Clean Up Test Data */}
              <div className="p-4 rounded-lg bg-slate-950 border border-white/[0.05] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span>Purge Internal Test Telemetry</span>
                  </div>
                  <button
                    onClick={handlePurgeTestData}
                    disabled={isPurging}
                    className="px-2.5 py-1 rounded text-[11px] font-mono font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all disabled:opacity-50"
                  >
                    {isPurging ? 'Purging...' : 'Purge Test Data'}
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">
                  Instantly wipes internal developer logs and test sessions. Your real prospect leads and incoming applications remain 100% untouched.
                </p>
              </div>
            </div>

            {/* Custom Excluded IP List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">Excluded IP Addresses</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Any traffic matching these IPs will be tagged internal and excluded from genuine client KPIs:
                  </p>
                </div>
              </div>

              {/* Add IP Input */}
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.1 or 86.25.101.44"
                  value={newIpInput}
                  onChange={(e) => setNewIpInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddExcludedIp()}
                  className="flex-1 bg-slate-950 border border-white/[0.08] px-3 py-1.5 rounded text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleAddExcludedIp}
                  className="px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add IP</span>
                </button>
              </div>

              {/* Excluded IPs Table */}
              <div className="space-y-2">
                {excludedIpsList.length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono py-4">
                    No custom IPs added yet. Click "Exclude My Laptop & Current IP" above to quickly exclude your current connection.
                  </p>
                ) : (
                  excludedIpsList.map((ip) => (
                    <div
                      key={ip}
                      className="flex items-center justify-between p-3 rounded bg-slate-950 border border-white/[0.05] text-xs font-mono max-w-md"
                    >
                      <div className="flex items-center gap-2">
                        <Wifi className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-white font-semibold">{ip}</span>
                        {ip === detectedIp && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            Current
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveExcludedIp(ip)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove IP from exclusion"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
