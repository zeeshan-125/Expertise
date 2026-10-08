import React, { useState } from 'react';
import OnboardEmployee, {
  generateIqamaSvg,
  generatePassportFrontSvg,
  generatePassportBackSvg,
} from './OnboardEmployee';

export default function Employees() {
  const [viewState, setViewState] = useState('roster'); // 'roster' | 'onboard'
  const [inspectDocModal, setInspectDocModal] = useState(null); // Lightbox for inspecting documents in dossier
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [selectedEmployeeDetail, setSelectedEmployeeDetail] = useState(null);
  const [copiedIban, setCopiedIban] = useState(false);

  // In-Dossier Video Enrollment States (Existing Employees)
  const [isEnrollingInDossier, setIsEnrollingInDossier] = useState(false);
  const [dossierRecordingProgress, setDossierRecordingProgress] = useState(0);
  const [dossierQualityChecks, setDossierQualityChecks] = useState({
    singleFace: false,
    goodLighting: false,
    blinkDetected: false,
    frameRate30: false,
  });
  const [dossierConsentGiven, setDossierConsentGiven] = useState(false);
  const [dossierVideoPreview, setDossierVideoPreview] = useState(null);

  // Departments List
  const departmentsList = [
    'Civil & Heavy Framing',
    'MEP & Electrical Systems',
    'Structural Steel & Welding',
    'HSE Safety & Quality Compliance',
    'Fleet Logistics & Heavy Rigging',
    'Excavation & Ground Preparation',
  ];

  // Suppliers List
  const suppliersList = [
    'Direct / In-House',
    'BuildTech Manpower LLC',
    'Gulf Apex Resources',
    'Prime Infra Solutions Group',
    'Empire Logistics Technical',
  ];

  // Pre-configured mock data for Absher / Muqeem registry auto-fill
  // Initial Seed Employees with Attached Civil Documents & Identity Scans
  const [employees, setEmployees] = useState([
    {
      id: 'EMP-1001',
      name: 'Rayan Abdullah Al-Dosari',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      idType: 'Iqama / Resident ID',
      idNumber: '2491823901',
      iqamaExpiry: '2027-11-20',
      nationality: 'Saudi Arabia',
      department: 'Civil & Heavy Framing',
      supplier: 'Direct / In-House',
      jobTitle: 'Heavy Civil Superintendent',
      site: 'HQ Metro Logistics (Site 04)',
      hourlyRateSAR: '45.00',
      monthlySalarySAR: '7,800',
      status: 'Active',
      statusBadge: 'On-Site',
      safetyCerts: ['OSHA-30 Supervisor', 'Aramco Civil Safety Approval', 'First Aid Level 2'],
      iban: 'SA44 2000 0001 2345 6789 01',
      emergencyContact: 'Abdullah Al-Dosari (+966 50 123 4567)',
      gateAccess: 'Level 3 - All Terminal Zones',
      bloodGroup: 'O+',
      medicalClearance: 'Passed - Grade A',
      passportFront: generatePassportFrontSvg('K2491823', 'Rayan Abdullah Al-Dosari', 'Saudi Arabia', '1992-05-14', '2027-11-20'),
      passportBack: generatePassportBackSvg('K2491823', 'Al Malaz District, Riyadh, KSA'),
      iqamaPhoto: generateIqamaSvg('2491823901', 'Rayan Abdullah Al-Dosari', 'ريان عبدالله الدوسري', 'Heavy Civil Superintendent', '2027-11-20', 'O+'),
      enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      video_enrolled_at: '2026-08-10 11:20 AST',
      biometric_consent: true,
      consent_date: '2026-08-10',
    },
    {
      id: 'EMP-1002',
      name: 'Mateo Lucas Hernandez',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      idType: 'Passport',
      idNumber: 'K8912304',
      iqamaExpiry: '2026-12-30',
      nationality: 'Mexico',
      department: 'Structural Steel & Welding',
      supplier: 'BuildTech Manpower LLC',
      jobTitle: 'Level 3 Master Welder',
      site: 'Site 04 - Terminal Yard',
      hourlyRateSAR: '34.50',
      monthlySalarySAR: '5,900',
      status: 'Active',
      statusBadge: 'On-Site',
      safetyCerts: ['AWS D1.1 Certified', 'OSHA-30', 'Fall Arrest Specialist'],
      iban: 'SA12 1000 0009 8765 4321 00',
      emergencyContact: 'Elena Hernandez (+1 555 982 1201)',
      gateAccess: 'Level 2 - Fabrication Shed & Yard',
      bloodGroup: 'O+',
      medicalClearance: 'Passed - Grade A',
      passportFront: generatePassportFrontSvg('K8912304', 'Mateo Lucas Hernandez', 'Mexico', '1988-12-09', '2026-12-30'),
      passportBack: generatePassportBackSvg('K8912304', 'Av. Insurgentes Sur 1602, CDMX, Mexico'),
      iqamaPhoto: generateIqamaSvg('2489018234', 'Mateo Lucas Hernandez', 'ماتيو لوكاس هرنانديز', 'Level 3 Master Welder', '2026-12-30', 'O+'),
      enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      video_enrolled_at: '2026-08-12 14:15 AST',
      biometric_consent: true,
      consent_date: '2026-08-12',
    },
    {
      id: 'EMP-1003',
      name: 'Soraya Maria Santos',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      idType: 'Iqama / Resident ID',
      idNumber: '2488192033',
      iqamaExpiry: '2026-07-28',
      nationality: 'Philippines',
      department: 'MEP & Electrical Systems',
      supplier: 'Gulf Apex Resources',
      jobTitle: 'HVAC Systems Specialist',
      site: 'Site 04 - Substation North',
      hourlyRateSAR: '28.00',
      monthlySalarySAR: '4,850',
      status: 'Expiring Soon',
      statusBadge: 'Visa Expiring (32d)',
      safetyCerts: ['EPA-608 HVAC Universal', 'OSHA-10'],
      iban: 'SA55 8000 0004 3210 9876 54',
      emergencyContact: 'Miguel Santos (+63 917 234 5678)',
      gateAccess: 'Level 2 - MEP Utility Corridors',
      bloodGroup: 'AB+',
      medicalClearance: 'Passed - Grade A',
      passportFront: generatePassportFrontSvg('P8819203', 'Soraya Maria Santos', 'Philippines', '1991-03-18', '2026-07-28', 'F'),
      passportBack: generatePassportBackSvg('P8819203', 'Makati City, Metro Manila, Philippines'),
      iqamaPhoto: generateIqamaSvg('2488192033', 'Soraya Maria Santos', 'ثريا ماريا سانتوس', 'HVAC Systems Specialist', '2026-07-28', 'AB+'),
      enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      video_enrolled_at: '2026-08-14 09:45 AST',
      biometric_consent: true,
      consent_date: '2026-08-14',
    },
    {
      id: 'EMP-1004',
      name: 'Tariq Mansoor Al-Zahrani',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      idType: 'Saudi National ID',
      idNumber: '1082914820',
      iqamaExpiry: '2028-04-12',
      nationality: 'Saudi Arabia',
      department: 'HSE Safety & Quality Compliance',
      supplier: 'Direct / In-House',
      jobTitle: 'Site HSE Safety Officer',
      site: 'All Terminals (Site 01-04)',
      hourlyRateSAR: '38.00',
      monthlySalarySAR: '6,600',
      status: 'Active',
      statusBadge: 'On-Site',
      safetyCerts: ['NEBOSH IGC Certified', 'OSHA-30 Lead Trainer', 'CSP Safety Marshall'],
      iban: 'SA33 5000 0003 4567 8901 23',
      emergencyContact: 'Mansoor Al-Zahrani (+966 55 987 6543)',
      gateAccess: 'Level 3 - Unrestricted Site Access',
      bloodGroup: 'A+',
      medicalClearance: 'Passed - Grade A',
      passportFront: generatePassportFrontSvg('K1082914', 'Tariq Mansoor Al-Zahrani', 'Saudi Arabia', '1989-08-22', '2028-04-12'),
      passportBack: generatePassportBackSvg('K1082914', 'Al Andalus District, Jeddah, KSA'),
      iqamaPhoto: generateIqamaSvg('1082914820', 'Tariq Mansoor Al-Zahrani', 'طارق منصور الزهراني', 'Site HSE Safety Officer', '2028-04-12', 'A+'),
      enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      video_enrolled_at: '2026-08-15 11:00 AST',
      biometric_consent: true,
      consent_date: '2026-08-15',
    },
    {
      id: 'EMP-1005',
      name: 'Muhammad Farhan',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      idType: 'Iqama / Resident ID',
      idNumber: '2519284711',
      iqamaExpiry: '2026-04-10',
      nationality: 'Pakistan',
      department: 'Structural Steel & Welding',
      supplier: 'BuildTech Manpower LLC',
      jobTitle: 'High-Altitude Girder Welder',
      site: 'Site 04 - Terminal Yard',
      hourlyRateSAR: '32.00',
      monthlySalarySAR: '5,500',
      status: 'Active',
      statusBadge: 'On-Site',
      safetyCerts: ['AWS D1.1 Certified', 'Height Safety Harness Lead'],
      iban: 'SA88 3000 0008 7654 3210 98',
      emergencyContact: 'Tariq Farhan (+92 300 1234567)',
      gateAccess: 'Level 2 - High Bay Fabrication',
      bloodGroup: 'B+',
      medicalClearance: 'Passed - Grade A',
      passportFront: generatePassportFrontSvg('P2519284', 'Muhammad Farhan', 'Pakistan', '1994-11-03', '2026-04-10'),
      passportBack: generatePassportBackSvg('P2519284', 'Gulberg III, Lahore, Pakistan'),
      iqamaPhoto: generateIqamaSvg('2519284711', 'Muhammad Farhan', 'محمد فرحان', 'High-Altitude Girder Welder', '2026-04-10', 'B+'),
      enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      video_enrolled_at: '2026-08-16 16:30 AST',
      biometric_consent: true,
      consent_date: '2026-08-16',
    },
    {
      id: 'EMP-1006',
      name: 'Kwame Mensah',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      idType: 'Iqama / Resident ID',
      idNumber: '2433190821',
      iqamaExpiry: '2026-09-30',
      nationality: 'Ghana',
      department: 'Excavation & Ground Preparation',
      supplier: 'Prime Infra Solutions Group',
      jobTitle: 'Heavy Excavator Lead Operator',
      site: 'Site 04 - Terminal South Yard',
      hourlyRateSAR: '26.50',
      monthlySalarySAR: '4,600',
      status: 'Pending KYC',
      statusBadge: 'OCR Glare Fix Req.',
      safetyCerts: ['Heavy Machinery Operator License', 'Ground Shoring Cert'],
      iban: 'SA90 4000 0002 3456 7890 12',
      emergencyContact: 'Kofi Mensah (+233 24 123 4567)',
      gateAccess: 'Level 1 - Earthworks Zone Only',
      bloodGroup: 'B+',
      medicalClearance: 'Passed - Grade A',
      passportFront: generatePassportFrontSvg('G2433190', 'Kwame Mensah', 'Ghana', '1993-02-17', '2026-09-30'),
      passportBack: generatePassportBackSvg('G2433190', 'Airport Residential Area, Accra, Ghana'),
      iqamaPhoto: generateIqamaSvg('2433190821', 'Kwame Mensah', 'كوامي منساه', 'Heavy Excavator Operator', '2026-09-30', 'B+'),
      enrolled_video_path: null,
      video_enrolled_at: null,
      biometric_consent: false,
      consent_date: null,
    },
    {
      id: 'EMP-1007',
      name: 'Ahmed Hassan Al-Masri',
      photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      idType: 'Iqama / Resident ID',
      idNumber: '2401829384',
      iqamaExpiry: '2027-02-18',
      nationality: 'Egypt',
      department: 'Fleet Logistics & Heavy Rigging',
      supplier: 'Empire Logistics Technical',
      jobTitle: 'Heavy Crane Operations Captain',
      site: 'Site 04 - Gate West Logistics',
      hourlyRateSAR: '35.00',
      monthlySalarySAR: '6,100',
      status: 'Active',
      statusBadge: 'On-Site',
      safetyCerts: ['100T Mobile Crane License', 'Rigging Master Level 3'],
      iban: 'SA66 7000 0005 6789 0123 45',
      emergencyContact: 'Mahmoud Al-Masri (+20 100 234 5678)',
      gateAccess: 'Level 2 - Heavy Logistics Staging',
      bloodGroup: 'O+',
      medicalClearance: 'Passed - Grade A',
      passportFront: generatePassportFrontSvg('E2401829', 'Ahmed Hassan Al-Masri', 'Egypt', '1987-04-25', '2027-02-18'),
      passportBack: generatePassportBackSvg('E2401829', 'Nasr City, Cairo, Egypt'),
      iqamaPhoto: generateIqamaSvg('2401829384', 'Ahmed Hassan Al-Masri', 'أحمد حسن المصري', 'Heavy Crane Operations Captain', '2027-02-18', 'O+'),
      enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      video_enrolled_at: '2026-08-18 10:20 AST',
      biometric_consent: true,
      consent_date: '2026-08-18',
    },
    {
      id: 'EMP-1008',
      name: 'Ibrahim Khalil Al-Otaibi',
      photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      idType: 'Saudi National ID',
      idNumber: '1093847291',
      iqamaExpiry: '2029-01-01',
      nationality: 'Saudi Arabia',
      department: 'Civil & Heavy Framing',
      supplier: 'Direct / In-House',
      jobTitle: 'Concrete Reinforcement Lead',
      site: 'HQ Metro Logistics (Site 04)',
      hourlyRateSAR: '41.00',
      monthlySalarySAR: '7,100',
      status: 'Active',
      statusBadge: 'On-Site',
      safetyCerts: ['ACI Concrete Field Testing Lead', 'OSHA-30'],
      iban: 'SA22 6000 0007 8901 2345 67',
      emergencyContact: 'Khalil Al-Otaibi (+966 54 321 0987)',
      gateAccess: 'Level 2 - Civil Expansion Zone',
      bloodGroup: 'A+',
      medicalClearance: 'Passed - Grade A',
      passportFront: generatePassportFrontSvg('K1093847', 'Ibrahim Khalil Al-Otaibi', 'Saudi Arabia', '1990-10-11', '2029-01-01'),
      passportBack: generatePassportBackSvg('K1093847', 'Al Rabwah, Riyadh, KSA'),
      iqamaPhoto: generateIqamaSvg('1093847291', 'Ibrahim Khalil Al-Otaibi', 'إبراهيم خليل العتيبي', 'Concrete Reinforcement Lead', '2029-01-01', 'A+'),
      enrolled_video_path: null,
      video_enrolled_at: null,
      biometric_consent: false,
      consent_date: null,
    },
  ]);

  // Video Recording in Dossier (Existing Employees)
  const handleStartDossierVideoRecording = () => {
    setDossierRecordingProgress(0);
    setDossierVideoPreview(null);
    setDossierQualityChecks({
      singleFace: false,
      goodLighting: false,
      blinkDetected: false,
      frameRate30: false,
    });

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setDossierRecordingProgress(currentProgress);
      if (currentProgress >= 30) {
        setDossierQualityChecks((prev) => ({ ...prev, singleFace: true }));
      }
      if (currentProgress >= 60) {
        setDossierQualityChecks((prev) => ({ ...prev, goodLighting: true }));
      }
      if (currentProgress >= 80) {
        setDossierQualityChecks((prev) => ({ ...prev, blinkDetected: true }));
      }
      if (currentProgress >= 100) {
        clearInterval(interval);
        setDossierQualityChecks({
          singleFace: true,
          goodLighting: true,
          blinkDetected: true,
          frameRate30: true,
        });
        setDossierVideoPreview('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      }
    }, 200);
  };

  const handleConfirmDossierEnrollment = () => {
    if (!selectedEmployeeDetail) return;
    const nowIso = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' AST';
    const today = new Date().toISOString().split('T')[0];
    const updated = {
      ...selectedEmployeeDetail,
      enrolled_video_path: dossierVideoPreview || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      video_enrolled_at: nowIso,
      biometric_consent: true,
      consent_date: today,
    };
    setSelectedEmployeeDetail(updated);
    setEmployees((prev) => prev.map((emp) => (emp.id === updated.id ? updated : emp)));
    setIsEnrollingInDossier(false);
    setDossierVideoPreview(null);
    setDossierRecordingProgress(0);
    setDossierConsentGiven(false);
  };

  // Filter Logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.nationality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDepartment === 'all' || emp.department.toLowerCase() === selectedDepartment.toLowerCase();

    const matchesSupplier =
      selectedSupplier === 'all' || emp.supplier.toLowerCase() === selectedSupplier.toLowerCase();

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && emp.status === 'Active') ||
      (selectedStatus === 'expiring' && emp.status === 'Expiring Soon') ||
      (selectedStatus === 'pending' && emp.status === 'Pending KYC');

    return matchesSearch && matchesDept && matchesSupplier && matchesStatus;
  });

  // Telemetry Aggregations
  const totalEmployeesCount = employees.length;
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const expiringCount = employees.filter((e) => e.status === 'Expiring Soon').length;
  const pendingCount = employees.filter((e) => e.status === 'Pending KYC').length;

  const hasActiveFilters =
    searchQuery || selectedDepartment !== 'all' || selectedSupplier !== 'all' || selectedStatus !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedSupplier('all');
    setSelectedStatus('all');
  };

  if (viewState === 'onboard') {
    return (
      <OnboardEmployee
        onBack={() => {
          setViewState('roster');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        onComplete={(newWorker) => {
          setEmployees([newWorker, ...employees]);
          setViewState('roster');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        departmentsList={departmentsList}
        suppliersList={suppliersList}
      />
    );
  }

  return (
    <div className="flex flex-col w-full space-y-4 lg:space-y-5">
      {/* Top Command Center & Telemetry Header - Executive Aurora Deck */}
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
                Workforce Roster &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F7A65E]">Employee Management</span>
              </h1>
              <p className="font-body-md text-xs sm:text-[13px] text-white/75 mt-0.5 leading-relaxed max-w-xl">
                Real-time operational human resources hub. Onboard personnel with automated Absher/Muqeem AI identity parsing, assign departmental cost centers, and manage supplier contracting agencies.
              </p>
            </div>

            {/* Telemetry Metric Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white/90 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary">badge</span>
                <span>Total Roster: <strong className="text-white">{totalEmployeesCount} Personnel</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-emerald-400">verified</span>
                <span>On-Site Active: <strong className="text-emerald-200">{activeCount} Cleared</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-amber-400">timelapse</span>
                <span>Visa Action Req: <strong className="text-amber-200">{expiringCount} Soon</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-400/30 text-rose-300 text-[11px] font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-rose-400">warning</span>
                <span>KYC Pending: <strong className="text-rose-200">{pendingCount} Packets</strong></span>
              </div>
            </div>
          </div>

          {/* Action Button: Add Employee */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
            <button
              onClick={() => {
                setViewState('onboard');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white px-4 py-2 rounded-xl font-label-md text-xs font-bold shadow-md shadow-secondary/30 transition-all group ring-2 ring-secondary/20"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-white group-hover:rotate-90 transition-transform">
                person_add
              </span>
              <span>Onboard Employee</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Multi-Level Filtering Ribbon */}
      <div className="bg-surface-container-lowest p-4 lg:p-5 rounded-2xl border border-outline-variant/50 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search by worker name, employee ID, Iqama / Passport #, or trade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtering Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Department Filter */}
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/40">
              <span className="material-symbols-outlined text-[16px] text-secondary">apartment</span>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer max-w-[160px] truncate"
              >
                <option value="all">All Departments</option>
                {departmentsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Supplier Agency Filter */}
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/40">
              <span className="material-symbols-outlined text-[16px] text-secondary">corporate_fare</span>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer max-w-[160px] truncate"
              >
                <option value="all">All Suppliers</option>
                {suppliersList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/40">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active On-Site</option>
                <option value="expiring">Expiring Soon</option>
                <option value="pending">Pending KYC</option>
              </select>
            </div>

            {/* View Switcher: Cards vs Table */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/40 shrink-0">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-secondary'
                }`}
                title="Cards Grid View"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-secondary to-[#F18E3B] text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-secondary'
                }`}
                title="Roster Table View"
              >
                <span className="material-symbols-outlined text-[18px]">table_rows</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active filter summary pill */}
        <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant">
              Showing <strong className="text-on-surface font-semibold">{filteredEmployees.length}</strong> of{' '}
              <strong className="text-on-surface">{totalEmployeesCount}</strong> personnel
            </span>
            {hasActiveFilters && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-[11px] font-bold">
                Filtered Active
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-secondary hover:underline font-semibold flex items-center gap-1 text-[11px]"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Display: Cards Grid OR Roster Table View */}
      {viewMode === 'cards' ? (
        /* Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-space-md">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className={`bg-surface-container-lowest rounded-2xl border transition-all duration-200 hover:shadow-md hover:border-secondary/40 flex flex-col justify-between overflow-hidden group ${
                emp.isNew
                  ? 'border-secondary ring-2 ring-secondary/30'
                  : 'border-outline-variant/50 shadow-xs'
              }`}
            >
              {/* Card Header & Avatar */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="relative">
                    <img
                      src={emp.photo}
                      alt={emp.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm ring-1 ring-outline-variant/30"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                        emp.status === 'Active'
                          ? 'bg-emerald-500'
                          : emp.status === 'Expiring Soon'
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                    ></span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="font-data-mono text-[11px] font-bold text-primary bg-primary-fixed/60 px-2 py-0.5 rounded-md border border-primary/20">
                      {emp.id}
                    </span>
                    <span
                      className={`font-label-sm text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : emp.status === 'Expiring Soon'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {emp.statusBadge}
                    </span>
                    <span
                      className={`font-label-sm text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        emp.enrolled_video_path
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                      title={emp.enrolled_video_path ? 'Biometric Video & Blink Enrolled' : 'Face Photo Only'}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {emp.enrolled_video_path ? 'videocam' : 'face'}
                      </span>
                      {emp.enrolled_video_path ? 'Video Enrolled' : 'Face Only'}
                    </span>
                  </div>
                </div>

                {/* Worker Identity */}
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface group-hover:text-secondary transition-colors line-clamp-1">
                    {emp.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5 font-medium">
                    <span className="material-symbols-outlined text-[15px] text-secondary">handyman</span>
                    <span className="truncate">{emp.jobTitle}</span>
                  </div>
                </div>

                {/* ID & Nationality Pill */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low text-xs border border-outline-variant/30">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-[15px] text-on-surface-variant">id_card</span>
                    <span className="font-data-mono text-[11px] text-on-surface truncate">
                      {emp.idNumber}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-secondary shrink-0">
                    {emp.nationality}
                  </span>
                </div>

                {/* Attached Civil Documents Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 text-[10px] font-bold border border-blue-500/20">
                    <span className="material-symbols-outlined text-[12px]">menu_book</span>
                    Passport Front/Back
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 text-[10px] font-bold border border-emerald-500/20">
                    <span className="material-symbols-outlined text-[12px]">credit_card</span>
                    Iqama Active
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 text-[10px] font-bold border border-amber-500/20">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    OCR Verified
                  </span>
                </div>

                {/* Department & Supplier Specs */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">apartment</span>
                      <span>Department</span>
                    </span>
                    <span className="font-medium text-on-surface truncate max-w-[150px] text-right">
                      {emp.department}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">corporate_fare</span>
                      <span>Supplier Agency</span>
                    </span>
                    <span className="font-medium text-secondary truncate max-w-[150px] text-right">
                      {emp.supplier}
                    </span>
                  </div>
                </div>

                {/* Compensation Bar in SAR */}
                <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                      Hourly Rate
                    </span>
                    <span className="font-data-mono text-sm font-extrabold text-on-surface">
                      SAR {emp.hourlyRateSAR}
                      <span className="text-xs font-normal text-on-surface-variant">/hr</span>
                    </span>
                  </div>

                  <div className="h-6 w-px bg-outline-variant/30"></div>

                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                      Monthly Salary
                    </span>
                    <span className="font-data-mono text-sm font-extrabold text-secondary">
                      SAR {emp.monthlySalarySAR}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedEmployeeDetail(emp)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/40 text-on-surface text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">visibility</span>
                  <span>View Dossier</span>
                </button>

                <button
                  onClick={() => alert(`Access Badge printed for ${emp.name} (${emp.id})`)}
                  className="p-1.5 rounded-lg bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white shadow-xs transition-all"
                  title="Print Badge"
                >
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Roster Table View */
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/30">
                  <th className="py-3 px-4">Worker &amp; Identity</th>
                  <th className="py-3 px-3">Iqama / Passport #</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Supplier Agency</th>
                  <th className="py-3 px-3">Trade / Job Title</th>
                  <th className="py-3 px-3">Comp (SAR)</th>
                  <th className="py-3 px-3">Compliance</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-xs text-on-surface">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-surface-container-low/60 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.photo}
                          alt={emp.name}
                          className="w-9 h-9 rounded-xl object-cover border border-outline-variant/40"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface group-hover:text-secondary transition-colors">
                            {emp.name}
                          </span>
                          <span className="font-data-mono text-[10px] text-on-surface-variant">
                            {emp.id} • {emp.nationality}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-data-mono font-medium text-on-surface">
                      {emp.idNumber}
                      <span className="block text-[10px] text-on-surface-variant font-normal">
                        Exp: {emp.iqamaExpiry}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-medium text-on-surface">
                      {emp.department}
                    </td>

                    <td className="py-3 px-3 font-medium text-secondary">
                      {emp.supplier}
                    </td>

                    <td className="py-3 px-3 text-on-surface">
                      {emp.jobTitle}
                    </td>

                    <td className="py-3 px-3 font-data-mono font-bold text-on-surface">
                      SAR {emp.hourlyRateSAR}/hr
                      <span className="block text-[10px] text-secondary font-normal">
                        SAR {emp.monthlySalarySAR}/mo
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-flex items-center gap-1 font-label-sm text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            emp.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : emp.status === 'Expiring Soon'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {emp.statusBadge}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 font-label-sm text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            emp.enrolled_video_path
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[11px]">
                            {emp.enrolled_video_path ? 'videocam' : 'face'}
                          </span>
                          {emp.enrolled_video_path ? 'Video Enrolled' : 'Face Only'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEmployeeDetail(emp)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[11px] font-semibold transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => alert(`Access Badge printed for ${emp.name}`)}
                          className="p-1 rounded-lg bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white shadow-xs transition-all"
                          title="Print Badge"
                        >
                          <span className="material-symbols-outlined text-[15px]">badge</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Dossier Modal */}
      {selectedEmployeeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-4xl rounded-3xl shadow-2xl border border-outline-variant/50 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Sticky Header with Deep Navy Gradient */}
            <div className="p-4 sm:p-5 sm:px-6 bg-gradient-to-r from-[#101436] via-[#1a2152] to-[#251b45] text-white flex items-center justify-between shrink-0 border-b border-white/10 shadow-sm">
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={selectedEmployeeDetail.photo}
                    alt={selectedEmployeeDetail.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg ring-2 ring-secondary/40"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#101436] flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[13px] text-white font-bold">check</span>
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-data-mono font-bold text-xs text-secondary-container bg-secondary-container/20 px-2.5 py-0.5 rounded-md border border-secondary-container/30">
                      {selectedEmployeeDetail.id}
                    </span>
                    <span className="text-xs font-semibold text-white/80 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">flag</span>
                      {selectedEmployeeDetail.nationality}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-medium text-white/90 border border-white/10 truncate">
                      {selectedEmployeeDetail.department}
                    </span>
                  </div>

                  <h3 className="font-headline-md text-lg sm:text-2xl font-bold text-white mt-1 truncate">
                    {selectedEmployeeDetail.name}
                  </h3>
                  <p className="text-xs text-white/70 flex items-center gap-1.5 mt-0.5 truncate">
                    <span className="material-symbols-outlined text-[14px] text-secondary">badge</span>
                    <span>{selectedEmployeeDetail.jobTitle}</span>
                    <span className="text-white/40">•</span>
                    <span>{selectedEmployeeDetail.supplier}</span>
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Gate badge sent to printer queue for ${selectedEmployeeDetail.name}`);
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium border border-white/15 transition-all shadow-xs"
                  title="Print Gate Badge"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Badge</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEmployeeDetail(null);
                    setIsEnrollingInDossier(false);
                    setDossierVideoPreview(null);
                    setDossierRecordingProgress(0);
                  }}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/15"
                  title="Close (Esc)"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 overscroll-contain">
              
              {/* Key Identity & Deployment Parameters Grid */}
              <div>
                <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                  <span>Identity &amp; Deployment Parameters</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold tracking-wider">
                      {selectedEmployeeDetail.idType}
                    </span>
                    <strong className="text-on-surface font-data-mono text-sm block mt-1">
                      {selectedEmployeeDetail.idNumber}
                    </strong>
                    <span className="text-[11px] text-on-surface-variant block mt-0.5">
                      Exp: <span className="font-semibold">{selectedEmployeeDetail.iqamaExpiry}</span>
                    </span>
                  </div>

                  <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold tracking-wider">
                      Department
                    </span>
                    <strong className="text-on-surface text-sm block mt-1 truncate" title={selectedEmployeeDetail.department}>
                      {selectedEmployeeDetail.department}
                    </strong>
                    <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-medium mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Assigned On-Site
                    </span>
                  </div>

                  <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold tracking-wider">
                      Supplier Agency
                    </span>
                    <strong className="text-on-surface text-sm block mt-1 truncate" title={selectedEmployeeDetail.supplier}>
                      {selectedEmployeeDetail.supplier}
                    </strong>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium mt-0.5">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      Authorized
                    </span>
                  </div>

                  <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold tracking-wider">
                      Compensation Rate
                    </span>
                    <strong className="text-secondary font-data-mono text-sm block mt-1">
                      SAR {selectedEmployeeDetail.hourlyRateSAR} <span className="text-xs font-normal text-on-surface-variant">/ hr</span>
                    </strong>
                    {selectedEmployeeDetail.monthlySalarySAR && (
                      <span className="text-[11px] text-on-surface-variant block mt-0.5">
                        SAR {selectedEmployeeDetail.monthlySalarySAR}/mo base
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Attached Civil Verification Documents & Scans */}
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                      <span className="material-symbols-outlined text-[18px]">folder_shared</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-on-surface uppercase tracking-wider">
                        Attached Civil Verification Documents &amp; Scans
                      </h4>
                      <p className="text-[11px] text-on-surface-variant">
                        High-resolution copies parsed via AI OCR during employee onboarding.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                    3 Documents Verified On File
                  </span>
                </div>

                {/* 3 Document Cards: Passport Front, Passport Back, Saudi Iqama */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Passport Front */}
                  <div
                    onClick={() =>
                      setInspectDocModal({
                        title: `Passport Front (Biodata Page) • ${selectedEmployeeDetail.name}`,
                        url:
                          selectedEmployeeDetail.passportFront ||
                          generatePassportFrontSvg(
                            selectedEmployeeDetail.idNumber,
                            selectedEmployeeDetail.name,
                            selectedEmployeeDetail.nationality
                          ),
                        fileName: `Passport_Front_${selectedEmployeeDetail.idNumber}.svg`,
                      })
                    }
                    className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-secondary hover:shadow-md cursor-pointer group transition-all space-y-2.5 shadow-2xs"
                  >
                    <div className="relative h-28 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
                      <img
                        src={
                          selectedEmployeeDetail.passportFront ||
                          generatePassportFrontSvg(
                            selectedEmployeeDetail.idNumber,
                            selectedEmployeeDetail.name,
                            selectedEmployeeDetail.nationality
                          )
                        }
                        alt="Passport Front"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-xs">
                          <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                          Inspect Scan
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-on-surface">Passport Front</span>
                        <span className="text-[10px] text-secondary font-mono font-bold bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                          Biodata Page
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-1">
                        <span className="truncate">Ref: {selectedEmployeeDetail.idNumber}</span>
                        <span className="text-secondary font-semibold group-hover:underline flex items-center text-[10px]">
                          View high-res →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Passport Back */}
                  <div
                    onClick={() =>
                      setInspectDocModal({
                        title: `Passport Back (Endorsements & Address) • ${selectedEmployeeDetail.name}`,
                        url:
                          selectedEmployeeDetail.passportBack ||
                          generatePassportBackSvg(selectedEmployeeDetail.idNumber),
                        fileName: `Passport_Back_${selectedEmployeeDetail.idNumber}.svg`,
                      })
                    }
                    className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-secondary hover:shadow-md cursor-pointer group transition-all space-y-2.5 shadow-2xs"
                  >
                    <div className="relative h-28 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
                      <img
                        src={
                          selectedEmployeeDetail.passportBack ||
                          generatePassportBackSvg(selectedEmployeeDetail.idNumber)
                        }
                        alt="Passport Back"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-xs">
                          <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                          Inspect Scan
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-on-surface">Passport Back</span>
                        <span className="text-[10px] text-secondary font-mono font-bold bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                          Endorsements
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-1">
                        <span className="truncate">Address &amp; Parents</span>
                        <span className="text-secondary font-semibold group-hover:underline flex items-center text-[10px]">
                          View high-res →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Saudi Iqama Card */}
                  <div
                    onClick={() =>
                      setInspectDocModal({
                        title: `Saudi Iqama Card (Muqeem ID) • ${selectedEmployeeDetail.name}`,
                        url:
                          selectedEmployeeDetail.iqamaPhoto ||
                          generateIqamaSvg(
                            selectedEmployeeDetail.idNumber,
                            selectedEmployeeDetail.name,
                            selectedEmployeeDetail.name,
                            selectedEmployeeDetail.jobTitle
                          ),
                        fileName: `Saudi_Iqama_${selectedEmployeeDetail.idNumber}.svg`,
                      })
                    }
                    className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-secondary hover:shadow-md cursor-pointer group transition-all space-y-2.5 shadow-2xs"
                  >
                    <div className="relative h-28 bg-emerald-950 rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
                      <img
                        src={
                          selectedEmployeeDetail.iqamaPhoto ||
                          generateIqamaSvg(
                            selectedEmployeeDetail.idNumber,
                            selectedEmployeeDetail.name,
                            selectedEmployeeDetail.name,
                            selectedEmployeeDetail.jobTitle
                          )
                        }
                        alt="Saudi Iqama"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-xs">
                          <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                          Inspect Scan
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-on-surface">Saudi Iqama Card</span>
                        <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Muqeem ID
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-1">
                        <span className="truncate">Exp: {selectedEmployeeDetail.iqamaExpiry}</span>
                        <span className="text-secondary font-semibold group-hover:underline flex items-center text-[10px]">
                          View high-res →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Accreditations & Site Clearances */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">health_and_safety</span>
                  Safety Accreditations &amp; Site Clearances
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {selectedEmployeeDetail.safetyCerts.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-surface-container-low text-xs font-medium border border-outline-variant/30 flex items-center gap-2 text-on-surface shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[15px] text-emerald-600 font-bold">check_circle</span>
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Biometric Terminal Access Clearance */}
              {selectedEmployeeDetail.gateAccess && (
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                      <span className="material-symbols-outlined text-[18px]">meeting_room</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                        Biometric Terminal Access
                      </span>
                      <span className="font-semibold text-xs sm:text-sm text-on-surface">
                        {selectedEmployeeDetail.gateAccess}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Authorized Access
                  </span>
                </div>
              )}

              {/* Cashier Biometric Video Profile & Liveness Status */}
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">videocam</span>
                    <span>Cashier Biometric Video Profile</span>
                  </span>
                  {selectedEmployeeDetail.enrolled_video_path ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                      Video Enrolled (Blink Profile Active)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shadow-2xs">
                      <span className="material-symbols-outlined text-[14px] text-amber-600">warning</span>
                      Not Enrolled (Face Only)
                    </span>
                  )}
                </div>

                {selectedEmployeeDetail.enrolled_video_path ? (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                        <span className="text-on-surface-variant block text-[10px] font-semibold uppercase tracking-wider">
                          Enrollment Timestamp
                        </span>
                        <strong className="text-on-surface font-data-mono text-xs block mt-0.5">
                          {selectedEmployeeDetail.video_enrolled_at || 'Verified on file'}
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                        <span className="text-on-surface-variant block text-[10px] font-semibold uppercase tracking-wider">
                          PDPL Biometric Consent
                        </span>
                        <strong className="text-emerald-700 text-xs block mt-0.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          Consent Verified ({selectedEmployeeDetail.consent_date || 'On file'})
                        </strong>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-on-surface-variant">
                      <span>Eligible for both 1:1 Face Verification and Video Blink Challenge at cash disbursements.</span>
                      <button
                        type="button"
                        onClick={() => setIsEnrollingInDossier(true)}
                        className="text-secondary font-bold hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">replay</span>
                        Re-enroll Clip
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      This employee does not have an enrolled video on file. When arriving at the cashier kiosk, the <strong>Verify Video (Blink Challenge)</strong> button will be disabled, and only 1:1 Face Verification will be available.
                    </p>
                    {!isEnrollingInDossier ? (
                      <button
                        type="button"
                        onClick={() => setIsEnrollingInDossier(true)}
                        className="px-4 py-2.5 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">videocam</span>
                        <span>Enroll Biometric Video Clip Now</span>
                      </button>
                    ) : null}
                  </div>
                )}

                {/* In-Dossier Enrollment Panel */}
                {isEnrollingInDossier && (
                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-secondary/40 space-y-3 animate-fade-in mt-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-secondary">fiber_manual_record</span>
                        <span>Record 4-Second Video Reference Clip</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEnrollingInDossier(false);
                          setDossierVideoPreview(null);
                          setDossierRecordingProgress(0);
                        }}
                        className="text-on-surface-variant hover:text-on-surface text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {!dossierVideoPreview ? (
                        <button
                          type="button"
                          onClick={handleStartDossierVideoRecording}
                          disabled={dossierRecordingProgress > 0 && dossierRecordingProgress < 100}
                          className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {dossierRecordingProgress > 0 && dossierRecordingProgress < 100 ? 'progress_activity' : 'videocam'}
                          </span>
                          <span>
                            {dossierRecordingProgress > 0 && dossierRecordingProgress < 100 ? 'Recording...' : 'Start 4s Recording'}
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Clip Recorded Successfully
                        </span>
                      )}
                    </div>

                    {dossierRecordingProgress > 0 && dossierRecordingProgress < 100 && (
                      <div className="space-y-1">
                        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary transition-all duration-200"
                            style={{ width: `${dossierRecordingProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-on-surface-variant">Analyzing eye aspect ratio &amp; landmarks...</span>
                      </div>
                    )}

                    {/* Quality Checks */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                      <div className={`p-1.5 rounded flex items-center gap-1 ${dossierQualityChecks.singleFace ? 'bg-emerald-50 text-emerald-800' : 'bg-surface-container-low text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[13px]">{dossierQualityChecks.singleFace ? 'check' : 'close'}</span>
                        <span>Single Face</span>
                      </div>
                      <div className={`p-1.5 rounded flex items-center gap-1 ${dossierQualityChecks.goodLighting ? 'bg-emerald-50 text-emerald-800' : 'bg-surface-container-low text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[13px]">{dossierQualityChecks.goodLighting ? 'check' : 'close'}</span>
                        <span>Lighting</span>
                      </div>
                      <div className={`p-1.5 rounded flex items-center gap-1 ${dossierQualityChecks.blinkDetected ? 'bg-emerald-50 text-emerald-800' : 'bg-surface-container-low text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[13px]">{dossierQualityChecks.blinkDetected ? 'check' : 'close'}</span>
                        <span>Blink</span>
                      </div>
                      <div className={`p-1.5 rounded flex items-center gap-1 ${dossierQualityChecks.frameRate30 ? 'bg-emerald-50 text-emerald-800' : 'bg-surface-container-low text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[13px]">{dossierQualityChecks.frameRate30 ? 'check' : 'close'}</span>
                        <span>30 FPS</span>
                      </div>
                    </div>

                    {dossierVideoPreview && (
                      <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={dossierConsentGiven}
                            onChange={(e) => setDossierConsentGiven(e.target.checked)}
                            className="rounded text-secondary focus:ring-secondary/40 text-xs"
                          />
                          <span className="text-[11px] text-on-surface-variant font-medium">
                            I confirm employee gave PDPL consent for biometric video liveness verification.
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={handleConfirmDossierEnrollment}
                          disabled={!dossierConsentGiven}
                          className="w-full py-2 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
                        >
                          Confirm &amp; Save Biometric Video Profile
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Dossier Footer */}
            <div className="p-4 sm:px-6 bg-surface-container-low border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-rose-500">contact_emergency</span>
                <span>
                  Emergency: <strong className="text-on-surface font-semibold">{selectedEmployeeDetail.emergencyContact}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Badge generated and sent to print queue for ${selectedEmployeeDetail.name}`);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-md shadow-secondary/20 flex items-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[15px]">print</span>
                  <span>Print Gate Badge</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEmployeeDetail(null);
                    setIsEnrollingInDossier(false);
                    setDossierVideoPreview(null);
                    setDossierRecordingProgress(0);
                  }}
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold transition-all border border-outline-variant/20"
                >
                  Close Dossier
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Lightbox for Inspecting Document Scans in Dossier */}
      {inspectDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-3xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[22px] text-secondary">visibility</span>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">{inspectDocModal.title}</h3>
                  <span className="text-[11px] font-mono text-on-surface-variant">{inspectDocModal.fileName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectDocModal(null)}
                className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 flex-1 overflow-auto flex items-center justify-center bg-slate-950/90">
              <img
                src={inspectDocModal.url}
                alt="Document Inspection"
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
              />
            </div>

            <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Verified civil credential on file • PDPL compliant</span>
              <button
                type="button"
                onClick={() => setInspectDocModal(null)}
                className="px-4 py-2 bg-secondary text-white rounded-xl font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
