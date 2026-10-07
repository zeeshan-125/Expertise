import React, { useState } from 'react';
import logoImg from '../assets/logo.png';

const roleProfiles = {
  accounts: {
    id: 'accounts',
    title: 'Sign In to Accounts Portal',
    email: 'approvals.accounts@expertise.sa',
    pass: 'Accounts#Release2026!',
    roleBadge: 'Approver',
    icon: 'account_balance_wallet',
    label: 'Accounts & Release',
    desc: 'Full payroll run, release & audit lock.',
    defaultPath: 'dashboard',
  },
  hr_maker: {
    id: 'hr_maker',
    title: 'Sign In to HR & Maker Portal',
    email: 'hr.maker@expertise.sa',
    pass: 'HR#OnboardSecure2026!',
    roleBadge: 'Maker',
    icon: 'assignment_ind',
    label: 'HR & Onboarding',
    desc: 'Suppliers, contracts & wage rates.',
    defaultPath: 'dashboard',
  },
  site_coord: {
    id: 'site_coord',
    title: 'Sign In to Site Coordinator Portal',
    email: 'site.logistics@expertise.sa',
    pass: 'SiteTimesheet#RUH2026!',
    roleBadge: 'Field Logger',
    icon: 'engineering',
    label: 'Site Coordinator',
    desc: 'Timesheet entry & crew deployment.',
    defaultPath: 'proxy-requests',
  },
  dept_mgr: {
    id: 'dept_mgr',
    title: 'Sign In to Manager Review Portal',
    email: 'manager.ops@expertise.sa',
    pass: 'DeptReview#Ops2026!',
    roleBadge: 'Reviewer',
    icon: 'fact_check',
    label: 'Dept Manager',
    desc: 'Timesheet vetting & shift approval.',
    defaultPath: 'departments',
  },
  cashier: {
    id: 'cashier',
    title: 'Sign In to Paymaster Cashier Tablet',
    email: 'paymaster.cashier@expertise.sa',
    pass: 'CashierTablet#Kiosk2026!',
    roleBadge: 'Paymaster',
    icon: 'payments',
    label: 'Cashier & Payout',
    desc: 'Tablet signature pad & physical payout.',
    defaultPath: 'hourly-rates',
  },
  admin: {
    id: 'admin',
    title: 'Sign In to Security & Admin Console',
    email: 'secops.admin@expertise.sa',
    pass: 'MasterAudit#Admin2026!',
    roleBadge: 'SecOps',
    icon: 'admin_panel_settings',
    label: 'Admin Governance',
    desc: 'Audit trails, IAM & supplier master.',
    defaultPath: 'suppliers',
  },
};

