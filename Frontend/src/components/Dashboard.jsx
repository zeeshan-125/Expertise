import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('this-week');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const handleTimeRangeChange = (range) => {
    if (range === timeRange) return;
    setIsTransitioning(true);
    setTimeRange(range);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 280);
  };

  const periodOptions = [
    { id: 'today', label: 'Today' },
    { id: 'this-week', label: 'This Week' },
    { id: 'this-month', label: 'This Month' },
    { id: 'quarterly', label: 'Quarterly' },
  ];

  // Dynamic KPI & Bar Chart Telemetry Data by Selected Period
  const periodData = {
    today: {
      chartTitle: "Today's Shift Volume & Overtime",
      chartSubtitle: 'Hourly workforce base vs. overtime tracking across all active terminal gates',
      totalLabel: 'Total Daily Hours:',
      totalHours: '9,850 hrs',
      otHours: '1,420 OT hrs',
      ratioNote: 'OT ratio 14.4% within daily union threshold',
      maxHours: 2500,
      kpis: [
        {
          title: 'Active Deployed Workforce',
          value: '1,385',
          unit: 'workers',
          change: '+2.8%',
          trend: 'up',
          subtitle: 'Across 4 Terminal Sites',
          icon: 'groups',
          barPercent: 92.3,
          benchmark: 'Target: 1,500 max',
        },
        {
          title: 'Daily Labor Expenditure',
          value: 'SAR 28,450',
          unit: 'gross',
          change: '-3.4%',
          trend: 'favorable',
          subtitle: '83.6% of daily allocation',
          icon: 'payments',
          barPercent: 83.6,
          benchmark: 'Budget: SAR 34,000',
        },
        {
          title: 'On-Site Attendance Rate',
          value: '98.6%',
          unit: 'present',
          change: '+1.4%',
          trend: 'up',
          subtitle: '1,420 of 1,440 rostered present',
          icon: 'how_to_reg',
          barPercent: 98.6,
          benchmark: 'Target: 95.0%',
        },
        {
          title: 'Compliance & Credential Index',
          value: '98.2%',
          unit: 'verified',
          change: '3 Expiring',
          trend: 'warning',
          subtitle: '3 badges expiring today',
          icon: 'verified_user',
          barPercent: 98.2,
          benchmark: 'Audit Bar: 95%',
        },
      ],
      bars: [
        { day: '06-09h', regular: 1550, ot: 180, total: 1730, date: 'Shift 1' },
        { day: '09-12h', regular: 1950, ot: 280, total: 2230, date: 'Peak' },
        { day: '12-15h', regular: 1820, ot: 310, total: 2130, date: 'Shift 1' },
        { day: '15-18h', regular: 1650, ot: 290, total: 1940, date: 'Shift 2' },
        { day: '18-21h', regular: 1250, ot: 210, total: 1460, date: 'Swing' },
        { day: '21-00h', regular: 680, ot: 110, total: 790, date: 'Night' },
        { day: '00-06h', regular: 320, ot: 40, total: 360, date: 'Standby' },
      ],
    },
    'this-week': {
      chartTitle: 'Weekly Labor Volume & Overtime',
      chartSubtitle: 'Comparison of Regular Base Hours vs. Overtime Escalation',
      totalLabel: 'Total Weekly Hours:',
      totalHours: '68,550 hrs',
      otHours: '10,650 OT hrs',
      ratioNote: 'OT ratio within 15.5% union threshold',
      maxHours: 12000,
      kpis: [
        {
          title: 'Active Deployed Workforce',
          value: '1,420',
          unit: 'workers',
          change: '+6.4%',
          trend: 'up',
          subtitle: 'Across 4 NY Terminal Sites',
          icon: 'groups',
          barPercent: 88.0,
          benchmark: 'Target: 1,500 max',
        },
        {
          title: 'Weekly Labor Expenditure',
          value: 'SAR 184,650',
          unit: 'gross',
          change: '-2.1%',
          trend: 'favorable',
          subtitle: '87.9% of ceiling utilized',
          icon: 'payments',
          barPercent: 87.9,
          benchmark: 'Budget: SAR 210,000',
        },
        {
          title: 'On-Site Attendance Rate',
          value: '97.8%',
          unit: 'present',
          change: '+1.2%',
          trend: 'up',
          subtitle: '97.8% average shift reporting',
          icon: 'how_to_reg',
          barPercent: 97.8,
          benchmark: 'Target: 95.0%',
        },
        {
          title: 'Compliance & Credential Index',
          value: '96.8%',
          unit: 'verified',
          change: '14 Expiring',
          trend: 'warning',
          subtitle: '14 badges expiring <14 days',
          icon: 'verified_user',
          barPercent: 96.8,
          benchmark: 'Audit Bar: 95%',
        },
      ],
      bars: [
        { day: 'Mon', regular: 9600, ot: 1100, total: 10700, date: 'Oct 02' },
        { day: 'Tue', regular: 9800, ot: 1250, total: 11050, date: 'Oct 03' },
        { day: 'Wed', regular: 9750, ot: 1400, total: 11150, date: 'Oct 04' },
        { day: 'Thu', regular: 9900, ot: 1550, total: 11450, date: 'Oct 05' },
        { day: 'Fri', regular: 9550, ot: 1800, total: 11350, date: 'Oct 06' },
        { day: 'Sat', regular: 4200, ot: 2100, total: 6300, date: 'Oct 07' },
        { day: 'Sun', regular: 2100, ot: 1450, total: 3550, date: 'Oct 08' },
      ],
    },
    'this-month': {
      chartTitle: 'Monthly Labor Volume & Overtime',
      chartSubtitle: 'Weekly aggregated base hours vs. overtime burn rate for October',
      totalLabel: 'Total Monthly Hours:',
      totalHours: '284,200 hrs',
      otHours: '41,600 OT hrs',
      ratioNote: 'OT ratio within 14.6% budget threshold',
      maxHours: 70000,
      kpis: [
        {
          title: 'Active Deployed Workforce',
          value: '1,485',
          unit: 'workers',
          change: '+9.1%',
          trend: 'up',
          subtitle: 'Peak monthly mobilization',
          icon: 'groups',
          barPercent: 94.0,
          benchmark: 'Target: 1,580 max',
        },
        {
          title: 'Monthly Labor Expenditure',
          value: 'SAR 742,100',
          unit: 'gross',
          change: '-1.8%',
          trend: 'favorable',
          subtitle: '88.3% of monthly ceiling',
          icon: 'payments',
          barPercent: 88.3,
          benchmark: 'Budget: SAR 840,000',
        },
        {
          title: 'On-Site Attendance Rate',
          value: '98.1%',
          unit: 'present',
          change: '+1.8%',
          trend: 'up',
          subtitle: 'Consistently above 95% target',
          icon: 'how_to_reg',
          barPercent: 98.1,
          benchmark: 'Target: 95.0%',
        },
        {
          title: 'Compliance & Credential Index',
          value: '97.4%',
          unit: 'verified',
          change: '8 Expiring',
          trend: 'warning',
          subtitle: '8 pending safety renewals',
          icon: 'verified_user',
          barPercent: 97.4,
          benchmark: 'Audit Bar: 95%',
        },
      ],
      bars: [
        { day: 'Oct 01-05', regular: 47200, ot: 6500, total: 53700, date: 'Cycle 1' },
        { day: 'Oct 06-10', regular: 50400, ot: 7200, total: 57600, date: 'Cycle 2' },
        { day: 'Oct 11-15', regular: 52100, ot: 7900, total: 60000, date: 'Cycle 3' },
        { day: 'Oct 16-20', regular: 51800, ot: 8300, total: 60100, date: 'Cycle 4' },
        { day: 'Oct 21-25', regular: 49500, ot: 7600, total: 57100, date: 'Cycle 5' },
        { day: 'Oct 26-29', regular: 48900, ot: 6900, total: 55800, date: 'Cycle 6' },
        { day: 'Oct 30-31', regular: 34300, ot: 4700, total: 39000, date: 'Cycle 7' },
      ],
    },
    quarterly: {
      chartTitle: 'Quarterly Labor Volume & Overtime',
      chartSubtitle: 'Multi-cycle workforce trajectory and overtime escalations across Q3/Q4',
      totalLabel: 'Total Quarterly Hours:',
      totalHours: '845,900 hrs',
      otHours: '118,400 OT hrs',
      ratioNote: 'OT ratio 14.0% well within regulatory limit',
      maxHours: 150000,
      kpis: [
        {
          title: 'Active Deployed Workforce',
          value: '1,520',
          unit: 'avg active',
          change: '+12.4%',
          trend: 'up',
          subtitle: 'Quarterly staffing capacity',
          icon: 'groups',
          barPercent: 91.2,
          benchmark: 'Target: 1,650 max',
        },
        {
          title: 'Quarterly Labor Expenditure',
          value: 'SAR 2,190,500',
          unit: 'gross',
          change: '-3.5%',
          trend: 'favorable',
          subtitle: '86.9% of quarterly ceiling',
          icon: 'payments',
          barPercent: 86.9,
          benchmark: 'Budget: SAR 2,520,000',
        },
        {
          title: 'On-Site Attendance Rate',
          value: '97.9%',
          unit: 'present',
          change: '+2.1%',
          trend: 'up',
          subtitle: 'Quarterly shift attendance stability',
          icon: 'how_to_reg',
          barPercent: 97.9,
          benchmark: 'Target: 95.0%',
        },
        {
          title: 'Compliance & Credential Index',
          value: '98.1%',
          unit: 'verified',
          change: 'Passed',
          trend: 'up',
          subtitle: 'Full ISO & OSHA audit clearance',
          icon: 'verified_user',
          barPercent: 98.1,
          benchmark: 'Audit Bar: 95%',
        },
      ],
      bars: [
        { day: 'Jul (1)', regular: 98000, ot: 13500, total: 111500, date: 'Bi-wk 1' },
        { day: 'Jul (2)', regular: 104000, ot: 14800, total: 118800, date: 'Bi-wk 2' },
        { day: 'Aug (1)', regular: 108500, ot: 15600, total: 124100, date: 'Bi-wk 3' },
        { day: 'Aug (2)', regular: 112000, ot: 16200, total: 128200, date: 'Bi-wk 4' },
        { day: 'Sep (1)', regular: 116200, ot: 17100, total: 133300, date: 'Bi-wk 5' },
        { day: 'Sep (2)', regular: 114800, ot: 16800, total: 131600, date: 'Bi-wk 6' },
        { day: 'Oct (Est)', regular: 102500, ot: 14400, total: 116900, date: 'Current' },
      ],
    },
  };

  const currentData = periodData[timeRange] || periodData['this-week'];
  const kpis = currentData.kpis;
  const currentBars = currentData.bars;
  const maxHours = currentData.maxHours;

  // Departmental breakdown data
  const departments = [
    { name: 'Civil & Heavy Framing', count: 340, percent: 24, avgRate: 'SAR 32.40/hr', status: 'Optimal', color: 'bg-secondary' },
    { name: 'MEP Systems (HVAC & Electric)', count: 280, percent: 20, avgRate: 'SAR 38.50/hr', status: 'High Demand', color: 'bg-[#F18E3B]' },
    { name: 'Structural Steel & Welding', count: 250, percent: 18, avgRate: 'SAR 36.20/hr', status: 'Optimal', color: 'bg-secondary/85' },
    { name: 'Logistics & Heavy Rigging', count: 210, percent: 15, avgRate: 'SAR 29.75/hr', status: 'Optimal', color: 'bg-[#F7A65E]' },
    { name: 'HSE Safety & Quality Control', count: 180, percent: 13, avgRate: 'SAR 41.00/hr', status: 'Reg. Compliant', color: 'bg-secondary/65' },
    { name: 'Concrete & Earthworks', count: 160, percent: 10, avgRate: 'SAR 26.80/hr', status: 'Slight Surplus', color: 'bg-[#FBCE9D]' },
  ];

  // Top suppliers performance
  const supplierPerformance = [
    { name: 'BuildTech Manpower LLC', workers: 420, compliance: 98.4, spend: 'SAR 54,200', tier: 'Tier 1' },
    { name: 'Gulf Apex Resources', workers: 310, compliance: 96.1, spend: 'SAR 41,800', tier: 'Tier 1' },
    { name: 'Prime Infra Solutions', workers: 245, compliance: 92.5, spend: 'SAR 32,100', tier: 'Tier 2' },
    { name: 'Empire Logistics Technical', workers: 195, compliance: 97.2, spend: 'SAR 26,900', tier: 'Tier 2' },
    { name: 'Titan Industrial Crewing', workers: 150, compliance: 94.8, spend: 'SAR 19,650', tier: 'Tier 3' },
  ];

  // Recent operational activity
  const recentActivities = [
    {
      id: 1,
      type: 'approval',
      title: 'Shift 1 Gate Surge Proxy Punch Approved',
      detail: 'Marcus Sterling cleared batch of 6 civil specialists for Site 4 West Gate',
      time: '12m ago',
      icon: 'check_circle',
      iconColor: 'text-secondary bg-secondary/10',
    },
    {
      id: 2,
      type: 'warning',
      title: 'OSHA Certification Renewal Required',
      detail: '14 workers from Gulf Apex reaching 30-day compliance expiry threshold',
      time: '34m ago',
      icon: 'warning',
      iconColor: 'text-error bg-error-container/40',
    },
    {
      id: 3,
      type: 'info',
      title: 'Rate Card Amendment Executed',
      detail: 'Local 282 Overtime escalation factor updated to 1.55x for Sunday structural night-shifts',
      time: '1h 15m ago',
      icon: 'price_change',
      iconColor: 'text-on-tertiary-container bg-on-tertiary-container/10',
    },
    {
      id: 4,
      type: 'approval',
      title: 'New Supplier Intake Verified',
      detail: 'Titan Industrial Crewing COI & W-9 validated via Automated FEIN clearinghouse',
      time: '2h 40m ago',
      icon: 'domain_verification',
      iconColor: 'text-secondary bg-secondary/10',
    },
  ];

  const filteredActivities = activeTab === 'all'
    ? recentActivities
    : recentActivities.filter(a => a.type === activeTab);

  return (
    <div className="flex flex-col w-full space-y-4 lg:space-y-5">
      {/* Dashboard Top Banner - Executive Aurora Command Center */}
      <div className="bg-aurora-animated border border-white/10 rounded-2xl p-4 sm:p-5 lg:py-5 lg:px-6 shadow-xl shadow-[#1A1F45]/15 relative overflow-hidden text-white">
        {/* Dynamic moving auroras & passing light beam */}
        <div className="aurora-orb-1 absolute -right-12 -top-12 w-96 h-96 bg-[#E97F29]/30 rounded-full pointer-events-none blur-3xl"></div>
        <div className="aurora-orb-2 absolute right-72 -bottom-24 w-80 h-80 bg-[#353D80]/50 rounded-full pointer-events-none blur-3xl"></div>
        <div className="aurora-orb-1 absolute left-1/4 -top-20 w-72 h-72 bg-[#E97F29]/15 rounded-full pointer-events-none blur-3xl"></div>
        <div className="aurora-light-beam absolute -top-1/2 -bottom-1/2 w-48 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none blur-xl"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          {/* Left Title and Badges */}
          <div className="flex flex-col space-y-2.5 max-w-2xl">
            {/* Main Headline */}
            <div>
              <h1 className="font-headline-lg text-xl sm:text-2xl lg:text-[25px] font-bold text-white tracking-tight leading-snug">
                Workforce Analytics &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F7A65E]">Operational Health</span>
              </h1>
              <p className="font-body-md text-xs sm:text-[13px] text-white/75 mt-0.5 leading-relaxed max-w-xl">
                Real-time multi-terminal KPI benchmarking, shift labor volume, credential validation integrity, and supplier allocation analytics.
              </p>
            </div>

            {/* Quick Context Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white/90 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary">domain</span>
                <span>4 Terminals Connected</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white/90 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
                <span>Shift 1 Active (07:00 - 15:30)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-emerald-400">verified</span>
                <span>Biometric Terminal Sync: 99.8%</span>
              </div>
            </div>
          </div>

          {/* Right Action Toolbar & Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
            {/* Period Segmented Control */}
            <div className="inline-flex bg-black/30 p-1 rounded-xl border border-white/15 backdrop-blur-md shadow-inner">
              {periodOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleTimeRangeChange(opt.id)}
                  className={`px-3 py-1.5 rounded-lg font-label-sm text-xs font-semibold transition-all duration-300 ${
                    timeRange === opt.id
                      ? 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white font-bold shadow-md shadow-secondary/30 scale-[1.02]'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Export CTA Button */}
            <button
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white px-4 py-2 rounded-xl font-label-md text-xs font-bold shadow-md shadow-secondary/30 transition-all group ring-2 ring-secondary/20"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-white group-hover:-translate-y-0.5 transition-transform">
                file_download
              </span>
              <span>Executive Brief PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl border border-outline-variant/60 hover:border-secondary/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'}`}>
              <div className="flex items-start justify-between gap-2">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  {kpi.title}
                </span>
                <div className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center shrink-0 group-hover:bg-[#FFF4EC] group-hover:text-secondary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">{kpi.icon}</span>
                </div>
              </div>

              <div className="mt-1.5 mb-1 flex items-baseline gap-1">
                <span className="font-currency-display text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
                  {kpi.value}
                </span>
                <span className="text-xs text-on-surface-variant font-body-sm">{kpi.unit}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {kpi.trend === 'up' && (
                  <span className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold font-label-md px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50 shrink-0">
                    <span className="material-symbols-outlined text-[11px]">trending_up</span>
                    {kpi.change}
                  </span>
                )}
                {kpi.trend === 'favorable' && (
                  <span className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold font-label-md px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container border border-secondary/20 shrink-0">
                    <span className="material-symbols-outlined text-[11px]">trending_down</span>
                    {kpi.change}
                  </span>
                )}
                {kpi.trend === 'warning' && (
                  <span className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold font-label-md px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60 shrink-0">
                    <span className="material-symbols-outlined text-[11px]">priority_high</span>
                    {kpi.change}
                  </span>
                )}
                <span className="text-[11px] text-on-surface-variant font-data-mono leading-tight">
                  {kpi.subtitle}
                </span>
              </div>
            </div>

            {/* Progress Track with Benchmark Context */}
            <div className="mt-2.5 pt-2 border-t border-outline-variant/30">
              <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-secondary to-[#F18E3B] h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${kpi.barPercent}%` }}
                ></div>
              </div>
              <div className={`flex items-center justify-between mt-1 text-[10.5px] text-on-surface-variant font-data-mono transition-opacity duration-300 ${isTransitioning ? 'opacity-40' : 'opacity-100'}`}>
                <span>{kpi.barPercent}% of ceiling</span>
                <span className="truncate max-w-[120px] text-right">{kpi.benchmark}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts & Visual Representation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        {/* Weekly Labor Hours Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-40' : 'opacity-100'}`}>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                  {currentData.chartTitle}
                </h2>
                <span className="font-label-sm text-[11px] bg-secondary-fixed text-on-secondary-container px-2 py-0.5 rounded-full font-semibold">
                  Shift telemetry
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                {currentData.chartSubtitle}
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 font-label-sm text-xs shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#2D346B]"></span>
                <span className="text-on-surface-variant font-medium">Regular Hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-secondary"></span>
                <span className="text-on-surface-variant font-medium">Overtime (1.5x)</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Canvas Simulation */}
          <div className="pt-4 pb-1">
            <div className="h-56 sm:h-60 flex items-end justify-between gap-2.5 sm:gap-5 border-b border-outline-variant/30 pb-2 px-1">
              {currentBars.map((d, index) => {
                const regularHeightPercent = Math.min(100, Math.max(4, (d.regular / maxHours) * 100));
                const otHeightPercent = Math.min(100, Math.max(2, (d.ot / maxHours) * 100));
                return (
                  <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Hover Tooltip */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-secondary to-[#F18E3B] text-white text-xs rounded-lg py-1 px-2.5 pointer-events-none shadow-lg whitespace-nowrap z-20">
                      <div className="font-label-md font-semibold">{d.day} ({d.date})</div>
                      <div>Total: {d.total.toLocaleString()} hrs</div>
                      <div className="text-white/90 font-medium">OT: {d.ot.toLocaleString()} hrs</div>
                    </div>

                    {/* Stacked Vertical Bars */}
                    <div className="w-full max-w-[38px] flex flex-col justify-end items-center h-full">
                      {/* Overtime Top Bar */}
                      <div
                        className="w-full bg-gradient-to-t from-secondary to-[#F18E3B] rounded-t-sm transition-all duration-700 ease-out group-hover:brightness-110 shadow-xs"
                        style={{ height: `${otHeightPercent}%` }}
                      ></div>
                      {/* Regular Base Bar */}
                      <div
                        className="w-full bg-[#2D346B] rounded-b-sm transition-all duration-700 ease-out group-hover:brightness-110"
                        style={{ height: `${regularHeightPercent}%` }}
                      ></div>
                    </div>

                    {/* Day & Date Label */}
                    <div className={`text-center mt-2 transition-all duration-300 ${isTransitioning ? 'opacity-20 -translate-y-1' : 'opacity-100 translate-y-0'}`}>
                      <span className="font-label-sm text-xs text-on-surface block font-medium">{d.day}</span>
                      <span className="font-data-mono text-[10px] text-on-surface-variant block">{d.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart Summary Footnote */}
            <div className={`pt-3 flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-data-mono text-xs gap-1.5 transition-all duration-300 ${isTransitioning ? 'opacity-40' : 'opacity-100'}`}>
              <div>
                <span>{currentData.totalLabel} </span>
                <strong className="text-on-surface font-headline-sm">{currentData.totalHours}</strong>
                <span className="ml-1.5 text-secondary font-semibold">({currentData.otHours})</span>
              </div>
              <div className="flex items-center gap-1 text-secondary font-medium">
                <span className="material-symbols-outlined text-[15px]">trending_up</span>
                <span>{currentData.ratioNote}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Department Headcount & Staffing Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">Department &amp; Trade Deployment</h2>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">Active headcount &amp; trade ceiling allocation</p>
            </div>
            <button className="text-secondary font-label-md text-xs font-semibold hover:underline flex items-center gap-0.5" type="button">
              <span>View All</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Department Progress Bars List */}
          <div className="space-y-2 pt-1">
            {departments.map((dept, index) => (
              <div key={index} className="p-2 sm:p-2.5 rounded-lg bg-surface-container-low/50 hover:bg-surface-container-low transition-colors space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-body-md-medium text-xs font-medium text-on-surface">{dept.name}</span>
                  <div className="flex items-center gap-1 font-data-mono text-xs">
                    <span className="text-on-surface font-semibold">{dept.count}</span>
                    <span className="text-on-surface-variant">({dept.percent}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`${dept.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${dept.percent * 3}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between font-label-sm text-[11px] text-on-surface-variant pt-0.5">
                  <span className="font-data-mono">Avg: {dept.avgRate}</span>
                  <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface text-[10px] font-medium">
                    {dept.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Supplier Spend & Real-time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        {/* Top Suppliers Spend & Compliance Table (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">Primary Manpower Suppliers</h2>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">Top contractor allocation and compliance scoring</p>
            </div>
            <button className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg font-label-md text-xs font-medium flex items-center gap-1 transition-colors" type="button">
              <span className="material-symbols-outlined text-[15px]">tune</span>
              <span>Filter Vendors</span>
            </button>
          </div>

          {/* Supplier Mini Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
                  <th className="py-2 px-3 rounded-l-lg">Supplier Entity</th>
                  <th className="py-2 px-3">Contract Tier</th>
                  <th className="py-2 px-3">Headcount</th>
                  <th className="py-2 px-3">Compliance</th>
                  <th className="py-2 px-3 text-right rounded-r-lg">Weekly Spend</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-xs text-on-surface divide-y-0">
                {supplierPerformance.map((sup, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-body-md-medium text-xs font-medium text-on-surface">{sup.name}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-label-sm text-[11px] bg-surface-container-high text-on-surface px-1.5 py-0.5 rounded">
                        {sup.tier}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-data-mono text-xs">{sup.workers} workers</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-secondary to-[#F18E3B] h-full rounded-full" style={{ width: `${sup.compliance}%` }}></div>
                        </div>
                        <span className="font-data-mono text-xs">{sup.compliance}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-data-mono font-medium text-on-surface">
                      {sup.spend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Operational Telemetry & Exceptions (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">Operational Activity Stream</h2>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">Real-time gate logs and compliance clearances</p>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-low p-0.5 rounded-lg">
              {['all', 'approval', 'warning'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-0.5 text-xs rounded-md capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white font-bold shadow-xs'
                      : 'text-on-surface-variant hover:text-secondary'
                  }`}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Activity items list */}
          <div className="space-y-2 pt-1">
            {filteredActivities.map((act) => (
              <div key={act.id} className="p-2 rounded-lg bg-surface-container-low/60 flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${act.iconColor}`}>
                  <span className="material-symbols-outlined text-[16px]">{act.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-body-md-medium text-xs font-medium text-on-surface truncate">
                      {act.title}
                    </span>
                    <span className="font-data-mono text-[10px] text-on-surface-variant shrink-0">
                      {act.time}
                    </span>
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">
                    {act.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Fast Action Prompt */}
          <div className="mt-2 pt-2 border-t border-outline-variant/20 flex items-center justify-between">
            <span className="font-label-sm text-[10.5px] text-on-surface-variant uppercase">Biometric Ingest: Online</span>
            <button className="text-secondary font-label-md text-xs font-semibold hover:underline flex items-center gap-1" type="button">
              <span>View Security Logs</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
