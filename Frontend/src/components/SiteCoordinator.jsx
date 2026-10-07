import React, { useState, useEffect, useRef } from 'react';
import logoImg from '../assets/logo.png';

export default function SiteCoordinator({ userSession, onLogout, onSwitchRole }) {
  const [activeTab, setActiveTab] = useState('timesheets');
  const [selectedShift, setSelectedShift] = useState('shift1');
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');

  // Modals state
  const [showPassModal, setShowPassModal] = useState(false);
  const [showTBTModal, setShowTBTModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(null); // worker item
  const [showRemarkModal, setShowRemarkModal] = useState(null); // worker item
  const [remarkText, setRemarkText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // New Field Pass Form state
  const [passForm, setPassForm] = useState({
    passType: 'Early Departure Gate Pass',
    workerId: 'W-88204',
    workerName: 'Mateo Hernandez',
    reason: 'Medical Clinic appointment for minor eye dust wash',
    departureTime: '13:30 PM',
    authorizedBy: 'Tariq Al-Mansoor (Site Coord) & Capt. Bilal',
    destination: 'Site First-Aid & Camp Clinic',
    returnExpected: true,
  });

  // Shift submission state
  const [shiftSubmitted, setShiftSubmitted] = useState(false);
  const [submissionDossier, setSubmissionDossier] = useState(null);

  // Quick toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  useEffect(() => {
    scrollToTop();
  }, [activeTab]);

  // Initial Crew Roster with Manual Timesheet Tracking Data
  const [workers, setWorkers] = useState([
    {
      id: 'W-88204',
      name: 'Mateo Hernandez',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRTZd03IRUBS6b3P7PioNyKJ3-V7diKNqAtKbQ46GuomnsE2ePHG9YxribsAL1nuwhtVTHzsP6QFk2lS5b3SjcNTKdaM6snif9UG_HktHZ7pK9l6LI-xzQK9QMrkodHqZZam4sYjvzHPjOOwimPUZNQbK3-WLCupv_6Mtwy4VDO7fvF_2qNQet1K1uft_S6oB7nkQD3hHNGEpZIpZcx3Md0vAO3kNg2wbFdQYMAhgi0RDzY2uI8X37',
      trade: 'Structural Steel',
      subTrade: 'Level 3 Coded Welder',
      zone: 'Zone C: West Perimeter Fab',
      workPackage: 'Gantry Column 14 Bolting & Weld Joint 3B',
      supplier: 'BuildTech Manpower',
      hourlyRate: 34.50,
      timeIn: '06:55 AM',
      timeOut: '17:00 PM',
      checkInMethod: 'Manual Muster Check-In',
      attendance: 'Present',
      regHours: 8.0,
      otHours: 2.0,
      nightDiff: false,
      hazardPay: true,
      verified: true,
      rollCallChecked: true,
      iqamaNo: '2498110942',
      remarks: 'Lead welder on gantry beam #14. Physical badge verified.',
    },
    {
      id: 'W-90114',
      name: 'Soraya Chen',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmarIXfVEsqnhr0Z2Kk8ldqF0kREcpTJcUdyJkS7mbgQ4K53E49eItTfz6LrE0i8-UzpquIwdz95bYf4fHnglcOK43xUSer68JExbXN6-N1L9BgkldpyzMWImKayl86s00M9sjn1tmWjk8kN3lJVnx4xYXDeZYskYPir0ljBYzNTQECQLNreVO0760kef4yVATfbujJYLX-VEEQywshK40EMBZDGFTrPNavssbtDFKyowPRw20sNT-',
      trade: 'MEP Systems',
      subTrade: 'HVAC Specialist',
      zone: 'Zone B: Central Cargo MEP',
      workPackage: 'Substation Chiller Line Balancing & Testing',
      supplier: 'Gulf Apex Resources',
      hourlyRate: 28.00,
      timeIn: '07:00 AM',
      timeOut: '--:--',
      checkInMethod: 'Manual Roll Call Verification',
      attendance: 'Present',
      regHours: 0.0,
      otHours: 0.0,
      nightDiff: false,
      hazardPay: false,
      verified: false,
      rollCallChecked: true,
      iqamaNo: '2512993841',
      remarks: 'Currently balancing chiller loops with site engineer Vance.',
    },
    {
      id: 'W-77409',
      name: 'Kwame Mensah',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdL_lpZMNmRuSGlpNaV-yg37tyi_UMeCC3Mdi5s5_GaUqfbnuHWgtQAAERO7KFJnrPMaOvpsLxi3D2IAUpRYxVuV4WJPfNVRTvne1qoXM1EJxiXhJETcnAVyL3-DEClZbexElyYrVBCiCzw723aMJ8xZf17p_icqcSaSeSdy1jLJO7nc5cq8TzuSjqfcH5LKjggXqyDPkPQ2s_1uJ9HGXp7ntV1-TipQHwuYjVeVv8ZrAbprPW-HI7',
      trade: 'Civil Framing',
      subTrade: 'Carpentry Lead Foreman',
      zone: 'Zone D: South Terminal Foundation',
      workPackage: 'Foundation Shuttering & Anchor Box Assembly',
      supplier: 'Prime Infra Solutions',
      hourlyRate: 22.50,
      timeIn: '07:15 AM',
      timeOut: '--:--',
      checkInMethod: 'Late Arrival Logged at Field Gate',
      attendance: 'Late',
      regHours: 0.0,
      otHours: 0.0,
      nightDiff: false,
      hazardPay: false,
      verified: false,
      rollCallChecked: true,
      iqamaNo: '2398441920',
      remarks: 'Contractor van delayed in security queue. Checked in at 07:15 AM.',
    },
    {
      id: 'W-92433',
      name: 'Tariq Lin',
      initials: 'TL',
      trade: 'HSE Safety',
      subTrade: 'OSHA Safety Marshall',
      zone: 'Zone E: Site Safety & Traffic',
      workPackage: 'Pier 4 Heavy Lifting Drop-Zone Perimeter Guarding',
      supplier: 'BuildTech Manpower',
      hourlyRate: 41.00,
      timeIn: '06:45 AM',
      timeOut: '18:00 PM',
      checkInMethod: 'Pre-Shift Safety Muster Log',
      attendance: 'Present',
      regHours: 8.0,
      otHours: 2.75,
      nightDiff: false,
      hazardPay: true,
      verified: true,
      rollCallChecked: true,
      iqamaNo: '2409819231',
      remarks: 'Conducted pre-shift breathalyzer screening & hydration check.',
    },
    {
      id: 'W-61902',
      name: 'Elena Rostova',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      trade: 'Logistics & Heavy Rigging',
      subTrade: 'Crawler Crane Rigging Lead',
      zone: 'Zone A: Terminal 4 Heavy Berth',
      workPackage: 'Berth 4 Heavy Generator Offloading Lift 3 & 4',
      supplier: 'Empire Logistics Technical',
      hourlyRate: 38.50,
      timeIn: '06:50 AM',
      timeOut: '17:30 PM',
      checkInMethod: 'Physical Badge Inspection',
      attendance: 'Present',
      regHours: 8.0,
      otHours: 2.0,
      nightDiff: false,
      hazardPay: true,
      verified: true,
      rollCallChecked: true,
      iqamaNo: '2589012399',
      remarks: 'Signed off tandem crane rigging plan with Capt. Bilal.',
    },
    {
      id: 'W-55018',
      name: 'Hassan Al-Husseini',
      initials: 'HA',
      trade: 'Concrete & Earthworks',
      subTrade: 'Concrete Vibrator Tech',
      zone: 'Zone D: South Terminal Foundation',
      workPackage: 'South Pad Continuous Concrete Pour Batch #2',
      supplier: 'Titan Industrial Crewing',
      hourlyRate: 26.80,
      timeIn: '--:--',
      timeOut: '--:--',
      checkInMethod: 'Unreported / Absent on Morning Roll Call',
      attendance: 'Absent',
      regHours: 0.0,
      otHours: 0.0,
      nightDiff: false,
      hazardPay: false,
      verified: false,
      rollCallChecked: false,
      iqamaNo: '2489001923',
      remarks: 'No show at 07:00 AM assembly. Replacement requested from Titan.',
    },
    {
      id: 'W-83921',
      name: 'Rajesh Narang',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      trade: 'Civil Framing',
      subTrade: 'Scaffolding Inspector',
      zone: 'Zone C: West Perimeter Fab',
      workPackage: 'Level 4 Working Platform Scaffolding Green-Tagging',
      supplier: 'BuildTech Manpower',
      hourlyRate: 29.75,
      timeIn: '06:50 AM',
      timeOut: '16:00 PM',
      checkInMethod: 'Physical Muster Roll Call',
      attendance: 'Present',
      regHours: 8.0,
      otHours: 0.5,
      nightDiff: false,
      hazardPay: true,
      verified: true,
      rollCallChecked: true,
      iqamaNo: '2476102938',
      remarks: 'Green tagged 14 scaffold towers around fabrication area.',
    },
    {
      id: 'W-49102',
      name: 'Marcus Brody',
      initials: 'MB',
      trade: 'MEP Systems',
      subTrade: 'Chiller Plant Electrician',
      zone: 'Zone B: Central Cargo MEP',
      workPackage: 'Main Switchgear Busbar LOTO Verification',
      supplier: 'Gulf Apex Resources',
      hourlyRate: 35.00,
      timeIn: '--:--',
      timeOut: '--:--',
      checkInMethod: 'Awaiting Morning Gate Check-In',
      attendance: 'Present',
      regHours: 0.0,
      otHours: 0.0,
      nightDiff: false,
      hazardPay: false,
      verified: false,
      rollCallChecked: false,
      iqamaNo: '2398110992',
      remarks: 'Assigned to main switch room upon arrival.',
    },
  ]);

  // View Switcher between Monthly Approvals Matrix & Daily Shift Logger
  const [timesheetViewMode, setTimesheetViewMode] = useState('matrix'); // 'matrix' | 'daily'
  const [selectedCycle, setSelectedCycle] = useState('Oct 01 – Oct 31, 2026 (Monthly Timesheet)');
  const [selectedProject, setSelectedProject] = useState('Project 104 – Riyadh Metro Expansion Site A');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all'); // 'all' | 'draft' | 'submitted' | 'approved' | 'locked'
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState('all');
  const [selectedSupervisorFilter, setSelectedSupervisorFilter] = useState('all');
  const [selectedWeeklyWorkerIds, setSelectedWeeklyWorkerIds] = useState(['EMP-1042', 'EMP-1043', 'EMP-1048']);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [musterSubmitted, setMusterSubmitted] = useState(false);
  const [musterSealInfo, setMusterSealInfo] = useState({
    timestamp: null,
    certifiedBy: 'Tariq Al-Mansoor',
    auditId: null,
    checkedCount: 0,
    absentCount: 0,
  });
  const [showMusterCsvModal, setShowMusterCsvModal] = useState(false);
  const [musterCsvInput, setMusterCsvInput] = useState('');
  const [showZoneCrewModal, setShowZoneCrewModal] = useState(false);
  const [selectedZoneForCrew, setSelectedZoneForCrew] = useState(null);
  const [zoneCrewSearch, setZoneCrewSearch] = useState('');
  const [zoneCrewTradeFilter, setZoneCrewTradeFilter] = useState('All');

  // Matrix Horizontal Scroll Reference & Smooth Helpers
  const matrixScrollRef = useRef(null);

  const scrollToMonthStart = () => {
    if (matrixScrollRef.current) {
      matrixScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const scrollToMidMonth = () => {
    if (matrixScrollRef.current) {
      matrixScrollRef.current.scrollTo({ left: 550, behavior: 'smooth' });
    }
  };

  const scrollToMonthEnd = () => {
    if (matrixScrollRef.current) {
      matrixScrollRef.current.scrollTo({ left: 1100, behavior: 'smooth' });
    }
  };

  const slideLeft = () => {
    if (matrixScrollRef.current) {
      matrixScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (matrixScrollRef.current) {
      matrixScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Real Date: 05/10/2026 (October 05, 2026 - Monday)
  const currentDayNum = 5;

  const scrollToToday = () => {
    if (matrixScrollRef.current) {
      matrixScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  // Center view on Month Start / Today (Oct 05) so coordinator can view and edit today's shift immediately
  useEffect(() => {
    if (timesheetViewMode === 'matrix' && matrixScrollRef.current) {
      matrixScrollRef.current.scrollLeft = 0;
    }
  }, [timesheetViewMode]);

  // Real October 2026 Calendar (Oct 1 is Thursday, Oct 2 is Friday REST, Oct 5 is Monday TODAY)
  const monthDays = [
    { key: 'd1', dayNum: 1, dayName: 'THU', dateStr: '01', isRest: false },
    { key: 'd2', dayNum: 2, dayName: 'FRI', dateStr: '02', isRest: true },
    { key: 'd3', dayNum: 3, dayName: 'SAT', dateStr: '03', isRest: false },
    { key: 'd4', dayNum: 4, dayName: 'SUN', dateStr: '04', isRest: false },
    { key: 'd5', dayNum: 5, dayName: 'MON', dateStr: '05', isRest: false, isToday: true },
    { key: 'd6', dayNum: 6, dayName: 'TUE', dateStr: '06', isRest: false },
    { key: 'd7', dayNum: 7, dayName: 'WED', dateStr: '07', isRest: false },
    { key: 'd8', dayNum: 8, dayName: 'THU', dateStr: '08', isRest: false },
    { key: 'd9', dayNum: 9, dayName: 'FRI', dateStr: '09', isRest: true },
    { key: 'd10', dayNum: 10, dayName: 'SAT', dateStr: '10', isRest: false },
    { key: 'd11', dayNum: 11, dayName: 'SUN', dateStr: '11', isRest: false },
    { key: 'd12', dayNum: 12, dayName: 'MON', dateStr: '12', isRest: false },
    { key: 'd13', dayNum: 13, dayName: 'TUE', dateStr: '13', isRest: false },
    { key: 'd14', dayNum: 14, dayName: 'WED', dateStr: '14', isRest: false },
    { key: 'd15', dayNum: 15, dayName: 'THU', dateStr: '15', isRest: false },
    { key: 'd16', dayNum: 16, dayName: 'FRI', dateStr: '16', isRest: true },
    { key: 'd17', dayNum: 17, dayName: 'SAT', dateStr: '17', isRest: false },
    { key: 'd18', dayNum: 18, dayName: 'SUN', dateStr: '18', isRest: false },
    { key: 'd19', dayNum: 19, dayName: 'MON', dateStr: '19', isRest: false },
    { key: 'd20', dayNum: 20, dayName: 'TUE', dateStr: '20', isRest: false },
    { key: 'd21', dayNum: 21, dayName: 'WED', dateStr: '21', isRest: false },
    { key: 'd22', dayNum: 22, dayName: 'THU', dateStr: '22', isRest: false },
    { key: 'd23', dayNum: 23, dayName: 'FRI', dateStr: '23', isRest: true },
    { key: 'd24', dayNum: 24, dayName: 'SAT', dateStr: '24', isRest: false },
    { key: 'd25', dayNum: 25, dayName: 'SUN', dateStr: '25', isRest: false },
    { key: 'd26', dayNum: 26, dayName: 'MON', dateStr: '26', isRest: false },
    { key: 'd27', dayNum: 27, dayName: 'TUE', dateStr: '27', isRest: false },
    { key: 'd28', dayNum: 28, dayName: 'WED', dateStr: '28', isRest: false },
    { key: 'd29', dayNum: 29, dayName: 'THU', dateStr: '29', isRest: false },
    { key: 'd30', dayNum: 30, dayName: 'FRI', dateStr: '30', isRest: true },
    { key: 'd31', dayNum: 31, dayName: 'SAT', dateStr: '31', isRest: false },
  ];

  // Helper to generate month worker days up to today (05/10/2026).
  // Future dates (dayNum > currentDayNum) are strictly empty ('') and locked.
  const buildMonthlyHours = (baseVal, initialPastDays = {}) => {
    const daysObj = {};
    monthDays.forEach((d) => {
      if (d.dayNum > currentDayNum) {
        // Future date: empty and locked until day arrives
        daysObj[d.key] = '';
      } else if (d.isRest) {
        daysObj[d.key] = 'REST';
      } else if (initialPastDays[d.dayNum] !== undefined) {
        daysObj[d.key] = initialPastDays[d.dayNum];
      } else {
        const variance = (d.dayNum % 2 === 0) ? 0.5 : 0;
        const hours = typeof baseVal === 'number' ? Math.max(8.0, Math.round((baseVal + variance) * 10) / 10) : baseVal;
        daysObj[d.key] = hours;
      }
    });
    return daysObj;
  };

  // Monthly Approvals Matrix Roster (Days 1 to 5 logged, Days 6 to 31 empty & locked)
  const [weeklyWorkers, setWeeklyWorkers] = useState([
    {
      id: 'EMP-1042',
      name: 'Tariq Nadeem',
      initials: 'TN',
      iqamaNo: '2490184412',
      country: 'KSA',
      trade: 'Welder 6G High-Pressure',
      supplier: 'BuildTech Manpower',
      supervisor: 'Eng. Mansoor Al-Harbi',
      hourlyRate: 34.50,
      days: buildMonthlyHours(10.0, { 1: 10.0, 2: 'REST', 3: 10.0, 4: 10.5, 5: 10.0 }),
      status: 'Submitted',
      signedOff: false,
    },
    {
      id: 'EMP-1043',
      name: 'Bilal Hossain',
      initials: 'BH',
      iqamaNo: '2381920041',
      country: 'BGD',
      trade: 'Rigging Specialist Lead',
      supplier: 'Empire Logistics Technical',
      supervisor: 'Eng. Mansoor Al-Harbi',
      hourlyRate: 38.50,
      days: buildMonthlyHours(10.0, { 1: 10.0, 2: 'REST', 3: 10.0, 4: 10.5, 5: 10.0 }),
      status: 'Submitted',
      signedOff: false,
    },
    {
      id: 'EMP-1048',
      name: 'Suresh Kumar',
      initials: 'SK',
      iqamaNo: '2519041239',
      country: 'IND',
      trade: 'Electrical Foreman',
      supplier: 'Gulf Apex Resources',
      supervisor: 'Eng. Mansoor Al-Harbi',
      hourlyRate: 35.00,
      days: buildMonthlyHours(9.0, { 1: 9.0, 2: 'REST', 3: 9.0, 4: 9.5, 5: 9.0 }),
      status: 'Submitted',
      signedOff: false,
    },
    {
      id: 'EMP-1051',
      name: 'Mahmoud Al-Ghamdi',
      initials: 'MG',
      iqamaNo: '1083921102',
      country: 'KSA',
      trade: 'Concrete Core Tech',
      supplier: 'Titan Industrial Crewing',
      supervisor: 'Eng. Mansoor Al-Harbi',
      hourlyRate: 26.80,
      days: buildMonthlyHours(8.0, { 1: 8.0, 2: 'REST', 3: 8.5, 4: 8.0, 5: 8.0 }),
      status: 'Draft',
      signedOff: false,
    },
    {
      id: 'EMP-1059',
      name: 'Rajesh Arumugam',
      initials: 'RA',
      iqamaNo: '2471928372',
      country: 'IND',
      trade: 'Tower Crane Operator',
      supplier: 'BuildTech Manpower',
      supervisor: 'Eng. Mansoor Al-Harbi',
      hourlyRate: 42.00,
      days: buildMonthlyHours(10.0, { 1: 10.0, 2: 'REST', 3: 10.0, 4: 10.0, 5: 10.0 }),
      status: 'Flagged',
      signedOff: false,
    },
    {
      id: 'EMP-1064',
      name: 'Farhan Akhtar',
      initials: 'FA',
      iqamaNo: '2420019284',
      country: 'PAK',
      trade: 'Scaffolding Master II',
      supplier: 'BuildTech Manpower',
      supervisor: 'Eng. Mansoor Al-Harbi',
      hourlyRate: 29.75,
      days: buildMonthlyHours(8.0, { 1: 8.0, 2: 'REST', 3: 8.0, 4: 8.0, 5: 8.0 }),
      status: 'Approved',
      signedOff: true,
    },
    {
      id: 'EMP-1070',
      name: 'Mateo Hernandez',
      initials: 'MH',
      iqamaNo: '2498110942',
      country: 'ESP',
      trade: 'Structural Steel Lead',
      supplier: 'BuildTech Manpower',
      supervisor: 'Tariq Al-Mansoor',
      hourlyRate: 34.50,
      days: buildMonthlyHours(10.0, { 1: 10.0, 2: 'REST', 3: 10.0, 4: 10.0, 5: 10.0 }),
      status: 'Submitted',
      signedOff: false,
    },
    {
      id: 'EMP-1072',
      name: 'Soraya Chen',
      initials: 'SC',
      iqamaNo: '2512993841',
      country: 'SGP',
      trade: 'MEP Systems HVAC',
      supplier: 'Gulf Apex Resources',
      supervisor: 'Tariq Al-Mansoor',
      hourlyRate: 28.00,
      days: buildMonthlyHours(9.5, { 1: 9.5, 2: 'REST', 3: 9.0, 4: 9.5, 5: 9.5 }),
      status: 'Submitted',
      signedOff: false,
    },
  ]);

  // Field Passes & Attendance Exceptions
  const [fieldPasses, setFieldPasses] = useState([
    {
      id: 'PASS-7821',
      type: 'Early Departure Gate Pass',
      workerId: 'W-88204',
      workerName: 'Mateo Hernandez',
      trade: 'Structural Steel',
      destination: 'First Aid Clinic',
      departureTime: '13:30 PM',
      authorizedBy: 'Tariq Al-Mansoor',
      reason: 'Eye dust wash & safety prescription glasses adjustment',
      status: 'Approved & Active',
      returnExpected: 'Yes (14:15 PM)',
      issuedAt: 'Today, 10:15 AM',
    },
    {
      id: 'PASS-7819',
      type: 'Overtime Work Authorization',
      workerId: 'W-61902',
      workerName: 'Elena Rostova',
      trade: 'Heavy Rigging',
      destination: 'Berth 4 Rigging Crane Bay',
      departureTime: '--:--',
      authorizedBy: 'Capt. Bilal & Tariq Al-Mansoor',
      reason: 'Tandem crane lift prolonged due to high harbor wind delay',
      status: 'Approved & Active',
      returnExpected: 'Shift Finish 18:00',
      issuedAt: 'Today, 08:30 AM',
    },
    {
      id: 'PASS-7805',
      type: 'Emergency Stand-in Voucher',
      workerId: 'W-55018',
      workerName: 'Hassan Al-Husseini (Replaced by S. Qureshi)',
      trade: 'Concrete & Earthworks',
      destination: 'South Foundation Pad',
      departureTime: '07:30 AM',
      authorizedBy: 'Tariq Al-Mansoor',
      reason: 'Worker absent without notice. Titan Standby crew deployed',
      status: 'Processed & Recorded',
      returnExpected: 'Full Shift Cover',
      issuedAt: 'Today, 07:35 AM',
    },
  ]);

  // Zones deployment breakdown
  const zones = [
    {
      id: 'Zone A',
      title: 'Zone A: Terminal 4 Heavy Berth & Rigging Pier',
      lead: 'Captain Bilal Al-Harthi',
      headcount: 42,
      planned: 45,
      capacityPct: 93,
      channel: 'VHF Ch. 4',
      trades: ['Heavy Rigging (24)', 'Structural Steel (12)', 'HSE Marshall (6)'],
      heatAlert: 'Moderate',
      status: 'Active Operations',
    },
    {
      id: 'Zone B',
      title: 'Zone B: Central Cargo Hub MEP & HVAC Towers',
      lead: 'Karim Vance',
      headcount: 38,
      planned: 38,
      capacityPct: 100,
      channel: 'VHF Ch. 2',
      trades: ['MEP Systems (28)', 'Electricians (8)', 'HSE (2)'],
      heatAlert: 'Low (Indoor)',
      status: 'Active Operations',
    },
    {
      id: 'Zone C',
      title: 'Zone C: West Perimeter Structural Steel Fabrication',
      lead: 'Marcus O\'Connor',
      headcount: 55,
      planned: 60,
      capacityPct: 91,
      channel: 'VHF Ch. 7',
      trades: ['Coded Welders (30)', 'Civil Framing (20)', 'Quality Inspector (5)'],
      heatAlert: 'High (Direct Sun)',
      status: 'Active Operations',
    },
    {
      id: 'Zone D',
      title: 'Zone D: South Terminal Foundation & Earthworks',
      lead: 'Ahmed Farooq',
      headcount: 32,
      planned: 35,
      capacityPct: 91,
      channel: 'VHF Ch. 5',
      trades: ['Concrete Pouring (20)', 'Rebar Tie (10)', 'Foreman (2)'],
      heatAlert: 'Moderate',
      status: 'Active Operations',
    },
    {
      id: 'Zone E',
      title: 'Zone E: Site Safety, Gate Traffic & HSE Marshalling',
      lead: 'Sarah Al-Qasim',
      headcount: 17,
      planned: 17,
      capacityPct: 100,
      channel: 'VHF Ch. 1',
      trades: ['OSHA Safety Marshalls (12)', 'Traffic Control (5)'],
      heatAlert: 'Low',
      status: 'Full Mobilization',
    },
  ];

  // Daily Toolbox Talk (TBT) log record
  const [tbtLog, setTbtLog] = useState({
    date: 'Sunday, October 04, 2026',
    shift: 'Shift 1 Morning (07:00 - 15:30)',
    leadConductor: 'Tariq Al-Mansoor (Site Coordinator) & Capt. Bilal',
    primaryTopic: 'Extreme Heat Hydration Protocols & Overhead Crane Drop Zones',
    keyPoints: [
      'Mandatory 15-minute shaded hydration break every 90 minutes (Wet Bulb Temp > 32°C).',
      'Physical tag check for all heavy crawler rigging within Berth 4 radius.',
      'Check fall-arrest lanyards & safety harness double-locking carabiners before climbing Zone C steel frames.',
      'Zero-tolerance for loose safety eyewear or unbuttoned hi-vis vests near conveyor belts.',
    ],
    headcountAttended: 184,
    totalShiftWorkers: 195,
    ppeVerification: {
      hardHats: '184 / 184 (100%)',
      hiVisVests: '184 / 184 (100%)',
      safetyBoots: '184 / 184 (100%)',
      fallArrestHarness: '55 / 55 (Elevated Trade Checked)',
    },
    fitForDutyBreaches: 0,
    signedOff: true,
    signedAt: '07:10 AM by Tariq Al-Mansoor',
  });

  // Filtered workers
  const filteredWorkers = workers.filter((w) => {
    const matchSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.subTrade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.workPackage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.iqamaNo.includes(searchQuery);

    const matchTrade = tradeFilter === 'all' || w.trade.toLowerCase().includes(tradeFilter.toLowerCase());
    const matchStatus = statusFilter === 'all' || w.attendance.toLowerCase() === statusFilter.toLowerCase();
    const matchZone = zoneFilter === 'all' || w.zone.toLowerCase().includes(zoneFilter.toLowerCase());

    return matchSearch && matchTrade && matchStatus && matchZone;
  });

  // Filtered Weekly Workers (from Enterprise Reference Matrix)
  const filteredWeeklyWorkers = weeklyWorkers.filter((w) => {
    const matchSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.iqamaNo.includes(searchQuery);

    const matchStatus =
      selectedStatusTab === 'all' ||
      (selectedStatusTab === 'submitted' && w.status === 'Submitted') ||
      (selectedStatusTab === 'draft' && w.status === 'Draft') ||
      (selectedStatusTab === 'approved' && w.status === 'Approved') ||
      (selectedStatusTab === 'locked' && (w.status === 'Locked' || w.status === 'Flagged'));

    const matchSupplier =
      selectedSupplierFilter === 'all' ||
      w.supplier.toLowerCase().includes(selectedSupplierFilter.toLowerCase());
    const matchSupervisor =
      selectedSupervisorFilter === 'all' ||
      w.supervisor.toLowerCase().includes(selectedSupervisorFilter.toLowerCase());
    const matchTrade =
      tradeFilter === 'all' || w.trade.toLowerCase().includes(tradeFilter.toLowerCase());

    return matchSearch && matchStatus && matchSupplier && matchSupervisor && matchTrade;
  });

  // Matrix Totals Calculation Engine (Standard Gulf / KSA Auto-Split Rule across 31 Monthly Days)
  const calculateWeeklyWorkerTotals = (workerOrDays, hourlyRate = 30) => {
    const isWorkerObj = workerOrDays && typeof workerOrDays === 'object' && 'days' in workerOrDays;
    const days = isWorkerObj ? workerOrDays.days : workerOrDays;
    const rate = isWorkerObj ? (workerOrDays.hourlyRate || hourlyRate) : hourlyRate;

    let regTotal = 0;
    let otTotal = 0;

    if (days) {
      Object.keys(days).forEach((dayKey) => {
        const val = days[dayKey];
        if (val !== 'REST' && val !== null && val !== undefined && !isNaN(parseFloat(val))) {
          const h = parseFloat(val);
          const reg = Math.min(8.0, h);
          const ot = Math.max(0, h - 8.0);
          regTotal += reg;
          otTotal += ot;
        }
      });
    }

    const manualReg = isWorkerObj ? workerOrDays.manualReg : undefined;
    const manualOt = isWorkerObj ? workerOrDays.manualOt : undefined;

    const finalReg = manualReg !== undefined && manualReg !== null && manualReg !== '' && !isNaN(parseFloat(manualReg))
      ? parseFloat(manualReg)
      : Math.round(regTotal * 10) / 10;

    const finalOt = manualOt !== undefined && manualOt !== null && manualOt !== '' && !isNaN(parseFloat(manualOt))
      ? parseFloat(manualOt)
      : Math.round(otTotal * 10) / 10;

    const billableHours = Math.round((finalReg + finalOt * 1.5) * 10) / 10;
    const totalPay = Math.round(billableHours * rate * 100) / 100;

    return {
      regHours: finalReg,
      otHours: finalOt,
      billableHours,
      totalPay,
    };
  };

  // Aggregate Weekly Labor Totals for Active Matrix
  const totalWeeklyBillable = filteredWeeklyWorkers.reduce((acc, w) => {
    return acc + calculateWeeklyWorkerTotals(w).billableHours;
  }, 0);

  const totalWeeklyLaborPay = filteredWeeklyWorkers.reduce((acc, w) => {
    return acc + calculateWeeklyWorkerTotals(w).totalPay;
  }, 0);

  // Bulk approve selected weekly workers
  const handleBulkApproveWeekly = () => {
    if (selectedWeeklyWorkerIds.length === 0) {
      showToast('Please select at least one worker timesheet to approve');
      return;
    }
    const count = selectedWeeklyWorkerIds.length;
    setWeeklyWorkers((prev) =>
      prev.map((w) =>
        selectedWeeklyWorkerIds.includes(w.id)
          ? { ...w, status: 'Approved', signedOff: true }
          : w
      )
    );
    setSelectedWeeklyWorkerIds([]);
    showToast(`Bulk-Approved ${count} timesheets • Released to MOL/WPS Batch Engine`);
  };

  // Toggle individual row selection
  const handleToggleSelectWeeklyWorker = (workerId) => {
    setSelectedWeeklyWorkerIds((prev) =>
      prev.includes(workerId) ? prev.filter((id) => id !== workerId) : [...prev, workerId]
    );
  };

  // Toggle select all
  const handleToggleSelectAllWeekly = () => {
    if (selectedWeeklyWorkerIds.length === filteredWeeklyWorkers.length) {
      setSelectedWeeklyWorkerIds([]);
    } else {
      setSelectedWeeklyWorkerIds(filteredWeeklyWorkers.map((w) => w.id));
    }
  };

  // Approve single worker
  const handleApproveWeeklyWorker = (workerId) => {
    setWeeklyWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, status: 'Approved', signedOff: true } : w))
    );
    showToast(`Approved timesheet sign-off for ${workerId}`);
  };

  // Reject / flag single worker
  const handleRejectWeeklyWorker = (workerId) => {
    setWeeklyWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, status: 'Flagged', signedOff: false } : w))
    );
    showToast(`Flagged exception for ${workerId} • Returned to field supervisor`);
  };

  // Direct inline editing for daily hours in weekly matrix
  const handleDayHourChange = (workerId, dayKey, rawVal) => {
    setWeeklyWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const trimmedUpper = rawVal.trim().toUpperCase();
          let newVal;
          if (trimmedUpper === 'REST' || trimmedUpper === 'R') {
            newVal = 'REST';
          } else {
            newVal = rawVal;
          }
          return {
            ...w,
            manualReg: undefined,
            manualOt: undefined,
            days: {
              ...w.days,
              [dayKey]: newVal,
            },
          };
        }
        return w;
      })
    );
  };

  const handleDayHourBlur = (workerId, dayKey) => {
    setWeeklyWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const current = w.days[dayKey];
          let finalVal = current;
          if (typeof current === 'string') {
            const upper = current.trim().toUpperCase();
            if (upper === 'REST' || upper === 'R') {
              finalVal = 'REST';
            } else if (upper === '' || isNaN(parseFloat(current))) {
              finalVal = 0;
            } else {
              finalVal = Math.round(parseFloat(current) * 10) / 10;
            }
          } else if (typeof current === 'number') {
            finalVal = Math.round(current * 10) / 10;
          }
          return {
            ...w,
            days: {
              ...w.days,
              [dayKey]: finalVal,
            },
          };
        }
        return w;
      })
    );
  };

  // Direct inline editing for Regular Hours (REG)
  const handleRegHourChange = (workerId, rawVal) => {
    setWeeklyWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, manualReg: rawVal } : w))
    );
  };

  const handleRegHourBlur = (workerId) => {
    setWeeklyWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const current = w.manualReg;
          let finalVal = current;
          if (current === '' || current === undefined || isNaN(parseFloat(current))) {
            finalVal = undefined; // Clears override so auto-calculation from days resumes
          } else {
            finalVal = Math.round(parseFloat(current) * 10) / 10;
          }
          return { ...w, manualReg: finalVal };
        }
        return w;
      })
    );
  };

  // Direct inline editing for Overtime Hours (OT 1.5x)
  const handleOtHourChange = (workerId, rawVal) => {
    setWeeklyWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, manualOt: rawVal } : w))
    );
  };

  const handleOtHourBlur = (workerId) => {
    setWeeklyWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const current = w.manualOt;
          let finalVal = current;
          if (current === '' || current === undefined || isNaN(parseFloat(current))) {
            finalVal = undefined; // Clears override so auto-calculation from days resumes
          } else {
            finalVal = Math.round(parseFloat(current) * 10) / 10;
          }
          return { ...w, manualOt: finalVal };
        }
        return w;
      })
    );
  };

  // =================================================================
  // TIME ENGINE & DURATION CALCULATIONS (Manual Check-In & Check-Out)
  // =================================================================

  // Parse time string (e.g. "07:00 AM", "17:00 PM", "15:30", "07:15") to minutes from midnight
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr || timeStr === '--:--' || timeStr.trim() === '') return null;
    const clean = timeStr.trim().toUpperCase();
    const isPM = clean.includes('PM');
    const isAM = clean.includes('AM');
    const stripped = clean.replace(/(AM|PM)/g, '').trim();
    const parts = stripped.split(':');
    if (parts.length < 2) return null;
    let hours = parseInt(parts[0], 10);
    let mins = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(mins)) return null;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60 + mins;
  };

  // Calculate net worked hours, regular hours (capped at 8.0h), and overtime hours
  const calculateHoursFromTimes = (timeIn, timeOut) => {
    const inMins = parseTimeToMinutes(timeIn);
    const outMins = parseTimeToMinutes(timeOut);
    if (inMins === null || outMins === null) return null;

    let diffMins = outMins - inMins;
    if (diffMins < 0) {
      diffMins += 24 * 60; // handles shifts across midnight
    }

    // Deduct standard 30-min unpaid meal break if shift duration is 5 hours or more
    let netMins = diffMins;
    if (diffMins >= 300) {
      netMins = Math.max(0, diffMins - 30);
    }

    const totalHours = Math.round((netMins / 60) * 100) / 100;
    let reg = Math.min(8.0, totalHours);
    let ot = totalHours > 8.0 ? Math.round((totalHours - 8.0) * 100) / 100 : 0.0;

    return { totalHours, reg, ot };
  };

  // Individual worker Check-In (stamps arrival, status -> On Site)
  const handleCheckInWorker = (workerId, timeStr = '07:00 AM') => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            timeIn: timeStr,
            timeOut: '--:--',
            attendance: w.attendance === 'Absent' ? 'Present' : w.attendance,
            rollCallChecked: true,
            regHours: 0,
            otHours: 0,
          };
        }
        return w;
      })
    );
    showToast(`Checked in worker at ${timeStr} • Status: Working on Site`);
  };

  // Individual worker Check-Out (stamps departure, calculates hours & daily pay)
  const handleCheckOutWorker = (workerId, timeStr = '15:30 PM') => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const inTime = w.timeIn && w.timeIn !== '--:--' ? w.timeIn : '07:00 AM';
          const calc = calculateHoursFromTimes(inTime, timeStr) || { reg: 8.0, ot: 0, totalHours: 8.0 };
          return {
            ...w,
            timeIn: inTime,
            timeOut: timeStr,
            regHours: calc.reg,
            otHours: calc.ot,
            verified: true,
          };
        }
        return w;
      })
    );
    showToast(`Checked out worker at ${timeStr} • Hours & Daily Pay auto-calculated`);
  };

  // Reset checkout (returns worker to active on-site status)
  const handleResetCheckout = (workerId) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            timeOut: '--:--',
            regHours: 0,
            otHours: 0,
            verified: false,
          };
        }
        return w;
      })
    );
    showToast('Checkout reset • Worker returned to active On Site status');
  };

  // Live Manual In/Out string update with auto-calculation
  const handleUpdateTimeIn = (workerId, val) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const updated = { ...w, timeIn: val };
          if (val && val !== '--:--' && w.timeOut && w.timeOut !== '--:--') {
            const calc = calculateHoursFromTimes(val, w.timeOut);
            if (calc) {
              updated.regHours = calc.reg;
              updated.otHours = calc.ot;
            }
          }
          return updated;
        }
        return w;
      })
    );
  };

  const handleUpdateTimeOut = (workerId, val) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const updated = { ...w, timeOut: val };
          if (w.timeIn && w.timeIn !== '--:--' && val && val !== '--:--') {
            const calc = calculateHoursFromTimes(w.timeIn, val);
            if (calc) {
              updated.regHours = calc.reg;
              updated.otHours = calc.ot;
            }
          }
          return updated;
        }
        return w;
      })
    );
  };

  // Manual Attendance updates
  const updateWorkerAttendance = (workerId, newStatus) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          let reg = w.regHours;
          let ot = w.otHours;
          let timeIn = w.timeIn;
          let timeOut = w.timeOut;

          if (newStatus === 'Absent') {
            reg = 0;
            ot = 0;
            timeIn = '--:--';
            timeOut = '--:--';
          } else if (newStatus === 'Half-Day') {
            reg = 4.0;
            ot = 0;
            if (timeIn === '--:--') timeIn = '07:00 AM';
            timeOut = '11:00 AM';
          } else if (newStatus === 'Present') {
            if (timeIn === '--:--') timeIn = '07:00 AM';
            if (timeOut && timeOut !== '--:--') {
              const calc = calculateHoursFromTimes(timeIn, timeOut);
              if (calc) {
                reg = calc.reg;
                ot = calc.ot;
              }
            }
          } else if (newStatus === 'Late') {
            if (timeIn === '--:--' || timeIn === '07:00 AM') timeIn = '07:30 AM';
            if (timeOut && timeOut !== '--:--') {
              const calc = calculateHoursFromTimes(timeIn, timeOut);
              if (calc) {
                reg = calc.reg;
                ot = calc.ot;
              }
            }
          }

          return {
            ...w,
            attendance: newStatus,
            regHours: reg,
            otHours: ot,
            timeIn,
            timeOut,
            rollCallChecked: newStatus !== 'Absent',
          };
        }
        return w;
      })
    );
  };

  const updateHours = (workerId, field, val) => {
    const num = parseFloat(val) || 0;
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return { ...w, [field]: num };
        }
        return w;
      })
    );
  };

  const toggleWorkerVerification = (workerId) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return { ...w, verified: !w.verified };
        }
        return w;
      })
    );
  };

  const toggleRollCallCheck = (workerId) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const next = !w.rollCallChecked;
          return {
            ...w,
            rollCallChecked: next,
            attendance: next ? (w.attendance === 'Absent' ? 'Present' : w.attendance) : 'Absent',
            regHours: next ? (w.regHours === 0 ? 8.0 : w.regHours) : 0,
            otHours: next ? w.otHours : 0,
            timeIn: next ? (w.timeIn === '--:--' ? '07:00 AM' : w.timeIn) : '--:--',
            timeOut: next ? (w.timeOut === '--:--' ? '15:30 PM' : w.timeOut) : '--:--',
          };
        }
        return w;
      })
    );
  };

  const toggleDifferential = (workerId, field) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return { ...w, [field]: !w[field] };
        }
        return w;
      })
    );
  };

  // =================================================================
  // BATCH OPERATIONS: Morning Check-In All & Evening Check-Out All
  // =================================================================

  // =================================================================
  // MUSTER WORKFLOW: Submit & Seal Morning Roll Call & Import CSV
  // =================================================================

  const handleSubmitMusterRollCall = () => {
    const checkedWorkers = workers.filter((w) => w.rollCallChecked);
    const absentWorkers = workers.filter((w) => !w.rollCallChecked);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const auditId = `MUST-${Math.random().toString(36).substring(2, 8).toUpperCase()}-KSA`;

    // Officially synchronize attendance and lock
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.rollCallChecked) {
          return {
            ...w,
            verified: true,
            attendance: w.attendance === 'Absent' ? 'Present' : w.attendance,
            timeIn: w.timeIn === '--:--' ? '07:00 AM' : w.timeIn,
            regHours: w.regHours === 0 ? 8.0 : w.regHours,
          };
        } else {
          return {
            ...w,
            attendance: 'Absent',
            timeIn: '--:--',
            timeOut: '--:--',
            regHours: 0,
            otHours: 0,
            verified: false,
          };
        }
      })
    );

    setMusterSealInfo({
      timestamp: `Today at ${nowTime}`,
      certifiedBy: 'Tariq Al-Mansoor (Site Coordinator)',
      auditId,
      checkedCount: checkedWorkers.length,
      absentCount: absentWorkers.length,
    });
    setMusterSubmitted(true);
    showToast(`Morning Muster Sealed! ${checkedWorkers.length} verified present, ${absentWorkers.length} marked absent.`);
  };

  const handleReopenMusterRollCall = () => {
    setMusterSubmitted(false);
    showToast('Morning Muster unlocked for coordinator adjustments.');
  };

  const handleImportMusterCsv = (csvText) => {
    if (!csvText || !csvText.trim()) {
      showToast('Please upload or paste valid CSV content');
      return;
    }

    const lines = csvText.trim().split('\n');
    let matchedCount = 0;

    setWorkers((prev) => {
      const updated = [...prev];
      lines.forEach((line) => {
        const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length >= 2) {
          const idOrName = parts[0].toUpperCase();
          const status = parts[1].toUpperCase();
          const isPresent =
            status.includes('PRESENT') ||
            status.includes('YES') ||
            status.includes('CHECKED') ||
            status === '1' ||
            status === 'TRUE';

          const idx = updated.findIndex(
            (w) =>
              w.id.toUpperCase() === idOrName ||
              w.name.toUpperCase().includes(idOrName) ||
              idOrName.includes(w.id.toUpperCase())
          );

          if (idx !== -1) {
            matchedCount++;
            updated[idx] = {
              ...updated[idx],
              rollCallChecked: isPresent,
              attendance: isPresent
                ? updated[idx].attendance === 'Absent'
                  ? 'Present'
                  : updated[idx].attendance
                : 'Absent',
              timeIn: isPresent ? (updated[idx].timeIn === '--:--' ? '07:00 AM' : updated[idx].timeIn) : '--:--',
              regHours: isPresent ? (updated[idx].regHours === 0 ? 8.0 : updated[idx].regHours) : 0,
            };
          }
        }
      });
      return updated;
    });

    setShowMusterCsvModal(false);
    setMusterCsvInput('');
    showToast(`CSV Imported: Updated roll call status for ${matchedCount} workers.`);
  };

  // Morning Muster Roll Call: Check-In all scheduled workers
  const handleCheckInAllScheduled = () => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.attendance !== 'Absent') {
          return {
            ...w,
            attendance: 'Present',
            timeIn: '07:00 AM',
            timeOut: '--:--',
            regHours: 0,
            otHours: 0,
            rollCallChecked: true,
          };
        }
        return w;
      })
    );
    showToast('Checked in all scheduled crew at 07:00 AM • Marked Active on Site');
  };

  // Evening Muster Out: Check-out all active workers with standard 8h (15:30 PM)
  const handleCheckOutAllStandard = () => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.attendance !== 'Absent' && w.timeIn !== '--:--') {
          const calc = calculateHoursFromTimes(w.timeIn, '15:30 PM') || { reg: 8.0, ot: 0, totalHours: 8.0 };
          return {
            ...w,
            timeOut: '15:30 PM',
            regHours: calc.reg,
            otHours: calc.ot,
            verified: true,
          };
        }
        return w;
      })
    );
    showToast('Checked out active crew at 15:30 PM • 8.0h Base & Daily Pay auto-calculated');
  };

  // Evening Muster Out with Overtime: Check-out all active workers at 17:30 PM (+2h OT)
  const handleCheckOutAllOvertime = (outTime = '17:30 PM') => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.attendance !== 'Absent' && w.timeIn !== '--:--') {
          const calc = calculateHoursFromTimes(w.timeIn, outTime) || { reg: 8.0, ot: 2.0, totalHours: 10.0 };
          return {
            ...w,
            timeOut: outTime,
            regHours: calc.reg,
            otHours: calc.ot,
            verified: true,
          };
        }
        return w;
      })
    );
    showToast(`Checked out active crew at ${outTime} (+2h OT) • Overtime & Pay auto-calculated`);
  };

  const handleVerifyAll = () => {
    setWorkers((prev) => prev.map((w) => ({ ...w, verified: true })));
    showToast('All roster entries certified by Site Coordinator');
  };

  // Handle new Field Pass Creation
  const handleCreatePass = (e) => {
    e.preventDefault();
    const newPass = {
      id: `PASS-${Math.floor(1000 + Math.random() * 9000)}`,
      type: passForm.passType,
      workerId: passForm.workerId,
      workerName: passForm.workerName,
      trade: workers.find((w) => w.id === passForm.workerId)?.trade || 'Structural Steel',
      destination: passForm.destination,
      departureTime: passForm.departureTime,
      authorizedBy: passForm.authorizedBy,
      reason: passForm.reason,
      status: 'Approved & Active',
      returnExpected: passForm.returnExpected ? 'Yes' : 'No',
      issuedAt: 'Just now',
    };

    setFieldPasses([newPass, ...fieldPasses]);
    setShowPassModal(false);
    showToast(`Field Pass #${newPass.id} issued & logged in gate ledger`);
  };

  // Handle Remark / Note save
  const handleSaveRemark = () => {
    if (!showRemarkModal) return;
    setWorkers((prev) =>
      prev.map((w) => (w.id === showRemarkModal.id ? { ...w, remarks: remarkText } : w))
    );
    setShowRemarkModal(null);
    showToast(`Saved coordinator remark for ${showRemarkModal.name}`);
  };

  // Handle shift submission to Dept Manager
  const handleSubmitShift = () => {
    const totalReg = workers.reduce((acc, w) => acc + w.regHours, 0);
    const totalOt = workers.reduce((acc, w) => acc + w.otHours, 0);
    const totalWorkers = workers.filter((w) => w.attendance !== 'Absent').length;

    const dossier = {
      timestamp: new Date().toLocaleTimeString(),
      date: 'Today, Oct 04, 2026',
      shiftId: selectedShift,
      totalHeadcount: totalWorkers,
      totalHours: totalReg + totalOt,
      otHours: totalOt,
      unverifiedExceptions: workers.filter((w) => !w.verified).length,
      auditHash: `MAN-MUSTER-${Math.random().toString(36).substring(2, 9).toUpperCase()}-DXB`,
    };

    setSubmissionDossier(dossier);
    setShiftSubmitted(true);
    setShowSubmitModal(false);
    showToast('Shift Timesheet digitally signed & dispatched to Dept Manager Review Portal!');
  };

  // Quick Reassign Zone
  const handleReassignZone = (newZone) => {
    if (!showReassignModal) return;
    setWorkers((prev) =>
      prev.map((w) => (w.id === showReassignModal.id ? { ...w, zone: newZone } : w))
    );
    setShowReassignModal(null);
    showToast(`Reassigned ${showReassignModal.name} to ${newZone}`);
  };

  // Calculate real-time daily pay for a worker based on regular hours, overtime, and allowances
  const calculateWorkerDailyPay = (worker) => {
    if (worker.attendance === 'Absent') return 0;
    const rate = Number(worker.hourlyRate) || 0;
    const reg = Number(worker.regHours) || 0;
    const ot = Number(worker.otHours) || 0;

    // Regular base pay
    const basePay = reg * rate;

    // Overtime pay (standard 1.5x multiplier)
    const otPay = ot * (rate * 1.5);

    // Shift allowances (calculated on regular hours)
    const nightDiffPay = worker.nightDiff ? reg * rate * 0.15 : 0;
    const hazardPay = worker.hazardPay ? reg * rate * 0.20 : 0;

    return basePay + otPay + nightDiffPay + hazardPay;
  };

  // Telemetry Aggregations
  const totalOnSite = workers.filter((w) => w.timeIn !== '--:--' && w.timeOut === '--:--').length;
  const totalCompleted = workers.filter((w) => w.timeOut !== '--:--' && w.attendance !== 'Absent').length;
  const totalPendingIn = workers.filter((w) => w.timeIn === '--:--' && w.attendance !== 'Absent').length;
  const totalMobilized = workers.filter((w) => w.attendance !== 'Absent').length;
  const totalLate = workers.filter((w) => w.attendance === 'Late').length;
  const totalAbsent = workers.filter((w) => w.attendance === 'Absent').length;
  const totalOvertimeHours = workers.reduce((sum, w) => sum + w.otHours, 0);
  const totalBaseHours = workers.reduce((sum, w) => sum + w.regHours, 0);
  const totalShiftLaborCost = workers.reduce(
    (sum, w) => sum + calculateWorkerDailyPay(w),
    0
  );

  // Comprehensive crew manifest generator for Zone Deployment Modal
  const getZoneCrewMembers = (zone) => {
    if (!zone) return [];

    // Direct matches from active workers state
    const directWorkers = workers
      .filter((w) => w.zone && (w.zone.includes(zone.id) || zone.title.includes(w.zone.split(':')[0])))
      .map((w) => ({
        id: w.id,
        name: w.name,
        trade: w.trade,
        subTrade: w.subTrade,
        workPackage: w.workPackage,
        supplier: w.supplier,
        timeIn: w.timeIn,
        attendance: w.attendance,
        isLead: false,
        radio: zone.channel,
      }));

    // Specific zone supplemental crew rosters
    const supplementalRosters = {
      'Zone A': [
        { id: 'W-88201', name: 'Captain Bilal Al-Harthi', trade: 'Heavy Rigging', subTrade: 'Rigging Superintendent', workPackage: 'Berth 4 Heavy Crane Lift Coordination', supplier: 'Aramco Logistics', timeIn: '06:45 AM', attendance: 'Present', isLead: true, radio: 'VHF Ch. 4' },
        { id: 'W-88215', name: 'Alexei Romanov', trade: 'Heavy Rigging', subTrade: 'Master Crane Operator 300T', workPackage: 'Berth 4 Gantry Hoist Tandem Operation', supplier: 'Global Lifting KSA', timeIn: '06:50 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 4' },
        { id: 'W-88216', name: 'Tamerlan Kadyrov', trade: 'Heavy Rigging', subTrade: 'Lead Rigger / Slinger', workPackage: 'Under-Hook Spreader Beam Rigging', supplier: 'Global Lifting KSA', timeIn: '06:55 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 4' },
        { id: 'W-88217', name: 'Zayan Qureshi', trade: 'Structural Steel', subTrade: 'Steel Erector Specialist', workPackage: 'Pier Hub Bolting & Torque Verification', supplier: 'BuildTech Manpower', timeIn: '07:05 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 4' },
        { id: 'W-88218', name: 'Tariq Al-Dosari', trade: 'Heavy Rigging', subTrade: 'Dogger & Blind Lift Marshall', workPackage: 'Vessel Unloading Signal Relay', supplier: 'Aramco Logistics', timeIn: '07:00 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 4' },
        { id: 'W-88219', name: 'Salem Mansoori', trade: 'Structural Steel', subTrade: 'Gantry Alignment Fitter', workPackage: 'Pier Hub Anchor Plate Leveling', supplier: 'BuildTech Manpower', timeIn: '07:10 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 4' },
        { id: 'W-88220', name: 'Omar Al-Ghamdi', trade: 'HSE Safety & Traffic', subTrade: 'Lifting Operations Marshall', workPackage: 'Swing Radius Exclusion Zone Perimeter', supplier: 'SafetyFirst KSA', timeIn: '06:40 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 4' },
      ],
      'Zone B': [
        { id: 'W-88202', name: 'Karim Vance', trade: 'MEP Systems', subTrade: 'MEP Senior Lead Foreman', workPackage: 'Central HVAC Tower Chiller Commissioning', supplier: 'ElectroMech Gulf', timeIn: '06:50 AM', attendance: 'Present', isLead: true, radio: 'VHF Ch. 2' },
        { id: 'W-88208', name: 'Soraya Chen', trade: 'MEP Systems', subTrade: 'HVAC Controls Specialist', workPackage: 'BMS Sensor Calibration & Duct balancing', supplier: 'ElectroMech Gulf', timeIn: '06:55 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 2' },
        { id: 'W-88222', name: 'Nabil El-Masri', trade: 'MEP Systems', subTrade: 'HVAC Industrial Electrician', workPackage: 'Chiller Pump 400V Switchgear Wiring', supplier: 'VoltPower Services', timeIn: '07:00 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 2' },
        { id: 'W-88223', name: 'Carlos Mendez', trade: 'MEP Systems', subTrade: 'Chilled Water Pipefitter', workPackage: 'Riser Flange Gasket Fitting (Level 3)', supplier: 'ElectroMech Gulf', timeIn: '07:15 AM', attendance: 'Late', isLead: false, radio: 'VHF Ch. 2' },
        { id: 'W-88224', name: 'Deven Nair', trade: 'MEP Systems', subTrade: 'Fire Suppression Technician', workPackage: 'Zone B Sprinkler Deluge Hydro-Test', supplier: 'VoltPower Services', timeIn: '06:55 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 2' },
        { id: 'W-88225', name: 'Bilal Al-Khatib', trade: 'MEP Systems', subTrade: 'Sheet Metal Duct Installer', workPackage: 'Primary Air Intake Plenum Assembly', supplier: 'ElectroMech Gulf', timeIn: '07:00 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 2' },
        { id: 'W-88226', name: 'Tariq Lin', trade: 'HSE Safety & Traffic', subTrade: 'Confined Space Safety Officer', workPackage: 'Shaft 2 Gas Detection & Entry Permit', supplier: 'SafetyFirst KSA', timeIn: '06:45 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 2' },
      ],
      'Zone C': [
        { id: 'W-88203', name: 'Marcus O\'Connor', trade: 'Structural Steel', subTrade: 'Master Fabrication Superintendent', workPackage: 'West Perimeter Heavy Box Girder Welds', supplier: 'Apex Steel Industries', timeIn: '06:45 AM', attendance: 'Present', isLead: true, radio: 'VHF Ch. 7' },
        { id: 'W-88227', name: 'Sergei Kozlov', trade: 'Structural Steel', subTrade: 'Submerged Arc Welder Specialist', workPackage: 'Splice Joint #14 Full Penetration Butt Weld', supplier: 'Apex Steel Industries', timeIn: '06:55 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 7' },
        { id: 'W-88228', name: 'Kwame Mensah', trade: 'Civil Framing', subTrade: 'Structural Framing Gang Lead', workPackage: 'Tie-In Bracing & Torque Tensioning', supplier: 'BuildTech Manpower', timeIn: '07:00 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 7' },
        { id: 'W-88229', name: 'Lucas Silva', trade: 'Structural Steel', subTrade: 'Heavy Ironworker Connector', workPackage: 'Overhead Canopy Crane Hookup', supplier: 'Apex Steel Industries', timeIn: '07:05 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 7' },
        { id: 'W-88230', name: 'Chen Wei', trade: 'Structural Steel', subTrade: 'Ultrasonic NDT Quality Inspector', workPackage: 'Radiographic Weld Defect Inspection', supplier: 'Apex Steel Industries', timeIn: '07:00 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 7' },
        { id: 'W-88231', name: 'Hassan Al-Omari', trade: 'Civil Framing', subTrade: 'High-Tensile Bolter', workPackage: 'Moment Connection Calibrated Wrenching', supplier: 'BuildTech Manpower', timeIn: '07:10 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 7' },
      ],
      'Zone D': [
        { id: 'W-88205', name: 'Ahmed Farooq', trade: 'Concrete & Earthworks', subTrade: 'Concrete & Foundation Foreman', workPackage: 'South Terminal Pile Cap 12 Pour', supplier: 'Saudi ReadyMix Corp', timeIn: '06:40 AM', attendance: 'Present', isLead: true, radio: 'VHF Ch. 5' },
        { id: 'W-88232', name: 'Vikram Patel', trade: 'Concrete & Earthworks', subTrade: 'Senior Rebar Fabricator', workPackage: 'Bespoke Cage Reinforcement Tying', supplier: 'Saudi ReadyMix Corp', timeIn: '06:50 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 5' },
        { id: 'W-88233', name: 'Rajesh Goud', trade: 'Concrete & Earthworks', subTrade: '56M Boom Pump Operator', workPackage: 'Continuous C35/45 Pour Discharge', supplier: 'Saudi ReadyMix Corp', timeIn: '06:55 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 5' },
        { id: 'W-88234', name: 'Tariq Al-Badawi', trade: 'Concrete & Earthworks', subTrade: 'Heavy Formwork Carpenter Lead', workPackage: 'Doka Shoring System Strut Locking', supplier: 'BuildTech Manpower', timeIn: '07:00 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 5' },
        { id: 'W-88235', name: 'Suresh Kumar', trade: 'Concrete & Earthworks', subTrade: 'High-Frequency Vibrator Operator', workPackage: 'Honeycombing Prevention & Consolidation', supplier: 'Saudi ReadyMix Corp', timeIn: '07:05 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 5' },
        { id: 'W-88236', name: 'Dawood Khan', trade: 'Concrete & Earthworks', subTrade: 'CAT 349 Excavator Lead Operator', workPackage: 'Backfill Trenching & Slurry Dewatering', supplier: 'Saudi ReadyMix Corp', timeIn: '06:50 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 5' },
      ],
      'Zone E': [
        { id: 'W-88207', name: 'Sarah Al-Qasim', trade: 'HSE Safety & Traffic', subTrade: 'Lead HSE Safety Superintendent', workPackage: 'Terminal 4 Site-Wide HSE Enforcement', supplier: 'SafetyFirst KSA', timeIn: '06:30 AM', attendance: 'Present', isLead: true, radio: 'VHF Ch. 1' },
        { id: 'W-88210', name: 'Elena Rostova', trade: 'HSE Safety & Traffic', subTrade: 'Industrial Hygiene & Heat Stress Officer', workPackage: 'Wet-Bulb Temperature Index Monitoring', supplier: 'SafetyFirst KSA', timeIn: '06:45 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 1' },
        { id: 'W-88237', name: 'Tariq Lin', trade: 'HSE Safety & Traffic', subTrade: 'Heavy Vehicle Gate Marshall', workPackage: 'Gate 4 Concrete Transit Truck Sequencing', supplier: 'SafetyFirst KSA', timeIn: '06:40 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 1' },
        { id: 'W-88238', name: 'Hamza Al-Zahrani', trade: 'HSE Safety & Traffic', subTrade: 'Permit-to-Work (PTW) Field Auditor', workPackage: 'Hot Work & Scaffold Tag Verifications', supplier: 'SafetyFirst KSA', timeIn: '06:50 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 1' },
        { id: 'W-88239', name: 'Khalid Al-Otaibi', trade: 'HSE Safety & Traffic', subTrade: 'Emergency Response First Aider', workPackage: 'Zone E Medic Post & Hydration Station', supplier: 'SafetyFirst KSA', timeIn: '06:45 AM', attendance: 'Present', isLead: false, radio: 'VHF Ch. 1' },
      ],
    };

    const supplemental = supplementalRosters[zone.id] || [];

    // Combine without duplicate IDs
    const combined = [...directWorkers];
    supplemental.forEach((sw) => {
      if (!combined.some((cw) => cw.id === sw.id)) {
        combined.push(sw);
      }
    });

    return combined;
  };

  // Dynamic Hero Banner Configuration based on activeTab
  const getBannerDetails = () => {
    switch (activeTab) {
      case 'muster':
        return {
          pillTag: 'Physical Roll Call (06:30 - 07:15)',
          pillLocation: 'Muster Assembly Point Alpha • 6 Trade Gangs',
          titlePrefix: 'Shift Muster & ',
          titleHighlight: 'Physical Roll Call Control',
          description:
            'Conduct morning field roll call, verify in-person headcounts across trade gangs, sync gate turnstile logs via CSV, and certify attendance seals.',
          chips: [
            {
              id: 'muster-present',
              className: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
              iconDot: true,
              text: `${workers.filter((w) => w.rollCallChecked).length} / ${workers.length} Present & Checked`,
            },
            {
              id: 'muster-absent',
              className: 'bg-rose-500/20 border-rose-500/30 text-rose-200',
              icon: 'person_off',
              text: `${workers.filter((w) => !w.rollCallChecked).length} Absent / Standby`,
            },
            {
              id: 'muster-trades',
              className: 'bg-blue-500/20 border-blue-500/30 text-blue-200',
              icon: 'groups',
              text: '6 Work Trades Assembled',
            },
            {
              id: 'muster-seal',
              className: musterSubmitted
                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-100 font-bold'
                : 'bg-amber-500/20 border-amber-500/30 text-amber-200',
              icon: musterSubmitted ? 'verified' : 'pending_actions',
              text: musterSubmitted
                ? `Sealed & Certified (${musterSealInfo.auditId || 'KSA'})`
                : 'Muster In-Progress',
            },
          ],
          actions: (
            <>
              <button
                onClick={() => setShowMusterCsvModal(true)}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs backdrop-blur-md"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-300">upload_file</span>
                <span>Import CSV Roster</span>
              </button>
              <button
                onClick={() => showToast('Muster Headcount sheet exported for Project Manager inspection')}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs backdrop-blur-md"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-sky-300">print</span>
                <span>Print Muster Sheet</span>
              </button>
              {musterSubmitted ? (
                <button
                  onClick={handleReopenMusterRollCall}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-md transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-300">lock_open</span>
                  <span>Reopen / Edit Muster</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmitMusterRollCall}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-md shadow-emerald-900/30 transition-all active:scale-[0.98]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Submit &amp; Seal Muster</span>
                </button>
              )}
            </>
          ),
        };

      case 'deployment':
        return {
          pillTag: 'Terminal 4 Pier Expansion',
          pillLocation: '5 Active Work Zones • VHF Ch. 01 - 08',
          titlePrefix: 'Live Crew Deployment & ',
          titleHighlight: 'Zone Allocation Board',
          description:
            'Coordinate manual gang assignments, two-way radio channels, work package progress, and heat index safety rotations across pier zones.',
          chips: [
            {
              id: 'dep-workers',
              className: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
              iconDot: true,
              text: '149 Deployed Headcount',
            },
            {
              id: 'dep-zones',
              className: 'bg-blue-500/20 border-blue-500/30 text-blue-200',
              icon: 'grid_view',
              text: '5 Work Zones Active',
            },
            {
              id: 'dep-radio',
              className: 'bg-purple-500/20 border-purple-500/30 text-purple-200',
              icon: 'podcasts',
              text: '100% Radio Comms Verified',
            },
            {
              id: 'dep-heat',
              className: 'bg-amber-500/20 border-amber-500/30 text-amber-200',
              icon: 'thermostat',
              text: 'Heat Index: 38°C (Normal Breaks)',
            },
          ],
          actions: (
            <>
              <button
                onClick={() => showToast('Synced zone allocations and radio channels with shift foremen')}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs backdrop-blur-md"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-300">refresh</span>
                <span>Sync Radios &amp; Headcount</span>
              </button>
              <button
                onClick={() => showToast('Emergency heat rotation plan dispatched to all Gang Bosses')}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs backdrop-blur-md"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-rose-300">water_drop</span>
                <span>Hydration Alert</span>
              </button>
              <button
                onClick={() => showToast('Exported Crew Deployment Matrix (PDF)')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white shadow-md shadow-secondary/30 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Export Dispatch Matrix</span>
              </button>
            </>
          ),
        };

      case 'safety-tbt':
        return {
          pillTag: 'Aramco HSE & OSHA Protocol',
          pillLocation: `Pre-Shift Briefing Log #${tbtLog.date || 'Today'}`,
          titlePrefix: 'Daily Safety Toolbox Talk & ',
          titleHighlight: 'HSE Briefing Center',
          description:
            'Conduct mandatory pre-shift safety briefings, verify critical hazard controls (Hot Work, Heights, Rigging), and log worker acknowledgment signatures.',
          chips: [
            {
              id: 'tbt-clearance',
              className: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
              iconDot: true,
              text: 'Pre-Shift Briefing Cleared',
            },
            {
              id: 'tbt-hazards',
              className: 'bg-amber-500/20 border-amber-500/30 text-amber-200',
              icon: 'warning',
              text: '2 Critical Hazards Briefed',
            },
            {
              id: 'tbt-days',
              className: 'bg-blue-500/20 border-blue-500/30 text-blue-200',
              icon: 'health_and_safety',
              text: 'Zero Incidents (142 Days Safe)',
            },
            {
              id: 'tbt-ppe',
              className: 'bg-purple-500/20 border-purple-500/30 text-purple-200',
              icon: 'check_circle',
              text: '100% PPE Verified',
            },
          ],
          actions: (
            <>
              <button
                onClick={() => showToast('Emergency HSE Safety Notice broadcast to all zone channels')}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs backdrop-blur-md"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-rose-300">campaign</span>
                <span>Broadcast HSE Alert</span>
              </button>
              <button
                onClick={() => showToast('TBT Safety Dossier PDF generated for Aramco HSE Audit archive')}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs backdrop-blur-md"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-sky-300">picture_as_pdf</span>
                <span>Export TBT Dossier</span>
              </button>
              <button
                onClick={() => setShowTBTModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-md shadow-emerald-900/30 transition-all active:scale-[0.98]"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>Update TBT Briefing</span>
              </button>
            </>
          ),
        };

      case 'timesheets':
      default:
        return {
          pillTag: 'Shift 1 Active (07:00 - 15:30)',
          pillLocation: 'Terminal 4 • Pier Hub (Manual Roster)',
          titlePrefix: 'Manual Shift Timesheet & ',
          titleHighlight: 'Field Hours Ledger',
          description:
            'Direct physical attendance roll call, manual hours & overtime entry, daily work package assignment, and supervisor sign-offs.',
          chips: [
            {
              id: 'ts-onsite',
              className: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
              iconDot: true,
              text: `${totalOnSite} Actively Working on Site`,
            },
            {
              id: 'ts-completed',
              className: 'bg-blue-500/20 border-blue-500/30 text-blue-200',
              icon: 'check_circle',
              text: `${totalCompleted} Shifts Completed`,
            },
            {
              id: 'ts-late-absent',
              className: 'bg-amber-500/20 border-amber-500/30 text-amber-200',
              icon: 'warning',
              text: `${totalLate} Late • ${totalAbsent} Absent`,
            },
            {
              id: 'ts-ot',
              className: 'bg-white/10 border-white/15 text-white/90',
              icon: 'timer',
              text: `${totalOvertimeHours}h OT Logged`,
            },
          ],
          actions: (
            <>
              <button
                onClick={() => setShowPassModal(true)}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs backdrop-blur-md"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">assignment_add</span>
                <span>+ Issue Field Pass / Leave</span>
              </button>
              <button
                onClick={() => setShowTBTModal(true)}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs backdrop-blur-md"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-400">health_and_safety</span>
                <span>Safety (TBT) Briefing</span>
              </button>
              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={shiftSubmitted}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${
                  shiftSubmitted
                    ? 'bg-emerald-600/60 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white ring-2 ring-secondary/20 shadow-secondary/30'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-white">
                  {shiftSubmitted ? 'check_circle' : 'send_and_archive'}
                </span>
                <span>{shiftSubmitted ? 'Shift Submitted & Locked' : 'Submit Shift to Manager'}</span>
              </button>
            </>
          ),
        };
    }
  };

  const currentBanner = getBannerDetails();

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-secondary selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0E1330] border border-secondary text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SIDEBAR NAVIGATION (Matching HR.jsx Design Exactly)       */}
      {/* ======================================================== */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#131943] via-[#0E1330] to-[#0A0D26] border-r border-[#1E2554] z-50 flex flex-col justify-between shadow-2xl">
        <div className="flex flex-col">
          {/* Top Section with Smooth Fading Effect (White to Dark Blue) on Top of Operational Suites */}
          <div
            className="w-full shrink-0"
            style={{
              background:
                'linear-gradient(180deg, #ffffff 0%, #ffffff 18%, #edf1fa 28%, #c8d2eb 38%, #9caad2 49%, #7182b2 61%, #4d5e94 72%, #314078 82%, #202c61 90%, #16204c 95%, #0E1330 100%)',
            }}
          >
            {/* Logo Brand Header */}
            <div className="h-16 px-space-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img alt="Expertise" className="h-10 w-auto max-w-[160px] object-contain" src={logoImg} />
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
            {[
              { id: 'timesheets', label: 'Shift Timesheet Logger', icon: 'edit_calendar' },
              { id: 'muster', label: 'Shift Muster & Roll Call', icon: 'fact_check' },
              { id: 'deployment', label: 'Crew Deployment Board', icon: 'lan' },
              { id: 'safety-tbt', label: 'Toolbox Talk (TBT) Log', icon: 'health_and_safety' },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
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
              <span className="material-symbols-outlined text-[17px] text-white/50 group-hover:text-secondary transition-colors">
                sync_alt
              </span>
              <div className="flex flex-col">
                <span className="font-label-sm text-[9.5px] uppercase tracking-wider text-white/45 font-semibold">
                  Active Role
                </span>
                <span className="font-body-md-medium text-xs font-semibold text-white group-hover:text-secondary transition-colors">
                  Site Coordinator
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[15px] text-white/40 group-hover:text-secondary transition-colors">
              expand_more
            </span>
          </div>
          <div className="flex items-center justify-between px-1 text-white/40 text-[10.5px]">
            <span className="font-label-sm uppercase tracking-wide">Build v4.82-FIELD</span>
            <span className="material-symbols-outlined text-[15px] text-white/40 hover:text-white cursor-pointer transition-colors">
              help_outline
            </span>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                        */}
      {/* ======================================================== */}
      <div className="pl-64">
        {/* Fixed Header Bar */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/20 z-40 flex items-center justify-between px-4 sm:px-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          {/* Breadcrumb & Shift Selector */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 font-body-sm text-xs text-on-surface-variant whitespace-nowrap shrink-0">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">home</span>
              <span>/</span>
              <span className="text-on-surface font-medium">Enterprise Workforce OS</span>
              <span>/</span>
              <span className="text-secondary font-bold">Site Coordinator Workspace</span>
            </div>

            {/* Active Shift Selector */}
            <div className="hidden lg:flex items-center pl-3 border-l border-outline-variant/30 shrink-0">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-secondary text-[16px] absolute left-2.5 pointer-events-none">
                  schedule
                </span>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-lg pl-8 pr-7 py-1.5 text-xs font-semibold text-on-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary whitespace-nowrap"
                >
                  <option value="shift1">Shift 1: Morning (07:00 - 15:30) • Active</option>
                  <option value="shift2">Shift 2: Evening (15:30 - 23:30)</option>
                  <option value="shift3">Shift 3: Night / Swing (23:30 - 07:00)</option>
                </select>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          {/* Right Toolbar */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role Switcher Dropdown */}
            <div className="relative flex items-center">
              <label className="sr-only" htmlFor="site-coordinator-role-select">
                Switch Operational Role
              </label>
              <select
                id="site-coordinator-role-select"
                className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-lg pl-3 pr-7 py-1.5 font-label-md text-xs font-semibold text-on-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary"
                value="Role: Site Coordinator"
                onChange={(e) => {
                  const val = e.target.value;
                  if (onSwitchRole) {
                    if (val === 'Role: HR') {
                      onSwitchRole({ roleKey: 'hr_maker', email: 'hr.maker@expertise.sa' });
                    } else if (val === 'Role: Accounts') {
                      onSwitchRole({ roleKey: 'accounts', email: 'approvals.accounts@expertise.sa' });
                    } else if (val === 'Role: Dept Manager') {
                      onSwitchRole({ roleKey: 'dept_mgr', email: 'manager.ops@expertise.sa' });
                    } else if (val === 'Role: Cashier') {
                      onSwitchRole({ roleKey: 'cashier', email: 'paymaster.cashier@expertise.sa' });
                    } else if (val === 'Role: Admin') {
                      onSwitchRole({ roleKey: 'admin', email: 'secops.admin@expertise.sa' });
                    }
                  }
                }}
              >
                <option value="Role: Site Coordinator">Role: Site Coordinator</option>
                <option value="Role: Cashier">Role: Cashier &amp; Payout</option>
                <option value="Role: Dept Manager">Role: Dept Manager</option>
                <option value="Role: HR">Role: HR &amp; Onboarding</option>
                <option value="Role: Accounts">Role: Accounts &amp; Release</option>
                <option value="Role: Admin">Role: Admin Governance</option>
              </select>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 pointer-events-none">
                arrow_drop_down
              </span>
            </div>

            <div className="h-6 w-px bg-outline-variant/30 hidden sm:block"></div>

            {/* Notification Bell */}
            <div
              className="relative cursor-pointer p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-surface-container-lowest"></span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-1 border-l border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-[#F18E3B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                TA
              </div>
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-on-surface leading-tight">Tariq Al-Mansoor</span>
                <span className="text-[10px] text-on-surface-variant font-mono">Terminal 4 Lead Logger</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-rose-600 hover:bg-rose-500/10 transition-colors ml-1 cursor-pointer"
                  title="Sign Out / Switch Persona"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="relative bg-surface w-full pt-[76px] px-4 sm:px-5 lg:px-6 pb-8 min-h-screen">
          <div className="flex flex-col w-full space-y-4 lg:space-y-5">
            {/* ======================================================== */}
            {/* EXECUTIVE AURORA HERO BANNER: Dynamic Operational Suite   */}
            {/* ======================================================== */}
            <div className="bg-aurora-animated border border-white/10 rounded-2xl p-4 sm:p-5 lg:py-5 lg:px-6 shadow-xl shadow-[#1A1F45]/15 relative overflow-hidden text-white transition-all duration-300">
              <div className="aurora-orb-1 absolute -right-12 -top-12 w-96 h-96 bg-[#E97F29]/30 rounded-full pointer-events-none blur-3xl"></div>
              <div className="aurora-orb-2 absolute right-72 -bottom-24 w-80 h-80 bg-[#353D80]/50 rounded-full pointer-events-none blur-3xl"></div>
              <div className="aurora-light-beam absolute -top-1/2 -bottom-1/2 w-48 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none blur-xl"></div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                {/* Title & Quick Chips */}
                <div className="flex flex-col space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/30 text-amber-200 border border-secondary/40 uppercase tracking-wider">
                      {currentBanner.pillTag}
                    </span>
                    <span className="text-[11px] text-white/70 font-mono">{currentBanner.pillLocation}</span>
                  </div>
                  <h1 className="font-headline-lg text-xl sm:text-2xl lg:text-[25px] font-bold text-white tracking-tight leading-snug">
                    {currentBanner.titlePrefix}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F7A65E]">
                      {currentBanner.titleHighlight}
                    </span>
                  </h1>
                  <p className="font-body-md text-xs sm:text-[13px] text-white/80 leading-relaxed">
                    {currentBanner.description}
                  </p>

                  {/* Telemetry Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {currentBanner.chips.map((chip) => (
                      <div
                        key={chip.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold backdrop-blur-md transition-all ${chip.className}`}
                      >
                        {chip.iconDot && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        )}
                        {chip.icon && (
                          <span className="material-symbols-outlined text-[14px]">{chip.icon}</span>
                        )}
                        <span>{chip.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suite-Specific Action Buttons */}
                {currentBanner.actions && (
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
                    {currentBanner.actions}
                  </div>
                )}
              </div>
            </div>

            {/* ======================================================== */}
            {/* SUB-VIEW 1: SHIFT TIMESHEET LOGGER (Manual Entry Table)  */}
            {/* ======================================================== */}
            {activeTab === 'timesheets' && (
              <div className="flex flex-col space-y-4">
                {/* ======================================================== */}
                {/* 1. ENTERPRISE TIMESHEET CYCLE & LOCKDOWN TOP CARD        */}
                {/* ======================================================== */}
                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Timesheet Cycle Card */}
                    <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 shadow-xs">
                      <span className="material-symbols-outlined text-secondary text-[22px]">calendar_month</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider leading-none">
                          Timesheet Cycle
                        </span>
                        <span className="text-xs font-extrabold text-on-surface mt-1">
                          Oct 01 – Oct 31, 2026{' '}
                          <span className="font-normal text-on-surface-variant text-[11px]">(Full Monthly Timesheet)</span>
                        </span>
                      </div>
                    </div>

                    {/* MOL Cutoff Lockdown Card */}
                    <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/25 shadow-xs">
                      <span className="material-symbols-outlined text-rose-600 text-[22px]">alarm</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider leading-none">
                          MOL Cutoff Lockdown
                        </span>
                        <span className="text-xs font-extrabold text-rose-800 mt-1">
                          Month-End Lock in 3 Days{' '}
                          <span className="font-semibold text-rose-600/90 text-[11px]">(Oct 31, 23:59 AST)</span>
                        </span>
                      </div>
                    </div>

                    {/* Project Selector */}
                    <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-bold text-on-surface shadow-xs">
                      <span className="material-symbols-outlined text-secondary text-[18px]">domain</span>
                      <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="bg-transparent focus:outline-none cursor-pointer pr-3 font-bold"
                      >
                        <option value="Project 104 – Riyadh Metro Expansion Site A">Project 104 – Riyadh Metro Expansion Site A</option>
                        <option value="Project 105 – King Salman Park Logistics Hub">Project 105 – King Salman Park Logistics Hub</option>
                        <option value="Project 106 – Red Sea Coastal Terminal Pier 4">Project 106 – Red Sea Coastal Terminal Pier 4</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* 2. UNIFIED FILTER TOOLBAR                                */}
                {/* ======================================================== */}
                <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  {/* Left Filters */}
                  <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[180px]">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder="Search worker name, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-9 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                    </div>

                    {/* Supplier Filter */}
                    <div className="relative flex items-center">
                      <select
                        value={selectedSupplierFilter}
                        onChange={(e) => setSelectedSupplierFilter(e.target.value)}
                        className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl pl-3 pr-7 py-2 text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                      >
                        <option value="all">Supplier: All Suppliers</option>
                        <option value="BuildTech">BuildTech Manpower</option>
                        <option value="Gulf Apex">Gulf Apex Resources</option>
                        <option value="Titan">Titan Industrial</option>
                        <option value="Empire">Empire Logistics</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 pointer-events-none">
                        expand_more
                      </span>
                    </div>

                    {/* Project Filter */}
                    <div className="relative flex items-center">
                      <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl pl-3 pr-7 py-2 text-xs font-semibold text-on-surface focus:outline-none cursor-pointer max-w-[200px] truncate"
                      >
                        <option value="Project 104 – Riyadh Metro Expansion Site A">Project: Project 104 - Riyadh Metro</option>
                        <option value="Project 105 – King Salman Park Logistics Hub">Project: Project 105 - Salman Park</option>
                        <option value="Project 106 – Red Sea Coastal Terminal Pier 4">Project: Project 106 - Red Sea Pier</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 pointer-events-none">
                        expand_more
                      </span>
                    </div>

                    {/* Trade Filter */}
                    <div className="relative flex items-center">
                      <select
                        value={tradeFilter}
                        onChange={(e) => setTradeFilter(e.target.value)}
                        className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl pl-3 pr-7 py-2 text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                      >
                        <option value="all">Trade: All Trades</option>
                        <option value="Welder">Welder 6G</option>
                        <option value="Rigging">Rigging Specialist</option>
                        <option value="Electrical">Electrical Foreman</option>
                        <option value="Concrete">Concrete Tech</option>
                        <option value="Crane">Tower Crane Operator</option>
                        <option value="Scaffolding">Scaffolding Master</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 pointer-events-none">
                        expand_more
                      </span>
                    </div>

                    {/* Supervisor Filter */}
                    <div className="relative flex items-center">
                      <select
                        value={selectedSupervisorFilter}
                        onChange={(e) => setSelectedSupervisorFilter(e.target.value)}
                        className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl pl-3 pr-7 py-2 text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                      >
                        <option value="all">Supervisor: All Supervisors</option>
                        <option value="Mansoor">Eng. Mansoor Al-Harbi</option>
                        <option value="Tariq">Tariq Al-Mansoor</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 pointer-events-none">
                        expand_more
                      </span>
                    </div>

                    {/* Reset Button */}
                    {(searchQuery || tradeFilter !== 'all' || selectedSupplierFilter !== 'all' || selectedSupervisorFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setTradeFilter('all');
                          setSelectedSupplierFilter('all');
                          setSelectedSupervisorFilter('all');
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                        type="button"
                        title="Reset all filters"
                      >
                        <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* ======================================================== */}
                {/* 3. VIEW MODE SWITCHER & COMPLIANCE LEGEND (BELOW SEARCH)  */}
                {/* ======================================================== */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                  {/* View Mode Switcher on Left below Search Bar */}
                  <div className="inline-flex rounded-xl border border-outline-variant/50 p-1 bg-surface-container-low shadow-inner">
                    <button
                      onClick={() => setTimesheetViewMode('matrix')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        timesheetViewMode === 'matrix'
                          ? 'bg-[#131943] text-white shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">grid_view</span>
                      <span>Monthly Approvals Matrix</span>
                    </button>
                    <button
                      onClick={() => setTimesheetViewMode('daily')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        timesheetViewMode === 'daily'
                          ? 'bg-[#131943] text-white shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>Daily Shift Roster (In/Out)</span>
                    </button>
                  </div>

                  {/* Compliance Legend */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant shrink-0">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      <span>Regular Hours</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                      <span>Overtime (1.5x)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                      <span>Mol Cap Alert (&gt;12h/day)</span>
                    </span>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* 5A. VIEW 1: MONTHLY APPROVALS MATRIX TABLE (31 DAYS)      */}
                {/* ======================================================== */}
                {timesheetViewMode === 'matrix' && (
                  <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden flex flex-col">
                    {/* Monthly Timesheet Horizontal Slider & Navigation Toolbar */}
                    <div className="px-4 py-2.5 bg-surface-container-low/75 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[18px]">calendar_view_month</span>
                        <span className="font-extrabold text-on-surface">Monthly Timesheet:</span>
                        <span className="text-on-surface-variant font-medium">October 2026 (Days 01 – 31)</span>
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-secondary/10 text-secondary font-bold px-2 py-0.5 rounded-full ml-1">
                          <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                          Scroll or Slide Left / Right
                        </span>
                      </div>
                    </div>

                    {/* Scrollable Container with sticky pinned columns */}
                    <div className="overflow-x-auto relative" ref={matrixScrollRef}>
                      <table className="text-left text-xs border-collapse min-w-max">
                        <thead>
                          <tr className="bg-[#f1f4f9] border-b border-outline-variant/40 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                            {/* Pinned Left 1: Selection Column Header (Checkbox removed) */}
                            <th className="sticky left-0 z-30 bg-[#f1f4f9] py-3 px-3 text-center w-[44px] min-w-[44px] max-w-[44px]"></th>

                            {/* Pinned Left 2: Worker Code & Name */}
                            <th className="sticky left-[44px] z-30 bg-[#f1f4f9] py-3 px-3 font-extrabold text-[11px] text-on-surface-variant uppercase tracking-wider w-[220px] min-w-[220px] max-w-[220px]">
                              WORKER CODE &amp; NAME
                            </th>

                            {/* Pinned Left 3: Trade & Supervisor */}
                            <th className="sticky left-[264px] z-30 bg-[#f1f4f9] py-3 px-3 font-extrabold text-[11px] text-on-surface-variant uppercase tracking-wider w-[180px] min-w-[180px] max-w-[180px] border-r border-outline-variant/60 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                              TRADE &amp; SUPERVISOR
                            </th>

                            {/* Scrollable Middle 31 Days Header */}
                            {monthDays.map((day) => {
                              const isToday = day.dayNum === currentDayNum;
                              const isFuture = day.dayNum > currentDayNum;

                              return (
                                <th
                                  key={day.key}
                                  className={`py-2 px-1 text-center uppercase tracking-wider w-[52px] min-w-[52px] max-w-[52px] transition-colors ${
                                    isToday
                                      ? 'bg-secondary/10 text-secondary font-black'
                                      : isFuture
                                      ? 'bg-surface-container-low/40 text-on-surface-variant/40 font-normal'
                                      : day.isRest
                                      ? 'bg-surface-container-low/70 text-on-surface-variant/60 font-bold'
                                      : 'text-on-surface-variant font-extrabold'
                                  }`}
                                >
                                  <div className="flex flex-col items-center justify-center">
                                    {isToday && (
                                      <span className="text-[7.5px] leading-none bg-secondary text-white font-black px-1 py-0.5 rounded-sm mb-0.5 uppercase tracking-wider shadow-2xs">
                                        TODAY
                                      </span>
                                    )}
                                    <span className={`block text-[11px] leading-tight ${isToday ? 'font-black text-secondary' : 'font-extrabold'}`}>
                                      {day.dayName}
                                    </span>
                                    <span className={`block text-[10px] leading-tight ${isToday ? 'font-black text-secondary' : 'text-on-surface-variant/75 font-normal'}`}>
                                      {day.dateStr}
                                    </span>
                                    {isFuture && (
                                      <span className="material-symbols-outlined text-[11px] text-on-surface-variant/35 mt-0.5" title={`Oct ${day.dateStr}: Future Date (Locked)`}>
                                        lock
                                      </span>
                                    )}
                                  </div>
                                </th>
                              );
                            })}

                            {/* Pinned Right 1: REG */}
                            <th className="sticky right-[375px] z-30 bg-[#f1f4f9] py-3 px-1 text-center font-extrabold text-[11px] text-blue-700 uppercase tracking-wider w-[54px] min-w-[54px] max-w-[54px] border-l border-outline-variant/60 shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                              REG<br />
                              <span className="text-[10px] font-normal">(H)</span>
                            </th>

                            {/* Pinned Right 2: OT */}
                            <th className="sticky right-[321px] z-30 bg-[#f1f4f9] py-3 px-1 text-center font-extrabold text-[11px] text-purple-700 uppercase tracking-wider w-[54px] min-w-[54px] max-w-[54px]">
                              OT<br />
                              <span className="text-[10px] font-normal">(1.5X)</span>
                            </th>

                            {/* Pinned Right 3: BILLABLE */}
                            <th className="sticky right-[246px] z-30 bg-[#f1f4f9] py-3 px-2 text-right font-extrabold text-[11px] text-on-surface uppercase tracking-wider w-[75px] min-w-[75px] max-w-[75px]">
                              BILLABLE
                            </th>

                            {/* Pinned Right 4: TOTAL PAY */}
                            <th className="sticky right-[116px] z-30 bg-[#f1f4f9] py-3 px-3 text-right font-extrabold text-[11px] text-emerald-700 uppercase tracking-wider w-[130px] min-w-[130px] max-w-[130px]">
                              TOTAL PAY<br />
                              <span className="text-[10px] font-normal text-on-surface-variant">(SAR)</span>
                            </th>

                            {/* Pinned Right 5: ACTION (Accept / Reject) */}
                            <th className="sticky right-0 z-30 bg-[#f1f4f9] py-3 px-2 text-center font-extrabold text-[11px] text-on-surface-variant uppercase tracking-wider w-[116px] min-w-[116px] max-w-[116px]">
                              ACTION
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/30">
                          {filteredWeeklyWorkers.map((worker) => {
                            const isSelected = selectedWeeklyWorkerIds.includes(worker.id);
                            const totals = calculateWeeklyWorkerTotals(worker);

                            // 100% solid, fully opaque background for sticky cells (strictly prevents underlying scrolled dates from shining through)
                            const stickyCellBg = isSelected
                              ? 'bg-[#eff6ff] group-hover:bg-[#e4efff]'
                              : worker.status === 'Flagged'
                              ? 'bg-[#fff1f2] group-hover:bg-[#ffe4e6]'
                              : 'bg-white group-hover:bg-[#f8fafc]';

                            return (
                              <tr
                                key={worker.id}
                                className={`group transition-colors ${
                                  isSelected ? 'bg-[#eff6ff]' : worker.status === 'Flagged' ? 'bg-[#fff1f2]' : 'hover:bg-[#f8fafc]'
                                }`}
                              >
                                {/* Pinned Left 1: Checkbox */}
                                <td className={`sticky left-0 z-20 py-3 px-3 text-center w-[44px] min-w-[44px] max-w-[44px] ${stickyCellBg} transition-colors`}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelectWeeklyWorker(worker.id)}
                                    className="rounded cursor-pointer text-secondary focus:ring-secondary"
                                  />
                                </td>

                                {/* Pinned Left 2: Worker Code & Name */}
                                <td className={`sticky left-[44px] z-20 py-3 px-3 w-[220px] min-w-[220px] max-w-[220px] ${stickyCellBg} transition-colors`}>
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                      {worker.initials}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <div className="flex items-center gap-1.5 truncate">
                                        <span className="font-extrabold text-on-surface text-xs leading-tight truncate">
                                          {worker.id} {worker.name}
                                        </span>
                                      </div>
                                      <span className="font-mono text-[10px] text-on-surface-variant truncate">
                                        Iqama: {worker.iqamaNo} • {worker.country}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* Pinned Left 3: Trade & Supervisor */}
                                <td className={`sticky left-[264px] z-20 py-3 px-3 w-[180px] min-w-[180px] max-w-[180px] border-r border-outline-variant/60 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] ${stickyCellBg} transition-colors`}>
                                  <div className="flex flex-col truncate">
                                    <span className="font-bold text-on-surface text-xs truncate">{worker.trade}</span>
                                    <span className="text-[10px] text-on-surface-variant font-medium truncate">
                                      Sup: {worker.supervisor}
                                    </span>
                                  </div>
                                </td>

                                {/* Scrollable Middle 31 Days Columns - Real Date Enforcement */}
                                {monthDays.map((day) => {
                                  const dayKey = day.key;
                                  const val = worker.days[dayKey];
                                  const num = typeof val === 'number' ? val : parseFloat(val);
                                  const isRest = val === 'REST';
                                  const isToday = day.dayNum === currentDayNum;
                                  const isFuture = day.dayNum > currentDayNum;

                                  return (
                                    <td
                                      key={dayKey}
                                      className="py-2 px-1 text-center w-[52px] min-w-[52px] max-w-[52px]"
                                    >
                                      <div className="relative flex items-center justify-center">
                                        <input
                                          type="text"
                                          disabled={isFuture}
                                          value={isFuture ? '' : isRest ? 'REST' : val ?? ''}
                                          onChange={(e) => handleDayHourChange(worker.id, dayKey, e.target.value)}
                                          onBlur={() => handleDayHourBlur(worker.id, dayKey)}
                                          onFocus={(e) => e.target.select()}
                                          placeholder={isFuture ? '—' : ''}
                                          className={`w-12 h-7 text-center rounded-lg font-mono text-xs font-bold transition-all ${
                                            isFuture
                                              ? 'bg-surface-container-low/30 border border-dashed border-outline-variant/30 text-on-surface-variant/25 cursor-not-allowed placeholder-on-surface-variant/20 select-none shadow-none'
                                              : isToday
                                              ? 'bg-secondary/[0.08] hover:bg-secondary/[0.14] border border-transparent hover:border-outline-variant/40 text-on-surface font-black focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/40 shadow-2xs cursor-text'
                                              : isRest
                                              ? 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant/70 border border-outline-variant/40 hover:border-outline-variant text-[10px] focus:bg-white focus:text-on-surface cursor-text'
                                              : !isNaN(num) && num > 16.0
                                              ? 'bg-rose-100 text-rose-800 border border-rose-300 font-black focus:bg-white focus:border-rose-500 shadow-2xs cursor-text'
                                              : !isNaN(num) && num > 12.0
                                              ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold focus:bg-white focus:border-amber-500 shadow-2xs cursor-text'
                                              : 'bg-transparent hover:bg-surface-container-low border border-transparent hover:border-outline-variant/40 text-on-surface focus:bg-white focus:border-secondary shadow-2xs cursor-text'
                                          }`}
                                          title={
                                            isFuture
                                              ? `Day ${day.dayNum} (Oct ${day.dateStr}): Future Date • Locked until day arrives`
                                              : isToday
                                              ? `Day ${day.dayNum} (TODAY): Open for shift entry • Current: ${val ?? 0}h`
                                              : isRest
                                              ? `Day ${day.dayNum} (${day.dayName}): REST day (Type hours like 8.0 to mark working)`
                                              : `Day ${day.dayNum} (${day.dayName} ${day.dateStr}): ${val ?? 0}h`
                                          }
                                        />
                                        {isFuture && (
                                          <span className="material-symbols-outlined text-[10px] text-on-surface-variant/30 absolute right-1 pointer-events-none">
                                            lock
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}

                                {/* Pinned Right 1: Regular Hours (REG) */}
                                <td className={`sticky right-[375px] z-20 py-2 px-1 text-center w-[54px] min-w-[54px] max-w-[54px] border-l border-outline-variant/60 shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.08)] ${stickyCellBg} transition-colors`}>
                                  <input
                                    type="text"
                                    value={worker.manualReg !== undefined ? worker.manualReg : totals.regHours.toFixed(1)}
                                    onChange={(e) => handleRegHourChange(worker.id, e.target.value)}
                                    onBlur={() => handleRegHourBlur(worker.id)}
                                    onFocus={(e) => e.target.select()}
                                    className="w-12 h-7 text-center rounded-lg font-mono text-xs font-bold text-blue-700 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-text select-all transition-all shadow-2xs"
                                    title="Edit Regular Hours (REG)"
                                  />
                                </td>

                                {/* Pinned Right 2: Overtime (OT 1.5x) */}
                                <td className={`sticky right-[321px] z-20 py-2 px-1 text-center w-[54px] min-w-[54px] max-w-[54px] ${stickyCellBg} transition-colors`}>
                                  <input
                                    type="text"
                                    value={worker.manualOt !== undefined ? worker.manualOt : totals.otHours.toFixed(1)}
                                    onChange={(e) => handleOtHourChange(worker.id, e.target.value)}
                                    onBlur={() => handleOtHourBlur(worker.id)}
                                    onFocus={(e) => e.target.select()}
                                    className="w-12 h-7 text-center rounded-lg font-mono text-xs font-bold text-purple-700 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-text select-all transition-all shadow-2xs"
                                    title="Edit Overtime Hours (OT 1.5x)"
                                  />
                                </td>

                                {/* Pinned Right 3: Billable Hours */}
                                <td className={`sticky right-[246px] z-20 py-3 px-2 text-right w-[75px] min-w-[75px] max-w-[75px] ${stickyCellBg} transition-colors`}>
                                  <span className="font-mono font-extrabold text-xs text-on-surface">
                                    {totals.billableHours.toFixed(1)}
                                  </span>
                                </td>

                                {/* Pinned Right 4: Total Pay (SAR) */}
                                <td className={`sticky right-[116px] z-20 py-3 px-3 text-right w-[130px] min-w-[130px] max-w-[130px] ${stickyCellBg} transition-colors`}>
                                  <div className="flex flex-col items-end">
                                    <span className="font-mono font-extrabold text-xs text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/25">
                                      SAR {totals.totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-[10px] text-on-surface-variant/80 font-mono mt-0.5">
                                      @ SAR {worker.hourlyRate.toFixed(2)}/h
                                    </span>
                                  </div>
                                </td>

                                {/* Pinned Right 5: Accept / Reject Actions */}
                                <td className={`sticky right-0 z-20 py-3 px-2 text-center w-[116px] min-w-[116px] max-w-[116px] ${stickyCellBg} transition-colors`}>
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => handleApproveWeeklyWorker(worker.id)}
                                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                        worker.status === 'Approved'
                                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 border-emerald-500/30'
                                      }`}
                                      title="Accept / Approve Timesheet"
                                      type="button"
                                    >
                                      <span className="material-symbols-outlined text-[15px]">check</span>
                                    </button>

                                    <button
                                      onClick={() => handleRejectWeeklyWorker(worker.id)}
                                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                        worker.status === 'Flagged'
                                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                          : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 border-rose-500/30'
                                      }`}
                                      title="Reject / Flag Timesheet"
                                      type="button"
                                    >
                                      <span className="material-symbols-outlined text-[15px]">close</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setShowRemarkModal(worker);
                                        setRemarkText(worker.remarks || '');
                                      }}
                                      className="w-7 h-7 rounded-lg border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-all cursor-pointer"
                                      title="Supervisor Audio / Text Note"
                                      type="button"
                                    >
                                      <span className="material-symbols-outlined text-[15px]">mic</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Matrix Table Footer */}
                    <div className="bg-surface-container-low/90 px-5 py-3.5 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-on-surface-variant font-medium">
                          Showing <strong className="text-on-surface font-bold">1 to {filteredWeeklyWorkers.length}</strong> of{' '}
                          <strong>182</strong> total monthly timesheet records
                        </span>
                        <div className="hidden md:flex items-center gap-3 pl-3 border-l border-outline-variant/50">
                          <span className="text-on-surface-variant font-semibold">
                            Total Billable: <strong className="text-on-surface font-mono font-bold">{totalWeeklyBillable.toFixed(2)}h</strong>
                          </span>
                          <span className="text-on-surface-variant font-semibold">
                            Total Pay:
                          </span>
                          <span className="font-mono font-extrabold text-xs text-emerald-700 bg-emerald-500/15 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                            SAR {totalWeeklyLaborPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                          <span>Rows per page:</span>
                          <select className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-2 py-0.5 font-bold text-on-surface cursor-pointer">
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                          </select>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center gap-1">
                          <button className="w-7 h-7 rounded-lg border border-outline-variant/40 bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer">
                            <span className="material-symbols-outlined text-[15px]">chevron_left</span>
                          </button>
                          <button className="w-7 h-7 rounded-lg bg-[#183182] text-white font-bold flex items-center justify-center cursor-pointer shadow-xs">
                            1
                          </button>
                          <button className="w-7 h-7 rounded-lg border border-outline-variant/40 bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer">
                            2
                          </button>
                          <button className="w-7 h-7 rounded-lg border border-outline-variant/40 bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer">
                            3
                          </button>
                          <button className="w-7 h-7 rounded-lg border border-outline-variant/40 bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer">
                            <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 5B. VIEW 2: DAILY SHIFT ROSTER (CHECK-IN & CHECK-OUT)    */}
                {/* ======================================================== */}
                {timesheetViewMode === 'daily' && (
                  <div className="flex flex-col space-y-4">
                    {/* Batch Actions Bar for Daily Muster */}
                    <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[15px]">bolt</span>
                        </div>
                        <span className="text-xs font-bold text-on-surface">Daily Shift Quick Actions:</span>
                        <span className="text-[11px] text-on-surface-variant hidden md:inline">
                          Morning Roll Call &amp; Evening Checkout controls
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={handleCheckInAllScheduled}
                          className="h-9 px-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          type="button"
                          title="Check in all scheduled workers at 07:00 AM (Morning Muster)"
                        >
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">login</span>
                          <span>Check-In All (07:00 AM)</span>
                        </button>
                        <button
                          onClick={handleCheckOutAllStandard}
                          className="h-9 px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          type="button"
                          title="Check out active crew at 15:30 PM (Standard 8.0h shift)"
                        >
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">logout</span>
                          <span>Check-Out All (15:30 PM • 8h)</span>
                        </button>
                        <button
                          onClick={() => handleCheckOutAllOvertime('17:30 PM')}
                          className="h-9 px-3.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          type="button"
                          title="Check out active crew with +2.0h overtime at 17:30 PM"
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">more_time</span>
                          <span>Check-Out All (+2h OT)</span>
                        </button>
                        <button
                          onClick={handleVerifyAll}
                          className="h-9 px-3.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 border border-blue-500/30 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          type="button"
                          title="Certify all entries with Coordinator signature stamp"
                        >
                          <span className="material-symbols-outlined text-[16px] text-blue-600">verified</span>
                          <span>Certify All</span>
                        </button>
                      </div>
                    </div>

                    {/* Daily Shift Table */}
                    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-surface-container-low/75 border-b border-outline-variant/40 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                              <th className="py-3 px-3.5">Worker &amp; ID</th>
                              <th className="py-3 px-3">Trade &amp; Supplier</th>
                              <th className="py-3 px-3">Zone &amp; Work Package</th>
                              <th className="py-3 px-3 text-center">Attendance</th>
                              <th className="py-3 px-3 text-center min-w-[210px]">Time In / Out &amp; Actions</th>
                              <th className="py-3 px-2 text-center">Base (h)</th>
                              <th className="py-3 px-2 text-center">Overtime (h)</th>
                              <th className="py-3 px-2 text-center">Allowances</th>
                              <th className="py-3 px-2 text-center">Total (h)</th>
                              <th className="py-3 px-3 text-right">Daily Pay (SAR)</th>
                              <th className="py-3 px-3.5 text-right">Status &amp; Sign</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/30">
                            {filteredWorkers.map((worker) => {
                              const totalWorkerHours = (worker.regHours + worker.otHours).toFixed(1);
                              const dailyPay = calculateWorkerDailyPay(worker);
                              const isAbsent = worker.attendance === 'Absent';
                              const isPendingIn = !isAbsent && worker.timeIn === '--:--';
                              const isOnSite = !isAbsent && worker.timeIn !== '--:--' && worker.timeOut === '--:--';
                              const isCompleted = !isAbsent && worker.timeIn !== '--:--' && worker.timeOut !== '--:--';

                              return (
                                <tr
                                  key={worker.id}
                                  className={`hover:bg-surface-container-low/40 transition-colors ${
                                    isAbsent ? 'bg-rose-500/[0.03]' : ''
                                  }`}
                                >
                                  {/* Worker Info */}
                                  <td className="py-3.5 px-3.5">
                                    <div className="flex items-center gap-2.5">
                                      {worker.photo ? (
                                        <img
                                          src={worker.photo}
                                          alt={worker.name}
                                          className="w-9 h-9 rounded-full object-cover border border-outline-variant/40 shadow-xs shrink-0"
                                        />
                                      ) : (
                                        <div className="w-9 h-9 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                                          {worker.initials}
                                        </div>
                                      )}
                                      <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-bold text-on-surface text-xs leading-tight">{worker.name}</span>
                                          {worker.verified && (
                                            <span
                                              className="material-symbols-outlined text-emerald-500 text-[14px]"
                                              title="Physically Verified on Site"
                                            >
                                              verified
                                            </span>
                                          )}
                                        </div>
                                        <span className="font-mono text-[10px] text-on-surface-variant">
                                          {worker.id} • Iqama: {worker.iqamaNo}
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Trade & Supplier */}
                                  <td className="py-3.5 px-3">
                                    <div className="flex flex-col">
                                      <span className="font-bold text-on-surface text-xs">{worker.trade}</span>
                                      <span className="text-[10px] text-on-surface-variant font-medium">{worker.subTrade}</span>
                                      <span className="text-[10px] text-secondary font-semibold">{worker.supplier}</span>
                                    </div>
                                  </td>

                                  {/* Zone & Work Package */}
                                  <td className="py-3.5 px-3 max-w-[210px]">
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center justify-between gap-1 bg-surface-container-low px-2 py-0.5 rounded-lg border border-outline-variant/30">
                                        <span className="text-[10.5px] font-bold text-on-surface truncate">
                                          {worker.zone.split(':')[0]}
                                        </span>
                                        <button
                                          onClick={() => setShowReassignModal(worker)}
                                          className="p-0.5 text-on-surface-variant hover:text-secondary cursor-pointer"
                                          title="Reassign Zone"
                                          type="button"
                                        >
                                          <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                                        </button>
                                      </div>
                                      <span
                                        className="text-[10px] text-on-surface-variant line-clamp-1 italic font-medium"
                                        title={worker.workPackage}
                                      >
                                        Task: {worker.workPackage}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Shift Attendance Selector */}
                                  <td className="py-3.5 px-3 text-center">
                                    <div className="inline-flex rounded-xl border border-outline-variant/50 p-0.5 bg-surface-container-low shadow-inner">
                                      {['Present', 'Late', 'Half-Day', 'Absent'].map((stat) => (
                                        <button
                                          key={stat}
                                          onClick={() => updateWorkerAttendance(worker.id, stat)}
                                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                            worker.attendance === stat
                                              ? stat === 'Present'
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : stat === 'Late'
                                                ? 'bg-amber-600 text-white shadow-xs'
                                                : stat === 'Half-Day'
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-rose-600 text-white shadow-xs'
                                              : 'text-on-surface-variant hover:text-on-surface'
                                          }`}
                                          type="button"
                                        >
                                          {stat}
                                        </button>
                                      ))}
                                    </div>
                                  </td>

                                  {/* Separate Check-In / Check-Out Actions */}
                                  <td className="py-3.5 px-3 text-center">
                                    {isAbsent ? (
                                      <span className="text-[11px] font-bold text-rose-500/80 italic">Absent / Off Duty</span>
                                    ) : isPendingIn ? (
                                      <button
                                        onClick={() => handleCheckInWorker(worker.id, '07:00 AM')}
                                        className="h-8 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                                        type="button"
                                        title="Mark morning check-in at 07:00 AM"
                                      >
                                        <span className="material-symbols-outlined text-[15px] text-emerald-600">login</span>
                                        <span>Check-In (07:00 AM)</span>
                                      </button>
                                    ) : isOnSite ? (
                                      <div className="flex items-center justify-center gap-2">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800">
                                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                          <span className="text-[11px] font-mono font-bold">In: {worker.timeIn}</span>
                                        </div>
                                        <button
                                          onClick={() => handleCheckOutWorker(worker.id, '15:30 PM')}
                                          className="h-8 px-3 rounded-xl bg-secondary/15 hover:bg-secondary/25 text-secondary border border-secondary/35 text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                                          type="button"
                                          title="Mark shift checkout at standard 15:30 PM (auto-calculates hours & daily pay)"
                                        >
                                          <span className="material-symbols-outlined text-[15px]">logout</span>
                                          <span>Check-Out</span>
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center gap-1.5">
                                        <div className="inline-flex items-center justify-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-xl border border-outline-variant/30 shadow-inner">
                                          <input
                                            type="text"
                                            value={worker.timeIn}
                                            onChange={(e) => handleUpdateTimeIn(worker.id, e.target.value)}
                                            className="w-16 text-center font-mono text-[11px] font-bold bg-transparent text-on-surface focus:outline-none"
                                            title="Arrival Time (In)"
                                          />
                                          <span className="text-on-surface-variant text-[11px] font-bold">→</span>
                                          <input
                                            type="text"
                                            value={worker.timeOut}
                                            onChange={(e) => handleUpdateTimeOut(worker.id, e.target.value)}
                                            className="w-16 text-center font-mono text-[11px] font-bold bg-transparent text-on-surface focus:outline-none"
                                            title="Departure Time (Out)"
                                          />
                                        </div>
                                        <button
                                          onClick={() => handleResetCheckout(worker.id)}
                                          className="p-1 rounded-lg text-on-surface-variant hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                          type="button"
                                          title="Reset checkout (return to active on-site status)"
                                        >
                                          <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                                        </button>
                                      </div>
                                    )}
                                  </td>

                                  {/* Base Regular Hours */}
                                  <td className="py-3.5 px-2 text-center">
                                    <input
                                      type="number"
                                      step="0.25"
                                      min="0"
                                      max="12"
                                      disabled={isAbsent}
                                      value={worker.regHours}
                                      onChange={(e) => updateHours(worker.id, 'regHours', e.target.value)}
                                      className="w-14 text-center font-mono font-bold bg-surface-container-low border border-outline-variant/40 rounded-xl py-1 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-30"
                                    />
                                  </td>

                                  {/* Overtime Hours */}
                                  <td className="py-3.5 px-2 text-center">
                                    <input
                                      type="number"
                                      step="0.5"
                                      min="0"
                                      max="8"
                                      disabled={isAbsent}
                                      value={worker.otHours}
                                      onChange={(e) => updateHours(worker.id, 'otHours', e.target.value)}
                                      className={`w-14 text-center font-mono font-bold border rounded-xl py-1 text-xs focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-30 ${
                                        worker.otHours > 0
                                          ? 'bg-secondary/10 border-secondary/50 text-secondary'
                                          : 'bg-surface-container-low border-outline-variant/40 text-on-surface'
                                      }`}
                                    />
                                  </td>

                                  {/* Allowances */}
                                  <td className="py-3.5 px-2 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <label
                                        className="flex items-center gap-1 cursor-pointer select-none"
                                        title="Night Differential (+15% Rate)"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={worker.nightDiff}
                                          disabled={isAbsent}
                                          onChange={() => toggleDifferential(worker.id, 'nightDiff')}
                                          className="rounded text-secondary focus:ring-secondary cursor-pointer disabled:opacity-30"
                                        />
                                        <span className="text-[10px] font-mono text-on-surface-variant font-medium">Night</span>
                                      </label>
                                      <label
                                        className="flex items-center gap-1 cursor-pointer select-none"
                                        title="Hazard / High-Elevation Allowance (+20% Rate)"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={worker.hazardPay}
                                          disabled={isAbsent}
                                          onChange={() => toggleDifferential(worker.id, 'hazardPay')}
                                          className="rounded text-secondary focus:ring-secondary cursor-pointer disabled:opacity-30"
                                        />
                                        <span className="text-[10px] font-mono text-on-surface-variant font-medium">Hazard</span>
                                      </label>
                                    </div>
                                  </td>

                                  {/* Total Calculated Hours */}
                                  <td className="py-3.5 px-2 text-center">
                                    <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-xl border ${
                                      totalWorkerHours > 8.0
                                        ? 'bg-secondary/10 border-secondary/30 text-secondary'
                                        : 'bg-surface-container-low border-outline-variant/30 text-on-surface'
                                    }`}>
                                      {totalWorkerHours}h
                                    </span>
                                  </td>

                                  {/* Daily Pay (SAR) Auto-Calculated */}
                                  <td className="py-3.5 px-3 text-right">
                                    <div className="flex flex-col items-end">
                                      <div className={`font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-lg border ${
                                        dailyPay > 0
                                          ? 'text-emerald-700 bg-emerald-500/15 border-emerald-500/30'
                                          : 'text-on-surface-variant/60 bg-surface-container-low border-outline-variant/30'
                                      }`}>
                                        SAR {dailyPay.toFixed(2)}
                                      </div>
                                      <span className="text-[9.5px] text-on-surface-variant font-mono mt-0.5">
                                        SAR {worker.hourlyRate.toFixed(2)}/hr • OT 1.5x
                                      </span>
                                    </div>
                                  </td>

                                  {/* Status Badge & Actions */}
                                  <td className="py-3.5 px-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {isAbsent ? (
                                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                                          Absent
                                        </span>
                                      ) : isOnSite ? (
                                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/25 flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                          On Site
                                        </span>
                                      ) : isCompleted ? (
                                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-blue-500/10 text-blue-700 border border-blue-500/20">
                                          Completed
                                        </span>
                                      ) : (
                                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-surface-container-low text-on-surface-variant border border-outline-variant/30">
                                          Pending In
                                        </span>
                                      )}

                                      <button
                                        onClick={() => toggleWorkerVerification(worker.id)}
                                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                                          worker.verified
                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                            : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:text-emerald-600'
                                        }`}
                                        title={worker.verified ? 'Physically Verified by Coordinator' : 'Mark Verified'}
                                        type="button"
                                      >
                                        <span className="material-symbols-outlined text-[16px]">
                                          {worker.verified ? 'verified' : 'check'}
                                        </span>
                                      </button>

                                      <button
                                        onClick={() => {
                                          setShowRemarkModal(worker);
                                          setRemarkText(worker.remarks || '');
                                        }}
                                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                                          worker.remarks
                                            ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                                            : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:text-secondary'
                                        }`}
                                        title={worker.remarks ? `Remark: ${worker.remarks}` : 'Add Coordinator Remark'}
                                        type="button"
                                      >
                                        <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Daily Table Footer */}
                      <div className="bg-surface-container-low/90 px-5 py-3.5 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-on-surface-variant font-medium">
                            Showing <strong className="text-on-surface font-bold">{filteredWorkers.length}</strong> of{' '}
                            <strong>{workers.length}</strong> crew on Shift 1 roster
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-5">
                          <span>
                            Total Base Hours: <strong className="text-on-surface font-mono font-bold">{totalBaseHours.toFixed(1)}h</strong>
                          </span>
                          <span>
                            Total Overtime: <strong className="text-secondary font-mono font-bold">{totalOvertimeHours.toFixed(1)}h</strong>
                          </span>
                          <span>
                            Total Shift Hours:{' '}
                            <strong className="text-on-surface font-mono font-bold">
                              {(totalBaseHours + totalOvertimeHours).toFixed(1)}h
                            </strong>
                          </span>
                          <div className="pl-3 border-l border-outline-variant/40 flex items-center gap-2">
                            <span className="text-on-surface-variant font-semibold">Total Shift Pay:</span>
                            <span className="font-mono font-extrabold text-xs sm:text-sm text-emerald-700 bg-emerald-500/15 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                              SAR {totalShiftLaborCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* SUB-VIEW 2: DAILY SHIFT MUSTER & ROLL CALL (Physical Headcount) */}
            {/* ======================================================== */}
            {activeTab === 'muster' && (
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Daily Physical Shift Muster &amp; Roll Call</h2>
                    <p className="text-xs text-on-surface-variant">
                      Morning field assembly roll call conducted by Site Coordinator &amp; Gang Bosses. Check off workers physically present.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowMusterCsvModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 hover:bg-surface-container text-xs font-bold text-on-surface transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">upload_file</span>
                      <span>Import CSV</span>
                    </button>
                    <button
                      onClick={() => {
                        if (musterSubmitted) {
                          showToast('Muster is sealed. Reopen muster first to adjust check-offs.');
                          return;
                        }
                        setWorkers((prev) => prev.map((w) => ({ ...w, rollCallChecked: true })));
                        showToast('All workers checked on morning roll call roll');
                      }}
                      disabled={musterSubmitted}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-bold text-on-surface ${
                        musterSubmitted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">select_all</span>
                      <span>Check-Off All</span>
                    </button>
                    <button
                      onClick={() => showToast('Muster Headcount sheet exported for Project Manager inspection')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-secondary text-white text-xs font-bold shadow-xs hover:brightness-110"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">print</span>
                      <span>Print Muster Sheet</span>
                    </button>
                  </div>
                </div>

                {/* Sealed Muster Alert Banner (When Submitted) */}
                {musterSubmitted && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-[24px]">verified</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-emerald-950">
                            Morning Muster Sealed &amp; Certified
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                            {musterSealInfo.auditId}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Certified by <strong>{musterSealInfo.certifiedBy}</strong> • {musterSealInfo.timestamp} •{' '}
                          <strong className="text-emerald-950">{musterSealInfo.checkedCount} Present</strong>,{' '}
                          <span className="text-rose-700 font-semibold">{musterSealInfo.absentCount} Absent</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleReopenMusterRollCall}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container text-xs font-bold text-on-surface shadow-xs transition-colors shrink-0"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">lock_open</span>
                      <span>Reopen / Edit Muster</span>
                    </button>
                  </div>
                )}

                {/* Trade-by-Trade Muster Roll Call Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { trade: 'Structural Steel', count: 30, checked: 30, lead: 'Mateo Hernandez (Lead)', status: '100% Present' },
                    { trade: 'MEP Systems', count: 28, checked: 28, lead: 'Soraya Chen (Foreman)', status: '100% Present' },
                    { trade: 'Heavy Rigging', count: 24, checked: 24, lead: 'Elena Rostova (Rigger)', status: '100% Present' },
                    { trade: 'Civil Framing', count: 20, checked: 19, lead: 'Kwame Mensah (Lead)', status: '1 Late Arrival' },
                    { trade: 'Concrete & Earthworks', count: 20, checked: 19, lead: 'Ahmed Farooq (Foreman)', status: '1 Absent (Replacement Standby)' },
                    { trade: 'HSE Safety & Traffic', count: 17, checked: 17, lead: 'Tariq Lin (Marshall)', status: '100% Present' },
                  ].map((tr, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/60 shadow-xs flex flex-col justify-between space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface">{tr.trade}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            tr.status.includes('100%')
                              ? 'bg-emerald-500/10 text-emerald-700'
                              : 'bg-amber-500/10 text-amber-700'
                          }`}
                        >
                          {tr.status}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <div className="text-lg font-bold font-mono text-on-surface">
                          {tr.checked} / {tr.count}{' '}
                          <span className="text-xs text-on-surface-variant font-normal">checked</span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant">{tr.lead}</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(tr.checked / tr.count) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Individual Worker Physical Roll Call Checklist */}
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-xs overflow-hidden">
                  <div className="p-3.5 bg-surface-container-low/70 border-b border-outline-variant/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                        Physical Roll Call Checklist (Morning Shift 1)
                      </span>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {musterSubmitted
                          ? 'Muster checklist is locked. Click "Reopen / Edit Muster" above if adjustments are required.'
                          : 'Check box when worker answers roll call in person, or import attendance via CSV.'}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-on-surface bg-surface-container px-2.5 py-1 rounded-lg">
                      {workers.filter((w) => w.rollCallChecked).length} / {workers.length} Present
                    </span>
                  </div>

                  <div className="divide-y divide-outline-variant/30">
                    {workers.map((worker) => (
                      <div
                        key={worker.id}
                        className={`p-3 flex items-center justify-between gap-3 hover:bg-surface-container-low/30 transition-colors ${
                          !worker.rollCallChecked ? 'bg-rose-500/[0.03]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={worker.rollCallChecked}
                            onChange={() => !musterSubmitted && toggleRollCallCheck(worker.id)}
                            disabled={musterSubmitted}
                            className={`h-4 w-4 rounded text-secondary focus:ring-secondary ${
                              musterSubmitted ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                            }`}
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-on-surface">{worker.name}</span>
                              <span className="text-[10.5px] font-mono text-on-surface-variant">({worker.id})</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-low font-semibold text-on-surface-variant">
                                {worker.trade}
                              </span>
                            </div>
                            <span className="text-[11px] text-on-surface-variant">
                              Assigned: {worker.workPackage} • Zone: {worker.zone.split(':')[0]}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${
                              worker.rollCallChecked
                                ? 'bg-emerald-500/10 text-emerald-700'
                                : 'bg-rose-500/10 text-rose-700'
                            }`}
                          >
                            {worker.rollCallChecked ? `Present (In: ${worker.timeIn})` : 'Unchecked / Absent'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checklist Bottom Submission & Summary Bar */}
                  <div className="p-4 bg-surface-container-low/80 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-on-surface-variant">
                        Total Roster: <strong className="text-on-surface">{workers.length}</strong>
                      </span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Verified Present:{' '}
                        <strong>{workers.filter((w) => w.rollCallChecked).length}</strong>
                      </span>
                      <span className="text-rose-700 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Absent:{' '}
                        <strong>{workers.filter((w) => !w.rollCallChecked).length}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {musterSubmitted ? (
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold">
                          <span className="material-symbols-outlined text-[16px]">lock</span>
                          <span>Muster Sealed &amp; Synced with Active Timesheet</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleSubmitMusterRollCall}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[17px]">verified</span>
                          <span>Submit &amp; Seal Morning Muster</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SUB-VIEW 3: LIVE CREW DEPLOYMENT BOARD (Work Zones)       */}
            {/* ======================================================== */}
            {activeTab === 'deployment' && (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Terminal 4 Work Zone Allocations</h2>
                    <p className="text-xs text-on-surface-variant">
                      Manual gang assignments, radio channels, and live headcount deployed vs planned capacity.
                    </p>
                  </div>
                  <button
                    onClick={() => showToast('Synced zone allocations with shift foremen')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 hover:bg-surface-container text-xs font-bold text-on-surface transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">refresh</span>
                    <span>Sync Radios &amp; Headcounts</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-xs flex flex-col justify-between space-y-3 hover:border-secondary/50 transition-all"
                    >
                      <div>
                        {/* Zone Header */}
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-on-surface leading-snug">{zone.title}</span>
                          <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-bold font-mono shrink-0">
                            {zone.channel}
                          </span>
                        </div>

                        {/* Supervisor & Heat Alert */}
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-on-surface-variant">
                            Lead: <strong className="text-on-surface">{zone.lead}</strong>
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              zone.heatAlert.includes('High')
                                ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-700'
                            }`}
                          >
                            Heat: {zone.heatAlert}
                          </span>
                        </div>

                        {/* Headcount Progress Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-on-surface-variant font-medium">Mobilization Ceiling</span>
                            <span className="font-mono font-bold text-on-surface">
                              {zone.headcount} / {zone.planned} ({zone.capacityPct}%)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-secondary to-[#F18E3B] rounded-full"
                              style={{ width: `${zone.capacityPct}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Trade Distribution Badges */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {zone.trades.map((tr, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium bg-surface-container-low px-2 py-0.5 rounded-md border border-outline-variant/30 text-on-surface-variant"
                            >
                              {tr}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Zone Footer Quick Action */}
                      <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {zone.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedZoneForCrew(zone);
                            setZoneCrewSearch('');
                            setZoneCrewTradeFilter('All');
                            setShowZoneCrewModal(true);
                          }}
                          className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                          type="button"
                        >
                          <span>View Crew</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SUB-VIEW 4: DAILY SAFETY & TOOLBOX TALK (TBT) LOG         */}
            {/* ======================================================== */}
            {activeTab === 'safety-tbt' && (
              <div className="flex flex-col space-y-4">
                <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/60 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/40 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                          PRE-SHIFT BRIEFING CLEARED
                        </span>
                        <span className="text-xs font-mono text-on-surface-variant">{tbtLog.date}</span>
                      </div>
                      <h2 className="text-base font-bold text-on-surface mt-1">
                        Daily Safety Toolbox Talk (TBT) Record
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowTBTModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface hover:bg-surface-container border border-outline-variant/40"
                        type="button"
                      >
                        Edit TBT Briefing
                      </button>
                      <button
                        onClick={() => showToast('TBT Safety Dossier PDF generated for Aramco HSE Audit archive')}
                        className="px-3.5 py-1.5 rounded-lg bg-secondary text-white text-xs font-bold shadow-xs hover:brightness-110"
                        type="button"
                      >
                        Export TBT PDF
                      </button>
                    </div>
                  </div>

                  {/* Topic & Guidelines */}
                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-2">
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                      Today's Safety Mandate
                    </span>
                    <h3 className="text-sm font-bold text-on-surface">{tbtLog.primaryTopic}</h3>
                    <ul className="space-y-1.5 text-xs text-on-surface-variant pt-1 list-disc list-inside">
                      {tbtLog.keyPoints.map((pt, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Attendance & PPE Verification Deck */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">TBT Attendance</span>
                      <div className="text-lg font-bold font-mono text-emerald-600 mt-1">
                        {tbtLog.headcountAttended} / {tbtLog.totalShiftWorkers}
                      </div>
                      <span className="text-[10px] text-on-surface-variant">100% of morning muster</span>
                    </div>

                    <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">Hard Hat &amp; Boots</span>
                      <div className="text-lg font-bold font-mono text-emerald-600 mt-1">
                        {tbtLog.ppeVerification.hardHats}
                      </div>
                      <span className="text-[10px] text-on-surface-variant">Physical Spot-Check Complete</span>
                    </div>

                    <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">Fall Arrest Harnesses</span>
                      <div className="text-lg font-bold font-mono text-emerald-600 mt-1">
                        {tbtLog.ppeVerification.fallArrestHarness}
                      </div>
                      <span className="text-[10px] text-on-surface-variant">Berth &amp; Steel Framing</span>
                    </div>

                    <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">Fit-for-Duty Breaches</span>
                      <div className="text-lg font-bold font-mono text-emerald-600 mt-1">0 Violations</div>
                      <span className="text-[10px] text-on-surface-variant">Hydration &amp; Physical Check Passed</span>
                    </div>
                  </div>

                  {/* Sign-Off Footer */}
                  <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
                    <span>
                      Conducted by: <strong>{tbtLog.leadConductor}</strong>
                    </span>
                    <span className="font-mono text-emerald-700 font-semibold">{tbtLog.signedAt}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ISSUE FIELD PASS / LEAVE VOUCHER                */}
      {/* ======================================================== */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl border border-outline-variant/60 shadow-2xl p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">assignment_add</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Issue Manual Field Pass / Leave Voucher</h3>
                  <span className="text-[11px] text-on-surface-variant">Signed by Site Coordinator</span>
                </div>
              </div>
              <button
                onClick={() => setShowPassModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePass} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                    Pass Type
                  </label>
                  <select
                    value={passForm.passType}
                    onChange={(e) => setPassForm({ ...passForm, passType: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-semibold text-on-surface"
                  >
                    <option value="Early Departure Gate Pass">Early Departure Gate Pass</option>
                    <option value="Overtime Work Authorization">Overtime Work Authorization</option>
                    <option value="Emergency Stand-in Voucher">Emergency Stand-in Voucher</option>
                    <option value="Medical Rest / First Aid Slip">Medical Rest / First Aid Slip</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                    Worker
                  </label>
                  <select
                    value={passForm.workerId}
                    onChange={(e) => {
                      const found = workers.find((w) => w.id === e.target.value);
                      setPassForm({
                        ...passForm,
                        workerId: e.target.value,
                        workerName: found ? found.name : '',
                      });
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-semibold text-on-surface"
                  >
                    {workers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                    Departure / Effective Time
                  </label>
                  <input
                    type="text"
                    value={passForm.departureTime}
                    onChange={(e) => setPassForm({ ...passForm, departureTime: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-mono text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                    Destination / Department
                  </label>
                  <input
                    type="text"
                    value={passForm.destination}
                    onChange={(e) => setPassForm({ ...passForm, destination: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                  Reason &amp; Scope of Pass
                </label>
                <textarea
                  rows="2"
                  value={passForm.reason}
                  onChange={(e) => setPassForm({ ...passForm, reason: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:ring-1 focus:ring-secondary"
                  placeholder="Explain why this pass is issued..."
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                  Authorizing Coordinator / Supervisor
                </label>
                <input
                  type="text"
                  value={passForm.authorizedBy}
                  onChange={(e) => setPassForm({ ...passForm, authorizedBy: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-secondary to-[#F18E3B] text-white text-xs font-bold shadow-md shadow-secondary/30"
                >
                  Sign &amp; Log Field Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TBT SAFETY BRIEFING LOGGER                      */}
      {/* ======================================================== */}
      {showTBTModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl border border-outline-variant/60 shadow-2xl p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
                </div>
                <h3 className="text-sm font-bold text-on-surface">Update Daily Safety (TBT) Briefing</h3>
              </div>
              <button
                onClick={() => setShowTBTModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                  Primary Hazard / Safety Topic
                </label>
                <input
                  type="text"
                  value={tbtLog.primaryTopic}
                  onChange={(e) => setTbtLog({ ...tbtLog, primaryTopic: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-semibold text-on-surface focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                  Briefing Conductors
                </label>
                <input
                  type="text"
                  value={tbtLog.leadConductor}
                  onChange={(e) => setTbtLog({ ...tbtLog, leadConductor: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                />
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant">
                <span className="font-bold text-emerald-600">Manual Inspection Confirmation:</span> You certify that
                all 184 workers physically attended the briefing, safety PPE was spot-checked, and no heat stress or
                sobriety violations were identified.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTBTModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTBTModal(false);
                    showToast('TBT Safety Log updated & certified');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  Certify &amp; Save Briefing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: SUBMIT SHIFT TIMESHEET TO DEPT MANAGER           */}
      {/* ======================================================== */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl border border-outline-variant/60 shadow-2xl p-5 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">send_and_archive</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Submit Shift 1 Timesheet</h3>
                <span className="text-[11px] text-on-surface-variant">Handoff to Dept Manager Review Portal</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 space-y-2">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Active Mobilized Headcount:</span>
                  <strong className="text-on-surface font-mono">{totalMobilized} workers</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Total Regular Hours:</span>
                  <strong className="text-on-surface font-mono">{totalBaseHours}h</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Total Overtime Hours:</span>
                  <strong className="text-secondary font-mono">{totalOvertimeHours}h</strong>
                </div>
                <div className="flex justify-between border-t border-outline-variant/30 pt-2">
                  <span className="font-bold text-on-surface">Total Shift Hours:</span>
                  <strong className="text-emerald-700 font-mono text-sm">
                    {(totalBaseHours + totalOvertimeHours).toFixed(1)}h
                  </strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[11px] leading-relaxed">
                <strong>Audit Lock:</strong> Submitting will lock Shift 1 manual entries from further changes and
                dispatch the voucher to Manager Karim Ops for review and payroll pre-clearance.
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitShift}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-secondary to-[#F18E3B] text-white text-xs font-bold shadow-md shadow-secondary/30"
              >
                Sign &amp; Dispatch to Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: REASSIGN WORK ZONE                              */}
      {/* ======================================================== */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl border border-outline-variant/60 shadow-2xl p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Reassign Work Zone</h3>
                <span className="text-[11px] text-on-surface-variant">{showReassignModal.name}</span>
              </div>
              <button
                onClick={() => setShowReassignModal(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase">Select Destination Zone</span>
              <div className="space-y-1.5">
                {zones.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => handleReassignZone(z.title)}
                    className="w-full text-left p-2.5 rounded-xl border border-outline-variant/40 hover:border-secondary hover:bg-surface-container-low text-xs font-semibold text-on-surface flex items-center justify-between group transition-all"
                    type="button"
                  >
                    <span>{z.title.split(':')[0]} • {z.title.split(':')[1]?.substring(0, 20)}...</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-secondary">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: ADD / EDIT COORDINATOR REMARK                   */}
      {/* ======================================================== */}
      {showRemarkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl border border-outline-variant/60 shadow-2xl p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Field Coordinator Remarks</h3>
                <span className="text-[11px] text-on-surface-variant">{showRemarkModal.name} ({showRemarkModal.id})</span>
              </div>
              <button
                onClick={() => setShowRemarkModal(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                  Daily Work &amp; Attendance Notes
                </label>
                <textarea
                  rows="3"
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  placeholder="Record specific field events (e.g., late bus arrival, early doctor pass, special overtime task)..."
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRemarkModal(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveRemark}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-secondary to-[#F18E3B] text-white text-xs font-bold shadow-md shadow-secondary/30"
                >
                  Save Remark
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* MODAL 6: IMPORT BIOMETRIC / EXCEL ROSTER                */}
      {/* ======================================================== */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl border border-outline-variant/60 shadow-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Import Biometric Punch / Excel</h3>
                  <span className="text-[11px] text-on-surface-variant">Sync turnstile or biometric terminal data</span>
                </div>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-outline-variant rounded-2xl p-6 text-center bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-secondary text-[36px] mb-2">cloud_upload</span>
                <p className="text-xs font-bold text-on-surface">Drag & drop Turnstile log or Excel roster here</p>
                <p className="text-[11px] text-on-surface-variant mt-1">Supports .XLSX, .CSV, and ZKTeco/HikVision .DAT files</p>
                <button
                  type="button"
                  className="mt-3 px-3 py-1.5 rounded-xl bg-secondary/15 hover:bg-secondary/25 text-secondary font-bold text-xs border border-secondary/30"
                >
                  Browse Files
                </button>
              </div>

              <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/40 text-xs space-y-1.5">
                <span className="font-bold text-on-surface block text-[11px] uppercase tracking-wider">Expected Columns</span>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-on-surface-variant">
                  <span>• Worker Code / Iqama</span>
                  <span>• Punch In / Out Times</span>
                  <span>• Device Terminal ID</span>
                  <span>• Site Access Gate</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowImportModal(false);
                    showToast('Biometric logs imported successfully: 182 records parsed and synced.');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-secondary to-[#F18E3B] text-white text-xs font-bold shadow-md shadow-secondary/30"
                >
                  Parse &amp; Sync Timesheets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: REQUEST TIMESHEET CYCLE UNLOCK                  */}
      {/* ======================================================== */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl border border-outline-variant/60 shadow-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">lock_open</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Request Cycle Unlock</h3>
                  <span className="text-[11px] text-on-surface-variant">Payroll &amp; MOL Compliance Lockdown</span>
                </div>
              </div>
              <button
                onClick={() => setShowUnlockModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-800">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">warning</span>
                  <span>MOL Cutoff in 3 Days (Oct 31, 23:59 AST)</span>
                </div>
                <p className="text-[11px] mt-1 text-rose-700">
                  Unlocking allows field coordinators to edit locked shift records before payroll batch generation.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                  Reason for Unlock Request
                </label>
                <select className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none">
                  <option>Retroactive Overtime Correction</option>
                  <option>Turnstile Gate Biometric Failure</option>
                  <option>Subcontractor Disputed Daily Hours</option>
                  <option>Emergency Shift Extension Authorization</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                  Coordinator Justification Note
                </label>
                <textarea
                  rows="3"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  placeholder="Detail the specific workers, dates, and authorization references..."
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUnlockModal(false);
                    showToast('Unlock request submitted to Tariq Al-Mansoor (Chief Paymaster).');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#131943] text-white text-xs font-bold shadow-md hover:bg-[#1a225c]"
                >
                  Submit Unlock Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 8: IMPORT MUSTER CSV ATTENDANCE                     */}
      {/* ======================================================== */}
      {showMusterCsvModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Import Muster Attendance (CSV)</h3>
                  <span className="text-[11px] text-on-surface-variant">
                    Sync morning roll call from gate turnstiles or supervisor roster files
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowMusterCsvModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Instruction & Format Info */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
                  Supported CSV Format
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const sample = workers
                      .map((w, idx) => `${w.id}, ${idx % 7 === 0 ? 'Absent' : 'Present'}`)
                      .join('\n');
                    setMusterCsvInput(sample);
                    showToast('Sample roster data loaded into CSV editor');
                  }}
                  className="text-[11px] font-bold text-secondary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                  <span>Load Sample CSV</span>
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Provide one record per line as: <code className="bg-surface-container px-1 py-0.5 rounded text-on-surface font-mono font-bold">Worker_ID, Status</code> or <code className="bg-surface-container px-1 py-0.5 rounded text-on-surface font-mono font-bold">Worker_Name, Status</code>
              </p>
              <div className="text-[10px] font-mono text-on-surface-variant bg-surface-container-lowest p-2 rounded border border-outline-variant/30 leading-relaxed">
                EMP-1042, Present<br />
                M-88284, Absent<br />
                Vikram Patel, Present
              </div>
            </div>

            {/* File Upload Option */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1.5">
                Upload CSV or Text File
              </label>
              <input
                type="file"
                accept=".csv,text/plain,.txt"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setMusterCsvInput(event.target.result || '');
                      showToast(`Loaded ${file.name}`);
                    };
                    reader.readAsText(file);
                  }
                }}
                className="w-full text-xs text-on-surface file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-outline-variant/60 file:text-xs file:font-semibold file:bg-surface-container-low hover:file:bg-surface-container cursor-pointer"
              />
            </div>

            {/* Direct Paste / Edit CSV Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">
                  Paste or Edit CSV Content
                </label>
                {musterCsvInput.trim() && (
                  <span className="text-[10.5px] font-mono text-on-surface-variant">
                    {musterCsvInput.trim().split('\n').length} row(s) detected
                  </span>
                )}
              </div>
              <textarea
                rows="6"
                value={musterCsvInput}
                onChange={(e) => setMusterCsvInput(e.target.value)}
                placeholder="Paste CSV rows here... e.g.&#10;EMP-1042, Present&#10;EMP-1045, Absent&#10;EMP-1049, Present"
                className="w-full font-mono text-xs bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary placeholder:text-on-surface-variant/50"
              ></textarea>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/40">
              <button
                type="button"
                onClick={() => {
                  setShowMusterCsvModal(false);
                  setMusterCsvInput('');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleImportMusterCsv(musterCsvInput)}
                disabled={!musterCsvInput.trim()}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                  musterCsvInput.trim()
                    ? 'bg-secondary hover:bg-secondary/90 active:scale-[0.98]'
                    : 'bg-secondary/40 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">file_upload</span>
                <span>Import &amp; Apply Attendance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 9: ZONE CREW DEPLOYMENT ROSTER                      */}
      {/* ======================================================== */}
      {showZoneCrewModal && selectedZoneForCrew && (() => {
        const fullCrew = getZoneCrewMembers(selectedZoneForCrew);
        const filteredCrew = fullCrew.filter((w) => {
          const matchesSearch =
            !zoneCrewSearch.trim() ||
            w.name.toLowerCase().includes(zoneCrewSearch.toLowerCase()) ||
            w.id.toLowerCase().includes(zoneCrewSearch.toLowerCase()) ||
            w.trade.toLowerCase().includes(zoneCrewSearch.toLowerCase()) ||
            w.workPackage.toLowerCase().includes(zoneCrewSearch.toLowerCase());

          const matchesTrade =
            zoneCrewTradeFilter === 'All' ||
            w.trade.toLowerCase().includes(zoneCrewTradeFilter.toLowerCase()) ||
            w.subTrade.toLowerCase().includes(zoneCrewTradeFilter.toLowerCase());

          return matchesSearch && matchesTrade;
        });

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#131943] via-[#0E1330] to-[#1A1F45] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">groups</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {selectedZoneForCrew.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-secondary/20 text-amber-200 border border-secondary/30 text-[10px] font-mono font-bold">
                        {selectedZoneForCrew.channel}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/80 mt-1">
                      <span>
                        Lead: <strong className="text-white">{selectedZoneForCrew.lead}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Capacity: <strong className="text-white">{selectedZoneForCrew.headcount} / {selectedZoneForCrew.planned}</strong> ({selectedZoneForCrew.capacityPct}%)
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {selectedZoneForCrew.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                      selectedZoneForCrew.heatAlert.includes('High')
                        ? 'bg-rose-500/20 text-rose-200 border-rose-500/40'
                        : selectedZoneForCrew.heatAlert.includes('Moderate')
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
                    }`}
                  >
                    Heat: {selectedZoneForCrew.heatAlert}
                  </span>
                  <button
                    onClick={() => setShowZoneCrewModal(false)}
                    className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="p-3 sm:p-4 bg-surface-container-low border-b border-outline-variant/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                {/* Search */}
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={zoneCrewSearch}
                    onChange={(e) => setZoneCrewSearch(e.target.value)}
                    placeholder="Search by worker name, ID, trade, or task..."
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                  {zoneCrewSearch && (
                    <button
                      onClick={() => setZoneCrewSearch('')}
                      className="absolute right-2.5 top-2 text-on-surface-variant hover:text-on-surface"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                {/* Trade Filters */}
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => setZoneCrewTradeFilter('All')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      zoneCrewTradeFilter === 'All'
                        ? 'bg-secondary text-white shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    All ({fullCrew.length})
                  </button>
                  {selectedZoneForCrew.trades.map((tr) => {
                    const tradeName = tr.split('(')[0].trim();
                    const isSelected = zoneCrewTradeFilter === tradeName;
                    return (
                      <button
                        key={tr}
                        type="button"
                        onClick={() => setZoneCrewTradeFilter(isSelected ? 'All' : tradeName)}
                        className={`px-2 py-1 rounded-lg text-[10.5px] font-medium transition-all ${
                          isSelected
                            ? 'bg-secondary text-white font-bold shadow-xs'
                            : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {tradeName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Crew List / Table Container */}
              <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/20 p-2 sm:p-4">
                {filteredCrew.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center space-y-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[36px] text-on-surface-variant/40">
                      person_search
                    </span>
                    <p className="text-xs font-semibold">No workers found matching your filter criteria.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setZoneCrewSearch('');
                        setZoneCrewTradeFilter('All');
                      }}
                      className="text-xs text-secondary font-bold hover:underline"
                    >
                      Clear search filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredCrew.map((worker) => (
                      <div
                        key={worker.id}
                        className={`p-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest hover:border-secondary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs ${
                          worker.isLead ? 'bg-secondary/[0.03] border-secondary/30' : ''
                        }`}
                      >
                        {/* Worker Identity & Role */}
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                              worker.isLead
                                ? 'bg-secondary text-white shadow-xs'
                                : 'bg-surface-container-high text-on-surface'
                            }`}
                          >
                            {worker.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>

                          <div className="flex flex-col space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-on-surface">{worker.name}</span>
                              <span className="text-[10.5px] font-mono text-on-surface-variant">
                                ({worker.id})
                              </span>
                              {worker.isLead && (
                                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/30">
                                  Zone Gang Lead
                                </span>
                              )}
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                                {worker.trade}
                              </span>
                            </div>

                            <p className="text-[11.5px] text-on-surface font-medium">
                              {worker.subTrade}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-on-surface-variant pt-0.5">
                              <span>
                                Task: <strong className="text-on-surface font-normal">{worker.workPackage}</strong>
                              </span>
                              <span>•</span>
                              <span>Supplier: {worker.supplier}</span>
                            </div>
                          </div>
                        </div>

                        {/* Attendance & Actions */}
                        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-outline-variant/20">
                          <div className="flex flex-col md:items-end">
                            <span
                              className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${
                                worker.attendance === 'Present'
                                  ? 'bg-emerald-500/10 text-emerald-700'
                                  : worker.attendance === 'Late'
                                  ? 'bg-amber-500/10 text-amber-700'
                                  : 'bg-rose-500/10 text-rose-700'
                              }`}
                            >
                              {worker.attendance} ({worker.timeIn || '07:00 AM'})
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-mono mt-0.5">
                              Radio: {worker.radio}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                showToast(`Radio comms initiated on ${worker.radio} with ${worker.name}`)
                              }
                              title="Call via 2-Way Radio"
                              className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-secondary transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">podcasts</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setZoneFilter(selectedZoneForCrew.id);
                                setActiveTab('timesheets');
                                setShowZoneCrewModal(false);
                              }}
                              title="Open Timesheet for this Zone"
                              className="px-2 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-[11px] font-semibold text-secondary hover:underline flex items-center gap-1"
                            >
                              <span>Timesheet</span>
                              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:p-4 bg-surface-container-low/70 border-t border-outline-variant/40 flex items-center justify-between gap-3 shrink-0">
                <span className="text-xs text-on-surface-variant font-medium">
                  Showing <strong>{filteredCrew.length}</strong> of <strong>{fullCrew.length}</strong> deployed crew members
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      showToast(`Exported Crew Dispatch Manifest for ${selectedZoneForCrew.title} (PDF)`)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:bg-surface-container text-xs font-bold text-on-surface shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">print</span>
                    <span>Print Crew Manifest</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowZoneCrewModal(false)}
                    className="px-4 py-1.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
