// @ts-nocheck
/**
 * Rutina — Anatomy Map Generator v6.1
 * Versión extendida: genera una imagen por cada ejercicio.
 * Ejecutar: npx ts-node --transpile-only scripts/generateAnatomicV6.1.ts
 */

const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

// === CONFIG ===
const INPUT_JSON = "./src/data/exercises.json";
const OUTPUT_DIR = "./public/assets/exercises/";
const W = 768, H = 768;
const CX = W / 2;

const C = {
  bg: "#F7F8FA",
  floorTop: "rgba(0,0,0,0.06)",
  text: "#1E293B",
  skin: "#ECECEC",
  outline: "#CFCFCF",
  prime: "#4361EE",
  secondary: "#8BA6FF",
};

// músculos que fuerzan vista posterior
const BACK_VIEW = new Set([
  "back","lats","rear-delts","lower-back","hamstrings","posterior-chain","glutes","traps-back","erectors"
]);

// ========== UTILIDADES ==========
function fillFloor(ctx){
  ctx.fillStyle = C.bg;
  ctx.fillRect(0,0,W,H);
  const g = ctx.createLinearGradient(0,H-220,0,H);
  g.addColorStop(0, C.floorTop);
  g.addColorStop(1, C.bg);
  ctx.fillStyle = g;
  ctx.fillRect(0, H-220, W, 220);
}

function strokeFill(ctx){
  ctx.fillStyle = C.skin;
  ctx.strokeStyle = C.outline;
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
}

