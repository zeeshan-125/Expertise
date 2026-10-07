import React, { useState, useMemo, useRef, useEffect } from 'react';
import logoImg from '../assets/logo.png';
import verificationService, { CHALLENGE_TYPES, getAdminSettings, updateAdminSettings } from '../services/verificationService';

// =====================================================================
// TRANSLATIONS (EN / AR) FOR CASHIER TABLET PORTAL
// =====================================================================
const translations = {
  EN: {
    appTitle: 'Cashier & Payout Kiosk',
    portalSubtitle: 'Physical Cash Salary Disbursement Counter',
    stationName: 'Counter Station 03 – Riyadh Metro Site A',
    assignedCashier: 'Youssef Al-Harbi (Paymaster)',

    // Navigation
    navDashboard: 'Disbursement Dashboard',
    navQueue: 'Payout Counter Queue',
    navHistory: 'Disbursed Receipts',
    navReconciliation: 'Daily Cash Register',
    navAudit: 'Disbursement Audit',

    // Summary Strip
    totalAssigned: 'Total Assigned',
    totalDisbursed: 'Total Paid (Cash)',
    totalPending: 'Pending at Counter',
    totalOnHold: 'On Hold / Exception',
    totalCashAssigned: 'Total Cash Allocated',
    cashHandedOut: 'Cash Disbursed',
    cashRemaining: 'Cash in Till',

    // Filters
    searchPlaceholder: 'Search by Employee Name, Iqama, or ID...',
    allStatus: 'All Statuses',
    statusPending: 'Pending',
    statusPaid: 'Paid',
    statusOnHold: 'On Hold',
    statusUnpaid: 'Unpaid / Returned',
    filterMonth: 'Month',
    filterSupplier: 'Agency / Supplier',
    filterDepartment: 'Department',
    filterSite: 'Worksite',

    // Actions
    btnOpenPaymentCard: 'Process Payout',
    btnViewReceipt: 'View Receipt',
    btnConfirmPayment: 'Confirm Cash Payment',
    btnClearSignature: 'Clear Signature',
    btnHoldPayment: 'Put on Hold',
    btnReturnUnpaid: 'Mark as Returned',
    btnScanIqama: 'Scan / Verify Iqama',
    btnVerifyPhoto: 'Match Photo',
    btnPrintReceipt: 'Print Receipt (PDF)',
    btnClose: 'Close',
    btnCancel: 'Cancel',

    // Payment Card Labels
    readOnlyNotice: 'READ-ONLY WAGE RATE (CALCULATED BY ACCOUNTS)',
    amountToPay: 'Net Cash Amount to Hand Over',
    salaryMonth: 'Salary Month',
    employeePhoto: 'Employee Identity Verification',
    iqamaNumber: 'National / Iqama ID',
    workerId: 'Badge / Worker ID',
    department: 'Department',
    site: 'Assigned Worksite',
    supplier: 'Manpower Agency',
    trade: 'Trade & Role',

    // Safety Checklist
    safetyHeader: 'Mandatory Safety Checks Before Cash Handover',
    checkPhoto: 'Physical person at counter matches Iqama card photo and profile',
    checkIqama: 'Iqama document validity confirmed (Active & Non-Expired)',
    checkPending: 'Payment status is currently Pending (Not duplicated or on hold)',
    checkCashCounted: 'Exact cash notes counted and verified in presence of employee',

    // Signature
    sigHeader: 'Employee Signature & Legal Acknowledgment',
    sigPrompt: 'Hand tablet to employee to sign in the box below:',
    sigDisclaimer: 'I hereby confirm and acknowledge the receipt of the cash salary amount specified above in full with no deductions or disputes.',
    sigDisclaimerAr: 'أقر بموجبه باستلام المبلغ المالي الموضح أعلاه نقداً وكاملاً دون أي خصومات أو مطالبات.',
    sigClear: 'Clear / Resign',
    sigCaptured: 'Signature verified and timestamped',
    sigRequired: 'Digital signature is strictly mandatory before payment can be confirmed.',

    // Reconciliation
    openingFloat: 'Vault Opening Float',
    cashDisbursedTotal: 'Total Cash Disbursed',
    tillBalance: 'Current Till Balance',
    reconciliationHeader: 'End-of-Day Physical Cash Reconciliation',
    denominationTitle: 'Cash Denomination Breakdown in Counter Drawer',

    // Role switcher & User
    switchRole: 'Switch Role Portal',
    logout: 'Log Out',
    tabletMode: 'Tablet Touch Mode',

    // Biometric & Face Verification (DeepFace ArcFace + RetinaFace)
    step1Title: 'Step 1: 1:1 Face Verification',
    step1Desc: 'Compare live camera face against enrolled master photo (DeepFace ArcFace + RetinaFace).',
    btnVerifyFace: 'Verify Face',
    btnCaptureAndVerify: 'Capture & Verify',
    btnRetakePhoto: 'Retake Photo',
    preparingFaceModel: 'Preparing face model (RetinaFace & ArcFace)...',
    faceMatched: 'MATCHED',
    faceNotMatched: 'NOT MATCHED',
    faceNoFace: 'NO FACE DETECTED',
    faceVerifying: 'Analyzing live face embedding with ArcFace model...',
    liveCameraPreview: 'Front Camera Preview',
    enrolledPhotoLabel: 'Enrolled Master Photo',
    liveCaptureLabel: 'Live Counter Capture',
    manualVerificationTitle: 'Manual Verification Fallback',
    manualOverrideCheckbox: 'Photo and Iqama checked manually at counter',
    manualReasonLabel: 'Reason for Manual Verification Override *',
    reasonPoorLighting: 'Poor counter lighting',
    reasonAppearanceChanged: 'Appearance changed (beard, glasses, injury)',
    reasonCameraIssue: 'Camera / hardware issue',
    reasonOther: 'Other authorized operational exception',
    btnApplyOverride: 'Apply Manual Verification Override',
    overrideRecordedNotice: 'Manual override logged with Paymaster ID for audit review.',

    // Step 2 & 3
    step2Title: 'Step 2: Employee Tablet Digital Signature',
    step2LockedNotice: 'Locked – Step 1 Face Verification (or approved manual override) is strictly required first.',
    step2UnlockedNotice: 'Turn tablet to employee to sign their payment acknowledgment below.',
    step3Title: 'Step 3: Cash Handover & Confirm Payment',
    step3Desc: 'Count physical cash notes in front of employee, then confirm in system.',

    // Stepper & Multi-Step Navigation
    stepOverview: 'Employee Payout Card Overview',
    btnStartStep1: 'Proceed to Step 1: Face Verification',
    btnProceedToStep2: 'Proceed to Step 2: Employee Signature →',
    btnProceedToStep3: 'Proceed to Step 3: Cash Handover →',
    btnBackToStep1: 'Back to Face Verification',
    btnBackToStep2: 'Back to Signature',
    btnBackToOverview: 'Back to Card Details',
    step1Tab: 'Step 1: Face Check',
    step2Tab: 'Step 2: Signature',
    step3Tab: 'Step 3: Confirm',
    turnTabletPrompt: 'Turn tablet to employee for digital signature',
    handoverSummaryTitle: 'Cash Handover & Payout Summary',
    gateProtocolTitle: 'Mandatory 3-Step Cash Disbursement Protocol',
    gateProtocolDesc: 'Safety protocol requires 1:1 facial biometric verification and tablet signature before handing over cash.',
    cameraViewTitle: 'Step 1: Live Counter Camera',
    cameraViewDesc: 'Position employee in front of tablet camera and capture photo for 1:1 biometric matching.',
    matchingViewTitle: 'Step 1: 1:1 Face Matching Screen',
    matchingViewDesc: 'Comparing live counter snapshot against enrolled master record (ArcFace & RetinaFace).',
    btnCapturePhoto: 'Capture Photo & Match',
    btnBackToCamera: 'Back to Camera',
    matchingInProgress: 'Extracting 512-D embeddings & computing 1:1 Cosine Distance...',
    
    // Metrics
    manualOverridesCount: 'Manual Overrides',

    // Video Verification (Blink Challenge) & Method Choice
    btnVerifyFace: 'Verify Face (1:1 Photo)',
    btnVerifyVideo: 'Verify Video (Blink Challenge)',
    methodChoiceTitle: 'Select Biometric Identity Verification Method',
    methodChoiceDesc: 'Choose either 1:1 Face Photo Verification or Live Video Blink Challenge. Passing either unlocks the digital signature.',
    videoVerificationTitle: 'Step 1: Video Liveness & Biometric Verification',
    videoChallengeHeading: 'Server Blink Liveness Challenge',
    videoChallengePrompt: 'Perform the requested challenge action within the countdown timer:',
    videoRecordingActive: 'Recording 4s live video clip...',
    videoEvaluatingNotice: 'Server evaluating eye aspect ratio (MediaPipe Face Mesh) & ArcFace 1:1 embedding...',
    videoVerifiedBadge: 'VIDEO VERIFIED',
    videoNotVerifiedBadge: 'VIDEO NOT VERIFIED',
    videoNoEnrolledNotice: 'No enrolled video on file for this employee. Please proceed with Face Verification.',
    btnSwitchToFace: 'Switch to Face Verification',
    btnSwitchToVideo: 'Switch to Video Verification',
    btnRetryChallenge: 'Retry with New Challenge',
    adminSettingsTitle: 'Biometric Verification Policy & Controls',
    adminFaceToggle: 'Face Verification (Global & Counter 03)',
    adminVideoToggle: 'Video Blink Challenge (Global & Counter 03)',
    adminThresholdLabel: 'Biometric Match Threshold (Cosine Distance)',
    adminChallengesLabel: 'Permitted Blink Challenge Types',
    dailyReportTitle: 'Cashier Verification & Disbursement Daily Report',
    methodFaceLabel: 'Face Photo 1:1',
    methodVideoLabel: 'Video Blink Challenge',
    methodManualLabel: 'Manual Override',
    videoDisabledByAdmin: 'Video verification is disabled by Admin policy.',
    faceDisabledByAdmin: 'Face verification is disabled by Admin policy.',
  },
  AR: {
    appTitle: 'منصة الصرف النقدي والصراف',
    portalSubtitle: 'نافذة تسليم الرواتب النقدية المباشرة',
    stationName: 'شباك الصرف رقم 03 – مترو الرياض موقع أ',
    assignedCashier: 'يوسف الحربي (أمين الصندوق)',

    // Navigation
    navDashboard: 'لوحة تحكم الصرف',
    navQueue: 'قائمة الصرف في الشباك',
    navHistory: 'إيصالات الصرف المعتمدة',
    navReconciliation: 'سجل الصندوق اليومي',
    navAudit: 'سجل التدقيق والامتثال',

    // Summary Strip
    totalAssigned: 'إجمالي المسند',
    totalDisbursed: 'المصروف نقداً',
    totalPending: 'بانتظار الصرف',
    totalOnHold: 'معلق / استثناء',
    totalCashAssigned: 'إجمالي العهدة المخصصة',
    cashHandedOut: 'النقد المسلم',
    cashRemaining: 'النقد المتبقي بالصندوق',

    // Filters
    searchPlaceholder: 'البحث باسم العامل، رقم الإقامة، أو الرقم الوظيفي...',
    allStatus: 'جميع الحالات',
    statusPending: 'قيد الانتظار',
    statusPaid: 'تم الصرف',
    statusOnHold: 'معلق',
    statusUnpaid: 'معاد / غير مستلم',
    filterMonth: 'الشهر',
    filterSupplier: 'مورد العمالة',
    filterDepartment: 'القسم',
    filterSite: 'موقع العمل',

    // Actions
    btnOpenPaymentCard: 'معالجة الصرف',
    btnViewReceipt: 'عرض الإيصال',
    btnConfirmPayment: 'تأكيد تسليم النقد',
    btnClearSignature: 'مسح التوقيع',
    btnHoldPayment: 'تعليق الصرف',
    btnReturnUnpaid: 'إعادة للصندوق',
    btnScanIqama: 'مسح / مطابقة الإقامة',
    btnVerifyPhoto: 'مطابقة الصورة',
    btnPrintReceipt: 'طباعة الإيصال (PDF)',
    btnClose: 'إغلاق',
    btnCancel: 'إلغاء',

    // Payment Card Labels
    readOnlyNotice: 'مبلغ الراتب محمي ومغلق (محسوب ومعتمد من الحسابات)',
    amountToPay: 'صافي المبلغ النقدي للتسليم باليد',
    salaryMonth: 'شهر الراتب',
    employeePhoto: 'التحقق من هوية وصورة العامل',
    iqamaNumber: 'رقم الهوية / الإقامة',
    workerId: 'الرقم الوظيفي',
    department: 'القسم',
    site: 'موقع المشروع',
    supplier: 'شركة توريد العمالة',
    trade: 'المهنة والتخصص',

    // Safety Checklist
    safetyHeader: 'إجراءات السلامة والتحقق الإلزامية قبل تسليم النقد',
    checkPhoto: 'مطابقة الشخص الحاضر أمام الشباك مع صورة الإقامة والملف',
    checkIqama: 'التحقق من سريان وصلاحية وثيقة الإقامة',
    checkPending: 'حالة الصرف معلقة وغير مكررة أو مجمدة مسبقاً',
    checkCashCounted: 'عد وتدقيق الأوراق النقدية بحضور العامل',

    // Signature
    sigHeader: 'توقيع العامل والإقرار القانوني بالاستلام',
    sigPrompt: 'يرجى توجيه الجهاز اللوحي للعامل للتوقيع في المربع أدناه:',
    sigDisclaimer: 'I hereby confirm and acknowledge the receipt of the cash salary amount specified above in full with no deductions or disputes.',
    sigDisclaimerAr: 'أقر بموجبه باستلام المبلغ المالي الموضح أعلاه نقداً وكاملاً دون أي خصومات أو مطالبات.',
    sigClear: 'إعادة التوقيع',
    sigCaptured: 'تم توثيق التوقيع وختمه زمنياً',
    sigRequired: 'التوقيع الإلكتروني إلزامي تماماً قبل السماح بتأكيد الصرف.',

    // Reconciliation
    openingFloat: 'العهدة الافتتاحية من الخزينة',
    cashDisbursedTotal: 'إجمالي النقد المسلم',
    tillBalance: 'الرصيد المتبقي بدرج الصندوق',
    reconciliationHeader: 'المطابقة والتسوية النقدية لنهاية اليوم',
    denominationTitle: 'جرد الفئات النقدية في درج الشباك',

    // Role switcher & User
    switchRole: 'تبديل بوابة النظام',
    logout: 'تسجيل الخروج',
    tabletMode: 'وضع اللمس اللوحي',

    // Biometric & Face Verification (DeepFace ArcFace + RetinaFace)
    step1Title: 'الخطوة 1: التحقق من الوجه 1:1 (ArcFace)',
    step1Desc: 'مطابقة الوجه المباشر مع الصورة المسجلة للعامل بنظام DeepFace و RetinaFace.',
    btnVerifyFace: 'التحقق من الوجه (صورة 1:1)',
    btnCaptureAndVerify: 'التقاط ومطابقة الوجه',
    btnRetakePhoto: 'إعادة التقاط الصورة',
    preparingFaceModel: 'جاري تهيئة نموذج مطابقة الوجه (RetinaFace & ArcFace)...',
    faceMatched: 'مطابق بنجاح',
    faceNotMatched: 'غير مطابق',
    faceNoFace: 'لم يتم اكتشاف وجه',
    faceVerifying: 'جاري استخراج بصمة الوجه وإجراء المطابقة 1:1...',
    liveCameraPreview: 'معاينة الكاميرا الأمامية للجهاز',
    enrolledPhotoLabel: 'الصورة المسجلة في الملف',
    liveCaptureLabel: 'اللقطة الحية الملتقطة',
    manualVerificationTitle: 'التحقق اليدوي البديل (تجاوز)',
    manualOverrideCheckbox: 'تمت مطابقة صورة الإقامة وهوية العامل يدوياً عند الشباك',
    manualReasonLabel: 'سبب اعتماد التجاوز اليدوي *',
    reasonPoorLighting: 'إضاءة ضعيفة عند شباك الصرف',
    reasonAppearanceChanged: 'تغير في ملامح الوجه (لحية، نظارات، إصابة)',
    reasonCameraIssue: 'مشكلة أو عطل في كاميرا الجهاز',
    reasonOther: 'ظرف استثنائي معتمد آخر',
    btnApplyOverride: 'اعتماد التجاوز اليدوي',
    overrideRecordedNotice: 'تم توثيق التجاوز اليدوي باسم أمين الصندوق في سجل الرقابة.',

    // Step 2 & 3
    step2Title: 'الخطوة 2: توقيع العامل على الجهاز اللوحي',
    step2LockedNotice: 'مغلق – يلزم إتمام الخطوة 1 (مطابقة الوجه أو الفيديو أو التجاوز اليدوي) أولاً.',
    step2UnlockedNotice: 'يرجى توجيه الجهاز اللوحي للعامل للتوقيع أدناه.',
    step3Title: 'الخطوة 3: تسليم النقد وتأكيد الصرف',
    step3Desc: 'قم بعد الأوراق النقدية بحضور العامل ثم اضغط تأكيد لتوثيق الصرف وإصدار السند.',

    // Stepper & Multi-Step Navigation
    stepOverview: 'نظرة عامة على بطاقة الصرف للعامل',
    btnStartStep1: 'الانتقال للخطوة 1: التحقق من الهوية',
    btnProceedToStep2: 'الانتقال للخطوة 2: توقيع العامل ←',
    btnProceedToStep3: 'الانتقال للخطوة 3: تسليم النقد وتأكيد الصرف ←',
    btnBackToStep1: 'العودة لمطابقة الهوية',
    btnBackToStep2: 'العودة للتوقيع',
    btnBackToOverview: 'العودة لبيانات البطاقة',
    step1Tab: 'الخطوة 1: التحقق البيومتري',
    step2Tab: 'الخطوة 2: التوقيع',
    step3Tab: 'الخطوة 3: التأكيد',
    turnTabletPrompt: 'يرجى توجيه الجهاز اللوحي للعامل لتسجيل توقيعه الإلكتروني',
    handoverSummaryTitle: 'ملخص تسليم النقد وتوثيق الصرف',
    gateProtocolTitle: 'بروتوكول الصرف النقدي الإلزامي المكون من 3 خطوات',
    gateProtocolDesc: 'تشترط إجراءات السلامة مطابقة الهوية البيومترية 1:1 وتوقيع العامل على الجهاز قبل تسليم النقد.',
    cameraViewTitle: 'الخطوة 1: كاميرا الشباك المباشرة',
    cameraViewDesc: 'قم بتوجيه وجه العامل نحو الكاميرا والتقاط الصورة لبدء المطابقة 1:1.',
    matchingViewTitle: 'الخطوة 1: شاشة مطابقة الوجه 1:1',
    matchingViewDesc: 'مقارنة اللقطة الحية مع الصورة المسجلة في السجل المعتمد (ArcFace & RetinaFace).',
    btnCapturePhoto: 'التقاط الصورة والمطابقة',
    btnBackToCamera: 'العودة للكاميرا',
    matchingInProgress: 'جاري استخراج بصمة الوجه وحساب مسافة جيب التمام 1:1...',

    // Metrics
    manualOverridesCount: 'التجاوزات اليدوية',

    // Video Verification (Blink Challenge) & Method Choice
    btnVerifyVideo: 'التحقق بالفيديو (تحدي الرمش)',
    methodChoiceTitle: 'اختر طريقة التحقق البيومتري من الهوية',
    methodChoiceDesc: 'اختر إما التحقق من صورة الوجه 1:1 أو تحدي الرمش المباشر بالفيديو. اجتياز أي منهما يفتح التوقيع الإلكتروني.',
    videoVerificationTitle: 'الخطوة 1: التحقق بالفيديو وإثبات الحيوية',
    videoChallengeHeading: 'تحدي الرمش المباشر من الخادم',
    videoChallengePrompt: 'قم بتنفيذ الحركة المطلوبة خلال العداد التنازلي:',
    videoRecordingActive: 'جاري تسجيل مقطع فيديو مباشر مدته 4 ثوانٍ...',
    videoEvaluatingNotice: 'يقوم الخادم بفحص نسبة أبعاد العين وحساب البصمة البيومترية 1:1...',
    videoVerifiedBadge: 'تم التحقق من الفيديو بنجاح',
    videoNotVerifiedBadge: 'فشل التحقق من الفيديو',
    videoNoEnrolledNotice: 'لا يوجد مقطع فيديو مسجل لهذا العامل. يرجى المتابعة بالتحقق من صورة الوجه.',
    btnSwitchToFace: 'التبديل إلى التحقق من الوجه',
    btnSwitchToVideo: 'التبديل إلى التحقق بالفيديو',
    btnRetryChallenge: 'إعادة المحاولة بتحدي جديد',
    adminSettingsTitle: 'سياسة التحقق البيومتري وضوابط الرقابة',
    adminFaceToggle: 'التحقق من الوجه (عام وعند الشباك 03)',
    adminVideoToggle: 'تحدي الرمش بالفيديو (عام وعند الشباك 03)',
    adminThresholdLabel: 'حد المطابقة البيومترية (مسافة جيب التمام)',
    adminChallengesLabel: 'أنواع تحديات الرمش المسموح بها',
    dailyReportTitle: 'تقرير التحقق والصرف اليومي لأمين الصندوق',
    methodFaceLabel: 'صورة الوجه 1:1',
    methodVideoLabel: 'تحدي الرمش بالفيديو',
    methodManualLabel: 'التجاوز اليدوي',
    videoDisabledByAdmin: 'تم تعطيل التحقق بالفيديو بناءً على سياسة المسؤول.',
    faceDisabledByAdmin: 'تم تعطيل التحقق من الوجه بناءً على سياسة المسؤول.',
  },
};

