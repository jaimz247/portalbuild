import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Loader2, LogIn, LogOut, Key, Shield, Search, 
  CheckCircle2, Clock, Trash2, XCircle, FileText, 
  Globe, Phone, Mail, Award, AlertCircle, BarChart3, TrendingUp, Save
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';

interface Application {
  id: string;
  name: string;
  email: string;
  businessType: string;
  phone?: string;
  website?: string;
  revenue: string;
  bottlenecks: string[];
  features: string[];
  theme?: string;
  notes?: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  // Hardcoded passcode for testing/quick preview bypass
  const BYPASS_PASSCODE = 'elevate2026';

  useEffect(() => {
    // Esc closes dashboard
    const handleClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDashboard();
      }
    };

    const handleOpenAdmin = () => {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    };

    window.addEventListener('open-admin-dashboard', handleOpenAdmin);
    window.addEventListener('keydown', handleClose);

    // Track authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email === 'elevatemensah@gmail.com') {
        setIsAuth(true);
        setFirestoreError(null);
      }
    });

    return () => {
      window.removeEventListener('open-admin-dashboard', handleOpenAdmin);
      window.removeEventListener('keydown', handleClose);
      unsubscribeAuth();
      document.body.style.overflow = 'auto';
    };
  }, []);

  const closeDashboard = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Sync firestore applications group
  useEffect(() => {
    if (!isAuth) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const path = 'applications';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsArr: Application[] = [];
      snapshot.forEach((docSnapshot) => {
        docsArr.push({ id: docSnapshot.id, ...docSnapshot.data() } as Application);
      });
      setApplications(docsArr);
      setLoading(false);
      setFirestoreError(null);
    }, (error) => {
      console.warn("Security rules blocked unauthenticated Firestore query. Loading fallback data.");
      setFirestoreError(error.message);
      setLoading(false);
      
      // Load fallback local applications for demo purposes if rules fail due to login
      const loadedLocal = localStorage.getItem('local_applications');
      if (loadedLocal) {
        setApplications(JSON.parse(loadedLocal));
      } else {
        // Hydrate demo applications standard list
        const demoApps: Application[] = [
          {
            id: 'demo-1',
            name: 'Sarah Jenkins',
            email: 'sarah@elevatedigital.com',
            businessType: 'digital-agency',
            website: 'elevatedigital.com',
            phone: '+1 555-120-4321',
            revenue: '$15,000 - $50,000 / month',
            bottlenecks: ['Scattered workflows', 'WhatsApp chaos', 'Constant follow-ups'],
            features: ['Secure document hub', 'Onboarding checklists', 'Progress tracker'],
            theme: 'Obsidian Dark',
            status: 'approved',
            notes: 'Strong candidate. Let\'s schedule the kickoff sprint.',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            id: 'demo-2',
            name: 'David Chen',
            email: 'david@peakfitness.coach',
            businessType: 'coach-consultant',
            website: 'peakfitness.coach',
            phone: '+44 7700 900077',
            revenue: '$5,000 - $15,000 / month',
            bottlenecks: ['Scattered workflows', 'Spreadsheets chaos'],
            features: ['Secure document hub', 'Integrated billing'],
            theme: 'Royal Sapphire',
            status: 'pending',
            notes: '',
            createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
          },
          {
            id: 'demo-3',
            name: 'Marcus Rowan',
            email: 'marcus@rowanpartners.com',
            businessType: 'high-ticket-service',
            website: 'rowanpartners.com',
            revenue: '$50,000+ / month',
            bottlenecks: ['Constant follow-ups', 'Slow onboarding'],
            features: ['Secure document hub', 'Live chat integration', 'Client billing'],
            theme: 'Emerald Luxe',
            status: 'reviewed',
            notes: 'High business volume. Contact immediately.',
            createdAt: new Date(Date.now() - 3600000 * 25).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 25).toISOString()
          }
        ];
        setApplications(demoApps);
        localStorage.setItem('local_applications', JSON.stringify(demoApps));
      }
    });

    return () => unsubscribe();
  }, [isAuth]);

  // Track notes textarea focus/editing
  useEffect(() => {
    if (selectedApp) {
      setAdminNotes(selectedApp.notes || '');
    } else {
      setAdminNotes('');
    }
  }, [selectedApp]);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setPasscodeError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user.email === 'elevatemensah@gmail.com') {
        setIsAuth(true);
        setFirestoreError(null);
      } else {
        await signOut(auth);
        setPasscodeError('Access Denied. Only elevatemensah@gmail.com is authorized to access the Firestore admin.');
      }
    } catch (err) {
      console.error("Google Auth error:", err);
      setPasscodeError('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    if (passcode === BYPASS_PASSCODE) {
      setIsAuth(true);
    } else {
      setPasscodeError('Invalid administrative passcode. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setIsAuth(false);
    setSelectedApp(null);
  };

  const changeAppStatus = async (appId: string, newStatus: 'pending' | 'reviewed' | 'approved' | 'rejected') => {
    const updatedDate = new Date().toISOString();
    
    // Check if it's a demo record
    if (appId.startsWith('demo-')) {
      const updatedList = applications.map(app => 
        app.id === appId ? { ...app, status: newStatus, updatedAt: updatedDate } : app
      );
      setApplications(updatedList);
      localStorage.setItem('local_applications', JSON.stringify(updatedList));
      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus, updatedAt: updatedDate });
      }
      return;
    }

    // Server write
    const path = `applications/${appId}`;
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: newStatus,
        updatedAt: updatedDate
      });
      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus, updatedAt: updatedDate });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const saveNotes = async () => {
    if (!selectedApp) return;
    setIsSavingNotes(true);
    
    // Check if demo
    if (selectedApp.id.startsWith('demo-')) {
      const updatedList = applications.map(app => 
        app.id === selectedApp.id ? { ...app, notes: adminNotes } : app
      );
      setApplications(updatedList);
      localStorage.setItem('local_applications', JSON.stringify(updatedList));
      setSelectedApp({ ...selectedApp, notes: adminNotes });
      setIsSavingNotes(false);
      return;
    }

    const path = `applications/${selectedApp.id}`;
    try {
      await updateDoc(doc(db, 'applications', selectedApp.id), {
        notes: adminNotes,
        updatedAt: new Date().toISOString()
      });
      setSelectedApp({ ...selectedApp, notes: adminNotes });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const deleteApp = async (appId: string) => {
    if (!window.confirm("Are you absolutely sure you want to delete this application record? This cannot be undone.")) {
      return;
    }

    // Demo check
    if (appId.startsWith('demo-')) {
      const updatedList = applications.filter(app => app.id !== appId);
      setApplications(updatedList);
      localStorage.setItem('local_applications', JSON.stringify(updatedList));
      setSelectedApp(null);
      return;
    }

    const path = `applications/${appId}`;
    try {
      await deleteDoc(doc(db, 'applications', appId));
      setSelectedApp(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Filter application list
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.website && app.website.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalSubmissions = applications.length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const conversionRate = totalSubmissions > 0 ? Math.round((approvedCount / totalSubmissions) * 100) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md overflow-hidden"
        >
          {/* Main Full-Size View container */}
          <div className="w-full h-full flex flex-col p-6 max-w-7xl mx-auto relative">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-600/10 border border-orange-500/20 text-orange-500">
                  <Shield className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                    PortalBuild <span className="text-xs bg-slate-800 border border-white/10 px-2.5 py-0.5 tracking-wider uppercase font-mono text-slate-400">Admin Panel</span>
                  </h1>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Control center for prospective pilot approvals</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {isAuth && (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 text-slate-400 hover:text-orange-400 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
                
                <button 
                  onClick={closeDashboard}
                  className="p-2 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all rounded cursor-pointer"
                  aria-label="Close Admin Dashboard"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="flex-1 overflow-hidden py-6">
              {!isAuth ? (
                /* Access Control Login Screen */
                <div className="max-w-md mx-auto my-12 bg-slate-900 border border-white/10 p-8 shadow-2xl relative">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500/50 via-slate-800 to-transparent"></div>
                  
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-full border border-orange-500/20 mx-auto flex items-center justify-center mb-4 bg-orange-500/5">
                      <Key className="w-5 h-5 text-orange-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Admin Authentication</h2>
                    <p className="text-xs text-slate-400 mt-2 font-mono max-w-xs mx-auto leading-relaxed">
                      Secured by Firestore Security Rules. Authenticate credentials to sync live applications database.
                    </p>
                  </div>

                  {passcodeError && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>{passcodeError}</div>
                    </div>
                  )}

                  {/* Option 1: Official Google Sign-In for elevatemensah@gmail.com */}
                  <div className="space-y-4">
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isAuthenticating}
                      className="w-full flex items-center justify-center gap-3 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-white/10 hover:border-white/20 py-3 text-sm font-bold text-white transition-all duration-300 transform active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isAuthenticating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Checking Google profile...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.281 1.09 15.545 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.79-.08-1.4-.26-1.925H12.24z"/>
                          </svg>
                          Sign In with Google
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center my-6">
                      <div className="h-px bg-white/10 flex-1"></div>
                      <span className="text-[10px] uppercase font-mono tracking-widest px-3 text-slate-500 font-bold">OR</span>
                      <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    {/* Option 2: Passcode Bypass for testing preview */}
                    <form onSubmit={handlePasscodeLogin} className="space-y-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Reviewer Bypass Code</label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          placeholder="Enter passcode (Hint: elevate2026)"
                          value={passcode}
                          onChange={(e) => setPasscode(e.target.value)}
                          className="flex-1 bg-slate-950 border border-white/10 hover:border-white/20 focus:border-orange-500/50 focus:outline-none px-4 py-2 text-sm text-white"
                        />
                        <button
                          type="submit"
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center"
                        >
                          Unlock
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 text-center uppercase tracking-normal mt-2 font-mono">
                        💡 Use passcode <strong className="text-orange-400 select-all font-mono">elevate2026</strong> for sandbox inspection & demo mode.
                      </p>
                    </form>
                  </div>
                </div>
              ) : (
                /* Authenticated Workspace Content */
                <div className="w-full h-full flex flex-col gap-6 overflow-hidden">
                  
                  {/* Real-time Indicator or Warning */}
                  {firestoreError ? (
                    <div className="bg-amber-600/10 border border-amber-500/20 px-4 py-3 text-xs text-amber-500 font-sans flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 shrink-0 flex-none" />
                      <div className="flex-1">
                        Viewing local Sandbox/Demo Applications because live query failed (requires Google login as elevatemensah@gmail.com). Everything works perfectly as a dynamic prototype list!
                      </div>
                      <button 
                        onClick={() => setFirestoreError(null)}
                        className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 text-amber-500 transition-colors cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-600/5 border border-green-500/10 px-4 py-2.5 text-xs text-green-400 font-sans flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                      <span className="font-mono uppercase tracking-wider text-[10px] font-bold">Cloud Synced</span>
                      <span className="text-slate-400">• Dynamic onSnapshot subscription to live applications collection.</span>
                    </div>
                  )}

                  {/* Statistics Ticker Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
                    <div className="bg-white/[0.01] border border-white/5 p-4 relative overflow-hidden">
                      <div className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold mb-1">Total Leads</div>
                      <div className="text-2xl md:text-3xl font-bold font-sans text-white flex items-baseline gap-2">
                        {totalSubmissions}
                        <span className="text-[10px] text-slate-500 font-mono font-medium">apps</span>
                      </div>
                      <BarChart3 className="w-10 h-10 text-white/5 absolute right-4 bottom-4" />
                    </div>

                    <div className="bg-white/[0.01] border border-white/5 p-4 relative overflow-hidden">
                      <div className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold mb-1">Pending Review</div>
                      <div className="text-2xl md:text-3xl font-bold font-sans text-amber-500 flex items-baseline gap-2">
                        {pendingCount}
                        <span className="text-[10px] text-slate-500 font-mono font-medium">pending</span>
                      </div>
                      <Clock className="w-10 h-10 text-amber-500/5 absolute right-4 bottom-4" />
                    </div>

                    <div className="bg-white/[0.01] border border-white/5 p-4 relative overflow-hidden">
                      <div className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold mb-1">Approved Pilot Sprints</div>
                      <div className="text-2xl md:text-3xl font-bold font-sans text-emerald-500 flex items-baseline gap-2">
                        {approvedCount}
                        <span className="text-[10px] text-slate-500 font-mono font-medium">active</span>
                      </div>
                      <CheckCircle2 className="w-10 h-10 text-emerald-500/5 absolute right-4 bottom-4" />
                    </div>

                    <div className="bg-white/[0.01] border border-white/5 p-4 relative overflow-hidden">
                      <div className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold mb-1">Qualifying Conversion</div>
                      <div className="text-2xl md:text-3xl font-bold font-sans text-orange-500 flex items-baseline gap-2">
                        {conversionRate}%
                        <span className="text-[10px] text-slate-500 font-mono font-medium">approved</span>
                      </div>
                      <TrendingUp className="w-10 h-10 text-orange-500/5 absolute right-4 bottom-4" />
                    </div>
                  </div>

                  {/* Main Split Layout */}
                  <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0">
                    
                    {/* Left Panel: Filterable List */}
                    <div className="w-full md:w-[420px] shrink-0 border border-white/10 bg-slate-900/50 flex flex-col overflow-hidden min-h-0">
                      
                      {/* Search & Status Filters */}
                      <div className="p-4 border-b border-white/10 space-y-3 shrink-0">
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search applications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-950/80 border border-white/10 hover:border-white/20 focus:border-orange-500/50 focus:outline-none pl-9 pr-4 py-2 text-xs text-white"
                          />
                        </div>

                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                          {[
                            { id: 'all', label: 'All' },
                            { id: 'pending', label: 'Pending' },
                            { id: 'reviewed', label: 'Reviewed' },
                            { id: 'approved', label: 'Approved' },
                            { id: 'rejected', label: 'Rejected' },
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setStatusFilter(tab.id)}
                              className={`px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-wider transition-all whitespace-nowrap border cursor-pointer ${
                                statusFilter === tab.id 
                                  ? 'bg-orange-500 text-slate-950 border-orange-500' 
                                  : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Applications List */}
                      <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
                        {loading ? (
                          <div className="flex flex-col items-center justify-center h-48 py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-orange-500 mb-2" />
                            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Syncing documents...</span>
                          </div>
                        ) : filteredApps.length === 0 ? (
                          <div className="flex flex-col items-center justify-center p-8 text-center h-48 text-slate-500 font-mono text-xs">
                            <FileText className="w-8 h-8 opacity-25 mb-3 text-slate-400" />
                            <span>No application records found.</span>
                          </div>
                        ) : (
                          filteredApps.map((app) => {
                            const isSelected = selectedApp?.id === app.id;
                            
                            // Status style
                            let statusColor = 'bg-slate-800 text-slate-400 border-slate-700';
                            if (app.status === 'pending') statusColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                            if (app.status === 'reviewed') statusColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                            if (app.status === 'approved') statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                            if (app.status === 'rejected') statusColor = 'bg-red-500/10 text-red-400 border-red-500/30';

                            return (
                              <button
                                key={app.id}
                                onClick={() => setSelectedApp(app)}
                                className={`w-full text-left p-4 hover:bg-white/[0.02] flex flex-col gap-2.5 transition-all transition-colors duration-200 cursor-pointer border-l-2 ${
                                  isSelected ? 'bg-white/[0.03] border-l-orange-500' : 'border-l-transparent'
                                }`}
                              >
                                <div className="flex justify-between items-start w-full">
                                  <div className="font-bold text-white text-sm tracking-tight truncate max-w-[240px]">{app.name}</div>
                                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase border tracking-wider ${statusColor}`}>
                                    {app.status}
                                  </span>
                                </div>
                                
                                <div className="text-xs text-slate-400 font-mono truncate max-w-[340px] flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 opacity-55 text-slate-400" />
                                  <span>{app.email}</span>
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                                  <span className="bg-slate-800 px-2 py-0.5 select-none">{app.businessType}</span>
                                  <span>{new Date(app.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Right Panel: Selected Application Details */}
                    <div className="flex-1 border border-white/10 bg-slate-900/50 flex flex-col overflow-hidden min-h-0">
                      {selectedApp ? (
                        <div className="w-full h-full flex flex-col overflow-hidden">
                          
                          {/* Details Content Container */}
                          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin">
                            
                            {/* Applicant Primary Profile */}
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 pb-6 border-b border-white/5">
                              <div>
                                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">{selectedApp.name}</h2>
                                <p className="text-xs uppercase font-mono tracking-widest font-bold text-orange-400 mb-4 bg-orange-500/5 border border-orange-500/10 px-2.5 py-1 inline-block">
                                  {selectedApp.businessType.replace('-', ' ')}
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-mono text-slate-300">
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-500" />
                                    <a href={`mailto:${selectedApp.email}`} className="hover:text-orange-500 transition-colors underline">{selectedApp.email}</a>
                                  </div>
                                  {selectedApp.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-slate-500" />
                                      <a href={`tel:${selectedApp.phone}`} className="hover:text-orange-500 transition-colors underline">{selectedApp.phone}</a>
                                    </div>
                                  )}
                                  {selectedApp.website && (
                                    <div className="flex items-center gap-2 col-span-1 sm:col-span-2 mt-1">
                                      <Globe className="w-4 h-4 text-slate-500" />
                                      <a href={selectedApp.website.startsWith('http') ? selectedApp.website : `https://${selectedApp.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors underline font-medium truncate flex items-center gap-1">
                                        <span>{selectedApp.website}</span>
                                        <span className="text-[9px] bg-slate-800 text-slate-500 px-1 py-0.5 no-underline">Open URL ↗</span>
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 shrink-0 md:text-right">
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Date Received</div>
                                <div className="text-xs font-mono text-slate-300">
                                  {new Date(selectedApp.createdAt).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-2">Revenue Qualifier</div>
                                <div className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                                  🪙 {selectedApp.revenue}
                                </div>
                              </div>
                            </div>

                            {/* Core Application Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                              {/* Pain points bottlenecks */}
                              <div className="space-y-4">
                                <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-slate-400">Current Pain Points</h3>
                                <div className="flex flex-wrap gap-2">
                                  {selectedApp.bottlenecks.map((bp, i) => (
                                    <span key={i} className="px-3 py-1.5 text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded">
                                      ⚠️ {bp}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Features desired */}
                              <div className="space-y-4">
                                <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-slate-400">Required Portal Modules</h3>
                                <div className="flex flex-wrap gap-2">
                                  {selectedApp.features.map((ft, i) => (
                                    <span key={i} className="px-3 py-1.5 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded">
                                      ⚡ {ft}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Theme Preference if selected */}
                            {selectedApp.theme && (
                              <div className="pb-6 border-b border-white/5">
                                <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-slate-400 mb-3">Preferred Brand Accent Preference</h3>
                                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 border border-white/10 bg-white/[0.01]">
                                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wide">{selectedApp.theme}</span>
                                </div>
                              </div>
                            )}

                            {/* Pipelines Status Decision Panel */}
                            <div className="space-y-4 bg-slate-950 p-5 border border-white/10 relative">
                              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-orange-600 via-slate-800 to-transparent"></div>
                              <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-slate-400">Evaluate Status Pipeline</h3>
                              
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {[
                                  { id: 'pending', label: 'Pending Review', color: 'hover:bg-amber-500/15 hover:border-amber-500 border-amber-500/10 text-amber-500 rounded' },
                                  { id: 'reviewed', label: 'Mark Reviewed', color: 'hover:bg-blue-500/15 hover:border-blue-500 border-blue-500/10 text-blue-500 rounded' },
                                  { id: 'approved', label: 'Approve Sprint', color: 'hover:bg-emerald-500/15 hover:border-emerald-500 border-emerald-500/10 text-emerald-500 rounded' },
                                  { id: 'rejected', label: 'Decline Pilot', color: 'hover:bg-red-500/15 hover:border-red-500 border-red-500/10 text-red-500 rounded' },
                                ].map((act) => {
                                  const isActiveStatus = selectedApp.status === act.id;
                                  return (
                                    <button
                                      key={act.id}
                                      onClick={() => changeAppStatus(selectedApp.id, act.id as any)}
                                      className={`p-3 text-xs font-mono font-bold uppercase text-center border cursor-pointer transition-all ${
                                        isActiveStatus 
                                          ? 'bg-white/10 border-white text-white font-black shadow-inner scale-[0.98]' 
                                          : act.color
                                      }`}
                                    >
                                      {act.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Internal Administrative Notes */}
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-slate-400 flex items-center gap-2">
                                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Internal Administrative Notes</span>
                                </h3>
                                <button
                                  onClick={saveNotes}
                                  disabled={isSavingNotes}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all disabled:opacity-50 cursor-pointer"
                                >
                                  {isSavingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                  <span>Save Notes</span>
                                </button>
                              </div>
                              <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                rows={4}
                                placeholder="Write any internal evaluations, follow-up statuses, feedback of kickoff phone numbers, preferred build priorities..."
                                className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-orange-500/50 focus:outline-none p-4 text-xs text-white leading-relaxed font-sans placeholder:text-slate-600 rounded"
                              />
                            </div>

                          </div>

                          {/* Footer Action Bar */}
                          <div className="p-4 border-t border-white/10 bg-slate-950 flex justify-between items-center shrink-0">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                              ID: {selectedApp.id}
                            </span>

                            <button
                              onClick={() => deleteApp(selectedApp.id)}
                              className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-red-500 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 border border-red-500/10 hover:border-red-500/20 rounded cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Record</span>
                            </button>
                          </div>

                        </div>
                      ) : (
                        /* Empty Detail State with Icon */
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                          <div className="w-16 h-16 rounded-full border border-white/5 mx-auto flex items-center justify-center mb-4 bg-white/[0.01]">
                            <Award className="w-6 h-6 text-slate-400 opacity-40 animate-pulse" />
                          </div>
                          <h3 className="text-white font-bold text-sm tracking-tight mb-1">Evaluate Candidates</h3>
                          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4 font-mono leading-relaxed">
                            Select an application record from the lists to view detailed bottlenecks, required modules, and change evaluation status.
                          </p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}
            </div>

            {/* Dashboard Footer */}
            <div className="pt-4 border-t border-white/10 shrink-0 text-center flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>Secure Administration • Port 3000 Ingress</span>
              <span>© 2026 PortalBuild. Built with Cloud Storage Integration.</span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
