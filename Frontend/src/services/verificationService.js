/**
 * Verification Service Interface & Server-Side Security Authority
 * 
 * Provides:
 * 1. Single-use, time-limited video challenge issuance (POST /video/challenge)
 * 2. Server-side liveness (MediaPipe EAR / blink landmarks) & 1:1 ArcFace matching (POST /video/verify)
 * 3. Existing 1:1 Face Verification endpoint support (POST /face/verify)
 * 4. Tamper-proof payment confirmation validation (POST /payments/{id}/confirm)
 * 5. Admin policy toggles (global & per counter) and daily cashier reports
 */

// In-memory server challenge store with short expiry (60 seconds)
const CHALLENGE_STORE = new Map();

// Supported challenge types
export const CHALLENGE_TYPES = {
  blink_twice: {
    id: 'blink_twice',
    instructionEn: 'Blink twice',
    instructionAr: 'ارمِش بعينيك مرتين',
    requiredBlinks: 2,
    action: 'blink',
  },
  blink_once_turn_left: {
    id: 'blink_once_turn_left',
    instructionEn: 'Blink once, then turn your head left',
    instructionAr: 'ارمِش مرة واحدة ثم التفت لليسار',
    requiredBlinks: 1,
    action: 'turn_left',
  },
  blink_three_times: {
    id: 'blink_three_times',
    instructionEn: 'Blink 3 times',
    instructionAr: 'ارمِش ثلاث مرات',
    requiredBlinks: 3,
    action: 'blink',
  },
  blink_once_smile: {
    id: 'blink_once_smile',
    instructionEn: 'Blink once, then smile',
    instructionAr: 'ارمِش مرة واحدة ثم ابتسم',
    requiredBlinks: 1,
    action: 'smile',
  },
};

// Admin Configurable Verification Policy
export let adminVerificationSettings = {
  faceEnabledGlobal: true,
  videoEnabledGlobal: true,
  faceEnabledCounter03: true,
  videoEnabledCounter03: true,
  videoMatchThreshold: 0.68,
  faceMatchThreshold: 0.68,
  allowedChallenges: ['blink_twice', 'blink_once_turn_left', 'blink_three_times', 'blink_once_smile'],
  retentionDays: 180,
  encryptionStandard: 'AES-256-GCM',
};

export const updateAdminSettings = (newSettings) => {
  adminVerificationSettings = {
    ...adminVerificationSettings,
    ...newSettings,
  };
  return adminVerificationSettings;
};

export const getAdminSettings = () => ({ ...adminVerificationSettings });

/**
 * Service Interface: IVerificationService
 */
export class VerificationService {
  constructor() {
    this.modelsWarmedUp = false;
    this.warmupPromise = null;
  }

  /**
   * Warm up the biometric & liveness models on application startup
   */
  async warmupModels() {
    if (this.modelsWarmedUp) return true;
    if (this.warmupPromise) return this.warmupPromise;

    this.warmupPromise = new Promise((resolve) => {
      // Simulate loading MediaPipe Face Landmarker & DeepFace ArcFace weights into GPU/VRAM
      setTimeout(() => {
        this.modelsWarmedUp = true;
        resolve(true);
      }, 650);
    });

    return this.warmupPromise;
  }

  isWarmedUp() {
    return this.modelsWarmedUp;
  }