export default function Login({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('accounts');
  const [email, setEmail] = useState(roleProfiles.accounts.email);
  const [password, setPassword] = useState(roleProfiles.accounts.pass);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedLang, setSelectedLang] = useState('EN'); // 'EN' | 'AR'

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const selectRole = (roleKey) => {
    setSelectedRole(roleKey);
    setEmail(roleProfiles[roleKey].email);
    setPassword(roleProfiles[roleKey].pass);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        if (onLoginSuccess) {
          onLoginSuccess({
            roleKey: selectedRole,
            profile: roleProfiles[selectedRole],
            email,
          });
        }
      }, 1000);
    }, 900);
  };

  const currentProfile = roleProfiles[selectedRole];

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-[#F0F4F9] font-body-md text-on-surface antialiased">
      <div className="w-full max-w-[1720px] mx-auto min-h-[860px] flex flex-col lg:flex-row bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(14,19,48,0.18)] overflow-hidden border border-slate-200/80 my-auto animate-fade-in">
        
        {/* ======================================================== */}
        {/* LEFT PANEL: Executive Brand Showcase & Trust Foundation */}
        {/* ======================================================== */}
        <div className="w-full lg:w-[58%] bg-gradient-to-b from-[#131943] via-[#0E1330] to-[#0A0D26] text-white p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Glowing Orbs & Passing Light Beam */}
          <div className="aurora-orb-1 absolute -top-28 -left-28 w-[420px] h-[420px] bg-[#DE6E00]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="aurora-orb-2 absolute bottom-0 right-0 w-[560px] h-[560px] bg-[#222E68]/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="aurora-orb-1 absolute top-1/2 left-1/4 w-80 h-80 bg-[#DE6E00]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="aurora-light-beam absolute -top-1/2 -bottom-1/2 w-40 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none blur-xl"></div>

          {/* Top Brand & Node Cluster Bar */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              {/* Clean White Brand Box */}
              <div className="h-13 flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                <img
                  alt="Expertise"
                  className="h-8 sm:h-9 w-auto object-contain"
                  src={logoImg}
                />
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded font-bold shrink-0">
                  OS
                </span>
              </div>

              {/* Cluster Health Pill */}
              <div className="flex items-center space-x-2 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-sm shadow-secondary/60 animate-pulse"></span>
                <span className="font-data-mono text-[11px] tracking-wider uppercase text-slate-200">
                  Cluster SA-RUH-04 Active
                </span>
              </div>
            </div>

            {/* Title & Framework Manifesto */}
            <div className="max-w-2xl pt-2">
              <span className="font-label-sm text-[11px] uppercase tracking-widest text-secondary font-bold inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Institutional Human Capital &amp; Disbursal Framework
              </span>
              <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white mt-2 tracking-tight leading-tight">
                Enterprise Workforce &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F7A65E]">Payroll Governance</span>
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-slate-300/85 mt-2.5 max-w-xl leading-relaxed">
                Centralized contractor compliance, high-concurrency biometric turnstile reconciliation, maker-checker segregation, and multi-tenant ledger verification for logistics terminal operations.
              </p>
            </div>
          </div>

          {/* 3 Interactive Pillars Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10 my-8">
            {[
              {
                icon: 'verified_user',
                title: 'KYC & Compliance Guard',
                desc: 'Automated Iqama, passport, and Aramco safety permit verification across 14 authorized contractor supply agencies.',
                stat: 'Zero Expiry Breaches',
                badge: '99.98% Pass',
              },
              {
                icon: 'rule_folder',
                title: 'Maker-Checker Segregation',
                desc: 'Dual-key operational controls strictly partitioning Data Entry Makers from Finance Approvers and Treasury execution.',
                stat: 'Dual Signature Key',
                badge: 'Mandatory',
              },
              {
                icon: 'fingerprint',
                title: 'Biometric Disbursement',
                desc: 'Field tablet cashier execution featuring stylus legal endorsement, proxy witness chain validation, and photo-receipt lock.',
                stat: 'Offline Sync Ready',
                badge: 'AES-256',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 hover:border-secondary/40 transition-all duration-200 p-4.5 rounded-2xl flex flex-col justify-between backdrop-blur-sm group"
              >
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">{f.icon}</span>
                  </div>
                  <div className="font-headline-sm text-xs font-bold text-white group-hover:text-secondary transition-colors">
                    {f.title}
                  </div>
                  <p className="font-body-sm text-[11.5px] text-slate-300/75 leading-relaxed">{f.desc}</p>
                </div>
                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="font-data-mono text-slate-300">{f.stat}</span>
                  <span className="font-label-sm font-bold text-secondary bg-secondary/15 border border-secondary/30 px-2 py-0.5 rounded-md">
                    {f.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Live Metrics & Security Badges */}
          <div className="relative z-10 space-y-3.5 pt-2">
            <div className="bg-white/[0.05] border border-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                {[
                  { val: '12', label: 'Active Sites' },
                  { val: '420', label: 'Field Personnel Clocked' },
                  { val: 'SAR 4.85M', label: 'Disbursed MTD', highlight: true },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center space-x-2">
                    {i > 0 && <span className="text-white/20 mr-1">•</span>}
                    {i === 0 && <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>}
                    <span className={`font-data-mono font-bold ${s.highlight ? 'text-secondary' : 'text-white'}`}>
                      {s.val}
                    </span>
                    <span className="text-slate-300">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-1.5 bg-secondary/15 border border-secondary/30 px-3 py-1 rounded-xl">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                <span className="font-label-sm text-[11px] text-secondary uppercase tracking-wider font-bold">
                  ISO 27001 Certified
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-slate-400 text-[11px] font-data-mono pt-1">
              <div className="flex items-center space-x-4">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-secondary">lock</span>
                  FIPS 140-3 Hardware Token Compatible
                </span>
                <span>TLS 1.3 / AES-GCM 256-Bit</span>
              </div>
              <span className="text-slate-400">Central Bank &amp; WPS Audit Protocol v4.2</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Role Selector & Secure Authentication Form */}
        {/* ======================================================== */}
        <div className="w-full lg:w-[42%] bg-white p-6 sm:p-8 lg:p-12 flex flex-col justify-between overflow-y-auto">
          {/* Top Header: Language Switch & Gateway Badge */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center bg-[#F0F4F9] p-1 rounded-full border border-slate-200">
              <button
                onClick={() => setSelectedLang('EN')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedLang === 'EN' ? 'bg-white text-[#0E1330] shadow-xs' : 'text-slate-500 hover:text-[#0E1330]'
                }`}
                type="button"
              >
                EN
              </button>
              <button
                onClick={() => setSelectedLang('AR')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedLang === 'AR' ? 'bg-white text-[#0E1330] shadow-xs' : 'text-slate-500 hover:text-[#0E1330]'
                }`}
                type="button"
              >
                العربية
              </button>
            </div>

            <div className="flex items-center space-x-3.5">
              <a
                className="flex items-center space-x-1 text-xs text-slate-600 hover:text-secondary font-medium transition-colors"
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Expertise IT Operations Help Desk: +966 11 400 8921 / secops@expertise.sa');
                }}
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">help_center</span>
                <span>Help Desk</span>
              </a>
              <div className="flex items-center space-x-1.5 font-data-mono text-[10.5px] text-[#0E1330] bg-[#F0F4F9] border border-slate-200 px-2.5 py-1 rounded-lg">
                <span className="material-symbols-outlined text-[14px] text-secondary">shield_locked</span>
                <span className="font-bold">SECURE GATEWAY</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-4 my-auto pt-2">
            <div>
              <h2 className="font-headline-md text-2xl font-bold text-[#0E1330] tracking-tight">
                Welcome back
              </h2>
              <p className="font-body-md text-xs sm:text-sm text-slate-500 mt-1">
                Select your designated role persona to authenticate against the zero-trust workforce gateway.
              </p>
            </div>

            {/* Role Persona Selector Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-label-md text-xs text-[#0E1330] font-bold flex items-center gap-2">
                  <span>Select Portal Persona</span>
                  <span className="font-data-mono text-[10px] text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded font-semibold">
                    Deterministic RBAC
                  </span>
                </label>
                <span className="text-[11px] text-slate-400">Tap card to auto-fill</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(roleProfiles).map(([key, role]) => {
                  const isSelected = selectedRole === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selectRole(key)}
                      className={`text-left p-3 rounded-2xl border-2 transition-all flex flex-col justify-between relative group cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/50 border-secondary shadow-xs ring-2 ring-secondary/20'
                          : 'bg-[#F8F9FC] border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                      type="button"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-secondary text-white' : 'bg-[#0E1330] text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[17px]">{role.icon}</span>
                        </div>
                        <span
                          className={`font-data-mono px-2 py-0.5 rounded-full uppercase font-bold text-[9.5px] ${
                            isSelected ? 'bg-[#0E1330] text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {role.roleBadge}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <div
                          className={`font-label-md text-xs font-bold transition-colors ${
                            isSelected ? 'text-secondary' : 'text-[#0E1330] group-hover:text-secondary'
                          }`}
                        >
                          {role.label}
                        </div>
                        <div className="font-body-sm text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {role.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary animate-ping"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sandbox Banner */}
            <div className="bg-amber-50/70 border border-secondary/25 p-3 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">lightbulb</span>
                <span className="text-[#0E1330] text-[11.5px]">
                  Click any persona above to auto-populate test authentication credentials.
                </span>
              </div>
              <span className="font-data-mono text-[10px] text-secondary font-bold uppercase tracking-wider shrink-0 bg-secondary/10 px-2 py-0.5 rounded">
                Sandbox Active
              </span>
            </div>

            {/* Credentials Form */}
            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#0E1330]" htmlFor="corporateId">
                  Corporate Email or Workforce ID
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    alternate_email
                  </span>
                  <input
                    className="w-full bg-white text-[#0E1330] pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 font-body-md text-xs focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-slate-400 shadow-xs"
                    id="corporateId"
                    placeholder="id@expertise.sa or EMP-9021"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#0E1330]" htmlFor="corporatePassword">
                    Password
                  </label>
                  <a
                    className="text-xs text-secondary hover:underline font-semibold cursor-pointer"
                    href="#reset"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset link sent to your registered workforce email.');
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    key
                  </span>
                  <input
                    className="w-full bg-white text-[#0E1330] pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 font-body-md text-xs focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all font-data-mono shadow-xs"
                    id="corporatePassword"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0E1330] transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    title="Toggle Visibility"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* SSO / 2FA Switch */}
              <div className="bg-[#F8F9FC] border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0E1330] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0E1330]">Azure AD / Okta SSO</div>
                    <div className="text-[11px] text-slate-500">Federated 2FA token required</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={ssoEnabled}
                    onChange={() => setSsoEnabled(!ssoEnabled)}
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                className={`w-full py-3 px-6 rounded-2xl font-label-md text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg active:scale-[0.99] text-white cursor-pointer ${
                  isSuccess
                    ? 'bg-emerald-600 shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-secondary to-[#F7A65E] hover:from-[#d16500] hover:to-[#e8964e] shadow-secondary/25'
                }`}
                type="submit"
                disabled={isLoading || isSuccess}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[19px]">progress_activity</span>
                    <span>Authenticating against Zero-Trust Gateway...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-[19px]">check_circle</span>
                    <span>Access Token Granted • Redirecting...</span>
                  </>
                ) : (
                  <>
                    <span>{currentProfile.title}</span>
                    <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Security Audit Notice */}
          <div className="pt-4">
            <div className="p-3 rounded-2xl bg-[#F8F9FC] border border-slate-200 flex items-start space-x-2.5 text-xs text-slate-500">
              <span className="material-symbols-outlined text-[17px] text-secondary mt-0.5 shrink-0">policy</span>
              <p className="leading-tight text-[11px]">
                Security Notice: All login transactions are monitored with IP tracking, browser fingerprinting, and GPS geofence validation pursuant to KSA Statutory Labor &amp; Cyber Security Controls.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