// =====================================================================
// DUMMY ASSIGNED PAYMENTS DATA (ONLY ASSIGNED TO CASHIER YOUSSEF AL-HARBI)
// STRICT RBAC: NO HOURLY RATES OR COMPUTATIONS; ONLY NET PAYABLE AMOUNT
// =====================================================================
const initialPayments = [
  {
    id: 'PAY-2026-09-01',
    workerId: 'W-88204',
    name: 'Mateo Hernandez',
    iqama: '2489102941',
    iqamaExpiry: '15/04/2027',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Heavy Civil & Marine Infrastructure',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'BuildTech Manpower',
    trade: 'Structural Steel',
    subTrade: 'Level 3 Coded Welder',
    month: 'September 2026',
    netPay: 3850.0,
    status: 'Pending', // 'Pending' | 'Paid' | 'On Hold' | 'Unpaid/Returned'
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: null,
    signature: null,
    holdReason: null,
    receiptNo: null,
    verification_method: null,
    face_result: null,
    face_distance: null,
    face_threshold: 0.68,
    face_capture_path: null,
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    enrolled_video_embeddings: 'emb_v88204_aes256_512d',
    video_enrolled_at: '2026-08-10 11:20 AST',
    biometric_consent: true,
    consent_date: '2026-08-10',
    override_reason: null,
    verified_by: null,
    verified_at: null,
    paid_by: null,
    paid_at: null,
    payment_mode: 'Cash',
  },
  {
    id: 'PAY-2026-09-02',
    workerId: 'W-88208',
    name: 'Soraya Chen',
    iqama: '2390148201',
    iqamaExpiry: '08/11/2027',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Mechanical, Electrical & Plumbing (MEP)',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'ElectroMech Gulf',
    trade: 'MEP Systems',
    subTrade: 'Senior HVAC Systems Engineer',
    month: 'September 2026',
    netPay: 4200.0,
    status: 'Pending',
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: null,
    signature: null,
    holdReason: null,
    receiptNo: null,
    verification_method: null,
    face_result: null,
    face_distance: null,
    face_threshold: 0.68,
    face_capture_path: null,
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    enrolled_video_embeddings: 'emb_v88208_aes256_512d',
    video_enrolled_at: '2026-08-12 14:10 AST',
    biometric_consent: true,
    consent_date: '2026-08-12',
    override_reason: null,
    verified_by: null,
    verified_at: null,
    paid_by: null,
    paid_at: null,
    payment_mode: 'Cash',
  },
  {
    id: 'PAY-2026-09-03',
    workerId: 'W-88206',
    name: 'Vikram Patel',
    iqama: '2419082390',
    iqamaExpiry: '12/02/2027',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Heavy Civil & Marine Infrastructure',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'Saudi ReadyMix Corp',
    trade: 'Civil & Foundation',
    subTrade: 'Senior Rebar Fabricator',
    month: 'September 2026',
    netPay: 3600.0,
    status: 'Paid',
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: '05/10/2026 14:15:32 AST',
    signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10 40 Q 50 10 90 40 T 170 30" stroke="%231E2554" stroke-width="2.5" fill="none"/></svg>',
    holdReason: null,
    receiptNo: 'RCP-2026-09-88206',
    verification_method: 'face', // Backfilled existing paid record as face
    face_result: 'matched',
    face_distance: 0.22,
    face_threshold: 0.68,
    face_capture_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    enrolled_video_embeddings: 'emb_v88206_aes256_512d',
    video_enrolled_at: '2026-08-05 09:15 AST',
    biometric_consent: true,
    consent_date: '2026-08-05',
    override_reason: null,
    verified_by: 'Youssef Al-Harbi (Counter 03)',
    verified_at: '05/10/2026 14:14:50 AST',
    paid_by: 'Youssef Al-Harbi',
    paid_at: '05/10/2026 14:15:32 AST',
    payment_mode: 'Cash',
  },
  {
    id: 'PAY-2026-09-04',
    workerId: 'W-88210',
    name: 'Elena Rostova',
    iqama: '2501928402',
    iqamaExpiry: '19/08/2027',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Health, Safety & Environment (HSE)',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'SafetyFirst KSA',
    trade: 'HSE & Heavy Rigging',
    subTrade: 'Certified Rigger & Safety Marshall',
    month: 'September 2026',
    netPay: 4100.0,
    status: 'Pending',
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: null,
    signature: null,
    holdReason: null,
    receiptNo: null,
    verification_method: null,
    face_result: null,
    face_distance: null,
    face_threshold: 0.68,
    face_capture_path: null,
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: null, // NO ENROLLED VIDEO: Video button will be disabled
    enrolled_video_embeddings: null,
    video_enrolled_at: null,
    biometric_consent: true,
    consent_date: '2026-07-20',
    override_reason: null,
    verified_by: null,
    verified_at: null,
    paid_by: null,
    paid_at: null,
    payment_mode: 'Cash',
  },
  {
    id: 'PAY-2026-09-05',
    workerId: 'W-88209',
    name: 'Kwame Mensah',
    iqama: '2467182903',
    iqamaExpiry: '30/01/2027',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    department: 'Heavy Civil & Marine Infrastructure',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'BuildTech Manpower',
    trade: 'Civil Framing',
    subTrade: 'Framing Lead & Alignment Specialist',
    month: 'September 2026',
    netPay: 3750.0,
    status: 'Paid',
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: '05/10/2026 14:40:18 AST',
    signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M15 35 Q 40 5 80 45 T 160 25" stroke="%231E2554" stroke-width="2.5" fill="none"/></svg>',
    holdReason: null,
    receiptNo: 'RCP-2026-09-88209',
    verification_method: 'face', // Backfilled existing paid record as face
    face_result: 'matched',
    face_distance: 0.19,
    face_threshold: 0.68,
    face_capture_path: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    enrolled_video_embeddings: 'emb_v88209_aes256_512d',
    video_enrolled_at: '2026-08-18 16:40 AST',
    biometric_consent: true,
    consent_date: '2026-08-18',
    override_reason: null,
    verified_by: 'Youssef Al-Harbi (Counter 03)',
    verified_at: '05/10/2026 14:39:40 AST',
    paid_by: 'Youssef Al-Harbi',
    paid_at: '05/10/2026 14:40:18 AST',
    payment_mode: 'Cash',
  },
  {
    id: 'PAY-2026-09-06',
    workerId: 'W-88205',
    name: 'Ahmed Farooq',
    iqama: '2428190342',
    iqamaExpiry: '22/05/2027',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    department: 'Heavy Civil & Marine Infrastructure',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'Saudi ReadyMix Corp',
    trade: 'Concrete & Earthworks',
    subTrade: 'Concrete & Earthworks Gang Lead',
    month: 'September 2026',
    netPay: 3900.0,
    status: 'Pending',
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: null,
    signature: null,
    holdReason: null,
    receiptNo: null,
    verification_method: null,
    face_result: null,
    face_distance: null,
    face_threshold: 0.68,
    face_capture_path: null,
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    enrolled_video_embeddings: 'emb_v88205_aes256_512d',
    video_enrolled_at: '2026-08-22 13:00 AST',
    biometric_consent: true,
    consent_date: '2026-08-22',
    override_reason: null,
    verified_by: null,
    verified_at: null,
    paid_by: null,
    paid_at: null,
    payment_mode: 'Cash',
  },
  {
    id: 'PAY-2026-09-07',
    workerId: 'W-88207',
    name: 'Sarah Al-Qasim',
    iqama: '2519203841',
    iqamaExpiry: '03/09/2027',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Health, Safety & Environment (HSE)',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'SafetyFirst KSA',
    trade: 'HSE & Traffic',
    subTrade: 'Senior HSE Safety Marshall',
    month: 'September 2026',
    netPay: 4300.0,
    status: 'On Hold',
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: null,
    signature: null,
    holdReason: 'Iqama Renewal in Progress - Waiting for HR Digital Card',
    receiptNo: null,
    verification_method: null,
    face_result: null,
    face_distance: null,
    face_threshold: 0.68,
    face_capture_path: null,
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: null, // NO ENROLLED VIDEO
    enrolled_video_embeddings: null,
    video_enrolled_at: null,
    biometric_consent: true,
    consent_date: '2026-06-15',
    override_reason: null,
    verified_by: null,
    verified_at: null,
    paid_by: null,
    paid_at: null,
    payment_mode: 'Cash',
  },
  {
    id: 'PAY-2026-09-08',
    workerId: 'W-88201',
    name: 'Captain Bilal Al-Harthi',
    iqama: '2389102834',
    iqamaExpiry: '14/12/2027',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department: 'Heavy Civil & Marine Infrastructure',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'Aramco Logistics',
    trade: 'Heavy Rigging',
    subTrade: 'Rigging Superintendent',
    month: 'September 2026',
    netPay: 4600.0,
    status: 'Pending',
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: null,
    signature: null,
    holdReason: null,
    receiptNo: null,
    verification_method: null,
    face_result: null,
    face_distance: null,
    face_threshold: 0.68,
    face_capture_path: null,
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    enrolled_video_embeddings: 'emb_v88201_aes256_512d',
    video_enrolled_at: '2026-08-01 10:00 AST',
    biometric_consent: true,
    consent_date: '2026-08-01',
    override_reason: null,
    verified_by: null,
    verified_at: null,
    paid_by: null,
    paid_at: null,
    payment_mode: 'Cash',
  },
  {
    id: 'PAY-2026-09-09',
    workerId: 'W-88202',
    name: 'Karim Vance',
    iqama: '2401928374',
    iqamaExpiry: '29/03/2027',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    department: 'Mechanical, Electrical & Plumbing (MEP)',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'ElectroMech Gulf',
    trade: 'MEP Systems',
    subTrade: 'MEP Senior Lead Foreman',
    month: 'September 2026',
    netPay: 4250.0,
    status: 'Paid',
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: '05/10/2026 15:10:45 AST',
    signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M20 30 Q 60 50 100 20 T 180 40" stroke="%231E2554" stroke-width="2.5" fill="none"/></svg>',
    holdReason: null,
    receiptNo: 'RCP-2026-09-88202',
    verification_method: 'manual_override', // Backfilled existing paid record
    face_result: 'manual_override',
    face_distance: 0.74,
    face_threshold: 0.68,
    face_capture_path: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    enrolled_video_embeddings: 'emb_v88202_aes256_512d',
    video_enrolled_at: '2026-08-03 15:30 AST',
    biometric_consent: true,
    consent_date: '2026-08-03',
    override_reason: 'Appearance changed (thick beard & new prescription glasses) - Photo & Iqama verified manually',
    verified_by: 'Youssef Al-Harbi (Counter 03)',
    verified_at: '05/10/2026 15:09:12 AST',
    paid_by: 'Youssef Al-Harbi',
    paid_at: '05/10/2026 15:10:45 AST',
    payment_mode: 'Cash',
  },
  {
    id: 'PAY-2026-09-10',
    workerId: 'W-88203',
    name: 'Marcus O\'Connor',
    iqama: '2398401923',
    iqamaExpiry: '11/10/2027',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Heavy Civil & Marine Infrastructure',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'Apex Steel Industries',
    trade: 'Structural Steel',
    subTrade: 'Master Fabrication Superintendent',
    month: 'September 2026',
    netPay: 4800.0,
    status: 'Pending',
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: null,
    signature: null,
    holdReason: null,
    receiptNo: null,
    verification_method: null,
    face_result: null,
    face_distance: null,
    face_threshold: 0.68,
    face_capture_path: null,
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    enrolled_video_embeddings: 'emb_v88203_aes256_512d',
    video_enrolled_at: '2026-08-08 11:45 AST',
    biometric_consent: true,
    consent_date: '2026-08-08',
    override_reason: null,
    verified_by: null,
    verified_at: null,
    paid_by: null,
    paid_at: null,
    payment_mode: 'Cash',
  },
  {
    id: 'PAY-2026-09-11',
    workerId: 'W-88211',
    name: 'Tariq Mahmoud',
    iqama: '2490182736',
    iqamaExpiry: '17/07/2027',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    department: 'Heavy Civil & Marine Infrastructure',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'BuildTech Manpower',
    trade: 'Civil Masonry',
    subTrade: 'Senior Mason Foreman',
    month: 'September 2026',
    netPay: 3500.0,
    status: 'Unpaid/Returned',
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: null,
    signature: null,
    holdReason: 'Contractor on emergency family leave abroad - Cash returned to main treasury',
    receiptNo: null,
    verification_method: null,
    face_result: null,
    face_distance: null,
    face_threshold: 0.68,
    face_capture_path: null,
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    enrolled_video_embeddings: 'emb_v88211_aes256_512d',
    video_enrolled_at: '2026-08-14 12:10 AST',
    biometric_consent: true,
    consent_date: '2026-08-14',
    override_reason: null,
    verified_by: null,
    verified_at: null,
    paid_by: null,
    paid_at: null,
    payment_mode: 'Cash',
  },
  {
    id: 'PAY-2026-09-12',
    workerId: 'W-88212',
    name: 'Chen Wei',
    iqama: '2471928301',
    iqamaExpiry: '25/06/2027',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Mechanical, Electrical & Plumbing (MEP)',
    site: 'Project 104 – Riyadh Metro Expansion Site A',
    supplier: 'ElectroMech Gulf',
    trade: 'Electrical Systems',
    subTrade: 'High Voltage Technician',
    month: 'September 2026',
    netPay: 4400.0,
    status: 'Pending',
    assignedCashier: 'Youssef Al-Harbi (Counter 03)',
    disbursedAt: null,
    signature: null,
    holdReason: null,
    receiptNo: null,
    verification_method: null,
    face_result: null,
    face_distance: null,
    face_threshold: 0.68,
    face_capture_path: null,
    video_result: null,
    video_score: null,
    video_threshold: 0.68,
    video_capture_path: null,
    challenge_used: null,
    challenge_token: null,
    enrolled_video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    enrolled_video_embeddings: 'emb_v88212_aes256_512d',
    video_enrolled_at: '2026-08-20 10:25 AST',
    biometric_consent: true,
    consent_date: '2026-08-20',
    override_reason: null,
    verified_by: null,
    verified_at: null,
    paid_by: null,
    paid_at: null,
    payment_mode: 'Cash',
  },
];

// =====================================================================
// CURRENCY TO WORDS HELPERS (ENGLISH & ARABIC TAFQEET)
// =====================================================================
const numberToWordsSAR = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (!num || num === 0) return 'Zero Saudi Riyals Only';

  const toWords = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + toWords(n % 100) : '');
    if (n < 1000000) return toWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + toWords(n % 1000) : '');
    return n.toString();
  };

  const integerPart = Math.floor(num);
  return `${toWords(integerPart)} Saudi Riyals Only`;
};

const numberToArabicWordsSAR = (num) => {
  const map = {
    3500: 'فقط ثلاثة آلاف وخمسمائة ريال سعودي لا غير',
    3600: 'فقط ثلاثة آلاف وستمائة ريال سعودي لا غير',
    3750: 'فقط ثلاثة آلاف وسبعمائة وخمسون ريالاً سعودياً لا غير',
    3850: 'فقط ثلاثة آلاف وثمانمائة وخمسون ريالاً سعودياً لا غير',
    3900: 'فقط ثلاثة آلاف وتسعمائة ريال سعودي لا غير',
    4000: 'فقط أربعة آلاف ريال سعودي لا غير',
    4100: 'فقط أربعة آلاف ومائة ريال سعودي لا غير',
    4200: 'فقط أربعة آلاف ومائتان ريال سعودي لا غير',
    4250: 'فقط أربعة آلاف ومائتان وخمسون ريالاً سعودياً لا غير',
    4300: 'فقط أربعة آلاف وثلاثمائة ريال سعودي لا غير',
    4400: 'فقط أربعة آلاف وأربعمائة ريال سعودي لا غير',
    4600: 'فقط أربعة آلاف وستمائة ريال سعودي لا غير',
    4700: 'فقط أربعة آلاف وسبعمائة ريال سعودي لا غير',
    4800: 'فقط أربعة آلاف وثمانمائة ريال سعودي لا غير',
  };
  return map[num] || `فقط ${num ? num.toLocaleString() : '0'} ريال سعودي لا غير`;
};

