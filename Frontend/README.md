# Cashier Biometric Disbursement & Video Blink Verification System

This application provides a dual-biometric identity verification and cash disbursement kiosk module for construction workforce payroll. The system supports both **1:1 Face Photo Verification (ArcFace + RetinaFace)** and **Live Video Verification (Blink Challenge via MediaPipe EAR)**, ensuring tamper-proof, anti-spoofing identity confirmation prior to digital signature capture and cash payout.

---

## Architecture Overview

```
                                      +-------------------------------+
                                      |    Cashier Kiosk (Frontend)   |
                                      +---------------+---------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v                                                         v
         [Method A: 1:1 Face Verification]                        [Method B: Video Blink Challenge]
         - Counter HD Snapshot                                    - Server single-use token (60s TTL)
         - 1:1 Cosine Distance comparison                         - 4-second synchronized webcam clip
         - ArcFace 512-D embeddings                               - MediaPipe Face Mesh EAR (< 0.21)
                         |                                        - ArcFace best-frame 1:1 match
                         +----------------------------+----------------------------+
                                                      |
                                                      v
                                        +----------------------------+
                                        |  Step 2: Tablet Signature  |
                                        +--------------+-------------+
                                                       |
                                                       v
                                        +----------------------------+
                                        | Step 3: Cash Confirmation  |
                                        | & Biometric Receipt Voucher|
                                        +----------------------------+
```

### Key Security & Privacy Safeguards
1. **No Raw Scores Shown to Cashier**: In accordance with biometric security guidelines, raw match scores/distances are never exposed to the cashier on the kiosk interface. The cashier only sees a large green **VERIFIED** banner or red **NOT VERIFIED** banner with plain-language explanations (e.g., *"Blink action not detected within time limit"* or *"Face does not match enrolled record"*).
2. **Server-Side Verification Authority**: Tablets never decide verification outcomes unilaterally. Tokens are single-use, strictly expire after 60 seconds, and payment confirmation strictly validates server verification before marking records as `Paid`.
3. **Dual-Method Equivalence**: Passing **either** Face Verification or Video Blink Verification unlocks Step 2 (Employee Digital Signature).
4. **Fallback Resilience**: If an employee has no enrolled video clip, the video button is disabled with a helpful notification, allowing instant fallback to 1:1 Face Verification. If both fail, supervisors can invoke approved Manual Override with mandatory audit justification.

---

## Quickstart & Setup

### 1. Backend Server Setup (FastAPI + MediaPipe + DeepFace)

The Python backend provides the `/video/challenge`, `/video/verify`, `/face/verify`, and `/payments/{id}/confirm` endpoints.

```bash
# Navigate to the project root
cd Expert

# Create and activate a virtual environment (recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run the FastAPI server
uvicorn backend.server:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at `http://localhost:8000`. API documentation is accessible at `http://localhost:8000/docs`.

### 2. Frontend Setup (React + Vite)

```bash
# Navigate to Frontend directory
cd Frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```

The kiosk interface will be live at `http://localhost:5173`.

---

## Tablet & Mobile Testing Guidance (`getUserMedia` & HTTPS)

Modern browsers (Chrome, Safari, Edge) enforce strict security policies on the Media Devices API: **`navigator.mediaDevices.getUserMedia` requires a Secure Context (HTTPS or `localhost`)**. When testing on an external tablet (e.g. iPad, Galaxy Tab) across your local WiFi network, camera access will be blocked unless HTTPS is configured.