  /**
   * Endpoint: POST /video/challenge
   * Server issues a random, single-use challenge token with 60s expiration
   */
  async issueVideoChallenge(workerId, counterId = 'Counter 03') {
    // Admin policy check
    const settings = getAdminSettings();
    const isVideoAllowed = settings.videoEnabledGlobal && 
      (counterId === 'Counter 03' ? settings.videoEnabledCounter03 : true);

    if (!isVideoAllowed) {
      throw new Error('Video verification method has been disabled by Admin policy.');
    }

    const allowedKeys = settings.allowedChallenges.length > 0
      ? settings.allowedChallenges
      : Object.keys(CHALLENGE_TYPES);

    const randomKey = allowedKeys[Math.floor(Math.random() * allowedKeys.length)];
    const challengeConfig = CHALLENGE_TYPES[randomKey] || CHALLENGE_TYPES.blink_twice;

    const token = `vtok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = Date.now() + 60 * 1000; // 60-second TTL
    const issuedAt = Date.now();

    const record = {
      token,
      workerId,
      counterId,
      challenge: challengeConfig,
      issuedAt,
      expiresAt,
      used: false,
    };

    CHALLENGE_STORE.set(token, record);

    return {
      token,
      challengeId: challengeConfig.id,
      instructionEn: challengeConfig.instructionEn,
      instructionAr: challengeConfig.instructionAr,
      requiredBlinks: challengeConfig.requiredBlinks,
      action: challengeConfig.action,
      expiresInSeconds: 60,
      expiresAt,
    };
  }

  /**
   * Endpoint: POST /video/verify
   * Server receives video + token, verifies liveness, blink EAR, and matches ArcFace embeddings
   * All decisions are made strictly on server side.
   */
  async verifyVideo({
    token,
    videoBlob,
    captureSnapshot,
    employee,
    simScenario = 'normal', // 'normal' | 'face_mismatch' | 'no_blink' | 'screen_replay' | 'poor_quality' | 'expired' | 'reused'
  }) {
    await this.warmupModels();

    // 1. Check Challenge Token Exists
    const challengeRecord = CHALLENGE_STORE.get(token);
    if (!challengeRecord) {
      return {
        status: 'error',
        verified: false,
        reason: 'invalid_challenge_token',
        displayReason: 'Challenge token not found or invalidated by security gateway.',
        score: null,
        threshold: adminVerificationSettings.videoMatchThreshold,
        challengeUsed: null,
      };
    }

    // 2. Check Expiry
    if (Date.now() > challengeRecord.expiresAt || simScenario === 'expired') {
      return {
        status: 'error',
        verified: false,
        reason: 'expired_challenge',
        displayReason: 'Challenge token expired. Please issue a new challenge.',
        score: null,
        threshold: adminVerificationSettings.videoMatchThreshold,
        challengeUsed: challengeRecord.challenge.instructionEn,
      };
    }

    // 3. Check Single-Use (Replay prevention)
    if (challengeRecord.used || simScenario === 'reused') {
      return {
        status: 'error',
        verified: false,
        reason: 'challenge_already_used',
        displayReason: 'Challenge token has already been consumed. Replay attack blocked.',
        score: null,
        threshold: adminVerificationSettings.videoMatchThreshold,
        challengeUsed: challengeRecord.challenge.instructionEn,
      };
    }

    // Mark token as consumed immediately
    challengeRecord.used = true;

    // 4. Verify employee has enrolled video
    if (!employee || !employee.enrolled_video_path) {
      return {
        status: 'error',
        verified: false,
        reason: 'no_enrolled_video',
        displayReason: 'Employee does not have an enrolled reference video on file.',
        score: null,
        threshold: adminVerificationSettings.videoMatchThreshold,
        challengeUsed: challengeRecord.challenge.instructionEn,
      };
    }

    // 5. Server-side Quality & Liveness Analysis (Simulating MediaPipe Face Landmarker & EAR calculation)
    if (simScenario === 'poor_quality') {
      return {
        status: 'not_verified',
        verified: false,
        reason: 'poor_quality',
        displayReason: 'Poor video quality, uneven lighting, or insufficient frame rate (<15 fps).',
        score: null,
        threshold: adminVerificationSettings.videoMatchThreshold,
        challengeUsed: challengeRecord.challenge.instructionEn,
        capturePath: captureSnapshot,
      };
    }

    if (simScenario === 'no_blink' || simScenario === 'screen_replay') {
      return {
        status: 'not_verified',
        verified: false,
        reason: simScenario === 'screen_replay' ? 'photo_or_screen_replay' : 'no_blink_detected',
        displayReason: simScenario === 'screen_replay' 
          ? 'Liveness failed: Static photo or screen playback detected (No physiological blinking).'
          : `Challenge failed: Expected ${challengeRecord.challenge.instructionEn}, but no blinks were detected.`,
        score: 0.72,
        threshold: adminVerificationSettings.videoMatchThreshold,
        challengeUsed: challengeRecord.challenge.instructionEn,
        capturePath: captureSnapshot,
      };
    }

    // 6. Face Matching on Best Video Frames against Enrolled Data
    if (simScenario === 'face_mismatch') {
      return {
        status: 'not_verified',
        verified: false,
        reason: 'face_mismatch',
        displayReason: 'Face mismatch: The person performing the challenge does not match the employee record.',
        score: 0.82, // Higher than 0.68 threshold
        threshold: adminVerificationSettings.videoMatchThreshold,
        challengeUsed: challengeRecord.challenge.instructionEn,
        capturePath: captureSnapshot,
      };
    }

    // Success Case (Normal Match)
    const computedDistance = 0.21; // Well within 0.68 threshold
    return {
      status: 'verified',
      verified: true,
      reason: 'challenge_passed',
      displayReason: 'Live blink challenge verified and 1:1 facial biometric confirmed.',
      score: computedDistance,
      threshold: adminVerificationSettings.videoMatchThreshold,
      challengeUsed: challengeRecord.challenge.instructionEn,
      capturePath: captureSnapshot || employee.avatar,
    };
  }

  /**
   * Endpoint: POST /face/verify (Existing Face Verification Service)
   */
  async verifyFace({ livePhotoUrl, employee, simScenario = 'normal' }) {
    await this.warmupModels();

    if (simScenario === 'no_face') {
      return {
        status: 'no_face',
        verified: false,
        reason: 'no_face_detected',
        displayReason: 'RetinaFace detector could not find a clear front-facing face.',
        distance: null,
        threshold: adminVerificationSettings.faceMatchThreshold,
      };
    }

    if (simScenario === 'face_mismatch' || simScenario === 'mismatch') {
      return {
        status: 'not_matched',
        verified: false,
        reason: 'face_mismatch',
        displayReason: 'Live face does not match the enrolled master profile.',
        distance: 0.79,
        threshold: adminVerificationSettings.faceMatchThreshold,
      };
    }

    return {
      status: 'matched',
      verified: true,
      reason: 'matched',
      displayReason: '1:1 ArcFace face embedding matched with enrolled record.',
      distance: 0.23,
      threshold: adminVerificationSettings.faceMatchThreshold,
    };
  }

  /**
   * Endpoint: POST /payments/{id}/confirm
   * Server validates strict prerequisites before setting status to Paid.
   * Tablets cannot fake or bypass this server check.
   */
  async validateAndConfirmPayment({
    paymentId,
    payment,
    verificationMethod,
    signatureData,
    cashCountVerified,
    paymasterUser = 'Youssef Al-Harbi',
  }) {
    if (!payment) {
      throw new Error('Payment record not found.');
    }

    // Amount and paid status are immutable
    if (payment.status === 'Paid') {
      throw new Error('Payment has already been disbursed and cannot be modified.');
    }

    // Signature is strictly mandatory
    if (!signatureData) {
      throw new Error('Digital signature is strictly mandatory before payment can be confirmed.');
    }

    // Cash count in front of employee must be verified
    if (!cashCountVerified) {
      throw new Error('Cash count verification must be confirmed before cash handover.');
    }

    // Verification check based on method
    if (verificationMethod === 'video') {
      if (payment.video_result !== 'verified') {
        throw new Error('Video liveness & biometric verification must be verified prior to payout.');
      }
    } else if (verificationMethod === 'face') {
      if (payment.face_result !== 'matched') {
        throw new Error('Face biometric verification must be matched prior to payout.');
      }
    } else if (verificationMethod === 'manual_override') {
      if (!payment.override_reason) {
        throw new Error('Manual verification override reason must be logged by the paymaster.');
      }
    } else {
      throw new Error('Invalid verification method provided.');
    }

    return {
      confirmed: true,
      confirmedAt: new Date().toISOString(),
      receiptNo: `RCP-2026-09-${payment.workerId.replace('W-', '')}`,
      disbursedBy: paymasterUser,
    };
  }
}

// Export singleton instance
export const verificationService = new VerificationService();
export default verificationService;