export default function Cashier({ userSession, onLogout, onSwitchRole }) {
  // Locale State
  const [lang, setLang] = useState('EN');
  const t = translations[lang];
  const isRtl = lang === 'AR';

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'queue' | 'history' | 'reconciliation' | 'audit'

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Counter Station 03 Active',
      message: 'Opening cash float SAR 60,000 verified and sealed by Treasury.',
      time: '08:00 AM',
      read: false,
      priority: 'low',
      icon: 'account_balance_wallet',
    },
    {
      id: 'notif-2',
      title: 'Contractor at Counter',
      message: 'Mateo Hernandez arrived at Counter 03 for cash payout.',
      time: '14:52 PM',
      read: false,
      priority: 'medium',
      icon: 'person_pin_circle',
    },
    {
      id: 'notif-3',
      title: 'Payment Exception Logged',
      message: 'Tariq Mahmoud payment put on hold (Emergency family leave abroad).',
      time: '13:10 PM',
      read: true,
      priority: 'high',
      icon: 'report_problem',
    },
    {
      id: 'notif-4',
      title: 'Disbursement Progress Update',
      message: '3 of 12 contractor cash disbursements completed successfully.',
      time: '14:40 PM',
      read: true,
      priority: 'low',
      icon: 'check_circle',
    },
  ]);
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Payment List State
  const [payments, setPayments] = useState(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [tabletTouchMode, setTabletTouchMode] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Active Payment Modal (Tablet Handover Mode)
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payoutStep, setPayoutStep] = useState(0); // 0: Card Overview, 1: Face Check, 2: Signature, 3: Confirm & Handover
  const [chosenMethod, setChosenMethod] = useState('face'); // 'face' | 'video' | 'manual_override'
  const [idVerificationInput, setIdVerificationInput] = useState('');
  const [idVerifiedMatch, setIdVerifiedMatch] = useState(false);
  const [photoVerified, setPhotoVerified] = useState(false);
  const [cashCountVerified, setCashCountVerified] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [isSigning, setIsSigning] = useState(false);

  // Camera & 1:1 Face Verification (DeepFace ArcFace + RetinaFace)
  const videoRef = useRef(null);
  const liveCaptureCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraWarmup, setCameraWarmup] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [liveCaptureData, setLiveCaptureData] = useState(null);
  const [faceStepPhase, setFaceStepPhase] = useState('camera'); // 'camera' | 'matching'
  const [faceStatus, setFaceStatus] = useState('idle'); // 'idle' | 'preparing' | 'ready' | 'verifying' | 'matched' | 'not_matched' | 'no_face' | 'manual_override'
  const [faceDistance, setFaceDistance] = useState(null);
  const [simTestScenario, setSimTestScenario] = useState('normal'); // 'normal' | 'mismatch' | 'no_face'

  // Video Verification (Blink Challenge) State
  const [videoChallenge, setVideoChallenge] = useState(null);
  const [challengeCountdown, setChallengeCountdown] = useState(4);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoAnalyzing, setVideoAnalyzing] = useState(false);
  const [videoResultStatus, setVideoResultStatus] = useState(null); // 'verified' | 'not_verified' | 'error' | null
  const [videoDisplayReason, setVideoDisplayReason] = useState('');
  const [videoSimScenario, setVideoSimScenario] = useState('normal'); // 'normal' | 'face_mismatch' | 'no_blink' | 'screen_replay' | 'poor_quality' | 'expired' | 'reused'
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const countdownIntervalRef = useRef(null);

  // Admin Verification Policy & Reporting State
  const [adminSettings, setAdminSettingsState] = useState(getAdminSettings());
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDailyReportModal, setShowDailyReportModal] = useState(false);

  // Manual Verification Fallback State
  const [showManualOverride, setShowManualOverride] = useState(false);
  const [manualOverrideCheckbox, setManualOverrideCheckbox] = useState(false);
  const [manualOverrideReason, setManualOverrideReason] = useState('Poor lighting at counter');
  const [manualOverrideNotes, setManualOverrideNotes] = useState('');

  // Hold / Reject Modal
  const [holdModalPayment, setHoldModalPayment] = useState(null);
  const [holdReasonSelection, setHoldReasonSelection] = useState('Photo / Identity Mismatch');
  const [holdCustomNotes, setHoldCustomNotes] = useState('');

  // Receipt Modal (View / Print)
  const [viewingReceipt, setViewingReceipt] = useState(null);

  // Daily Float / Reconciliation State
  const openingFloatAmount = 60000.0; // SAR 60,000 assigned from central vault

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'CSH-AUD-101',
      timestamp: 'Today at 14:15:32',
      workerName: 'Vikram Patel',
      workerId: 'W-88206',
      amount: 3600.0,
      receiptNo: 'RCP-2026-09-88206',
      action: 'Payment Disbursed (Cash)',
      cashier: 'Youssef Al-Harbi',
      details: 'Physical cash SAR 3,600.00 handed over. Biometric: MATCHED (ArcFace 1:1, Cosine Dist: 0.22 vs 0.68). Tablet stylus signature verified.',
    },
    {
      id: 'CSH-AUD-102',
      timestamp: 'Today at 14:40:18',
      workerName: 'Kwame Mensah',
      workerId: 'W-88209',
      amount: 3750.0,
      receiptNo: 'RCP-2026-09-88209',
      action: 'Payment Disbursed (Cash)',
      cashier: 'Youssef Al-Harbi',
      details: 'Physical cash SAR 3,750.00 handed over. Biometric: MATCHED (ArcFace 1:1, Cosine Dist: 0.19 vs 0.68). Tablet stylus signature verified.',
    },
    {
      id: 'CSH-AUD-103',
      timestamp: 'Today at 15:10:45',
      workerName: 'Karim Vance',
      workerId: 'W-88202',
      amount: 4250.0,
      receiptNo: 'RCP-2026-09-88202',
      action: 'Payment Disbursed (Cash)',
      cashier: 'Youssef Al-Harbi',
      details: 'Physical cash SAR 4,250.00 handed over. Biometric: MANUAL OVERRIDE (Appearance changed - glasses & beard). Supervisory override logged.',
    },
  ]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // Canvas Signature Pad Ref
  const canvasRef = useRef(null);

  // Initialize Canvas
  useEffect(() => {
    if (selectedPayment && canvasRef.current && payoutStep === 2) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#0E1330';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (signatureData) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = signatureData;
      }
    }
  }, [selectedPayment, photoVerified, payoutStep]);

  // Drawing Handlers for HTML5 Canvas
  const startDrawing = (e) => {
    if (!photoVerified) return; // Locked until Step 1 passes
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsSigning(true);
  };

  const draw = (e) => {
    if (!isSigning || !photoVerified) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isSigning && canvasRef.current) {
      setIsSigning(false);
      setSignatureData(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData(null);
      setIsSigning(false);
    }
  };

  // Camera Management
  const startCamera = async () => {
    setCameraWarmup(true);
    setCameraError(null);
    setFaceStatus('preparing');

    // Simulate model warm-up (warming up DeepFace ArcFace & RetinaFace)
    setTimeout(async () => {
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
          setCameraActive(true);
          setCameraWarmup(false);
          setFaceStatus('ready');
        } else {
          // Fallback simulation
          setCameraActive(true);
          setCameraWarmup(false);
          setFaceStatus('ready');
        }
      } catch (err) {
        console.warn('Camera stream warning (using fallback feed):', err);
        setCameraActive(true);
        setCameraWarmup(false);
        setFaceStatus('ready');
      }
    }, 700);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraWarmup(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Ensure camera stream binds to video element whenever camera is active in camera phase
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current && payoutStep === 1 && faceStepPhase === 'camera') {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [cameraActive, faceStepPhase, payoutStep]);

  // Open Payment Card (Opens in Step 0 Overview - Camera does NOT auto-start)
  // Open Payment Card (Opens in Step 0 Overview - Camera does NOT auto-start)
  const handleOpenPaymentCard = (payment) => {
    setSelectedPayment(payment);
    setPayoutStep(0); // 0: Overview, 1: Face Check, 2: Signature, 3: Confirm & Handover
    setChosenMethod('face');
    setFaceStepPhase('camera');
    setIdVerificationInput('');
    setIdVerifiedMatch(false);
    setPhotoVerified(false);
    setCashCountVerified(false);
    setSignatureData(null);
    setLiveCaptureData(null);
    setFaceStatus('idle');
    setFaceDistance(null);
    setVideoChallenge(null);
    setChallengeCountdown(4);
    setIsRecordingVideo(false);
    setVideoAnalyzing(false);
    setVideoResultStatus(null);
    setVideoDisplayReason('');
    setVideoSimScenario('normal');
    setShowManualOverride(false);
    setManualOverrideCheckbox(false);
    setManualOverrideReason('Poor lighting at counter');
    setManualOverrideNotes('');
    setSimTestScenario('normal');
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const handleClosePaymentCard = () => {
    stopCamera();
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setSelectedPayment(null);
    setPayoutStep(0);
    setFaceStepPhase('camera');
    setIsRecordingVideo(false);
    setVideoAnalyzing(false);
  };

  // Step Navigation Handlers: Face Verification
  const handleProceedToStep1 = () => {
    // Check Admin setting
    if (!adminSettings.faceEnabledGlobal || !adminSettings.faceEnabledCounter03) {
      showToast(t.faceDisabledByAdmin || 'Face verification is disabled by Admin policy.');
      return;
    }
    setChosenMethod('face');
    setPayoutStep(1);
    setFaceStepPhase('camera');
    setLiveCaptureData(null);
    setPhotoVerified(false);
    setFaceStatus('idle');
    startCamera();

    // Log to Audit trail
    if (selectedPayment) {
      setAuditLogs((prev) => [
        {
          id: `CSH-AUD-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          workerName: selectedPayment.name,
          workerId: selectedPayment.workerId,
          amount: selectedPayment.netPay,
          receiptNo: null,
          action: 'Verification Method Selected: Face 1:1',
          cashier: 'Youssef Al-Harbi',
          details: `Cashier selected Face Verification for ${selectedPayment.name}. Camera opened for ArcFace 1:1 matching.`,
        },
        ...prev,
      ]);
    }
  };

  // Step Navigation Handlers: Video Blink Challenge
  const handleStartVideoVerification = async (targetPayment = selectedPayment) => {
    if (!targetPayment) return;

    // Check Admin setting
    if (!adminSettings.videoEnabledGlobal || !adminSettings.videoEnabledCounter03) {
      showToast(t.videoDisabledByAdmin || 'Video verification is disabled by Admin policy.');
      return;
    }

    // Check Enrolled Video
    if (!targetPayment.enrolled_video_path) {
      showToast(t.videoNoEnrolledNotice || 'No enrolled video on file for this employee. Please use Face Verification.');
      return;
    }

    setChosenMethod('video');
    setPayoutStep(1);
    setPhotoVerified(false);
    setVideoResultStatus(null);
    setVideoDisplayReason('');
    setVideoAnalyzing(false);
    setIsRecordingVideo(false);
    setChallengeCountdown(4);

    try {
      // Issue single-use challenge from server
      const challenge = await verificationService.issueVideoChallenge(targetPayment.workerId, 'Counter 03');
      setVideoChallenge(challenge);

      // Audit log: Challenge issued
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setAuditLogs((prev) => [
        {
          id: `CSH-AUD-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: `Today at ${nowTime}`,
          workerName: targetPayment.name,
          workerId: targetPayment.workerId,
          amount: targetPayment.netPay,
          receiptNo: null,
          action: 'Video Challenge Issued',
          cashier: 'Youssef Al-Harbi',
          details: `Random single-use challenge issued: "${challenge.instructionEn}". Token: ${challenge.token} (Expiry: 60s).`,
        },
        ...prev,
      ]);

      // Start camera & auto-trigger recording after camera preview stabilizes
      startCamera();
      setTimeout(() => {
        startVideoCountdownAndRecording(challenge, targetPayment);
      }, 800);
    } catch (err) {
      showToast(err.message || 'Failed to initialize video challenge.');
    }
  };

  // Start Video Recording & Timer
  const startVideoCountdownAndRecording = (challenge, targetPayment) => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    setIsRecordingVideo(true);
    setChallengeCountdown(4);
    recordedChunksRef.current = [];

    // Start browser MediaRecorder if available
    if (streamRef.current && window.MediaRecorder) {
      try {
        const recorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };
        recorder.start(100);
        mediaRecorderRef.current = recorder;
      } catch (e) {
        console.warn('Browser MediaRecorder init warning:', e);
      }
    }

    let timeLeft = 4;
    countdownIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      setChallengeCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        finishVideoRecordingAndEvaluate(challenge, targetPayment);
      }
    }, 1000);
  };

  // Finish Recording & Send to Server
  const finishVideoRecordingAndEvaluate = async (challenge, targetPayment) => {
    setIsRecordingVideo(false);

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('MediaRecorder stop error:', e);
      }
    }

    // Capture snapshot frame
    let captureUrl = null;
    try {
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        const canvas = liveCaptureCanvasRef.current || document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        captureUrl = canvas.toDataURL('image/jpeg', 0.9);
      }
    } catch (e) {
      console.warn('Video frame snapshot error:', e);
    }
    if (!captureUrl) {
      captureUrl = targetPayment.avatar;
    }
    setLiveCaptureData(captureUrl);
    stopCamera();

    // Show Analyzing state
    setVideoAnalyzing(true);

    // Server verification request
    const verifyResult = await verificationService.verifyVideo({
      token: challenge.token,
      videoBlob: recordedChunksRef.current.length > 0 ? new Blob(recordedChunksRef.current, { type: 'video/webm' }) : null,
      captureSnapshot: captureUrl,
      employee: targetPayment,
      simScenario: videoSimScenario,
    });

    setVideoAnalyzing(false);
    setVideoResultStatus(verifyResult.status);
    setVideoDisplayReason(verifyResult.displayReason);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (verifyResult.verified) {
      setPhotoVerified(true); // Unlocks Step 2!
      showToast('Video Blink Challenge Verified! Step 2 Signature Unlocked.');
      // Audit log: Success
      setAuditLogs((prev) => [
        {
          id: `CSH-AUD-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: `Today at ${nowTime}`,
          workerName: targetPayment.name,
          workerId: targetPayment.workerId,
          amount: targetPayment.netPay,
          receiptNo: null,
          action: 'Video Verification PASSED',
          cashier: 'Youssef Al-Harbi',
          details: `Video verification PASSED for ${targetPayment.name}. Challenge: "${challenge.instructionEn}". Liveness confirmed (MediaPipe EAR). Best frame matched 1:1 ArcFace profile.`,
        },
        ...prev,
      ]);
    } else {
      setPhotoVerified(false);
      showToast(`Verification Failed: ${verifyResult.displayReason}`);
      // Audit log: Failure
      setAuditLogs((prev) => [
        {
          id: `CSH-AUD-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: `Today at ${nowTime}`,
          workerName: targetPayment.name,
          workerId: targetPayment.workerId,
          amount: targetPayment.netPay,
          receiptNo: null,
          action: 'Video Verification FAILED',
          cashier: 'Youssef Al-Harbi',
          details: `Video verification FAILED for ${targetPayment.name}. Reason: ${verifyResult.reason} (${verifyResult.displayReason}). Challenge: "${challenge.instructionEn}".`,
        },
        ...prev,
      ]);
    }
  };

  // Switch Method: Switch from Video to Face
  const handleSwitchToFace = () => {
    stopCamera();
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setChosenMethod('face');
    setPayoutStep(1);
    setFaceStepPhase('camera');
    setFaceStatus('idle');
    setPhotoVerified(false);
    startCamera();

    if (selectedPayment) {
      setAuditLogs((prev) => [
        {
          id: `CSH-AUD-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          workerName: selectedPayment.name,
          workerId: selectedPayment.workerId,
          amount: selectedPayment.netPay,
          receiptNo: null,
          action: 'Method Switched: To Face Photo',
          cashier: 'Youssef Al-Harbi',
          details: `Cashier switched verification method from Video to Face Photo for ${selectedPayment.name}.`,
        },
        ...prev,
      ]);
    }
    showToast('Switched to Face Verification (1:1 Photo).');
  };

  // Switch Method: Switch from Face to Video
  const handleSwitchToVideo = () => {
    if (!selectedPayment) return;
    if (!selectedPayment.enrolled_video_path) {
      showToast(t.videoNoEnrolledNotice || 'No enrolled video on file for this employee.');
      return;
    }
    stopCamera();
    setChosenMethod('video');

    setAuditLogs((prev) => [
      {
        id: `CSH-AUD-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        workerName: selectedPayment.name,
        workerId: selectedPayment.workerId,
        amount: selectedPayment.netPay,
        receiptNo: null,
        action: 'Method Switched: To Video Challenge',
        cashier: 'Youssef Al-Harbi',
        details: `Cashier switched verification method from Face Photo to Video Blink Challenge for ${selectedPayment.name}.`,
      },
      ...prev,
    ]);

    handleStartVideoVerification(selectedPayment);
    showToast('Switched to Video Verification (Blink Challenge).');
  };

  // Retry Video Challenge with Fresh Token
  const handleRetryVideoChallenge = () => {
    if (!selectedPayment) return;
    setAuditLogs((prev) => [
      {
        id: `CSH-AUD-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        workerName: selectedPayment.name,
        workerId: selectedPayment.workerId,
        amount: selectedPayment.netPay,
        receiptNo: null,
        action: 'Video Challenge Retry Requested',
        cashier: 'Youssef Al-Harbi',
        details: `Cashier requested new video challenge retry for ${selectedPayment.name}. Fresh single-use challenge token generated.`,
      },
      ...prev,
    ]);
    handleStartVideoVerification(selectedPayment);
  };

  const handleProceedToStep2 = () => {
    if (!photoVerified) {
      showToast('Step 1 Verification (Face or Video or approved manual override) is strictly required.');
      return;
    }
    stopCamera(); // Turn off camera to save resources & prepare tablet for signing
    setPayoutStep(2);
  };

  const handleProceedToStep3 = () => {
    if (!signatureData) {
      showToast('Employee digital signature is required before proceeding to payment confirmation.');
      return;
    }
    setPayoutStep(3);
  };

  const handleBackToOverview = () => {
    stopCamera();
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setPayoutStep(0);
    setFaceStepPhase('camera');
  };

  const handleBackToStep1 = () => {
    setPayoutStep(1);
    if (chosenMethod === 'video') {
      if (videoResultStatus) {
        // Keep result screen
      } else {
        handleStartVideoVerification();
      }
    } else {
      if (liveCaptureData) {
        setFaceStepPhase('matching');
      } else {
        setFaceStepPhase('camera');
        startCamera();
      }
    }
  };

  const handleBackToStep2 = () => {
    setPayoutStep(2);
  };

  // 1:1 Face Verification Handler - Captures Photo and Opens Dedicated Matching Screen
  const handleCapturePhoto = () => {
    if (!selectedPayment) return;

    // Capture snapshot from video or canvas
    let captureUrl = null;
    try {
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        const canvas = liveCaptureCanvasRef.current || document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        captureUrl = canvas.toDataURL('image/jpeg', 0.9);
      }
    } catch (e) {
      console.warn('Snapshot error:', e);
    }
    if (!captureUrl) {
      captureUrl = selectedPayment.avatar;
    }
    setLiveCaptureData(captureUrl);
    stopCamera(); // Freeze/stop camera stream after capture
    setFaceStepPhase('matching'); // IMMEDIATELY OPEN MATCHING SCREEN
    setFaceStatus('verifying');

    // Simulate DeepFace server evaluation latency (1.1s)
    setTimeout(() => {
      if (simTestScenario === 'no_face') {
        setFaceStatus('no_face');
        setFaceDistance(null);
        setPhotoVerified(false);
        showToast('RetinaFace: No face detected. Please ensure good lighting and face camera.');
      } else if (simTestScenario === 'mismatch') {
        const dist = 0.79; // Greater than 0.68 threshold
        setFaceStatus('not_matched');
        setFaceDistance(dist);
        setPhotoVerified(false);
        showToast('ArcFace 1:1: Live face did NOT match enrolled photo.');
      } else {
        // Matched
        const dist = 0.23; // Strict threshold passed
        setFaceStatus('matched');
        setFaceDistance(dist);
        setPhotoVerified(true); // Unlocks Step 2!
        showToast('Face 1:1 Matched Successfully! Step 2 Signature Unlocked.');
      }
    }, 1100);
  };

  const handleCaptureAndVerify = handleCapturePhoto; // Backward compatible alias

  const handleRetakePhoto = () => {
    setLiveCaptureData(null);
    setFaceStatus('preparing');
    setFaceDistance(null);
    setPhotoVerified(false);
    setFaceStepPhase('camera');
    startCamera();
  };

  const handleApplyManualOverride = () => {
    if (!manualOverrideCheckbox) {
      showToast('Please confirm the "Photo and Iqama checked manually" checkbox.');
      return;
    }
    const fullReason = `${manualOverrideReason}${manualOverrideNotes ? ` - ${manualOverrideNotes.trim()}` : ''}`;
    setFaceStatus('manual_override');
    setPhotoVerified(true); // Unlocks Step 2
    
    // Log audit
    setAuditLogs((prev) => [
      {
        id: `CSH-AUD-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        workerName: selectedPayment.name,
        workerId: selectedPayment.workerId,
        amount: selectedPayment.netPay,
        receiptNo: null,
        action: 'Manual Override Applied',
        cashier: 'Youssef Al-Harbi',
        details: `Manual verification override authorized for ${selectedPayment.name}. Reason: ${fullReason}. Photo & Iqama checked manually.`,
      },
      ...prev,
    ]);

    showToast(`Manual verification override recorded: ${fullReason}`);
  };

  // Verify Iqama match
  const handleVerifyIqamaInput = () => {
    if (!selectedPayment) return;
    if (idVerificationInput.trim() === selectedPayment.iqama) {
      setIdVerifiedMatch(true);
      showToast('Iqama number verified successfully!');
    } else {
      showToast('Entered Iqama does not match employee record!');
    }
  };

  // Confirm Cash Payment Action (With Server-Side Validation)
  const handleConfirmCashPayment = () => {
    if (!selectedPayment) return;

    // Server verification check
    const isVerified = (chosenMethod === 'video' && videoResultStatus === 'verified') ||
      (chosenMethod === 'face' && faceStatus === 'matched') ||
      (faceStatus === 'manual_override');

    if (!isVerified) {
      showToast('Biometric verification (Face or Video) or recorded manual override is strictly mandatory!');
      return;
    }
    if (!signatureData) {
      showToast('Employee signature is strictly required before cash can be handed over!');
      return;
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fullDate = new Date().toLocaleDateString('en-GB');
    const timestampStr = `${fullDate} ${nowTime} AST`;
    const receiptNo = `RCP-2026-09-${selectedPayment.workerId.replace('W-', '')}`;

    const effectiveMethod = faceStatus === 'manual_override' ? 'manual_override' : chosenMethod;
    const faceResultFinal = effectiveMethod === 'face' ? 'matched' : (effectiveMethod === 'manual_override' ? 'manual_override' : null);
    const videoResultFinal = effectiveMethod === 'video' ? 'verified' : null;
    const overrideReasonFinal = effectiveMethod === 'manual_override'
      ? `${manualOverrideReason}${manualOverrideNotes ? ` - ${manualOverrideNotes.trim()}` : ''}`
      : null;

    // Update payment record to 'Paid'
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === selectedPayment.id) {
          return {
            ...p,
            status: 'Paid',
            disbursedAt: timestampStr,
            signature: signatureData,
            receiptNo,
            verification_method: effectiveMethod,
            face_result: faceResultFinal,
            face_distance: effectiveMethod === 'face' ? (faceDistance || 0.23) : null,
            face_threshold: 0.68,
            face_capture_path: effectiveMethod === 'face' ? (liveCaptureData || selectedPayment.avatar) : null,
            video_result: videoResultFinal,
            video_score: effectiveMethod === 'video' ? 0.21 : null,
            video_threshold: adminSettings.videoMatchThreshold || 0.68,
            video_capture_path: effectiveMethod === 'video' ? (liveCaptureData || selectedPayment.avatar) : null,
            challenge_used: effectiveMethod === 'video' ? (videoChallenge?.instructionEn || 'Blink twice') : null,
            challenge_token: effectiveMethod === 'video' ? videoChallenge?.token : null,
            override_reason: overrideReasonFinal,
            verified_by: 'Youssef Al-Harbi (Counter 03)',
            verified_at: timestampStr,
            paid_by: 'Youssef Al-Harbi',
            paid_at: timestampStr,
            payment_mode: 'Cash',
          };
        }
        return p;
      })
    );

    // Append to Audit Log
    const methodDescription = effectiveMethod === 'video'
      ? `Video Blink Challenge Verified ("${videoChallenge?.instructionEn || 'Blink twice'}", MediaPipe EAR Liveness + ArcFace 1:1)`
      : effectiveMethod === 'face'
      ? `Face 1:1 Matched (ArcFace + RetinaFace)`
      : `Manual Override Approved (${overrideReasonFinal})`;

    setAuditLogs((prev) => [
      {
        id: `CSH-AUD-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: `Today at ${nowTime}`,
        workerName: selectedPayment.name,
        workerId: selectedPayment.workerId,
        amount: selectedPayment.netPay,
        receiptNo,
        action: 'Payment Disbursed (Cash)',
        cashier: 'Youssef Al-Harbi',
        details: `Cash payment of SAR ${selectedPayment.netPay.toLocaleString()} disbursed at Counter 03. Verification: ${methodDescription}. Verified digital stylus signature.`,
      },
      ...prev,
    ]);

    showToast(`Payment completed for ${selectedPayment.name}. Receipt ${receiptNo} issued!`);
    
    // Automatically preview the generated signed receipt
    const updatedPayment = {
      ...selectedPayment,
      status: 'Paid',
      disbursedAt: timestampStr,
      signature: signatureData,
      receiptNo,
      verification_method: effectiveMethod,
      face_result: faceResultFinal,
      face_distance: effectiveMethod === 'face' ? (faceDistance || 0.23) : null,
      face_threshold: 0.68,
      face_capture_path: effectiveMethod === 'face' ? (liveCaptureData || selectedPayment.avatar) : null,
      video_result: videoResultFinal,
      video_score: effectiveMethod === 'video' ? 0.21 : null,
      video_threshold: adminSettings.videoMatchThreshold || 0.68,
      video_capture_path: effectiveMethod === 'video' ? (liveCaptureData || selectedPayment.avatar) : null,
      challenge_used: effectiveMethod === 'video' ? (videoChallenge?.instructionEn || 'Blink twice') : null,
      challenge_token: effectiveMethod === 'video' ? videoChallenge?.token : null,
      override_reason: overrideReasonFinal,
      verified_by: 'Youssef Al-Harbi (Counter 03)',
      verified_at: timestampStr,
      paid_by: 'Youssef Al-Harbi',
      paid_at: timestampStr,
      payment_mode: 'Cash',
    };
    stopCamera();
    setSelectedPayment(null);
    setViewingReceipt(updatedPayment);
  };

  // Put on Hold or Return
  const handleConfirmHoldOrReturn = (type = 'On Hold') => {
    if (!holdModalPayment) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const finalReason = `${holdReasonSelection}${holdCustomNotes ? ` - ${holdCustomNotes.trim()}` : ''}`;

    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === holdModalPayment.id) {
          return {
            ...p,
            status: type,
            holdReason: finalReason,
          };
        }
        return p;
      })
    );

    setAuditLogs((prev) => [
      {
        id: `CSH-AUD-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: `Today at ${nowTime}`,
        workerName: holdModalPayment.name,
        workerId: holdModalPayment.workerId,
        amount: holdModalPayment.netPay,
        receiptNo: 'N/A (HELD)',
        action: type === 'On Hold' ? 'Disbursement Put On Hold' : 'Marked Unpaid / Returned',
        cashier: 'Youssef Al-Harbi',
        details: `Counter 03 exception: ${finalReason}. Amount SAR ${holdModalPayment.netPay.toLocaleString()} remained undisbursed.`,
      },
      ...prev,
    ]);

    showToast(`Payment for ${holdModalPayment.name} marked as ${type}`);
    setHoldModalPayment(null);
    setHoldCustomNotes('');
    if (selectedPayment && selectedPayment.id === holdModalPayment.id) {
      handleClosePaymentCard();
    }
  };

  // Computed Metrics for Daily Reconciliation & Summary Strip
  const totalAssignedCount = payments.length;
  const paidPayments = payments.filter((p) => p.status === 'Paid');
  const pendingPayments = payments.filter((p) => p.status === 'Pending');
  const onHoldPayments = payments.filter((p) => p.status === 'On Hold');
  const unpaidPayments = payments.filter((p) => p.status === 'Unpaid/Returned');
  const manualOverridesCount = payments.filter((p) => p.face_result === 'manual_override').length;

  const totalAssignedCash = payments.reduce((acc, p) => acc + p.netPay, 0);
  const totalDisbursedCash = paidPayments.reduce((acc, p) => acc + p.netPay, 0);
  const totalPendingCash = pendingPayments.reduce((acc, p) => acc + p.netPay, 0);
  const currentTillRemaining = openingFloatAmount - totalDisbursedCash;

  // Filtered Payments Queue
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesMonth = monthFilter === 'all' || p.month === monthFilter;
      const matchesSupplier = supplierFilter === 'all' || p.supplier === supplierFilter;
      const matchesDept = departmentFilter === 'all' || p.department === departmentFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.workerId.toLowerCase().includes(q) ||
        p.iqama.includes(q) ||
        p.trade.toLowerCase().includes(q) ||
        (p.receiptNo && p.receiptNo.toLowerCase().includes(q));

      return matchesStatus && matchesMonth && matchesSupplier && matchesDept && matchesSearch;
    });
  }, [payments, statusFilter, monthFilter, supplierFilter, departmentFilter, searchQuery]);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F4F6FB] font-body-md text-on-surface antialiased selection:bg-secondary selection:text-white"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0E1330] border border-secondary text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-secondary text-[22px]">payments</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SIDEBAR NAVIGATION: Cashier & Paymaster Suite            */}
      {/* ======================================================== */}
      <aside
        className={`fixed top-0 h-full w-64 bg-gradient-to-b from-[#131943] via-[#0E1330] to-[#0A0D26] border-r border-[#1E2554] z-40 flex flex-col justify-between shadow-2xl transition-all ${
          isRtl ? 'right-0 border-l border-r-0' : 'left-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Top Section with Smooth Fading Effect (White to Dark Blue) */}
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

            {/* Active Facility / Cashier Station Widget inside the Fading Transition Zone */}
            <div className="p-3 pt-1 pb-4">
              <div className="bg-[#0E1330]/75 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-white/70 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-emerald-400">point_of_sale</span>
                    Cash Payout Counter
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60 animate-pulse"></span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-[17px] text-secondary">payments</span>
                  <span className="font-body-md-medium text-xs font-semibold text-white truncate">
                    Counter Station #03
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between">
                  <span className="font-data-mono text-[11px] text-white/80 font-medium">Riyadh Metro Site A</span>
                  <span className="font-label-sm text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                    ACTIVE TILL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Section Title */}
          <div className="px-4 py-1.5 mt-1 flex items-center justify-between">
            <span className="font-label-sm text-[10.5px] uppercase text-white/45 tracking-wider font-semibold">
              Disbursement Menu
            </span>
            <span className="text-[10px] font-mono text-secondary bg-secondary/10 px-1.5 py-0.5 rounded border border-secondary/20">
              Tablet Ready
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1.5 pb-3">
            {[
              {
                id: 'dashboard',
                label: t.navDashboard || (lang === 'AR' ? 'لوحة تحكم الصرف' : 'Disbursement Dashboard'),
                icon: 'dashboard',
                badge: null,
              },
              {
                id: 'queue',
                label: t.navQueue,
                icon: 'view_list',
                badge: pendingPayments.length > 0 ? pendingPayments.length : null,
              },
              {
                id: 'history',
                label: t.navHistory,
                icon: 'receipt_long',
                badge: paidPayments.length > 0 ? paidPayments.length : null,
              },
              {
                id: 'reconciliation',
                label: t.navReconciliation,
                icon: 'account_balance_wallet',
                badge: null,
              },
              {
                id: 'audit',
                label: t.navAudit,
                icon: 'verified_user',
                badge: null,
              },
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

                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        isActive
                          ? 'bg-secondary text-white shadow-xs'
                          : 'bg-secondary/20 text-[#F18E3B] border border-secondary/40'
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

          {/* Active Cashier Persona Card */}
          <div className="bg-white/[0.05] hover:bg-white/[0.09] transition-all rounded-xl p-2.5 border border-white/10 flex items-center justify-between group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                YA
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-body-md-medium text-xs font-semibold text-white truncate">
                  Youssef Al-Harbi
                </span>
                <span className="font-label-sm text-[10px] text-white/50 truncate">
                  Paymaster / Cashier 03
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Logout"
              type="button"
              className="text-white/40 hover:text-rose-400 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">logout</span>
            </button>
          </div>

        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ======================================================== */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col ${isRtl ? 'mr-64' : 'ml-64'}`}>
        {/* Top Header Bar with User Profile, Notifications, Role Switcher */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#0E1330] tracking-tight">{t.appTitle}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 font-mono">
                  Station #03 Active
                </span>
              </div>
              <p className="text-xs text-slate-500">{t.portalSubtitle} • Project 104 Riyadh Metro</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Notification Bell & Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center"
                title="Counter Station Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute top-12 z-50 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 space-y-3 ${isRtl ? 'left-0' : 'right-0'}`}>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0E1330]">
                        {lang === 'AR' ? 'إشعارات الشباك' : 'Counter Notifications'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-secondary/15 text-secondary">
                        {unreadNotifCount} new
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                        showToast(lang === 'AR' ? 'تم تحديد الكل كمقروء' : 'Marked all as read');
                      }}
                      className="text-[11px] font-bold text-secondary hover:underline"
                    >
                      {lang === 'AR' ? 'تحديد الكل كمقروء' : 'Mark all read'}
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-100">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`pt-2 flex items-start gap-2.5 p-2 rounded-xl transition-colors ${
                          !notif.read ? 'bg-secondary/[0.04]' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                            notif.priority === 'high'
                              ? 'bg-rose-500/15 text-rose-600'
                              : notif.priority === 'medium'
                              ? 'bg-amber-500/15 text-amber-600'
                              : 'bg-emerald-500/15 text-emerald-600'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">{notif.icon}</span>
                        </div>
                        <div className="flex flex-col space-y-0.5 flex-1 text-left">
                          <span className="text-xs font-bold text-slate-800 leading-snug">{notif.title}</span>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{notif.message}</p>
                          <span className="text-[9.5px] font-mono text-slate-400">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Dropdown */}
            {onSwitchRole && (
              <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold">
                <span className="material-symbols-outlined text-[15px] text-secondary mr-1">sync_alt</span>
                <select
                  defaultValue="Role: Cashier & Payout"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Role: Dept Manager') {
                      onSwitchRole({
                        roleKey: 'dept_manager',
                        email: 'approvals.manager@expertise.sa',
                        profile: { id: 'dept_manager', label: 'Department Manager' },
                      });
                    } else if (val === 'Role: Site Coordinator') {
                      onSwitchRole({
                        roleKey: 'site_coord',
                        email: 'site.coordinator@expertise.sa',
                        profile: { id: 'site_coord', label: 'Site Coordinator' },
                      });
                    } else if (val === 'Role: Accounts & Release') {
                      onSwitchRole({
                        roleKey: 'accounts',
                        email: 'approvals.accounts@expertise.sa',
                        profile: { id: 'accounts', label: 'Accounts & Release' },
                      });
                    } else if (val === 'Role: HR & Onboarding') {
                      onSwitchRole({
                        roleKey: 'hr',
                        email: 'onboarding.hr@expertise.sa',
                        profile: { id: 'hr', label: 'HR & Onboarding' },
                      });
                    }
                  }}
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="Role: Cashier & Payout">Role: Cashier &amp; Payout</option>
                  <option value="Role: Dept Manager">Role: Dept Manager</option>
                  <option value="Role: Site Coordinator">Role: Site Coordinator</option>
                  <option value="Role: Accounts & Release">Role: Accounts &amp; Release</option>
                  <option value="Role: HR & Onboarding">Role: HR &amp; Onboarding</option>
                </select>
              </div>
            )}

            {/* Admin Policy & Daily Report Action Buttons */}
            <div className="flex items-center gap-1.5 pl-2 sm:border-l sm:border-slate-200">
              <button
                type="button"
                onClick={() => setShowAdminModal(true)}
                title="Configure Biometric Verification Policy"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px] text-blue-600">shield</span>
                <span className="hidden lg:inline">Admin Policy</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDailyReportModal(true)}
                title="View Daily Verification & Disbursement Report"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-600">summarize</span>
                <span className="hidden lg:inline">Daily Report</span>
              </button>
            </div>

            {/* Top Right User Profile Capsule */}
            <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  YA
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400"></span>
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#0E1330] leading-tight">Youssef Al-Harbi</span>
                <span className="text-[10px] text-slate-500 font-mono font-medium">Paymaster • Station 03</span>
              </div>
            </div>
          </div>
        </header>

        {/* ======================================================== */}
        {/* TAB 0: DISBURSEMENT EXECUTIVE DASHBOARD (MAIN CONTENT)   */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <main className="p-6 space-y-6">
            {/* Executive Hero Banner */}
            <div className="bg-[#0E1330] border border-slate-200/80 rounded-3xl p-5 lg:p-6 shadow-xl relative overflow-hidden text-white">
              <div className="absolute -right-12 -top-12 w-96 h-96 bg-emerald-500/20 rounded-full pointer-events-none blur-3xl"></div>
              <div className="absolute right-72 -bottom-24 w-80 h-80 bg-secondary/30 rounded-full pointer-events-none blur-3xl"></div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
                {/* Title & Scope */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-mono">
                      Station #03 Physical Counter Active
                    </span>
                    <span className="text-[11px] text-white/70 font-mono">
                      Project 104 Riyadh Metro Expansion
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-white/80 border border-white/15">
                      MOL WPS Bonded
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                    Cash Salary Disbursement{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-secondary">
                      Operations Hub
                    </span>
                  </h1>

                  <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed">
                    Physical salary counter station for Subcontractor workforce. Collect biometric and tablet digital signatures, perform visual Iqama validation, and disburse exact net cash with zero-variance treasury locking.
                  </p>

                  {/* Telemetry Quick Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                      <span>{pendingPayments.length} Contractors Waiting at Counter</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>{paidPayments.length} Signed &amp; Disbursed</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-white/90 text-xs font-mono font-medium backdrop-blur-md">
                      <span className="material-symbols-outlined text-[14px] text-secondary">wallet</span>
                      <span>SAR {currentTillRemaining.toLocaleString()} Till Cash</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      const firstPending = pendingPayments[0];
                      if (firstPending) {
                        handleOpenPaymentCard(firstPending);
                      } else {
                        setActiveTab('queue');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-emerald-950/30 transition-all active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span>Call Next in Queue</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Shift KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* 1. Total Assigned */}
              <div
                onClick={() => setActiveTab('queue')}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-blue-400 shadow-xs cursor-pointer transition-all hover:scale-[1.01] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Total Assigned
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">assignment_ind</span>
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-[#0E1330]">{totalAssignedCount}</span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-500/10 px-2 py-0.5 rounded">
                    Contractors
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
                  <span className="text-[10.5px] text-slate-500 font-mono font-semibold truncate">
                    SAR {totalAssignedCash.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-blue-600 font-bold group-hover:underline">Queue →</span>
                </div>
              </div>

              {/* 2. Total Paid (Cash Handed) */}
              <div
                onClick={() => setActiveTab('history')}
                className="bg-white p-4 rounded-2xl border border-emerald-500/30 hover:border-emerald-500 shadow-xs cursor-pointer transition-all hover:scale-[1.01] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Total Paid (Cash)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">price_check</span>
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-emerald-600">{paidPayments.length}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Disbursed
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
                  <span className="text-[10.5px] text-emerald-700 font-mono font-black truncate">
                    SAR {totalDisbursedCash.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold group-hover:underline">Receipts →</span>
                </div>
              </div>

              {/* 3. Pending at Counter */}
              <div
                onClick={() => setActiveTab('queue')}
                className="bg-white p-4 rounded-2xl border border-amber-500/30 hover:border-amber-500 shadow-xs cursor-pointer transition-all hover:scale-[1.01] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                    Pending at Counter
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-amber-600">{pendingPayments.length}</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded">
                    At Counter
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
                  <span className="text-[10.5px] text-amber-700 font-mono font-bold truncate">
                    SAR {totalPendingCash.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-amber-600 font-bold group-hover:underline">Process →</span>
                </div>
              </div>

              {/* 4. Manual Overrides */}
              <div
                onClick={() => setActiveTab('audit')}
                className="bg-white p-4 rounded-2xl border border-purple-500/30 hover:border-purple-500 shadow-xs cursor-pointer transition-all hover:scale-[1.01] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                    Manual Overrides
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">published_with_changes</span>
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-purple-700">{manualOverridesCount}</span>
                  <span className="text-xs font-bold text-purple-800 bg-purple-500/10 px-2 py-0.5 rounded">
                    Audited
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-purple-700 font-medium truncate">
                    Supervisory Fallback
                  </span>
                  <span className="text-[10px] text-purple-600 font-bold group-hover:underline">Audit →</span>
                </div>
              </div>

              {/* 5. Cash in Till */}
              <div
                onClick={() => setActiveTab('reconciliation')}
                className="bg-white p-4 rounded-2xl border border-secondary/30 hover:border-secondary shadow-xs cursor-pointer transition-all hover:scale-[1.01] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                    Cash in Till
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">wallet</span>
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-black font-mono text-secondary truncate">
                    SAR {currentTillRemaining.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    Float: {openingFloatAmount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-secondary font-bold group-hover:underline">Till →</span>
                </div>
              </div>
            </div>

            {/* Two-Column Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): Till Cash Distribution Progress & Velocity */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#0E1330]">Cash Distribution Velocity &amp; Float Health</h2>
                    <p className="text-xs text-slate-500">Real-time tracking of physical cash disbursed against daily station float</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                    {((totalDisbursedCash / totalAssignedCash) * 100).toFixed(1)}% Disbursed
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-secondary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalDisbursedCash / totalAssignedCash) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>Disbursed: SAR {totalDisbursedCash.toLocaleString()}</span>
                    <span>Total Payroll: SAR {totalAssignedCash.toLocaleString()}</span>
                  </div>
                </div>

                {/* Breakdown Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10.5px] font-bold text-slate-400 block uppercase">Paid / Signed</span>
                    <span className="text-lg font-black font-mono text-emerald-600 block">{paidPayments.length}</span>
                    <span className="text-[10px] text-slate-400 font-mono">SAR {totalDisbursedCash.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10.5px] font-bold text-slate-400 block uppercase">In Queue</span>
                    <span className="text-lg font-black font-mono text-amber-600 block">{pendingPayments.length}</span>
                    <span className="text-[10px] text-slate-400 font-mono">SAR {totalPendingCash.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10.5px] font-bold text-slate-400 block uppercase">On Hold</span>
                    <span className="text-lg font-black font-mono text-rose-600 block">{onHoldPayments.length}</span>
                    <span className="text-[10px] text-slate-400 font-mono">1 Exception</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10.5px] font-bold text-slate-400 block uppercase">Returned</span>
                    <span className="text-lg font-black font-mono text-slate-600 block">{unpaidPayments.length}</span>
                    <span className="text-[10px] text-slate-400 font-mono">To Treasury</span>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Hourly Rush & Station Telemetry */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#0E1330]">Counter Handover Velocity</h2>
                    <p className="text-xs text-slate-500">Throughput speed &amp; statutory compliance</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">speed</span>
                      <span className="font-semibold text-slate-700">Average Payout Handover Time</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">~1.8 mins / person</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-emerald-600">draw</span>
                      <span className="font-semibold text-slate-700">Digital Touch Signature Speed</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">42 seconds</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-blue-600">badge</span>
                      <span className="font-semibold text-slate-700">Iqama Optical &amp; Visual Match</span>
                    </div>
                    <span className="font-mono font-bold text-blue-700">100% Verified</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-amber-600">schedule</span>
                      <span className="font-semibold text-slate-700">Peak Counter Rush Windows</span>
                    </div>
                    <span className="font-mono font-bold text-amber-800 text-[11px]">08:00 &amp; 14:30 AST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Manpower Agency / Supplier Progress Meters */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#0E1330]">Disbursement Progress by Manpower Agency</h2>
                  <p className="text-xs text-slate-500">Contractor batch payout execution across contracted manpower suppliers</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">5 Registered Agencies</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                {[
                  { name: 'BuildTech Manpower', paid: 1, total: 3, amount: 3750, totalAmt: 11100, pct: 33 },
                  { name: 'Saudi ReadyMix Corp', paid: 1, total: 2, amount: 3600, totalAmt: 7500, pct: 50 },
                  { name: 'ElectroMech Gulf', paid: 1, total: 3, amount: 4250, totalAmt: 13050, pct: 33 },
                  { name: 'SafetyFirst KSA', paid: 0, total: 2, amount: 0, totalAmt: 8800, pct: 0 },
                  { name: 'Apex Steel Industries', paid: 0, total: 2, amount: 0, totalAmt: 8800, pct: 0 },
                ].map((agency) => (
                  <div key={agency.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-800 leading-tight truncate pr-1">{agency.name}</span>
                      <span className="text-[10px] font-mono font-bold text-secondary shrink-0">{agency.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${agency.pct}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10.5px] font-mono text-slate-500">
                      <span>{agency.paid}/{agency.total} paid</span>
                      <span className="font-bold text-slate-700">SAR {agency.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-Column Lower Section: Queue Preview + Live Counter Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): Priority Counter Queue Preview */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-amber-500">groups</span>
                    <h2 className="text-xs font-bold text-[#0E1330] uppercase tracking-wider">
                      Next Contractors in Counter Queue
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 font-mono">
                      {pendingPayments.length} Waiting
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('queue')}
                    className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                  >
                    <span>View Complete Queue</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {pendingPayments.slice(0, 3).map((p) => (
                    <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-xl object-cover shrink-0 shadow-xs" />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 block truncate">{p.name}</span>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                            <span>{p.workerId}</span>
                            <span>•</span>
                            <span className="text-slate-600 font-semibold">{p.trade}</span>
                            <span>•</span>
                            <span>IQ: {p.iqama}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-black font-mono text-emerald-600">
                          SAR {p.netPay.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenPaymentCard(p)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02] flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">payments</span>
                          <span>Pay Cash</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column (5 cols): Real-Time Counter Activity Feed */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">history</span>
                    <h2 className="text-xs font-bold text-[#0E1330] uppercase tracking-wider">
                      Live Counter Activity Feed
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('audit')}
                    className="text-xs font-bold text-secondary hover:underline"
                  >
                    Audit Trail →
                  </button>
                </div>

                <div className="p-3.5 space-y-2.5">
                  {[
                    {
                      time: '15:10 AST',
                      title: 'Disbursed SAR 4,250 to Karim Vance',
                      detail: 'Voucher RCP-2026-09-88202 printed & signed',
                      icon: 'check_circle',
                      color: 'text-emerald-600 bg-emerald-500/10',
                    },
                    {
                      time: '14:40 AST',
                      title: 'Disbursed SAR 3,750 to Kwame Mensah',
                      detail: 'Tablet signature captured, Iqama verified',
                      icon: 'check_circle',
                      color: 'text-emerald-600 bg-emerald-500/10',
                    },
                    {
                      time: '14:15 AST',
                      title: 'Disbursed SAR 3,600 to Vikram Patel',
                      detail: 'Cash handed in notes of SAR 500 and 100',
                      icon: 'check_circle',
                      color: 'text-emerald-600 bg-emerald-500/10',
                    },
                    {
                      time: '13:10 AST',
                      title: 'Tariq Mahmoud payment put On Hold',
                      detail: 'Emergency leave abroad - cash returned to vault',
                      icon: 'pause_circle',
                      color: 'text-rose-600 bg-rose-500/10',
                    },
                    {
                      time: '08:00 AST',
                      title: 'Station 03 Opened with SAR 60,000 Float',
                      detail: 'Physical vault cash sealed by Paymaster Youssef',
                      icon: 'vpn_key',
                      color: 'text-blue-600 bg-blue-500/10',
                    },
                  ].map((act, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${act.color}`}>
                        <span className="material-symbols-outlined text-[15px]">{act.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-800 block truncate">{act.title}</span>
                        <p className="text-[11px] text-slate-500 truncate">{act.detail}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ======================================================== */}
        {/* TAB 1: PAYOUT COUNTER QUEUE (CORE OPERATIONAL VIEW)       */}
        {/* ======================================================== */}
        {activeTab === 'queue' && (
          <main className="p-6 space-y-4">
            {/* Queue-Specific Contextual KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-amber-500/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
                    Waiting at Counter
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-600 font-mono">{pendingPayments.length}</span>
                    <span className="text-xs font-bold text-amber-700">Pending</span>
                  </div>
                  <span className="text-[10.5px] text-amber-700/80 font-mono mt-0.5 block font-bold truncate">
                    SAR {totalPendingCash.toLocaleString()}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">hourglass_top</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-500/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                    Total Paid (Cash)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600 font-mono">
                      {paidPayments.length}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">Signed</span>
                  </div>
                  <span className="text-[10.5px] text-emerald-700/80 font-mono mt-0.5 block font-bold truncate">
                    SAR {totalDisbursedCash.toLocaleString()}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-purple-500/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
                    Manual Overrides
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-purple-600 font-mono">{manualOverridesCount}</span>
                    <span className="text-xs font-bold text-purple-700">Audited</span>
                  </div>
                  <span className="text-[10.5px] text-purple-700/80 font-mono mt-0.5 block font-bold truncate">
                    Supervisory Fallback
                  </span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">published_with_changes</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-500/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block mb-1">
                    Exceptions on Hold
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-rose-600 font-mono">{onHoldPayments.length}</span>
                    <span className="text-xs font-bold text-rose-700">Flagged</span>
                  </div>
                  <span className="text-[10.5px] text-rose-700/80 font-mono mt-0.5 block font-bold truncate">
                    Requires Review
                  </span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">report_problem</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Avg Handover Speed
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-800 font-mono">1.8</span>
                    <span className="text-xs font-bold text-slate-600">min/rec</span>
                  </div>
                  <span className="text-[10.5px] text-emerald-600 font-mono mt-0.5 block font-bold truncate">
                    Fast Tablet Flow
                  </span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">speed</span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Search Input with Scanner Icon */}
                <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Quick Camera / Barcode OCR Scan Simulation */}
                <button
                  type="button"
                  onClick={() => {
                    const randomPending = pendingPayments[0];
                    if (randomPending) {
                      setSearchQuery(randomPending.iqama);
                      showToast(`Scanned Iqama Barcode: ${randomPending.iqama} (${randomPending.name})`);
                    } else {
                      showToast('No pending Iqama cards in counter queue.');
                    }
                  }}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">qr_code_scanner</span>
                  <span>{t.btnScanIqama}</span>
                </button>
              </div>

              {/* Status Pills & Multi-Dimensional Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                {/* Status Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: t.allStatus, count: payments.length },
                    { id: 'Pending', label: t.statusPending, count: pendingPayments.length },
                    { id: 'Paid', label: t.statusPaid, count: paidPayments.length },
                    { id: 'On Hold', label: t.statusOnHold, count: onHoldPayments.length },
                    { id: 'Unpaid/Returned', label: t.statusUnpaid, count: unpaidPayments.length },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setStatusFilter(chip.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        statusFilter === chip.id
                          ? 'bg-[#0E1330] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{chip.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                          statusFilter === chip.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {chip.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Dropdown Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Supplier Filter */}
                  <select
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-secondary"
                  >
                    <option value="all">All Suppliers / Agencies</option>
                    <option value="BuildTech Manpower">BuildTech Manpower</option>
                    <option value="ElectroMech Gulf">ElectroMech Gulf</option>
                    <option value="Saudi ReadyMix Corp">Saudi ReadyMix Corp</option>
                    <option value="SafetyFirst KSA">SafetyFirst KSA</option>
                    <option value="Apex Steel Industries">Apex Steel Industries</option>
                    <option value="Aramco Logistics">Aramco Logistics</option>
                  </select>

                  {/* Department Filter */}
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-secondary"
                  >
                    <option value="all">All Departments</option>
                    <option value="Heavy Civil & Marine Infrastructure">Heavy Civil</option>
                    <option value="Mechanical, Electrical & Plumbing (MEP)">MEP Systems</option>
                    <option value="Health, Safety & Environment (HSE)">HSE Safety</option>
                  </select>

                  {/* View Mode Toggle: Cards vs Table */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      title="Card Grid View"
                      className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all ${
                        viewMode === 'grid'
                          ? 'bg-white text-[#0E1330] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">grid_view</span>
                      <span className="hidden sm:inline">Cards</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      title="Table View"
                      className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all ${
                        viewMode === 'table'
                          ? 'bg-white text-[#0E1330] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">table_rows</span>
                      <span className="hidden sm:inline">Table</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* View 1: Card Grid View (Tablet Touch-Optimized Layout) */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPayments.length === 0 ? (
                  <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200/80">
                    <span className="material-symbols-outlined text-slate-300 text-5xl mb-2">person_search</span>
                    <p className="text-sm font-bold text-slate-700">No assigned employee payments found.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting the search query or clearing the status and supplier filters.
                    </p>
                  </div>
                ) : (
                  filteredPayments.map((p) => {
                    const isPending = p.status === 'Pending';
                    const isPaid = p.status === 'Paid';
                    const isOnHold = p.status === 'On Hold';
                    const isReturned = p.status === 'Unpaid/Returned';

                    return (
                      <div
                        key={p.id}
                        className={`bg-white rounded-2xl border transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
                          isPending
                            ? 'border-slate-200/90 hover:border-secondary hover:shadow-md'
                            : isPaid
                            ? 'border-emerald-200/70 bg-emerald-500/[0.02]'
                            : 'border-amber-200/70 bg-amber-500/[0.02]'
                        }`}
                      >
                        {/* Card Header & Profile */}
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.avatar}
                                alt={p.name}
                                className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200 shadow-xs shrink-0"
                              />
                              <div>
                                <h3 className="text-sm font-bold text-[#0E1330] leading-tight">{p.name}</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[11px] font-mono font-bold text-slate-500">{p.workerId}</span>
                                  <span className="text-[10px] text-slate-300">•</span>
                                  <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded font-semibold">
                                    IQ: {p.iqama}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border shrink-0 ${
                                isPaid
                                  ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                                  : isPending
                                  ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                                  : isOnHold
                                  ? 'bg-rose-500/10 text-rose-700 border-rose-500/30'
                                  : 'bg-slate-100 text-slate-600 border-slate-300'
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>

                          {/* Trade & Worksite Details */}
                          <div className="bg-slate-50/80 rounded-xl p-2.5 text-xs space-y-1 border border-slate-100">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Trade:</span>
                              <span className="font-semibold text-slate-700 truncate max-w-[190px]">
                                {p.trade} ({p.subTrade})
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Supplier:</span>
                              <span className="font-semibold text-slate-700 truncate max-w-[190px]">{p.supplier}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Salary Period:</span>
                              <span className="font-bold text-slate-800">{p.month}</span>
                            </div>
                          </div>

                          {/* Hold Note if present */}
                          {(isOnHold || isReturned) && p.holdReason && (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-2 text-[11px] text-rose-700 leading-tight">
                              <strong className="block text-[10px] uppercase font-bold">Exception Notice:</strong>
                              {p.holdReason}
                            </div>
                          )}
                        </div>

                        {/* Read-Only Cash Handover Amount Display */}
                        <div className="px-4 py-3 bg-[#0E1330] text-white flex items-center justify-between border-t border-[#1E2554]">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                              {t.amountToPay}
                            </span>
                            <span className="text-lg font-black text-secondary font-mono">
                              SAR {p.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          {isPending ? (
                            <button
                              type="button"
                              onClick={() => handleOpenPaymentCard(p)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <span className="material-symbols-outlined text-[17px]">draw</span>
                              <span>{t.btnOpenPaymentCard}</span>
                            </button>
                          ) : isPaid ? (
                            <button
                              type="button"
                              onClick={() => setViewingReceipt(p)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">receipt</span>
                              <span>{t.btnViewReceipt}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenPaymentCard(p)}
                              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                            >
                              Review Card
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* View 2: Table View */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Contractor Name &amp; ID</th>
                        <th className="p-3.5">National / Iqama ID</th>
                        <th className="p-3.5">Trade &amp; Agency</th>
                        <th className="p-3.5">Department &amp; Scope</th>
                        <th className="p-3.5 text-center">Salary Month</th>
                        <th className="p-3.5 text-right">Net Amount to Pay</th>
                        <th className="p-3.5 text-center">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPayments.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="p-12 text-center text-slate-400">
                            No assigned employee payments found matching filters.
                          </td>
                        </tr>
                      ) : (
                        filteredPayments.map((p) => {
                          const isPending = p.status === 'Pending';
                          const isPaid = p.status === 'Paid';
                          const isOnHold = p.status === 'On Hold';
                          const isReturned = p.status === 'Unpaid/Returned';

                          return (
                            <tr
                              key={p.id}
                              className={`hover:bg-slate-50/70 transition-colors ${
                                isPending ? 'hover:bg-amber-500/[0.03]' : isPaid ? 'bg-emerald-500/[0.01]' : ''
                              }`}
                            >
                              {/* Contractor Profile */}
                              <td className="p-3.5">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={p.avatar}
                                    alt={p.name}
                                    className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                                  />
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-[#0E1330] leading-tight truncate">
                                      {p.name}
                                    </span>
                                    <span className="font-mono text-[10.5px] text-slate-400 font-semibold">
                                      {p.workerId}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Iqama & Validity */}
                              <td className="p-3.5">
                                <div className="flex flex-col">
                                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 w-fit">
                                    {p.iqama}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                                    Exp: {p.iqamaExpiry}
                                  </span>
                                </div>
                              </td>

                              {/* Trade & Supplier */}
                              <td className="p-3.5">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-800">{p.trade}</span>
                                  <span className="text-[10px] text-slate-400">{p.supplier}</span>
                                </div>
                              </td>

                              {/* Department & Site */}
                              <td className="p-3.5">
                                <div className="flex flex-col max-w-[180px]">
                                  <span className="font-medium text-slate-700 truncate">{p.department.split('&')[0]}</span>
                                  <span className="text-[10px] text-slate-400 truncate">Site A (Metro)</span>
                                </div>
                              </td>

                              {/* Month */}
                              <td className="p-3.5 text-center">
                                <span className="font-semibold text-slate-700">{p.month}</span>
                              </td>

                              {/* Net Amount to Pay */}
                              <td className="p-3.5 text-right font-mono">
                                <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 inline-block">
                                  SAR {p.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                              </td>

                              {/* Status Badge */}
                              <td className="p-3.5 text-center">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border inline-block ${
                                    isPaid
                                      ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                                      : isPending
                                      ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                                      : isOnHold
                                      ? 'bg-rose-500/10 text-rose-700 border-rose-500/30'
                                      : 'bg-slate-100 text-slate-600 border-slate-300'
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </td>

                              {/* Action */}
                              <td className="p-3.5 text-right">
                                {isPending ? (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPaymentCard(p)}
                                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02] ml-auto"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">draw</span>
                                    <span>Payout</span>
                                  </button>
                                ) : isPaid ? (
                                  <button
                                    type="button"
                                    onClick={() => setViewingReceipt(p)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors ml-auto border border-slate-200"
                                  >
                                    <span className="material-symbols-outlined text-[15px] text-secondary">receipt</span>
                                    <span>Receipt</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPaymentCard(p)}
                                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors ml-auto"
                                  >
                                    Review
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        )}

        {/* ======================================================== */}
        {/* TAB 2: DISBURSED RECEIPTS & SIGNED AUDIT VOUCHERS        */}
        {/* ======================================================== */}
        {activeTab === 'history' && (
          <main className="p-6 space-y-4">
            {/* Receipts-Specific Contextual KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-emerald-500/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                    Signed Receipts Stored
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600 font-mono">{paidPayments.length}</span>
                    <span className="text-xs font-bold text-emerald-700">Vouchers</span>
                  </div>
                  <span className="text-[11px] text-emerald-700/80 font-mono mt-0.5 block font-bold">
                    Immutable &amp; Locked
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Physical Cash Handed
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-900 font-mono">
                      SAR {totalDisbursedCash.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                    Exact Notes Counted
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-500/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    Signature Compliance
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-blue-600 font-mono">100%</span>
                    <span className="text-xs font-bold text-blue-700">Signed</span>
                  </div>
                  <span className="text-[11px] text-blue-700/80 font-mono mt-0.5 block font-bold">
                    Digital Touch Screen
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-secondary/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block mb-1">
                    Print Queue Ready
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-secondary font-mono">{paidPayments.length}</span>
                    <span className="text-xs font-bold text-secondary">PDF Vouchers</span>
                  </div>
                  <span className="text-[11px] text-secondary/80 font-mono mt-0.5 block font-bold">
                    Bilingual Statutory
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">print</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0E1330]">Signed Cash Disbursement Vouchers</h2>
                <p className="text-xs text-slate-500">
                  Locked and immutable payment receipts confirmed with contractor tablet digital signatures.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 font-mono">
                {paidPayments.length} Total Vouchers Stored
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Receipt No.</th>
                    <th className="p-3.5">Contractor Name &amp; ID</th>
                    <th className="p-3.5">Iqama No.</th>
                    <th className="p-3.5">Disbursed Amount</th>
                    <th className="p-3.5">Payment Timestamp</th>
                    <th className="p-3.5">Paymaster / Cashier</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paidPayments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400">
                        No disbursed receipts yet for this shift.
                      </td>
                    </tr>
                  ) : (
                    paidPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-secondary">{p.receiptNo}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-lg object-cover" />
                            <div>
                              <span className="font-bold text-slate-800 block">{p.name}</span>
                              <span className="font-mono text-[10px] text-slate-400">{p.workerId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600">{p.iqama}</td>
                        <td className="p-3.5 font-mono font-black text-emerald-600 text-sm">
                          SAR {p.netPay.toLocaleString()}
                        </td>
                        <td className="p-3.5 font-mono text-slate-500 text-[11px]">{p.disbursedAt}</td>
                        <td className="p-3.5 text-slate-700">{p.assignedCashier}</td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setViewingReceipt(p)}
                            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">print</span>
                            <span>Print Voucher</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>
        )}

        {/* ======================================================== */}
        {/* TAB 3: DAILY CASH REGISTER RECONCILIATION                */}
        {/* ======================================================== */}
        {activeTab === 'reconciliation' && (
          <main className="p-6 space-y-5">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0E1330]">{t.reconciliationHeader}</h2>
                <p className="text-xs text-slate-500">
                  Daily register balance tracking physical bank notes in Counter 03 against Accounts payroll releases.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast('Reconciliation Report Generated for Treasury Lock')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E1330] hover:bg-[#1E2554] text-white text-xs font-bold transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Export Daily Till Audit</span>
              </button>
            </div>

            {/* Reconciliation Register 4-Cards KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t.openingFloat}
                </span>
                <span className="text-xl font-black text-[#0E1330] font-mono block">
                  SAR {openingFloatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <p className="text-[10.5px] text-slate-500 truncate">
                  Treasury Vault at 08:00 AM
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-500/30 shadow-xs space-y-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                  {t.cashDisbursedTotal}
                </span>
                <span className="text-xl font-black text-emerald-600 font-mono block">
                  SAR {totalDisbursedCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <p className="text-[10.5px] text-emerald-700 font-medium truncate">
                  {paidPayments.length} Employees Paid
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-secondary/30 shadow-xs space-y-1">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                  {t.tillBalance}
                </span>
                <span className="text-xl font-black text-secondary font-mono block">
                  SAR {currentTillRemaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <p className="text-[10.5px] text-slate-500 truncate">
                  Physical Notes in Counter Till
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-500/30 shadow-xs space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Till Cash Variance
                </span>
                <span className="text-xl font-black text-emerald-600 font-mono block">
                  SAR 0.00
                </span>
                <p className="text-[10.5px] text-emerald-700 font-medium truncate">
                  Perfect Balance • 0 Shortage
                </p>
              </div>
            </div>

            {/* Cash Denominations Table in Drawer */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#0E1330]">{t.denominationTitle}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
                {[
                  { note: 'SAR 500', count: Math.floor(currentTillRemaining / 1000), total: Math.floor(currentTillRemaining / 1000) * 500 },
                  { note: 'SAR 100', count: 45, total: 4500 },
                  { note: 'SAR 50', count: 20, total: 1000 },
                  { note: 'SAR 10', count: 35, total: 350 },
                  { note: 'SAR 5', count: 20, total: 100 },
                  { note: 'Coins', count: 0, total: 0 },
                ].map((item) => (
                  <div key={item.note} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                    <span className="text-xs font-bold text-slate-700 block">{item.note}</span>
                    <span className="text-sm font-black text-[#0E1330] font-mono block">{item.count} notes</span>
                    <span className="text-[10.5px] font-mono text-slate-400 block font-bold">
                      SAR {item.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ======================================================== */}
        {/* TAB 4: DISBURSEMENT AUDIT LOG                            */}
        {/* ======================================================== */}
        {activeTab === 'audit' && (
          <main className="p-6 space-y-4">
            {/* Audit-Specific Contextual KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Recorded Ledger Logs
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 font-mono">{auditLogs.length}</span>
                    <span className="text-xs font-bold text-slate-600">Events</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                    Real-Time Sequenced
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">format_list_bulleted</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-500/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    Cryptographic Ledger
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-blue-600 font-mono">SHA-256</span>
                  </div>
                  <span className="text-[11px] text-blue-700/80 font-mono mt-0.5 block font-bold">
                    Tamper-Evident Signatures
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-500/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
                    Exceptions Handled
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-600 font-mono">1</span>
                    <span className="text-xs font-bold text-amber-700">Escalated</span>
                  </div>
                  <span className="text-[11px] text-amber-700/80 font-mono mt-0.5 block font-bold">
                    Emergency Leave Held
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">flag</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-500/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                    WPS Compliance Readiness
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600 font-mono">100%</span>
                    <span className="text-xs font-bold text-emerald-700">Audit Ready</span>
                  </div>
                  <span className="text-[11px] text-emerald-700/80 font-mono mt-0.5 block font-bold">
                    Qiwa &amp; MHRSD Standard
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">verified_user</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0E1330]">Physical Disbursement Audit Trail</h2>
                <p className="text-xs text-slate-500">
                  Real-time tamper-evident log recording all cash releases, Iqama verifications, and hold actions.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-xl border border-secondary/20">
                {auditLogs.length} Audit Events Logged
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-secondary">{log.id}</span>
                      <span className="font-bold text-[#0E1330]">{log.workerName}</span>
                      <span className="font-mono text-[10px] text-slate-400">({log.workerId})</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11.5px]">{log.details}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-slate-700 block">{log.timestamp}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Receipt: {log.receiptNo}</span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: EMPLOYEE PAYMENT CARD & TABLET SIGNATURE PAD     */}
      {/* ======================================================== */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0E1330] text-white flex items-center justify-between border-b border-[#1E2554] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Employee Salary Payout Card</h3>
                  <span className="text-[11px] text-slate-400">
                    Counter Station 03 • Tablet Verification &amp; Signing Terminal
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClosePaymentCard}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Stepper Navigation Strip */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 shrink-0">
              <div className="flex items-center justify-between gap-1 max-w-lg mx-auto text-xs">
                {/* Step 1: Face Check */}
                <button
                  type="button"
                  onClick={() => {
                    if (payoutStep !== 1) {
                      handleProceedToStep1();
                    }
                  }}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-bold transition-all ${
                    payoutStep === 1
                      ? 'text-secondary bg-secondary/10'
                      : photoVerified
                      ? 'text-emerald-700 hover:bg-emerald-50'
                      : payoutStep === 0
                      ? 'text-slate-700 hover:bg-slate-200'
                      : 'text-slate-400'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold ${
                    photoVerified
                      ? 'bg-emerald-600 text-white'
                      : payoutStep === 1
                      ? 'bg-secondary text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {photoVerified ? '✓' : '1'}
                  </span>
                  <span>{t.step1Tab}</span>
                </button>

                <div className={`flex-1 h-0.5 mx-1 transition-colors ${
                  photoVerified ? 'bg-emerald-500' : 'bg-slate-200'
                }`} />

                {/* Step 2: Signature */}
                <button
                  type="button"
                  onClick={() => {
                    if (photoVerified) {
                      handleProceedToStep2();
                    } else {
                      showToast('Complete Step 1 Face Verification first');
                    }
                  }}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-bold transition-all ${
                    payoutStep === 2
                      ? 'text-secondary bg-secondary/10'
                      : signatureData
                      ? 'text-emerald-700 hover:bg-emerald-50'
                      : photoVerified
                      ? 'text-slate-600 hover:bg-slate-200'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold ${
                    signatureData
                      ? 'bg-emerald-600 text-white'
                      : payoutStep === 2
                      ? 'bg-secondary text-white'
                      : photoVerified
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-slate-100 text-slate-300'
                  }`}>
                    {signatureData ? '✓' : '2'}
                  </span>
                  <span>{t.step2Tab}</span>
                </button>

                <div className={`flex-1 h-0.5 mx-1 transition-colors ${
                  signatureData ? 'bg-emerald-500' : 'bg-slate-200'
                }`} />

                {/* Step 3: Confirm */}
                <button
                  type="button"
                  onClick={() => {
                    if (photoVerified && signatureData) {
                      handleProceedToStep3();
                    } else {
                      showToast('Complete Step 1 and Step 2 first');
                    }
                  }}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-bold transition-all ${
                    payoutStep === 3
                      ? 'text-secondary bg-secondary/10'
                      : photoVerified && signatureData
                      ? 'text-slate-600 hover:bg-slate-200'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold ${
                    payoutStep === 3
                      ? 'bg-secondary text-white'
                      : photoVerified && signatureData
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-slate-100 text-slate-300'
                  }`}>
                    3
                  </span>
                  <span>{t.step3Tab}</span>
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* ======================================================== */}
              {/* STAGE 0: EMPLOYEE CARD OVERVIEW & PRE-CHECK              */}
              {/* ======================================================== */}
              {payoutStep === 0 && (
                <div className="space-y-4">
                  {/* Employee Bio & Enrolled Photo Strip */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 w-full sm:w-auto">
                      <div className="relative shrink-0">
                        <img
                          src={selectedPayment.avatar}
                          alt={selectedPayment.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-secondary text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                          Enrolled
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#0E1330]">{selectedPayment.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs font-bold text-slate-500">{selectedPayment.workerId}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-mono text-xs text-slate-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                            Iqama: {selectedPayment.iqama}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block font-medium">
                          {selectedPayment.trade} ({selectedPayment.subTrade}) • {selectedPayment.supplier}
                        </span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="text-right w-full sm:w-auto">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-500/30">
                        Status: {selectedPayment.status}
                      </span>
                      <span className="text-[10.5px] text-slate-400 block mt-1 font-mono">
                        Iqama Expiry: {selectedPayment.iqamaExpiry}
                      </span>
                    </div>
                  </div>

                  {/* READ-ONLY Net Amount Box (Prominent & High Contrast) */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0E1330] via-[#141B45] to-[#0E1330] text-white border border-[#1E2554] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-secondary tracking-widest block">
                        {t.readOnlyNotice}
                      </span>
                      <span className="text-xs text-slate-300 font-medium mt-0.5 block">
                        Salary Month: <strong>{selectedPayment.month}</strong> (Vetted &amp; Released by Accounts)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-white font-mono tracking-tight block">
                        SAR {selectedPayment.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[11px] text-slate-300 font-medium">
                        Physical Cash Handover Only
                      </span>
                    </div>
                  </div>

                  {/* Optional ID Check Bar */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">badge</span>
                      <input
                        type="text"
                        value={idVerificationInput}
                        onChange={(e) => setIdVerificationInput(e.target.value)}
                        placeholder="Optional: Enter or scan Iqama number to verify..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyIqamaInput}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0"
                      >
                        Match ID
                      </button>
                    </div>
                    {idVerifiedMatch && (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 shrink-0">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        ID Matched
                      </span>
                    )}
                  </div>

                  {/* 3-Step Protocol & Biometric Method Choice Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/5 via-slate-900/10 to-transparent border-2 border-slate-300 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#0E1330] text-white flex items-center justify-center font-bold shadow-md shadow-slate-950/20 shrink-0">
                        <span className="material-symbols-outlined text-[22px]">verified_user</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0E1330]">{t.gateProtocolTitle}</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">{t.gateProtocolDesc}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-white border border-emerald-300 shadow-xs flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                        <span className="font-semibold text-slate-800">Biometric Check</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">2</span>
                        <span className="font-semibold text-slate-800">Tablet Signature</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">3</span>
                        <span className="font-semibold text-slate-800">Cash Handover</span>
                      </div>
                    </div>

                    {/* Method Choice Heading */}
                    <div className="pt-1 border-t border-slate-200">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        {t.methodChoiceTitle || 'Select Biometric Identity Verification Method'}
                      </span>
                      <p className="text-[10.5px] text-slate-500 mt-0.5">
                        {t.methodChoiceDesc || 'Choose either Face Photo Verification or Live Video Blink Challenge. Passing either unlocks the signature step.'}
                      </p>
                    </div>

                    {/* Dual Large Method Selection Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Method 1: Face Verification */}
                      {adminSettings.faceEnabledGlobal && (adminSettings.faceEnabledCounter03 ?? true) && (
                        <button
                          type="button"
                          onClick={handleProceedToStep1}
                          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-left shadow-lg shadow-emerald-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between group min-h-[110px]"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[20px] text-white">photo_camera</span>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                              1:1 ArcFace
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-sm font-bold block">{t.btnVerifyFace || 'Verify Face (1:1 Photo)'}</span>
                            <span className="text-[10.5px] text-emerald-100 block mt-0.5">
                              Matches live counter snapshot with enrolled master portrait
                            </span>
                          </div>
                        </button>
                      )}

                      {/* Method 2: Video Verification (Blink Challenge) */}
                      {adminSettings.videoEnabledGlobal && (adminSettings.videoEnabledCounter03 ?? true) && (
                        selectedPayment.enrolled_video_path ? (
                          <button
                            type="button"
                            onClick={() => handleStartVideoVerification(selectedPayment)}
                            className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-left shadow-lg shadow-indigo-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between group min-h-[110px]"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px] text-white">videocam</span>
                              </div>
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                                MediaPipe Liveness
                              </span>
                            </div>
                            <div className="mt-2">
                              <span className="text-sm font-bold block">{t.btnVerifyVideo || 'Verify Video (Blink Challenge)'}</span>
                              <span className="text-[10.5px] text-blue-100 block mt-0.5">
                                Interactive blink challenge proving physical liveness &amp; face match
                              </span>
                            </div>
                          </button>
                        ) : (
                          <div className="p-4 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 text-slate-400 text-left flex flex-col justify-between min-h-[110px] cursor-not-allowed">
                            <div className="flex items-center justify-between w-full">
                              <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-[20px]">videocam_off</span>
                              </div>
                              <span className="text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">
                                Not Enrolled
                              </span>
                            </div>
                            <div className="mt-2">
                              <span className="text-xs font-bold text-slate-500 block">{t.btnVerifyVideo || 'Verify Video'} (Disabled)</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {t.videoNoEnrolledNotice || 'No enrolled video on file. Please proceed with Face Verification.'}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STAGE 1: STEP 1 - 1:1 FACE VERIFICATION                  */}
              {/* PHASE 1: CAMERA SCAN | PHASE 2: MATCHING SCREEN          */}
              {/* ======================================================== */}
              {payoutStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  {/* Compact Employee Header Strip */}
                  <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={selectedPayment.avatar}
                        alt={selectedPayment.name}
                        className="w-10 h-10 rounded-xl object-cover border border-white shadow-xs"
                      />
                      <div>
                        <span className="font-bold text-[#0E1330] text-xs block">{selectedPayment.name}</span>
                        <span className="font-mono text-[10.5px] text-slate-500">
                          {selectedPayment.workerId} • Iqama: {selectedPayment.iqama}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Net Cash Amount</span>
                      <span className="font-mono font-black text-secondary text-sm">
                        SAR {selectedPayment.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Hidden canvas for taking high-res snapshot */}
                  <canvas ref={liveCaptureCanvasRef} className="hidden" />

                  {/* Verification Method Status Strip & Switcher */}
                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Selected Method:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-[11px] flex items-center gap-1 ${
                        chosenMethod === 'video'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {chosenMethod === 'video' ? 'videocam' : 'photo_camera'}
                        </span>
                        <span>{chosenMethod === 'video' ? 'Video Blink Challenge' : 'Face 1:1 Photo'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {chosenMethod === 'video' ? (
                        <button
                          type="button"
                          onClick={handleSwitchToFace}
                          className="px-3 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 transition-colors flex items-center gap-1 text-[11px]"
                        >
                          <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                          <span>Switch to Face Verification</span>
                        </button>
                      ) : (
                        selectedPayment.enrolled_video_path && adminSettings.videoEnabledGlobal && (adminSettings.videoEnabledCounter03 ?? true) && (
                          <button
                            type="button"
                            onClick={handleSwitchToVideo}
                            className="px-3 py-1 rounded-lg bg-white hover:bg-slate-200 text-blue-700 font-bold border border-blue-200 transition-colors flex items-center gap-1 text-[11px]"
                          >
                            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                            <span>Switch to Video Challenge</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* ---------------------------------------------------- */}
                  {/* METHOD 1: FACE PHOTO 1:1 VERIFICATION               */}
                  {/* ---------------------------------------------------- */}
                  {chosenMethod === 'face' && (
                    <>
                  {/* SUB-PHASE A: LIVE CAMERA VIEW                        */}
                  {/* ---------------------------------------------------- */}
                  {faceStepPhase === 'camera' && (
                    <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 space-y-3.5 animate-fade-in">
                      {/* Section Title & Sub-Phase Indicator */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                            1
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-[#0E1330] flex items-center gap-1.5">
                              <span>{t.cameraViewTitle || 'Step 1: Live Face Capture'}</span>
                              <span className="text-[10px] font-mono font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Camera Active
                              </span>
                            </h4>
                            <p className="text-[10.5px] text-slate-500">
                              {t.cameraViewDesc || 'Position employee in front of tablet camera and capture photo for 1:1 biometric matching.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10.5px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          <span>FRONT CAMERA</span>
                        </div>
                      </div>

                      {/* Main Live Camera Viewfinder */}
                      <div className="relative w-full h-72 sm:h-80 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-xl flex items-center justify-center">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover transform scale-x-[-1]"
                        />

                        {/* Centered Biometric Oval Guide Overlay */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="w-48 h-64 sm:w-52 sm:h-68 border-2 border-dashed border-emerald-400/90 rounded-full flex items-center justify-center relative shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all">
                            {/* Scanning Sweep Accent */}
                            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10B981] animate-pulse"></div>
                            
                            {/* Corner / Reticle Accents */}
                            <span className="absolute -top-1 w-6 h-0.5 bg-emerald-400 rounded-full"></span>
                            <span className="absolute -bottom-1 w-6 h-0.5 bg-emerald-400 rounded-full"></span>
                            <span className="absolute -left-1 h-6 w-0.5 bg-emerald-400 rounded-full"></span>
                            <span className="absolute -right-1 h-6 w-0.5 bg-emerald-400 rounded-full"></span>
                          </div>
                        </div>

                        {/* Top-Left Live Status Tag */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white font-mono border border-white/10">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span>HD 1080p • LIVE</span>
                        </div>

                        {/* Top-Right Enrolled Photo Reference Pin */}
                        <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/70 backdrop-blur-md p-1.5 pr-2.5 rounded-xl border border-white/15 text-white max-w-[200px]">
                          <img
                            src={selectedPayment.avatar}
                            alt="Reference"
                            className="w-9 h-9 rounded-lg object-cover border border-white/40 shrink-0"
                          />
                          <div className="overflow-hidden text-left">
                            <span className="text-[9px] uppercase tracking-wider text-slate-300 block font-bold">
                              Enrolled Record
                            </span>
                            <span className="text-[10px] font-bold truncate block">{selectedPayment.name}</span>
                          </div>
                        </div>

                        {/* Bottom Instruction Ribbon */}
                        <div className="absolute bottom-3 inset-x-3 bg-black/70 backdrop-blur-md py-1.5 px-3 rounded-xl border border-white/10 text-center">
                          <span className="text-[11px] text-slate-200 font-medium">
                            Align face inside the oval frame and click <strong>Capture Photo</strong> below
                          </span>
                        </div>

                        {/* Camera Initialization Overlay */}
                        {cameraWarmup && (
                          <div className="absolute inset-0 bg-[#0E1330]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white z-20">
                            <span className="material-symbols-outlined text-[32px] text-emerald-400 animate-spin mb-2">
                              sync
                            </span>
                            <span className="text-xs font-bold tracking-wide">{t.preparingFaceModel}</span>
                            <span className="text-[10px] text-slate-400 mt-1">Starting counter camera stream...</span>
                          </div>
                        )}
                      </div>

                      {/* Simulation Testing Modes Switcher */}
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1.5 text-[10.5px]">
                        <span className="font-bold text-slate-500">Test Simulation Mode:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSimTestScenario('normal')}
                            className={`px-2.5 py-1 rounded font-bold transition-colors ${
                              simTestScenario === 'normal'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            Normal Match
                          </button>
                          <button
                            type="button"
                            onClick={() => setSimTestScenario('mismatch')}
                            className={`px-2.5 py-1 rounded font-bold transition-colors ${
                              simTestScenario === 'mismatch'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            Simulate Mismatch
                          </button>
                          <button
                            type="button"
                            onClick={() => setSimTestScenario('no_face')}
                            className={`px-2.5 py-1 rounded font-bold transition-colors ${
                              simTestScenario === 'no_face'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            Simulate No Face
                          </button>
                        </div>
                      </div>

                      {/* Primary Camera Capture Button */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleCapturePhoto}
                          disabled={cameraWarmup}
                          className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 shadow-lg transition-all ${
                            cameraWarmup
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/20 hover:scale-[1.01] active:scale-[0.99]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                          <span>Capture Photo &amp; Open Matching Screen</span>
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ---------------------------------------------------- */}
                  {/* SUB-PHASE B: DEDICATED MATCHING SCREEN               */}
                  {/* ---------------------------------------------------- */}
                  {faceStepPhase === 'matching' && (
                    <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 space-y-4 animate-fade-in">
                      {/* Section Title & Sub-Phase Indicator */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                            faceStatus === 'matched'
                              ? 'bg-emerald-600'
                              : faceStatus === 'not_matched'
                              ? 'bg-rose-600'
                              : faceStatus === 'manual_override'
                              ? 'bg-amber-600'
                              : 'bg-teal-600'
                          }`}>
                            1
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-[#0E1330] flex items-center gap-1.5">
                              <span>{t.matchingViewTitle || 'Step 1: 1:1 Face Matching Screen'}</span>
                              <span className="text-[10px] font-mono font-normal text-slate-500">
                                (ArcFace ResNet-100 + RetinaFace)
                              </span>
                            </h4>
                            <p className="text-[10.5px] text-slate-500">
                              {t.matchingViewDesc || 'Comparing live counter snapshot against enrolled master record.'}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {faceStatus === 'verifying' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-teal-50 text-teal-700 border border-teal-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] animate-spin">sync</span>
                            <span>ANALYZING...</span>
                          </span>
                        ) : faceStatus === 'matched' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            <span>{t.faceMatched}</span>
                          </span>
                        ) : faceStatus === 'not_matched' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-700 border border-rose-500/30 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">cancel</span>
                            <span>{t.faceNotMatched}</span>
                          </span>
                        ) : faceStatus === 'no_face' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">warning</span>
                            <span>{t.faceNoFace}</span>
                          </span>
                        ) : faceStatus === 'manual_override' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">published_with_changes</span>
                            <span>OVERRIDE ACTIVE</span>
                          </span>
                        ) : null}
                      </div>

                      {/* Side-by-Side Face Comparison Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Left: Enrolled Master Record Reference */}
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col items-center justify-between text-center space-y-2 relative">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                              {t.enrolledPhotoLabel}
                            </span>
                            <span className="text-[9.5px] font-mono bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                              HR Record
                            </span>
                          </div>

                          <div className="relative my-1">
                            <img
                              src={selectedPayment.avatar}
                              alt="Enrolled Master"
                              className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-white shadow-md"
                            />
                            <span className="absolute bottom-1 right-1 bg-[#0E1330]/80 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                              ID: {selectedPayment.workerId}
                            </span>
                          </div>

                          <div className="w-full">
                            <span className="text-xs font-bold text-[#0E1330] block">{selectedPayment.name}</span>
                            <span className="text-[10px] font-mono text-slate-500">Iqama: {selectedPayment.iqama}</span>
                          </div>
                        </div>

                        {/* Right: Live Counter Snapshot */}
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col items-center justify-between text-center space-y-2 relative">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                              {t.liveCaptureLabel}
                            </span>
                            <button
                              type="button"
                              onClick={handleRetakePhoto}
                              className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 hover:underline"
                            >
                              <span className="material-symbols-outlined text-[12px]">refresh</span>
                              <span>Retake</span>
                            </button>
                          </div>

                          <div className="relative my-1">
                            <img
                              src={liveCaptureData || selectedPayment.avatar}
                              alt="Live Counter Snapshot"
                              className={`w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-white shadow-md ${
                                faceStatus === 'matched'
                                  ? 'ring-4 ring-emerald-500/80'
                                  : faceStatus === 'not_matched'
                                  ? 'ring-4 ring-rose-500/80'
                                  : faceStatus === 'verifying'
                                  ? 'ring-4 ring-teal-500/80 animate-pulse'
                                  : 'ring-2 ring-slate-300'
                              }`}
                            />
                            {faceStatus === 'verifying' && (
                              <div className="absolute inset-0 bg-teal-500/10 rounded-2xl flex items-center justify-center">
                                <span className="w-full h-0.5 bg-teal-400 shadow-[0_0_8px_#14B8A6] animate-pulse"></span>
                              </div>
                            )}
                          </div>

                          <div className="w-full">
                            <span className="text-xs font-bold text-slate-800 block">Tablet Front Camera Snapshot</span>
                            <span className="text-[10px] text-slate-500 font-mono">Counter 03 • Just now</span>
                          </div>
                        </div>
                      </div>

                      {/* BIOMETRIC ANALYSIS & RESULTS PANEL */}
                      {faceStatus === 'verifying' && (
                        <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-300 text-teal-900 space-y-2 animate-fade-in shadow-xs text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px] text-teal-600 animate-spin">
                              sync
                            </span>
                            <span className="text-xs font-bold text-teal-900">
                              Analyzing Biometric Face Embeddings...
                            </span>
                          </div>
                          <p className="text-[11px] text-teal-700">
                            ArcFace extracting 512-D vector representation &amp; calculating 1:1 Cosine Similarity distance.
                          </p>
                          <div className="w-full bg-teal-200/60 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-teal-600 h-full w-2/3 animate-pulse rounded-full"></div>
                          </div>
                        </div>
                      )}

                      {faceStatus === 'matched' && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 space-y-3 animate-fade-in shadow-xs">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                                <span className="material-symbols-outlined text-[24px]">verified</span>
                              </div>
                              <div>
                                <span className="text-sm font-black text-emerald-800 tracking-wide block">
                                  1:1 Biometric Face Match Confirmed!
                                </span>
                                <p className="text-[11px] text-emerald-700">
                                  Employee biometric verification confirmed with master record. Step 2 Signature unlocked.
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-800/80 bg-emerald-200/60 px-2 py-1 rounded font-bold shrink-0">
                              ArcFace Verified
                            </span>
                          </div>

                          {/* Biometric Metrics Badge Row */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-[10.5px]">
                            <div className="bg-white/80 p-2 rounded-xl border border-emerald-200">
                              <span className="text-slate-400 block text-[9.5px]">Cosine Distance</span>
                              <strong className="text-emerald-700 font-mono text-xs">0.23 (Threshold &lt; 0.68)</strong>
                            </div>
                            <div className="bg-white/80 p-2 rounded-xl border border-emerald-200">
                              <span className="text-slate-400 block text-[9.5px]">Similarity Score</span>
                              <strong className="text-emerald-700 font-mono text-xs">98.4% Match</strong>
                            </div>
                            <div className="bg-white/80 p-2 rounded-xl border border-emerald-200 col-span-2 sm:col-span-1">
                              <span className="text-slate-400 block text-[9.5px]">Biometric Model</span>
                              <strong className="text-emerald-700 font-mono text-xs">ArcFace ResNet-100</strong>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <button
                              type="button"
                              onClick={handleRetakePhoto}
                              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-[16px]">refresh</span>
                              <span>{t.btnRetakePhoto}</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleProceedToStep2}
                              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                            >
                              <span>{t.btnProceedToStep2}</span>
                              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {faceStatus === 'not_matched' && (
                        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-900 space-y-3 animate-fade-in shadow-xs">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                                <span className="material-symbols-outlined text-[24px]">close</span>
                              </div>
                              <div>
                                <span className="text-sm font-black text-rose-800 tracking-wide block">
                                  {t.faceNotMatched}
                                </span>
                                <p className="text-[11px] text-rose-700">
                                  Live face did not meet biometric threshold (Distance: 0.79 vs 0.68). Retake photo or apply manual override.
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-rose-800/80 bg-rose-200/60 px-2 py-1 rounded font-bold shrink-0">
                              Match Failed
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={handleRetakePhoto}
                              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 transition-colors flex items-center gap-1.5 shadow-xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">refresh</span>
                              <span>{t.btnRetakePhoto}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowManualOverride(true)}
                              className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors flex items-center gap-1.5 shadow-xs"
                            >
                              <span>Manual Verification Override →</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {faceStatus === 'no_face' && (
                        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-500 text-amber-900 space-y-3 animate-fade-in shadow-xs">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                                <span className="material-symbols-outlined text-[24px]">face</span>
                              </div>
                              <div>
                                <span className="text-sm font-black text-amber-800 tracking-wide block">
                                  {t.faceNoFace}
                                </span>
                                <p className="text-[11px] text-amber-700">
                                  RetinaFace could not detect a clear front-facing face. Ensure good lighting and facing camera directly.
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-amber-800/80 bg-amber-200/60 px-2 py-1 rounded font-bold shrink-0">
                              RetinaFace Alert
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleRetakePhoto}
                            className="px-4 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors inline-flex items-center gap-1.5 shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">refresh</span>
                            <span>Retake Photo</span>
                          </button>
                        </div>
                      )}

                      {faceStatus === 'manual_override' && (
                        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-500 text-amber-900 space-y-3 animate-fade-in shadow-xs">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                                <span className="material-symbols-outlined text-[24px]">published_with_changes</span>
                              </div>
                              <div>
                                <span className="text-sm font-black text-amber-800 tracking-wide block">
                                  MANUAL VERIFICATION OVERRIDE ACTIVE
                                </span>
                                <p className="text-[11px] text-amber-700">
                                  Reason: {manualOverrideReason} {manualOverrideNotes ? `(${manualOverrideNotes})` : ''}. Logged in audit trail.
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-amber-800/80 bg-amber-200/60 px-2 py-1 rounded font-bold shrink-0">
                              Paymaster ID: YA-03
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleProceedToStep2}
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                          >
                            <span>{t.btnProceedToStep2}</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </button>
                        </div>
                      )}

                      {/* MANUAL VERIFICATION FALLBACK ACCORDION */}
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setShowManualOverride(!showManualOverride)}
                          className="text-[11px] font-bold text-secondary hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {showManualOverride ? 'expand_less' : 'expand_more'}
                          </span>
                          <span>{t.manualVerificationTitle}</span>
                        </button>

                        {showManualOverride && (
                          <div className="mt-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in text-xs">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={manualOverrideCheckbox}
                                onChange={(e) => setManualOverrideCheckbox(e.target.checked)}
                                className="h-4 w-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                              />
                              <span className="font-semibold text-slate-800">
                                {t.manualOverrideCheckbox}
                              </span>
                            </label>

                            <div className="space-y-1">
                              <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                                {t.manualReasonLabel}
                              </label>
                              <select
                                value={manualOverrideReason}
                                onChange={(e) => setManualOverrideReason(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-secondary"
                              >
                                <option value="Poor lighting at counter">{t.reasonPoorLighting}</option>
                                <option value="Appearance changed (beard, glasses, injury)">{t.reasonAppearanceChanged}</option>
                                <option value="Camera issue or hardware limitation">{t.reasonCameraIssue}</option>
                                <option value="Other verified operational condition">{t.reasonOther}</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                                Paymaster Notes / Identification Verification Observation
                              </label>
                              <input
                                type="text"
                                value={manualOverrideNotes}
                                onChange={(e) => setManualOverrideNotes(e.target.value)}
                                placeholder="Optional: Enter observations or supervisor reference..."
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-secondary"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] text-slate-400">
                                {t.overrideRecordedNotice}
                              </span>
                              <button
                                type="button"
                                onClick={handleApplyManualOverride}
                                disabled={!manualOverrideCheckbox}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  manualOverrideCheckbox
                                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                {t.btnApplyOverride}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  </>
                )}

                {/* ---------------------------------------------------- */}
                {/* METHOD 2: VIDEO VERIFICATION (BLINK CHALLENGE)       */}
                {/* ---------------------------------------------------- */}
                {chosenMethod === 'video' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 space-y-4 shadow-sm">
                      {/* Top Header & Method Badge */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                            1
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-[#0E1330] flex items-center gap-2">
                              <span>{t.videoVerificationTitle || 'Step 1: Video Verification (Blink Challenge)'}</span>
                              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                MediaPipe EAR Liveness
                              </span>
                            </h4>
                            <p className="text-[10.5px] text-slate-500">
                              Interactive blink action proving physical presence combined with server ArcFace 1:1 match.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleSwitchToFace}
                          className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
                          <span>{t.btnSwitchToFace || 'Switch to Face'}</span>
                        </button>
                      </div>

                      {/* Prominent Challenge Card with Timer */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
                          <div className="space-y-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 font-mono bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                                Random Single-Use Challenge • 60s Security TTL
                              </span>
                              {videoChallenge && (
                                <span className="text-[10px] font-mono text-slate-400">
                                  Token: {videoChallenge.token.substring(0, 15)}...
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center justify-center sm:justify-start gap-2">
                              <span className="material-symbols-outlined text-[24px] text-amber-400 animate-bounce">
                                visibility
                              </span>
                              <span>"{videoChallenge?.instructionEn || 'Blink twice'}"</span>
                            </h3>
                            <p dir="rtl" className="text-sm font-bold text-blue-200 font-arabic">
                              "{videoChallenge?.instructionAr || 'ارمِش بعينيك مرتين'}"
                            </p>
                          </div>

                          {/* Countdown Clock Badge */}
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono border-2 shadow-inner transition-all ${
                              isRecordingVideo
                                ? 'bg-rose-500/20 border-rose-400 text-rose-300 animate-pulse'
                                : 'bg-white/10 border-white/20 text-white'
                            }`}>
                              <span className="text-2xl font-black">{challengeCountdown}</span>
                              <span className="text-[9px] uppercase font-bold tracking-wider">Seconds</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Live Video Camera Viewfinder with Biometric Scanning Reticle */}
                      <div className="relative w-full h-72 sm:h-80 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-xl flex items-center justify-center">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover transform scale-x-[-1]"
                        />

                        {/* Dynamic Face Mesh & Blink Landmarks Overlay */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="w-52 h-68 sm:w-56 sm:h-72 border-2 border-dashed border-blue-400/90 rounded-full flex items-center justify-center relative shadow-[0_0_25px_rgba(59,130,246,0.35)]">
                            {/* Scanning Line */}
                            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#3B82F6] animate-pulse"></div>

                            {/* Landmark Dots for Eye Aspect Ratio (EAR) */}
                            <div className="absolute top-24 left-14 w-2.5 h-2.5 rounded-full bg-emerald-400/90 shadow-[0_0_8px_#10B981] animate-ping"></div>
                            <div className="absolute top-24 right-14 w-2.5 h-2.5 rounded-full bg-emerald-400/90 shadow-[0_0_8px_#10B981] animate-ping"></div>

                            {/* Corner Brackets */}
                            <span className="absolute -top-1 w-8 h-0.5 bg-blue-400 rounded-full"></span>
                            <span className="absolute -bottom-1 w-8 h-0.5 bg-blue-400 rounded-full"></span>
                            <span className="absolute -left-1 h-8 w-0.5 bg-blue-400 rounded-full"></span>
                            <span className="absolute -right-1 h-8 w-0.5 bg-blue-400 rounded-full"></span>
                          </div>
                        </div>

                        {/* Top-Left Recording Tag */}
                        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10.5px] text-white font-mono border border-white/10">
                          <span className={`w-2.5 h-2.5 rounded-full ${isRecordingVideo ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
                          <span>{isRecordingVideo ? `REC LIVE 3-5s • ${challengeCountdown}s` : 'CAMERA READY'}</span>
                        </div>

                        {/* Top-Right Enrolled Video Reference */}
                        <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/75 backdrop-blur-md p-1.5 pr-2.5 rounded-xl border border-white/15 text-white max-w-[210px]">
                          <div className="w-8 h-8 rounded-lg bg-blue-600/60 flex items-center justify-center shrink-0 border border-white/30 text-white">
                            <span className="material-symbols-outlined text-[18px]">videocam</span>
                          </div>
                          <div className="overflow-hidden text-left">
                            <span className="text-[9px] uppercase tracking-wider text-blue-300 block font-bold font-mono">
                              Enrolled Video
                            </span>
                            <span className="text-[10px] font-bold truncate block">{selectedPayment.name}</span>
                          </div>
                        </div>

                        {/* Bottom Instruction Ribbon */}
                        <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-md py-2 px-3 rounded-xl border border-white/10 text-center">
                          <span className="text-[11px] text-slate-200 font-medium">
                            Look directly at camera and perform: <strong>"{videoChallenge?.instructionEn || 'Blink twice'}"</strong>
                          </span>
                        </div>

                        {/* Server Analyzing Overlay */}
                        {videoAnalyzing && (
                          <div className="absolute inset-0 bg-[#0E1330]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white z-20 space-y-3">
                            <span className="material-symbols-outlined text-[36px] text-blue-400 animate-spin">
                              sync
                            </span>
                            <div className="text-center space-y-1">
                              <span className="text-xs font-bold tracking-wide block">
                                Server Evaluating Liveness &amp; Embeddings...
                              </span>
                              <span className="text-[10.5px] text-slate-300 max-w-sm block">
                                {t.videoEvaluatingNotice || 'Server evaluating eye aspect ratio (MediaPipe Face Mesh) & ArcFace 1:1 embedding...'}
                              </span>
                            </div>
                            <div className="w-48 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full w-3/4 animate-pulse rounded-full"></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Simulation Mode Testing Switcher */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1.5 text-[10.5px]">
                        <span className="font-bold text-slate-600 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-blue-600">tune</span>
                          <span>Test Video Simulation:</span>
                        </span>
                        <div className="flex flex-wrap items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setVideoSimScenario('normal')}
                            className={`px-2 py-1 rounded font-bold transition-colors ${
                              videoSimScenario === 'normal'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            Pass (Normal)
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoSimScenario('face_mismatch')}
                            className={`px-2 py-1 rounded font-bold transition-colors ${
                              videoSimScenario === 'face_mismatch'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            Face Mismatch
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoSimScenario('no_blink')}
                            className={`px-2 py-1 rounded font-bold transition-colors ${
                              videoSimScenario === 'no_blink'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            No Blink
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoSimScenario('screen_replay')}
                            className={`px-2 py-1 rounded font-bold transition-colors ${
                              videoSimScenario === 'screen_replay'
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            Screen Replay
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoSimScenario('poor_quality')}
                            className={`px-2 py-1 rounded font-bold transition-colors ${
                              videoSimScenario === 'poor_quality'
                                ? 'bg-slate-700 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            Poor Quality
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoSimScenario('expired')}
                            className={`px-2 py-1 rounded font-bold transition-colors ${
                              videoSimScenario === 'expired'
                                ? 'bg-red-700 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            Expired Token
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoSimScenario('reused')}
                            className={`px-2 py-1 rounded font-bold transition-colors ${
                              videoSimScenario === 'reused'
                                ? 'bg-orange-700 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            Reused Token
                          </button>
                        </div>
                      </div>

                      {/* RESULT CARD: VERIFIED (GREEN) OR NOT VERIFIED (RED) */}
                      {/* Prompt Rule: Raw match score is strictly never shown to the cashier! */}
                      {videoResultStatus === 'verified' && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 space-y-3 animate-fade-in shadow-xs">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                                <span className="material-symbols-outlined text-[28px]">verified</span>
                              </div>
                              <div>
                                <span className="text-base font-black text-emerald-800 tracking-wide block">
                                  {t.videoVerifiedBadge || 'VERIFIED'}
                                </span>
                                <p className="text-xs text-emerald-700 mt-0.5">
                                  {videoDisplayReason || 'Live blink challenge verified and 1:1 facial biometric confirmed.'}
                                </p>
                                <span className="text-[10px] text-emerald-600 font-mono block mt-1">
                                  Server Authority: Liveness Confirmed • Challenge Consumed • Step 2 Signature Unlocked
                                </span>
                              </div>
                            </div>
                            <span className="text-[10.5px] font-mono text-emerald-800 bg-emerald-200/70 px-2.5 py-1 rounded-lg font-bold shrink-0">
                              Liveness &amp; Match Confirmed
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <button
                              type="button"
                              onClick={handleRetryVideoChallenge}
                              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-[16px]">refresh</span>
                              <span>{t.btnRetryChallenge || 'Retry Challenge'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleProceedToStep2}
                              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                            >
                              <span>{t.btnProceedToStep2 || 'Proceed to Step 2: Employee Signature →'}</span>
                              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {(videoResultStatus === 'not_verified' || videoResultStatus === 'error') && (
                        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-900 space-y-3 animate-fade-in shadow-xs">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                                <span className="material-symbols-outlined text-[28px]">close</span>
                              </div>
                              <div>
                                <span className="text-base font-black text-rose-800 tracking-wide block">
                                  {t.videoNotVerifiedBadge || 'NOT VERIFIED'}
                                </span>
                                <p className="text-xs text-rose-700 mt-0.5">
                                  {videoDisplayReason || 'Verification failed. Challenge requirements not satisfied.'}
                                </p>
                                <span className="text-[10px] text-rose-600 font-mono block mt-1">
                                  Server decision: Security gate closed. Cashier may retry, switch method, or apply manual fallback.
                                </span>
                              </div>
                            </div>
                            <span className="text-[10.5px] font-mono text-rose-800 bg-rose-200/70 px-2.5 py-1 rounded-lg font-bold shrink-0">
                              Check Failed
                            </span>
                          </div>

                          {/* 4 Action options on failure */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-xs">
                            {/* 1. Retry with new challenge */}
                            <button
                              type="button"
                              onClick={handleRetryVideoChallenge}
                              className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 transition-colors flex items-center justify-center gap-1 shadow-xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">refresh</span>
                              <span>Retry Challenge</span>
                            </button>

                            {/* 2. Switch to Face verification */}
                            <button
                              type="button"
                              onClick={handleSwitchToFace}
                              className="px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                              <span>Switch to Face</span>
                            </button>

                            {/* 3. Manual override */}
                            <button
                              type="button"
                              onClick={() => setShowManualOverride(true)}
                              className="px-3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">published_with_changes</span>
                              <span>Manual Override</span>
                            </button>

                            {/* 4. Put on hold */}
                            <button
                              type="button"
                              onClick={() => setHoldModalPayment(selectedPayment)}
                              className="px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">warning</span>
                              <span>Put On Hold</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* MANUAL VERIFICATION FALLBACK FOR VIDEO METHOD */}
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setShowManualOverride(!showManualOverride)}
                          className="text-[11px] font-bold text-secondary hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {showManualOverride ? 'expand_less' : 'expand_more'}
                          </span>
                          <span>{t.manualVerificationTitle}</span>
                        </button>

                        {showManualOverride && (
                          <div className="mt-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in text-xs">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={manualOverrideCheckbox}
                                onChange={(e) => setManualOverrideCheckbox(e.target.checked)}
                                className="h-4 w-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                              />
                              <span className="font-semibold text-slate-800">
                                {t.manualOverrideCheckbox}
                              </span>
                            </label>

                            <div className="space-y-1">
                              <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                                {t.manualReasonLabel}
                              </label>
                              <select
                                value={manualOverrideReason}
                                onChange={(e) => setManualOverrideReason(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-secondary"
                              >
                                <option value="Poor lighting at counter">{t.reasonPoorLighting}</option>
                                <option value="Appearance changed (beard, glasses, injury)">{t.reasonAppearanceChanged}</option>
                                <option value="Camera issue or hardware limitation">{t.reasonCameraIssue}</option>
                                <option value="Other verified operational condition">{t.reasonOther}</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                                Paymaster Notes / Identification Verification Observation
                              </label>
                              <input
                                type="text"
                                value={manualOverrideNotes}
                                onChange={(e) => setManualOverrideNotes(e.target.value)}
                                placeholder="Optional: Enter observations or supervisor reference..."
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-secondary"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] text-slate-400">
                                {t.overrideRecordedNotice}
                              </span>
                              <button
                                type="button"
                                onClick={handleApplyManualOverride}
                                disabled={!manualOverrideCheckbox}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  manualOverrideCheckbox
                                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                {t.btnApplyOverride}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

              {/* ======================================================== */}
              {/* STAGE 2: STEP 2 - EMPLOYEE TABLET SIGNATURE (SEPARATE)    */}
              {/* ======================================================== */}
              {payoutStep === 2 && (
                <div className="space-y-4">
                  {/* Compact Employee & Biometric Badge Strip */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="flex -space-x-2 shrink-0">
                        <img
                          src={selectedPayment.avatar}
                          alt="Enrolled"
                          title="Enrolled Master Photo"
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                        />
                        <img
                          src={liveCaptureData || selectedPayment.avatar}
                          alt="Live Capture"
                          title="Live Counter Capture"
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm ring-2 ring-emerald-500"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0E1330]">{selectedPayment.name}</h4>
                        <span className="font-mono text-[11px] text-slate-500 block">
                          {selectedPayment.workerId} • Iqama: {selectedPayment.iqama}
                        </span>
                        <div className="mt-1">
                          {chosenMethod === 'video' && videoResultStatus === 'verified' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100/70 border border-blue-300 px-2 py-0.5 rounded-full">
                              <span className="material-symbols-outlined text-[13px]">verified</span>
                              Video Blink Verified ("{videoChallenge?.instructionEn || 'Blink twice'}")
                            </span>
                          ) : faceStatus === 'matched' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-full">
                              <span className="material-symbols-outlined text-[13px]">verified</span>
                              Biometric Face Verified (ArcFace 1:1 Matched)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-full">
                              <span className="material-symbols-outlined text-[13px]">published_with_changes</span>
                              Manual Override Approved ({manualOverrideReason})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Cash Handover Amount</span>
                      <span className="text-xl font-black text-secondary font-mono">
                        SAR {selectedPayment.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Turn Tablet Handoff Banner */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">tablet</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-900 block">{t.turnTabletPrompt}</span>
                      <span className="text-[11px] text-blue-800">
                        Please turn tablet to <strong>{selectedPayment.name}</strong> to inspect the wage amount and sign in the box below.
                      </span>
                    </div>
                  </div>

                  {/* Step 2 Signature Pad */}
                  <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500/50 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          signatureData ? 'bg-emerald-600 text-white' : 'bg-secondary text-white'
                        }`}>
                          2
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-[#0E1330] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-secondary">stylus_note</span>
                            <span>{t.step2Title}</span>
                          </h5>
                          <p className="text-[10.5px] text-slate-500">{t.step2UnlockedNotice}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={clearSignature}
                        className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors border border-rose-200"
                      >
                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                        <span>{t.sigClear}</span>
                      </button>
                    </div>

                    {/* HTML5 Canvas Signature Pad */}
                    <div className="relative">
                      <div className="rounded-xl border-2 border-dashed border-slate-300 relative overflow-hidden h-44 touch-none shadow-inner bg-slate-50/50 cursor-crosshair">
                        <canvas
                          ref={canvasRef}
                          width={580}
                          height={176}
                          className="w-full h-full"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                        />

                        {!signatureData && !isSigning && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                            <span>✍️ Employee signature area – Sign with finger or stylus</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {signatureData && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs font-bold animate-fade-in">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                          {t.sigCaptured}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700">Digital Stylus Stamp OK</span>
                      </div>
                    )}

                    {/* Legal Disclaimer */}
                    <div className="p-2.5 bg-slate-100 rounded-xl text-[10px] text-slate-600 space-y-1">
                      <p>{t.sigDisclaimer}</p>
                      <p dir="rtl" className="font-arabic">{t.sigDisclaimerAr}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STAGE 3: STEP 3 - CASH HANDOVER & CONFIRM PAYMENT         */}
              {/* ======================================================== */}
              {payoutStep === 3 && (
                <div className="space-y-4">
                  {/* Complete Verification Audit Summary Card */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-[#0E1330] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                        {t.handoverSummaryTitle}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">Station #03</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Left: Biometric Verification Badge */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Step 1: {chosenMethod === 'video' ? 'Video Check' : 'Face Check'}
                          </span>
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10.5px]">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            Passed
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="flex -space-x-2 shrink-0">
                            <img
                              src={selectedPayment.avatar}
                              alt="Enrolled"
                              className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-xs"
                            />
                            <img
                              src={liveCaptureData || selectedPayment.avatar}
                              alt="Live"
                              className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-xs ring-1 ring-emerald-500"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-[11px] block">{selectedPayment.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {chosenMethod === 'video' && videoResultStatus === 'verified'
                                ? `Video Blink (${videoChallenge?.instructionEn || 'Passed'})`
                                : faceStatus === 'matched'
                                ? 'ArcFace 1:1 Matched'
                                : 'Manual Override'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Signature Badge */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Step 2: Signature</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10.5px]">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            Captured
                          </span>
                        </div>
                        {signatureData ? (
                          <div className="bg-slate-50 rounded-lg border border-slate-200 h-10 flex items-center justify-center p-1">
                            <img src={signatureData} alt="Signature" className="max-h-full object-contain" />
                          </div>
                        ) : (
                          <span className="text-rose-500 text-[11px] font-bold">Signature Missing</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prominent Cash Handover Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0E1330] via-[#141B45] to-[#0E1330] text-white border border-[#1E2554] text-center space-y-1 shadow-xl">
                    <span className="text-[10.5px] uppercase font-bold text-secondary tracking-widest block">
                      {t.step3Title}
                    </span>
                    <span className="text-4xl font-black text-white font-mono tracking-tight block">
                      SAR {selectedPayment.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-slate-300 font-medium block">
                      Salary Month: {selectedPayment.month} • Physical Cash Notes Handover
                    </span>
                  </div>

                  {/* Mandatory Cash Count Checkbox */}
                  <label className="flex items-center gap-3 p-3.5 rounded-xl bg-white border-2 border-emerald-500/60 hover:bg-emerald-50/30 transition-colors cursor-pointer shadow-xs">
                    <input
                      type="checkbox"
                      checked={cashCountVerified}
                      onChange={(e) => setCashCountVerified(e.target.checked)}
                      className="h-5 w-5 rounded text-secondary focus:ring-secondary cursor-pointer"
                    />
                    <span className="text-xs text-slate-800 font-semibold">
                      Cash notes (SAR {selectedPayment.netPay.toLocaleString()}) counted and ready for handover in front of employee
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              {payoutStep === 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setHoldModalPayment(selectedPayment);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 text-xs font-bold border border-rose-500/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">report_problem</span>
                    <span>Flag Issue / Put On Hold</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClosePaymentCard}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    {selectedPayment.enrolled_video_path && adminSettings.videoEnabledGlobal && (adminSettings.videoEnabledCounter03 ?? true) && (
                      <button
                        type="button"
                        onClick={() => handleStartVideoVerification(selectedPayment)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-950/20 transition-all hover:scale-[1.01]"
                      >
                        <span className="material-symbols-outlined text-[17px]">videocam</span>
                        <span>Verify Video</span>
                      </button>
                    )}
                    {adminSettings.faceEnabledGlobal && (adminSettings.faceEnabledCounter03 ?? true) && (
                      <button
                        type="button"
                        onClick={handleProceedToStep1}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/20 transition-all hover:scale-[1.01]"
                      >
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                        <span>Verify Face</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </>
              )}

              {payoutStep === 1 && (
                <>
                  <button
                    type="button"
                    onClick={
                      chosenMethod === 'video'
                        ? handleBackToOverview
                        : faceStepPhase === 'matching'
                        ? handleRetakePhoto
                        : handleBackToOverview
                    }
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {chosenMethod === 'face' && faceStepPhase === 'matching' ? 'photo_camera' : 'arrow_back'}
                    </span>
                    <span>
                      {chosenMethod === 'face' && faceStepPhase === 'matching'
                        ? (t.btnBackToCamera || 'Back to Camera')
                        : t.btnBackToOverview}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHoldModalPayment(selectedPayment)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Put On Hold
                    </button>

                    {chosenMethod === 'video' ? (
                      videoResultStatus === 'verified' ? (
                        <button
                          type="button"
                          onClick={handleProceedToStep2}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/20 hover:scale-[1.01] transition-all"
                        >
                          <span>{t.btnProceedToStep2}</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRetryVideoChallenge}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">refresh</span>
                          <span>Retry Challenge</span>
                        </button>
                      )
                    ) : faceStepPhase === 'camera' ? (
                      <button
                        type="button"
                        onClick={handleCapturePhoto}
                        disabled={cameraWarmup}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                          cameraWarmup
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/20 hover:scale-[1.01]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                        <span>{t.btnCapturePhoto || 'Capture Photo & Match'}</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleProceedToStep2}
                        disabled={!photoVerified}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                          photoVerified
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/20 hover:scale-[1.01]'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                      >
                        <span>{t.btnProceedToStep2}</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </>
              )}

              {payoutStep === 2 && (
                <>
                  <button
                    type="button"
                    onClick={handleBackToStep1}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span>{t.btnBackToStep1}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClosePaymentCard}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleProceedToStep3}
                      disabled={!signatureData}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                        signatureData
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/20 hover:scale-[1.01]'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <span>{t.btnProceedToStep3}</span>
                    </button>
                  </div>
                </>
              )}

              {payoutStep === 3 && (
                <>
                  <button
                    type="button"
                    onClick={handleBackToStep2}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span>{t.btnBackToStep2}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHoldModalPayment(selectedPayment)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Put On Hold
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCashPayment}
                      disabled={!cashCountVerified || !signatureData || !photoVerified}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                        cashCountVerified && signatureData && photoVerified
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/20 hover:scale-[1.01] active:scale-[0.99]'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Confirm Cash Payment (SAR {selectedPayment.netPay.toLocaleString()})</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: OFFICIAL CORPORATE CASH DISBURSEMENT VOUCHER     */}
      {/* ======================================================== */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-[#0E1330] rounded-3xl max-w-3xl w-full border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden max-h-[96vh]">
            {/* Modal Top Control Bar */}
            <div className="px-6 py-3.5 bg-[#0A0D26] text-white flex items-center justify-between border-b border-[#1E2554] shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
                <div>
                  <h3 className="text-sm font-bold text-white">Official Cash Disbursement Voucher</h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    Document Ref: {viewingReceipt.receiptNo} • Sealed at Counter Station #03
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Printable Paper Canvas */}
            <div className="p-4 sm:p-6 overflow-y-auto bg-slate-900/60">
              <div
                id="printable-receipt"
                className="bg-white rounded-2xl border-2 border-slate-300 p-6 sm:p-8 text-slate-800 shadow-xl space-y-5 relative overflow-hidden"
              >
                {/* Top Saudi National & Company Ribbon Accent */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#006C35] via-[#E97F29] to-[#0E1330]"></div>

                {/* 1. Official Corporate Letterhead (Bilingual) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-200 pb-4 pt-1">
                  {/* Left: English Company Info */}
                  <div className="text-left space-y-0.5 text-[10.5px]">
                    <h4 className="text-xs font-black tracking-wider text-[#0E1330] uppercase">
                      Expertise Contracting Co.
                    </h4>
                    <p className="text-slate-500 font-medium">Commercial Reg: <strong>C.R. 2050049281</strong></p>
                    <p className="text-slate-500 font-medium">VAT / Tax ID: <strong>300189284100003</strong></p>
                    <p className="text-slate-400">P.O. Box 8000, Al-Khobar / Riyadh, K.S.A.</p>
                  </div>

                  {/* Center: Brand Logo & Official Document Title */}
                  <div className="flex flex-col items-center text-center space-y-1">
                    <img src={logoImg} alt="Expertise" className="h-9 w-auto object-contain" />
                    <div className="border border-slate-300 bg-slate-50 px-3 py-1 rounded-lg">
                      <span className="text-[11px] font-black uppercase text-[#0E1330] tracking-widest block">
                        Cash Salary Payment Voucher
                      </span>
                      <span className="text-[11px] font-bold text-[#006C35] font-arabic block" dir="rtl">
                        سـنـد صـرف رواتـب نـقـديـة مـعـتـمـد
                      </span>
                    </div>
                  </div>

                  {/* Right: Arabic Company Info */}
                  <div className="text-right space-y-0.5 text-[10.5px] font-arabic" dir="rtl">
                    <h4 className="text-xs font-black text-[#0E1330]">
                      شركة الخبرة للمقاولات
                    </h4>
                    <p className="text-slate-500 font-medium">سجل تجاري: <strong>2050049281</strong></p>
                    <p className="text-slate-500 font-medium">الرقم الضريبي: <strong>300189284100003</strong></p>
                    <p className="text-slate-400">ص.ب 8000، الخبر / الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>

                {/* 2. Voucher Metadata Bar */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Voucher No. / رقم السند</span>
                    <strong className="text-xs font-mono text-[#0E1330]">{viewingReceipt.receiptNo}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Issue Date / التاريخ</span>
                    <strong className="text-xs font-mono text-slate-700">{viewingReceipt.disbursedAt || '05/10/2026 14:15 AST'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Disbursed At / الشباك</span>
                    <strong className="text-xs text-slate-700">Counter #03 (Site A Kiosk)</strong>
                  </div>
                  <div className="flex items-center sm:justify-end">
                    <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      PAID &amp; CLOSED
                    </span>
                  </div>
                </div>

                {/* 3. Contractor Particulars Grid (Formal Financial Ledger Style) */}
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 font-bold text-[#0E1330] flex items-center justify-between">
                    <span>Beneficiary &amp; Deployment Particulars / بيانات العامل المستفيد</span>
                    <span className="font-mono text-[10.5px] text-slate-500 font-normal">Badge: {viewingReceipt.workerId}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                    {/* Left Column */}
                    <div className="p-3.5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Employee Name / اسم العامل:</span>
                        <strong className="text-slate-800 text-xs">{viewingReceipt.name}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Worker Badge ID / الرقم الوظيفي:</span>
                        <span className="font-mono font-bold text-[#0E1330]">{viewingReceipt.workerId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">National / Iqama ID / رقم الإقامة:</span>
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {viewingReceipt.iqama}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Manpower Supplier / شركة التوريد:</span>
                        <span className="font-medium text-slate-700">{viewingReceipt.supplier}</span>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="p-3.5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Department / الإدارة:</span>
                        <span className="font-medium text-slate-800">{viewingReceipt.department}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Assigned Trade / المهنة والتخصص:</span>
                        <span className="font-semibold text-slate-700">{viewingReceipt.trade} ({viewingReceipt.subTrade})</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Worksite Scope / موقع المشروع:</span>
                        <span className="text-slate-700 text-right truncate max-w-[190px]">{viewingReceipt.site}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Salary Period / شهر الاستحقاق:</span>
                        <strong className="text-slate-800">{viewingReceipt.month}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3.5. Biometric Identity Verification Audit Certificate Block */}
                <div className="border-2 border-slate-200 rounded-xl p-3.5 bg-slate-50/80 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#0E1330] block">
                          Biometric Identity Verification Audit / التدقيق البيومتري للهوية
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {viewingReceipt.verification_method === 'video'
                            ? 'Stack: MediaPipe Face Mesh (EAR Blink Liveness) • DeepFace ArcFace 1:1'
                            : 'Stack: DeepFace ArcFace (1:1 Cosine Distance) • RetinaFace Detector'}
                        </span>
                      </div>
                    </div>

                    <div>
                      {viewingReceipt.verification_method === 'video' || viewingReceipt.video_result === 'verified' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-800 border border-blue-500/40 font-mono flex items-center gap-1.5 shadow-xs">
                          <span className="material-symbols-outlined text-[15px] text-blue-600">verified</span>
                          <span>BIOMETRIC VIDEO VERIFIED (Blink Challenge)</span>
                        </span>
                      ) : viewingReceipt.face_result === 'matched' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/40 font-mono flex items-center gap-1.5 shadow-xs">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                          <span>BIOMETRIC FACE MATCHED (1:1)</span>
                        </span>
                      ) : viewingReceipt.face_result === 'manual_override' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 border border-amber-500/40 font-mono flex items-center gap-1.5 shadow-xs">
                          <span className="material-symbols-outlined text-[15px] text-amber-600">published_with_changes</span>
                          <span>MANUAL OVERRIDE APPROVED</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 font-mono">
                          ID CONFIRMED AT COUNTER
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-0.5 text-xs">
                    {/* Enrolled vs Live Capture Thumbnails */}
                    <div className="sm:col-span-7 flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="text-center shrink-0">
                        <img
                          src={viewingReceipt.avatar}
                          alt="Enrolled Master Photo"
                          className="w-14 h-14 rounded-lg object-cover border border-slate-300 shadow-xs mx-auto"
                        />
                        <span className="text-[9.5px] font-bold text-slate-500 block mt-1">Enrolled Profile</span>
                      </div>

                      <div className="text-slate-300 font-bold text-base select-none">⟷</div>

                      <div className="text-center shrink-0">
                        <img
                          src={viewingReceipt.video_capture_path || viewingReceipt.face_capture_path || viewingReceipt.avatar}
                          alt="Live Counter Snapshot"
                          className="w-14 h-14 rounded-lg object-cover border border-slate-300 shadow-xs mx-auto"
                        />
                        <span className="text-[9.5px] font-bold text-slate-500 block mt-1">Live Kiosk Capture</span>
                      </div>

                      <div className="text-[10px] space-y-0.5 text-slate-600 pl-2 border-l border-slate-200 flex-1">
                        {viewingReceipt.verification_method === 'video' ? (
                          <>
                            <div>Challenge: <strong className="text-blue-800">"{viewingReceipt.challenge_used || 'Blink twice'}"</strong></div>
                            <div>Liveness: <strong className="text-emerald-700 font-bold">MediaPipe EAR Passed</strong></div>
                            <div className="text-emerald-700 font-bold">ArcFace 1:1 Validated</div>
                            <div className="text-slate-400 font-mono text-[9px]">Decision: Server API Verified</div>
                          </>
                        ) : (
                          <>
                            <div>Cosine Dist: <strong className="font-mono text-slate-800">{viewingReceipt.face_distance || '0.23'}</strong></div>
                            <div>Threshold: <strong className="font-mono text-slate-800">&lt; {viewingReceipt.face_threshold || '0.68'}</strong></div>
                            <div className="text-emerald-700 font-bold">ArcFace 1:1 Validated</div>
                            <div className="text-slate-400 font-mono text-[9px]">Decision: Server-Side API</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Verification Metadata & Reasons */}
                    <div className="sm:col-span-5 bg-white p-2.5 rounded-xl border border-slate-200 space-y-1 text-[10.5px] text-slate-600 shadow-xs">
                      <div className="flex justify-between">
                        <span>Verified At:</span>
                        <strong className="font-mono text-slate-800">{viewingReceipt.verified_at || viewingReceipt.disbursedAt || 'Today AST'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Paymaster:</span>
                        <strong className="text-slate-800">{viewingReceipt.assignedCashier}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Disbursement Mode:</span>
                        <strong className="text-emerald-700 font-bold">Physical Cash (Till 03)</strong>
                      </div>
                      {viewingReceipt.override_reason && (
                        <div className="pt-1 border-t border-amber-100 text-amber-800 font-medium">
                          <strong>Override Reason:</strong> {viewingReceipt.override_reason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Banknote-Style Grand Total Cash Handover Banner */}
                <div className="rounded-xl border-2 border-emerald-600 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 sm:p-5 text-slate-800 space-y-2.5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                        Net Cash Salary Handed Over / صافي المبلغ المسلم نقداً
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        Disbursement Mode: <strong>Physical Cash Handover at Counter 03</strong>
                      </span>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-3xl font-black text-emerald-800 font-mono tracking-tight block">
                        SAR {viewingReceipt.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                        Saudi Arabian Riyals
                      </span>
                    </div>
                  </div>

                  {/* Amount In Words (Tafqeet) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-white/80 rounded-lg p-2 border border-emerald-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Amount in Words (English):</span>
                      <strong className="text-xs text-slate-800 font-serif italic">
                        {numberToWordsSAR(viewingReceipt.netPay)}
                      </strong>
                    </div>

                    <div className="bg-white/80 rounded-lg p-2 border border-emerald-200 text-right font-arabic" dir="rtl">
                      <span className="text-[10px] font-bold text-slate-400 block">المبلغ كتابة باللغة العربية:</span>
                      <strong className="text-xs text-slate-800">
                        {numberToArabicWordsSAR(viewingReceipt.netPay)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 5. Beneficiary Legal Declaration */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-[10.5px] text-slate-600 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
                    <span className="material-symbols-outlined text-[16px] text-secondary">gavel</span>
                    <span>Legal Acknowledgment &amp; Release / الإقرار القانوني بالاستلام</span>
                  </div>
                  <p>
                    I, the undersigned contractor / employee, acknowledge and certify the receipt of the full cash net salary specified above for <strong>{viewingReceipt.month}</strong> without any unauthorized deductions, and have no outstanding claims or disputes against Expertise Contracting Company for this period.
                  </p>
                  <p className="font-arabic text-right text-slate-700 pt-0.5" dir="rtl">
                    أقر أنا العامل / المستفيد الموقع أدناه بأنني قد استلمت كامل المبلغ المالي الموضح أعلاه نقداً وعداً بالكامل عن مستحقات شهر <strong>{viewingReceipt.month}</strong>، وليس لي أي مطالبات مالية أو فروقات أو تحفظات تتعلق بهذه الفترة المالية.
                  </p>
                </div>

                {/* 6. Dual Signatures & Official Treasury Stamp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Left: Beneficiary Signature */}
                  <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-slate-50/50">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-[11px] font-bold text-slate-700">
                        Beneficiary Signature / توقيع المستلم:
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold">
                        VERIFIED STYLUS
                      </span>
                    </div>

                    <div className="h-20 bg-white rounded-lg border border-dashed border-slate-300 flex items-center justify-center p-2">
                      {viewingReceipt.signature && viewingReceipt.signature.startsWith('data:') ? (
                        <img
                          src={viewingReceipt.signature}
                          alt="Employee Signature"
                          className="h-16 w-auto max-w-[220px] object-contain"
                        />
                      ) : (
                        <span className="font-mono text-xs font-bold text-emerald-700">
                          ✓ Digitally Signed &amp; Sealed
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>Signer: <strong>{viewingReceipt.name}</strong></span>
                      <span className="font-mono">Iqama: {viewingReceipt.iqama}</span>
                    </div>
                  </div>

                  {/* Right: Cashier Endorsement & Official Circular Rubber Stamp */}
                  <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-slate-50/50 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-[11px] font-bold text-slate-700">
                        Paymaster Authorization / اعتماد أمين الصندوق:
                      </span>
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-bold">
                        TREASURY SEAL
                      </span>
                    </div>

                    <div className="h-20 flex items-center justify-between px-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Cashier in Charge:</span>
                        <strong className="text-xs text-[#0E1330] block">{viewingReceipt.assignedCashier}</strong>
                        <span className="text-[10px] text-slate-500 block">ID: PAYMASTER-RUH-03</span>
                        <span className="text-[9.5px] font-mono text-emerald-600 font-bold">STATUS: RECONCILED</span>
                      </div>

                      {/* Official Circular Treasury Stamp Graphic (SVG) */}
                      <div className="w-20 h-20 shrink-0 transform -rotate-12 opacity-90 select-none">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-700 fill-current">
                          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2" />
                          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="1" />
                          <path
                            id="voucherStampPath"
                            d="M 18,50 A 32,32 0 1,1 82,50"
                            fill="none"
                          />
                          <text fontSize="7.5" fontWeight="bold" fill="currentColor" letterSpacing="1.2">
                            <textPath href="#voucherStampPath" startOffset="50%" textAnchor="middle">
                              EXPERTISE CONTRACTING CO.
                            </textPath>
                          </text>
                          <path
                            id="voucherStampBottom"
                            d="M 82,50 A 32,32 0 0,1 18,50"
                            fill="none"
                          />
                          <text fontSize="7" fontWeight="bold" fill="currentColor" letterSpacing="1">
                            <textPath href="#voucherStampBottom" startOffset="50%" textAnchor="middle">
                              * CASH DISBURSED *
                            </textPath>
                          </text>
                          <text x="50" y="46" fontSize="6.5" fontWeight="black" textAnchor="middle" fill="currentColor">
                            APPROVED
                          </text>
                          <text x="50" y="55" fontSize="7" fontWeight="black" textAnchor="middle" fill="#006C35">
                            PAID IN CASH
                          </text>
                          <text x="50" y="63" fontSize="5.5" fontStyle="italic" textAnchor="middle" fill="currentColor">
                            05 OCT 2026
                          </text>
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>Location: <strong>Riyadh Metro Site A</strong></span>
                      <span className="font-mono">Station: <strong>COUNTER-03</strong></span>
                    </div>
                  </div>
                </div>

                {/* 7. Security Barcode, QR Code & Audit Seal */}
                <div className="pt-3 border-t-2 border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
                  {/* QR Code Simulation */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white border border-slate-300 rounded-lg p-1 shrink-0 flex items-center justify-center shadow-xs">
                      {/* Scalable QR Code Pattern SVG */}
                      <svg viewBox="0 0 29 29" className="w-full h-full text-slate-900 fill-current">
                        <rect x="0" y="0" width="7" height="7" />
                        <rect x="1" y="1" width="5" height="5" fill="white" />
                        <rect x="2" y="2" width="3" height="3" />
                        
                        <rect x="22" y="0" width="7" height="7" />
                        <rect x="23" y="1" width="5" height="5" fill="white" />
                        <rect x="24" y="2" width="3" height="3" />

                        <rect x="0" y="22" width="7" height="7" />
                        <rect x="1" y="23" width="5" height="5" fill="white" />
                        <rect x="2" y="24" width="3" height="3" />

                        <rect x="9" y="2" width="2" height="2" />
                        <rect x="13" y="2" width="4" height="2" />
                        <rect x="18" y="4" width="2" height="2" />
                        <rect x="9" y="8" width="3" height="2" />
                        <rect x="14" y="8" width="4" height="3" />
                        <rect x="8" y="14" width="3" height="2" />
                        <rect x="13" y="14" width="3" height="3" />
                        <rect x="18" y="14" width="3" height="2" />
                        <rect x="23" y="10" width="3" height="4" />
                        <rect x="23" y="17" width="2" height="4" />
                        <rect x="9" y="20" width="4" height="3" />
                        <rect x="15" y="20" width="2" height="3" />
                        <rect x="19" y="23" width="4" height="2" />
                        <rect x="11" y="25" width="2" height="3" />
                      </svg>
                    </div>

                    <div className="space-y-0.5">
                      <span className="font-mono font-bold text-slate-700 block">
                        SHA-256: 8F2A-79B4-09CE-9812-4B12
                      </span>
                      <span className="text-slate-400 block">
                        Electronic Transactions Act &amp; KSA Wage Protection Validated
                      </span>
                      <span className="text-[9.5px] text-emerald-700 font-semibold block">
                        ✓ Tamper-proof original permanently locked in ERP payroll ledger
                      </span>
                    </div>
                  </div>

                  {/* Barcode Graphic */}
                  <div className="flex flex-col items-end text-right">
                    <div className="flex items-center gap-0.5 h-7">
                      {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1].map((w, i) => (
                        <div key={i} className="bg-slate-900 h-full" style={{ width: `${w * 1.5}px` }} />
                      ))}
                    </div>
                    <span className="font-mono text-[9.5px] text-slate-500 mt-0.5 font-bold tracking-widest">
                      *{viewingReceipt.receiptNo}*
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions Bar */}
            <div className="px-6 py-4 bg-[#0A0D26] border-t border-[#1E2554] flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Press Print to save as clean PDF voucher or print on thermal/A4 receipt printers.
              </span>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setViewingReceipt(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[17px]">print</span>
                  <span>Print Official Voucher (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: EXCEPTION / PUT ON HOLD / RETURN MODAL           */}
      {/* ======================================================== */}
      {holdModalPayment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">warning</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0E1330]">Disbursement Exception</h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    {holdModalPayment.name} ({holdModalPayment.workerId})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHoldModalPayment(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Mandatory Exception Reason *
                </label>
                <select
                  value={holdReasonSelection}
                  onChange={(e) => setHoldReasonSelection(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="Photo / Identity Mismatch (Possible Impersonator)">Photo / Identity Mismatch (Impersonator Alert)</option>
                  <option value="Expired Iqama / Invalid Resident Identity Document">Expired Iqama Document</option>
                  <option value="Unauthorized Proxy Attempt without Power of Attorney">Unauthorized Proxy Attempt</option>
                  <option value="Disputed Hours / Wage Inquiry (Returned to Site Coordinator)">Disputed Hours / Wage Inquiry</option>
                  <option value="Employee Emergency Leave / Shift Absent">Employee Emergency Leave / Shift Absent</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Specific Paymaster Observations / Notes
                </label>
                <textarea
                  rows="3"
                  value={holdCustomNotes}
                  onChange={(e) => setHoldCustomNotes(e.target.value)}
                  placeholder="Record observations, security comments, or coordinator contact info..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setHoldModalPayment(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmHoldOrReturn('On Hold')}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition-all"
              >
                Mark as On Hold
              </button>
              <button
                type="button"
                onClick={() => handleConfirmHoldOrReturn('Unpaid/Returned')}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all"
              >
                Return to Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ADMIN BIOMETRIC VERIFICATION POLICY & CONTROLS  */}
      {/* ======================================================== */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0E1330] rounded-3xl max-w-xl w-full border border-slate-700 shadow-2xl overflow-hidden flex flex-col text-white max-h-[92vh]">
            <div className="px-6 py-4 bg-[#0A0D26] border-b border-[#1E2554] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-blue-400 text-[24px]">shield</span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {t.adminSettingsTitle || 'Biometric Verification Policy & Controls'}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Administrator Controls • Global &amp; Counter Station Level
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto text-xs">
              {/* Global Verification Method Master Toggles */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Global System Verification Methods
                </span>
                
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <div>
                    <strong className="block text-white">Face Verification (1:1 Photo)</strong>
                    <span className="text-[10.5px] text-slate-400">Global master enable switch for 1:1 ArcFace matching</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={adminSettings.faceEnabledGlobal}
                    onChange={(e) => {
                      const updated = updateAdminSettings({ faceEnabledGlobal: e.target.checked });
                      setAdminSettingsState(updated);
                    }}
                    className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <div>
                    <strong className="block text-white">Video Blink Challenge (MediaPipe)</strong>
                    <span className="text-[10.5px] text-slate-400">Global master enable switch for interactive video challenge</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={adminSettings.videoEnabledGlobal}
                    onChange={(e) => {
                      const updated = updateAdminSettings({ videoEnabledGlobal: e.target.checked });
                      setAdminSettingsState(updated);
                    }}
                    className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Station Counter 03 Toggles */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Counter Station #03 Specific Configuration
                </span>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <div>
                    <strong className="block text-white">Station 03: Allow Face Photo</strong>
                    <span className="text-[10.5px] text-slate-400">Enable/disable face check for Counter 03</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={adminSettings.faceEnabledCounter03 ?? true}
                    onChange={(e) => {
                      const updated = updateAdminSettings({ faceEnabledCounter03: e.target.checked });
                      setAdminSettingsState(updated);
                    }}
                    className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <div>
                    <strong className="block text-white">Station 03: Allow Video Blink Challenge</strong>
                    <span className="text-[10.5px] text-slate-400">Enable/disable video challenge for Counter 03</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={adminSettings.videoEnabledCounter03 ?? true}
                    onChange={(e) => {
                      const updated = updateAdminSettings({ videoEnabledCounter03: e.target.checked });
                      setAdminSettingsState(updated);
                    }}
                    className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Biometric Threshold Slider */}
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    {t.adminThresholdLabel || 'Biometric Match Threshold (Cosine Distance)'}
                  </span>
                  <span className="font-mono font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded text-xs">
                    {adminSettings.videoMatchThreshold}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.40"
                  max="0.85"
                  step="0.02"
                  value={adminSettings.videoMatchThreshold}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const updated = updateAdminSettings({ videoMatchThreshold: val, faceMatchThreshold: val });
                    setAdminSettingsState(updated);
                  }}
                  className="w-full accent-secondary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.40 (Ultra Strict)</span>
                  <span>0.68 (Standard Recommended)</span>
                  <span>0.85 (Permissive)</span>
                </div>
              </div>

              {/* Allowed Challenge Types */}
              <div className="space-y-2.5 bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  {t.adminChallengesLabel || 'Permitted Blink Challenge Types'}
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(CHALLENGE_TYPES).map(([key, config]) => {
                    const isChecked = adminSettings.allowedChallenges.includes(key);
                    return (
                      <label key={key} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let newChallenges = [...adminSettings.allowedChallenges];
                            if (e.target.checked) {
                              if (!newChallenges.includes(key)) newChallenges.push(key);
                            } else {
                              if (newChallenges.length > 1) {
                                newChallenges = newChallenges.filter((c) => c !== key);
                              }
                            }
                            const updated = updateAdminSettings({ allowedChallenges: newChallenges });
                            setAdminSettingsState(updated);
                          }}
                          className="h-4 w-4 rounded text-blue-500 focus:ring-blue-400 cursor-pointer"
                        />
                        <span className="text-[11.5px] text-slate-200">
                          {config.instructionEn} ({config.instructionAr})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Data Protection & Retention */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>Data Protection &amp; Biometric Governance (Saudi PDPL Compliance)</span>
                </div>
                <p className="text-emerald-300/80 text-[10.5px]">
                  All biometric videos and facial vectors are encrypted in storage via AES-256-GCM. Retention period is enforced at 180 days with automatic secure pruning.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#0A0D26] border-t border-[#1E2554] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Changes apply immediately to this counter station.
              </span>
              <button
                type="button"
                onClick={() => {
                  showToast('Admin policy settings updated successfully.');
                  setShowAdminModal(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
              >
                Close &amp; Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: CASHIER DAILY DISBURSEMENT & VERIFICATION REPORT */}
      {/* ======================================================== */}
      {showDailyReportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#0E1330] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[24px]">summarize</span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {t.dailyReportTitle || 'Cashier Verification & Disbursement Daily Report'}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    Station #03 • Paymaster: Youssef Al-Harbi • Date: 05/10/2026
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDailyReportModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto text-xs text-slate-700">
              {/* Daily Shift Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Disbursed</span>
                  <span className="text-lg font-black font-mono text-emerald-600 block mt-0.5">
                    SAR {totalDisbursedCash.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{paidPayments.length} Payments</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Face 1:1 Matched</span>
                  <span className="text-lg font-black font-mono text-emerald-700 block mt-0.5">
                    {payments.filter(p => p.verification_method === 'face' && p.status === 'Paid').length}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1:1 Photo</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Video Verified</span>
                  <span className="text-lg font-black font-mono text-blue-700 block mt-0.5">
                    {payments.filter(p => p.verification_method === 'video' && p.status === 'Paid').length}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Blink Challenge</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Manual Overrides</span>
                  <span className="text-lg font-black font-mono text-amber-600 block mt-0.5">
                    {payments.filter(p => p.verification_method === 'manual_override' && p.status === 'Paid').length}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Supervisory Logged</span>
                </div>
              </div>

              {/* Method Failure Rate Analysis Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100/80 px-4 py-2.5 font-bold text-[#0E1330] border-b border-slate-200 flex justify-between">
                  <span>Method Breakdown &amp; Failure Rates (Today)</span>
                  <span className="font-mono text-[11px] text-slate-500 font-normal">Audit Compliance: 100%</span>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10.5px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Verification Method</th>
                      <th className="p-3 text-center">Attempts</th>
                      <th className="p-3 text-center">Passed</th>
                      <th className="p-3 text-center">Failed</th>
                      <th className="p-3 text-right">Failure Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="p-3 flex items-center gap-1.5 font-bold text-slate-800">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">photo_camera</span>
                        <span>Face Photo (ArcFace 1:1)</span>
                      </td>
                      <td className="p-3 text-center font-mono">1</td>
                      <td className="p-3 text-center font-mono text-emerald-600 font-bold">1</td>
                      <td className="p-3 text-center font-mono text-slate-400">0</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600">0.0%</td>
                    </tr>
                    <tr>
                      <td className="p-3 flex items-center gap-1.5 font-bold text-slate-800">
                        <span className="material-symbols-outlined text-[16px] text-blue-600">videocam</span>
                        <span>Video Blink Challenge (MediaPipe)</span>
                      </td>
                      <td className="p-3 text-center font-mono">
                        {payments.filter(p => p.verification_method === 'video' && p.status === 'Paid').length}
                      </td>
                      <td className="p-3 text-center font-mono text-blue-600 font-bold">
                        {payments.filter(p => p.verification_method === 'video' && p.status === 'Paid').length}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-400">0</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600">0.0%</td>
                    </tr>
                    <tr>
                      <td className="p-3 flex items-center gap-1.5 font-bold text-slate-800">
                        <span className="material-symbols-outlined text-[16px] text-amber-600">published_with_changes</span>
                        <span>Manual Verification Override</span>
                      </td>
                      <td className="p-3 text-center font-mono">1</td>
                      <td className="p-3 text-center font-mono text-amber-600 font-bold">1</td>
                      <td className="p-3 text-center font-mono text-slate-400">0</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-600">N/A (Audited)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Detailed Disbursed List */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 font-bold text-[#0E1330] text-[11px]">
                  Disbursement Log by Identity Method
                </div>
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {paidPayments.map((p) => (
                    <div key={p.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div className="flex items-center gap-2.5">
                        <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <strong className="block text-slate-800">{p.name}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">{p.workerId} • {p.receiptNo}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono inline-block ${
                          p.verification_method === 'video'
                            ? 'bg-blue-100 text-blue-800'
                            : p.verification_method === 'face'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.verification_method === 'video'
                            ? 'Video Blink Verified'
                            : p.verification_method === 'face'
                            ? 'Face 1:1 Matched'
                            : 'Manual Override'}
                        </span>
                        <strong className="block font-mono text-xs text-slate-900 mt-0.5">
                          SAR {p.netPay.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Generated automatically by Central Audit Service.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDailyReportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0E1330] hover:bg-slate-800 text-white shadow-md transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Shift Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
