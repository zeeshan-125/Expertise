import React, { useState, useEffect, useMemo } from 'react';
import logoImg from '../assets/logo.png';

// =====================================================================
// LOCALIZATION DICTIONARY (English & Arabic)
// =====================================================================
const translations = {
  EN: {
    portalName: 'Manager Review & Approval Portal',
    portalSub: 'Department & Project Timesheet Vetting',
    roleLabel: 'Dept / Project Manager',
    activeCluster: 'CLUSTER SA-RUH-04 ACTIVE',
    roleTag: 'REVIEWER & APPROVER',
    cutoffAlert: 'MOL & Payroll Cutoff: September 2026 Monthly Cycle',
    cutoffDesc: 'All submitted September monthly timesheets must be vetted and approved before finance batch freeze.',
    
    // Navigation Tabs
    navDashboard: 'Approval Overview',
    navQueue: 'Timesheet Queue',
    navEmployees: 'Assigned Workforce',
    navAudit: 'Approval Audit Trail',
    
    // KPIs
    kpiPending: 'Pending Approval',
    kpiApproved: 'Approved This Cycle',
    kpiRejected: 'Rejected / Returned',
    kpiTotalHours: 'Total Vetted Hours',
    kpiOtHours: 'Overtime Hours',
    kpiWorkers: 'Active Workers',
    
    // Actions
    btnApprove: 'Approve Timesheet',
    btnReject: 'Reject / Return',
    btnBulkApprove: 'Bulk Approve Selected',
    btnBulkReject: 'Bulk Reject Selected',
    btnViewDetails: 'Review Timesheet',
    btnFilter: 'Filter Roster',
    btnExport: 'Export PDF Report',
    btnCancel: 'Cancel',
    btnConfirm: 'Confirm Action',
    btnMarkRead: 'Mark all as read',
    
    // Statuses
    statusDraft: 'Draft',
    statusSubmitted: 'Submitted',
    statusApproved: 'Approved',
    statusLocked: 'Locked',
    statusRejected: 'Returned for Revision',
    
    // Table Headers
    thWorker: 'Employee / Trade',
    thProject: 'Assigned Project',
    thCoordinator: 'Submitted By',
    thRegHours: 'Regular Hours',
    thOtHours: 'OT Hours',
    thTotalHours: 'Total Hours',
    thStatus: 'Vetting Status',
    thActions: 'Actions',
    
    // Notifications
    notificationsTitle: 'Manager Alerts & Submissions',
    noNotifications: 'No new notifications.',
  },
  AR: {
    portalName: 'بوابة تدقيق واعتماد الجداول الزمنية',
    portalSub: 'مراجعة وتوثيق ساعات العمل للمشاريع',
    roleLabel: 'مدير القسم / المشروع',
    activeCluster: 'المجموعة س-الرياض-04 نشطة',
    roleTag: 'مدقق ومُعتمد',
    cutoffAlert: 'الإغلاق الشهري للرواتب: دورة شهر سبتمبر 2026',
    cutoffDesc: 'يجب مراجعة وتوثيق جميع الجداول الزمنية لشهر سبتمبر قبل تجميد بيانات الرواتب لدى الإدارة المالية.',
    
    // Navigation Tabs
    navDashboard: 'نظرة عامة على الاعتمادات',
    navQueue: 'قائمة التدقيق والاعتماد',
    navEmployees: 'القوة العاملة المخصصة',
    navAudit: 'سجل التدقيق والتواقيع',
    
    // KPIs
    kpiPending: 'بانتظار الاعتماد',
    kpiApproved: 'معتمد هذا الشهر',
    kpiRejected: 'مُعاد للمراجعة',
    kpiTotalHours: 'إجمالي الساعات المعتمدة',
    kpiOtHours: 'ساعات العمل الإضافي',
    kpiWorkers: 'العمال النشطون',
    
    // Actions
    btnApprove: 'اعتماد الجدول',
    btnReject: 'إعادة للمنسق',
    btnBulkApprove: 'اعتماد جماعي للمحدد',
    btnBulkReject: 'رفض جماعي للمحدد',
    btnViewDetails: 'مراجعة التفاصيل',
    btnFilter: 'تصفية السجلات',
    btnExport: 'تصدير تقرير PDF',
    btnCancel: 'إلغاء',
    btnConfirm: 'تأكيد الإجراء',
    btnMarkRead: 'تعيين الكل كمقروء',
    
    // Statuses
    statusDraft: 'مسودة',
    statusSubmitted: 'مُقدم للاعتماد',
    statusApproved: 'مُعتمد',
    statusLocked: 'مُغلق نهائياً',
    statusRejected: 'مُعاد للتعديل',
    
    // Table Headers
    thWorker: 'العامل / التخصص',
    thProject: 'المشروع المخصص',
    thCoordinator: 'مُقدم من المنسق',
    thRegHours: 'الساعات العادية',
    thOtHours: 'الإضافي',
    thTotalHours: 'إجمالي الساعات',
    thStatus: 'حالة الاعتماد',
    thActions: 'الإجراءات',
    
    // Notifications
    notificationsTitle: 'إشعارات وتنبيهات الاعتماد',
    noNotifications: 'لا توجد إشعارات جديدة.',
  }
};

