export function toISODateLocal(d){const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,"0");const day=String(d.getDate()).padStart(2,"0");return `${y}-${m}-${day}`;}
export function parseISOToLocalDate(iso){const [y,m,d]=iso.split("-").map(Number);return new Date(y,m-1,d,12,0,0,0);}
export function formatDE(iso){if(!iso) return "—";const d=parseISOToLocalDate(iso);const dd=String(d.getDate()).padStart(2,"0");const mm=String(d.getMonth()+1).padStart(2,"0");const yy=d.getFullYear();return `${dd}.${mm}.${yy}`;}
export function mondayGuard(iso){const d=parseISOToLocalDate(iso);const day=d.getDay();if(day===1) return iso;const delta=(day===0)?6:(day-1);d.setDate(d.getDate()-delta);return toISODateLocal(d);}
export function weekIndexFromStart(startISO,todayISO){const s=parseISOToLocalDate(startISO);const t=parseISOToLocalDate(todayISO);const diff=Math.floor((t-s)/(1000*60*60*24));if(diff<0) return 1;return Math.floor(diff/7)+1;}
export function dayIndexFromISO(iso){const d=parseISOToLocalDate(iso);const dow=d.getDay();return (dow+6)%7;}
