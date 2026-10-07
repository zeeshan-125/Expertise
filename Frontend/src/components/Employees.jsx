import React, { useState, useRef, useEffect } from 'react';

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployeeDetail, setSelectedEmployeeDetail] = useState(null);
  const [isFetchingAI, setIsFetchingAI] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  // Biometric Video Enrollment States (Add Employee Modal)
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [isModalCameraActive, setIsModalCameraActive] = useState(false);
  const [modalCountdown, setModalCountdown] = useState(4);
  const [modalBlinkStage, setModalBlinkStage] = useState('initial'); // 'initial' | 'blink1' | 'blink2' | 'verifying' | 'captured'
  const [capturedFrameUrl, setCapturedFrameUrl] = useState(null);
  const [videoRecordProgress, setVideoRecordProgress] = useState(0);
  const [recordedVideoClip, setRecordedVideoClip] = useState(null);
  const [videoQualityChecks, setVideoQualityChecks] = useState({
    singleFace: false,
    goodLighting: false,
    blinkDetected: false,
    frameRate30: false,
  });
  const [enrollmentConsentGiven, setEnrollmentConsentGiven] = useState(false);

  // Camera Refs
  const modalVideoRef = useRef(null);
  const modalStreamRef = useRef(null);
  const modalRecordingIntervalRef = useRef(null);

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
  const mockRegistryDatabase = {
    '2491823901': {
      fullName: 'Rayan Abdullah Al-Dosari',
      nationality: 'Saudi Arabia',
      gender: 'Male',
      dob: '1992-05-14',
      iqamaExpiry: '2027-11-20',
      profession: 'Heavy Civil Superintendent',
      bloodGroup: 'O+',
      medicalClearance: 'Passed - Grade A',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    '2301984210': {
      fullName: 'Tariq Mansoor Al-Zahrani',
      nationality: 'Saudi Arabia',
      gender: 'Male',
      dob: '1989-08-22',
      iqamaExpiry: '2026-09-15',
      profession: 'Electrical Systems Engineer',
      bloodGroup: 'A+',
      medicalClearance: 'Passed - Grade A',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    '2519284711': {
      fullName: 'Muhammad Farhan',
      nationality: 'Pakistan',
      gender: 'Male',
      dob: '1994-11-03',
      iqamaExpiry: '2026-04-10',
      profession: 'Certified High-Pressure Welder',
      bloodGroup: 'B+',
      medicalClearance: 'Passed - Grade A',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    },
    '2488192033': {
      fullName: 'Soraya Maria Santos',
      nationality: 'Philippines',
      gender: 'Female',
      dob: '1991-03-18',
      iqamaExpiry: '2026-07-28',
      profession: 'HVAC Specialist & BMS Operator',
      bloodGroup: 'AB+',
      medicalClearance: 'Passed - Grade A',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    'K8912304': {
      fullName: 'Mateo Lucas Hernandez',
      nationality: 'Mexico',
      gender: 'Male',
      dob: '1988-12-09',
      iqamaExpiry: '2025-12-30',
      profession: 'Structural Steel Master Rigger',
      bloodGroup: 'O+',
      medicalClearance: 'Passed - Grade A',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
  };

  // Initial Seed Employees
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
      enrolled_video_path: null, // Test case: No enrolled video
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
      enrolled_video_path: null, // Test case: No enrolled video
      video_enrolled_at: null,
      biometric_consent: false,
      consent_date: null,
    },
  ]);

  // Form State for Add Employee Modal
  const initialForm = {
    // Step 1: Automated ID Fetch
    idType: 'Iqama / Resident ID',
    idNumber: '',
    fullName: '',
    nationality: '',
    gender: 'Male',
    dob: '',
    iqamaExpiry: '',
    profession: '',
    bloodGroup: 'O+',
    medicalClearance: 'Passed - Grade A',
    photo: '',

    // Step 2: Additional HR Details (Manual)
    employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    department: 'Civil & Heavy Framing',
    supplier: 'Direct / In-House',
    jobTitle: '',
    site: 'HQ Metro Logistics (Site 04)',
    hourlyRateSAR: '35.00',
    monthlySalarySAR: '5,500',
    status: 'Active',
    iban: '',
    emergencyContact: '',
    gateAccess: 'Level 2 - Standard Terminal Access',
    safetyCerts: 'OSHA-10, Medical Fitness',
  };

  const [formData, setFormData] = useState(initialForm);

  // Auto-Fetch Details via Iqama / Passport Lookup Simulation
  const handleAutoFetchId = () => {
    if (!formData.idNumber.trim()) {
      alert('Please enter an Iqama / National ID or Passport Number first.');
      return;
    }

    setIsFetchingAI(true);
    setFetchSuccess(false);

    setTimeout(() => {
      setIsFetchingAI(false);
      const cleanId = formData.idNumber.trim();
      const matched = mockRegistryDatabase[cleanId];

      if (matched) {
        setFormData((prev) => ({
          ...prev,
          fullName: matched.fullName,
          nationality: matched.nationality,
          gender: matched.gender,
          dob: matched.dob,
          iqamaExpiry: matched.iqamaExpiry,
          profession: matched.profession,
          bloodGroup: matched.bloodGroup,
          medicalClearance: matched.medicalClearance,
          photo: matched.photo,
          jobTitle: prev.jobTitle || matched.profession,
        }));
        setFetchSuccess(true);
      } else {
        // Fallback realistic AI parsing from standard IDs
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || 'Zaid Mansoor Al-Harbi',
          nationality: prev.nationality || (cleanId.startsWith('1') ? 'Saudi Arabia' : 'Egypt'),
          gender: 'Male',
          dob: prev.dob || '1993-06-20',
          iqamaExpiry: prev.iqamaExpiry || '2027-08-15',
          profession: prev.profession || 'Site Technical Specialist',
          bloodGroup: 'B+',
          medicalClearance: 'Passed - Grade A',
          photo:
            prev.photo ||
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
          jobTitle: prev.jobTitle || 'Field Operations Specialist',
        }));
        setFetchSuccess(true);
      }
    }, 850);
  };

  // Quick fill samples helper
  const handleQuickSampleSelect = (sampleId) => {
    setFormData((prev) => ({
      ...prev,
      idNumber: sampleId,
      idType: sampleId.startsWith('K') ? 'Passport' : sampleId.startsWith('1') ? 'Saudi National ID' : 'Iqama / Resident ID',
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Camera Management for Add Employee Modal
  const stopModalCamera = () => {
    if (modalStreamRef.current) {
      modalStreamRef.current.getTracks().forEach((track) => track.stop());
      modalStreamRef.current = null;
    }
    if (modalVideoRef.current) {
      modalVideoRef.current.srcObject = null;
    }
    if (modalRecordingIntervalRef.current) {
      clearInterval(modalRecordingIntervalRef.current);
      modalRecordingIntervalRef.current = null;
    }
    setIsModalCameraActive(false);
    setIsVideoRecording(false);
  };

  const handleCloseAddModal = () => {
    stopModalCamera();
    setIsAddModalOpen(false);
    setFetchSuccess(false);
    setRecordedVideoClip(null);
    setCapturedFrameUrl(null);
    setVideoRecordProgress(0);
    setEnrollmentConsentGiven(false);
    setModalBlinkStage('initial');
    setFormData({
      ...initialForm,
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  // Video Recording in Add Modal with live camera & blink challenge
  const handleStartModalVideoRecording = async () => {
    setIsVideoRecording(true);
    setIsModalCameraActive(true);
    setVideoRecordProgress(0);
    setModalCountdown(4);
    setModalBlinkStage('initial');
    setRecordedVideoClip(null);
    setCapturedFrameUrl(null);
    setVideoQualityChecks({
      singleFace: false,
      goodLighting: false,
      blinkDetected: false,
      frameRate30: false,
    });

    // 1. Request user webcam stream
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        modalStreamRef.current = stream;
        if (modalVideoRef.current) {
          modalVideoRef.current.srcObject = stream;
          modalVideoRef.current.play().catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Webcam stream notice (using fallback live stream simulation):', err);
    }

    // 2. Interactive Blink Sequence with on-screen prompts over 4 seconds
    let progress = 0;
    if (modalRecordingIntervalRef.current) {
      clearInterval(modalRecordingIntervalRef.current);
    }

    modalRecordingIntervalRef.current = setInterval(() => {
      progress += 2.5; // reaches 100 in 40 ticks = 4 seconds
      setVideoRecordProgress(Math.min(Math.round(progress), 100));

      if (progress < 25) {
        setModalCountdown(4);
        setModalBlinkStage('initial'); // "Looking for face..."
        setVideoQualityChecks((prev) => ({ ...prev, singleFace: true }));
      } else if (progress >= 25 && progress < 55) {
        setModalCountdown(3);
        setModalBlinkStage('blink1'); // "👁️ Please Blink Your Eyes Now!"
        setVideoQualityChecks((prev) => ({ ...prev, singleFace: true, goodLighting: true }));
      } else if (progress >= 55 && progress < 85) {
        setModalCountdown(2);
        setModalBlinkStage('blink2'); // "👁️ First blink captured! Blink once more to confirm!"
        setVideoQualityChecks((prev) => ({ ...prev, singleFace: true, goodLighting: true, blinkDetected: true }));
      } else if (progress >= 85 && progress < 100) {
        setModalCountdown(1);
        setModalBlinkStage('verifying'); // "Finalizing biometric EAR & mesh embedding..."
        setVideoQualityChecks((prev) => ({ ...prev, singleFace: true, goodLighting: true, blinkDetected: true, frameRate30: true }));
      } else if (progress >= 100) {
        clearInterval(modalRecordingIntervalRef.current);
        modalRecordingIntervalRef.current = null;
        setModalCountdown(0);
        setModalBlinkStage('captured');
        setIsVideoRecording(false);

        // Snapshot extraction from camera if active
        let snapshot = null;
        try {
          if (modalVideoRef.current && modalVideoRef.current.videoWidth > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = modalVideoRef.current.videoWidth;
            canvas.height = modalVideoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(modalVideoRef.current, 0, 0, canvas.width, canvas.height);
            snapshot = canvas.toDataURL('image/jpeg', 0.9);
          }
        } catch (e) {
          console.warn('Could not extract frame from webcam:', e);
        }

        if (snapshot) {
          setCapturedFrameUrl(snapshot);
        } else {
          setCapturedFrameUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80');
        }

        // Stop camera tracks cleanly
        if (modalStreamRef.current) {
          modalStreamRef.current.getTracks().forEach((track) => track.stop());
          modalStreamRef.current = null;
        }

        setVideoQualityChecks({
          singleFace: true,
          goodLighting: true,
          blinkDetected: true,
          frameRate30: true,
        });
        setEnrollmentConsentGiven(true);
        setRecordedVideoClip('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      }
    }, 100);
  };

  const handleResetModalVideoRecording = () => {
    stopModalCamera();
    setRecordedVideoClip(null);
    setCapturedFrameUrl(null);
    setVideoRecordProgress(0);
    setModalCountdown(4);
    setModalBlinkStage('initial');
    setVideoQualityChecks({
      singleFace: false,
      goodLighting: false,
      blinkDetected: false,
      frameRate30: false,
    });
  };

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

  const handleCreateEmployee = (e) => {
    e.preventDefault();

    const certList = formData.safetyCerts
      ? formData.safetyCerts.split(',').map((c) => c.trim()).filter(Boolean)
      : ['Site Induction Passed', 'OSHA-10'];

    const newWorker = {
      id: formData.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.fullName || 'New Onboarded Personnel',
      photo:
        capturedFrameUrl ||
        formData.photo ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      idType: formData.idType,
      idNumber: formData.idNumber || '2998811223',
      iqamaExpiry: formData.iqamaExpiry || '2027-01-01',
      nationality: formData.nationality || 'Saudi Arabia',
      department: formData.department,
      supplier: formData.supplier,
      jobTitle: formData.jobTitle || formData.profession || 'Operations Specialist',
      site: formData.site,
      hourlyRateSAR: formData.hourlyRateSAR || '32.00',
      monthlySalarySAR: formData.monthlySalarySAR || '5,500',
      status: formData.status,
      statusBadge: 'On-Site',
      safetyCerts: certList,
      iban: formData.iban || 'SA00 0000 0000 0000 0000 00',
      emergencyContact: formData.emergencyContact || 'Pending Contact Entry',
      gateAccess: formData.gateAccess,
      bloodGroup: formData.bloodGroup,
      enrolled_video_path: recordedVideoClip || null,
      video_enrolled_at: recordedVideoClip ? new Date().toISOString().replace('T', ' ').substring(0, 19) + ' AST' : null,
      biometric_consent: enrollmentConsentGiven,
      consent_date: enrollmentConsentGiven ? new Date().toISOString().split('T')[0] : null,
      isNew: true,
    };

    stopModalCamera();
    setEmployees([newWorker, ...employees]);
    setIsAddModalOpen(false);
    setFetchSuccess(false);
    setRecordedVideoClip(null);
    setCapturedFrameUrl(null);
    setVideoRecordProgress(0);
    setModalBlinkStage('initial');
    setEnrollmentConsentGiven(false);
    setFormData({
      ...initialForm,
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    });
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
              onClick={() => setIsAddModalOpen(true)}
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

      {/* Modal: Onboard Employee (With Absher / Muqeem AI Ingestion + Additional HR Form) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-3xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary via-primary-container to-[#2A3160] p-6 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-secondary border border-white/20">
                  <span className="material-symbols-outlined text-[24px]">person_add</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-xl font-bold leading-tight flex items-center gap-2">
                    <span>Onboard Workforce Personnel</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-white uppercase tracking-wider">
                      QIWA / Absher AI
                    </span>
                  </h2>
                  <p className="text-xs text-primary-fixed mt-0.5">
                    Automated government registry identity lookup followed by operational details assignment
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseAddModal}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleCreateEmployee} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* ----------------- SECTION 1: AI IDENTITY FETCH VIA IQAMA / PASSPORT ----------------- */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-[#FAF8F5] border border-secondary/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
                        1
                      </span>
                      <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                        Automated Identity Extraction (Iqama / Passport AI Fetch)
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-secondary">
                      Absher &amp; Muqeem Gateway
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant">
                    Enter the worker's 10-digit Iqama / Resident ID or Passport number to automatically ingest verified civil registry records.
                  </p>

                  {/* ID Input Ribbon */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Document Type *
                      </label>
                      <select
                        name="idType"
                        value={formData.idType}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest text-on-surface px-3 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-semibold"
                      >
                        <option value="Iqama / Resident ID">Iqama / Resident ID</option>
                        <option value="Saudi National ID">Saudi National ID</option>
                        <option value="Passport">Passport (International)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Iqama or Passport Number *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          name="idNumber"
                          value={formData.idNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. 2491823901 or K8912304"
                          className="w-full bg-surface-container-lowest text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm font-data-mono font-bold tracking-wider"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="button"
                        onClick={handleAutoFetchId}
                        disabled={isFetchingAI}
                        className="w-full py-2.5 px-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {isFetchingAI ? (
                          <>
                            <span className="material-symbols-outlined text-[16px] animate-spin">
                              progress_activity
                            </span>
                            <span>Querying...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                            <span>Auto-Fetch</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Click Mock Samples */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                      Try Sample IDs:
                    </span>
                    {Object.keys(mockRegistryDatabase).map((sampleId) => (
                      <button
                        key={sampleId}
                        type="button"
                        onClick={() => handleQuickSampleSelect(sampleId)}
                        className="px-2 py-0.5 rounded-md bg-surface-container-highest hover:bg-secondary/20 hover:text-secondary text-on-surface-variant text-[10px] font-data-mono font-semibold transition-colors"
                      >
                        {sampleId}
                      </button>
                    ))}
                  </div>

                  {/* AI Fetch Feedback Alert */}
                  {fetchSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fade-in">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-emerald-600">
                          check_circle
                        </span>
                        <span>
                          <strong>Verified Record Ingested:</strong> Successfully fetched civil registry data for{' '}
                          <strong className="underline">{formData.fullName}</strong>.
                        </span>
                      </div>
                      <span className="font-data-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        99.4% Match Confidence
                      </span>
                    </div>
                  )}

                  {/* Populated Government Identity Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Full Legal Name (Fetched)
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Auto-populated name"
                        className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 rounded-xl border border-outline-variant/30 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Nationality (Fetched)
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        placeholder="Auto-populated nationality"
                        className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 rounded-xl border border-outline-variant/30 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Iqama / Visa Expiry (Fetched)
                      </label>
                      <input
                        type="date"
                        name="iqamaExpiry"
                        value={formData.iqamaExpiry}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 rounded-xl border border-outline-variant/30 text-xs font-data-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Official Iqama Profession
                      </label>
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        placeholder="e.g. Certified Welder"
                        className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 rounded-xl border border-outline-variant/30 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Medical Clearance Status
                      </label>
                      <input
                        type="text"
                        name="medicalClearance"
                        value={formData.medicalClearance}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 rounded-xl border border-outline-variant/30 text-xs font-medium text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Blood Group
                      </label>
                      <input
                        type="text"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 rounded-xl border border-outline-variant/30 text-xs font-data-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* ----------------- SECTION 2: ADDITIONAL HR OPERATIONAL DETAILS ----------------- */}
                <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                        2
                      </span>
                      <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                        Additional Operational &amp; Deployment Details (Manual HR Entry)
                      </h3>
                    </div>
                    <span className="text-[11px] font-medium text-on-surface-variant">
                      Site &amp; Payroll Assignment
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant">
                    Fill in operational parameters, assigned trade, department cost centers, and payroll disbursement values.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Department Allocation */}
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Assigned Department *
                      </label>
                      <select
                        required
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-semibold"
                      >
                        {departmentsList.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Supplier Agency Allocation */}
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Supplier / Contracting Agency *
                      </label>
                      <select
                        required
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-semibold"
                      >
                        {suppliersList.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Operational Job Title / Trade */}
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Operational Trade / Job Title *
                      </label>
                      <input
                        type="text"
                        required
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        placeholder="e.g. Master Welder Level 3"
                        className="w-full bg-surface-container-lowest text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-semibold"
                      />
                    </div>

                    {/* Terminal / Facility */}
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Assigned Site / Terminal
                      </label>
                      <input
                        type="text"
                        name="site"
                        value={formData.site}
                        onChange={handleInputChange}
                        placeholder="HQ Metro Logistics (Site 04)"
                        className="w-full bg-surface-container-lowest text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs"
                      />
                    </div>
                  </div>

                  {/* Compensation in SAR */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Hourly Rate (SAR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-data-mono text-xs font-bold text-secondary">
                          SAR
                        </span>
                        <input
                          type="text"
                          required
                          name="hourlyRateSAR"
                          value={formData.hourlyRateSAR}
                          onChange={handleInputChange}
                          placeholder="35.00"
                          className="w-full bg-surface-container-lowest text-on-surface pl-14 pr-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm font-data-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Monthly Salary Benchmark (SAR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-data-mono text-xs font-bold text-secondary">
                          SAR
                        </span>
                        <input
                          type="text"
                          name="monthlySalarySAR"
                          value={formData.monthlySalarySAR}
                          onChange={handleInputChange}
                          placeholder="5,500"
                          className="w-full bg-surface-container-lowest text-on-surface pl-14 pr-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm font-data-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>



                  {/* Emergency Contact */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Emergency Contact Name &amp; Phone
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="e.g. Abdullah Al-Dosari (+966 50 123 4567)"
                      className="w-full bg-surface-container-lowest text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs"
                    />
                  </div>
                </div>

                {/* ----------------- SECTION 3: BIOMETRIC VIDEO ENROLLMENT & CONSENT (BLINK PROFILE) ----------------- */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-[#FAF8F5] border border-secondary/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
                        3
                      </span>
                      <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                        Biometric Video Enrollment &amp; PDPL Consent (Blink Challenge Profile)
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-secondary">
                      Cashier Kiosk &amp; Gate Liveness
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant">
                    Capture a 4-second video clip with natural eye blink to enroll the worker's facial landmark mesh for anti-spoofing verification at cash disbursement kiosks.
                  </p>

                  {/* Recorder Box */}
                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-3.5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-secondary">videocam</span>
                          <span>4-Second Master Blink Reference Recording</span>
                        </h4>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">
                          Click to launch camera. Follow on-screen instruction to blink twice.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!recordedVideoClip ? (
                          <button
                            type="button"
                            onClick={handleStartModalVideoRecording}
                            disabled={isVideoRecording}
                            className="px-4 py-2 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isVideoRecording ? 'fiber_manual_record' : 'videocam'}
                            </span>
                            <span>{isVideoRecording ? 'Recording Video (4s)...' : 'Start 4s Recording'}</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                              <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                              Blink Verified (4s Master Reference)
                            </span>
                            <button
                              type="button"
                              onClick={handleResetModalVideoRecording}
                              className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg text-xs font-semibold"
                            >
                              Retake
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* LIVE CAMERA VIEWFINDER & INTERACTIVE BLINK PROMPTS */}
                    {(isModalCameraActive || isVideoRecording || recordedVideoClip) && (
                      <div className="relative w-full h-72 sm:h-80 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl flex items-center justify-center animate-fade-in">
                        {/* Live Video or Recorded Freeze-frame */}
                        {!recordedVideoClip ? (
                          <video
                            ref={modalVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform scale-x-[-1]"
                          />
                        ) : (
                          <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                            <img
                              src={capturedFrameUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'}
                              alt="Captured Biometric Frame"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                          </div>
                        )}

                        {/* PROMINENT ON-SCREEN BLINK CHALLENGE PROMPT BANNER */}
                        <div className="absolute top-3 inset-x-3 z-20 flex flex-col items-center">
                          <div className={`w-full max-w-lg p-2.5 sm:p-3 rounded-xl border shadow-lg backdrop-blur-md text-center transition-all ${
                            modalBlinkStage === 'blink1'
                              ? 'bg-blue-900/90 border-blue-400 text-white animate-pulse'
                              : modalBlinkStage === 'blink2'
                              ? 'bg-amber-900/90 border-amber-400 text-white animate-bounce'
                              : modalBlinkStage === 'verifying'
                              ? 'bg-teal-900/90 border-teal-400 text-white'
                              : modalBlinkStage === 'captured'
                              ? 'bg-emerald-900/90 border-emerald-400 text-white'
                              : 'bg-black/80 border-white/20 text-white'
                          }`}>
                            <div className="flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-[20px] text-amber-400">
                                {modalBlinkStage === 'captured' ? 'verified' : 'visibility'}
                              </span>
                              <h4 className="text-xs sm:text-sm font-black tracking-wide uppercase">
                                {modalBlinkStage === 'initial' && 'Looking for face • Look straight into camera'}
                                {modalBlinkStage === 'blink1' && '👁️ PLEASE BLINK YOUR EYES NOW!'}
                                {modalBlinkStage === 'blink2' && '👁️ BLINK ONCE MORE TO CONFIRM!'}
                                {modalBlinkStage === 'verifying' && 'Analyzing Eye Aspect Ratio & 512-D Landmark Mesh...'}
                                {modalBlinkStage === 'captured' && '✓ Biometric Blink Reference Captured & Enrolled!'}
                              </h4>
                            </div>
                            <p dir="rtl" className="text-[11px] font-bold text-slate-200 mt-0.5">
                              {modalBlinkStage === 'initial' && 'يرجى النظر مباشرة إلى الكاميرا'}
                              {modalBlinkStage === 'blink1' && 'ارمِش بعينيك الآن أمام الكاميرا!'}
                              {modalBlinkStage === 'blink2' && 'تم رصد الرمشة الأولى! ارمِش مرة ثانية للتأكيد'}
                              {modalBlinkStage === 'verifying' && 'جاري معالجة معالم الوجه والرمش...'}
                              {modalBlinkStage === 'captured' && 'تم التقاط بصمة الفيديو والرمش بنجاح!'}
                            </p>
                          </div>
                        </div>

                        {/* Top-Right Circular Countdown Badge */}
                        {!recordedVideoClip && (
                          <div className="absolute top-3 right-3 z-30">
                            <div className="w-11 h-11 rounded-xl bg-black/75 border border-white/20 text-white flex flex-col items-center justify-center font-mono shadow-md">
                              <span className="text-base font-black text-amber-400">{modalCountdown}s</span>
                            </div>
                          </div>
                        )}

                        {/* Biometric Scanning Oval with Animated EAR Landmark Dots */}
                        {!recordedVideoClip && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                            <div className="w-44 h-56 sm:w-48 sm:h-64 border-2 border-dashed border-blue-400/90 rounded-full flex items-center justify-center relative shadow-[0_0_25px_rgba(59,130,246,0.35)]">
                              {/* Laser Scan line */}
                              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#3B82F6] animate-pulse"></div>

                              {/* Eye Aspect Ratio Landmark Tracking Dots */}
                              <div className={`absolute top-20 left-12 w-3 h-3 rounded-full shadow-[0_0_8px_#10B981] transition-all ${
                                modalBlinkStage === 'blink1' || modalBlinkStage === 'blink2' || modalBlinkStage === 'verifying'
                                  ? 'bg-emerald-400 scale-125'
                                  : 'bg-blue-400 animate-ping'
                              }`}></div>
                              <div className={`absolute top-20 right-12 w-3 h-3 rounded-full shadow-[0_0_8px_#10B981] transition-all ${
                                modalBlinkStage === 'blink1' || modalBlinkStage === 'blink2' || modalBlinkStage === 'verifying'
                                  ? 'bg-emerald-400 scale-125'
                                  : 'bg-blue-400 animate-ping'
                              }`}></div>
                            </div>
                          </div>
                        )}

                        {/* Active Recording / Live Streaming Badge */}
                        {!recordedVideoClip ? (
                          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-white font-mono">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                            <span>LIVE CAMERA • EAR LIVENESS</span>
                          </div>
                        ) : (
                          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-emerald-950/80 backdrop-blur-xs px-3 py-1 rounded-lg border border-emerald-500/40 text-[11px] text-emerald-300 font-bold">
                            <span className="material-symbols-outlined text-[15px] text-emerald-400">check_circle</span>
                            <span>Ready to Register Employee</span>
                          </div>
                        )}

                        {/* Retake Button Overlaid on Preview */}
                        {recordedVideoClip && (
                          <div className="absolute bottom-3 right-3 z-20">
                            <button
                              type="button"
                              onClick={handleResetModalVideoRecording}
                              className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 border border-white/30 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[14px]">refresh</span>
                              <span>Retake</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Progress Bar when recording */}
                    {isVideoRecording && (
                      <div className="space-y-1.5 pt-1 animate-fade-in">
                        <div className="flex justify-between text-[11px] font-semibold text-secondary">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                            <span>Capturing MediaPipe Face Mesh &amp; EAR stream...</span>
                          </span>
                          <span className="font-data-mono">{videoRecordProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-secondary to-[#F18E3B] transition-all duration-200"
                            style={{ width: `${videoRecordProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Quality Feedback When Captured */}
                    {recordedVideoClip && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fade-in">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                          <span><strong>Video Captured:</strong> Natural eye blinks confirmed. Employee is ready to register.</span>
                        </div>
                        <span className="font-data-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          EAR: 0.18 &lt; 0.21 PASS
                        </span>
                      </div>
                    )}

                    {/* Automated Quality Checks Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-outline-variant/30 text-[11px]">
                      <div className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${videoQualityChecks.singleFace ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-surface-container-lowest text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">{videoQualityChecks.singleFace ? 'check_circle' : 'radio_button_unchecked'}</span>
                        <span className="font-medium">Single Face</span>
                      </div>
                      <div className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${videoQualityChecks.goodLighting ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-surface-container-lowest text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">{videoQualityChecks.goodLighting ? 'check_circle' : 'radio_button_unchecked'}</span>
                        <span className="font-medium">&gt;300 Lux Light</span>
                      </div>
                      <div className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${videoQualityChecks.blinkDetected ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-surface-container-lowest text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">{videoQualityChecks.blinkDetected ? 'check_circle' : 'radio_button_unchecked'}</span>
                        <span className="font-medium">Natural Blink</span>
                      </div>
                      <div className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${videoQualityChecks.frameRate30 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-surface-container-lowest text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">{videoQualityChecks.frameRate30 ? 'check_circle' : 'radio_button_unchecked'}</span>
                        <span className="font-medium">30 FPS Stream</span>
                      </div>
                    </div>

                    {/* PDPL Biometric Consent Checkbox */}
                    <div className="pt-2 border-t border-outline-variant/30">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enrollmentConsentGiven}
                          onChange={(e) => setEnrollmentConsentGiven(e.target.checked)}
                          className="mt-0.5 rounded text-secondary focus:ring-secondary/40"
                        />
                        <span className="text-[11px] text-on-surface-variant leading-relaxed">
                          <strong className="text-on-surface">PDPL Biometric Consent:</strong> I confirm the employee has consented to facial biometric template storage and video liveness challenges for payroll identity verification under the Saudi Personal Data Protection Law (PDPL).
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg shadow-secondary/35 flex items-center gap-1.5 transition-all ring-2 ring-secondary/20"
                >
                  <span className="material-symbols-outlined text-[18px] text-white">check_circle</span>
                  <span>Confirm &amp; Register Employee</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Dossier Modal */}
      {selectedEmployeeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-2xl border border-outline-variant/50 p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedEmployeeDetail.photo}
                  alt={selectedEmployeeDetail.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-outline-variant/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-data-mono font-bold text-xs text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-md border border-secondary/20">
                      {selectedEmployeeDetail.id}
                    </span>
                    <span className="text-xs font-semibold text-secondary">
                      {selectedEmployeeDetail.nationality}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-xl font-bold text-on-surface mt-1">
                    {selectedEmployeeDetail.name}
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    {selectedEmployeeDetail.jobTitle}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmployeeDetail(null)}
                className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Ingested Identity Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant block text-[10px] uppercase font-bold">
                  {selectedEmployeeDetail.idType}
                </span>
                <strong className="text-on-surface font-data-mono text-xs block mt-0.5">
                  {selectedEmployeeDetail.idNumber}
                </strong>
                <span className="text-[10px] text-on-surface-variant">Exp: {selectedEmployeeDetail.iqamaExpiry}</span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant block text-[10px] uppercase font-bold">
                  Department
                </span>
                <strong className="text-on-surface text-xs block mt-0.5 truncate">
                  {selectedEmployeeDetail.department}
                </strong>
                <span className="text-[10px] text-secondary">Assigned</span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant block text-[10px] uppercase font-bold">
                  Supplier Agency
                </span>
                <strong className="text-on-surface text-xs block mt-0.5 truncate">
                  {selectedEmployeeDetail.supplier}
                </strong>
                <span className="text-[10px] text-on-surface-variant">Authorized</span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant block text-[10px] uppercase font-bold">
                  Comp Rate (SAR)
                </span>
                <strong className="text-secondary font-data-mono text-xs block mt-0.5">
                  SAR {selectedEmployeeDetail.hourlyRateSAR}/hr
                </strong>
                <span className="text-[10px] text-on-surface-variant">SAR {selectedEmployeeDetail.monthlySalarySAR}/mo</span>
              </div>
            </div>

            {/* Badges & Clearances */}
            <div className="space-y-2 text-xs">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                Safety Accreditations &amp; Site Clearances
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedEmployeeDetail.safetyCerts.map((cert, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-surface-container-low text-xs font-medium border border-outline-variant/30 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Operational & Bank Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-outline-variant/20">
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  Disbursement IBAN
                </span>
                <span className="font-data-mono font-medium text-on-surface">
                  {selectedEmployeeDetail.iban}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  Biometric Access
                </span>
                <span className="font-medium text-on-surface">
                  {selectedEmployeeDetail.gateAccess}
                </span>
              </div>
            </div>

            {/* Biometric Video Enrollment & Liveness Status */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">videocam</span>
                  <span>Cashier Biometric Video Profile</span>
                </span>
                {selectedEmployeeDetail.enrolled_video_path ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                    Video Enrolled (Blink Profile Active)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[14px] text-amber-600">warning</span>
                    Not Enrolled (Face Only)
                  </span>
                )}
              </div>

              {selectedEmployeeDetail.enrolled_video_path ? (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                      <span className="text-on-surface-variant block text-[10px] font-semibold">Enrollment Timestamp</span>
                      <strong className="text-on-surface font-data-mono">{selectedEmployeeDetail.video_enrolled_at || 'Verified on file'}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                      <span className="text-on-surface-variant block text-[10px] font-semibold">PDPL Biometric Consent</span>
                      <strong className="text-emerald-700">Consent Verified ({selectedEmployeeDetail.consent_date || 'On file'})</strong>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant">
                    <span>Eligible for both 1:1 Face Verification and Video Blink Challenge at cash disbursements.</span>
                    <button
                      type="button"
                      onClick={() => setIsEnrollingInDossier(true)}
                      className="text-secondary font-semibold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">replay</span>
                      Re-enroll Clip
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    This employee does not have an enrolled video on file. When arriving at the cashier kiosk, the <strong>Verify Video (Blink Challenge)</strong> button will be disabled, and only 1:1 Face Verification will be available.
                  </p>
                  {!isEnrollingInDossier ? (
                    <button
                      type="button"
                      onClick={() => setIsEnrollingInDossier(true)}
                      className="px-4 py-2 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
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

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-outline-variant/20">
              <span className="text-xs text-on-surface-variant">
                Emergency: <strong className="text-on-surface">{selectedEmployeeDetail.emergencyContact}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    alert(`Badge generated for ${selectedEmployeeDetail.name}`);
                    setSelectedEmployeeDetail(null);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-md shadow-secondary/25 transition-all"
                >
                  Print Gate Badge
                </button>
                <button
                  onClick={() => setSelectedEmployeeDetail(null)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
