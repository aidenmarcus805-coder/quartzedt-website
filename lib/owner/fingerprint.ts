/**
 * Owner Fingerprinting Logic
 * Provides zero-friction authentication purely based on device uniqueness.
 * We hash Canvas ID, Fonts, Color Depth, and Timezone + Salt.
 */

// Helper to reliably hash strings in the browser
async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

// Generate Canvas Fingerprint (Standard canvas hashing technique)
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.font = '11pt no-real-font-123';
    ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.font = '18pt Arial';
    ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 4, 45);
    return canvas.toDataURL();
  } catch (e) {
    return 'canvas-error';
  }
}

// Generate an exact machine/browser unique hash
export async function generateFingerprint(): Promise<string> {
  const email = "aiden.marcus805@gmail.com";
  const salt = process.env.NEXT_PUBLIC_OWNER_SALT || "kilo-quartz-salt-805";
  
  const canvasHash = getCanvasFingerprint();
  const screenHash = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Create an aggressive payload that uniquely identifies this exactly device/browser combo
  const rawPayload = `${email}|${salt}|${canvasHash}|${screenHash}|${tz}`;
  
  return await sha256(rawPayload);
}
