import React, { useState, useMemo } from 'react';

export default function HourlyRates() {
  // Navigation / View Tabs
  const [activeTab, setActiveTab] = useState('employees'); // 'employees' | 'bands' | 'calculator'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Modals & Drawers
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isNewBandModalOpen, setIsNewBandModalOpen] = useState(false);
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

  // Suppliers / Agencies List
  const suppliersList = [
    'Direct / In-House',
    'BuildTech Manpower LLC',
    'Gulf Apex Resources',
    'Prime Infra Solutions Group',
    'Empire Logistics Technical',
  ];

  // Rate Tier Benchmark Bands Master
  const [rateBands, setRateBands] = useState([
    {
      id: 'BAND-EXEC',
      name: 'Superintendent & Site Executive',
      department: 'Civil & Heavy Framing',
      minRateSAR: 42.00,
      baseRateSAR: 45.00,
      capRateSAR: 55.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 6.00,
      hazardAllowanceSAR: 8.00,
      workersCount: 28,
      status: 'Active',
      description: 'Senior project supervisors, chief site engineers, and field superintendents with full signature authority.',
    },
    {
      id: 'BAND-WELD-L3',
      name: 'AWS Certified Master Welder L3',
      department: 'Structural Steel & Welding',
      minRateSAR: 32.00,
      baseRateSAR: 36.50,
      capRateSAR: 42.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 5.00,
      hazardAllowanceSAR: 7.50,
      workersCount: 64,
      status: 'Active',
      description: 'High-pressure certified structural welders with ASME & AWS D1.1 certifications for heavy terminal girders.',
    },
    {
      id: 'BAND-ELEC-HV',
      name: 'High Voltage Electrical Specialist',
      department: 'MEP & Electrical Systems',
      minRateSAR: 34.00,
      baseRateSAR: 38.50,
      capRateSAR: 46.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 5.50,
      hazardAllowanceSAR: 6.00,
      workersCount: 52,
      status: 'Active',
      description: 'Substation integration, high-voltage transformer feeds, switchgear testing, and SCADA automation.',
    },
    {
      id: 'BAND-HVAC-BMS',
      name: 'HVAC & Mechanical Building Systems',
      department: 'MEP & Electrical Systems',
      minRateSAR: 26.00,
      baseRateSAR: 29.50,
      capRateSAR: 35.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 4.00,
      hazardAllowanceSAR: 4.50,
      workersCount: 76,
      status: 'Active',
      description: 'Terminal chillers, central air handlers, ventilation balancing, and industrial piping technicians.',
    },
    {
      id: 'BAND-HSE-QA',
      name: 'OSHA-30 Safety & QA Marshall',
      department: 'HSE Safety & Quality Compliance',
      minRateSAR: 28.00,
      baseRateSAR: 31.00,
      capRateSAR: 38.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 4.50,
      hazardAllowanceSAR: 5.00,
      workersCount: 45,
      status: 'Active',
      description: 'On-site compliance inspectors, zero-tolerance safety marshalls, and hazardous work permit verifiers.',
    },
    {
      id: 'BAND-CRANE-OP',
      name: 'Heavy Rigging & Tower Crane Operator',
      department: 'Fleet Logistics & Heavy Rigging',
      minRateSAR: 31.00,
      baseRateSAR: 35.00,
      capRateSAR: 44.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 6.00,
      hazardAllowanceSAR: 8.00,
      workersCount: 42,
      status: 'Active',
      description: 'Heavy dual-line crawler crane operators, tandem lifting leads, and port transit logistics coordinators.',
    },
    {
      id: 'BAND-EXCAV-OP',
      name: 'Subterranean Excavation Tech',
      department: 'Excavation & Ground Preparation',
      minRateSAR: 24.00,
      baseRateSAR: 27.50,
      capRateSAR: 33.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 3.50,
      hazardAllowanceSAR: 5.00,
      workersCount: 58,
      status: 'Active',
      description: 'Trenching, laser grading, soil stabilization drillers, and foundation earthwork machinery operators.',
    },
    {
      id: 'BAND-CIV-FORM',
      name: 'Structural Concrete & Formwork Lead',
      department: 'Civil & Heavy Framing',
      minRateSAR: 25.00,
      baseRateSAR: 28.50,
      capRateSAR: 34.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 4.00,
      hazardAllowanceSAR: 4.00,
      workersCount: 55,
      status: 'Active',
      description: 'Rebar placement inspectors, hydraulic formwork technicians, and high-pour concrete finishing leads.',
    },
  ]);

  // Master Seed Employees with Compensation Profiles
  const [employees, setEmployees] = useState([
    {
      id: 'EMP-1001',
      name: 'Rayan Abdullah Al-Dosari',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Heavy Civil Superintendent',
      department: 'Civil & Heavy Framing',
      supplier: 'Direct / In-House',
      rateBand: 'BAND-EXEC',
      tier: 'Tier A (Leadership)',
      hourlyRateSAR: 45.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 6.00,
      hazardAllowanceSAR: 8.00,
      effectiveDate: '2026-01-15',
      lastRevisionNote: 'Annual executive band adjustment approved by Marcus Sterling.',
      status: 'Approved',
      shiftType: 'Day Shift (Standard)',
      hoursWorkedMTD: 154,
    },
    {
      id: 'EMP-1002',
      name: 'Mateo Lucas Hernandez',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Level 3 Master Welder',
      department: 'Structural Steel & Welding',
      supplier: 'BuildTech Manpower LLC',
      rateBand: 'BAND-WELD-L3',
      tier: 'Tier B (Senior Tech)',
      hourlyRateSAR: 36.50,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 5.00,
      hazardAllowanceSAR: 7.50,
      effectiveDate: '2026-02-01',
      lastRevisionNote: 'Acquired AWS D1.1 renewal with high-altitude rating.',
      status: 'Approved',
      shiftType: 'Night Shift (+Diff)',
      hoursWorkedMTD: 168,
    },
    {
      id: 'EMP-1003',
      name: 'Soraya Maria Santos',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'HVAC Specialist & BMS Operator',
      department: 'MEP & Electrical Systems',
      supplier: 'Gulf Apex Resources',
      rateBand: 'BAND-HVAC-BMS',
      tier: 'Tier C (Standard)',
      hourlyRateSAR: 29.50,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 4.00,
      hazardAllowanceSAR: 4.50,
      effectiveDate: '2026-03-10',
      lastRevisionNote: 'Standard onboarding contract rate aligned with Gulf Apex SLA.',
      status: 'Approved',
      shiftType: 'Day Shift (Standard)',
      hoursWorkedMTD: 160,
    },
    {
      id: 'EMP-1004',
      name: 'Tariq Mansoor Al-Zahrani',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Electrical Systems Engineer',
      department: 'MEP & Electrical Systems',
      supplier: 'Direct / In-House',
      rateBand: 'BAND-ELEC-HV',
      tier: 'Tier A (Leadership)',
      hourlyRateSAR: 38.50,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 5.50,
      hazardAllowanceSAR: 6.00,
      effectiveDate: '2026-01-20',
      lastRevisionNote: 'Assigned as Primary Substation North Authorization Officer.',
      status: 'Approved',
      shiftType: 'Day Shift (Standard)',
      hoursWorkedMTD: 172,
    },
    {
      id: 'EMP-1005',
      name: 'Muhammad Farhan',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Certified High-Pressure Welder',
      department: 'Structural Steel & Welding',
      supplier: 'Prime Infra Solutions Group',
      rateBand: 'BAND-WELD-L3',
      tier: 'Tier B (Senior Tech)',
      hourlyRateSAR: 35.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 5.00,
      hazardAllowanceSAR: 7.50,
      effectiveDate: '2026-02-15',
      lastRevisionNote: 'Prime Infra contractual revision Tier 2 benchmark parity.',
      status: 'Pending Review',
      shiftType: 'Rotational 24/7',
      hoursWorkedMTD: 182,
    },
    {
      id: 'EMP-1006',
      name: 'Kwame Mensah',
      photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Excavation & Trenching Lead',
      department: 'Excavation & Ground Preparation',
      supplier: 'Empire Logistics Technical',
      rateBand: 'BAND-EXCAV-OP',
      tier: 'Tier C (Standard)',
      hourlyRateSAR: 27.50,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 3.50,
      hazardAllowanceSAR: 5.00,
      effectiveDate: '2026-01-05',
      lastRevisionNote: 'Standard prevailing wage classification for ground utilities.',
      status: 'Approved',
      shiftType: 'Day Shift (Standard)',
      hoursWorkedMTD: 158,
    },
    {
      id: 'EMP-1007',
      name: 'Elena Rostova',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'HSE Compliance Lead Inspector',
      department: 'HSE Safety & Quality Compliance',
      supplier: 'Direct / In-House',
      rateBand: 'BAND-HSE-QA',
      tier: 'Tier B (Senior Tech)',
      hourlyRateSAR: 33.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 4.50,
      hazardAllowanceSAR: 5.00,
      effectiveDate: '2026-02-28',
      lastRevisionNote: 'Completed NEBOSH International Diploma credential update.',
      status: 'Approved',
      shiftType: 'Day Shift (Standard)',
      hoursWorkedMTD: 165,
    },
    {
      id: 'EMP-1008',
      name: 'Ibrahim Al-Zahrani',
      photo: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Fleet Rigging Superintendent',
      department: 'Fleet Logistics & Heavy Rigging',
      supplier: 'Direct / In-House',
      rateBand: 'BAND-CRANE-OP',
      tier: 'Tier A (Leadership)',
      hourlyRateSAR: 37.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 6.00,
      hazardAllowanceSAR: 8.00,
      effectiveDate: '2026-03-01',
      lastRevisionNote: 'Added tandem heavy-haul transport coordination responsibilities.',
      status: 'Approved',
      shiftType: 'Day Shift (Standard)',
      hoursWorkedMTD: 170,
    },
    {
      id: 'EMP-1009',
      name: 'Carlos Mendez Rodriguez',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Structural Concrete Formwork Tech',
      department: 'Civil & Heavy Framing',
      supplier: 'BuildTech Manpower LLC',
      rateBand: 'BAND-CIV-FORM',
      tier: 'Tier C (Standard)',
      hourlyRateSAR: 28.50,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 4.00,
      hazardAllowanceSAR: 4.00,
      effectiveDate: '2026-01-18',
      lastRevisionNote: 'Site 04 hydraulic slipform deployment rate tier.',
      status: 'Approved',
      shiftType: 'Night Shift (+Diff)',
      hoursWorkedMTD: 164,
    },
    {
      id: 'EMP-1010',
      name: 'Ahmed Yilmaz',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Tower Crane Operator Class A',
      department: 'Fleet Logistics & Heavy Rigging',
      supplier: 'Prime Infra Solutions Group',
      rateBand: 'BAND-CRANE-OP',
      tier: 'Tier B (Senior Tech)',
      hourlyRateSAR: 34.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 6.00,
      hazardAllowanceSAR: 8.00,
      effectiveDate: '2026-02-12',
      lastRevisionNote: 'Prime Infra Class A Heavy Telemetry operator tier certification.',
      status: 'Pending Review',
      shiftType: 'Day Shift (Standard)',
      hoursWorkedMTD: 175,
    },
    {
      id: 'EMP-1011',
      name: 'Li Wei Chen',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Industrial Switchgear Electrician',
      department: 'MEP & Electrical Systems',
      supplier: 'Gulf Apex Resources',
      rateBand: 'BAND-ELEC-HV',
      tier: 'Tier B (Senior Tech)',
      hourlyRateSAR: 35.50,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 5.50,
      hazardAllowanceSAR: 6.00,
      effectiveDate: '2026-03-05',
      lastRevisionNote: 'Transferred from Terminal West Substation expansion.',
      status: 'Approved',
      shiftType: 'Rotational 24/7',
      hoursWorkedMTD: 162,
    },
    {
      id: 'EMP-1012',
      name: 'Fatima Zahra Mansour',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      jobTitle: 'Field Safety Officer & Marshall',
      department: 'HSE Safety & Quality Compliance',
      supplier: 'Direct / In-House',
      rateBand: 'BAND-HSE-QA',
      tier: 'Tier C (Standard)',
      hourlyRateSAR: 29.00,
      overtimeMultiplier: 1.5,
      nightDifferentialSAR: 4.50,
      hazardAllowanceSAR: 5.00,
      effectiveDate: '2026-01-22',
      lastRevisionNote: 'OSHA compliance officer initial accreditation level.',
      status: 'Approved',
      shiftType: 'Day Shift (Standard)',
      hoursWorkedMTD: 158,
    },
  ]);

  // Edit Rate Form State
  const [editFormData, setEditFormData] = useState({
    hourlyRateSAR: '',
    overtimeMultiplier: 1.5,
    nightDifferentialSAR: '',
    hazardAllowanceSAR: '',
    tier: 'Tier B (Senior Tech)',
    effectiveDate: '',
    justification: '',
    status: 'Approved',
  });

  // Batch Adjustment State
  const [batchTargetDept, setBatchTargetDept] = useState('all');
  const [batchTargetSupplier, setBatchTargetSupplier] = useState('all');
  const [batchType, setBatchType] = useState('percent'); // 'percent' | 'fixed'
  const [batchValue, setBatchValue] = useState('3.5');
  const [batchReason, setBatchReason] = useState('Annual Q3 Inflation & Prevailing Wage Index Adjustment');

  // Interactive Shift Budget Simulator State
  const [simActiveWorkers, setSimActiveWorkers] = useState(420);
  const [simShiftHours, setSimShiftHours] = useState(8);
  const [simOvertimeHours, setSimOvertimeHours] = useState(1.5);
  const [simNightRatio, setSimNightRatio] = useState(25); // percentage
  const [simHazardRatio, setSimHazardRatio] = useState(40); // percentage

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.supplier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
      const matchesSupplier = selectedSupplier === 'all' || emp.supplier === selectedSupplier;
      const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;

      const matchesTier =
        selectedTier === 'all' ||
        (selectedTier === 'tier-a' && emp.hourlyRateSAR >= 40) ||
        (selectedTier === 'tier-b' && emp.hourlyRateSAR >= 32 && emp.hourlyRateSAR < 40) ||
        (selectedTier === 'tier-c' && emp.hourlyRateSAR < 32);

      return matchesSearch && matchesDept && matchesSupplier && matchesStatus && matchesTier;
    });
  }, [employees, searchQuery, selectedDept, selectedSupplier, selectedStatus, selectedTier]);

  // Derived KPI Calculations
  const totalEmployeesCount = employees.length;
  const avgHourlyRateSAR = useMemo(() => {
    if (employees.length === 0) return 0;
    const sum = employees.reduce((acc, emp) => acc + Number(emp.hourlyRateSAR), 0);
    return (sum / employees.length).toFixed(2);
  }, [employees]);

  const totalShiftHourlyBurnSAR = useMemo(() => {
    // Extrapolated to 420 active contracted workforce based on average rate
    return (Number(avgHourlyRateSAR) * 420).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  }, [avgHourlyRateSAR]);

  const pendingRevisionsCount = useMemo(() => {
    return employees.filter((e) => e.status === 'Pending Review').length;
  }, [employees]);

  const activeBandsCount = rateBands.filter((b) => b.status === 'Active').length;

  // Simulator Calculations
  const simResults = useMemo(() => {
    const avgBase = Number(avgHourlyRateSAR) || 33.85;
    const baseCostPerWorker = avgBase * simShiftHours;
    const overtimeCostPerWorker = avgBase * 1.5 * simOvertimeHours;
    const nightAllowance = (avgBase * 0.15) * (simNightRatio / 100) * simShiftHours;
    const hazardAllowance = 6.50 * (simHazardRatio / 100) * simShiftHours;

    const totalPerWorkerShift = baseCostPerWorker + overtimeCostPerWorker + nightAllowance + hazardAllowance;
    const totalDailyShiftCost = totalPerWorkerShift * simActiveWorkers;
    const totalWeeklyCost = totalDailyShiftCost * 6; // 6 working days
    const totalMonthlyCost = totalDailyShiftCost * 26; // 26 working days

    return {
      totalPerWorkerShift: totalPerWorkerShift.toFixed(2),
      totalDailyShiftCost: totalDailyShiftCost.toLocaleString('en-US', { maximumFractionDigits: 0 }),
      totalWeeklyCost: totalWeeklyCost.toLocaleString('en-US', { maximumFractionDigits: 0 }),
      totalMonthlyCost: totalMonthlyCost.toLocaleString('en-US', { maximumFractionDigits: 0 }),
      effectiveAvgRate: (totalPerWorkerShift / (simShiftHours + simOvertimeHours)).toFixed(2),
    };
  }, [avgHourlyRateSAR, simActiveWorkers, simShiftHours, simOvertimeHours, simNightRatio, simHazardRatio]);

  // Show Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open Edit Modal for an Employee
  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setEditFormData({
      hourlyRateSAR: emp.hourlyRateSAR.toString(),
      overtimeMultiplier: emp.overtimeMultiplier || 1.5,
      nightDifferentialSAR: emp.nightDifferentialSAR ? emp.nightDifferentialSAR.toString() : '5.00',
      hazardAllowanceSAR: emp.hazardAllowanceSAR ? emp.hazardAllowanceSAR.toString() : '6.00',
      tier: emp.tier || 'Tier B (Senior Tech)',
      effectiveDate: emp.effectiveDate || new Date().toISOString().split('T')[0],
      justification: emp.lastRevisionNote || '',
      status: emp.status || 'Approved',
    });
    setIsEditModalOpen(true);
  };

  // Save Employee Rate
  const handleSaveEmployeeRate = (e) => {
    e.preventDefault();
    if (!editingEmployee) return;

    const newRate = parseFloat(editFormData.hourlyRateSAR);
    if (isNaN(newRate) || newRate <= 0) {
      alert('Please enter a valid positive hourly rate in SAR.');
      return;
    }

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === editingEmployee.id) {
          return {
            ...emp,
            hourlyRateSAR: newRate.toFixed(2),
            overtimeMultiplier: parseFloat(editFormData.overtimeMultiplier) || 1.5,
            nightDifferentialSAR: parseFloat(editFormData.nightDifferentialSAR) || 0,
            hazardAllowanceSAR: parseFloat(editFormData.hazardAllowanceSAR) || 0,
            tier: editFormData.tier,
            effectiveDate: editFormData.effectiveDate,
            lastRevisionNote: editFormData.justification || 'Updated by Paymaster.',
            status: editFormData.status,
          };
        }
        return emp;
      })
    );

    setIsEditModalOpen(false);
    triggerToast(`Hourly rate for ${editingEmployee.name} updated to SAR ${newRate.toFixed(2)}/hr.`);
  };

  // Execute Batch Adjustment
  const handleExecuteBatch = (e) => {
    e.preventDefault();
    const val = parseFloat(batchValue);
    if (isNaN(val) || val === 0) {
      alert('Please enter a valid adjustment value.');
      return;
    }

    let affectedCount = 0;
    setEmployees((prev) =>
      prev.map((emp) => {
        const matchesDept = batchTargetDept === 'all' || emp.department === batchTargetDept;
        const matchesSupplier = batchTargetSupplier === 'all' || emp.supplier === batchTargetSupplier;

        if (matchesDept && matchesSupplier) {
          affectedCount++;
          let current = parseFloat(emp.hourlyRateSAR);
          let updated = current;
          if (batchType === 'percent') {
            updated = current * (1 + val / 100);
          } else {
            updated = current + val;
          }
          return {
            ...emp,
            hourlyRateSAR: Math.max(15, updated).toFixed(2),
            lastRevisionNote: `${batchReason} (${batchType === 'percent' ? `+${val}%` : `+SAR ${val}`})`,
            effectiveDate: new Date().toISOString().split('T')[0],
          };
        }
        return emp;
      })
    );

    setIsBatchModalOpen(false);
    triggerToast(`Batch adjustment applied to ${affectedCount} employees successfully!`);
  };

  // Quick export mock CSV
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Employee ID,Name,Job Title,Department,Supplier,Tier,Hourly Rate (SAR),Overtime Mult,Status,Effective Date',
        ...filteredEmployees.map(
          (e) =>
            `"${e.id}","${e.name}","${e.jobTitle}","${e.department}","${e.supplier}","${e.tier}",${e.hourlyRateSAR},${e.overtimeMultiplier},"${e.status}","${e.effectiveDate}"`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Site04_Hourly_Rates_Matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Hourly Rate matrix exported as CSV.');
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-12 antialiased animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-surface-container-highest border border-secondary/40 text-on-surface px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl animate-slide-up">
          <span className="material-symbols-outlined text-secondary text-[22px]">check_circle</span>
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
              <span className="material-symbols-outlined text-[16px] text-secondary">price_change</span>
              <span>Site 04 Wage Governance &amp; Compensation</span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-[28px] font-bold text-white tracking-tight leading-tight">
              Hourly Rates &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F7A65E]">Disbursement Matrix</span>
            </h1>
            <p className="font-body-md text-sm lg:text-[15px] text-white/75 leading-relaxed max-w-2xl">
              Configure contracted workforce wage bands, manage individual trade rates, verify union overtime multipliers, and audit shift disbursement projections.
            </p>

            {/* Quick KPI pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-secondary">trending_up</span>
                <span>Blended Avg: <strong className="text-white font-data-mono">SAR {avgHourlyRateSAR}/hr</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-secondary">layers</span>
                <span>Active Bands: <strong className="text-white">{activeBandsCount} Trade Tiers</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                <span>Standard Shift Burn: <strong className="text-secondary font-bold font-data-mono">SAR {totalShiftHourlyBurnSAR}/h</strong></span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-3.5 py-2.5 rounded-xl font-label-md text-xs font-semibold backdrop-blur-md transition-all shadow-xs cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>Export Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core KPIs Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Avg Hourly Rate */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Blended Average Rate
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="font-data-mono text-2xl lg:text-3xl font-bold text-on-surface">
                  SAR {avgHourlyRateSAR}
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant">/ hr</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">trending_up</span> +2.4% vs Q1
            </span>
            <span className="text-on-surface-variant/80">420 Active Workforce</span>
          </div>
        </div>

        {/* KPI 2: Estimated Hourly Shift Burn */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Shift Burn Rate (420 Pax)
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="font-data-mono text-2xl lg:text-3xl font-bold text-on-surface">
                  SAR {totalShiftHourlyBurnSAR}
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant">/ shift hr</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">timelapse</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant/90">Standard 8h Shift:</span>
            <span className="font-data-mono font-semibold text-on-surface">
              SAR {(Number(avgHourlyRateSAR) * 420 * 8).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* KPI 3: Active Trade Bands */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Wage Bands &amp; Parity
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="font-data-mono text-2xl lg:text-3xl font-bold text-on-surface">
                  {activeBandsCount} Bands
                </span>
                <span className="font-label-sm text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  100% GOSI
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant/80">Prevailing Wage Cap:</span>
            <span className="font-data-mono text-secondary font-semibold">SAR 55.00 Max</span>
          </div>
        </div>

        {/* KPI 4: Pending Revisions */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Pending Rate Reviews
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="font-data-mono text-2xl lg:text-3xl font-bold text-on-surface">
                  {pendingRevisionsCount}
                </span>
                <span className="font-label-sm text-xs font-semibold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  Action Req.
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <button
              onClick={() => setSelectedStatus(selectedStatus === 'Pending Review' ? 'all' : 'Pending Review')}
              className="text-secondary font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>{selectedStatus === 'Pending Review' ? 'Show All Status' : 'Filter Pending Queue'}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
            <span className="text-on-surface-variant/70">Awaiting HR Sign-off</span>
          </div>
        </div>
      </div>

      {/* Main Tab Controls & View Mode */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-surface-container-low border border-outline-variant/30 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('employees')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'employees'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs border border-outline-variant/30'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">badge</span>
            <span>Employee Rate Ledger ({employees.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bands')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bands'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs border border-outline-variant/30'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">schema</span>
            <span>Trade Wage Bands Matrix ({rateBands.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs border border-outline-variant/30'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">calculate</span>
            <span>Shift Cost Simulator</span>
          </button>
        </div>

        {/* View mode toggle (Table vs Cards) for Employee Ledger */}
        {activeTab === 'employees' && (
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

      {/* TAB 1: EMPLOYEE RATE LEDGER */}
      {activeTab === 'employees' && (
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
                placeholder="Search by worker name, ID (e.g. EMP-1001), trade, or supplier..."
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

              {/* Supplier / Agency */}
              <div className="relative">
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl pl-3 pr-8 py-2 font-label-md text-xs text-on-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  <option value="all">All Suppliers</option>
                  {suppliersList.map((sup) => (
                    <option key={sup} value={sup}>
                      {sup}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  arrow_drop_down
                </span>
              </div>

              {/* Rate Tier */}
              <div className="relative">
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl pl-3 pr-8 py-2 font-label-md text-xs text-on-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  <option value="all">All Wage Tiers</option>
                  <option value="tier-a">Tier A (SAR 40+ / hr)</option>
                  <option value="tier-b">Tier B (SAR 32 - 40 / hr)</option>
                  <option value="tier-c">Tier C (&lt; SAR 32 / hr)</option>
                </select>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  arrow_drop_down
                </span>
              </div>

              {/* Status */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl pl-3 pr-8 py-2 font-label-md text-xs text-on-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  <option value="all">All Statuses</option>
                  <option value="Approved">Approved Rates</option>
                  <option value="Pending Review">Pending Review</option>
                </select>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  arrow_drop_down
                </span>
              </div>

              {/* Clear filters if any active */}
              {(searchQuery || selectedDept !== 'all' || selectedSupplier !== 'all' || selectedTier !== 'all' || selectedStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDept('all');
                    setSelectedSupplier('all');
                    setSelectedTier('all');
                    setSelectedStatus('all');
                  }}
                  className="px-2.5 py-2 text-xs font-semibold text-secondary hover:underline cursor-pointer"
                  type="button"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between px-1 text-xs text-on-surface-variant">
            <span>
              Showing <strong className="text-on-surface font-semibold">{filteredEmployees.length}</strong> of{' '}
              {employees.length} employees with compensation profiles
            </span>
            <span className="font-data-mono">Site 04 Metro Terminal Labor Ledger</span>
          </div>

          {/* Empty State */}
          {filteredEmployees.length === 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[28px]">search_off</span>
              </div>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">No compensation profiles match your filters</h3>
              <p className="font-body-md text-xs text-on-surface-variant max-w-sm">
                Try clearing search terms or modifying department/supplier filters to view employee rate records.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDept('all');
                  setSelectedSupplier('all');
                  setSelectedTier('all');
                  setSelectedStatus('all');
                }}
                className="mt-2 text-xs font-semibold text-secondary bg-secondary/10 px-3.5 py-2 rounded-xl border border-secondary/20 hover:bg-secondary/20 transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'table' && filteredEmployees.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/70 border-b border-outline-variant/30 text-[11px] font-label-sm uppercase tracking-wider text-on-surface-variant">
                      <th className="py-3.5 px-4 font-semibold">Employee / Trade</th>
                      <th className="py-3.5 px-4 font-semibold">Department &amp; Agency</th>
                      <th className="py-3.5 px-4 font-semibold">Hourly Rate (Base)</th>
                      <th className="py-3.5 px-4 font-semibold">Overtime / Night Diff</th>
                      <th className="py-3.5 px-4 font-semibold">Est. Monthly (176h)</th>
                      <th className="py-3.5 px-4 font-semibold">Status / Review</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-body-md text-xs">
                    {filteredEmployees.map((emp) => {
                      const estMonthlySAR = (Number(emp.hourlyRateSAR) * 176).toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      });

                      return (
                        <tr key={emp.id} className="hover:bg-surface-container-high/40 transition-colors group">
                          {/* Worker Identity */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={emp.photo}
                                alt={emp.name}
                                className="h-9 w-9 rounded-full object-cover border border-outline-variant/40 shrink-0"
                              />
                              <div className="flex flex-col">
                                <span className="font-body-md-medium text-xs font-semibold text-on-surface group-hover:text-secondary transition-colors">
                                  {emp.name}
                                </span>
                                <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                                  <span className="font-data-mono font-medium text-secondary">{emp.id}</span>
                                  <span>•</span>
                                  <span className="truncate max-w-[160px]">{emp.jobTitle}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Department & Agency */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-on-surface truncate max-w-[160px]">{emp.department}</span>
                              <span className="text-[11px] text-on-surface-variant">{emp.supplier}</span>
                            </div>
                          </td>

                          {/* Hourly Rate */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <div className="flex items-baseline gap-1">
                                <span className="font-data-mono text-sm font-bold text-on-surface">
                                  SAR {Number(emp.hourlyRateSAR).toFixed(2)}
                                </span>
                                <span className="text-[10px] text-on-surface-variant">/hr</span>
                              </div>
                              <span className="text-[10.5px] text-on-surface-variant/80 font-medium">{emp.tier}</span>
                            </div>
                          </td>

                          {/* Overtime & Shift Diff */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1 text-[11px] font-medium text-on-surface">
                                <span className="text-secondary font-semibold">OT:</span> {emp.overtimeMultiplier}x
                                <span className="text-on-surface-variant/50">|</span>
                                <span className="text-blue-600 font-semibold">Night:</span> +SAR {emp.nightDifferentialSAR}/h
                              </div>
                              <span className="text-[10.5px] text-on-surface-variant/70">
                                Hazard Pay: +SAR {emp.hazardAllowanceSAR}/h
                              </span>
                            </div>
                          </td>

                          {/* Estimated Monthly Salary */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="font-data-mono font-semibold text-on-surface">
                                SAR {estMonthlySAR}
                              </span>
                              <span className="text-[10px] text-on-surface-variant">Standard 176h Base</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col items-start gap-1">
                              {emp.status === 'Approved' ? (
                                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                  Pending Review
                                </span>
                              )}
                              <span className="text-[10px] text-on-surface-variant truncate max-w-[130px]" title={emp.lastRevisionNote}>
                                {emp.effectiveDate}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleOpenEdit(emp)}
                              className="inline-flex items-center gap-1.5 bg-surface-container-high hover:bg-secondary hover:text-white text-on-surface px-3 py-1.5 rounded-xl font-label-md text-xs font-semibold border border-outline-variant/40 transition-all cursor-pointer shadow-xs"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[15px]">edit</span>
                              <span>Set / Edit Rate</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CARD GRID VIEW */}
          {viewMode === 'cards' && filteredEmployees.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((emp) => {
                const estMonthlySAR = (Number(emp.hourlyRateSAR) * 176).toLocaleString('en-US', {
                  maximumFractionDigits: 0,
                });

                return (
                  <div
                    key={emp.id}
                    className="bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.photo}
                          alt={emp.name}
                          className="h-11 w-11 rounded-full object-cover border border-outline-variant/40 shrink-0"
                        />
                        <div className="flex flex-col">
                          <h4 className="font-body-md-medium text-xs font-bold text-on-surface group-hover:text-secondary transition-colors">
                            {emp.name}
                          </h4>
                          <span className="text-[11px] text-on-surface-variant font-data-mono">{emp.id}</span>
                          <span className="text-[11px] text-on-surface-variant font-medium">{emp.jobTitle}</span>
                        </div>
                      </div>

                      {emp.status === 'Approved' ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                          Approved
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">
                          Review
                        </span>
                      )}
                    </div>

                    {/* Department & Agency */}
                    <div className="bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/20 flex flex-col space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant text-[11px]">Department:</span>
                        <span className="font-medium text-on-surface text-right truncate max-w-[150px]">{emp.department}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant text-[11px]">Supplier Agency:</span>
                        <span className="font-medium text-on-surface text-right truncate max-w-[150px]">{emp.supplier}</span>
                      </div>
                    </div>

                    {/* Compensation Highlights */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-surface-container-low/40 rounded-xl p-2.5 border border-outline-variant/20">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">Base Rate</span>
                        <span className="font-data-mono text-base font-bold text-on-surface">
                          SAR {Number(emp.hourlyRateSAR).toFixed(2)}
                          <span className="text-[10px] font-normal text-on-surface-variant">/h</span>
                        </span>
                      </div>
                      <div className="bg-surface-container-low/40 rounded-xl p-2.5 border border-outline-variant/20">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">Est. Monthly</span>
                        <span className="font-data-mono text-base font-bold text-on-surface">
                          SAR {estMonthlySAR}
                        </span>
                      </div>
                    </div>

                    {/* Overtime & Allowance Badges */}
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-secondary/10 border border-secondary/20 text-secondary font-medium font-data-mono">
                        OT: {emp.overtimeMultiplier}x
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 font-medium font-data-mono">
                        Night: +SAR {emp.nightDifferentialSAR}/h
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 font-medium font-data-mono">
                        Hazard: +SAR {emp.hazardAllowanceSAR}/h
                      </span>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                      <span className="text-[10.5px] text-on-surface-variant truncate max-w-[140px]">
                        Eff: {emp.effectiveDate}
                      </span>
                      <button
                        onClick={() => handleOpenEdit(emp)}
                        className="inline-flex items-center gap-1.5 bg-surface-container-high hover:bg-secondary hover:text-white text-on-surface px-3 py-1.5 rounded-xl font-label-md text-xs font-semibold border border-outline-variant/40 transition-all cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[15px]">tune</span>
                        <span>Adjust Rate</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TRADE RATE MATRIX & BENCHMARK BANDS */}
      {activeTab === 'bands' && (
        <div className="flex flex-col space-y-5">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col space-y-1">
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                Standardized Trade Rate Matrix &amp; Prevailing Wage Bands
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant max-w-2xl">
                Define benchmark minimums, standard pay targets, and wage caps for trades across Site 04. Any employee adjusted outside these bounds requires Paymaster override.
              </p>
            </div>
            <button
              onClick={() => {
                triggerToast('To create a custom band, click any row to edit benchmark limits.');
              }}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-[#c96200] text-white px-3.5 py-2 rounded-xl font-label-md text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
              <span>Define New Trade Band</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rateBands.map((band) => (
              <div
                key={band.id}
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs hover:border-secondary/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-data-mono text-[11px] text-secondary font-semibold uppercase">{band.id}</span>
                      <h4 className="font-headline-sm text-sm font-bold text-on-surface mt-0.5">{band.name}</h4>
                      <span className="text-xs text-on-surface-variant">{band.department}</span>
                    </div>
                    <span className="font-label-sm text-[10.5px] font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {band.status}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant/80 mt-2 leading-relaxed">{band.description}</p>
                </div>

                {/* Rate Spectrum Bar */}
                <div className="bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/20 flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">Min: <strong className="font-data-mono text-on-surface">SAR {band.minRateSAR.toFixed(2)}</strong></span>
                    <span className="text-secondary font-bold font-data-mono text-sm">Target: SAR {band.baseRateSAR.toFixed(2)}/h</span>
                    <span className="text-on-surface-variant">Cap: <strong className="font-data-mono text-on-surface">SAR {band.capRateSAR.toFixed(2)}</strong></span>
                  </div>

                  {/* Visual spectrum progress */}
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full w-[25%]" title="Minimum Zone"></div>
                    <div className="bg-secondary h-full w-[50%]" title="Target Benchmark Range"></div>
                    <div className="bg-amber-500 h-full w-[25%]" title="Maximum Cap Zone"></div>
                  </div>
                </div>

                {/* Multipliers & Coverage */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-surface-container-low/40 rounded-xl p-2 border border-outline-variant/20">
                    <span className="text-[10px] text-on-surface-variant block uppercase">Overtime</span>
                    <span className="font-data-mono font-bold text-on-surface">{band.overtimeMultiplier}x</span>
                  </div>
                  <div className="bg-surface-container-low/40 rounded-xl p-2 border border-outline-variant/20">
                    <span className="text-[10px] text-on-surface-variant block uppercase">Night Diff</span>
                    <span className="font-data-mono font-bold text-on-surface">+SAR {band.nightDifferentialSAR.toFixed(2)}</span>
                  </div>
                  <div className="bg-surface-container-low/40 rounded-xl p-2 border border-outline-variant/20">
                    <span className="text-[10px] text-on-surface-variant block uppercase">Coverage</span>
                    <span className="font-data-mono font-bold text-secondary">{band.workersCount} Workers</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant text-[11px]">Union Agreement: Local 282</span>
                  <button
                    onClick={() => {
                      triggerToast(`Rate band parameters for ${band.name} logged for revision.`);
                    }}
                    className="text-secondary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Configure Band Limits</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SHIFT DISBURSEMENT COST SIMULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-xs flex flex-col space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold w-fit mb-2">
                <span className="material-symbols-outlined text-[15px]">calculate</span>
                <span>Real-Time What-If Simulation</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                Disbursement &amp; Payroll Cost Simulator
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">
                Adjust headcount, overtime allocation, and shift differentials to simulate total payroll budget impact before committing trade rate changes.
              </p>
            </div>

            <div className="flex flex-col space-y-4 pt-2">
              {/* Headcount Slider */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-on-surface">Active Contracted Headcount</span>
                  <span className="font-data-mono font-bold text-secondary">{simActiveWorkers} Workers</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={simActiveWorkers}
                  onChange={(e) => setSimActiveWorkers(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant font-data-mono">
                  <span>50</span>
                  <span>420 (Current)</span>
                  <span>1,000</span>
                </div>
              </div>

              {/* Standard Shift Hours */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-on-surface">Standard Shift Length</span>
                  <span className="font-data-mono font-bold text-secondary">{simShiftHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="10"
                  step="1"
                  value={simShiftHours}
                  onChange={(e) => setSimShiftHours(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant font-data-mono">
                  <span>6 hrs</span>
                  <span>8 hrs (Standard)</span>
                  <span>10 hrs</span>
                </div>
              </div>

              {/* Overtime Hours */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-on-surface">Avg Overtime per Worker (1.5x Multiplier)</span>
                  <span className="font-data-mono font-bold text-secondary">{simOvertimeHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.5"
                  value={simOvertimeHours}
                  onChange={(e) => setSimOvertimeHours(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant font-data-mono">
                  <span>0 hrs (No OT)</span>
                  <span>1.5 hrs (Avg)</span>
                  <span>4 hrs (Max Union Cap)</span>
                </div>
              </div>

              {/* Night Shift Ratio */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-on-surface">Night Shift Crew Ratio (+15% Premium)</span>
                  <span className="font-data-mono font-bold text-secondary">{simNightRatio}% of Crew</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={simNightRatio}
                  onChange={(e) => setSimNightRatio(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>

              {/* Hazard Pay Ratio */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-on-surface">Hazard Work Zone Crew Ratio (+SAR 6.50/h)</span>
                  <span className="font-data-mono font-bold text-secondary">{simHazardRatio}% of Crew</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={simHazardRatio}
                  onChange={(e) => setSimHazardRatio(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Display Panel */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="bg-gradient-to-br from-[#0E1330] via-[#131943] to-[#0A0D26] border border-white/15 rounded-2xl p-6 shadow-xl text-white flex flex-col justify-between space-y-6">
              <div>
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-white/50 font-semibold">
                  Forecasted Shift Budget Output
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-data-mono text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F7A65E]">
                    SAR {simResults.totalDailyShiftCost}
                  </span>
                  <span className="text-white/70 text-xs">/ Daily Shift Run</span>
                </div>
                <span className="text-xs text-white/60 mt-1 block">
                  Effective loaded average wage: <strong className="text-white font-data-mono">SAR {simResults.effectiveAvgRate}/hr</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
                  <span className="text-[11px] text-white/50 uppercase block font-label-sm">Per Worker Shift</span>
                  <span className="font-data-mono text-lg font-bold text-white mt-0.5 block">
                    SAR {simResults.totalPerWorkerShift}
                  </span>
                  <span className="text-[10px] text-white/60">Base + OT + Allowances</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
                  <span className="text-[11px] text-white/50 uppercase block font-label-sm">Weekly Run-Rate</span>
                  <span className="font-data-mono text-lg font-bold text-white mt-0.5 block">
                    SAR {simResults.totalWeeklyCost}
                  </span>
                  <span className="text-[10px] text-white/60">Based on 6-Day Shift</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-white/50 uppercase block font-label-sm">Projected Monthly Total (26 Days)</span>
                  <span className="font-data-mono text-xl font-bold text-secondary mt-0.5 block">
                    SAR {simResults.totalMonthlyCost}
                  </span>
                </div>
                <span className="font-label-sm text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  Within Site 04 Cap
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-on-surface">Commit Scenario to Forecast</span>
                  <span className="text-on-surface-variant text-[11px]">Save scenario parameters for Site 04 financial review</span>
                </div>
              </div>
              <button
                onClick={() => triggerToast('Simulation parameters saved as Model Q3-Scenario-A')}
                className="bg-surface-container-high hover:bg-secondary hover:text-white text-on-surface px-3 py-1.5 rounded-xl font-semibold border border-outline-variant/40 transition-all cursor-pointer"
              >
                Save Model
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: SET / EDIT INDIVIDUAL EMPLOYEE RATE */}
      {isEditModalOpen && editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-3">
                <img
                  src={editingEmployee.photo}
                  alt={editingEmployee.name}
                  className="h-10 w-10 rounded-full object-cover border border-outline-variant/40"
                />
                <div className="flex flex-col">
                  <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                    Set / Edit Hourly Rate: {editingEmployee.name}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant font-data-mono">
                    {editingEmployee.id} • {editingEmployee.jobTitle}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveEmployeeRate} className="p-6 space-y-4 text-xs font-body-md">
              {/* Base Hourly Rate */}
              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-on-surface">
                  Base Hourly Rate (SAR/hr) <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-data-mono text-on-surface-variant font-bold">
                    SAR
                  </span>
                  <input
                    type="number"
                    step="0.25"
                    min="15"
                    max="100"
                    required
                    value={editFormData.hourlyRateSAR}
                    onChange={(e) => setEditFormData({ ...editFormData, hourlyRateSAR: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-12 pr-4 py-2 font-data-mono text-sm font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                  />
                </div>
                <span className="text-[10.5px] text-on-surface-variant">Prevailing wage minimum: SAR 22.00</span>
              </div>

              {/* Overtime Multiplier & Shift Allowances */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">OT Multiplier</label>
                  <select
                    value={editFormData.overtimeMultiplier}
                    onChange={(e) => setEditFormData({ ...editFormData, overtimeMultiplier: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  >
                    <option value={1.5}>1.5x (Standard OT)</option>
                    <option value={1.75}>1.75x (Night OT)</option>
                    <option value={2.0}>2.0x (Holiday/Weekend)</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Night Diff (SAR/h)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editFormData.nightDifferentialSAR}
                    onChange={(e) => setEditFormData({ ...editFormData, nightDifferentialSAR: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 font-data-mono text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Hazard Pay (SAR/h)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editFormData.hazardAllowanceSAR}
                    onChange={(e) => setEditFormData({ ...editFormData, hazardAllowanceSAR: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 font-data-mono text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Effective Date & Approval Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Effective Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.effectiveDate}
                    onChange={(e) => setEditFormData({ ...editFormData, effectiveDate: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Approval Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  >
                    <option value="Approved">Approved &amp; Locked</option>
                    <option value="Pending Review">Pending Paymaster Sign-off</option>
                  </select>
                </div>
              </div>

              {/* Justification / Audit Note */}
              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-on-surface">Change Justification / Audit Note</label>
                <textarea
                  rows="2"
                  value={editFormData.justification}
                  onChange={(e) => setEditFormData({ ...editFormData, justification: e.target.value })}
                  placeholder="e.g. Annual merit increase, trade certification upgrade, or client project mandate..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-secondary"
                ></textarea>
              </div>

              {/* Live Preview Box */}
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] text-on-surface-variant">Projected Monthly Base (176h):</span>
                  <span className="font-data-mono text-sm font-bold text-secondary">
                    SAR {((parseFloat(editFormData.hourlyRateSAR) || 0) * 176).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-on-surface-variant">Overtime Hourly Rate:</span>
                  <span className="font-data-mono text-sm font-bold text-on-surface block">
                    SAR {((parseFloat(editFormData.hourlyRateSAR) || 0) * (parseFloat(editFormData.overtimeMultiplier) || 1.5)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary hover:bg-[#c96200] text-white px-5 py-2 rounded-xl font-semibold shadow-md shadow-secondary/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[17px]">save</span>
                  <span>Save Compensation Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BATCH RATE ADJUSTMENT */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">auto_fix_high</span>
                <h3 className="font-headline-sm text-sm font-bold text-on-surface">Batch Hourly Rate Adjustment</h3>
              </div>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-high cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleExecuteBatch} className="p-6 space-y-4 text-xs font-body-md">
              <p className="text-on-surface-variant leading-relaxed">
                Apply an automated blanket wage adjustment to a specific department, supplier partner, or the entire contracted workforce.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Target Department</label>
                  <select
                    value={batchTargetDept}
                    onChange={(e) => setBatchTargetDept(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  >
                    <option value="all">All Departments</option>
                    {departmentsList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Target Supplier</label>
                  <select
                    value={batchTargetSupplier}
                    onChange={(e) => setBatchTargetSupplier(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  >
                    <option value="all">All Suppliers</option>
                    {suppliersList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">Adjustment Type</label>
                  <select
                    value={batchType}
                    onChange={(e) => setBatchType(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  >
                    <option value="percent">Percentage Increase (%)</option>
                    <option value="fixed">Fixed SAR per Hour (+SAR)</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-on-surface">
                    Adjustment Amount ({batchType === 'percent' ? '%' : 'SAR'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={batchValue}
                    onChange={(e) => setBatchValue(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 font-data-mono font-bold text-on-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-on-surface">Audit Trail Justification</label>
                <input
                  type="text"
                  required
                  value={batchReason}
                  onChange={(e) => setBatchReason(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-on-surface"
                />
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary hover:bg-[#c96200] text-white px-5 py-2 rounded-xl font-semibold shadow-md shadow-secondary/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[17px]">done_all</span>
                  <span>Apply Batch Adjustment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
