import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Suppliers from './components/Suppliers';
import Departments from './components/Departments';
import Employees from './components/Employees';
import HourlyRates from './components/HourlyRates';
import ProxyRequests from './components/ProxyRequests';
import logoImg from './assets/logo.png';

export default function HR({ userSession, onLogout, onSwitchRole }) {
  const isHRAccount =
    userSession?.roleKey === 'hr_maker' ||
    userSession?.profile?.id === 'hr_maker' ||
    userSession?.profile?.label?.includes('HR') ||
    userSession?.email?.includes('hr.');

  const [selectedRole, setSelectedRole] = useState(() => {
    if (isHRAccount) return 'Role: HR';
    if (userSession?.profile?.label) {
      return `Role: ${userSession.profile.roleBadge || userSession.profile.label}`;
    }
    return 'Role: Paymaster';
  });

  const [activeNav, setActiveNav] = useState('dashboard');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  // Ensure Dashboard opens first upon logging in, while syncing active role and resetting scroll to top
  useEffect(() => {
    scrollToTop();
    setActiveNav('dashboard');
    if (isHRAccount) {
      setSelectedRole('Role: HR');
    } else if (userSession?.profile?.roleBadge || userSession?.profile?.label) {
      setSelectedRole(`Role: ${userSession.profile.roleBadge || userSession.profile.label}`);
    }
    const t = setTimeout(scrollToTop, 60);
    const rAf = requestAnimationFrame(scrollToTop);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rAf);
    };
  }, [userSession]);

  // Reset scroll position to top whenever activeNav changes
  useEffect(() => {
    scrollToTop();
    const t = setTimeout(scrollToTop, 60);
    const rAf = requestAnimationFrame(scrollToTop);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rAf);
    };
  }, [activeNav]);
  const [vendorSearch, setVendorSearch] = useState('');
  const [issuedBadges, setIssuedBadges] = useState({});
  const [batchVerified, setBatchVerified] = useState(false);
  const [proxyPunchVerified, setProxyPunchVerified] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'suppliers', label: 'Suppliers', icon: 'corporate_fare' },
    { id: 'departments', label: 'Departments', icon: 'apartment' },
    { id: 'employees', label: 'Employees', icon: 'badge' },
    { id: 'hourly-rates', label: 'Hourly Rates', icon: 'price_change' },
    { id: 'proxy-requests', label: 'Proxy Requests', icon: 'forward_to_inbox' },
  ];

  const queueWorkers = [
    {
      id: 'W-88204',
      name: 'Mateo Hernandez',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRTZd03IRUBS6b3P7PioNyKJ3-V7diKNqAtKbQ46GuomnsE2ePHG9YxribsAL1nuwhtVTHzsP6QFk2lS5b3SjcNTKdaM6snif9UG_HktHZ7pK9l6LI-xzQK9QMrkodHqZZam4sYjvzHPjOOwimPUZNQbK3-WLCupv_6Mtwy4VDO7fvF_2qNQet1K1uft_S6oB7nkQD3hHNGEpZIpZcx3Md0vAO3kNg2wbFdQYMAhgi0RDzY2uI8X37',
      trade: 'Structural Steel',
      subTrade: 'Level 3 Welder',
      agency: 'BuildTech Manpower',
      agencyTier: 'Tier A Primary',
      credentials: 'OSHA-30 • Real ID',
      cert: 'AWS D1.1 Cert',
      status: 'Verified',
      rate: 'SAR 34.50',
      statusType: 'verified'
    },
    {
      id: 'W-90114',
      name: 'Soraya Chen',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmarIXfVEsqnhr0Z2Kk8ldqF0kREcpTJcUdyJkS7mbgQ4K53E49eItTfz6LrE0i8-UzpquIwdz95bYf4fHnglcOK43xUSer68JExbXN6-N1L9BgkldpyzMWImKayl86s00M9sjn1tmWjk8kN3lJVnx4xYXDeZYskYPir0ljBYzNTQECQLNreVO0760kef4yVATfbujJYLX-VEEQywshK40EMBZDGFTrPNavssbtDFKyowPRw20sNT-',
      trade: 'MEP Specialist',
      subTrade: 'HVAC Systems',
      agency: 'Gulf Apex Resources',
      agencyTier: 'Direct Supplier',
      credentials: 'EPA-608 • OSHA-10',
      cert: 'Medical Fit (14d left)',
      status: 'Expiring Soon',
      rate: 'SAR 28.00',
      statusType: 'warning'
    },
    {
      id: 'W-77409',
      name: 'Kwame Mensah',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdL_lpZMNmRuSGlpNaV-yg37tyi_UMeCC3Mdi5s5_GaUqfbnuHWgtQAAERO7KFJnrPMaOvpsLxi3D2IAUpRYxVuV4WJPfNVRTvne1qoXM1EJxiXhJETcnAVyL3-DEClZbexElyYrVBCiCzw723aMJ8xZf17p_icqcSaSeSdy1jLJO7nc5cq8TzuSjqfcH5LKjggXqyDPkPQ2s_1uJ9HGXp7ntV1-TipQHwuYjVeVv8ZrAbprPW-HI7',
      trade: 'Civil Framing',
      subTrade: 'Carpentry Lead',
      agency: 'Prime Infra Solutions',
      agencyTier: 'Tier B Contractor',
      credentials: 'Civil ID Scan',
      cert: 'Unreadable MRZ zone',
      status: 'OCR Glare',
      rate: 'SAR 22.50',
      statusType: 'error'
    },
    {
      id: 'W-92433',
      name: 'Tariq Lin',
      initials: 'TL',
      trade: 'Site Safety Coordinator',
      subTrade: 'OSHA Safety Marshall',
      agency: 'BuildTech Manpower',
      agencyTier: 'Tier A Primary',
      credentials: 'CSP • First Aid Level 2',
      cert: 'Verified by OSHA API',
      status: 'Verified',
      rate: 'SAR 38.00',
      statusType: 'verified'
    }
  ];

  const vendors = [
    {
      code: 'BT',
      name: 'BuildTech Manpower LLC',
      id: 'Vendor #VN-0182',
      fein: 'XX-XXX8921',
      tier: 'Tier 1 Primary',
      workers: 148,
      clearance: 98.0,
      agreement: 'Active (Exp 2026)',
      trades: 'Structural, MEP, HSE'
    },
    {
      code: 'GA',
      name: 'Gulf Apex Resources',
      id: 'Vendor #VN-0244',
      fein: 'XX-XXX4110',
      tier: 'Tier 1 Primary',
      workers: 112,
      clearance: 95.2,
      agreement: 'Active (Exp 2025)',
      trades: 'HVAC, Piping, Electrical'
    },
    {
      code: 'PI',
      name: 'Prime Infra Solutions Group',
      id: 'Vendor #VN-0309',
      fein: 'XX-XXX1944',
      tier: 'Tier 2 Secondary',
      workers: 76,
      clearance: 89.4,
      agreement: 'Audit Underway',
      trades: 'Concrete, Earthworks'
    },
    {
      code: 'EM',
      name: 'Empire Logistics Technical',
      id: 'Vendor #VN-0412',
      fein: 'XX-XXX7209',
      tier: 'Tier 2 Secondary',
      workers: 44,
      clearance: 96.8,
      agreement: 'Active (Exp 2025)',
      trades: 'Heavy Rigging, Operators'
    }
  ];

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
    v.fein.toLowerCase().includes(vendorSearch.toLowerCase()) ||
    v.trades.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const handleIssueBadge = (id) => {
    setIssuedBadges(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      {/* Sidebar Aside */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#131943] via-[#0E1330] to-[#0A0D26] border-r border-[#1E2554] z-50 flex flex-col justify-between shadow-2xl">
        <div className="flex flex-col">
          {/* Top Section with Smooth Fading Effect (White to Dark Blue) on Top of Operational Suites */}
          <div
            className="w-full shrink-0"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 18%, #edf1fa 28%, #c8d2eb 38%, #9caad2 49%, #7182b2 61%, #4d5e94 72%, #314078 82%, #202c61 90%, #16204c 95%, #0E1330 100%)'
            }}
          >
            {/* Logo Brand Header */}
            <div className="h-16 px-space-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  alt="Expertise"
                  className="h-10 w-auto max-w-[160px] object-contain"
                  src={logoImg}
                />
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded font-bold shrink-0">
                  OS
                </span>
              </div>
            </div>

            {/* Active Facility Widget inside the Fading Transition Zone */}
            <div className="p-3 pt-1 pb-4">
              <div className="bg-[#0E1330]/75 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                    Active Facility
                  </span>
                  <span className="h-2 w-2 rounded-full bg-secondary shadow-sm shadow-secondary/60 animate-pulse"></span>
                </div>
                <button className="w-full flex items-center justify-between text-left group" type="button">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[17px] text-secondary">domain</span>
                    <span className="font-body-md-medium text-xs font-semibold text-white truncate">
                      HQ Metro Logistics
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[15px] text-white/50 group-hover:text-white transition-colors">
                    unfold_more
                  </span>
                </button>
                <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between">
                  <span className="font-data-mono text-[11px] text-white/80 font-medium">NY Site 4</span>
                  <span className="font-label-sm text-[10px] font-bold text-[#F18E3B] bg-secondary/20 border border-secondary/40 px-1.5 py-0.5 rounded">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Navigation */}
          <div className="px-4 py-1.5 mt-1">
            <span className="font-label-sm text-[10.5px] uppercase text-white/45 tracking-wider font-semibold">
              Operational Suites
            </span>
          </div>
          <nav className="px-3 space-y-1.5 pb-3">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    scrollToTop();
                  }}
                  className={`w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-200 font-body-md text-left group border ${
                    isActive
                      ? 'bg-gradient-to-r from-white to-[#F8FAFC] text-[#0E1330] font-semibold shadow-[0_4px_16px_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.25)] border-white hover:bg-white hover:scale-[1.01]'
                      : 'text-slate-300 border-transparent hover:text-white hover:bg-white/[0.14] hover:border-white/20 hover:shadow-xs backdrop-blur-xs'
                  }`}
                  data-path={item.id}
                  type="button"
                >
                  <span
                    className={`material-symbols-outlined mr-3 text-[19px] transition-all duration-200 ${
                      isActive
                        ? 'text-[#0E1330]'
                        : 'text-slate-400 group-hover:text-white group-hover:scale-110'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer on Dark Blue Background */}
        <div className="p-3 border-t border-white/10 flex flex-col gap-2">
          <div className="bg-white/[0.05] hover:bg-white/[0.09] hover:border-secondary/40 transition-all rounded-xl p-2.5 border border-white/10 flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[17px] text-white/50 group-hover:text-secondary transition-colors">sync_alt</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-[9.5px] uppercase tracking-wider text-white/45 font-semibold">Active Role</span>
                <span className="font-body-md-medium text-xs font-semibold text-white group-hover:text-secondary transition-colors">
                  {selectedRole.replace('Role: ', '')}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[15px] text-white/40 group-hover:text-secondary transition-colors">expand_more</span>
          </div>
          <div className="flex items-center justify-between px-1 text-white/40 text-[10.5px]">
            <span className="font-label-sm uppercase tracking-wide">Build v4.82-FIN</span>
            <span className="material-symbols-outlined text-[15px] text-white/40 hover:text-white cursor-pointer transition-colors">
              help_outline
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Fixed Header */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/20 z-40 flex items-center justify-between px-4 sm:px-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">home</span>
              <span>/</span>
              <span className="text-on-surface font-body-md-medium">Enterprise Workforce OS</span>
              <span>/</span>
              <span className="text-secondary font-body-md-medium">
                {navItems.find((i) => i.id === activeNav)?.label || 'Dashboard'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-lg">
            <div className="relative flex items-center">
              <label className="sr-only" htmlFor="shell-role-select">
                Switch Operational Role
              </label>
              <select
                className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-lg pl-space-md pr-space-xl py-1.5 font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary"
                id="shell-role-select"
                value={selectedRole}
                onChange={(e) => {
                  const roleVal = e.target.value;
                  setSelectedRole(roleVal);
                  if (roleVal === 'Role: HR') {
                    setActiveNav('dashboard');
                  } else if (roleVal === 'Role: Site Coordinator') {
                    if (onSwitchRole) {
                      onSwitchRole({
                        roleKey: 'site_coord',
                        email: 'site.logistics@expertise.sa',
                        profile: {
                          id: 'site_coord',
                          label: 'Site Coordinator',
                          roleBadge: 'Field Logger',
                        },
                      });
                      return;
                    }
                    setActiveNav('proxy-requests');
                  } else if (roleVal === 'Role: Paymaster') {
                    if (onSwitchRole) {
                      onSwitchRole({
                        roleKey: 'cashier',
                        email: 'paymaster.cashier@expertise.sa',
                        profile: {
                          id: 'cashier',
                          label: 'Cashier & Payout',
                          roleBadge: 'Paymaster',
                        },
                      });
                      return;
                    }
                    setActiveNav('hourly-rates');
                  } else if (roleVal === 'Role: Project Manager') {
                    if (onSwitchRole) {
                      onSwitchRole({
                        roleKey: 'dept_mgr',
                        email: 'manager.ops@expertise.sa',
                        profile: {
                          id: 'dept_mgr',
                          label: 'Dept Manager',
                          roleBadge: 'Reviewer',
                        },
                      });
                      return;
                    }
                    setActiveNav('departments');
                  } else if (roleVal === 'Role: Accountant') {
                    setActiveNav('hourly-rates');
                  } else if (roleVal === 'Role: Admin') {
                    setActiveNav('suppliers');
                  } else {
                    setActiveNav('dashboard');
                  }
                  scrollToTop();
                }}
              >
                <option value="Role: Paymaster">Role: Paymaster</option>
                <option value="Role: Admin">Role: Admin</option>
                <option value="Role: HR">Role: HR</option>
                <option value="Role: Site Coordinator">Role: Site Coordinator</option>
                <option value="Role: Project Manager">Role: Project Manager</option>
                <option value="Role: Accountant">Role: Accountant</option>
              </select>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 pointer-events-none">
                arrow_drop_down
              </span>
            </div>
            <div className="h-6 w-px bg-outline-variant/30"></div>
            <div className="relative cursor-pointer p-1 rounded-lg hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-[22px]">notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
            </div>
            <div className="flex items-center gap-space-sm pl-space-xs">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="font-body-md-medium text-body-md-medium text-on-surface leading-tight">
                  Marcus Sterling
                </span>
                <span className="font-data-mono text-body-sm text-on-surface-variant">Treasury Operations</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-[#F18E3B] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-white text-[18px]">person</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-rose-600 hover:bg-rose-500/10 transition-colors ml-1 cursor-pointer"
                  title="Sign Out / Switch Persona"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[19px]">logout</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="relative bg-surface w-full pt-[80px] sm:pt-[84px] px-4 sm:px-5 lg:px-6 pb-6 min-h-screen">
          {activeNav === 'dashboard' ? (
            <Dashboard />
          ) : activeNav === 'suppliers' ? (
            <Suppliers />
          ) : activeNav === 'departments' ? (
            <Departments />
          ) : activeNav === 'employees' ? (
            <Employees />
          ) : activeNav === 'hourly-rates' ? (
            <HourlyRates />
          ) : activeNav === 'proxy-requests' ? (
            <ProxyRequests />
          ) : (
            <div className="flex flex-col w-full space-y-space-xl">
              {/* Hub Header Bar - Executive Aurora Deck */}
              <div className="bg-aurora-animated border border-white/10 rounded-2xl p-6 lg:p-7 shadow-xl shadow-[#1A1F45]/15 relative overflow-hidden text-white">
                {/* Dynamic moving auroras & passing light beam */}
                <div className="aurora-orb-1 absolute -right-12 -top-12 w-96 h-96 bg-[#E97F29]/30 rounded-full pointer-events-none blur-3xl"></div>
                <div className="aurora-orb-2 absolute right-72 -bottom-24 w-80 h-80 bg-[#353D80]/50 rounded-full pointer-events-none blur-3xl"></div>
                <div className="aurora-orb-1 absolute left-1/4 -top-20 w-72 h-72 bg-[#E97F29]/15 rounded-full pointer-events-none blur-3xl"></div>
                <div className="aurora-light-beam absolute -top-1/2 -bottom-1/2 w-48 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none blur-xl"></div>

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
                  <div className="flex flex-col space-y-3 max-w-3xl">
                    <h1 className="font-headline-lg text-2xl lg:text-[28px] font-bold text-white tracking-tight leading-tight">
                      HR Workforce Hub: <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F7A65E]">Onboarding &amp; Operations</span>
                    </h1>
                    <p className="font-body-md text-sm lg:text-[15px] text-white/75 leading-relaxed max-w-2xl">
                      Centralized compliance governance, real-time identity validation, and multi-tier contractor disbursement control for logistics terminal expansion.
                    </p>

                    {/* Quick Metrics Bar */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md shadow-xs">
                        <span className="material-symbols-outlined text-[16px] text-secondary">groups</span>
                        <span>Contracted Workforce: <strong className="text-white">420 Active</strong></span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md shadow-xs">
                        <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                        <span>Compliance Index: <strong className="text-white">94.2%</strong></span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md shadow-xs">
                        <span className="material-symbols-outlined text-[16px] text-secondary">corporate_fare</span>
                        <span>Partners: <strong className="text-secondary font-bold font-data-mono">14 Registered Vendors</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-3.5 py-2.5 rounded-xl font-label-md text-xs font-semibold backdrop-blur-md transition-all shadow-xs"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      <span>Export Report</span>
                    </button>
                    <button
                      onClick={() => setActiveNav('suppliers')}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-3.5 py-2.5 rounded-xl font-label-md text-xs font-semibold backdrop-blur-md transition-all shadow-xs"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">domain_add</span>
                      <span>Suppliers</span>
                    </button>
                    <button
                      onClick={() => setActiveNav('employees')}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white px-5 py-2.5 rounded-xl font-label-md text-xs font-bold shadow-lg shadow-secondary/35 transition-all ring-2 ring-secondary/20"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">person_add</span>
                      <span>Onboard Worker</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Operational Stat Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* Stat 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden group">
                  <div className="flex flex-col space-y-1">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Contracted Workforce
                    </span>
                    <div className="flex items-baseline gap-space-xs">
                      <span className="font-currency-display text-currency-display text-on-surface tracking-tight">420</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">active</span>
                    </div>
                    <span className="font-data-mono text-body-sm text-secondary">Distributed across 14 Vendors</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">groups</span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden group">
                  <div className="flex flex-col space-y-1">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Site Compliance Index
                    </span>
                    <div className="flex items-baseline gap-space-xs">
                      <span className="font-currency-display text-currency-display text-on-surface tracking-tight">94.2%</span>
                      <span className="font-body-sm text-body-sm text-secondary font-label-md">▲ +1.4%</span>
                    </div>
                    <span className="font-data-mono text-body-sm text-on-surface-variant">396 Verified Credentials</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                    <svg className="w-8 h-8" viewBox="0 0 36 36">
                      <path
                        className="text-surface-container-highest"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-secondary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="94.2, 100"
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden group">
                  <div className="flex flex-col space-y-1">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Pending KYC Actions
                    </span>
                    <div className="flex items-baseline gap-space-xs">
                      <span className="font-currency-display text-currency-display text-on-surface tracking-tight">6</span>
                      <span className="font-label-sm text-label-sm bg-error-container text-on-error-container px-1.5 py-0.5 rounded">
                        Action Req.
                      </span>
                    </div>
                    <span className="font-data-mono text-body-sm text-error">4 OCR scans require glare fix</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-error-container/30 flex items-center justify-center text-error group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">verified_user</span>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden group">
                  <div className="flex flex-col space-y-1">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Proxy Punch Requests
                    </span>
                    <div className="flex items-baseline gap-space-xs">
                      <span className="font-currency-display text-currency-display text-on-surface tracking-tight">3</span>
                      <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-container px-1.5 py-0.5 rounded">
                        Site Ingestion
                      </span>
                    </div>
                    <span className="font-data-mono text-body-sm text-on-surface-variant">Turnstile 04 reader power spike</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">mark_email_unread</span>
                  </div>
                </div>
              </div>

              {/* Section 1: Quick Workflow Cards & Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
                {/* Workflow 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
                  <div className="space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
                      </div>
                      <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded">
                        TIER A &amp; B
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Register Supplier / Agency</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Launch rapid legal vendor intake with automated FEIN, W-9, &amp; COI compliance gating.
                      </p>
                    </div>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between">
                    <span className="font-data-mono text-body-sm text-on-surface-variant">Avg. SLA: 4.2h</span>
                    <button className="text-secondary font-label-md text-label-md flex items-center gap-1 group-hover:translate-x-0.5 transition-transform" type="button">
                      <span>Open Form</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Workflow 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
                  <div className="space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined text-[20px]">table_chart_view</span>
                      </div>
                      <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-container px-2 py-0.5 rounded">
                        4 Bands Active
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Department &amp; Trade Matrix</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Civil, MEP, Structural Steel, and HSE Safety wage ceiling parity benchmarks.
                      </p>
                    </div>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-secondary"></span>
                      <span className="font-data-mono text-body-sm text-on-surface-variant">Prevailing Wage Rev 2</span>
                    </div>
                    <button className="text-secondary font-label-md text-label-md flex items-center gap-1 group-hover:translate-x-0.5 transition-transform" type="button">
                      <span>View Matrix</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Workflow 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
                  <div className="space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                      </div>
                      <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded">
                        OCR ENGINE v3
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Automated KYC Scanner</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Real-time biometrics, state ID validation, and automated OSHA registry query.
                      </p>
                    </div>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between">
                    <span className="font-data-mono text-body-sm text-on-surface-variant">98.1% OCR Pass</span>
                    <button className="text-secondary font-label-md text-label-md flex items-center gap-1 group-hover:translate-x-0.5 transition-transform" type="button">
                      <span>Scanner Logs</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Workflow 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
                  <div className="space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined text-[20px]">tune</span>
                      </div>
                      <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded">
                        LOCAL 282
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Rate Matrix Override</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Union collective agreement adjustments, overtime escalation caps, and shift differentials.
                      </p>
                    </div>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between">
                    <span className="font-data-mono text-body-sm text-on-surface-variant">2 Overrides Set</span>
                    <button className="text-secondary font-label-md text-label-md flex items-center gap-1 group-hover:translate-x-0.5 transition-transform" type="button">
                      <span>Configure</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 2: Middle Split Section (60% KYC Verification Queue | 40% Email Proxy Punch Intake) */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
                {/* Left Column: KYC & Credential Verification Queue (7 / 12) */}
                <div className="xl:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg space-y-space-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </div>
                      <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface">
                          KYC &amp; Credential Verification Queue
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Active worker onboarding packets awaiting compliance clearance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface px-2.5 py-1 rounded-full">
                        6 Pending Review
                      </span>
                      <button className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant" type="button">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                      </button>
                    </div>
                  </div>

                  {/* Table Container */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                          <th className="py-2.5 px-3 rounded-l-lg">Worker &amp; Identity</th>
                          <th className="py-2.5 px-3">Trade / Skill</th>
                          <th className="py-2.5 px-3">Vendor Agency</th>
                          <th className="py-2.5 px-3">Credentials</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Agreed Rate</th>
                          <th className="py-2.5 px-3 text-right rounded-r-lg">Action</th>
                        </tr>
                      </thead>
                      <tbody className="font-body-sm text-body-sm text-on-surface divide-y-0">
                        {queueWorkers.map((worker) => {
                          const isIssued = issuedBadges[worker.id];
                          return (
                            <tr key={worker.id} className="hover:bg-surface-container-low transition-colors group">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-space-sm">
                                  {worker.photo ? (
                                    <img
                                      className="w-9 h-9 rounded-full object-cover shadow-sm"
                                      data-alt={worker.name}
                                      src={worker.photo}
                                      alt={worker.name}
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center font-headline-sm text-headline-sm text-on-surface">
                                      {worker.initials}
                                    </div>
                                  )}
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-body-md-medium text-body-md-medium text-on-surface truncate">
                                      {worker.name}
                                    </span>
                                    <span className="font-data-mono text-body-sm text-on-surface-variant">
                                      ID: {worker.id}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-body-md-medium text-body-md-medium text-on-surface">
                                  {worker.trade}
                                </span>
                                <span className="block font-data-mono text-body-sm text-on-surface-variant">
                                  {worker.subTrade}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-body-md text-body-md text-on-surface">{worker.agency}</span>
                                <span className="block font-label-sm text-label-sm text-on-surface-variant">
                                  {worker.agencyTier}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-data-mono text-body-sm text-on-surface">
                                    {worker.credentials}
                                  </span>
                                  <span
                                    className={`font-label-sm text-label-sm ${worker.statusType === 'error'
                                        ? 'text-error'
                                        : worker.statusType === 'warning'
                                          ? 'text-error'
                                          : worker.statusType === 'verified' && worker.initials
                                            ? 'text-secondary'
                                            : 'text-on-surface-variant'
                                      }`}
                                  >
                                    {worker.cert}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                {worker.statusType === 'verified' && (
                                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container-high text-secondary px-2 py-0.5 rounded-full">
                                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                                    Verified
                                  </span>
                                )}
                                {worker.statusType === 'warning' && (
                                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full">
                                    <span className="material-symbols-outlined text-[13px]">timelapse</span>
                                    Expiring Soon
                                  </span>
                                )}
                                {worker.statusType === 'error' && (
                                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm bg-error-container text-on-error-container px-2 py-0.5 rounded-full">
                                    <span className="material-symbols-outlined text-[13px]">warning</span>
                                    OCR Glare
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right font-data-mono text-body-md-medium text-on-surface">
                                {worker.rate}
                                <span className="text-on-surface-variant text-body-sm">/hr</span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                {worker.statusType === 'verified' ? (
                                  <button
                                    onClick={() => handleIssueBadge(worker.id)}
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-label-md text-xs font-semibold shadow-xs transition-all ${isIssued
                                        ? 'bg-secondary text-white'
                                        : 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white hover:brightness-110'
                                      }`}
                                    type="button"
                                  >
                                    <span>{isIssued ? 'Badge Issued' : 'Issue Badge'}</span>
                                  </button>
                                ) : worker.statusType === 'warning' ? (
                                  <button
                                    className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-2.5 py-1.5 rounded font-label-md text-label-md hover:bg-surface-container-highest"
                                    type="button"
                                  >
                                    <span>Preview</span>
                                  </button>
                                ) : (
                                  <button
                                    className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-2.5 py-1.5 rounded font-label-md text-label-md hover:bg-surface-container-highest"
                                    type="button"
                                  >
                                    <span>Resend SMS</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Queue Table Footer */}
                  <div className="pt-space-sm flex items-center justify-between">
                    <span className="font-data-mono text-body-sm text-on-surface-variant">
                      Displaying 4 of 6 active requests in queue
                    </span>
                    <div className="flex items-center gap-space-xs">
                      <button
                        onClick={() => setBatchVerified(true)}
                        className="px-3 py-1 bg-surface-container-high rounded font-label-sm text-label-sm text-on-surface hover:bg-surface-container-highest transition-colors"
                        type="button"
                      >
                        {batchVerified ? '✓ 2 Verified' : 'Batch Verify All (2 Ready)'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Email Proxy Punch Intake (5 / 12) */}
                <div className="xl:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg space-y-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
                      </div>
                      <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface">
                          Email Proxy Punch Intake
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Automated field coordinator exception ingest
                        </p>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-container px-2 py-0.5 rounded-full">
                      Auto-Parser Online
                    </span>
                  </div>

                  {/* Incident Header Card */}
                  <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[20px] text-error">electric_bolt</span>
                        <div>
                          <span className="font-headline-sm text-headline-sm text-on-surface">
                            Turnstile 04 Reader Power Spike
                          </span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Reported by Coordinator Marcus Sterling (Site 4 Gate West)
                          </p>
                        </div>
                      </div>
                      <span className="font-data-mono text-body-sm text-on-surface-variant">07:42 AM EST</span>
                    </div>

                    <div className="p-space-sm bg-surface-container-lowest rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                          Exception Payload Details
                        </span>
                        <span className="font-label-sm text-label-sm bg-surface-container text-on-surface px-1.5 py-0.5 rounded">
                          6 Civil Specialists
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface">
                        Terminal relay dropped during shift-start surge. 6 civil framing specialists arrived 06:45 AM. Manual paper log validated and matched against Security Camera 12 (Gate 4 Entry Feed).
                      </p>
                    </div>

                    {/* Ingested Workers List */}
                    <div className="space-y-space-xs">
                      <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase px-1">
                        <span>Logged Personnel</span>
                        <span>CCTV Facial Match</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                            <span className="font-body-md-medium text-body-md-medium text-on-surface">R. Kowalski</span>
                            <span className="font-data-mono text-body-sm text-on-surface-variant">Prime Infra • 06:46 AM</span>
                          </div>
                          <span className="font-data-mono text-body-sm text-secondary">99.4% Match</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                            <span className="font-body-md-medium text-body-md-medium text-on-surface">D. Vance</span>
                            <span className="font-data-mono text-body-sm text-on-surface-variant">Prime Infra • 06:48 AM</span>
                          </div>
                          <span className="font-data-mono text-body-sm text-secondary">98.8% Match</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                            <span className="font-body-md-medium text-body-md-medium text-on-surface">A. Gutierrez + 3 others</span>
                            <span className="font-data-mono text-body-sm text-on-surface-variant">Crew Batch • 06:51 AM</span>
                          </div>
                          <span className="font-data-mono text-body-sm text-secondary">Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-space-xs flex flex-wrap items-center gap-space-xs">
                      <button
                        onClick={() => setProxyPunchVerified(true)}
                        className={`flex-1 py-2 px-3 rounded-lg font-label-md text-xs font-semibold transition-all flex items-center justify-center gap-1 ${proxyPunchVerified
                            ? 'bg-secondary text-white'
                            : 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white hover:brightness-110 shadow-xs'
                          }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>{proxyPunchVerified ? '✓ All 6 Verified' : 'Batch Verify All (6)'}</span>
                      </button>
                      <button
                        className="bg-surface-container-high text-on-surface py-2 px-3 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-colors flex items-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                        <span>Inspect CCTV Log</span>
                      </button>
                      <button
                        className="bg-error-container text-on-error-container py-2 px-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                        type="button"
                      >
                        <span>Reject Punch</span>
                      </button>
                    </div>
                  </div>

                  {/* Second Minor Queue Item */}
                  <div className="bg-surface-container-low/60 rounded-lg p-space-sm flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[20px] text-on-surface-variant">badge</span>
                      <div>
                        <span className="font-body-md-medium text-body-md-medium text-on-surface">
                          Crane Substation Shift 2 Badge Demagnetized
                        </span>
                        <span className="block font-data-mono text-body-sm text-on-surface-variant">
                          Apex Logistics • 2 Electricians pending manual punch
                        </span>
                      </div>
                    </div>
                    <button className="text-secondary font-label-md text-label-md hover:underline" type="button">
                      Review
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Registered Supplier & Vendor Directory Table */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg space-y-space-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                      <span className="material-symbols-outlined text-[18px]">hub</span>
                    </div>
                    <div>
                      <h2 className="font-headline-md text-headline-md text-on-surface">
                        Registered Supplier &amp; Vendor Directory
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        14 contracted manpower suppliers and workforce billing entities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 pointer-events-none">
                        search
                      </span>
                      <input
                        className="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm pl-9 pr-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary w-64"
                        placeholder="Search vendor name, EIN..."
                        type="text"
                        value={vendorSearch}
                        onChange={(e) => setVendorSearch(e.target.value)}
                      />
                    </div>
                    <button
                      className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1 transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">tune</span>
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                        <th className="py-2.5 px-3 rounded-l-lg">Agency / Legal Entity</th>
                        <th className="py-2.5 px-3">Tax ID (FEIN)</th>
                        <th className="py-2.5 px-3">Contract Tier</th>
                        <th className="py-2.5 px-3">Active Deployed</th>
                        <th className="py-2.5 px-3">KYC Clearance %</th>
                        <th className="py-2.5 px-3">Master Agreement</th>
                        <th className="py-2.5 px-3">Primary Trades</th>
                        <th className="py-2.5 px-3 text-right rounded-r-lg">Configuration</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm text-on-surface divide-y-0">
                      {filteredVendors.map((vendor) => (
                        <tr key={vendor.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-space-sm">
                              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-headline-sm text-headline-sm text-on-surface">
                                {vendor.code}
                              </div>
                              <div>
                                <span className="font-body-md-medium text-body-md-medium text-on-surface">
                                  {vendor.name}
                                </span>
                                <span className="block font-data-mono text-body-sm text-on-surface-variant">
                                  {vendor.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-data-mono text-body-sm text-on-surface-variant">
                            {vendor.fein}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface px-2 py-0.5 rounded">
                              {vendor.tier}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-data-mono text-body-md-medium text-on-surface">
                                {vendor.workers}
                              </span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant">Workers</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-surface-container-high h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-secondary h-full rounded-full"
                                  style={{ width: `${vendor.clearance}%` }}
                                ></div>
                              </div>
                              <span className="font-data-mono text-body-sm text-on-surface">
                                {vendor.clearance.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container-high text-secondary px-2 py-0.5 rounded-full">
                              <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
                              {vendor.agreement}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              {vendor.trades}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-2.5 py-1.5 rounded font-label-md text-label-md hover:bg-surface-container-highest transition-colors"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">price_change</span>
                              <span>Configure Rate Card</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs">
                  <span className="font-data-mono text-body-sm text-on-surface-variant">
                    Showing {filteredVendors.length} of 14 vendor agreements registered for NY Site 4
                  </span>
                  <div className="flex items-center gap-space-xs">
                    <button
                      className="px-2.5 py-1 text-on-surface-variant bg-surface-container-high rounded font-label-sm text-label-sm hover:bg-surface-container-highest"
                      type="button"
                    >
                      Previous
                    </button>
                    <button className="px-2.5 py-1 bg-gradient-to-r from-secondary to-[#F18E3B] text-white font-bold rounded font-label-sm text-label-sm shadow-xs" type="button">
                      1
                    </button>
                    <button
                      className="px-2.5 py-1 text-on-surface-variant bg-surface-container-high rounded font-label-sm text-label-sm hover:bg-surface-container-highest"
                      type="button"
                    >
                      2
                    </button>
                    <button
                      className="px-2.5 py-1 text-on-surface-variant bg-surface-container-high rounded font-label-sm text-label-sm hover:bg-surface-container-highest"
                      type="button"
                    >
                      3
                    </button>
                    <button
                      className="px-2.5 py-1 text-on-surface-variant bg-surface-container-high rounded font-label-sm text-label-sm hover:bg-surface-container-highest"
                      type="button"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