### Option A: Using `ngrok` (Quickest for Physical Tablets)
1. Install `ngrok` (`npm install -g ngrok` or download from [ngrok.com](https://ngrok.com)).
2. Forward your local Vite dev server port:
   ```bash
   ngrok http 5173
   ```
3. Open the generated HTTPS URL (e.g. `https://abc123.ngrok-free.app`) in the browser on your tablet. Camera and audio permissions will work seamlessly.

### Option B: Local SSL with `mkcert` (Recommended for Local Dev)
1. Install `mkcert` and generate a local CA certificate:
   ```bash
   mkcert -install
   mkcert localhost 192.168.1.X # Replace with your LAN IP
   ```
2. In `Frontend/vite.config.js`, enable HTTPS:
   ```javascript
   import fs from 'fs';

   export default defineConfig({
     server: {
       https: {
         key: fs.readFileSync('./localhost-key.pem'),
         cert: fs.readFileSync('./localhost.pem'),
       },
       host: '0.0.0.0'
     }
   });
   ```
3. Access `https://<YOUR_LAN_IP>:5173` on the tablet.

### Option C: Chrome Flag Override (Testing without SSL)
1. On your Android tablet or desktop Chrome, navigate to:
   `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
2. Add your workstation IP (e.g. `http://192.168.1.50:5173`).
3. Relaunch Chrome.

---

## 10 Verification Test Scenarios

The kiosk includes built-in test scenario selectors allowing quality assurance testing directly from the interface:

| # | Scenario | How to Test | Expected Result |
|---|---|---|---|
| **1** | **Same Person Verified (Pass)** | Select pending worker (e.g. *Elena Rostova* / *Ahmed Farooq*), choose **Verify Video**, leave simulation as **Normal**, click **Start 4s Video**. | 4-second recording completes, Eye Aspect Ratio passes, best frame matches ArcFace. Displays green **VERIFIED** banner. Unlocks Step 2. |
| **2** | **Face Mismatch (Different Person)** | In Video Verification screen, change test scenario dropdown to **Face Mismatch (Different Person)** and record. | Server calculates EAR liveness as passed, but ArcFace distance is 0.78 (> 0.68 threshold). Red **NOT VERIFIED** banner displayed with *"Face does not match enrolled master record"*. |
| **3** | **Photo / Screen Replay Attack** | Change test scenario dropdown to **No Blink (Photo / Screen Replay)** and record. | Eye Aspect Ratio never dips below 0.21 threshold. Red **NOT VERIFIED** banner displayed with *"Liveness check failed: No natural eye blink detected"*. |
| **4** | **Expired Challenge Token** | Change test scenario dropdown to **Expired Challenge Token (>60s)** and click record. | Server rejects request with HTTP 400. Kiosk displays red **NOT VERIFIED** banner with *"Challenge token expired (lifetime 60s). Please request a fresh challenge."* |
| **5** | **Reused Challenge Token** | Change test scenario dropdown to **Reused Challenge Token (Replay)** and click record. | Server single-use store flags token as already consumed. Red **NOT VERIFIED** banner with *"Challenge token has already been consumed."* |
| **6** | **Employee with No Enrolled Video** | In the payout queue, select an employee with no enrolled video (*Elena Rostova* or *Sarah Al-Qasim*). | **Verify Video (Blink Challenge)** button is disabled with message: *"No enrolled video on file for this employee. Please proceed with Face Verification."* Face verification remains fully accessible. |
| **7** | **Switching Methods (Video <-> Face)** | Start in Video Verification, click top bar or failure action **Switch to Face Verification**. Vice versa from Face to Video. | Seamless transition between verification viewfinders without resetting employee payout details or corrupting stepper state. |
| **8** | **Manual Verification Fallback** | Trigger a failed video or face verification. Click **Manual Supervisor Override**. Select reason (*Temporary facial injury*, *Religious niqab clearance*, *Lighting obstruction*), enter badge ID & notes, click **Approve**. | Step 1 is marked as **Approved via Manual Override**. Amber audit badge appears. Cashier is permitted to advance to Step 2 signature. Override reason is permanently saved to payment audit log. |
| **9** | **Complete Payment & Receipt Voucher** | Pass verification, proceed to Step 2, capture employee stylus signature, proceed to Step 3, click **Confirm Cash Payment & Print Voucher**. | Payment status updates to **Paid**, assigned cashier, timestamps, and payment mode logged. Biometric Audit Certificate modal appears with complete verification certificate, algorithm stack, and timestamp. |
| **10** | **Existing 1:1 Face Verification Working** | Select any employee, click **Verify Face (1:1 Photo)**, capture photo. | Original ArcFace 1:1 facial photo verification executes without any regressions or modifications to existing flow. |

---

## Admin Controls & Reporting

### Admin Biometric Verification Policy Modal
Accessible via the **Admin Policy** header action in the Cashier kiosk:
- **Global & Counter Toggles**: Enable/disable Face Verification and Video Blink Verification globally or for Counter 03 specifically.
- **Match Threshold Slider**: Adjust the Cosine Distance threshold (default: `0.68`).
- **Challenge Type Restrictions**: Select allowed challenge prompts (*Blink twice*, *Blink once and turn head*, *Smile and blink*).
- **Audit & Retention**: Toggle AES-256 biometric vector encryption and raw video discard policies.

### Daily Disbursement & Verification Report Modal
Accessible via the **Daily Report** header action:
- High-level telemetry: Total payments, total SAR disbursed, pending count, on-hold count.
- Breakdown by verification method: Face Photo 1:1 count, Video Blink Challenge count, Manual Override count.
- Verification failure rate tracking and breakdown of failure reasons (Spoofing, Mismatch, Token Expiry).
