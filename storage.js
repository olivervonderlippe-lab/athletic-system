import { APP } from "./data.js";
export function defaultState(){return {schema:APP.schema,createdAt:Date.now(),startISO:"",selectedWeek:1,view:"week",coachMode:true,lifts:{},logs:[],skills:{pullup:{level:1},handstand:{level:1}}};}
export function loadState(){try{const raw=localStorage.getItem(APP.storageKey);if(!raw) return defaultState();const p=JSON.parse(raw);if(!p||p.schema!==APP.schema) return defaultState();return {...defaultState(),...p};}catch(e){return defaultState();}}
export function saveState(s){localStorage.setItem(APP.storageKey,JSON.stringify(s));}
export function hardReset(){localStorage.removeItem(APP.storageKey);}
