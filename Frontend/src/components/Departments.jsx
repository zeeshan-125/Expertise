import React, { useState } from 'react';

export default function Departments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeptDetail, setSelectedDeptDetail] = useState(null);

  // Initial Seed Departments
  const [departments, setDepartments] = useState([
    {
      id: 1,
      code: 'DEP-CIV-01',
      name: 'Civil & Heavy Framing',
      manager: 'Eng. Fahad Al-Otaibi',
      managerEmail: 'f.otaibi@workforce.sa',
      costCenter: 'CC-1010-CIV',
      status: 'Active',
      terminal: 'Site 04 - Metro Expansion',
      headcount: 340,
      capacity: 400,
      monthlyBudgetSAR: '420,000',
      trades: ['Civil Framing', 'Carpentry Lead', 'Structural Concrete', 'Earthworks'],
      description: 'Responsible for structural excavation, concrete foundations, formwork, and heavy civil infrastructure.',
    },
    {
      id: 2,
      code: 'DEP-MEP-02',
      name: 'MEP & Electrical Systems',
      manager: 'Tariq Al-Ghamdi',
      managerEmail: 't.ghamdi@workforce.sa',
      costCenter: 'CC-2020-MEP',
      status: 'Active',
      terminal: 'Site 04 - Substation North',
      headcount: 280,
      capacity: 320,
      monthlyBudgetSAR: '510,000',
      trades: ['HVAC Installation', 'High Voltage Electric', 'Piping & Plumbing', 'Switchgear'],
      description: 'Handles high-voltage substation integration, terminal HVAC air-handlers, and specialized building mechanical services.',
    },
    {
      id: 3,
      code: 'DEP-STL-03',
      name: 'Structural Steel & Welding',
      manager: 'Marcus Sterling',
      managerEmail: 'm.sterling@workforce.sa',
      costCenter: 'CC-3030-STL',
      status: 'Active',
      terminal: 'Site 04 - Main Logistics Terminal',
      headcount: 250,
      capacity: 300,
      monthlyBudgetSAR: '385,000',
      trades: ['AWS D1.1 Certified Welding', 'Girder Rigging', 'Crane Operations', 'Steel Erection'],
      description: 'Specializes in high-altitude girder rigging, robotic beam alignment, and certified heavy structural welding.',
    },
    {
      id: 4,
      code: 'DEP-HSE-04',
      name: 'HSE Safety & Quality Compliance',
      manager: 'Soraya Chen',
      managerEmail: 's.chen@workforce.sa',
      costCenter: 'CC-4040-HSE',
      status: 'Active',
      terminal: 'All Terminals (Site 01-04)',
      headcount: 180,
      capacity: 200,
      monthlyBudgetSAR: '295,000',
      trades: ['OSHA-30 Marshalls', 'First Aid Level 2', 'Environmental Safety', 'QA Audits'],
      description: 'Enforces site-wide OSHA standards, zero-tolerance safety protocols, biometric gate compliance, and regulatory audits.',
    },
    {
      id: 5,
      code: 'DEP-LOG-05',
      name: 'Fleet Logistics & Heavy Rigging',
      manager: 'Ibrahim Al-Zahrani',
      managerEmail: 'i.zahrani@workforce.sa',
      costCenter: 'CC-5050-LOG',
      status: 'Active',
      terminal: 'Site 04 - Gate West Logistics',
      headcount: 210,
      capacity: 250,
      monthlyBudgetSAR: '340,000',
      trades: ['Crane Operators', 'Heavy Haulage', 'Warehouse Telemetry', 'Rigging Techs'],
      description: 'Manages terminal transit fleets, container yard staging, crane operations, and bulk material offloading.',
    },
    {
      id: 6,
      code: 'DEP-EAR-06',
      name: 'Excavation & Ground Preparation',
      manager: 'Kwame Mensah',
      managerEmail: 'k.mensah@workforce.sa',
      costCenter: 'CC-6060-EAR',
      status: 'Pending Review',
      terminal: 'Site 04 - Terminal South Yard',
      headcount: 160,
      capacity: 200,
      monthlyBudgetSAR: '240,000',
      trades: ['Excavator Operators', 'Soil Stabilization', 'Grade Surveying'],
      description: 'Ground stabilization, subterranean utility trenching, grading, and preliminary foundation preparation.',
    },
  ]);

  // Form State for Creating Department
  const initialForm = {
    code: '',
    name: '',
    manager: '',
    managerEmail: '',
    costCenter: '',
    terminal: 'Site 04 - Terminal Logistics',
    capacity: '100',
    monthlyBudgetSAR: '350,000',
    status: 'Active',
    trades: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateDepartment = (e) => {
    e.preventDefault();
    const tradeArray = formData.trades
      ? formData.trades.split(',').map((t) => t.trim()).filter(Boolean)
      : ['General Operations', 'Field Supervision'];

    const newDept = {
      id: Date.now(),
      code: formData.code.toUpperCase() || `DEP-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name || 'New Specialized Department',
      manager: formData.manager || 'Unassigned Manager',
      managerEmail: formData.managerEmail || 'manager@workforce.sa',
      costCenter: formData.costCenter.toUpperCase() || `CC-${Math.floor(1000 + Math.random() * 9000)}-OPS`,
      status: formData.status,
      terminal: formData.terminal || 'Site 04',
      headcount: 0,
      capacity: parseInt(formData.capacity, 10) || 100,
      monthlyBudgetSAR: formData.monthlyBudgetSAR || '300,000',
      trades: tradeArray,
      description: formData.description || 'Newly established workforce operational department.',
      isNew: true,
    };

    setDepartments([newDept, ...departments]);
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  // Filter logic
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.costCenter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.trades.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'all' || dept.status.toLowerCase().replace(' ', '') === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalHeadcount = departments.reduce((acc, d) => acc + d.headcount, 0);
  const activeCount = departments.filter((d) => d.status === 'Active').length;

  return (
    <div className="flex flex-col w-full space-y-4 lg:space-y-5">
      {/* Top Department Command Center Banner - Executive Aurora Deck */}
      <div className="bg-aurora-animated border border-white/10 rounded-2xl p-4 sm:p-5 lg:py-5 lg:px-6 shadow-xl shadow-[#1A1F45]/15 relative overflow-hidden text-white">
        {/* Dynamic moving auroras & passing light beam */}
        <div className="aurora-orb-1 absolute -right-12 -top-12 w-96 h-96 bg-[#E97F29]/30 rounded-full pointer-events-none blur-3xl"></div>
        <div className="aurora-orb-2 absolute right-72 -bottom-24 w-80 h-80 bg-[#353D80]/50 rounded-full pointer-events-none blur-3xl"></div>
        <div className="aurora-orb-1 absolute left-1/4 -top-20 w-72 h-72 bg-[#E97F29]/15 rounded-full pointer-events-none blur-3xl"></div>
        <div className="aurora-light-beam absolute -top-1/2 -bottom-1/2 w-48 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none blur-xl"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col space-y-2.5 max-w-2xl">
            {/* Title */}
            <div>
              <h1 className="font-headline-lg text-xl sm:text-2xl lg:text-[25px] font-bold text-white tracking-tight leading-snug">
                Departments &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F7A65E]">Trade Divisions</span>
              </h1>
              <p className="font-body-md text-xs sm:text-[13px] text-white/75 mt-0.5 leading-relaxed max-w-xl">
                Configure operational divisions, appoint department heads, assign GL cost centers, set manpower capacity ceilings, and control monthly labor budgets.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white/90 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary">apartment</span>
                <span>Total Divisions: <strong className="text-white">{departments.length} Units ({activeCount} Active)</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white/90 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary">groups</span>
                <span>Assigned Staff: <strong className="text-white">{totalHeadcount.toLocaleString()} Workers</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white/90 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary">account_balance_wallet</span>
                <span>Combined Budget: <strong className="text-secondary font-bold font-data-mono">SAR 2,190,000 / mo</strong></span>
              </div>
            </div>
          </div>

          {/* Action Button: Create New Department */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white px-4 py-2 rounded-xl font-label-md text-xs font-bold shadow-md shadow-secondary/30 transition-all group ring-2 ring-secondary/20"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-white group-hover:rotate-90 transition-transform">
                add_circle
              </span>
              <span>+ Create Department</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters Ribbon */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/50 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            search
          </span>
          <input
            className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-sm pl-11 pr-4 py-2 rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/40"
            placeholder="Search department name, code, manager, cost center..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter & View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 text-xs">
            <span className="px-2 text-on-surface-variant font-semibold">Status:</span>
            {['all', 'active', 'pendingreview'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all font-medium ${
                  selectedStatus === status
                    ? 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-secondary'
                }`}
                type="button"
              >
                {status === 'all' ? 'All' : status === 'pendingreview' ? 'Pending' : 'Active'}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'cards'
                  ? 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
              title="Card Grid View"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
              title="Table List View"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Departments Grid or Table View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-lg">
          {filteredDepartments.map((dept) => {
            const utilizationPercent = Math.round((dept.headcount / dept.capacity) * 100);
            return (
              <div
                key={dept.id}
                className={`bg-surface-container-lowest rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                  dept.isNew
                    ? 'border-secondary ring-2 ring-secondary/20 shadow-md'
                    : 'border-outline-variant/60 hover:border-secondary/40 shadow-xs'
                }`}
              >
                {/* Card Top: Code & Status */}
                <div className="p-6 border-b border-outline-variant/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-data-mono text-xs font-bold text-primary bg-primary-fixed px-2.5 py-1 rounded-lg border border-primary/20">
                        {dept.code}
                      </span>
                      {dept.isNew && (
                        <span className="text-[10px] font-bold text-white bg-secondary px-2 py-0.5 rounded-full animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>

                    <span
                      className={`font-label-sm text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                        dept.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dept.status === 'Active' ? 'bg-emerald-600' : 'bg-amber-500'
                        }`}
                      ></span>
                      {dept.status}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-3 leading-snug">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                    {dept.description}
                  </p>
                </div>

                {/* Card Middle: Manager, Cost Center & Metrics */}
                <div className="p-6 space-y-4">
                  {/* Department Head / Manager Info */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/30">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {dept.manager.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider block">
                        Department Head / Manager
                      </span>
                      <strong className="text-xs font-bold text-on-surface block truncate">
                        {dept.manager}
                      </strong>
                      <span className="text-[11px] text-on-surface-variant truncate block font-data-mono">
                        {dept.managerEmail}
                      </span>
                    </div>
                  </div>

                  {/* Cost Center & Budget Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-surface-container-low/40 rounded-xl border border-outline-variant/20">
                      <span className="text-on-surface-variant text-[10px] uppercase font-semibold block">
                        GL Cost Center
                      </span>
                      <span className="font-data-mono font-bold text-xs text-on-surface block mt-0.5">
                        {dept.costCenter}
                      </span>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5 truncate">
                        {dept.terminal}
                      </span>
                    </div>

                    <div className="p-3 bg-surface-container-low/40 rounded-xl border border-outline-variant/20">
                      <span className="text-on-surface-variant text-[10px] uppercase font-semibold block">
                        Monthly Budget
                      </span>
                      <span className="font-data-mono font-bold text-xs text-secondary block mt-0.5">
                        SAR {dept.monthlyBudgetSAR}
                      </span>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5">
                        Cap: {dept.capacity} staff
                      </span>
                    </div>
                  </div>

                  {/* Staff Headcount Utilization Meter */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant font-medium">Headcount Allocation</span>
                      <span className="font-data-mono font-bold text-on-surface">
                        {dept.headcount} / {dept.capacity} ({utilizationPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-secondary h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Trade Badges */}
                  <div>
                    <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                      Functional Trades
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dept.trades.map((trade, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-container-low text-on-surface border border-outline-variant/30"
                        >
                          {trade}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-surface-container-low/40 border-t border-outline-variant/20 rounded-b-2xl flex items-center justify-between">
                  <button
                    onClick={() => setSelectedDeptDetail(dept)}
                    className="text-xs font-semibold text-secondary hover:text-secondary/80 flex items-center gap-1"
                    type="button"
                  >
                    <span>View Division Details</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>

                  <button
                    onClick={() => setSelectedDeptDetail(dept)}
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Department Name</th>
                  <th className="py-3 px-4">Department Head / Manager</th>
                  <th className="py-3 px-4">Cost Center</th>
                  <th className="py-3 px-4">Allocated Staff</th>
                  <th className="py-3 px-4">Monthly Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs text-on-surface divide-y divide-outline-variant/20">
                {filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-data-mono font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded text-xs">
                        {dept.code}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">{dept.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                          {dept.manager[0]}
                        </div>
                        <div>
                          <span className="font-semibold block">{dept.manager}</span>
                          <span className="text-[10px] text-on-surface-variant font-data-mono">{dept.managerEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-data-mono font-semibold">{dept.costCenter}</td>
                    <td className="py-3 px-4 font-data-mono">{dept.headcount} / {dept.capacity}</td>
                    <td className="py-3 px-4 font-data-mono font-bold text-secondary">SAR {dept.monthlyBudgetSAR}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          dept.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedDeptDetail(dept)}
                        className="text-secondary font-semibold hover:underline"
                        type="button"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Department Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-outline-variant/50 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-primary to-[#2B3566] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[24px]">apartment</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-xl font-bold leading-tight">
                    Create New Department / Division
                  </h2>
                  <p className="text-xs text-primary-fixed mt-0.5">
                    Assign organizational code, department manager, cost center, and labor capacity
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateDepartment}>
              <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department Code */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Department Code *
                    </label>
                    <input
                      required
                      className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-sm font-data-mono uppercase"
                      placeholder="e.g. DEP-CIV-07"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Department Name */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Department Name *
                    </label>
                    <input
                      required
                      className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-sm font-medium"
                      placeholder="e.g. Concrete & Finishing Works"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department Head / Manager */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Department Head / Manager *
                    </label>
                    <input
                      required
                      className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-sm font-medium"
                      placeholder="e.g. Eng. Tariq Al-Ghamdi"
                      name="manager"
                      value={formData.manager}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Manager Email */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Manager Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-sm font-data-mono"
                      placeholder="manager@workforce.sa"
                      name="managerEmail"
                      value={formData.managerEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cost Center */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      GL Cost Center *
                    </label>
                    <input
                      required
                      className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-sm font-data-mono uppercase"
                      placeholder="e.g. CC-7070-CON"
                      name="costCenter"
                      value={formData.costCenter}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Operational Status *
                    </label>
                    <select
                      className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-sm font-semibold"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Assigned Terminal Site */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Assigned Site / Terminal
                  </label>
                  <input
                    className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-sm"
                    placeholder="e.g. Site 04 - Terminal Yard"
                    name="terminal"
                    value={formData.terminal}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Operational Scope &amp; Responsibilities
                  </label>
                  <textarea
                    rows="3"
                    className="w-full bg-surface-container-low text-on-surface px-3.5 py-2 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs"
                    placeholder="Brief description of the department's operational objectives..."
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-6 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-label-md text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl font-label-md text-xs font-bold shadow-lg shadow-secondary/35 flex items-center gap-1.5 transition-all ring-2 ring-secondary/20"
                >
                  <span className="material-symbols-outlined text-[18px] text-white">check_circle</span>
                  <span>Create Department</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Division Detail Inspection Modal */}
      {selectedDeptDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-2xl border border-outline-variant/50 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div>
                <span className="font-data-mono font-bold text-xs text-secondary bg-secondary/10 px-2.5 py-0.5 rounded border border-secondary/20">
                  {selectedDeptDetail.code}
                </span>
                <h3 className="font-headline-md text-xl font-bold text-on-surface mt-1">
                  {selectedDeptDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDeptDetail(null)}
                className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              {selectedDeptDetail.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Department Head</span>
                <strong className="text-on-surface text-sm block mt-0.5">{selectedDeptDetail.manager}</strong>
                <span className="text-on-surface-variant font-data-mono">{selectedDeptDetail.managerEmail}</span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">GL Cost Center</span>
                <strong className="text-on-surface font-data-mono text-sm block mt-0.5">{selectedDeptDetail.costCenter}</strong>
                <span className="text-secondary font-bold font-data-mono">SAR {selectedDeptDetail.monthlyBudgetSAR} / mo</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Functional Trade Classifications
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDeptDetail.trades.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-surface-container-low text-xs font-medium border border-outline-variant/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDeptDetail(null)}
                className="px-4 py-2 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl text-xs font-semibold shadow-xs"
                type="button"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
