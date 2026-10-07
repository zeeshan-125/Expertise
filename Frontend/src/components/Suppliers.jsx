import React, { useState } from 'react';

export default function Suppliers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedNitaqat, setSelectedNitaqat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSupplierDetail, setSelectedSupplierDetail] = useState(null);

  // Initial Saudi Supplier Directory Seed Data (English only)
  const [suppliers, setSuppliers] = useState([
    {
      id: 'SA-VN-1042',
      nameEn: 'Al-Bawani Contracting Co. Ltd.',
      crNumber: '1010248912',
      crCity: 'Riyadh',
      crExpiry: '2026-11-15',
      vatNumber: '300412894400003',
      zatcaStatus: 'Verified',
      gosiReg: 'GOSI-984421',
      nitaqatTier: 'Platinum',
      nitaqatPercent: 42.5,
      contractTier: 'Tier 1 Primary',
      workersCount: 420,
      trades: ['Civil Works', 'Structural Steel', 'Heavy Rigging', 'HSE Safety'],
      bankName: 'Al Rajhi Bank',
      iban: 'SA44 8000 0412 8900 1489 21',
      contactPerson: 'Eng. Fahad Al-Otaibi',
      contactPhone: '+966 50 412 8921',
      contactEmail: 'f.otaibi@albawani.sa',
      city: 'Riyadh',
      chamberCity: 'Riyadh Chamber',
      status: 'Active',
      avgRateSAR: '36.50',
    },
    {
      id: 'SA-VN-2190',
      nameEn: 'Nesma & Partners Manpower Ltd.',
      crNumber: '2050189421',
      crCity: 'Jeddah',
      crExpiry: '2027-03-20',
      vatNumber: '310198421000003',
      zatcaStatus: 'Verified',
      gosiReg: 'GOSI-412098',
      nitaqatTier: 'High Green',
      nitaqatPercent: 36.8,
      contractTier: 'Tier 1 Primary',
      workersCount: 310,
      trades: ['MEP Systems', 'HVAC Installation', 'High Voltage Electrical', 'Piping'],
      bankName: 'Saudi National Bank (SNB)',
      iban: 'SA03 1000 0021 4110 9942 01',
      contactPerson: 'Tariq Al-Ghamdi',
      contactPhone: '+966 55 892 4110',
      contactEmail: 't.ghamdi@nesma.com.sa',
      city: 'Jeddah',
      chamberCity: 'Jeddah Chamber',
      status: 'Active',
      avgRateSAR: '41.00',
    },
    {
      id: 'SA-VN-3382',
      nameEn: 'Al-Khodari Specialized Logistics',
      crNumber: '2051098412',
      crCity: 'Dammam',
      crExpiry: '2025-12-10',
      vatNumber: '300948124000003',
      zatcaStatus: 'Verified',
      gosiReg: 'GOSI-772109',
      nitaqatTier: 'High Green',
      nitaqatPercent: 34.2,
      contractTier: 'Tier 2 Subcontractor',
      workersCount: 245,
      trades: ['Heavy Equipment Operators', 'Earthworks', 'Transit Logistics'],
      bankName: 'Riyad Bank',
      iban: 'SA67 2000 0001 9440 8821 00',
      contactPerson: 'Sultan Al-Dossary',
      contactPhone: '+966 53 194 4821',
      contactEmail: 'sultan@alkhodari-logistics.sa',
      city: 'Dammam',
      chamberCity: 'Eastern Province Chamber',
      status: 'Audit Underway',
      avgRateSAR: '31.50',
    },
    {
      id: 'SA-VN-4105',
      nameEn: 'Rawabi Industrial Safety & Crewing',
      crNumber: '2052084192',
      crCity: 'Khobar',
      crExpiry: '2026-08-30',
      vatNumber: '311984210900003',
      zatcaStatus: 'Verified',
      gosiReg: 'GOSI-883192',
      nitaqatTier: 'Platinum',
      nitaqatPercent: 45.0,
      contractTier: 'Tier 2 Subcontractor',
      workersCount: 195,
      trades: ['OSHA Certified HSE', 'Civil Scaffolding', 'Welding Inspection'],
      bankName: 'Alinma Bank',
      iban: 'SA88 0500 0072 0914 8831 22',
      contactPerson: 'Ibrahim Al-Zahrani',
      contactPhone: '+966 54 720 9188',
      contactEmail: 'i.zahrani@rawabi.com.sa',
      city: 'Khobar',
      chamberCity: 'Asharqia Chamber',
      status: 'Active',
      avgRateSAR: '38.00',
    },
  ]);

  // Form state for multi-step Saudi supplier onboarding (English only)
  const initialFormData = {
    // Step 1: Legal Profile & CR
    nameEn: '',
    crNumber: '',
    crCity: 'Riyadh',
    crExpiry: '',
    businessType: 'General Contracting & Workforce Supply',
    // Step 2: Statutory Compliance (ZATCA, GOSI, Nitaqat)
    vatNumber: '',
    gosiReg: '',
    nitaqatTier: 'Platinum',
    nitaqatPercent: '40.0',
    civilDefenseLicense: '',
    chamberCity: 'Riyadh Chamber',
    // Step 3: Operations, Trades & Scope
    contractTier: 'Tier 1 Primary',
    allocatedSite: 'Site 04 - Terminal Logistics',
    primaryTrades: ['Civil Works', 'MEP Systems'],
    expectedWorkers: '50',
    avgRateSAR: '35.00',
    // Step 4: Banking, National Address & Contact
    bankName: 'Al Rajhi Bank',
    iban: 'SA',
    contactPerson: '',
    contactPhone: '+966 5',
    contactEmail: '',
    district: 'Al-Malqa',
    postalCode: '13524',
    buildingNo: '4821',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTradeToggle = (trade) => {
    setFormData((prev) => {
      const exists = prev.primaryTrades.includes(trade);
      return {
        ...prev,
        primaryTrades: exists
          ? prev.primaryTrades.filter((t) => t !== trade)
          : [...prev.primaryTrades, trade],
      };
    });
  };

  const handleNextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    const newSupplier = {
      id: `SA-VN-${Math.floor(1000 + Math.random() * 9000)}`,
      nameEn: formData.nameEn || 'Al-Majd United Manpower Ltd.',
      crNumber: formData.crNumber || '1010778899',
      crCity: formData.crCity,
      crExpiry: formData.crExpiry || '2027-01-01',
      vatNumber: formData.vatNumber || '300998877600003',
      zatcaStatus: 'Verified',
      gosiReg: formData.gosiReg || 'GOSI-554433',
      nitaqatTier: formData.nitaqatTier,
      nitaqatPercent: parseFloat(formData.nitaqatPercent) || 35.0,
      contractTier: formData.contractTier,
      workersCount: parseInt(formData.expectedWorkers, 10) || 50,
      trades: formData.primaryTrades.length > 0 ? formData.primaryTrades : ['Civil Works', 'MEP Systems'],
      bankName: formData.bankName,
      iban: formData.iban,
      contactPerson: formData.contactPerson || 'Abdullah Al-Shehri',
      contactPhone: formData.contactPhone || '+966 50 123 4567',
      contactEmail: formData.contactEmail || 'contact@supplier.sa',
      city: formData.crCity,
      chamberCity: formData.chamberCity,
      status: 'Active',
      avgRateSAR: formData.avgRateSAR || '35.00',
      isNew: true,
    };

    setSuppliers([newSupplier, ...suppliers]);
    setIsModalOpen(false);
    setCurrentStep(1);
    setFormData(initialFormData);
  };

  // Filtered suppliers based on search and dropdowns
  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesSearch =
      sup.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.crNumber.includes(searchQuery) ||
      sup.vatNumber.includes(searchQuery) ||
      sup.trades.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = selectedTier === 'all' || sup.contractTier.toLowerCase().includes(selectedTier.toLowerCase());
    const matchesNitaqat =
      selectedNitaqat === 'all' || sup.nitaqatTier.toLowerCase().replace(' ', '') === selectedNitaqat.toLowerCase();

    return matchesSearch && matchesTier && matchesNitaqat;
  });

  const availableTrades = [
    'Civil Works',
    'Structural Steel',
    'MEP Systems',
    'HVAC Installation',
    'High Voltage Electrical',
    'Heavy Equipment Operators',
    'Earthworks & Excavation',
    'OSHA Certified HSE',
    'Rigging & Lifting Specialists',
    'Piping & Welding (AWS)',
  ];

  return (
    <div className="flex flex-col w-full space-y-4 lg:space-y-5">
      {/* Saudi Supplier Command Top Banner - Executive Aurora Deck */}
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
                Contractor &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F7A65E]">Supplier Directory</span>
              </h1>
              <p className="font-body-md text-xs sm:text-[13px] text-white/75 mt-0.5 leading-relaxed max-w-xl">
                Commercial Registration (CR) verification, ZATCA e-invoicing compliance, Saudization (Nitaqat) monitoring, and rate card governance.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white/90 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary">apartment</span>
                <span>Total Entities: <strong className="text-white">{suppliers.length} Approved</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white/90 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary">groups</span>
                <span>Active Deployed: <strong className="text-white">1,170 Workers</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-emerald-400">workspace_premium</span>
                <span>Avg. Saudization: <strong className="text-emerald-200">39.6% (Platinum Tier)</strong></span>
              </div>
            </div>
          </div>

          {/* Action Button: Register New Saudi Supplier */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
            <button
              onClick={() => {
                setCurrentStep(1);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white px-4 py-2 rounded-xl font-label-md text-xs font-bold shadow-md shadow-secondary/30 transition-all group ring-2 ring-secondary/20"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-white group-hover:rotate-90 transition-transform">
                domain_add
              </span>
              <span>+ Register Supplier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Ribbon */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/50 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            search
          </span>
          <input
            className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-sm pl-11 pr-4 py-2 rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
            placeholder="Search CR #, VAT Number, Company Name..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Contract Tier Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 text-xs">
            <span className="px-2 text-on-surface-variant font-semibold">Tier:</span>
            {['all', 'tier 1', 'tier 2'].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all font-medium ${
                  selectedTier === tier
                    ? 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-secondary hover:bg-[#FFF4EC]'
                }`}
                type="button"
              >
                {tier === 'all' ? 'All Tiers' : tier}
              </button>
            ))}
          </div>

          {/* Nitaqat Saudization Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 text-xs">
            <span className="px-2 text-on-surface-variant font-semibold">Nitaqat:</span>
            {['all', 'platinum', 'highgreen'].map((nit) => (
              <button
                key={nit}
                onClick={() => setSelectedNitaqat(nit)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all font-medium ${
                  selectedNitaqat === nit
                    ? 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-secondary hover:bg-[#FFF4EC]'
                }`}
                type="button"
              >
                {nit === 'all' ? 'All' : nit === 'platinum' ? 'Platinum' : 'High Green'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-space-lg">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className={`bg-surface-container-lowest rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
              supplier.isNew
                ? 'border-secondary ring-2 ring-secondary/20 shadow-md'
                : 'border-outline-variant/60 hover:border-secondary/40 shadow-xs'
            }`}
          >
            {/* Card Header */}
            <div className="p-6 border-b border-outline-variant/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#121636] to-[#1A204C] text-secondary flex items-center justify-center font-bold text-base shadow-sm shrink-0 border border-white/10">
                    {supplier.nameEn.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-data-mono text-xs font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                        {supplier.id}
                      </span>
                      {supplier.isNew && (
                        <span className="text-[10px] font-bold text-white bg-gradient-to-r from-secondary to-[#F18E3B] px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                          NEW VENDOR
                        </span>
                      )}
                    </div>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-1 leading-snug">
                      {supplier.nameEn}
                    </h3>
                  </div>
                </div>

                {/* Tier and Nitaqat Badges */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="font-label-sm text-[11px] font-semibold bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-md">
                    {supplier.contractTier}
                  </span>
                  <span
                    className={`font-label-sm text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 border ${
                      supplier.nitaqatTier.toLowerCase() === 'platinum'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-green-50 text-green-700 border-green-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    Nitaqat: {supplier.nitaqatTier} ({supplier.nitaqatPercent}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Card Body: CR, VAT, and Regulatory Compliance */}
            <div className="p-6 space-y-4">
              {/* Government ID & Tax Row */}
              <div className="grid grid-cols-2 gap-3 bg-surface-container-low/60 p-3.5 rounded-xl border border-outline-variant/30">
                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant block font-semibold">
                    Commercial Registration (CR)
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-data-mono font-bold text-sm text-on-surface">
                      {supplier.crNumber}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">({supplier.crCity})</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-data-mono block mt-0.5">
                    Exp: {supplier.crExpiry}
                  </span>
                </div>

                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant block font-semibold">
                    ZATCA Tax ID (VAT)
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-data-mono font-bold text-xs text-on-surface truncate">
                      {supplier.vatNumber}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    ZATCA Verified
                  </span>
                </div>
              </div>

              {/* Workforce & Hourly Rate Telemetry */}
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-emerald-800">engineering</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-[10px] uppercase text-on-surface-variant block font-semibold">
                      Deployed Manpower
                    </span>
                    <span className="font-data-mono font-bold text-sm text-on-surface">
                      {supplier.workersCount} active workers
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-label-sm text-[10px] uppercase text-on-surface-variant block font-semibold">
                    Blended Base Rate
                  </span>
                  <span className="font-data-mono font-bold text-sm text-emerald-900">
                    SAR {supplier.avgRateSAR}<span className="text-xs text-on-surface-variant font-normal">/hr</span>
                  </span>
                </div>
              </div>

              {/* Primary Trades Tags */}
              <div>
                <span className="font-label-sm text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Authorized Trade Classifications
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {supplier.trades.map((trade, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface border border-outline-variant/30"
                    >
                      {trade}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bank & Authorized Contact Person */}
              <div className="pt-2 text-xs text-on-surface-variant space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[15px] text-emerald-700">account_balance</span>
                    {supplier.bankName}
                  </span>
                  <span className="font-data-mono text-[11px]">{supplier.iban}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">badge</span>
                    {supplier.contactPerson}
                  </span>
                  <span className="font-data-mono text-emerald-800 font-semibold">{supplier.contactPhone}</span>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 bg-surface-container-low/40 border-t border-outline-variant/20 rounded-b-2xl flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-data-mono">
                Chamber: {supplier.chamberCity}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSupplierDetail(supplier)}
                  className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg font-label-md text-xs font-semibold transition-colors flex items-center gap-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">folder_shared</span>
                  <span>View Dossier</span>
                </button>
                <button
                  className="px-3 py-1.5 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-lg font-label-md text-xs font-semibold transition-all flex items-center gap-1 shadow-xs"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">price_change</span>
                  <span>Rate Card</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5-Step Saudi Supplier Registration Wizard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl shadow-2xl border border-outline-variant/50 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#121636] via-[#1A204C] to-[#252D68] text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-secondary border border-white/10">
                  <span className="material-symbols-outlined text-[24px]">add_business</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-xl font-bold leading-tight text-white">
                    Register Saudi Supplier / Contractor
                  </h2>
                  <p className="text-xs text-white/70 mt-0.5">
                    Certified vendor registration in accordance with Saudi statutory standards (CR, ZATCA, GOSI, Nitaqat)
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

            {/* 5-Step Progress Bar Header */}
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/30">
              <div className="flex items-center justify-between max-w-2xl mx-auto relative">
                {/* Connecting Track Line */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-outline-variant/50 -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-[#F18E3B] transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                  ></div>
                </div>

                {[
                  { num: 1, label: 'Company & CR' },
                  { num: 2, label: 'ZATCA & Nitaqat' },
                  { num: 3, label: 'Trades & Scope' },
                  { num: 4, label: 'Banking & Address' },
                  { num: 5, label: 'Registration Overview' },
                ].map((s) => {
                  const isDone = currentStep > s.num;
                  const isCurrent = currentStep === s.num;
                  return (
                    <div key={s.num} className="flex flex-col items-center relative z-10">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentStep > s.num) setCurrentStep(s.num);
                        }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white ring-4 ring-secondary/20 cursor-pointer'
                            : isCurrent
                            ? 'bg-[#1A1F45] text-white ring-4 ring-secondary/40 shadow-md'
                            : 'bg-surface-container-high text-on-surface-variant cursor-default'
                        }`}
                      >
                        {isDone ? (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        ) : (
                          s.num
                        )}
                      </button>
                      <span
                        className={`text-[11px] font-semibold mt-1.5 text-center hidden sm:block ${
                          isCurrent ? 'text-secondary font-bold' : 'text-on-surface-variant'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Body / Steps Form */}
            <form onSubmit={handleFormSubmit}>
              <div className="p-6 lg:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* STEP 1: Company Profile & Commercial Registration (CR) */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50/70 border border-emerald-200/60 p-3.5 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px] text-emerald-700">info</span>
                      <span>
                        Enter the legal establishment name exactly as registered with the Saudi Ministry of Commerce.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Legal Entity Name (English) *
                      </label>
                      <input
                        required
                        className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm"
                        placeholder="e.g. Al-Bawani Contracting Co. Ltd."
                        name="nameEn"
                        value={formData.nameEn}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Commercial Reg. (10-Digit CR) *
                        </label>
                        <input
                          required
                          maxLength="10"
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm font-data-mono"
                          placeholder="1010xxxxxx"
                          name="crNumber"
                          value={formData.crNumber}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          CR Issue City *
                        </label>
                        <select
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm"
                          name="crCity"
                          value={formData.crCity}
                          onChange={handleInputChange}
                        >
                          <option value="Riyadh">Riyadh</option>
                          <option value="Jeddah">Jeddah</option>
                          <option value="Dammam">Dammam</option>
                          <option value="Khobar">Khobar</option>
                          <option value="Makkah">Makkah</option>
                          <option value="Madinah">Madinah</option>
                          <option value="NEOM">NEOM</option>
                          <option value="Tabuk">Tabuk</option>
                          <option value="Jubail">Jubail</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          CR Expiration Date *
                        </label>
                        <input
                          type="date"
                          required
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm"
                          name="crExpiry"
                          value={formData.crExpiry}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Commercial Activity Classification
                      </label>
                      <input
                        className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm"
                        placeholder="e.g. Building Construction & Skilled Workforce Supply"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Statutory Compliance (ZATCA, GOSI, Nitaqat) */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50/70 border border-emerald-200/60 p-3.5 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px] text-emerald-700">shield</span>
                      <span>
                        Validation against Zakat, Tax and Customs Authority (ZATCA) and General Organization for Social Insurance (GOSI).
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          ZATCA VAT Tax Number (15 Digits) *
                        </label>
                        <input
                          required
                          maxLength="15"
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm font-data-mono"
                          placeholder="300xxxxxxxxxxxx"
                          name="vatNumber"
                          value={formData.vatNumber}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          GOSI Registration Number *
                        </label>
                        <input
                          required
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm font-data-mono"
                          placeholder="GOSI-xxxxxx"
                          name="gosiReg"
                          value={formData.gosiReg}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Saudization Category (Nitaqat Tier) *
                        </label>
                        <select
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm font-semibold"
                          name="nitaqatTier"
                          value={formData.nitaqatTier}
                          onChange={handleInputChange}
                        >
                          <option value="Platinum">Platinum (Top Tier Compliance)</option>
                          <option value="High Green">High Green</option>
                          <option value="Mid Green">Medium Green</option>
                          <option value="Low Green">Low Green</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Saudization Percentage (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm font-data-mono"
                          placeholder="e.g. 42.5"
                          name="nitaqatPercent"
                          value={formData.nitaqatPercent}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Chamber of Commerce Affiliation
                        </label>
                        <input
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm"
                          placeholder="e.g. Riyadh Chamber"
                          name="chamberCity"
                          value={formData.chamberCity}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Civil Defense License Number
                        </label>
                        <input
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm"
                          placeholder="e.g. CD-RY-8820"
                          name="civilDefenseLicense"
                          value={formData.civilDefenseLicense}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Operations, Trades & Scope */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Contract Tier *
                        </label>
                        <select
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm font-semibold"
                          name="contractTier"
                          value={formData.contractTier}
                          onChange={handleInputChange}
                        >
                          <option value="Tier 1 Primary">Tier 1 Primary General</option>
                          <option value="Tier 2 Subcontractor">Tier 2 Subcontractor</option>
                          <option value="Specialized Agency">Specialized Trade Agency</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Assigned Project Site / Terminal *
                        </label>
                        <input
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm"
                          name="allocatedSite"
                          value={formData.allocatedSite}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Initial Manpower Cap
                        </label>
                        <input
                          type="number"
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm font-data-mono"
                          placeholder="e.g. 100"
                          name="expectedWorkers"
                          value={formData.expectedWorkers}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        Approved Trade Classifications (Select all that apply) *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableTrades.map((trade) => {
                          const isSelected = formData.primaryTrades.includes(trade);
                          return (
                            <button
                              key={trade}
                              type="button"
                              onClick={() => handleTradeToggle(trade)}
                              className={`p-2 rounded-xl text-xs text-left font-medium border transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                                  : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
                              }`}
                            >
                              <span>{trade}</span>
                              {isSelected && (
                                <span className="material-symbols-outlined text-[16px] text-emerald-700">
                                  check_circle
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Agreed Hourly Base Rate (SAR / hr) *
                      </label>
                      <div className="relative max-w-xs">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-data-mono text-xs font-bold text-emerald-800">
                          SAR
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          className="w-full bg-surface-container-low text-on-surface pl-14 pr-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm font-data-mono font-bold"
                          placeholder="35.00"
                          name="avgRateSAR"
                          value={formData.avgRateSAR}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Banking, National Address & Contact */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Saudi Bank Name *
                        </label>
                        <select
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm font-medium"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                        >
                          <option value="Al Rajhi Bank">Al Rajhi Bank</option>
                          <option value="Saudi National Bank (SNB)">Saudi National Bank (SNB)</option>
                          <option value="Riyad Bank">Riyad Bank</option>
                          <option value="Alinma Bank">Alinma Bank</option>
                          <option value="Arab National Bank (ANB)">Arab National Bank (ANB)</option>
                          <option value="Banque Saudi Fransi (BSF)">Banque Saudi Fransi (BSF)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Saudi IBAN (24 Characters starting with SA) *
                        </label>
                        <input
                          required
                          maxLength="29"
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm font-data-mono uppercase font-semibold"
                          placeholder="SA00 0000 0000 0000 0000 0000"
                          name="iban"
                          value={formData.iban}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Authorized Officer Name *
                        </label>
                        <input
                          required
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm"
                          placeholder="e.g. Eng. Khalid Al-Mutairi"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Saudi Mobile (+966 5X...) *
                        </label>
                        <input
                          required
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm font-data-mono"
                          placeholder="+966 50 000 0000"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">
                          Official Corporate Email *
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-emerald-600/40 text-sm"
                          placeholder="procurement@company.sa"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Saudi National Address */}
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Saudi National Address
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          className="bg-surface-container-low text-on-surface px-3 py-2 rounded-xl border border-outline-variant/40 text-xs"
                          placeholder="District"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                        />
                        <input
                          className="bg-surface-container-low text-on-surface px-3 py-2 rounded-xl border border-outline-variant/40 text-xs font-data-mono"
                          placeholder="Postal Code"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                        />
                        <input
                          className="bg-surface-container-low text-on-surface px-3 py-2 rounded-xl border border-outline-variant/40 text-xs font-data-mono"
                          placeholder="Building No."
                          name="buildingNo"
                          value={formData.buildingNo}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Registration Overview & Verification */}
                {currentStep === 5 && (
                  <div className="space-y-5">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950 flex items-start gap-3">
                      <span className="material-symbols-outlined text-[22px] text-emerald-700 shrink-0">fact_check</span>
                      <div>
                        <strong className="block font-bold text-sm text-emerald-900">
                          Review Registration Details
                        </strong>
                        <span>
                          Please review the entered vendor credentials and compliance data before issuing the vendor agreement and system ID.
                        </span>
                      </div>
                    </div>

                    {/* Section 1: Company Profile Overview */}
                    <div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                        <span className="font-label-sm text-xs uppercase tracking-wider font-bold text-emerald-900 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">business</span>
                          Company Profile &amp; CR
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="col-span-2">
                          <span className="text-on-surface-variant block text-[11px]">Legal Entity Name</span>
                          <span className="font-bold text-on-surface text-sm">
                            {formData.nameEn || 'Al-Majd United Manpower Ltd.'}
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">CR Number</span>
                          <span className="font-data-mono font-bold text-on-surface">
                            {formData.crNumber || '1010778899'}
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">CR City &amp; Expiry</span>
                          <span className="font-medium text-on-surface">
                            {formData.crCity} • {formData.crExpiry || '2027-01-01'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Statutory Compliance Overview */}
                    <div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                        <span className="font-label-sm text-xs uppercase tracking-wider font-bold text-emerald-900 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          Statutory &amp; Regulatory Compliance
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">ZATCA VAT ID</span>
                          <span className="font-data-mono font-bold text-on-surface">
                            {formData.vatNumber || '300998877600003'}
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">GOSI Registration</span>
                          <span className="font-data-mono font-medium text-on-surface">
                            {formData.gosiReg || 'GOSI-554433'}
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">Nitaqat Tier</span>
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                            {formData.nitaqatTier} ({formData.nitaqatPercent}%)
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">Chamber Affiliation</span>
                          <span className="font-medium text-on-surface">
                            {formData.chamberCity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Operations & Scope Overview */}
                    <div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                        <span className="font-label-sm text-xs uppercase tracking-wider font-bold text-emerald-900 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">construction</span>
                          Operations &amp; Trade Scope
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">Contract Tier</span>
                          <span className="font-bold text-on-surface">{formData.contractTier}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">Assigned Site &amp; Cap</span>
                          <span className="font-medium text-on-surface">
                            {formData.allocatedSite} ({formData.expectedWorkers} workers)
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">Agreed Base Rate</span>
                          <span className="font-data-mono font-bold text-emerald-900 text-sm">
                            SAR {formData.avgRateSAR}/hr
                          </span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-on-surface-variant block text-[11px] mb-1">Approved Trade Badges</span>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.primaryTrades.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold text-[11px] border border-emerald-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Banking & Contact Overview */}
                    <div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                        <span className="font-label-sm text-xs uppercase tracking-wider font-bold text-emerald-900 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">account_balance</span>
                          Banking, Address &amp; Primary Contact
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">Bank &amp; IBAN</span>
                          <span className="font-bold text-on-surface block">{formData.bankName}</span>
                          <span className="font-data-mono text-[11px] text-on-surface-variant">{formData.iban}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">Authorized Liaison</span>
                          <span className="font-bold text-on-surface block">
                            {formData.contactPerson || 'Abdullah Al-Shehri'}
                          </span>
                          <span className="font-data-mono text-emerald-800 text-[11px]">
                            {formData.contactPhone || '+966 50 123 4567'}
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[11px]">National Address</span>
                          <span className="text-on-surface block">
                            Bldg {formData.buildingNo}, {formData.district}, {formData.postalCode}
                          </span>
                          <span className="text-[11px] text-on-surface-variant">{formData.contactEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Navigation Controls */}
              <div className="p-6 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2.5 rounded-xl font-label-md text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                      <span>Previous Step</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-label-md text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-5 py-2.5 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl font-label-md text-xs font-semibold shadow-md shadow-secondary/25 flex items-center gap-1.5 transition-all"
                    >
                      <span>
                        {currentStep === 4 ? 'Review Registration' : 'Continue to Next Step'}
                      </span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFormSubmit}
                      className="px-6 py-2.5 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl font-label-md text-xs font-bold shadow-lg shadow-secondary/35 flex items-center gap-1.5 transition-all ring-2 ring-secondary/20"
                    >
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Confirm &amp; Complete Registration</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Detail Dossier Modal (English only) */}
      {selectedSupplierDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-outline-variant/50 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div>
                <span className="text-xs font-semibold text-secondary font-data-mono">
                  {selectedSupplierDetail.id}
                </span>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">
                  {selectedSupplierDetail.nameEn}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSupplierDetail(null)}
                className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant block uppercase font-semibold">Commercial Registration (CR)</span>
                <span className="font-data-mono font-bold text-sm text-on-surface">{selectedSupplierDetail.crNumber}</span>
                <span className="block text-on-surface-variant mt-1">City: {selectedSupplierDetail.crCity} • Exp: {selectedSupplierDetail.crExpiry}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant block uppercase font-semibold">ZATCA Tax ID (VAT)</span>
                <span className="font-data-mono font-bold text-sm text-on-surface">{selectedSupplierDetail.vatNumber}</span>
                <span className="block text-secondary font-semibold mt-1">Status: Certified Active</span>
              </div>
            </div>

            <div className="p-4 bg-[#FFF4EC] rounded-xl border border-secondary/30 text-xs text-[#1A1F45] space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span>Nitaqat Category: {selectedSupplierDetail.nitaqatTier}</span>
                <span className="text-secondary font-data-mono">Saudization: {selectedSupplierDetail.nitaqatPercent}%</span>
              </div>
              <p>Bank: {selectedSupplierDetail.bankName} • IBAN: {selectedSupplierDetail.iban}</p>
              <p>Primary Liaison: {selectedSupplierDetail.contactPerson} ({selectedSupplierDetail.contactPhone})</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSupplierDetail(null)}
                className="px-4 py-2 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl text-xs font-semibold shadow-xs"
                type="button"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
