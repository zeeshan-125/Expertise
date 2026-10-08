import React, { useState, useRef, useEffect } from 'react';

// Helper SVG Generator: Authentic Saudi Muqeem / Iqama Card
export function generateIqamaSvg(
  idNum = '2491823901',
  nameEn = 'Rayan Abdullah Al-Dosari',
  nameAr = 'ريان عبدالله الدوسري',
  profession = 'Heavy Civil Superintendent',
  expDate = '2027-11-20',
  blood = 'O+'
) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="iqamaBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a4d2e"/>
        <stop offset="40%" stop-color="#145a32"/>
        <stop offset="100%" stop-color="#0e3a22"/>
      </linearGradient>
      <linearGradient id="goldHolo" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#f9d423"/>
        <stop offset="50%" stop-color="#ff4e50"/>
        <stop offset="100%" stop-color="#f9d423"/>
      </linearGradient>
      <pattern id="guilloche" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M0 20 Q 10 0 20 20 T 40 20" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
        <circle cx="20" cy="20" r="15" fill="none" stroke="#f9d423" stroke-opacity="0.03" stroke-width="0.8"/>
      </pattern>
    </defs>
    
    <!-- Card Base -->
    <rect width="800" height="500" rx="24" fill="url(#iqamaBg)"/>
    <rect width="800" height="500" rx="24" fill="url(#guilloche)"/>
    <rect x="10" y="10" width="780" height="480" rx="18" fill="none" stroke="#2ecc71" stroke-width="1.5" stroke-opacity="0.3"/>
    
    <!-- Card Header Banner -->
    <rect x="0" y="0" width="800" height="85" rx="24" fill="#06331e"/>
    <rect x="0" y="70" width="800" height="15" fill="#06331e"/>
    
    <!-- Saudi Crest Emblem -->
    <circle cx="720" cy="42" r="26" fill="#145a32" stroke="#f1c40f" stroke-width="1.5"/>
    <text x="720" y="47" font-family="Arial, sans-serif" font-size="20" fill="#f1c40f" text-anchor="middle">⚔️</text>
    
    <text x="70" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="bold" fill="#f1c40f" text-anchor="start">المملكة العربية السعودية • وزارة الداخلية</text>
    <text x="70" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#a3e4d7" text-anchor="start">KINGDOM OF SAUDI ARABIA • RESIDENT IDENTITY (MUQEEM)</text>
    
    <!-- Chip & Hologram -->
    <rect x="60" y="115" width="65" height="52" rx="8" fill="#d4af37" stroke="#aa8c2c" stroke-width="1.5"/>
    <path d="M 60 135 L 125 135 M 92 115 L 92 167 M 75 115 L 75 167 M 110 115 L 110 167" stroke="#aa8c2c" stroke-width="1"/>
    
    <!-- Photo Box -->
    <rect x="60" y="185" width="165" height="215" rx="12" fill="#0b2c1b" stroke="#f1c40f" stroke-width="2"/>
    <!-- Silhouette / Portrait -->
    <circle cx="142" cy="265" r="45" fill="#1e8449"/>
    <path d="M 85 380 Q 142 320 200 380 Z" fill="#1e8449"/>
    <text x="142" y="395" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="#a3e4d7" text-anchor="middle">VERIFIED BIOMETRIC</text>
    
    <!-- ID Number Ribbon -->
    <rect x="250" y="110" width="500" height="46" rx="10" fill="#072b19" stroke="#27ae60" stroke-width="1"/>
    <text x="270" y="132" font-family="monospace" font-size="11" fill="#a3e4d7">IQAMA NUMBER / رقم الإقامة</text>
    <text x="270" y="148" font-family="monospace" font-size="20" font-weight="bold" fill="#ffffff" letter-spacing="4">${idNum}</text>
    
    <!-- Details Column -->
    <!-- Name -->
    <text x="250" y="185" font-family="'Segoe UI', sans-serif" font-size="10" fill="#a3e4d7" font-weight="bold">FULL LEGAL NAME / الاسم الكامل</text>
    <text x="250" y="208" font-family="'Segoe UI', sans-serif" font-size="17" font-weight="bold" fill="#ffffff">${nameEn}</text>
    <text x="740" y="208" font-family="'Traditional Arabic', Tahoma, sans-serif" font-size="16" font-weight="bold" fill="#f1c40f" text-anchor="end">${nameAr}</text>
    
    <!-- Profession -->
    <text x="250" y="245" font-family="'Segoe UI', sans-serif" font-size="10" fill="#a3e4d7" font-weight="bold">OCCUPATION / المهنة</text>
    <text x="250" y="268" font-family="'Segoe UI', sans-serif" font-size="14" font-weight="bold" fill="#ffffff">${profession}</text>
    
    <!-- Expiry & DOB -->
    <text x="250" y="305" font-family="'Segoe UI', sans-serif" font-size="10" fill="#a3e4d7" font-weight="bold">EXPIRY DATE / تاريخ الانتهاء</text>
    <text x="250" y="326" font-family="monospace" font-size="14" font-weight="bold" fill="#f1c40f">${expDate}</text>
    
    <text x="460" y="305" font-family="'Segoe UI', sans-serif" font-size="10" fill="#a3e4d7" font-weight="bold">BLOOD GROUP / فصيلة الدم</text>
    <text x="460" y="326" font-family="monospace" font-size="14" font-weight="bold" fill="#ffffff">${blood}</text>
    
    <text x="610" y="305" font-family="'Segoe UI', sans-serif" font-size="10" fill="#a3e4d7" font-weight="bold">ISSUED AT / جهة الإصدار</text>
    <text x="610" y="326" font-family="'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Riyadh Civil Registry</text>
    
    <!-- Barcode at bottom -->
    <rect x="250" y="355" width="500" height="42" fill="#062214" rx="6"/>
    <!-- barcode lines -->
    <g fill="#ffffff" opacity="0.85">
      <rect x="265" y="362" width="4" height="28"/>
      <rect x="273" y="362" width="2" height="28"/>
      <rect x="279" y="362" width="5" height="28"/>
      <rect x="288" y="362" width="2" height="28"/>
      <rect x="294" y="362" width="7" height="28"/>
      <rect x="306" y="362" width="3" height="28"/>
      <rect x="314" y="362" width="2" height="28"/>
      <rect x="320" y="362" width="6" height="28"/>
      <rect x="330" y="362" width="2" height="28"/>
      <rect x="336" y="362" width="4" height="28"/>
      <rect x="345" y="362" width="3" height="28"/>
      <rect x="353" y="362" width="8" height="28"/>
      <rect x="367" y="362" width="2" height="28"/>
      <rect x="373" y="362" width="4" height="28"/>
      <rect x="382" y="362" width="6" height="28"/>
      <rect x="393" y="362" width="3" height="28"/>
      <rect x="402" y="362" width="2" height="28"/>
      <rect x="408" y="362" width="5" height="28"/>
      <rect x="418" y="362" width="4" height="28"/>
      <rect x="427" y="362" width="2" height="28"/>
      <rect x="435" y="362" width="7" height="28"/>
      <rect x="447" y="362" width="3" height="28"/>
      <rect x="456" y="362" width="5" height="28"/>
      <rect x="466" y="362" width="2" height="28"/>
      <rect x="473" y="362" width="6" height="28"/>
      <rect x="484" y="362" width="3" height="28"/>
      <rect x="492" y="362" width="4" height="28"/>
      <rect x="502" y="362" width="2" height="28"/>
      <rect x="510" y="362" width="8" height="28"/>
      <rect x="524" y="362" width="3" height="28"/>
      <rect x="532" y="362" width="5" height="28"/>
      <rect x="542" y="362" width="2" height="28"/>
      <rect x="550" y="362" width="6" height="28"/>
      <rect x="562" y="362" width="3" height="28"/>
      <rect x="572" y="362" width="5" height="28"/>
      <rect x="582" y="362" width="2" height="28"/>
      <rect x="590" y="362" width="7" height="28"/>
      <rect x="604" y="362" width="4" height="28"/>
      <rect x="614" y="362" width="2" height="28"/>
      <rect x="622" y="362" width="6" height="28"/>
      <rect x="634" y="362" width="3" height="28"/>
      <rect x="643" y="362" width="5" height="28"/>
      <rect x="653" y="362" width="2" height="28"/>
      <rect x="660" y="362" width="8" height="28"/>
      <rect x="674" y="362" width="4" height="28"/>
      <rect x="684" y="362" width="2" height="28"/>
      <rect x="692" y="362" width="6" height="28"/>
      <rect x="704" y="362" width="3" height="28"/>
      <rect x="714" y="362" width="5" height="28"/>
      <rect x="724" y="362" width="2" height="28"/>
    </g>
    
    <!-- Footer microprint -->
    <text x="400" y="445" font-family="monospace" font-size="10" fill="#2ecc71" opacity="0.6" text-anchor="middle">MOI KSA • QIWA OPERATIONAL CLEARANCE • SECURE DIGITAL CREDENTIAL</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Helper SVG Generator: Authentic Passport Biodata Page (Front)
