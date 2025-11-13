// Notifications via Firebase Cloud Messaging (FCM) using firebase-admin
// If firebase-admin is not configured, we fallback to console log.

import admin from 'firebase-admin';

let firebaseReady = false;

try {
  // Initialize firebase-admin if service account is provided
  // You can set GOOGLE_APPLICATION_CREDENTIALS to a JSON file path, or
  // provide FIREBASE_SERVICE_ACCOUNT (base64-encoded JSON) via env.
  if (!admin.apps.length) {
    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (b64) {
      const json = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
      admin.initializeApp({ credential: admin.credential.cert(json) });
      firebaseReady = true;
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({ credential: admin.credential.applicationDefault() });
      firebaseReady = true;
    }
  } else {
    firebaseReady = true;
  }
} catch (e) {
  console.log('[notify] Firebase admin not initialized:', e?.message || e);
}

export async function notifyPush(token, title, body) {
  if (!firebaseReady) {
    console.log('[notify]', title, body);
    return { ok: true, transport: 'console' };
  }
  try {
    const message = { token, notification: { title, body } };
    const id = await admin.messaging().send(message);
    return { ok: true, id, transport: 'fcm' };
  } catch (e) {
    console.log('[notify] FCM error:', e?.message || e);
    return { ok: false, error: String(e) };
  }
}