export default function DepartmentManager({ userSession, onLogout, onSwitchRole }) {
  // Locale State (EN / AR)
  const [lang, setLang] = useState('EN');
  const t = translations[lang];
  const isRtl = lang === 'AR';

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'queue' | 'employees' | 'audit'

  // Context Selectors
  const [selectedProject, setSelectedProject] = useState('Project 104 – Riyadh Metro Expansion Site A');
  const [selectedPeriod, setSelectedPeriod] = useState('Sep 01 – Sep 30, 2026 (Monthly Timesheet)');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals State
  const [activeDetailTimesheet, setActiveDetailTimesheet] = useState(null);
  const [rejectingTimesheet, setRejectingTimesheet] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [reopenTimesheet, setReopenTimesheet] = useState(null);
  const [reopenReason, setReopenReason] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // Scroll to top on tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  // ===================================================================
  // SEPTEMBER 2026 MONTHLY TIMESHEET DATASET GENERATOR
  // 30 Days: Sep 01 (Tue) – Sep 30 (Wed), 2026
  // Fridays (Sep 04, 11, 18, 25) are Rest Days (Weekly Off)
  // Strictly NO salary or hourly rates to comply with RBAC segregation
  // ===================================================================
  const buildSepDailyEntries = (tasks, otMap = {}, statusMap = {}) => {
    const days = [
      { day: 'Tue', date: 'Sep 01' },
      { day: 'Wed', date: 'Sep 02' },
      { day: 'Thu', date: 'Sep 03' },
      { day: 'Fri', date: 'Sep 04', isRest: true },
      { day: 'Sat', date: 'Sep 05' },
      { day: 'Sun', date: 'Sep 06' },
      { day: 'Mon', date: 'Sep 07' },
      { day: 'Tue', date: 'Sep 08' },
      { day: 'Wed', date: 'Sep 09' },
      { day: 'Thu', date: 'Sep 10' },
      { day: 'Fri', date: 'Sep 11', isRest: true },
      { day: 'Sat', date: 'Sep 12' },
      { day: 'Sun', date: 'Sep 13' },
      { day: 'Mon', date: 'Sep 14' },
      { day: 'Tue', date: 'Sep 15' },
      { day: 'Wed', date: 'Sep 16' },
      { day: 'Thu', date: 'Sep 17' },
      { day: 'Fri', date: 'Sep 18', isRest: true },
      { day: 'Sat', date: 'Sep 19' },
      { day: 'Sun', date: 'Sep 20' },
      { day: 'Mon', date: 'Sep 21' },
      { day: 'Tue', date: 'Sep 22' },
      { day: 'Wed', date: 'Sep 23' },
      { day: 'Thu', date: 'Sep 24' },
      { day: 'Fri', date: 'Sep 25', isRest: true },
      { day: 'Sat', date: 'Sep 26' },
      { day: 'Sun', date: 'Sep 27' },
      { day: 'Mon', date: 'Sep 28' },
      { day: 'Tue', date: 'Sep 29' },
      { day: 'Wed', date: 'Sep 30' },
    ];

    return days.map((d, idx) => {
      const task = tasks[idx] || tasks[idx % tasks.length];
      if (d.isRest) {
        const ot = otMap[d.date] || 0.0;
        const status = statusMap[d.date] || 'Rest';
        return {
          day: d.day,
          date: d.date,
          regHours: 0.0,
          otHours: ot,
          task: ot > 0 ? (tasks[idx] || 'Friday Emergency Callout') : 'Rest Day (Weekly Off)',
          status
        };
      }
      const isLeave = statusMap[d.date] === 'Leave';
      const regHours = isLeave ? 0.0 : 8.0;
      const otHours = otMap[d.date] !== undefined ? otMap[d.date] : 0.0;
      const status = statusMap[d.date] || 'Verified';
      return {
        day: d.day,
        date: d.date,
        regHours,
        otHours,
        task: isLeave ? 'Authorized Medical Leave' : task,
        status
      };
    });
  };

  const [timesheets, setTimesheets] = useState([
    {
      id: 'TS-4091',
      workerId: 'W-88204',
      workerName: 'Mateo Hernandez',
      trade: 'Structural Steel',
      subTrade: 'Level 3 Coded Welder',
      department: 'Heavy Civil & Marine Infrastructure',
      project: 'Project 104 – Riyadh Metro Expansion Site A',
      period: 'Sep 01 – Sep 30, 2026',
      submittedBy: 'Tariq Al-Mansoor (Site Coordinator)',
      submittedAt: 'Today at 08:30 AM',
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
      digitalSeal: 'DIGI-SUB-9821-MTR',
      status: 'Submitted', // 'Submitted' | 'Approved' | 'Locked' | 'Rejected'
      regHours: 208.0,
      otHours: 28.0,
      totalHours: 236.0,
      hasWarnings: true,
      warningDetails: 'Overtime exceeds 2.0 hrs on Sep 24 due to Gantry Crane weld extension.',
      dailyEntries: buildSepDailyEntries(
        [
          'Gantry Column Bolting & Anchor Leveling',
          'Weld Joint 3B Pre-Heating',
          'Ultrasonic Weld Prep & Flange Cleaning',
          'Rest Day (Weekly Off)',
          'Flange Alignment Level 4',
          'Box Girder Internal Stiffener Fitting',
          'Box Girder Assembly & Tack Welding',
          'Full Penetration Splice Weld',
          'NDT Inspection Escort & Defect Repair',
          'Pier Joint Reinforcement Plate Setup',
          'Rest Day (Weekly Off)',
          'Torque Testing Canopy #2',
          'Bolted Splice Touchup & Grinding',
          'Pier Joint Reinforcement Welding',
          'Pre-Shift Safety Walkthrough & Rigging',
          'Structural Framing Alignment Check',
          'Overhead Beam Weld Run 2',
          'Rest Day (Weekly Off)',
          'Gantry Track Leveling & Shim Plate Fit',
          'Crane Girder Splice Welding',
          'Column Base Grouting Prep & Clean',
          'Main Portal Frame Erection Assist',
          'High-Tensile Friction Bolt Tensioning',
          'Emergency Crane Gantry Securing',
          'Rest Day (Weekly Off)',
          'Post-Weld Heat Treatment Monitoring',
          'Canopy Rafter Connection Bolting',
          'West Elevation Facade Bracket Welds',
          'Magnetic Particle Testing Prep',
          'Monthly Structural Handover Walkthrough',
        ],
        {
          'Sep 02': 1.5,
          'Sep 03': 1.0,
          'Sep 05': 1.0,
          'Sep 06': 2.0,
          'Sep 08': 2.0,
          'Sep 09': 1.0,
          'Sep 10': 1.5,
          'Sep 12': 1.0,
          'Sep 14': 1.5,
          'Sep 15': 1.0,
          'Sep 17': 1.5,
          'Sep 19': 1.0,
          'Sep 20': 2.0,
          'Sep 22': 1.5,
          'Sep 23': 1.0,
          'Sep 24': 3.5,
          'Sep 26': 1.0,
          'Sep 28': 1.5,
          'Sep 29': 1.0,
          'Sep 30': 0.5,
        },
        {
          'Sep 24': 'OT Variance',
        }
      )
    },
    {
      id: 'TS-4092',
      workerId: 'W-88208',
      workerName: 'Soraya Chen',
      trade: 'MEP Systems',
      subTrade: 'Senior HVAC Systems Engineer',
      department: 'Mechanical, Electrical & Plumbing',
      project: 'Project 104 – Riyadh Metro Expansion Site A',
      period: 'Sep 01 – Sep 30, 2026',
      submittedBy: 'Tariq Al-Mansoor (Site Coordinator)',
      submittedAt: 'Today at 08:35 AM',
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
      digitalSeal: 'DIGI-SUB-9822-MEP',
      status: 'Submitted',
      regHours: 208.0,
      otHours: 18.0,
      totalHours: 226.0,
      hasWarnings: false,
      warningDetails: null,
      dailyEntries: buildSepDailyEntries(
        [
          'Air Handling Unit 4 Calibration',
          'Chilled Water Loop Pressure Test',
          'BMS Sensor Loop Termination',
          'Rest Day (Weekly Off)',
          'Emergency Chiller Interlock Verification',
          'Ductwork Static Leak Testing',
          'Plenum Acoustic Lining Inspection',
          'Terminal 4 VAV Box Testing',
          'Zone B Return Fan Balancing',
          'Substation 3 HVAC Duct Integration',
          'Rest Day (Weekly Off)',
          'Fire Damper Trip Verification',
          'Cooling Tower Flow Balancing',
          'Electrical Isolator Tagout Audit',
          'Final Chiller Commissioning Run',
          'Condenser Water Pump Alignment',
          'Primary Air Damper Actuator Test',
          'Rest Day (Weekly Off)',
          'HVAC Control Panel Wiring Termination',
          'Variable Speed Drive (VFD) Calibration',
          'Exhaust Air Louver Motor Testing',
          'Smoke Evacuation Fan Functional Test',
          'Refrigerant Leak Detector Check',
          'Pressure Relief Valve Inspection',
          'Rest Day (Weekly Off)',
          'Building Pressurization Test',
          'Digital Thermostat Network Config',
          'Thermal Imaging of Motor Bearings',
          'MEP Commissioning Punchlist Review',
          'Monthly MEP Handover Signoff',
        ],
        {
          'Sep 01': 1.0,
          'Sep 02': 1.0,
          'Sep 05': 1.0,
          'Sep 06': 1.0,
          'Sep 08': 1.0,
          'Sep 09': 1.0,
          'Sep 10': 1.0,
          'Sep 12': 1.0,
          'Sep 13': 1.0,
          'Sep 14': 1.0,
          'Sep 15': 1.0,
          'Sep 17': 1.0,
          'Sep 19': 1.0,
          'Sep 20': 1.0,
          'Sep 22': 1.0,
          'Sep 24': 1.0,
          'Sep 26': 1.0,
          'Sep 29': 1.0,
        }
      )
    },
    {
      id: 'TS-4093',
      workerId: 'W-88206',
      workerName: 'Vikram Patel',
      trade: 'Civil & Foundation',
      subTrade: 'Senior Rebar Fabricator',
      department: 'Heavy Civil & Marine Infrastructure',
      project: 'Project 104 – Riyadh Metro Expansion Site A',
      period: 'Sep 01 – Sep 30, 2026',
      submittedBy: 'Tariq Al-Mansoor (Site Coordinator)',
      submittedAt: 'Today at 08:32 AM',
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
      digitalSeal: 'DIGI-SUB-9823-CIV',
      status: 'Submitted',
      regHours: 192.0,
      otHours: 12.0,
      totalHours: 204.0,
      hasWarnings: false,
      warningDetails: null,
      dailyEntries: buildSepDailyEntries(
        [
          'Pile Cap 12 Cage Assembly',
          'Rebar Tying Grid 4-E',
          'Shear Link Installation',
          'Rest Day (Weekly Off)',
          'Starter Bar Splicing',
          'Anchor Bolt Sleeve Placement',
          'Base Raft Reinforcement Level 1',
          'Inspection with QA/QC Consultant',
          'Formwork Spacing Check',
          'South Trench Earthworks Shoring',
          'Rest Day (Weekly Off)',
          'Foundation Pad 14 Pour Prep',
          'Rebar Coupler Torquing',
          'Column Starter Bar Cage Tie',
          'Foundation Waterproofing Reinforcement',
          'Diaphragm Wall Guide Beam Rebar',
          'Sump Pit Rebar Cage Fabrication',
          'Rest Day (Weekly Off)',
          'Retaining Wall Vertical Bar Splicing',
          'Tie-Beam Reinforcement Grid 7',
          'Embedment Plate Positioning',
          'Slab on Grade Mesh Installation',
          'Expansion Dowel Bar Sleeve Insertion',
          'Pre-Pour Foundation Cleanliness Check',
          'Rest Day (Weekly Off)',
          'Box Culvert Rebar Detailing',
          'Underground Utility Trench Shoring',
          'Authorized Medical Leave',
          'Medical Clinic Stand-In',
          'Monthly Rebar Stock Audit & Tying',
        ],
        {
          'Sep 02': 1.0,
          'Sep 05': 1.0,
          'Sep 07': 1.0,
          'Sep 08': 1.0,
          'Sep 10': 1.0,
          'Sep 13': 1.0,
          'Sep 15': 1.0,
          'Sep 17': 1.0,
          'Sep 19': 1.0,
          'Sep 20': 1.0,
          'Sep 22': 1.0,
          'Sep 24': 1.0,
        },
        {
          'Sep 28': 'Leave',
          'Sep 29': 'Leave',
        }
      )
    },
    {
      id: 'TS-4085',
      workerId: 'W-88210',
      workerName: 'Elena Rostova',
      trade: 'HSE & Heavy Rigging',
      subTrade: 'Certified Rigger & Safety Marshall',
      department: 'Health, Safety & Environment',
      project: 'Project 104 – Riyadh Metro Expansion Site A',
      period: 'Sep 01 – Sep 30, 2026',
      submittedBy: 'Tariq Al-Mansoor (Site Coordinator)',
      submittedAt: 'Sep 29, 2026',
      approvedBy: 'Fahad Al-Husseini (Project Manager)',
      approvedAt: 'Sep 30, 2026 at 16:20 PM',
      rejectionReason: null,
      digitalSeal: 'CERT-MGR-8819-KSA',
      status: 'Approved',
      regHours: 208.0,
      otHours: 24.0,
      totalHours: 232.0,
      hasWarnings: false,
      warningDetails: null,
      dailyEntries: buildSepDailyEntries(
        [
          'Pier Crane Tandem Lift Supervision',
          'High Harbor Wind Delay Securing',
          'Crane Rigging Sling Certification',
          'Rest Day (Weekly Off)',
          'Blind Lift Spotting - Berth 4',
          'HSE Radio Protocol Inspection',
          'Heavy Equipment Exclusion Zone Setup',
          'Vessel Unloading Supervision',
          'Overhead Canopy Lift Clearance',
          'Safety Harness Tagging & Retest',
          'Rest Day (Weekly Off)',
          'Wind Anemometer Daily Verification',
          'Mobile Crane Outrigger Shoring',
          'Pre-Shift TBT Safety Briefing',
          'Crawler Crane Track Pad Inspection',
          'Spreader Beam Magnetic Particle Test',
          'Man-Basket Lifting Protocol Audit',
          'Rest Day (Weekly Off)',
          'Critical Lift Plan #104 Vetting',
          'Night Shift Lighting Perimeter Survey',
          'Tagline Rigging Specialist Supervision',
          'Tower Crane Slew Brake Functional Check',
          'Emergency Muster Station Inspection',
          'Heavy Transport Escort Coordination',
          'Rest Day (Weekly Off)',
          'Wire Rope Lubrication & Defect Scan',
          'Rigging Shackle Proof Load Logging',
          'Hot Work Fire Watch Deployment',
          'Monthly Lift Safety Compliance Audit',
          'September Rigging Equipment Certification',
        ],
        {
          'Sep 01': 1.0,
          'Sep 02': 2.0,
          'Sep 05': 1.0,
          'Sep 06': 2.0,
          'Sep 07': 1.0,
          'Sep 08': 1.0,
          'Sep 09': 2.0,
          'Sep 10': 2.0,
          'Sep 12': 1.0,
          'Sep 13': 1.0,
          'Sep 14': 1.0,
          'Sep 15': 1.0,
          'Sep 17': 1.0,
          'Sep 19': 1.0,
          'Sep 20': 1.0,
          'Sep 22': 1.0,
          'Sep 23': 1.0,
          'Sep 24': 1.0,
          'Sep 26': 1.0,
          'Sep 27': 1.0,
          'Sep 29': 1.0,
        }
      )
    },
    {
      id: 'TS-4078',
      workerId: 'W-88209',
      workerName: 'Kwame Mensah',
      trade: 'Civil Framing',
      subTrade: 'Framing Lead & Alignment Specialist',
      department: 'Heavy Civil & Marine Infrastructure',
      project: 'Project 104 – Riyadh Metro Expansion Site A',
      period: 'Sep 01 – Sep 30, 2026',
      submittedBy: 'Tariq Al-Mansoor (Site Coordinator)',
      submittedAt: 'Sep 28, 2026',
      approvedBy: 'Fahad Al-Husseini (Project Manager)',
      approvedAt: 'Sep 29, 2026 at 11:15 AM',
      rejectionReason: null,
      digitalSeal: 'CERT-MGR-8812-KSA',
      status: 'Approved',
      regHours: 208.0,
      otHours: 16.0,
      totalHours: 224.0,
      hasWarnings: false,
      warningDetails: null,
      dailyEntries: buildSepDailyEntries(
        [
          'Canopy Framing Alignment',
          'Tie-In Bracing Bolt Torque',
          'Steel Shoring Strut Placement',
          'Rest Day (Weekly Off)',
          'Gantry Column Anchor Plates',
          'Purlin Spacing Verification',
          'Secondary Framing Erection',
          'Expansion Joint Fastening',
          'West Elevation Bracing Check',
          'Column Plumbness Inspection',
          'Rest Day (Weekly Off)',
          'Diagonal Guy Wire Tensioning',
          'Pier Joint Splice Bolting',
          'Daily Crew Safety Debrief',
          'Roof Truss Span Alignment',
          'Structural Purlin Sag Rod Installation',
          'Fascia Girt Bracket Positioning',
          'Rest Day (Weekly Off)',
          'Parapet Framing Anchor Tie-Down',
          'Wall Shuttering Alignment Survey',
          'Heavy Timber Shoring Inspection',
          'Horizontal Wind Girder Fitting',
          'Column Base Shimming & Grout Prep',
          'Canopy Eaves Strut Bolting',
          'Rest Day (Weekly Off)',
          'Cantilever Arm Alignment Check',
          'Portal Rafter Ridge Plate Splicing',
          'Secondary Framing Plumbness Audit',
          'Pre-Decking Framing Inspection',
          'Monthly Framing Milestone Handover',
        ],
        {
          'Sep 02': 1.0,
          'Sep 05': 1.0,
          'Sep 06': 1.0,
          'Sep 08': 1.0,
          'Sep 09': 1.0,
          'Sep 10': 1.0,
          'Sep 13': 1.0,
          'Sep 14': 1.0,
          'Sep 16': 1.0,
          'Sep 17': 1.0,
          'Sep 20': 1.0,
          'Sep 22': 1.0,
          'Sep 23': 1.0,
          'Sep 24': 1.0,
          'Sep 27': 1.0,
          'Sep 29': 1.0,
        }
      )
    },
    {
      id: 'TS-4071',
      workerId: 'W-88205',
      workerName: 'Ahmed Farooq',
      trade: 'Concrete & Earthworks',
      subTrade: 'Concrete & Earthworks Gang Lead',
      department: 'Heavy Civil & Marine Infrastructure',
      project: 'Project 104 – Riyadh Metro Expansion Site A',
      period: 'Sep 01 – Sep 30, 2026',
      submittedBy: 'Tariq Al-Mansoor (Site Coordinator)',
      submittedAt: 'Sep 29, 2026',
      approvedBy: 'Fahad Al-Husseini (Project Manager)',
      approvedAt: 'Sep 30, 2026 at 09:00 AM',
      rejectionReason: null,
      digitalSeal: 'CERT-MGR-LOCKED-7701',
      status: 'Locked', // Locked at Month-End Cutoff
      regHours: 208.0,
      otHours: 20.0,
      totalHours: 228.0,
      hasWarnings: false,
      warningDetails: null,
      dailyEntries: buildSepDailyEntries(
        [
          'Excavation Dewatering Supervision',
          'Slurry Wall Reinforcement Check',
          'Night Concrete Pour Batching',
          'Rest Day (Weekly Off)',
          'Cube Test Sample Extraction',
          'Pile Cap 10 Formwork Stripping',
          'Site Grade Compaction Test',
          'Backfill Layer 3 Verification',
          'Submersible Pump Maintenance',
          'Retaining Wall Pre-Pour Audit',
          'Rest Day (Weekly Off)',
          'Vibrating Screed Leveling',
          'Curing Compound Application',
          'QA Crack Mapping Survey',
          'Foundation Blinding Layer Pour',
          'Concrete Transit Mixer Slump Testing',
          'Underground Sump Pit Waterproofing',
          'Rest Day (Weekly Off)',
          'Mass Concrete Pour Temperature Log',
          'Post-Pour Wet Burlap Curing Inspection',
          'Trench Shoring Box Relocation',
          'Heavy Earthmover Haul Road Grading',
          'Rebound Hammer Hardness Testing',
          'Formwork Stripping Strength Verification',
          'Rest Day (Weekly Off)',
          'Concrete Surface Grinding & Honeycomb Patch',
          'Basement Retaining Wall Pour Phase 2',
          'Core Drilling Sample Escort',
          'ReadyMix Batch Ticket Reconciliation',
          'Monthly Civil Works Milestone Signoff',
        ],
        {
          'Sep 01': 1.0,
          'Sep 02': 1.0,
          'Sep 03': 2.0,
          'Sep 05': 1.0,
          'Sep 06': 1.0,
          'Sep 08': 1.0,
          'Sep 09': 1.0,
          'Sep 10': 2.0,
          'Sep 12': 1.0,
          'Sep 14': 1.0,
          'Sep 16': 1.0,
          'Sep 17': 1.0,
          'Sep 19': 1.0,
          'Sep 21': 1.0,
          'Sep 23': 1.0,
          'Sep 24': 1.0,
          'Sep 26': 1.0,
          'Sep 28': 1.0,
          'Sep 29': 1.0,
        },
        // All active entries are Locked for the closed month
        {
          'Sep 01': 'Locked', 'Sep 02': 'Locked', 'Sep 03': 'Locked',
          'Sep 05': 'Locked', 'Sep 06': 'Locked', 'Sep 07': 'Locked', 'Sep 08': 'Locked', 'Sep 09': 'Locked', 'Sep 10': 'Locked',
          'Sep 12': 'Locked', 'Sep 13': 'Locked', 'Sep 14': 'Locked', 'Sep 15': 'Locked', 'Sep 16': 'Locked', 'Sep 17': 'Locked',
          'Sep 19': 'Locked', 'Sep 20': 'Locked', 'Sep 21': 'Locked', 'Sep 22': 'Locked', 'Sep 23': 'Locked', 'Sep 24': 'Locked',
          'Sep 26': 'Locked', 'Sep 27': 'Locked', 'Sep 28': 'Locked', 'Sep 29': 'Locked', 'Sep 30': 'Locked',
        }
      )
    },
    {
      id: 'TS-4062',
      workerId: 'W-88207',
      workerName: 'Sarah Al-Qasim',
      trade: 'HSE & Traffic',
      subTrade: 'Senior HSE Safety Marshall',
      department: 'Health, Safety & Environment',
      project: 'Project 104 – Riyadh Metro Expansion Site A',
      period: 'Sep 01 – Sep 30, 2026',
      submittedBy: 'Tariq Al-Mansoor (Site Coordinator)',
      submittedAt: 'Sep 28, 2026',
      approvedBy: null,
      approvedAt: null,
      rejectionReason: 'Disputed OT: 4.0h recorded on Sep 25 (Weekly Off) lacks signed Site Director emergency overtime permit.',
      digitalSeal: null,
      status: 'Rejected', // Returned for Revision
      regHours: 208.0,
      otHours: 22.0,
      totalHours: 230.0,
      hasWarnings: true,
      warningDetails: 'Weekly off overtime entry on Sep 25 unverified by coordinator emergency log.',
      dailyEntries: buildSepDailyEntries(
        [
          'Gate 4 Traffic Flow Management',
          'Concrete Mixer Truck Sequencing',
          'Pedestrian Safe Corridor Inspection',
          'Rest Day (Weekly Off)',
          'Night Shift Perimeter Lighting Check',
          'Heat Stress Advisory Briefing',
          'Scaffolding Tag Color Audit',
          'Hot Work Permit Inspections',
          'First Aid Post Supply Audit',
          'Heavy Crane Lift Perimeter Marshalling',
          'Rest Day (Weekly Off)',
          'Barricade Repair Followup',
          'Spill Kit Station Replenishment',
          'Pedestrian Walkway Rerouting',
          'Pre-Shift Safety Talk Marshalling',
          'Site Speed Radar Monitoring',
          'Subcontractor PPE Enforcement Walk',
          'Rest Day (Weekly Off)',
          'Excavation Edge Protection Audit',
          'Hazardous Chemical Storage Inspection',
          'Emergency Eyewash Station Pressure Test',
          'Fire Extinguisher Monthly Inspection',
          'Night Pour Perimeter Lighting Verification',
          'Security Gate Log Reconciliation',
          'Unverified Friday Emergency Callout',
          'Site Signage Maintenance',
          'Toolbox Talk: Working at Heights',
          'Incident Log Review with Safety Officer',
          'Waste Management & Housekeeping Audit',
          'Monthly HSE Incident Summary Report',
        ],
        {
          'Sep 01': 1.0,
          'Sep 02': 1.0,
          'Sep 05': 2.0,
          'Sep 06': 1.0,
          'Sep 07': 1.0,
          'Sep 08': 1.0,
          'Sep 09': 1.0,
          'Sep 10': 2.0,
          'Sep 12': 1.0,
          'Sep 13': 1.0,
          'Sep 14': 1.0,
          'Sep 15': 1.0,
          'Sep 17': 1.0,
          'Sep 19': 1.0,
          'Sep 21': 1.0,
          'Sep 23': 1.0,
          'Sep 25': 4.0, // Disputed Friday emergency callout
        },
        {
          'Sep 25': 'Disputed',
        }
      )
    }
  ]);

  // ===================================================================
  // APPROVAL AUDIT TRAIL LOG (SEPTEMBER 2026 MONTHLY VETTING)
  // ===================================================================
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUD-9912',
      timestamp: 'Today at 08:35 AM',
      timesheetId: 'TS-4092',
      workerName: 'Soraya Chen',
      action: 'Submitted by Coordinator',
      actor: 'Tariq Al-Mansoor (Site Coordinator)',
      role: 'Site Coordinator',
      details: 'Dispatched 226.0 total hours (208h Reg + 18h OT) for Project 104 September Monthly Timesheet.',
      badgeClass: 'bg-blue-500/15 text-blue-700 border-blue-500/30'
    },
    {
      id: 'AUD-9911',
      timestamp: 'Today at 08:30 AM',
      timesheetId: 'TS-4091',
      workerName: 'Mateo Hernandez',
      action: 'Submitted by Coordinator',
      actor: 'Tariq Al-Mansoor (Site Coordinator)',
      role: 'Site Coordinator',
      details: 'Dispatched 236.0 total hours (208h Reg + 28h OT). High overtime on Sep 24 noted.',
      badgeClass: 'bg-blue-500/15 text-blue-700 border-blue-500/30'
    },
    {
      id: 'AUD-9908',
      timestamp: 'Sep 30, 2026, 16:20 PM',
      timesheetId: 'TS-4085',
      workerName: 'Elena Rostova',
      action: 'Approved & Signed',
      actor: 'Fahad Al-Husseini (Project Manager)',
      role: 'Dept / Project Manager',
      details: 'Approved 232.0 hours after validating harbor crane wind delay log with harbor master.',
      badgeClass: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
    },
    {
      id: 'AUD-9905',
      timestamp: 'Sep 29, 2026, 14:10 PM',
      timesheetId: 'TS-4062',
      workerName: 'Sarah Al-Qasim',
      action: 'Returned with Comment',
      actor: 'Fahad Al-Husseini (Project Manager)',
      role: 'Dept / Project Manager',
      details: 'Returned to Tariq Al-Mansoor: Friday Sep 25 weekly-off overtime unbacked by Site Director slip.',
      badgeClass: 'bg-rose-500/15 text-rose-700 border-rose-500/30'
    },
    {
      id: 'AUD-9892',
      timestamp: 'Sep 30, 2026, 23:59 PM',
      timesheetId: 'TS-4071',
      workerName: 'Ahmed Farooq',
      action: 'Payroll Cutoff Lockdown',
      actor: 'System Automated Scheduler (MOL Compliance)',
      role: 'System Compliance',
      details: 'September monthly payroll closed. Timesheet locked for final Accounts disbursement batch.',
      badgeClass: 'bg-purple-500/15 text-purple-700 border-purple-500/30'
    }
  ]);

  // ===================================================================
  // NOTIFICATIONS LIST (SEPTEMBER CYCLE)
  // ===================================================================
  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-1',
      type: 'submission',
      title: 'September Monthly Timesheets Submitted',
      message: 'Coordinator Tariq Al-Mansoor submitted 3 monthly timesheets for Project 104 awaiting your vetting.',
      time: '15 mins ago',
      read: false,
      priority: 'high',
      icon: 'fact_check'
    },
    {
      id: 'NOTIF-2',
      type: 'warning',
      title: 'Overtime Threshold Exceeded',
      message: 'Mateo Hernandez logged 3.5h OT on Sep 24 (exceeding standard 2.0h daily threshold).',
      time: '1 hour ago',
      read: false,
      priority: 'medium',
      icon: 'warning'
    },
    {
      id: 'NOTIF-3',
      type: 'cutoff',
      title: 'September Payroll Cutoff (Audit Freeze)',
      message: 'September monthly approval window closes on Sep 30, 23:59 AST. Unapproved sheets delay employee payout.',
      time: '3 hours ago',
      read: true,
      priority: 'high',
      icon: 'timer'
    },
    {
      id: 'NOTIF-4',
      type: 'info',
      title: 'Audit Certificate Stamped',
      message: 'Elena Rostova timesheet (TS-4085) successfully locked and queued for Accounts verification.',
      time: 'Yesterday',
      read: true,
      priority: 'low',
      icon: 'verified'
    }
  ]);

  // ===================================================================
  // COMPUTED METRICS & FILTERS
  // ===================================================================
  const pendingCount = timesheets.filter((t) => t.status === 'Submitted').length;
  const approvedCount = timesheets.filter((t) => t.status === 'Approved').length;
  const rejectedCount = timesheets.filter((t) => t.status === 'Rejected').length;
  const lockedCount = timesheets.filter((t) => t.status === 'Locked').length;

  const totalVettedHours = timesheets
    .filter((t) => t.status === 'Approved' || t.status === 'Locked')
    .reduce((sum, t) => sum + t.totalHours, 0);

  const totalOtHoursPending = timesheets
    .filter((t) => t.status === 'Submitted')
    .reduce((sum, t) => sum + t.otHours, 0);

  // Filtered Timesheets
  const filteredTimesheets = useMemo(() => {
    return timesheets.filter((ts) => {
      const matchesStatus = statusFilter === 'all' || ts.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        ts.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ts.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ts.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ts.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ts.subTrade.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [timesheets, statusFilter, searchQuery]);

  // Unread notification count
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // ===================================================================
  // APPROVAL HANDLERS (Business Rules Enforcement)
  // ===================================================================

  // Approve a single timesheet
  const handleApproveTimesheet = (timesheetId) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const auditId = `CERT-MGR-${Math.random().toString(36).substring(2, 7).toUpperCase()}-KSA`;

    setTimesheets((prev) =>
      prev.map((ts) => {
        if (ts.id === timesheetId) {
          return {
            ...ts,
            status: 'Approved',
            approvedBy: 'Fahad Al-Husseini (Project Manager)',
            approvedAt: `Today at ${nowTime}`,
            digitalSeal: auditId,
            rejectionReason: null,
          };
        }
        return ts;
      })
    );

    // Append to Audit Trail
    const target = timesheets.find((ts) => ts.id === timesheetId);
    if (target) {
      setAuditLogs((prev) => [
        {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: `Today at ${nowTime}`,
          timesheetId: target.id,
          workerName: target.workerName,
          action: 'Approved & Signed',
          actor: 'Fahad Al-Husseini (Project Manager)',
          role: 'Dept / Project Manager',
          details: `Approved ${target.totalHours}h (${target.regHours}h Reg + ${target.otHours}h OT) for ${target.period}. Certified digital seal: ${auditId}.`,
          badgeClass: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
        },
        ...prev
      ]);
    }

    if (activeDetailTimesheet && activeDetailTimesheet.id === timesheetId) {
      setActiveDetailTimesheet((prev) => ({
        ...prev,
        status: 'Approved',
        approvedBy: 'Fahad Al-Husseini (Project Manager)',
        approvedAt: `Today at ${nowTime}`,
        digitalSeal: auditId,
      }));
    }

    showToast(`Timesheet ${timesheetId} approved and stamped with digital seal ${auditId}`);
  };

  // Reject / Return a timesheet with mandatory reason
  const handleConfirmReject = () => {
    if (!rejectionComment || !rejectionComment.trim()) {
      showToast('Mandatory rejection comment required before returning timesheet.');
      return;
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetId = rejectingTimesheet.id;

    setTimesheets((prev) =>
      prev.map((ts) => {
        if (ts.id === targetId) {
          return {
            ...ts,
            status: 'Rejected',
            rejectionReason: rejectionComment.trim(),
            approvedBy: null,
            approvedAt: null,
          };
        }
        return ts;
      })
    );

    // Append to Audit Trail
    setAuditLogs((prev) => [
      {
        id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: `Today at ${nowTime}`,
        timesheetId: targetId,
        workerName: rejectingTimesheet.workerName,
        action: 'Returned with Comment',
        actor: 'Fahad Al-Husseini (Project Manager)',
        role: 'Dept / Project Manager',
        details: `Returned to ${rejectingTimesheet.submittedBy}: "${rejectionComment.trim()}"`,
        badgeClass: 'bg-rose-500/15 text-rose-700 border-rose-500/30'
      },
      ...prev
    ]);

    if (activeDetailTimesheet && activeDetailTimesheet.id === targetId) {
      setActiveDetailTimesheet((prev) => ({
        ...prev,
        status: 'Rejected',
        rejectionReason: rejectionComment.trim(),
      }));
    }

    showToast(`Timesheet ${targetId} returned to Coordinator for corrections.`);
    setRejectingTimesheet(null);
    setRejectionComment('');
  };

  // Bulk Approve Selected Timesheets
  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTimesheets((prev) =>
      prev.map((ts) => {
        if (selectedIds.includes(ts.id) && ts.status === 'Submitted') {
          const auditId = `CERT-MGR-${Math.random().toString(36).substring(2, 7).toUpperCase()}-KSA`;
          return {
            ...ts,
            status: 'Approved',
            approvedBy: 'Fahad Al-Husseini (Project Manager)',
            approvedAt: `Today at ${nowTime}`,
            digitalSeal: auditId,
            rejectionReason: null,
          };
        }
        return ts;
      })
    );

    // Add audit log entry
    setAuditLogs((prev) => [
      {
        id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: `Today at ${nowTime}`,
        timesheetId: `Batch (${selectedIds.length})`,
        workerName: `${selectedIds.length} Workers`,
        action: 'Bulk Approved',
        actor: 'Fahad Al-Husseini (Project Manager)',
        role: 'Dept / Project Manager',
        details: `Batch signed and approved ${selectedIds.length} submitted timesheets for ${selectedProject}.`,
        badgeClass: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
      },
      ...prev
    ]);

    showToast(`Batch approved ${selectedIds.length} timesheets successfully.`);
    setSelectedIds([]);
    setShowBulkApproveModal(false);
  };

  // Controlled Reopen of a Locked Timesheet (Audit Requirement)
  const handleConfirmReopen = () => {
    if (!reopenReason || !reopenReason.trim()) {
      showToast('Controlled reopen requires an official compliance justification reason.');
      return;
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetId = reopenTimesheet.id;

    setTimesheets((prev) =>
      prev.map((ts) => {
        if (ts.id === targetId) {
          return {
            ...ts,
            status: 'Submitted', // Unlocks and returns to submitted state for revision
            rejectionReason: `Reopened by Manager: ${reopenReason.trim()}`,
          };
        }
        return ts;
      })
    );

    setAuditLogs((prev) => [
      {
        id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: `Today at ${nowTime}`,
        timesheetId: targetId,
        workerName: reopenTimesheet.workerName,
        action: 'Controlled Reopen',
        actor: 'Fahad Al-Husseini (Project Manager)',
        role: 'Dept / Project Manager',
        details: `Manager override on Locked Timesheet: "${reopenReason.trim()}". Unlocked for review.`,
        badgeClass: 'bg-amber-500/15 text-amber-700 border-amber-500/30'
      },
      ...prev
    ]);

    showToast(`Locked timesheet ${targetId} safely unlocked for administrative review.`);
    setReopenTimesheet(null);
    setReopenReason('');
    if (activeDetailTimesheet && activeDetailTimesheet.id === targetId) {
      setActiveDetailTimesheet((prev) => ({ ...prev, status: 'Submitted' }));
    }
  };

  // Toggle selection for bulk actions
  const toggleSelectTimesheet = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const selectable = filteredTimesheets.filter((t) => t.status === 'Submitted').map((t) => t.id);
    if (selectedIds.length === selectable.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectable);
    }
  };

  // ===================================================================
  // RENDER COMPONENT
  // ===================================================================
  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-secondary selection:text-white"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0E1330] border border-secondary text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SIDEBAR NAVIGATION: Dept Manager Reviewer Suite           */}
      {/* ======================================================== */}
      <aside className={`fixed top-0 h-full w-64 bg-gradient-to-b from-[#131943] via-[#0E1330] to-[#0A0D26] border-r border-[#1E2554] z-50 flex flex-col justify-between shadow-2xl ${isRtl ? 'right-0 border-l border-r-0' : 'left-0'}`}>
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
            <div className="h-16 px-4 sm:px-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img alt="Expertise" className="h-10 w-auto max-w-[160px] object-contain" src={logoImg} />
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded font-bold shrink-0">
                  OS
                </span>
              </div>
            </div>

            {/* Active Facility / Scope Widget inside the Fading Transition Zone */}
            <div className="p-3 pt-1 pb-4">
              <div className="bg-[#0E1330]/75 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                    Assigned Scope
                  </span>
                  <span className="h-2 w-2 rounded-full bg-secondary shadow-sm shadow-secondary/60 animate-pulse"></span>
                </div>
                <button className="w-full flex items-center justify-between text-left group" type="button">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[17px] text-secondary">domain</span>
                    <span className="font-body-md-medium text-xs font-semibold text-white truncate">
                      Project 104 – Metro
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[15px] text-white/50 group-hover:text-white transition-colors">
                    unfold_more
                  </span>
                </button>
                <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between">
                  <span className="font-data-mono text-[11px] text-white/80 font-medium">Site A (Reviewer)</span>
                  <span className="font-label-sm text-[10px] font-bold text-[#F18E3B] bg-secondary/20 border border-secondary/40 px-1.5 py-0.5 rounded">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="px-4 py-1.5 mt-1">
            <span className="font-label-sm text-[10.5px] uppercase text-white/45 tracking-wider font-semibold">
              Management Suites
            </span>
          </div>

          <nav className="px-3 space-y-1.5 pb-3">
            {[
              { id: 'dashboard', label: t.navDashboard, icon: 'dashboard', badge: pendingCount > 0 ? pendingCount : null },
              { id: 'queue', label: t.navQueue, icon: 'fact_check', badge: pendingCount },
              { id: 'audit', label: t.navAudit, icon: 'history_edu', badge: null },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 font-body-md text-left group border ${
                    isActive
                      ? 'bg-gradient-to-r from-white to-[#F8FAFC] text-[#0E1330] font-semibold shadow-[0_4px_16px_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.25)] border-white hover:bg-white hover:scale-[1.01]'
                      : 'text-slate-300 border-transparent hover:text-white hover:bg-white/[0.14] hover:border-white/20 hover:shadow-xs backdrop-blur-xs'
                  }`}
                  data-path={item.id}
                  type="button"
                >
                  <div className="flex items-center">
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
                  </div>

                  {item.badge !== null && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        isActive
                          ? 'bg-[#E97F29] text-white shadow-xs'
                          : 'bg-[#E97F29]/20 text-[#F18E3B] border border-[#E97F29]/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer on Dark Blue Background */}
        <div className="p-3 border-t border-white/10 flex flex-col gap-2">
          {/* Quick Cutoff Warning Box */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-white/90 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">timer</span>
                Payroll Cutoff
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-200">Sep 30 Close</span>
            </div>
            <p className="text-[10.5px] text-white/70 leading-tight">
              Monthly cutoff: Sep 30, 23:59 AST. Vetting window active.
            </p>
          </div>

          {/* Active Role / Persona Card */}
          <div className="bg-white/[0.05] hover:bg-white/[0.09] hover:border-secondary/40 transition-all rounded-xl p-2.5 border border-white/10 flex items-center justify-between group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#E97F29] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                FA
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-body-md-medium text-xs font-semibold text-white truncate">
                  Fahad Al-Husseini
                </span>
                <span className="font-label-sm text-[10px] text-white/50 truncate">
                  {t.roleLabel}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>

          <div className="flex items-center justify-between px-1 text-white/40 text-[10.5px]">
            <span className="font-label-sm uppercase tracking-wide">Build v4.82-MGR</span>
            <span className="material-symbols-outlined text-[15px] text-white/40 hover:text-white cursor-pointer transition-colors">
              help_outline
            </span>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ======================================================== */}
      <div className={`transition-all duration-300 min-h-screen ${isRtl ? 'mr-64' : 'ml-64'}`}>
        {/* Top Navbar */}
        <header className={`fixed top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/60 h-[70px] flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${isRtl ? 'right-64 left-0' : 'left-64 right-0'}`}>
          {/* Breadcrumb & Project Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
              <span>Enterprise Workforce OS</span>
              <span className="text-outline">/</span>
              <span className="text-on-surface font-semibold">{t.portalName}</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-1.5 text-xs">
              <span className="material-symbols-outlined text-[15px] text-secondary">date_range</span>
              <span className="font-semibold text-on-surface">{selectedPeriod}</span>
            </div>
          </div>

          {/* Top Actions: Language, Notification Drawer, Role Switcher, Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-surface-container-low border border-outline-variant/60 rounded-xl p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('EN')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === 'EN' ? 'bg-secondary text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('AR')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === 'AR' ? 'bg-secondary text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                العربية
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container text-on-surface transition-colors"
                title={t.notificationsTitle}
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className={`absolute top-12 z-50 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-2xl p-4 space-y-3 ${isRtl ? 'left-0' : 'right-0'}`}>
                  <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">{t.notificationsTitle}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-secondary/15 text-secondary">
                        {unreadNotifCount} new
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                        showToast(t.btnMarkRead);
                      }}
                      className="text-[11px] font-bold text-secondary hover:underline"
                    >
                      {t.btnMarkRead}
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-outline-variant/20">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`pt-2 flex items-start gap-2.5 p-2 rounded-xl transition-colors ${
                          !notif.read ? 'bg-secondary/[0.04]' : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                            notif.priority === 'high'
                              ? 'bg-rose-500/15 text-rose-600'
                              : notif.priority === 'medium'
                              ? 'bg-amber-500/15 text-amber-600'
                              : 'bg-blue-500/15 text-blue-600'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">{notif.icon}</span>
                        </div>
                        <div className="flex flex-col space-y-0.5 flex-1">
                          <span className="text-xs font-bold text-on-surface leading-snug">{notif.title}</span>
                          <p className="text-[11px] text-on-surface-variant leading-relaxed">{notif.message}</p>
                          <span className="text-[9.5px] font-mono text-on-surface-variant/70">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Dropdown */}
            <div className="flex items-center bg-surface-container-low border border-outline-variant/60 rounded-xl px-2.5 py-1 text-xs font-bold">
              <span className="material-symbols-outlined text-[15px] text-secondary mr-1">sync_alt</span>
              <select
                defaultValue="Role: Dept Manager"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'Role: Site Coordinator') {
                    onSwitchRole({
                      roleKey: 'site_coord',
                      email: 'site.coordinator@expertise.sa',
                      profile: { id: 'site_coord', label: 'Site Coordinator' }
                    });
                  } else if (val === 'Role: Accounts & Release') {
                    onSwitchRole({
                      roleKey: 'accounts',
                      email: 'approvals.accounts@expertise.sa',
                      profile: { id: 'accounts', label: 'Accounts & Release' }
                    });
                  } else if (val === 'Role: HR & Onboarding') {
                    onSwitchRole({
                      roleKey: 'hr',
                      email: 'onboarding.hr@expertise.sa',
                      profile: { id: 'hr', label: 'HR & Onboarding' }
                    });
                  } else if (val === 'Role: Cashier & Payout') {
                    onSwitchRole({
                      roleKey: 'cashier',
                      email: 'paymaster.cashier@expertise.sa',
                      profile: { id: 'cashier', label: 'Cashier & Payout' }
                    });
                  }
                }}
                className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="Role: Dept Manager">Role: Dept Manager</option>
                <option value="Role: Cashier & Payout">Role: Cashier &amp; Payout</option>
                <option value="Role: Site Coordinator">Role: Site Coordinator</option>
                <option value="Role: Accounts & Release">Role: Accounts &amp; Release</option>
                <option value="Role: HR & Onboarding">Role: HR &amp; Onboarding</option>
              </select>
            </div>

            {/* Profile Avatar */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-outline-variant/60">
              <div className="w-8 h-8 rounded-xl bg-secondary text-white font-bold text-xs flex items-center justify-center shadow-xs">
                FA
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-on-surface leading-tight">Fahad Al-Husseini</span>
                <span className="text-[10px] text-on-surface-variant font-mono">Lead Approver</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="pt-[86px] px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
          {/* ======================================================== */}
          {/* EXECUTIVE AURORA HERO BANNER: Dept Manager Workspace      */}
          {/* ======================================================== */}
          <div className="bg-aurora-animated border border-white/10 rounded-2xl p-5 lg:p-6 shadow-xl relative overflow-hidden text-white transition-all duration-300">
            <div className="aurora-orb-1 absolute -right-12 -top-12 w-96 h-96 bg-[#E97F29]/30 rounded-full pointer-events-none blur-3xl"></div>
            <div className="aurora-orb-2 absolute right-72 -bottom-24 w-80 h-80 bg-[#353D80]/50 rounded-full pointer-events-none blur-3xl"></div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
              {/* Title & Scope */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-secondary/30 text-amber-200 border border-secondary/40 uppercase tracking-wider">
                    {t.cutoffAlert}
                  </span>
                  <span className="text-[11px] text-white/70 font-mono">
                    {selectedProject}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                  Department &amp; Project{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F7A65E]">
                    Timesheet Approval Hub
                  </span>
                </h1>

                <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed">
                  Review and verify physical hours and overtime submitted by Site Coordinators. Approved sheets proceed to Accounts for payroll batch execution.
                </p>

                {/* Telemetry Quick Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>{pendingCount} Timesheets Pending Vetting</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>{approvedCount} Approved This Cycle</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md">
                    <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
                    <span>{totalVettedHours.toFixed(1)}h Total Certified Hours</span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('queue')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-secondary/30 transition-all active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[17px]">fact_check</span>
                  <span>Open Approval Queue ({pendingCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Exported Department Approvals Audit Dossier (PDF)')}
                  className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs backdrop-blur-md"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  <span>{t.btnExport}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: APPROVAL OVERVIEW / DASHBOARD                      */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Pending Approvals */}
                <div
                  onClick={() => {
                    setStatusFilter('submitted');
                    setActiveTab('queue');
                  }}
                  className="bg-surface-container-lowest p-4 rounded-2xl border border-amber-500/30 hover:border-amber-500 shadow-xs cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {t.kpiPending}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-on-surface">{pendingCount}</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded">
                      Action Required
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Submitted by Site Coordinator awaiting your signature.
                  </p>
                </div>

                {/* 2. Approved This Month */}
                <div
                  onClick={() => {
                    setStatusFilter('approved');
                    setActiveTab('queue');
                  }}
                  className="bg-surface-container-lowest p-4 rounded-2xl border border-emerald-500/30 hover:border-emerald-500 shadow-xs cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {t.kpiApproved}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-on-surface">{approvedCount}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Certified
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Ready for Accounts payroll batch processing.
                  </p>
                </div>

                {/* 3. Rejected / Returned */}
                <div
                  onClick={() => {
                    setStatusFilter('rejected');
                    setActiveTab('queue');
                  }}
                  className="bg-surface-container-lowest p-4 rounded-2xl border border-rose-500/30 hover:border-rose-500 shadow-xs cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {t.kpiRejected}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">replay</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-on-surface">{rejectedCount}</span>
                    <span className="text-xs font-bold text-rose-700 bg-rose-500/10 px-2 py-0.5 rounded">
                      In Revision
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Returned to Coordinator with mandatory variance note.
                  </p>
                </div>

                {/* 4. Total Certified Work Hours */}
                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {t.kpiTotalHours}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-on-surface">
                      {totalVettedHours.toFixed(1)}h
                    </span>
                    <span className="text-xs font-mono text-on-surface-variant">
                      ({totalOtHoursPending.toFixed(1)}h OT Pending)
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Net hours verified under Project 104 scope.
                  </p>
                </div>
              </div>

              {/* Month-End Cutoff Reminder Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">event_busy</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-950">
                      Month-End MOL Cutoff: September 2026 Monthly Cycle
                    </h3>
                    <p className="text-xs text-amber-900/80 mt-0.5 max-w-2xl leading-relaxed">
                      Department Manager vetting closes strictly on <strong>September 30 at 23:59 AST</strong>. All unapproved timesheets will automatically freeze to prevent payroll delays for subcontractor personnel.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('submitted');
                    setActiveTab('queue');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition-all shrink-0"
                >
                  Review Pending Queue ({pendingCount})
                </button>
              </div>

              {/* Recent Pending Approvals Table Preview */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden">
                <div className="p-4 bg-surface-container-low/70 border-b border-outline-variant/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                      Timesheets Awaiting Your Signature
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 font-mono">
                      {pendingCount} urgent
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('queue')}
                    className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                  >
                    <span>View Full Queue</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-low/40 text-on-surface-variant font-bold border-b border-outline-variant/30">
                      <tr>
                        <th className="p-3.5">{t.thWorker}</th>
                        <th className="p-3.5">{t.thCoordinator}</th>
                        <th className="p-3.5 text-center">{t.thRegHours}</th>
                        <th className="p-3.5 text-center">{t.thOtHours}</th>
                        <th className="p-3.5 text-center">{t.thTotalHours}</th>
                        <th className="p-3.5 text-center">{t.thStatus}</th>
                        <th className="p-3.5 text-right">{t.thActions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {timesheets
                        .filter((ts) => ts.status === 'Submitted')
                        .map((ts) => (
                          <tr key={ts.id} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface font-bold text-[11px] flex items-center justify-center">
                                  {ts.workerName.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-on-surface">{ts.workerName}</span>
                                    <span className="font-mono text-[10.5px] text-on-surface-variant">({ts.workerId})</span>
                                  </div>
                                  <span className="text-[11px] text-on-surface-variant">{ts.subTrade}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 text-on-surface-variant">
                              <div className="flex flex-col">
                                <span className="font-semibold text-on-surface">{ts.submittedBy.split('(')[0]}</span>
                                <span className="text-[10px] font-mono">{ts.submittedAt}</span>
                              </div>
                            </td>
                            <td className="p-3.5 text-center font-mono font-bold text-on-surface">{ts.regHours}h</td>
                            <td className="p-3.5 text-center font-mono font-bold text-amber-600">
                              +{ts.otHours}h
                              {ts.hasWarnings && (
                                <span className="ml-1 text-rose-500 font-bold" title={ts.warningDetails}>⚠️</span>
                              )}
                            </td>
                            <td className="p-3.5 text-center font-mono font-bold text-on-surface bg-surface-container-low/20">
                              {ts.totalHours}h
                            </td>
                            <td className="p-3.5 text-center">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30">
                                {t.statusSubmitted}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setActiveDetailTimesheet(ts)}
                                  className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-xs"
                                >
                                  {t.btnViewDetails}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleApproveTimesheet(ts.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
                                >
                                  Approve
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: TIMESHEET APPROVAL QUEUE                           */}
          {/* ======================================================== */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              {/* Queue Header & Filters */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by worker name, ID, timesheet ID, or trade..."
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: 'All Statuses' },
                    { id: 'submitted', label: `Pending (${pendingCount})` },
                    { id: 'approved', label: `Approved (${approvedCount})` },
                    { id: 'rejected', label: `Returned (${rejectedCount})` },
                    { id: 'locked', label: `Locked (${lockedCount})` },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setStatusFilter(filter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        statusFilter === filter.id
                          ? 'bg-secondary text-white shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk Actions Banner (When items are selected) */}
              {selectedIds.length > 0 && (
                <div className="bg-gradient-to-r from-[#131943] to-[#1E2554] text-white p-3.5 rounded-xl shadow-md flex items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-[11px]">
                      {selectedIds.length}
                    </span>
                    <span>timesheets selected for batch review</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedIds([])}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                    >
                      Deselect All
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBulkApproveModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>{t.btnBulkApprove} ({selectedIds.length})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Timesheets Data Table */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-low/50 text-on-surface-variant font-bold border-b border-outline-variant/40">
                      <tr>
                        <th className="p-3.5 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={
                              filteredTimesheets.filter((t) => t.status === 'Submitted').length > 0 &&
                              selectedIds.length === filteredTimesheets.filter((t) => t.status === 'Submitted').length
                            }
                            onChange={toggleSelectAll}
                            className="h-4 w-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                          />
                        </th>
                        <th className="p-3.5">Timesheet Ref &amp; Employee</th>
                        <th className="p-3.5">Trade &amp; Department</th>
                        <th className="p-3.5 text-center">Reg Hours</th>
                        <th className="p-3.5 text-center">OT Hours</th>
                        <th className="p-3.5 text-center">Total Hours</th>
                        <th className="p-3.5 text-center">{t.thStatus}</th>
                        <th className="p-3.5 text-right">{t.thActions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {filteredTimesheets.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="p-8 text-center text-on-surface-variant">
                            No timesheets found matching your query or filter.
                          </td>
                        </tr>
                      ) : (
                        filteredTimesheets.map((ts) => {
                          const isSelected = selectedIds.includes(ts.id);
                          return (
                            <tr
                              key={ts.id}
                              className={`hover:bg-surface-container-low/30 transition-colors ${
                                isSelected ? 'bg-secondary/[0.04]' : ''
                              }`}
                            >
                              <td className="p-3.5 text-center">
                                {ts.status === 'Submitted' && (
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelectTimesheet(ts.id)}
                                    className="h-4 w-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                                  />
                                )}
                              </td>
                              <td className="p-3.5">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-secondary font-bold">{ts.id}</span>
                                    <span className="font-bold text-on-surface">{ts.workerName}</span>
                                    <span className="font-mono text-[10px] text-on-surface-variant">({ts.workerId})</span>
                                  </div>
                                  <span className="text-[10.5px] text-on-surface-variant mt-0.5">
                                    Submitted by: {ts.submittedBy.split('(')[0]}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-on-surface">{ts.subTrade}</span>
                                  <span className="text-[10px] text-on-surface-variant">{ts.department}</span>
                                </div>
                              </td>
                              <td className="p-3.5 text-center font-mono font-bold text-on-surface">
                                {ts.regHours}h
                              </td>
                              <td className="p-3.5 text-center font-mono font-bold text-amber-600">
                                +{ts.otHours}h
                                {ts.hasWarnings && (
                                  <span className="ml-1 text-rose-500 font-bold" title={ts.warningDetails}>⚠️</span>
                                )}
                              </td>
                              <td className="p-3.5 text-center font-mono font-bold text-on-surface bg-surface-container-low/30">
                                {ts.totalHours}h
                              </td>
                              <td className="p-3.5 text-center">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                    ts.status === 'Approved'
                                      ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                                      : ts.status === 'Submitted'
                                      ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                                      : ts.status === 'Locked'
                                      ? 'bg-purple-500/10 text-purple-700 border-purple-500/30'
                                      : 'bg-rose-500/10 text-rose-700 border-rose-500/30'
                                  }`}
                                >
                                  {ts.status === 'Approved'
                                    ? t.statusApproved
                                    : ts.status === 'Submitted'
                                    ? t.statusSubmitted
                                    : ts.status === 'Locked'
                                    ? t.statusLocked
                                    : t.statusRejected}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setActiveDetailTimesheet(ts)}
                                    className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-xs"
                                  >
                                    Review
                                  </button>

                                  {ts.status === 'Submitted' && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleApproveTimesheet(ts.id)}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setRejectingTimesheet(ts)}
                                        className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700"
                                        title="Reject with comment"
                                      >
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                      </button>
                                    </>
                                  )}

                                  {ts.status === 'Locked' && (
                                    <button
                                      type="button"
                                      onClick={() => setReopenTimesheet(ts)}
                                      className="px-2 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-[11px] flex items-center gap-1"
                                      title="Controlled Administrative Reopen"
                                    >
                                      <span className="material-symbols-outlined text-[13px]">lock_open</span>
                                      <span>Reopen</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}



          {/* ======================================================== */}
          {/* TAB 4: APPROVAL AUDIT TRAIL LOG                           */}
          {/* ======================================================== */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-on-surface">{t.navAudit}</h2>
                  <p className="text-xs text-on-surface-variant">
                    Cryptographic audit trail tracking all coordinator submissions, manager approvals, and rejection notes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Exported Full Statutory Audit Log (CSV)')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container text-xs font-bold text-on-surface"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span>Export Audit CSV</span>
                </button>
              </div>

              {/* Audit Entries List */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden divide-y divide-outline-variant/20">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-surface-container-low/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-secondary">{log.id}</span>
                          <span className="font-bold text-on-surface text-xs">{log.action}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${log.badgeClass}`}>
                            {log.timesheetId}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface leading-relaxed">{log.details}</p>
                        <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-on-surface-variant font-mono">
                          <span>Actor: <strong>{log.actor}</strong></span>
                          <span>•</span>
                          <span>Worker: {log.workerName}</span>
                          <span>•</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: TIMESHEET DETAIL & DAILY ENTRIES REVIEW          */}
      {/* ======================================================== */}
      {activeDetailTimesheet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#131943] via-[#0E1330] to-[#1A1F45] text-white flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">calendar_month</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      Timesheet {activeDetailTimesheet.id}: {activeDetailTimesheet.workerName}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-500/40 font-mono">
                      {activeDetailTimesheet.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mt-0.5">
                    {activeDetailTimesheet.trade} • {activeDetailTimesheet.period} • Ref: {activeDetailTimesheet.workerId}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveDetailTimesheet(null)}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Validation Warning Alert (if any) */}
            {activeDetailTimesheet.hasWarnings && (
              <div className="p-3 bg-amber-500/10 border-b border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-900 shrink-0">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">warning</span>
                <span><strong>Overtime Compliance Notice:</strong> {activeDetailTimesheet.warningDetails}</span>
              </div>
            )}

            {/* Daily Entries Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Daily Work Log &amp; Task Allocation
                </span>
                <span className="text-xs font-mono font-bold text-on-surface-variant">
                  Total: {activeDetailTimesheet.regHours}h Reg + {activeDetailTimesheet.otHours}h OT = <strong>{activeDetailTimesheet.totalHours}h</strong>
                </span>
              </div>

              <div className="rounded-xl border border-outline-variant/40 overflow-hidden max-h-[52vh] overflow-y-auto shadow-inner">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-low text-on-surface-variant font-bold border-b border-outline-variant/30 sticky top-0 z-10 shadow-xs">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Assigned Task / Work Package</th>
                      <th className="p-2.5 text-center">Reg Hours</th>
                      <th className="p-2.5 text-center">OT Hours</th>
                      <th className="p-2.5 text-right">Day Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {activeDetailTimesheet.dailyEntries.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-low/20">
                        <td className="p-2.5 font-mono">
                          <strong className="text-on-surface">{entry.date}</strong> ({entry.day})
                        </td>
                        <td className="p-2.5 text-on-surface font-medium">{entry.task}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-on-surface">{entry.regHours}h</td>
                        <td className="p-2.5 text-center font-mono font-bold text-amber-600">
                          {entry.otHours > 0 ? `+${entry.otHours}h` : '--'}
                        </td>
                        <td className="p-2.5 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              entry.status === 'Verified'
                                ? 'bg-emerald-500/10 text-emerald-700'
                                : entry.status === 'Rest'
                                ? 'bg-surface-container text-on-surface-variant'
                                : 'bg-rose-500/10 text-rose-700'
                            }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-surface-container-low/70 border-t border-outline-variant/40 flex items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-on-surface-variant">
                Submitted by: <strong>{activeDetailTimesheet.submittedBy}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDetailTimesheet(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container"
                >
                  Close
                </button>

                {activeDetailTimesheet.status === 'Submitted' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectingTimesheet(activeDetailTimesheet);
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 text-xs font-bold transition-all"
                    >
                      Reject with Reason
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveTimesheet(activeDetailTimesheet.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
                    >
                      Approve &amp; Sign Timesheet
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: MANDATORY REJECTION REASON MODAL                 */}
      {/* ======================================================== */}
      {rejectingTimesheet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-outline-variant/40 pb-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">replay</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Return Timesheet for Revision</h3>
                <span className="text-[11px] text-on-surface-variant">
                  {rejectingTimesheet.workerName} ({rejectingTimesheet.id})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                Mandatory Correction Reason / Note
              </label>
              <textarea
                rows="4"
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                placeholder="Explain the specific error, missing permit, or disputed hours for the Site Coordinator..."
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-rose-500"
              ></textarea>
              <p className="text-[10.5px] text-on-surface-variant">
                This note will be logged in the permanent audit trail and sent back to Coordinator {rejectingTimesheet.submittedBy.split('(')[0]}.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => {
                  setRejectingTimesheet(null);
                  setRejectionComment('');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all"
              >
                Confirm Return to Coordinator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: CONTROLLED ADMINISTRATIVE REOPEN FOR LOCKED SHEET*/}
      {/* ======================================================== */}
      {reopenTimesheet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-outline-variant/40 pb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">lock_open</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Administrative Timesheet Reopen</h3>
                <span className="text-[11px] text-on-surface-variant">
                  {reopenTimesheet.workerName} ({reopenTimesheet.id})
                </span>
              </div>
            </div>

            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-800 space-y-1">
              <strong>Statutory Compliance Warning:</strong>
              <p className="text-[11px] text-rose-700">
                This timesheet was locked for payroll cutoff. Reopening it requires a documented reason for the Ministry of Labor (MOL) audit log.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                Reopen Justification Reason
              </label>
              <textarea
                rows="3"
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="Reason for reopening after payroll cutoff..."
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-amber-500"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => {
                  setReopenTimesheet(null);
                  setReopenReason('');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReopen}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition-all"
              >
                Confirm Controlled Reopen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: BATCH APPROVE CONFIRMATION MODAL                 */}
      {/* ======================================================== */}
      {showBulkApproveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-outline-variant/40 pb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Batch Sign &amp; Approve Timesheets</h3>
                <span className="text-[11px] text-on-surface-variant">
                  {selectedIds.length} submitted timesheets selected
                </span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              You are about to approve <strong>{selectedIds.length}</strong> timesheets. By confirming, you certify that the regular hours and overtime recorded by the Site Coordinator are accurate for Project 104 scope.
            </p>

            <div className="p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Approver:</span>
                <strong className="text-on-surface">Fahad Al-Husseini (Project Manager)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Project Scope:</span>
                <strong className="text-on-surface">Riyadh Metro Expansion Site A</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setShowBulkApproveModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkApprove}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
              >
                Sign &amp; Approve All ({selectedIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
  );
}