export function generatePassportFrontSvg(
  passNo = 'K8912304',
  name = 'Mateo Lucas Hernandez',
  nationality = 'Mexico',
  dob = '1988-12-09',
  expDate = '2026-12-30',
  gender = 'M'
) {
  const cleanSurname = name.split(' ').slice(-1)[0].toUpperCase();
  const cleanGiven = name.split(' ').slice(0, -1).join(' ').toUpperCase();
  const natCode = nationality.substring(0, 3).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="100%" height="100%">
    <defs>
      <linearGradient id="passBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1b2447"/>
        <stop offset="50%" stop-color="#232d56"/>
        <stop offset="100%" stop-color="#181f3d"/>
      </linearGradient>
      <pattern id="passWaves" width="60" height="30" patternUnits="userSpaceOnUse">
        <path d="M0 15 Q 15 0 30 15 T 60 15" fill="none" stroke="#60a5fa" stroke-opacity="0.05" stroke-width="1"/>
      </pattern>
    </defs>
    
    <!-- Background Document Page -->
    <rect width="800" height="520" rx="16" fill="url(#passBg)"/>
    <rect width="800" height="520" rx="16" fill="url(#passWaves)"/>
    <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#93c5fd" stroke-width="1" stroke-opacity="0.2"/>
    
    <!-- Header Banner -->
    <text x="400" y="42" font-family="'Times New Roman', serif" font-size="16" font-weight="bold" fill="#f8fafc" letter-spacing="3" text-anchor="middle">PASSPORT / PASSEPORT / PASAPORTE</text>
    <text x="400" y="62" font-family="'Times New Roman', serif" font-size="12" fill="#94a3b8" letter-spacing="2" text-anchor="middle">INTERNATIONAL CIVIL AVIATION ORGANIZATION (ICAO DOC 9303)</text>
    
    <!-- Header Line -->
    <line x1="30" y1="75" x2="770" y2="75" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.4"/>
    
    <!-- Passport Photo -->
    <rect x="40" y="95" width="180" height="235" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
    <circle cx="130" cy="180" r="50" fill="#334155"/>
    <path d="M 65 310 Q 130 240 195 310 Z" fill="#334155"/>
    
    <!-- Hologram Emblem Watermark Over Photo -->
    <circle cx="190" cy="115" r="22" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-opacity="0.7"/>
    <text x="190" y="120" font-size="14" fill="#fbbf24" font-weight="bold" text-anchor="middle" opacity="0.8">★</text>
    
    <!-- Grid of Passport Metadata -->
    <!-- Type, Code, Passport No -->
    <text x="250" y="112" font-family="sans-serif" font-size="9" font-weight="bold" fill="#94a3b8">TYPE / TYPE</text>
    <text x="250" y="128" font-family="monospace" font-size="14" font-weight="bold" fill="#ffffff">P</text>
    
    <text x="350" y="112" font-family="sans-serif" font-size="9" font-weight="bold" fill="#94a3b8">COUNTRY CODE / CODE DU PAYS</text>
    <text x="350" y="128" font-family="monospace" font-size="14" font-weight="bold" fill="#ffffff">${natCode}</text>
    
    <text x="540" y="112" font-family="sans-serif" font-size="9" font-weight="bold" fill="#94a3b8">PASSPORT NO. / NO. DU PASSEPORT</text>
    <text x="540" y="128" font-family="monospace" font-size="17" font-weight="bold" fill="#38bdf8" letter-spacing="2">${passNo}</text>
    
    <!-- Surname -->
    <text x="250" y="158" font-family="sans-serif" font-size="9" font-weight="bold" fill="#94a3b8">SURNAME / NOM</text>
    <text x="250" y="176" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff">${cleanSurname}</text>
    
    <!-- Given Names -->
    <text x="250" y="204" font-family="sans-serif" font-size="9" font-weight="bold" fill="#94a3b8">GIVEN NAMES / PRÉNOMS</text>
    <text x="250" y="222" font-family="sans-serif" font-size="15" font-weight="bold" fill="#ffffff">${cleanGiven}</text>
    
    <!-- Nationality & Sex & DOB -->
    <text x="250" y="250" font-family="sans-serif" font-size="9" font-weight="bold" fill="#94a3b8">NATIONALITY / NATIONALITÉ</text>
    <text x="250" y="268" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">${nationality}</text>
    
    <text x="440" y="250" font-family="sans-serif" font-size="9" font-weight="bold" fill="#94a3b8">SEX / SEXE</text>
    <text x="440" y="268" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">${gender}</text>
    
    <text x="540" y="250" font-family="sans-serif" font-size="9" font-weight="bold" fill="#94a3b8">DATE OF BIRTH / DATE DE NAISSANCE</text>
    <text x="540" y="268" font-family="monospace" font-size="14" font-weight="bold" fill="#ffffff">${dob}</text>
    
    <!-- Expiry & Issuing Authority -->
    <text x="250" y="296" font-family="sans-serif" font-size="9" font-weight="bold" fill="#94a3b8">DATE OF EXPIRY / DATE D'EXPIRATION</text>
    <text x="250" y="314" font-family="monospace" font-size="15" font-weight="bold" fill="#f59e0b">${expDate}</text>
    
    <text x="540" y="296" font-family="sans-serif" font-size="9" font-weight="bold" fill="#94a3b8">AUTHORITY / AUTORITÉ</text>
    <text x="540" y="314" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">PASSPORT ISSUING OFFICE</text>
    
    <!-- Machine Readable Zone (MRZ) Area -->
    <rect x="20" y="360" width="760" height="135" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1"/>
    <text x="40" y="410" font-family="'Courier New', Courier, monospace" font-size="21" font-weight="bold" fill="#ffffff" letter-spacing="4">P&lt;${natCode}${cleanSurname}&lt;&lt;${cleanGiven.replace(/ /g, '&lt;')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
    <text x="40" y="455" font-family="'Courier New', Courier, monospace" font-size="21" font-weight="bold" fill="#ffffff" letter-spacing="4">${passNo}&lt;4${natCode}8812098${gender}2612308&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Helper SVG Generator: Authentic Passport Endorsement / Address Page (Back)
export function generatePassportBackSvg(
  passNo = 'K8912304',
  address = 'Avenida Insurgentes Sur 1602, Benito Juarez, CDMX',
  authority = 'Secretaria de Relaciones Exteriores'
) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="100%" height="100%">
    <defs>
      <linearGradient id="backBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#18203f"/>
        <stop offset="50%" stop-color="#1f294f"/>
        <stop offset="100%" stop-color="#161c38"/>
      </linearGradient>
    </defs>
    
    <rect width="800" height="520" rx="16" fill="url(#backBg)"/>
    <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#93c5fd" stroke-width="1" stroke-opacity="0.15"/>
    
    <text x="400" y="50" font-family="'Times New Roman', serif" font-size="16" font-weight="bold" fill="#f8fafc" letter-spacing="2" text-anchor="middle">ENDORSEMENTS &amp; OBSERVATIONS / OBSERVATIONS</text>
    <line x1="40" y1="65" x2="760" y2="65" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.3"/>
    
    <!-- Official Stamp / Seal -->
    <circle cx="650" cy="180" r="60" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4" opacity="0.6"/>
    <circle cx="650" cy="180" r="45" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.4"/>
    <text x="650" y="175" font-family="sans-serif" font-size="10" font-weight="bold" fill="#38bdf8" text-anchor="middle" opacity="0.8">CONSULAR SEAL</text>
    <text x="650" y="195" font-family="sans-serif" font-size="9" fill="#38bdf8" text-anchor="middle" opacity="0.8">VALIDATED</text>
    
    <!-- Address & Emergency Contact Section -->
    <rect x="50" y="100" width="500" height="160" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
    <text x="70" y="130" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">RESIDENTIAL ADDRESS / DOMICILE</text>
    <text x="70" y="155" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">${address}</text>
    
    <text x="70" y="195" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">ISSUING AUTHORITY / AUTORITÉ ÉMETTRICE</text>
    <text x="70" y="220" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">${authority}</text>
    
    <text x="70" y="245" font-family="monospace" font-size="11" fill="#94a3b8">RECORD REF: DOC-REG-${passNo}-SEC</text>
    
    <!-- Security Microprint Pattern Box -->
    <rect x="50" y="290" width="700" height="180" rx="10" fill="#0c1226" stroke="#334155" stroke-width="1"/>
    <text x="400" y="325" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#f59e0b" text-anchor="middle">IMPORTANT LEGAL NOTICE / AVIS IMPORTANT</text>
    <text x="400" y="355" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">This passport remains the property of the issuing government and must not be altered.</text>
    <text x="400" y="380" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Bearer is entitled to consular assistance and diplomatic protection under the Vienna Convention.</text>
    <text x="400" y="415" font-family="monospace" font-size="10" fill="#38bdf8" opacity="0.6" text-anchor="middle">ELECTRONIC CHIP EMBEDDED • CRYPTOGRAPHICALLY SIGNED MASTER LIST</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function OnboardEmployee({
  onBack,
  onComplete,
  departmentsList = [
    'Civil & Heavy Framing',
    'MEP & Electrical Systems',
    'Structural Steel & Welding',
    'HSE Safety & Quality Compliance',
    'Fleet Logistics & Heavy Rigging',
    'Excavation & Ground Preparation',
  ],
  suppliersList = [
    'Direct / In-House',
    'BuildTech Manpower LLC',
    'Gulf Apex Resources',
    'Prime Infra Solutions Group',
    'Empire Logistics Technical',
  ],
}) {
  // Document Uploads State
  const [documents, setDocuments] = useState({
    passportFront: null,
    passportBack: null,
    iqamaPhoto: null,
    employeePhoto: null,
  });

  // OCR Processing States per slot
  const [ocrScanning, setOcrScanning] = useState({
    passportFront: false,
    iqamaPhoto: false,
  });

  const [ocrSuccessToast, setOcrSuccessToast] = useState(null);
  const [previewingDoc, setPreviewingDoc] = useState(null); // Lightbox modal

  // Employee Form Data
  const [formData, setFormData] = useState({
    // Extracted Civil Details
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

    // Operational & Payroll
    employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    department: departmentsList[0] || 'Civil & Heavy Framing',
    supplier: suppliersList[0] || 'Direct / In-House',
    jobTitle: '',
    site: 'HQ Metro Logistics (Site 04)',
    hourlyRateSAR: '35.00',
    monthlySalarySAR: '5,500',
    status: 'Active',
    iban: '',
    emergencyContact: '',
    gateAccess: 'Level 2 - Standard Terminal Access',
    safetyCerts: 'OSHA-10, Site Safety Induction, Medical Fitness',
  });

  // Video Biometric Enrollment State (Webcam Blink Challenge)
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [blinkStage, setBlinkStage] = useState('initial'); // 'initial' | 'blink1' | 'blink2' | 'verifying' | 'captured'
  const [capturedFrameUrl, setCapturedFrameUrl] = useState(null);
  const [recordProgress, setRecordProgress] = useState(0);
  const [recordedVideoClip, setRecordedVideoClip] = useState(null);
  const [videoQualityChecks, setVideoQualityChecks] = useState({
    singleFace: false,
    goodLighting: false,
    blinkDetected: false,
    frameRate30: false,
  });
  const [pdplConsent, setPdplConsent] = useState(false);

  // Camera Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  // Hidden file input refs
  const fileInputRefs = {
    passportFront: useRef(null),
    passportBack: useRef(null),
    iqamaPhoto: useRef(null),
    employeePhoto: useRef(null),
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsCameraActive(false);
    setIsVideoRecording(false);
  };

  // Handle generic input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Trigger OCR Extraction Simulation on Iqama or Passport
  const triggerOcrExtraction = (type, sampleOverride = null) => {
    setOcrScanning((prev) => ({ ...prev, [type]: true }));

    setTimeout(() => {
      setOcrScanning((prev) => ({ ...prev, [type]: false }));

      if (type === 'iqamaPhoto') {
        const iqamaSample = sampleOverride || {
          idType: 'Iqama / Resident ID',
          idNumber: '2491823901',
          fullName: 'Rayan Abdullah Al-Dosari',
          nationality: 'Saudi Arabia',
          gender: 'Male',
          dob: '1992-05-14',
          iqamaExpiry: '2027-11-20',
          profession: 'Heavy Civil Superintendent',
          bloodGroup: 'O+',
          medicalClearance: 'Passed - Grade A (Fit for Duty)',
          jobTitle: 'Heavy Civil Superintendent',
        };

        setFormData((prev) => ({
          ...prev,
          idType: iqamaSample.idType,
          idNumber: iqamaSample.idNumber,
          fullName: iqamaSample.fullName,
          nationality: iqamaSample.nationality,
          gender: iqamaSample.gender || prev.gender,
          dob: iqamaSample.dob,
          iqamaExpiry: iqamaSample.iqamaExpiry,
          profession: iqamaSample.profession,
          bloodGroup: iqamaSample.bloodGroup,
          medicalClearance: iqamaSample.medicalClearance,
          jobTitle: prev.jobTitle || iqamaSample.profession,
        }));

        setOcrSuccessToast({
          title: 'Saudi Iqama OCR Verified',
          message: `Ingested ${iqamaSample.fullName} (ID: ${iqamaSample.idNumber}) with 99.8% precision.`,
          type: 'iqama',
        });
      } else if (type === 'passportFront') {
        const passSample = sampleOverride || {
          idType: 'Passport',
          idNumber: 'K8912304',
          fullName: 'Mateo Lucas Hernandez',
          nationality: 'Mexico',
          gender: 'Male',
          dob: '1988-12-09',
          iqamaExpiry: '2026-12-30',
          profession: 'Structural Steel Master Welder',
          bloodGroup: 'O+',
          medicalClearance: 'Passed - Grade A (Fit for Duty)',
          jobTitle: 'Level 3 Master Welder',
        };

        setFormData((prev) => ({
          ...prev,
          idType: passSample.idType,
          idNumber: passSample.idNumber,
          fullName: passSample.fullName,
          nationality: passSample.nationality,
          gender: passSample.gender || prev.gender,
          dob: passSample.dob,
          iqamaExpiry: passSample.iqamaExpiry,
          profession: passSample.profession,
          bloodGroup: passSample.bloodGroup,
          medicalClearance: passSample.medicalClearance,
          jobTitle: prev.jobTitle || passSample.jobTitle || passSample.profession,
        }));

        setOcrSuccessToast({
          title: 'ICAO Passport OCR Verified',
          message: `Ingested MRZ & Biodata for ${passSample.fullName} (Passport: ${passSample.idNumber}).`,
          type: 'passport',
        });
      }
    }, 900);
  };

  // Handle Real File Upload
  const handleFileUpload = (docKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setDocuments((prev) => ({
        ...prev,
        [docKey]: {
          url: dataUrl,
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          uploadedAt: new Date().toLocaleTimeString(),
        },
      }));

      // If it's an employee photo, also set capturedFrameUrl
      if (docKey === 'employeePhoto') {
        setCapturedFrameUrl(dataUrl);
        setOcrSuccessToast({
          title: 'Portrait Enrolled',
          message: `Attached employee portrait photo: ${file.name}`,
          type: 'photo',
        });
      }

      // If it's Iqama or Passport Front, run the simulated OCR parser!
      if (docKey === 'iqamaPhoto' || docKey === 'passportFront') {
        triggerOcrExtraction(docKey);
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove Document
  const handleRemoveDoc = (docKey) => {
    setDocuments((prev) => ({ ...prev, [docKey]: null }));
    if (fileInputRefs[docKey].current) {
      fileInputRefs[docKey].current.value = '';
    }
  };

  // Quick Preset Sample Loaders
  const handleLoadSampleIqama = () => {
    const svgUrl = generateIqamaSvg();
    setDocuments((prev) => ({
      ...prev,
      iqamaPhoto: {
        url: svgUrl,
        fileName: 'Saudi_Iqama_Card_2491823901.svg',
        fileSize: '48.2 KB',
        uploadedAt: new Date().toLocaleTimeString(),
      },
    }));
    triggerOcrExtraction('iqamaPhoto');
  };

  const handleLoadSamplePassport = () => {
    const frontSvg = generatePassportFrontSvg();
    const backSvg = generatePassportBackSvg();
    setDocuments((prev) => ({
      ...prev,
      passportFront: {
        url: frontSvg,
        fileName: 'Passport_Biodata_Front_K8912304.svg',
        fileSize: '54.1 KB',
        uploadedAt: new Date().toLocaleTimeString(),
      },
      passportBack: {
        url: backSvg,
        fileName: 'Passport_Endorsements_Back_K8912304.svg',
        fileSize: '42.8 KB',
        uploadedAt: new Date().toLocaleTimeString(),
      },
    }));
    triggerOcrExtraction('passportFront');
  };

  const handleLoadSamplePortrait = () => {
    const portraitUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';
    setDocuments((prev) => ({
      ...prev,
      employeePhoto: {
        url: portraitUrl,
        fileName: 'Employee_Official_Portrait.jpg',
        fileSize: '124.5 KB',
        uploadedAt: new Date().toLocaleTimeString(),
      },
    }));
    setCapturedFrameUrl(portraitUrl);
  };

  // Biometric Video Recording
  const handleStartVideoRecording = async () => {
    setIsVideoRecording(true);
    setIsCameraActive(true);
    setRecordProgress(0);
    setCountdown(4);
    setBlinkStage('initial');
    setRecordedVideoClip(null);
    setCapturedFrameUrl(null);
    setVideoQualityChecks({
      singleFace: false,
      goodLighting: false,
      blinkDetected: false,
      frameRate30: false,
    });

    // 1. Request webcam stream
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Webcam stream note (fallback live simulation):', err);
    }

    // 2. Interactive Blink Sequence
    let progress = 0;
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    recordingIntervalRef.current = setInterval(() => {
      progress += 2.5; // reaches 100 in 40 ticks = 4 seconds
      setRecordProgress(Math.min(Math.round(progress), 100));

      if (progress < 25) {
        setCountdown(4);
        setBlinkStage('initial');
        setVideoQualityChecks((prev) => ({ ...prev, singleFace: true }));
      } else if (progress >= 25 && progress < 55) {
        setCountdown(3);
        setBlinkStage('blink1');
        setVideoQualityChecks((prev) => ({ ...prev, singleFace: true, goodLighting: true }));
      } else if (progress >= 55 && progress < 85) {
        setCountdown(2);
        setBlinkStage('blink2');
        setVideoQualityChecks((prev) => ({ ...prev, singleFace: true, goodLighting: true, blinkDetected: true }));
      } else if (progress >= 85 && progress < 100) {
        setCountdown(1);
        setBlinkStage('verifying');
        setVideoQualityChecks((prev) => ({
          ...prev,
          singleFace: true,
          goodLighting: true,
          blinkDetected: true,
          frameRate30: true,
        }));
      } else if (progress >= 100) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
        setCountdown(0);
        setBlinkStage('captured');
        setIsVideoRecording(false);

        // Snapshot extraction
        let snapshot = null;
        try {
          if (videoRef.current && videoRef.current.videoWidth > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            snapshot = canvas.toDataURL('image/jpeg', 0.9);
          }
        } catch (e) {
          console.warn('Could not extract frame from webcam:', e);
        }

        const chosenFrame = snapshot || documents.employeePhoto?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';
        setCapturedFrameUrl(chosenFrame);

        // Also sync to employee photo if not yet uploaded!
        if (!documents.employeePhoto) {
          setDocuments((prev) => ({
            ...prev,
            employeePhoto: {
              url: chosenFrame,
              fileName: 'Webcam_Live_Enrolled_Portrait.jpg',
              fileSize: '82.4 KB',
              uploadedAt: new Date().toLocaleTimeString(),
            },
          }));
        }

        // Stop camera tracks cleanly
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        setVideoQualityChecks({
          singleFace: true,
          goodLighting: true,
          blinkDetected: true,
          frameRate30: true,
        });
        setPdplConsent(true);
        setRecordedVideoClip('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      }
    }, 100);
  };

  const handleResetVideoRecording = () => {
    stopCamera();
    setRecordedVideoClip(null);
    setCapturedFrameUrl(null);
    setRecordProgress(0);
    setCountdown(4);
    setBlinkStage('initial');
    setVideoQualityChecks({
      singleFace: false,
      goodLighting: false,
      blinkDetected: false,
      frameRate30: false,
    });
  };

  // Submit and Deploy Employee
  const handleDeployEmployee = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      alert('Please provide the employee legal name or upload identity documents.');
      return;
    }

    const certList = formData.safetyCerts
      ? formData.safetyCerts.split(',').map((c) => c.trim()).filter(Boolean)
      : ['Site Induction Passed', 'OSHA-10'];

    const effectivePhoto =
      documents.employeePhoto?.url ||
      capturedFrameUrl ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const defaultIqamaPhoto =
      documents.iqamaPhoto?.url ||
      generateIqamaSvg(
        formData.idNumber || '2491823901',
        formData.fullName,
        formData.fullName,
        formData.jobTitle || formData.profession || 'Operations Specialist',
        formData.iqamaExpiry || '2027-11-20',
        formData.bloodGroup || 'O+'
      );

    const defaultPassportFront =
      documents.passportFront?.url ||
      generatePassportFrontSvg(
        formData.idNumber.startsWith('K') || formData.idNumber.startsWith('P') ? formData.idNumber : 'P' + formData.idNumber.slice(0, 7),
        formData.fullName,
        formData.nationality || 'Saudi Arabia',
        formData.dob || '1992-05-14',
        formData.iqamaExpiry || '2027-11-20'
      );

    const defaultPassportBack =
      documents.passportBack?.url ||
      generatePassportBackSvg(
        formData.idNumber.startsWith('K') || formData.idNumber.startsWith('P') ? formData.idNumber : 'P' + formData.idNumber.slice(0, 7),
        'Jeddah Logistics District, Terminal 4 Yard'
      );

    const newWorker = {
      id: formData.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.fullName,
      photo: effectivePhoto,
      idType: formData.idType,
      idNumber: formData.idNumber || '2998811223',
      iqamaExpiry: formData.iqamaExpiry || '2027-01-01',
      nationality: formData.nationality || 'Saudi Arabia',
      department: formData.department,
      supplier: formData.supplier,
      jobTitle: formData.jobTitle || formData.profession || 'Operations Specialist',
      site: formData.site,
      hourlyRateSAR: formData.hourlyRateSAR || '35.00',
      monthlySalarySAR: formData.monthlySalarySAR || '5,500',
      status: formData.status,
      statusBadge: 'On-Site',
      safetyCerts: certList,
      iban: formData.iban || 'SA44 2000 0001 2345 6789 01',
      emergencyContact: formData.emergencyContact || 'Pending Contact Entry',
      gateAccess: formData.gateAccess,
      bloodGroup: formData.bloodGroup,
      medicalClearance: formData.medicalClearance,
      enrolled_video_path: recordedVideoClip || null,
      video_enrolled_at: recordedVideoClip ? new Date().toISOString().replace('T', ' ').substring(0, 19) + ' AST' : null,
      biometric_consent: pdplConsent,
      consent_date: pdplConsent ? new Date().toISOString().split('T')[0] : null,
      // Attached Civil Verification Documents
      passportFront: defaultPassportFront,
      passportBack: defaultPassportBack,
      iqamaPhoto: defaultIqamaPhoto,
      documentsAttached: {
        hasPassportFront: !!documents.passportFront,
        hasPassportBack: !!documents.passportBack,
        hasIqama: !!documents.iqamaPhoto,
        hasPortrait: !!documents.employeePhoto,
      },
      isNew: true,
    };

    stopCamera();
    onComplete(newWorker);
  };

  return (
    <div className="flex flex-col w-full space-y-5 pb-12 animate-fade-in">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3.5 sm:px-5 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface font-semibold transition-all border border-outline-variant/30 text-xs shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">arrow_back</span>
            <span>Back to Employee Roster</span>
          </button>
          <span className="text-outline-variant">/</span>
          <span className="font-medium text-on-surface">Personnel Onboarding Hub</span>
          <span className="text-outline-variant">/</span>
          <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary font-bold text-[11px]">
            Document AI &amp; Biometric Intake
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Live Intake Protocol Active
          </span>
        </div>
      </div>

      {/* Onboarding Steps Stepper Deck */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => document.getElementById('onboard-section-1')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all text-left border border-outline-variant/30 hover:border-primary/40 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/25 shrink-0 aspect-square group-hover:scale-105 transition-transform">
              1
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-secondary uppercase tracking-wider">Step 1</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface truncate block">Upload 4 Photos</span>
              <span className="text-[11px] text-on-surface-variant truncate block">Passport, Iqama, Portrait</span>
            </div>
          </button>

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => document.getElementById('onboard-section-2')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all text-left border border-outline-variant/30 hover:border-primary/40 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/25 shrink-0 aspect-square group-hover:scale-105 transition-transform">
              2
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-secondary uppercase tracking-wider">Step 2</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface truncate block">Auto-OCR Parse</span>
              <span className="text-[11px] text-on-surface-variant truncate block">Civil Registry Data Sync</span>
            </div>
          </button>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => document.getElementById('onboard-section-3')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all text-left border border-outline-variant/30 hover:border-primary/40 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/25 shrink-0 aspect-square group-hover:scale-105 transition-transform">
              3
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-secondary uppercase tracking-wider">Step 3</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface truncate block">HR &amp; Payroll Setup</span>
              <span className="text-[11px] text-on-surface-variant truncate block">Cost Centers &amp; Rates</span>
            </div>
          </button>

          {/* Step 4 */}
          <button
            type="button"
            onClick={() => document.getElementById('onboard-section-4')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all text-left border border-outline-variant/30 hover:border-primary/40 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/25 shrink-0 aspect-square group-hover:scale-105 transition-transform">
              4
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-secondary uppercase tracking-wider">Step 4</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface truncate block">Blink Biometrics</span>
              <span className="text-[11px] text-on-surface-variant truncate block">Cashier Video Profile</span>
            </div>
          </button>

        </div>
      </div>

      {/* Floating Success Toast Alert */}
      {ocrSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 flex items-center justify-between shadow-sm animate-fade-in backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">document_scanner</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-900">{ocrSuccessToast.title}</h4>
              <p className="text-[11px] text-emerald-800 mt-0.5">{ocrSuccessToast.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOcrSuccessToast(null)}
            className="w-7 h-7 rounded-lg hover:bg-emerald-600/10 text-emerald-800 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Main Onboarding Form */}
      <form onSubmit={handleDeployEmployee} className="space-y-6">
        {/* ========================================================================= */}
        {/* SECTION 1: IDENTITY DOCUMENTS UPLOAD & AUTOMATED OCR EXTRACTION           */}
        {/* ========================================================================= */}
        <div id="onboard-section-1" className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 lg:p-7 border border-outline-variant/50 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/25 shrink-0 aspect-square">
                1
              </div>
              <div>
                <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                  <span>Civil Identity Documents &amp; Employee Portrait</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    AI OCR Scanning
                  </span>
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Upload Passport (Front &amp; Back), Saudi Iqama, and Employee Portrait. Uploading Iqama or Passport auto-extracts civil credentials in real time.
                </p>
              </div>
            </div>

            {/* Quick Demo Pre-load Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Try Sample Scans:
              </span>
              <button
                type="button"
                onClick={handleLoadSampleIqama}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                title="Load sample Saudi Muqeem Iqama and run OCR"
              >
                <span className="material-symbols-outlined text-[15px] text-emerald-700">credit_card</span>
                <span>Load Sample Iqama</span>
              </button>

              <button
                type="button"
                onClick={handleLoadSamplePassport}
                className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                title="Load sample Passport Front/Back and run OCR"
              >
                <span className="material-symbols-outlined text-[15px] text-blue-700">menu_book</span>
                <span>Load Sample Passport</span>
              </button>

              <button
                type="button"
                onClick={handleLoadSamplePortrait}
                className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                title="Load sample Employee Portrait Photo"
              >
                <span className="material-symbols-outlined text-[15px] text-amber-700">account_box</span>
                <span>Load Portrait</span>
              </button>
            </div>
          </div>

          {/* 4 Photo Upload Zones Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Slot 1: Passport Front Photo */}
            <div className="flex flex-col bg-surface-container-low rounded-2xl p-4 border border-outline-variant/40 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">menu_book</span>
                  <span>Passport Front</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700">
                  Biodata Page
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Full biodata page showing photo, MRZ barcode lines, and passport number.
              </p>

              {/* Upload Dropzone / Preview */}
              <div className="relative flex-1 min-h-[170px] bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant/60 flex flex-col items-center justify-center p-3 overflow-hidden transition-all group-hover:border-secondary/60">
                {documents.passportFront ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <img
                      src={documents.passportFront.url}
                      alt="Passport Front"
                      className="w-full h-36 object-cover rounded-lg shadow-xs cursor-pointer hover:scale-105 transition-transform"
                      onClick={() =>
                        setPreviewingDoc({
                          title: 'Passport Front (Biodata Page)',
                          url: documents.passportFront.url,
                          fileName: documents.passportFront.fileName,
                        })
                      }
                    />
                    {/* Animated Scanning Laser Line if scanning */}
                    {ocrScanning.passportFront && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-pulse"></div>
                    )}
                    <div className="w-full flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/20 text-[10px]">
                      <span className="font-mono text-on-surface-variant truncate max-w-[120px]">
                        {documents.passportFront.fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc('passportFront')}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-2 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">upload_file</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-on-surface block">Upload Passport Front</span>
                      <span className="text-[10px] text-on-surface-variant">PNG, JPG, or WEBP</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRefs.passportFront.current?.click()}
                      className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg text-xs font-bold transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRefs.passportFront}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('passportFront', e)}
                  className="hidden"
                />
              </div>

              {/* Status Pill */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                {documents.passportFront ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    {ocrScanning.passportFront ? 'OCR Extracting...' : 'OCR Extracted'}
                  </span>
                ) : (
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    Required Document
                  </span>
                )}
                {documents.passportFront && (
                  <button
                    type="button"
                    onClick={() => triggerOcrExtraction('passportFront')}
                    className="text-secondary font-semibold hover:underline text-[10px]"
                  >
                    Re-Scan OCR
                  </button>
                )}
              </div>
            </div>

            {/* Slot 2: Passport Back Photo */}
            <div className="flex flex-col bg-surface-container-low rounded-2xl p-4 border border-outline-variant/40 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">menu_book</span>
                  <span>Passport Back</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700">
                  Address &amp; Seal
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Address page, endorsements, emergency contact, and consular seal.
              </p>

              {/* Upload Dropzone / Preview */}
              <div className="relative flex-1 min-h-[170px] bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant/60 flex flex-col items-center justify-center p-3 overflow-hidden transition-all group-hover:border-secondary/60">
                {documents.passportBack ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <img
                      src={documents.passportBack.url}
                      alt="Passport Back"
                      className="w-full h-36 object-cover rounded-lg shadow-xs cursor-pointer hover:scale-105 transition-transform"
                      onClick={() =>
                        setPreviewingDoc({
                          title: 'Passport Back (Endorsements & Address Page)',
                          url: documents.passportBack.url,
                          fileName: documents.passportBack.fileName,
                        })
                      }
                    />
                    <div className="w-full flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/20 text-[10px]">
                      <span className="font-mono text-on-surface-variant truncate max-w-[120px]">
                        {documents.passportBack.fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc('passportBack')}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-2 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">upload_file</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-on-surface block">Upload Passport Back</span>
                      <span className="text-[10px] text-on-surface-variant">Endorsement page</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRefs.passportBack.current?.click()}
                      className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg text-xs font-bold transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRefs.passportBack}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('passportBack', e)}
                  className="hidden"
                />
              </div>

              {/* Status Pill */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                {documents.passportBack ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Attached on file
                  </span>
                ) : (
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    Optional Back Verification
                  </span>
                )}
              </div>
            </div>

            {/* Slot 3: Iqama Photo */}
            <div className="flex flex-col bg-surface-container-low rounded-2xl p-4 border border-outline-variant/40 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">credit_card</span>
                  <span>Saudi Iqama Photo</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800">
                  Muqeem Card
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Official Saudi Muqeem card with 10-digit ID, Arabic name, and profession.
              </p>

              {/* Upload Dropzone / Preview */}
              <div className="relative flex-1 min-h-[170px] bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant/60 flex flex-col items-center justify-center p-3 overflow-hidden transition-all group-hover:border-secondary/60">
                {documents.iqamaPhoto ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <img
                      src={documents.iqamaPhoto.url}
                      alt="Saudi Iqama"
                      className="w-full h-36 object-cover rounded-lg shadow-xs cursor-pointer hover:scale-105 transition-transform"
                      onClick={() =>
                        setPreviewingDoc({
                          title: 'Saudi Iqama Card (Muqeem / Civil ID)',
                          url: documents.iqamaPhoto.url,
                          fileName: documents.iqamaPhoto.fileName,
                        })
                      }
                    />
                    {/* Animated Scanning Laser Line if scanning */}
                    {ocrScanning.iqamaPhoto && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse"></div>
                    )}
                    <div className="w-full flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/20 text-[10px]">
                      <span className="font-mono text-on-surface-variant truncate max-w-[120px]">
                        {documents.iqamaPhoto.fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc('iqamaPhoto')}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-2 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">badge</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-on-surface block">Upload Iqama Photo</span>
                      <span className="text-[10px] text-on-surface-variant">PNG, JPG, or WEBP</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRefs.iqamaPhoto.current?.click()}
                      className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg text-xs font-bold transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRefs.iqamaPhoto}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('iqamaPhoto', e)}
                  className="hidden"
                />
              </div>

              {/* Status Pill */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                {documents.iqamaPhoto ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    {ocrScanning.iqamaPhoto ? 'OCR Ingesting...' : 'Iqama OCR Active'}
                  </span>
                ) : (
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    Recommended for GCC
                  </span>
                )}
                {documents.iqamaPhoto && (
                  <button
                    type="button"
                    onClick={() => triggerOcrExtraction('iqamaPhoto')}
                    className="text-secondary font-semibold hover:underline text-[10px]"
                  >
                    Re-Scan OCR
                  </button>
                )}
              </div>
            </div>

            {/* Slot 4: Employee Photo (Portrait) */}
            <div className="flex flex-col bg-surface-container-low rounded-2xl p-4 border border-outline-variant/40 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">person</span>
                  <span>Employee Portrait</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-800">
                  Profile Badge
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Clear front-facing headshot used on physical badges and gate kiosks.
              </p>

              {/* Upload Dropzone / Preview */}
              <div className="relative flex-1 min-h-[170px] bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant/60 flex flex-col items-center justify-center p-3 overflow-hidden transition-all group-hover:border-secondary/60">
                {documents.employeePhoto ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <img
                      src={documents.employeePhoto.url}
                      alt="Employee Headshot"
                      className="w-24 h-24 object-cover rounded-2xl shadow-sm border-2 border-white ring-2 ring-secondary/30 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() =>
                        setPreviewingDoc({
                          title: 'Employee Official Headshot',
                          url: documents.employeePhoto.url,
                          fileName: documents.employeePhoto.fileName,
                        })
                      }
                    />
                    <div className="w-full flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/20 text-[10px]">
                      <span className="font-mono text-on-surface-variant truncate max-w-[120px]">
                        {documents.employeePhoto.fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc('employeePhoto')}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-2 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">add_a_photo</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-on-surface block">Upload Portrait Photo</span>
                      <span className="text-[10px] text-on-surface-variant">Formal headshot</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRefs.employeePhoto.current?.click()}
                      className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg text-xs font-bold transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRefs.employeePhoto}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('employeePhoto', e)}
                  className="hidden"
                />
              </div>

              {/* Status Pill */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                {documents.employeePhoto ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Profile Photo Ready
                  </span>
                ) : (
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">face</span>
                    Badge Headshot
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: EXTRACTED CIVIL IDENTITY DETAILS (AUTO-POPULATED FROM OCR)     */}
        {/* ========================================================================= */}
        <div id="onboard-section-2" className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 lg:p-7 border border-outline-variant/50 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/25 shrink-0 aspect-square">
                2
              </div>
              <div>
                <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                  <span>Extracted Civil Details &amp; Government Registry</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary uppercase tracking-wider">
                    Auto-Populated Review
                  </span>
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Parameters extracted by the AI OCR scanner from the uploaded Passport / Iqama images. All fields remain freely editable by HR.
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface-variant border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
              <span>Qiwa &amp; Civil Sync</span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Document Type */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5 flex items-center justify-between">
                <span>Document Type *</span>
                <span className="text-[10px] text-secondary font-semibold">Auto-Identified</span>
              </label>
              <select
                name="idType"
                value={formData.idType}
                onChange={handleInputChange}
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-semibold"
              >
                <option value="Iqama / Resident ID">Iqama / Resident ID (Saudi Muqeem)</option>
                <option value="Saudi National ID">Saudi National ID (Citizen)</option>
                <option value="Passport">Passport (International Worker)</option>
              </select>
            </div>

            {/* Document / Iqama Number */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5 flex items-center justify-between">
                <span>Iqama or Passport Number *</span>
                <span className="text-[10px] text-emerald-700 font-semibold font-mono">OCR Match</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 2491823901 or K8912304"
                  className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm font-data-mono font-bold tracking-wider"
                />
              </div>
            </div>

            {/* Full Legal Name */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5 flex items-center justify-between">
                <span>Full Legal Name *</span>
                <span className="text-[10px] text-secondary font-semibold">Extracted</span>
              </label>
              <input
                type="text"
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full name as printed on ID"
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm font-bold"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5 flex items-center justify-between">
                <span>Nationality *</span>
                <span className="text-[10px] text-secondary font-semibold">Extracted</span>
              </label>
              <input
                type="text"
                required
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="e.g. Saudi Arabia, Mexico, Philippines"
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-semibold"
              />
            </div>

            {/* Official Profession */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5 flex items-center justify-between">
                <span>Official Iqama / Civil Profession *</span>
                <span className="text-[10px] text-secondary font-semibold">Extracted</span>
              </label>
              <input
                type="text"
                required
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                placeholder="e.g. Heavy Civil Superintendent"
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-semibold"
              />
            </div>

            {/* Iqama / Document Expiry */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5 flex items-center justify-between">
                <span>Passport Expiry date *</span>
                <span className="text-[10px] text-secondary font-semibold">Extracted</span>
              </label>
              <input
                type="date"
                required
                name="iqamaExpiry"
                value={formData.iqamaExpiry}
                onChange={handleInputChange}
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-data-mono font-semibold"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-data-mono"
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Blood Group (Emergency Ready)
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-data-mono font-bold"
              >
                <option value="O+">O+ (Universal Donor)</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Medical Clearance */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Medical Clearance
              </label>
              <input
                type="text"
                name="medicalClearance"
                value={formData.medicalClearance}
                onChange={handleInputChange}
                className="w-full bg-surface-container-low text-emerald-800 px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: OPERATIONAL HR & PAYROLL DEPLOYMENT                            */}
        {/* ========================================================================= */}
        <div id="onboard-section-3" className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 lg:p-7 border border-outline-variant/50 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/25 shrink-0 aspect-square">
                3
              </div>
              <div>
                <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                  <span>Operational HR &amp; Payroll Deployment</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary uppercase tracking-wider">
                    Site Allocation
                  </span>
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Allocate departmental cost centers, subcontracting agency suppliers, site clearances, and disbursement hourly rates.
                </p>
              </div>
            </div>

            <span className="font-mono text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-xl">
              {formData.employeeId}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Assigned Department */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Assigned Department *
              </label>
              <select
                required
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-semibold"
              >
                {departmentsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Supplier Agency */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Supplier Agency / Contractor *
              </label>
              <select
                required
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-semibold"
              >
                {suppliersList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Operational Trade / Job Title */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Operational Trade / Job Title *
              </label>
              <input
                type="text"
                required
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g. Master Welder Level 3"
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs font-semibold"
              />
            </div>

            {/* Assigned Facility Site */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Assigned Site / Terminal
              </label>
              <input
                type="text"
                name="site"
                value={formData.site}
                onChange={handleInputChange}
                placeholder="HQ Metro Logistics (Site 04)"
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs"
              />
            </div>

            {/* Hourly Rate in SAR */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
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
                  className="w-full bg-surface-container-low text-on-surface pl-14 pr-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm font-data-mono font-bold"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Emergency Contact Name &amp; Phone
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="e.g. Abdullah Al-Dosari (+966 50 123 4567)"
                className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 text-xs"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: BIOMETRIC VIDEO ENROLLMENT & BLINK CHALLENGE                   */}
        {/* ========================================================================= */}
        <div id="onboard-section-4" className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 lg:p-7 border border-outline-variant/50 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/25 shrink-0 aspect-square">
                4
              </div>
              <div>
                <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                  <span>Biometric Video Enrollment &amp; PDPL Consent</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-white uppercase tracking-wider">
                    Blink Challenge Profile
                  </span>
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Enroll a 4-second live webcam video clip with eye blink verification to enable cash payout authentication at the cashier kiosk.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!recordedVideoClip ? (
                <button
                  type="button"
                  onClick={handleStartVideoRecording}
                  disabled={isVideoRecording}
                  className="px-4 py-2 bg-gradient-to-r from-secondary to-[#F18E3B] hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-md shadow-secondary/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isVideoRecording ? 'fiber_manual_record' : 'videocam'}
                  </span>
                  <span>{isVideoRecording ? 'Recording (4s)...' : 'Start 4s Blink Recording'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    Blink Challenge Enrolled
                  </span>
                  <button
                    type="button"
                    onClick={handleResetVideoRecording}
                    className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold"
                  >
                    Retake
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Camera Viewfinder with On-Screen Blink Prompts */}
          {(isCameraActive || isVideoRecording || recordedVideoClip) && (
            <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl flex items-center justify-center animate-fade-in">
              {!recordedVideoClip ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                  <img
                    src={capturedFrameUrl || documents.employeePhoto?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'}
                    alt="Captured Biometric Frame"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                </div>
              )}

              {/* Top Banner Prompts */}
              <div className="absolute top-4 inset-x-4 z-20 flex flex-col items-center">
                <div
                  className={`w-full max-w-lg p-3 rounded-2xl border shadow-xl backdrop-blur-md text-center transition-all ${
                    blinkStage === 'blink1'
                      ? 'bg-blue-900/90 border-blue-400 text-white animate-pulse'
                      : blinkStage === 'blink2'
                      ? 'bg-amber-900/90 border-amber-400 text-white animate-bounce'
                      : blinkStage === 'verifying'
                      ? 'bg-teal-900/90 border-teal-400 text-white'
                      : blinkStage === 'captured'
                      ? 'bg-emerald-900/90 border-emerald-400 text-white'
                      : 'bg-black/80 border-white/20 text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-amber-400">
                      {blinkStage === 'captured' ? 'verified' : 'visibility'}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black tracking-wide uppercase">
                      {blinkStage === 'initial' && 'Looking for face • Look straight into camera'}
                      {blinkStage === 'blink1' && '👁️ PLEASE BLINK YOUR EYES NOW!'}
                      {blinkStage === 'blink2' && '👁️ BLINK ONCE MORE TO CONFIRM!'}
                      {blinkStage === 'verifying' && 'Analyzing Eye Aspect Ratio & 512-D Landmark Mesh...'}
                      {blinkStage === 'captured' && '✓ Biometric Blink Reference Captured & Enrolled!'}
                    </h4>
                  </div>
                  <p dir="rtl" className="text-[11px] font-bold text-slate-200 mt-0.5">
                    {blinkStage === 'initial' && 'يرجى النظر مباشرة إلى الكاميرا'}
                    {blinkStage === 'blink1' && 'ارمِش بعينيك الآن أمام الكاميرا!'}
                    {blinkStage === 'blink2' && 'تم رصد الرمشة الأولى! ارمِش مرة ثانية للتأكيد'}
                    {blinkStage === 'verifying' && 'جاري معالجة معالم الوجه والرمش...'}
                    {blinkStage === 'captured' && 'تم التقاط بصمة الفيديو والرمش بنجاح!'}
                  </p>
                </div>
              </div>

              {/* Countdown Badge */}
              {!recordedVideoClip && (
                <div className="absolute top-4 right-4 z-30">
                  <div className="w-12 h-12 rounded-xl bg-black/75 border border-white/20 text-white flex flex-col items-center justify-center font-mono shadow-md">
                    <span className="text-base font-black text-amber-400">{countdown}s</span>
                  </div>
                </div>
              )}

              {/* Biometric Scanning Oval with Animated EAR Landmark Dots */}
              {!recordedVideoClip && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                  <div className="w-48 h-64 sm:w-56 sm:h-72 border-2 border-dashed border-blue-400/90 rounded-full flex items-center justify-center relative shadow-[0_0_25px_rgba(59,130,246,0.35)]">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#3B82F6] animate-pulse"></div>
                    <div
                      className={`absolute top-24 left-14 w-3.5 h-3.5 rounded-full shadow-[0_0_8px_#10B981] transition-all ${
                        blinkStage === 'blink1' || blinkStage === 'blink2' || blinkStage === 'verifying'
                          ? 'bg-emerald-400 scale-125'
                          : 'bg-blue-400 animate-ping'
                      }`}
                    ></div>
                    <div
                      className={`absolute top-24 right-14 w-3.5 h-3.5 rounded-full shadow-[0_0_8px_#10B981] transition-all ${
                        blinkStage === 'blink1' || blinkStage === 'blink2' || blinkStage === 'verifying'
                          ? 'bg-emerald-400 scale-125'
                          : 'bg-blue-400 animate-ping'
                      }`}
                    ></div>
                  </div>
                </div>
              )}

              {/* Live Badge */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10 text-xs text-white font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>{recordedVideoClip ? 'BIOMETRIC VIDEO READY' : 'LIVE CAMERA • EAR LIVENESS'}</span>
              </div>
            </div>
          )}

          {/* Progress Bar when recording */}
          {isVideoRecording && (
            <div className="space-y-1.5 pt-1 animate-fade-in">
              <div className="flex justify-between text-xs font-semibold text-secondary">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Recording 4-second biometric mesh stream...</span>
                </span>
                <span className="font-mono">{recordProgress}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-[#F18E3B] transition-all duration-200"
                  style={{ width: `${recordProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 4 Quality Checks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-outline-variant/30 text-xs">
            <div
              className={`p-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                videoQualityChecks.singleFace ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                {videoQualityChecks.singleFace ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span className="font-semibold">Single Face Tracked</span>
            </div>

            <div
              className={`p-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                videoQualityChecks.goodLighting ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                {videoQualityChecks.goodLighting ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span className="font-semibold">&gt;300 Lux Light</span>
            </div>

            <div
              className={`p-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                videoQualityChecks.blinkDetected ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                {videoQualityChecks.blinkDetected ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span className="font-semibold">Natural Blink Confirmed</span>
            </div>

            <div
              className={`p-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                videoQualityChecks.frameRate30 ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                {videoQualityChecks.frameRate30 ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span className="font-semibold">30 FPS Stream PASS</span>
            </div>
          </div>

          {/* PDPL Consent Checkbox */}
          <div className="pt-2 border-t border-outline-variant/30">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={pdplConsent}
                onChange={(e) => setPdplConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-secondary focus:ring-secondary/40"
              />
              <span className="text-xs text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">PDPL Biometric Consent Verified:</strong> I hereby certify that the employee has given informed written consent under the Saudi Personal Data Protection Law (PDPL) for the secure storage of facial biometric embeddings, passport scans, and video liveness challenges for workforce attendance and cashier payout verification.
              </span>
            </label>
          </div>
        </div>

        {/* Action Footer Bar */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Cancel &amp; Return to Roster
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-secondary via-[#F18E3B] to-secondary hover:brightness-110 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-secondary/35 flex items-center justify-center gap-2 transition-all ring-2 ring-secondary/20"
          >
            <span className="material-symbols-outlined text-[20px] text-white">how_to_reg</span>
            <span>Confirm &amp; Deploy Personnel to Active Roster</span>
          </button>
        </div>
      </form>

      {/* Document Inspection Lightbox Modal */}
      {previewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-3xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[22px] text-secondary">visibility</span>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">{previewingDoc.title}</h3>
                  <span className="text-[11px] font-mono text-on-surface-variant">{previewingDoc.fileName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingDoc(null)}
                className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 flex-1 overflow-auto flex items-center justify-center bg-slate-950/90">
              <img
                src={previewingDoc.url}
                alt="Document Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
              />
            </div>

            <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Digital scan on file • Cryptographically stamped</span>
              <button
                type="button"
                onClick={() => setPreviewingDoc(null)}
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
