import React, { useState, useMemo } from 'react';

export default function ProxyRequests() {
  // Tabs & Views
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'telemetry' | 'audit'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'pending' | 'endorsed' | 'flagged' | 'approved'
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Modals & States
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedRequestDetail, setSelectedRequestDetail] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Departments List
  const departmentsList = [
    'Civil & Heavy Framing',
    'MEP & Electrical Systems',
    'Structural Steel & Welding',
    'HSE Safety & Quality Compliance',
    'Fleet Logistics & Heavy Rigging',
    'Excavation & Ground Preparation',
  ];

  // Turnstile Gate Stations
  const [gateStations, setGateStations] = useState([
    { id: 'GT-01', name: 'Turnstile 01 - Main Gate West', status: 'Online', uptime: '99.8%', latencyMs: 24, lastSync: '10s ago', anomalies: 0 },
    { id: 'GT-02', name: 'Turnstile 02 - Terminal South Yard', status: 'Online', uptime: '99.4%', latencyMs: 38, lastSync: '15s ago', anomalies: 1 },
    { id: 'GT-03', name: 'Turnstile 03 - Substation North Gate', status: 'Online', uptime: '98.9%', latencyMs: 42, lastSync: '22s ago', anomalies: 0 },
    { id: 'GT-04', name: 'Turnstile 04 - Heavy Haulage Transit Gate', status: 'Attention', uptime: '94.2%', latencyMs: 140, lastSync: '1m ago', anomalies: 3, note: 'Optical glare sensor calibration alert at 07:42 AM' },
    { id: 'GEO-05', name: 'Field Mobile Geo-Punch Relay (Site 04)', status: 'Online', uptime: '99.9%', latencyMs: 18, lastSync: 'Just now', anomalies: 0 },
  ]);

  // Master Seed Proxy Requests
  const [requests, setRequests] = useState([
    {
      id: 'PRX-9041',
      workerId: 'EMP-1002',
      workerName: 'Mateo Lucas Hernandez',
      workerPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Level 3 Master Welder',
      department: 'Structural Steel & Welding',
      supplier: 'BuildTech Manpower LLC',
      punchType: 'Clock-In Override',
      targetDate: '2026-10-04',
      targetTime: '06:45 AM',
      turnstileLocation: 'Turnstile 04 - Heavy Haulage Transit Gate',
      reasonType: 'Hardware Reader Glare Spike',
      description: 'Turnstile 04 failed to read RFID badge during the 06:45 morning shift power fluctuation. Worker arrived on company shuttle #12.',
      supervisorEndorser: 'Eng. Fahad Al-Otaibi',
      endorserTitle: 'Civil Superintendent',
      evidenceType: 'GPS Geofence Verified + Turnstile Log Anomaly Match',
      riskLevel: 'Low Risk', // 'Low Risk' | 'Medium Risk' | 'High Risk'
      status: 'Pending Review', // 'Pending Review' | 'Approved' | 'Flagged' | 'Rejected'
      hourlyRateSAR: '36.50',
      estimatedHours: '8.0h Standard',
      submittedAt: 'Today, 07:12 AM',
    },
    {
      id: 'PRX-9042',
      workerId: 'EMP-1005',
      workerName: 'Muhammad Farhan',
      workerPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Certified High-Pressure Welder',
      department: 'Structural Steel & Welding',
      supplier: 'Prime Infra Solutions Group',
      punchType: 'Overtime Extension',
      targetDate: '2026-10-03',
      targetTime: '08:30 PM (End of Shift)',
      turnstileLocation: 'Site 04 - Terminal Yard Girder Bay 3',
      reasonType: 'Emergency Repair Mandate',
      description: 'Emergency structural girder seam weld required immediate completion before night crane lift. Authorized verbally by Site Project Manager.',
      supervisorEndorser: 'Marcus Sterling',
      endorserTitle: 'Structural Steel Director',
      evidenceType: 'Hot Work Permit #HW-4401 Attached',
      riskLevel: 'Medium Risk',
      status: 'Pending Review',
      hourlyRateSAR: '35.00',
      estimatedHours: '3.5h Overtime (1.5x)',
      submittedAt: 'Yesterday, 09:15 PM',
    },
    {
      id: 'PRX-9043',
      workerId: 'EMP-1008',
      workerName: 'Ibrahim Al-Zahrani',
      workerPhoto: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Fleet Rigging Superintendent',
      department: 'Fleet Logistics & Heavy Rigging',
      supplier: 'Direct / In-House',
      punchType: 'Off-Site Deployment',
      targetDate: '2026-10-04',
      targetTime: '06:00 AM - 02:00 PM',
      turnstileLocation: 'Port Transit Terminal D-01 (External Hub)',
      reasonType: 'Off-Site Cargo Inspection',
      description: 'Escorted oversized precast bridge beams from Jeddah Port transit storage to Site 04 logistics staging area without local terminal turnstiles.',
      supervisorEndorser: 'Tariq Al-Ghamdi',
      endorserTitle: 'Logistics Operations Lead',
      evidenceType: 'Waybill Transmit #WB-8810 + Port Gate Clearance',
      riskLevel: 'Low Risk',
      status: 'Approved',
      hourlyRateSAR: '37.00',
      estimatedHours: '8.0h Standard',
      submittedAt: 'Today, 06:15 AM',
    },
    {
      id: 'PRX-9044',
      workerId: 'EMP-1006',
      workerName: 'Kwame Mensah',
      workerPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Excavation & Trenching Lead',
      department: 'Excavation & Ground Preparation',
      supplier: 'Empire Logistics Technical',
      punchType: 'Clock-Out Adjustment',
      targetDate: '2026-10-03',
      targetTime: '05:00 PM',
      turnstileLocation: 'Turnstile 02 - Terminal South Yard',
      reasonType: 'Forgot to Badge Out',
      description: 'Worker assisted in emergency soil stabilization trench shoring past 16:30 and departed with site safety ambulance detail without badge out.',
      supervisorEndorser: 'Soraya Chen',
      endorserTitle: 'HSE Safety Director',
      evidenceType: 'Incident Log Entry #HSE-991',
      riskLevel: 'Low Risk',
      status: 'Approved',
      hourlyRateSAR: '27.50',
      estimatedHours: '8.5h Total',
      submittedAt: 'Yesterday, 06:40 PM',
    },
    {
      id: 'PRX-9045',
      workerId: 'EMP-1010',
      workerName: 'Ahmed Yilmaz',
      workerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Tower Crane Operator Class A',
      department: 'Fleet Logistics & Heavy Rigging',
      supplier: 'Prime Infra Solutions Group',
      punchType: 'Clock-In Override',
      targetDate: '2026-10-04',
      targetTime: '07:00 AM',
      turnstileLocation: 'Turnstile 01 - Main Gate West',
      reasonType: 'RFID Badge Crushed on Machinery',
      description: 'RFID smart badge was crushed under rigging gear. Security issued temporary manual visitor visitor pass #TV-114 pending new smart badge print.',
      supervisorEndorser: 'Ibrahim Al-Zahrani',
      endorserTitle: 'Fleet Rigging Superintendent',
      evidenceType: 'Gate Security Temporary Pass Copy Uploaded',
      riskLevel: 'Low Risk',
      status: 'Pending Review',
      hourlyRateSAR: '34.00',
      estimatedHours: '8.0h Standard',
      submittedAt: 'Today, 07:30 AM',
    },
    {
      id: 'PRX-9046',
      workerId: 'EMP-1003',
      workerName: 'Soraya Maria Santos',
      workerPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'HVAC Specialist & BMS Operator',
      department: 'MEP & Electrical Systems',
      supplier: 'Gulf Apex Resources',
      punchType: 'Shift Anomaly Override',
      targetDate: '2026-10-02',
      targetTime: '11:00 PM (Night Shift Callout)',
      turnstileLocation: 'Substation North Gate',
      reasonType: 'Unscheduled Chiller Breakdown',
      description: 'Chiller loop temperature exceeded critical 82°C threshold. Dispatched immediately outside scheduled roster by facility manager.',
      supervisorEndorser: 'Tariq Mansoor Al-Zahrani',
      endorserTitle: 'Electrical Systems Engineer',
      evidenceType: 'BMS Alert Log #AL-40292 Timestamped',
      riskLevel: 'Low Risk',
      status: 'Approved',
      hourlyRateSAR: '29.50',
      estimatedHours: '4.0h Callout (+Night Diff)',
      submittedAt: '2 days ago',
    },
    {
      id: 'PRX-9047',
      workerId: 'EMP-1009',
      workerName: 'Carlos Mendez Rodriguez',
      workerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Structural Concrete Formwork Tech',
      department: 'Civil & Heavy Framing',
      supplier: 'BuildTech Manpower LLC',
      punchType: 'Overtime Discrepancy',
      targetDate: '2026-10-03',
      targetTime: '06:00 PM - 10:30 PM (4.5h OT)',
      turnstileLocation: 'Turnstile 04 - Heavy Haulage Transit Gate',
      reasonType: 'Unverified Night Shift Overtime',
      description: 'Subcontractor supervisor claimed 4.5 hours overtime for pour curing. However, turnstile exit logs show badge exit at 07:15 PM.',
      supervisorEndorser: 'BuildTech Subcontractor Lead',
      endorserTitle: 'Vendor Field Foreman',
      evidenceType: 'Contradictory Turnstile Exit Record Detected',
      riskLevel: 'High Risk',
      status: 'Flagged',
      hourlyRateSAR: '28.50',
      estimatedHours: '4.5h Claimed vs 1.2h Verified',
      submittedAt: 'Yesterday, 11:00 PM',
    },
  ]);

  // Form State for Submitting New Proxy Punch
  const initialSubmitForm = {
    workerName: 'Mateo Lucas Hernandez',
    workerId: 'EMP-1002',
    department: 'Structural Steel & Welding',
    supplier: 'BuildTech Manpower LLC',
    punchType: 'Clock-In Override',
    targetDate: new Date().toISOString().split('T')[0],
    targetTime: '07:00 AM',
    turnstileLocation: 'Turnstile 01 - Main Gate West',
    reasonType: 'Turnstile Reader Power Spike / Glare',
    description: '',
    supervisorEndorser: 'Eng. Fahad Al-Otaibi',
    evidenceNote: 'GPS geofenced on terminal grounds at punch time.',
  };
  const [submitForm, setSubmitForm] = useState(initialSubmitForm);

  // Toast Trigger Helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filtered Requests Calculation
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.turnstileLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatusTab =
        selectedFilter === 'all' ||
        (selectedFilter === 'pending' && req.status === 'Pending Review') ||
        (selectedFilter === 'flagged' && req.status === 'Flagged') ||
        (selectedFilter === 'approved' && req.status === 'Approved');

      const matchesDept = selectedDept === 'all' || req.department === selectedDept;
      const matchesType = selectedType === 'all' || req.punchType === selectedType;
      const matchesUrgency = selectedUrgency === 'all' || req.riskLevel === selectedUrgency;

      return matchesSearch && matchesStatusTab && matchesDept && matchesType && matchesUrgency;
    });
  }, [requests, searchQuery, selectedFilter, selectedDept, selectedType, selectedUrgency]);

  // KPIs
  const pendingCount = requests.filter((r) => r.status === 'Pending Review').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const flaggedCount = requests.filter((r) => r.status === 'Flagged').length;
  const hardwareUptime = '98.4%';

  // Quick Action Handlers
  const handleApprove = (id, workerName) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved', riskLevel: 'Low Risk' } : r))
    );
    if (selectedRequestDetail && selectedRequestDetail.id === id) {
      setSelectedRequestDetail((prev) => ({ ...prev, status: 'Approved', riskLevel: 'Low Risk' }));
    }
    triggerToast(`Proxy Punch ${id} for ${workerName} has been approved and cleared for payroll.`);
  };

  const handleFlag = (id, workerName) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Flagged', riskLevel: 'High Risk' } : r))
    );
    if (selectedRequestDetail && selectedRequestDetail.id === id) {
      setSelectedRequestDetail((prev) => ({ ...prev, status: 'Flagged', riskLevel: 'High Risk' }));
    }
    triggerToast(`Proxy Punch ${id} for ${workerName} flagged for formal security & audit review.`);
  };

  const handleBatchApprovePending = () => {
    const pendingLowRisk = requests.filter((r) => r.status === 'Pending Review' && r.riskLevel === 'Low Risk');
    setRequests((prev) =>
      prev.map((r) => (r.status === 'Pending Review' && r.riskLevel === 'Low Risk' ? { ...r, status: 'Approved' } : r))
    );
    triggerToast(`Auto-reconciled & approved ${pendingLowRisk.length} verified low-risk proxy punches!`);
  };

  // Submit New Request
  const handleSubmitNewPunch = (e) => {
    e.preventDefault();
    const newId = `PRX-${Math.floor(9050 + Math.random() * 900)}`;
    const newRequest = {
      id: newId,
      workerId: submitForm.workerId,
      workerName: submitForm.workerName,
      workerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Site Specialist Tech',
      department: submitForm.department,
      supplier: submitForm.supplier,
      punchType: submitForm.punchType,
      targetDate: submitForm.targetDate,
      targetTime: submitForm.targetTime,
      turnstileLocation: submitForm.turnstileLocation,
      reasonType: submitForm.reasonType,
      description: submitForm.description || 'Manual supervisor punch request logged for terminal attendance verification.',
      supervisorEndorser: submitForm.supervisorEndorser,
      endorserTitle: 'Authorized Field Superintendent',
      evidenceType: submitForm.evidenceNote || 'Supervisor Field Endorsement',
      riskLevel: 'Low Risk',
      status: 'Pending Review',
      hourlyRateSAR: '32.00',
      estimatedHours: '8.0h Standard',
      submittedAt: 'Just now',
    };

    setRequests([newRequest, ...requests]);
    setIsSubmitModalOpen(false);
    setSubmitForm(initialSubmitForm);
    triggerToast(`Proxy punch ${newId} submitted and placed in review queue.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Ticket ID,Worker ID,Name,Department,Supplier,Punch Type,Date,Time,Turnstile/Gate,Status,Risk Level,Endorser,Rate SAR/h',
        ...filteredRequests.map(
          (r) =>
            `"${r.id}","${r.workerId}","${r.workerName}","${r.department}","${r.supplier}","${r.punchType}","${r.targetDate}","${r.targetTime}","${r.turnstileLocation}","${r.status}","${r.riskLevel}","${r.supervisorEndorser}",${r.hourlyRateSAR}`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Site04_Proxy_Requests_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Proxy Requests audit log exported to CSV.');
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-12 antialiased animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-surface-container-highest border border-secondary/40 text-on-surface px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl animate-slide-up">
          <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
          <span className="font-body-md text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Executive Hero Banner */}
      <div className="bg-aurora-animated border border-white/10 rounded-2xl p-6 lg:p-7 shadow-xl shadow-[#1A1F45]/15 relative overflow-hidden text-white">
        <div className="aurora-orb-1 absolute -right-12 -top-12 w-96 h-96 bg-[#DE6E00]/25 rounded-full pointer-events-none blur-3xl"></div>
        <div className="aurora-orb-2 absolute right-72 -bottom-24 w-80 h-80 bg-[#353D80]/50 rounded-full pointer-events-none blur-3xl"></div>
        <div className="aurora-orb-1 absolute left-1/4 -top-20 w-72 h-72 bg-[#DE6E00]/15 rounded-full pointer-events-none blur-3xl"></div>
        <div className="aurora-light-beam absolute -top-1/2 -bottom-1/2 w-48 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none blur-xl"></div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-xs font-medium backdrop-blur-md w-fit">
              <span className="material-symbols-outlined text-[16px] text-secondary">fingerprint</span>
              <span>Biometric Turnstile &amp; Attendance Reconciler</span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-[28px] font-bold text-white tracking-tight leading-tight">
              Proxy Punch &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F7A65E]">Attendance Exceptions</span>
            </h1>
            <p className="font-body-md text-sm lg:text-[15px] text-white/75 leading-relaxed max-w-2xl">
              Audit biometric scanner overrides, verify supervisor field punch requests, resolve hardware turnstile discrepancies, and prevent buddy-punching fraud for Site 04.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-amber-400">pending_actions</span>
                <span>Pending Ingestion: <strong className="text-white font-data-mono">{pendingCount} Action Req.</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                <span>Reconciled Today: <strong className="text-white">{approvedCount} Cleared</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-secondary">sensors</span>
                <span>Turnstile Health: <strong className="text-secondary font-bold font-data-mono">{hardwareUptime} Uptime</strong></span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleBatchApprovePending}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-3.5 py-2.5 rounded-xl font-label-md text-xs font-semibold backdrop-blur-md transition-all shadow-xs cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              <span>Auto-Clear Low Risk</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-3.5 py-2.5 rounded-xl font-label-md text-xs font-semibold backdrop-blur-md transition-all shadow-xs cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>Audit Export</span>
            </button>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-[#F7A65E] hover:from-[#d16500] hover:to-[#e8964e] text-white px-4 py-2.5 rounded-xl font-label-md text-xs font-semibold transition-all shadow-lg shadow-secondary/25 hover:shadow-secondary/40 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              <span>Log Manual Punch</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core KPIs Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Pending Ingestion Queue */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Pending Exceptions Queue
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="font-data-mono text-2xl lg:text-3xl font-bold text-on-surface">
                  {pendingCount}
                </span>
                <span className="font-label-sm text-xs text-amber-600 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Action Req.
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">mark_email_unread</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant/80">Turnstile 04 Reader:</span>
            <span className="text-secondary font-semibold font-data-mono">2 Glare Alerts</span>
          </div>
        </div>

        {/* KPI 2: Reconciled & Approved */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Reconciled for Payroll
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="font-data-mono text-2xl lg:text-3xl font-bold text-on-surface">
                  {approvedCount}
                </span>
                <span className="font-label-sm text-xs text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Verified
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant/80">Geofence Matched:</span>
            <span className="font-data-mono text-emerald-600 font-semibold">100% Geo Validated</span>
          </div>
        </div>

        {/* KPI 3: Flagged Discrepancies */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Disputed / Flagged Punches
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="font-data-mono text-2xl lg:text-3xl font-bold text-on-surface">
                  {flaggedCount}
                </span>
                <span className="font-label-sm text-xs text-rose-600 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Audit Hold
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">warning</span> Disputed Overtime
            </span>
            <span className="text-on-surface-variant/80">Vendor Hold</span>
          </div>
        </div>

        {/* KPI 4: Turnstile Hardware Status */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Turnstiles Health Score
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="font-data-mono text-2xl lg:text-3xl font-bold text-on-surface">
                  {hardwareUptime}
                </span>
                <span className="font-label-sm text-xs font-semibold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  4/5 Gates Normal
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">door_sliding</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveTab('telemetry')}
              className="text-secondary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Terminal Gates</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
            <span className="text-on-surface-variant/70">Gate 04 Calibrated</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-3">
        {/* Workspace Tabs */}
        <div className="flex items-center gap-2 p-1 bg-surface-container-low border border-outline-variant/30 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs border border-outline-variant/30'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">inbox</span>
            <span>Exception Ingestion Queue ({requests.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs border border-outline-variant/30'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">sensors</span>
            <span>Turnstile &amp; Gate Telemetry (5)</span>
          </button>
        </div>

        {/* View mode toggle (Table vs Cards) for Queue */}
        {activeTab === 'queue' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-medium hidden sm:inline">View Mode:</span>
            <div className="flex items-center bg-surface-container-low border border-outline-variant/30 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'table' ? 'bg-surface-container-lowest text-secondary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Table View"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">table_rows</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'cards' ? 'bg-surface-container-lowest text-secondary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Card Grid View"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: EXCEPTION INGESTION QUEUE */}
      {activeTab === 'queue' && (
        <div className="flex flex-col space-y-4">
          {/* Filters Bar */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ticket # (PRX-9041), worker, turnstile, or department..."
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-10 pr-4 py-2 font-body-md text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl pl-3 pr-8 py-2 font-label-md text-xs text-on-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending Review ({pendingCount})</option>
                  <option value="flagged">Flagged / Disputed ({flaggedCount})</option>
                  <option value="approved">Approved &amp; Cleared ({approvedCount})</option>
                </select>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  arrow_drop_down
                </span>
              </div>

              {/* Department */}
              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl pl-3 pr-8 py-2 font-label-md text-xs text-on-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  <option value="all">All Departments</option>
                  {departmentsList.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  arrow_drop_down
                </span>
              </div>

              {/* Punch Exception Type */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl pl-3 pr-8 py-2 font-label-md text-xs text-on-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  <option value="all">All Punch Types</option>
                  <option value="Clock-In Override">Clock-In Override</option>
                  <option value="Clock-Out Adjustment">Clock-Out Adjustment</option>
                  <option value="Overtime Extension">Overtime Extension</option>
                  <option value="Off-Site Deployment">Off-Site Deployment</option>
                </select>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  arrow_drop_down
                </span>
              </div>

              {/* Risk Level */}
              <div className="relative">
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl pl-3 pr-8 py-2 font-label-md text-xs text-on-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="Low Risk">Low Risk (Verified)</option>
                  <option value="Medium Risk">Medium Risk</option>
                  <option value="High Risk">High Risk (Audit Req)</option>
                </select>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  arrow_drop_down
                </span>
              </div>

              {/* Reset Button */}
              {(searchQuery || selectedFilter !== 'all' || selectedDept !== 'all' || selectedType !== 'all' || selectedUrgency !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                    setSelectedDept('all');
                    setSelectedType('all');
                    setSelectedUrgency('all');
                  }}
                  className="px-2.5 py-2 text-xs font-semibold text-secondary hover:underline cursor-pointer"
                  type="button"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between px-1 text-xs text-on-surface-variant">
            <span>
              Showing <strong className="text-on-surface font-semibold">{filteredRequests.length}</strong> of{' '}
              {requests.length} attendance exception tickets
            </span>
            <span className="font-data-mono">Optical Sensor Logs Synchronized with Gate Ingestion Engine v3</span>
          </div>

          {/* Empty State */}
          {filteredRequests.length === 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[28px]">search_off</span>
              </div>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">No attendance exception tickets match filters</h3>
              <p className="font-body-md text-xs text-on-surface-variant max-w-sm">
                Try modifying your search query or selecting a different status tab to inspect attendance exception requests.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                  setSelectedDept('all');
                  setSelectedType('all');
                  setSelectedUrgency('all');
                }}
                className="mt-2 text-xs font-semibold text-secondary bg-secondary/10 px-3.5 py-2 rounded-xl border border-secondary/20 hover:bg-secondary/20 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'table' && filteredRequests.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/70 border-b border-outline-variant/30 text-[11px] font-label-sm uppercase tracking-wider text-on-surface-variant">
                      <th className="py-3.5 px-4 font-semibold">Ticket &amp; Worker</th>
                      <th className="py-3.5 px-4 font-semibold">Punch Type &amp; Time</th>
                      <th className="py-3.5 px-4 font-semibold">Turnstile / Gate Station</th>
                      <th className="py-3.5 px-4 font-semibold">Exception Reason &amp; Evidence</th>
                      <th className="py-3.5 px-4 font-semibold">Risk &amp; Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-body-md text-xs">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-surface-container-high/40 transition-colors group">
                        {/* Worker Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={req.workerPhoto}
                              alt={req.workerName}
                              className="h-9 w-9 rounded-full object-cover border border-outline-variant/40 shrink-0"
                            />
                            <div className="flex flex-col">
                              <span className="font-body-md-medium text-xs font-semibold text-on-surface group-hover:text-secondary transition-colors">
                                {req.workerName}
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                                <span className="font-data-mono font-bold text-secondary">{req.id}</span>
                                <span>•</span>
                                <span>{req.workerId}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Punch Type & Date/Time */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-on-surface">{req.punchType}</span>
                            <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-data-mono">
                              <span>{req.targetTime}</span>
                              <span>•</span>
                              <span>{req.targetDate}</span>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-on-surface truncate max-w-[170px]" title={req.turnstileLocation}>
                              {req.turnstileLocation}
                            </span>
                            <span className="text-[11px] text-on-surface-variant">{req.department}</span>
                          </div>
                        </td>

                        {/* Reason & Evidence */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col space-y-0.5 max-w-xs">
                            <span className="font-medium text-on-surface text-[11.5px] truncate" title={req.reasonType}>
                              {req.reasonType}
                            </span>
                            <span className="text-[10.5px] text-on-surface-variant/80 truncate" title={req.description}>
                              {req.description}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-medium inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">shield</span>
                              <span className="truncate">{req.evidenceType}</span>
                            </span>
                          </div>
                        </td>

                        {/* Risk & Status */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col items-start gap-1">
                            {req.status === 'Approved' ? (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                                Approved
                              </span>
                            ) : req.status === 'Flagged' ? (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-rose-700 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                                Disputed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                Pending Review
                              </span>
                            )}

                            {req.riskLevel === 'Low Risk' ? (
                              <span className="text-[10px] text-emerald-600 font-medium">Low Risk (Geo Matched)</span>
                            ) : req.riskLevel === 'High Risk' ? (
                              <span className="text-[10px] text-rose-600 font-semibold">High Risk Anomaly</span>
                            ) : (
                              <span className="text-[10px] text-amber-600 font-medium">Standard Verification</span>
                            )}
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedRequestDetail(req)}
                              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                              title="Inspect Full Evidence & Audit Log"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>

                            {req.status !== 'Approved' && (
                              <button
                                onClick={() => handleApprove(req.id, req.workerName)}
                                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-xl font-label-md text-[11px] font-semibold shadow-xs transition-all cursor-pointer"
                                title="Approve & Push to Payroll"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[14px]">check</span>
                                <span>Approve</span>
                              </button>
                            )}

                            {req.status === 'Pending Review' && (
                              <button
                                onClick={() => handleFlag(req.id, req.workerName)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Flag for Payroll Audit"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[17px]">flag</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CARD GRID VIEW */}
          {viewMode === 'cards' && filteredRequests.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.workerPhoto}
                        alt={req.workerName}
                        className="h-11 w-11 rounded-full object-cover border border-outline-variant/40 shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="font-data-mono text-[11px] font-bold text-secondary">{req.id}</span>
                        <h4 className="font-body-md-medium text-xs font-bold text-on-surface group-hover:text-secondary transition-colors">
                          {req.workerName}
                        </h4>
                        <span className="text-[11px] text-on-surface-variant font-medium">{req.jobTitle}</span>
                      </div>
                    </div>

                    {req.status === 'Approved' ? (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                        Approved
                      </span>
                    ) : req.status === 'Flagged' ? (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full shrink-0">
                        Flagged
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Punch Details Box */}
                  <div className="bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/20 flex flex-col space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant text-[11px]">Requested Punch:</span>
                      <span className="font-semibold text-on-surface">{req.punchType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant text-[11px]">Timestamp:</span>
                      <span className="font-data-mono font-medium text-on-surface">{req.targetTime} • {req.targetDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant text-[11px]">Turnstile / Gate:</span>
                      <span className="font-medium text-on-surface truncate max-w-[140px]" title={req.turnstileLocation}>{req.turnstileLocation}</span>
                    </div>
                  </div>

                  {/* Reason & Evidence Snippet */}
                  <div className="text-xs space-y-1">
                    <span className="font-semibold text-on-surface block text-[11.5px]">{req.reasonType}</span>
                    <p className="text-[11px] text-on-surface-variant/80 line-clamp-2 leading-relaxed">{req.description}</p>
                    <div className="pt-1 flex items-center gap-1 text-[10.5px] text-emerald-700 font-medium">
                      <span className="material-symbols-outlined text-[13px]">shield</span>
                      <span className="truncate">{req.evidenceType}</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedRequestDetail(req)}
                      className="text-xs text-secondary font-semibold hover:underline cursor-pointer"
                      type="button"
                    >
                      Audit Details
                    </button>

                    <div className="flex items-center gap-1.5">
                      {req.status !== 'Approved' && (
                        <button
                          onClick={() => handleApprove(req.id, req.workerName)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                          type="button"
                        >
                          Approve
                        </button>
                      )}
                      {req.status === 'Pending Review' && (
                        <button
                          onClick={() => handleFlag(req.id, req.workerName)}
                          className="bg-surface-container-high hover:bg-rose-500/10 text-rose-600 px-2.5 py-1 rounded-xl text-xs font-semibold border border-outline-variant/30 transition-all cursor-pointer"
                          type="button"
                        >
                          Flag
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TURNSTILE & GATE TELEMETRY STATUS */}
      {activeTab === 'telemetry' && (
        <div className="flex flex-col space-y-5">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col space-y-1">
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                Site 04 Biometric Scanner &amp; Optical Turnstiles Grid
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant max-w-2xl">
                Real-time connectivity monitoring of physical perimeter turnstiles, optical facial recognition gates, and mobile geofenced punch relays. Disconnected turnstiles automatically trigger exception logs.
              </p>
            </div>
            <button
              onClick={() => triggerToast('Diagnostic test sent to all 5 Site 04 gate stations. All responded within 35ms.')}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-[#c96200] text-white px-3.5 py-2 rounded-xl font-label-md text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">restart_alt</span>
              <span>Run Diagnostic Ping</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gateStations.map((station) => (
              <div
                key={station.id}
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs hover:border-secondary/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-data-mono text-[11px] text-secondary font-semibold uppercase">{station.id}</span>
                      <h4 className="font-headline-sm text-sm font-bold text-on-surface mt-0.5">{station.name}</h4>
                    </div>
                    {station.status === 'Online' ? (
                      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        Calibrating
                      </span>
                    )}
                  </div>

                  {station.note && (
                    <div className="mt-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-xs text-amber-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0">info</span>
                      <span>{station.note}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-surface-container-low/40 rounded-xl p-2 border border-outline-variant/20">
                    <span className="text-[10px] text-on-surface-variant block uppercase">Monthly Uptime</span>
                    <span className="font-data-mono font-bold text-on-surface">{station.uptime}</span>
                  </div>
                  <div className="bg-surface-container-low/40 rounded-xl p-2 border border-outline-variant/20">
                    <span className="text-[10px] text-on-surface-variant block uppercase">Relay Latency</span>
                    <span className="font-data-mono font-bold text-on-surface">{station.latencyMs} ms</span>
                  </div>
                  <div className="bg-surface-container-low/40 rounded-xl p-2 border border-outline-variant/20">
                    <span className="text-[10px] text-on-surface-variant block uppercase">Shift Discrepancies</span>
                    <span className="font-data-mono font-bold text-secondary">{station.anomalies} Events</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant text-[11px]">Heartbeat: {station.lastSync}</span>
                  <button
                    onClick={() => triggerToast(`Ingestion log for ${station.id} exported to terminal telemetry console.`)}
                    className="text-secondary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Raw Log</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: SUBMIT NEW PROXY PUNCH */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">add_task</span>
                <h3 className="font-headline-sm text-sm font-bold text-on-surface">Log Manual Proxy Punch</h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-high cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitNewPunch} className="p-6 space-y-4 text-xs font-body-md">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Worker Name</label>
                  <input
                    type="text"
                    required
                    value={submitForm.workerName}
                    onChange={(e) => setSubmitForm({ ...submitForm, workerName: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Worker Employee ID</label>
                  <input
                    type="text"
                    required
                    value={submitForm.workerId}
                    onChange={(e) => setSubmitForm({ ...submitForm, workerId: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-data-mono text-on-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Department</label>
                  <select
                    value={submitForm.department}
                    onChange={(e) => setSubmitForm({ ...submitForm, department: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  >
                    {departmentsList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Punch Type</label>
                  <select
                    value={submitForm.punchType}
                    onChange={(e) => setSubmitForm({ ...submitForm, punchType: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  >
                    <option value="Clock-In Override">Clock-In Override</option>
                    <option value="Clock-Out Adjustment">Clock-Out Adjustment</option>
                    <option value="Overtime Extension">Overtime Extension</option>
                    <option value="Off-Site Deployment">Off-Site Deployment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Target Date</label>
                  <input
                    type="date"
                    required
                    value={submitForm.targetDate}
                    onChange={(e) => setSubmitForm({ ...submitForm, targetDate: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Effective Punch Time</label>
                  <input
                    type="text"
                    required
                    value={submitForm.targetTime}
                    onChange={(e) => setSubmitForm({ ...submitForm, targetTime: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 font-data-mono text-xs text-on-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-on-surface">Turnstile Station / Gate</label>
                <select
                  value={submitForm.turnstileLocation}
                  onChange={(e) => setSubmitForm({ ...submitForm, turnstileLocation: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                >
                  <option value="Turnstile 01 - Main Gate West">Turnstile 01 - Main Gate West</option>
                  <option value="Turnstile 02 - Terminal South Yard">Turnstile 02 - Terminal South Yard</option>
                  <option value="Turnstile 03 - Substation North Gate">Turnstile 03 - Substation North Gate</option>
                  <option value="Turnstile 04 - Heavy Haulage Transit Gate">Turnstile 04 - Heavy Haulage Transit Gate</option>
                  <option value="Off-Site Logistics Depot">Off-Site Logistics Depot</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-on-surface">Exception Reason</label>
                <textarea
                  rows="2"
                  required
                  value={submitForm.description}
                  onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                  placeholder="Detail the circumstances (e.g. Broken RFID card, gate scanner failure, or emergency hot work callout)..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Supervisor Endorser</label>
                  <input
                    type="text"
                    required
                    value={submitForm.supervisorEndorser}
                    onChange={(e) => setSubmitForm({ ...submitForm, supervisorEndorser: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Evidence Verification</label>
                  <input
                    type="text"
                    value={submitForm.evidenceNote}
                    onChange={(e) => setSubmitForm({ ...submitForm, evidenceNote: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary hover:bg-[#c96200] text-white px-5 py-2 rounded-xl font-semibold shadow-md shadow-secondary/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[17px]">send</span>
                  <span>Submit for Ingestion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INSPECT EVIDENCE & AUDIT DETAILS DRAWER */}
      {selectedRequestDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-3">
                <span className="font-data-mono font-bold text-secondary text-sm">{selectedRequestDetail.id}</span>
                <span className="text-on-surface-variant">•</span>
                <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                  Attendance Exception Audit Dossier
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequestDetail(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-high cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-body-md">
              {/* Worker Profile Header */}
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedRequestDetail.workerPhoto}
                    alt={selectedRequestDetail.workerName}
                    className="h-11 w-11 rounded-full object-cover border border-outline-variant/40"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-on-surface">{selectedRequestDetail.workerName}</span>
                    <span className="text-on-surface-variant text-[11px] font-data-mono">
                      {selectedRequestDetail.workerId} • {selectedRequestDetail.jobTitle}
                    </span>
                    <span className="text-on-surface-variant text-[10.5px]">
                      {selectedRequestDetail.department} • {selectedRequestDetail.supplier}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10.5px] text-on-surface-variant block">Contract Base Rate</span>
                  <span className="font-data-mono font-bold text-sm text-secondary">
                    SAR {selectedRequestDetail.hourlyRateSAR}/hr
                  </span>
                </div>
              </div>

              {/* Exception Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/20">
                  <span className="text-[10.5px] text-on-surface-variant block uppercase">Claimed Punch Type</span>
                  <span className="font-semibold text-on-surface mt-0.5 block">{selectedRequestDetail.punchType}</span>
                  <span className="text-[11px] font-data-mono text-secondary mt-1 block">
                    {selectedRequestDetail.targetTime} ({selectedRequestDetail.targetDate})
                  </span>
                </div>

                <div className="bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/20">
                  <span className="text-[10.5px] text-on-surface-variant block uppercase">Turnstile / Gate</span>
                  <span className="font-semibold text-on-surface mt-0.5 block truncate" title={selectedRequestDetail.turnstileLocation}>
                    {selectedRequestDetail.turnstileLocation}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    Geofenced On-Site
                  </span>
                </div>
              </div>

              {/* Circumstance & Description */}
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-on-surface">Supervisor Narrative &amp; Explanation:</span>
                <p className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 text-on-surface leading-relaxed">
                  {selectedRequestDetail.description}
                </p>
              </div>

              {/* Endorsement & Supporting Evidence */}
              <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[17px]">verified</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Endorsed By</span>
                    <span className="font-bold text-on-surface">{selectedRequestDetail.supervisorEndorser}</span>
                    <span className="text-[10px] text-on-surface-variant">{selectedRequestDetail.endorserTitle}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Validation Proof</span>
                  <span className="text-xs text-emerald-700 font-semibold block">{selectedRequestDetail.evidenceType}</span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant font-data-mono">
                  Submitted: {selectedRequestDetail.submittedAt}
                </span>

                <div className="flex items-center gap-2">
                  {selectedRequestDetail.status !== 'Approved' && (
                    <button
                      onClick={() => {
                        handleApprove(selectedRequestDetail.id, selectedRequestDetail.workerName);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Approve Punch</span>
                    </button>
                  )}
                  {selectedRequestDetail.status === 'Pending Review' && (
                    <button
                      onClick={() => {
                        handleFlag(selectedRequestDetail.id, selectedRequestDetail.workerName);
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">flag</span>
                      <span>Flag Discrepancy</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