function roundedRectPath(ctx, x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

function fillLobe(ctx, x,y,w,h,r=14){ roundedRectPath(ctx,x,y,w,h,r); ctx.fill(); }

// ========= BASE HUMANA =========
function baseFront(ctx){
  fillFloor(ctx);
  ctx.beginPath(); ctx.ellipse(CX, 128, 46, 56, 0, 0, Math.PI*2); strokeFill(ctx);
  roundedRectPath(ctx, CX-16, 182, 32, 22, 6); strokeFill(ctx);
  ctx.beginPath();
  ctx.moveTo(CX-92, 204);
  ctx.bezierCurveTo(CX-34,160, CX+34,160, CX+92,204);
  ctx.lineTo(CX+66, 408);
  ctx.bezierCurveTo(CX+8,448, CX-8,448, CX-66,408);
  ctx.closePath(); strokeFill(ctx);
  ctx.beginPath();
  ctx.moveTo(CX-66,408);
  ctx.bezierCurveTo(CX-48,418, CX+48,418, CX+66,408);
  ctx.lineTo(CX+58, 430);
  ctx.bezierCurveTo(CX+6,456, CX-6,456, CX-58,430);
  ctx.closePath(); strokeFill(ctx);
  roundedRectPath(ctx, CX-122, 206, 42, 48, 18); strokeFill(ctx);
  roundedRectPath(ctx, CX+80, 206, 42, 48, 18);  strokeFill(ctx);
  roundedRectPath(ctx, CX-122, 252, 42, 76, 18); strokeFill(ctx);
  roundedRectPath(ctx, CX+80,  252, 42, 76, 18); strokeFill(ctx);
  roundedRectPath(ctx, CX-122, 328, 42, 92, 18); strokeFill(ctx);
  roundedRectPath(ctx, CX+80,  328, 42, 92, 18); strokeFill(ctx);
  roundedRectPath(ctx, CX-54, 456, 52, 170, 24); strokeFill(ctx);
  roundedRectPath(ctx, CX+2,  456, 52, 170, 24); strokeFill(ctx);
  roundedRectPath(ctx, CX-54, 626, 52, 70, 22); strokeFill(ctx);
  roundedRectPath(ctx, CX+2,  626, 52, 70, 22); strokeFill(ctx);
}

function baseBack(ctx){
  fillFloor(ctx);
  ctx.beginPath(); ctx.ellipse(CX, 128, 46, 56, 0, 0, Math.PI*2); strokeFill(ctx);
  roundedRectPath(ctx, CX-16, 182, 32, 22, 6); strokeFill(ctx);
  ctx.beginPath();
  ctx.moveTo(CX-90, 204);
  ctx.bezierCurveTo(CX-24,180, CX+24,180, CX+90,204);
  ctx.lineTo(CX+68, 408);
  ctx.bezierCurveTo(CX+10,446, CX-10,446, CX-68,408);
  ctx.closePath(); strokeFill(ctx);
  ctx.beginPath();
  ctx.moveTo(CX-68,408);
  ctx.bezierCurveTo(CX-50,418, CX+50,418, CX+68,408);
  ctx.lineTo(CX+60, 430);
  ctx.bezierCurveTo(CX+8,456, CX-8,456, CX-60,430);
  ctx.closePath(); strokeFill(ctx);
  roundedRectPath(ctx, CX-124, 206, 44, 50, 18); strokeFill(ctx);
  roundedRectPath(ctx, CX+80,  206, 44, 50, 18); strokeFill(ctx);
  roundedRectPath(ctx, CX-124, 256, 44, 74, 18); strokeFill(ctx);
  roundedRectPath(ctx, CX+80,  256, 44, 74, 18); strokeFill(ctx);
  roundedRectPath(ctx, CX-124, 330, 44, 92, 18); strokeFill(ctx);
  roundedRectPath(ctx, CX+80,  330, 44, 92, 18); strokeFill(ctx);
  roundedRectPath(ctx, CX-56, 456, 52, 170, 24); strokeFill(ctx);
  roundedRectPath(ctx, CX+0,  456, 52, 170, 24); strokeFill(ctx);
  roundedRectPath(ctx, CX-56, 626, 52, 70, 22); strokeFill(ctx);
  roundedRectPath(ctx, CX+0,  626, 52, 70, 22); strokeFill(ctx);
}

// ========== MÚSCULOS ==========
function setPrime(ctx){ ctx.globalAlpha = 0.85; ctx.fillStyle = C.prime; }
function setSec(ctx){ ctx.globalAlpha = 0.65; ctx.fillStyle = C.secondary; }
function resetAlpha(ctx){ ctx.globalAlpha = 1; }

function muscleFront(ctx, key){
  setPrime(ctx);
  switch (key) {
    case "chest": fillLobe(ctx, CX-82, 238, 164, 60, 20); break;
    case "shoulders": fillLobe(ctx, CX-124, 208, 248, 50, 18); break;
    case "biceps": fillLobe(ctx, CX-124, 278, 202, 78, 18); break;
    case "triceps": fillLobe(ctx, CX-124, 340, 202, 80, 18); break;
    case "core": fillLobe(ctx, CX-40, 342, 80, 108, 18); break;
    case "legs": fillLobe(ctx, CX-54, 468, 108, 190, 22); break;
    case "glutes": fillLobe(ctx, CX-58, 408, 116, 56, 18); break;
    default: fillLobe(ctx, CX-40, 342, 80, 108, 18);
  }
  resetAlpha(ctx);
}

function muscleBack(ctx, key){
  setPrime(ctx);
  switch (key) {
    case "back": fillLobe(ctx, CX-90, 240, 176, 144, 28); break;
    case "hamstrings": fillLobe(ctx, CX-56, 474, 106, 168, 22); break;
    case "glutes": fillLobe(ctx, CX-58, 408, 116, 56, 18); break;
    default: fillLobe(ctx, CX-90, 240, 176, 144, 28);
  }
  resetAlpha(ctx);
}

// ========== GENERADOR ==========
function needsBack(primary){ return BACK_VIEW.has(String(primary||"").toLowerCase()); }

async function generate(){
  const data = JSON.parse(fs.readFileSync(INPUT_JSON, "utf8"));
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const total = data.length;
  let count = 0;

  for (const ex of data){
    count++;
    const canvas = createCanvas(W,H);
    const ctx = canvas.getContext("2d");

    const primary = String(ex.primaryMuscle || "").toLowerCase();
    const back = needsBack(primary);

    back ? baseBack(ctx) : baseFront(ctx);
    back ? muscleBack(ctx, primary) : muscleFront(ctx, primary);

    if (Array.isArray(ex.secondaryMuscles)){
      setSec(ctx);
      for (const m of ex.secondaryMuscles){
        back ? muscleBack(ctx, m) : muscleFront(ctx, m);
      }
      resetAlpha(ctx);
    }

    ctx.fillStyle = C.text;
    ctx.font = "bold 24px Inter, Arial";
    ctx.fillText(ex.name || ex.id, 40, 44);
    ctx.font = "16px Inter, Arial";
    ctx.fillText(`${ex.equipment || "—"} · ${ex.level || "—"}`, 40, 68);

    const out = path.join(OUTPUT_DIR, `${ex.id || `exercise_${count}`}.png`);
    fs.writeFileSync(out, canvas.toBuffer("image/png"));

    // Barra de progreso simple
    if (count % 25 === 0 || count === total){
      console.log(`🖼️ ${count}/${total} imágenes generadas...`);
    }
  }

  console.log(`✅ Generadas ${total} imágenes en ${OUTPUT_DIR}`);
}

generate();
