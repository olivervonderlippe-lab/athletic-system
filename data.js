export const APP = {name:"Athletik System V12",version:"12.0.0",schema:1,storageKey:"athletik.v12.state.v1"};
export const CYCLE=[
{week:1,phase:"Aufbau",note:"Volumen sauber aufbauen. Technik priorisieren."},
{week:2,phase:"Aufbau",note:"Gleiche Struktur. RPE kontrolliert."},
{week:3,phase:"Aufbau",note:"Letzte Aufbau-Woche. Nicht überziehen."},
{week:4,phase:"Deload",note:"Runterfahren, Gelenke glücklich."},
{week:5,phase:"Build",note:"Stetig steigern. Qualität hoch."},
{week:6,phase:"Build",note:"Stetig steigern. Keine Heldentaten."},
{week:7,phase:"Build",note:"Letzte Build-Woche."},
{week:8,phase:"Deload",note:"Entlasten. Schlaf & Mobility."},
{week:9,phase:"Qualität",note:"Saubere schwere Arbeit. RPE 7–8."},
{week:10,phase:"Qualität",note:"Sauber, konstant."},
{week:11,phase:"Qualität",note:"Letzte harte Woche."},
{week:12,phase:"Review+Deload",note:"−15% Last, −20% Volumen. Review & Reset."}
];

export const WEEK_TEMPLATE=[
{dayIndex:0,title:"Montag – Kraft A",tags:["Lower + Pull"],duration:"60–75 Min",blocks:[
{type:"mainlift",id:"deadlift",name:"Hauptlift – Hinge (Deadlift)",target:"4×6 @RPE 7–8",incrementKg:2.5},
{type:"assist",id:"bulgarian",name:"Bulgarian Split Squat ODER Front Squat (Wahl)",target:"4×6 @RPE 7–8",incrementKg:2.0},
{type:"skill",id:"pullup",name:"Skill – Pull-up (Level)",target:"Level 1–3 (kurz)"}
]},
{dayIndex:1,title:"Dienstag – Mobility + Handstand",tags:["30–40 Min"],duration:"30–40 Min",blocks:[
{type:"skill",id:"handstand",name:"Skill – Handstand (Level)",target:"Level 1–3 (kurz)"},
{type:"mobility",id:"mobility",name:"Mobility",target:"10–20 Min (Rücken/Hüfte/Schulter)"}
]},
{dayIndex:2,title:"Mittwoch – frei / Spaziergang",tags:["frei"],duration:"20–40 Min",blocks:[
{type:"recovery",id:"walk",name:"Recovery",target:"Komplett frei oder 20–40 Min Spaziergang"}
]},
{dayIndex:3,title:"Donnerstag – Attack",tags:["Spaß & MetCon"],duration:"60 Min",blocks:[
{type:"conditioning",id:"attack",name:"Les Mills Attack (oder ähnlich)",target:"1 Class"}
]},
{dayIndex:4,title:"Freitag – Kraft B",tags:["Upper + Pull"],duration:"60–75 Min",blocks:[
{type:"mainlift",id:"bench",name:"Hauptlift – Push (Bankdrücken)",target:"4×6 @RPE 7–8",incrementKg:2.0},
{type:"assist",id:"row",name:"Rudern (Cable/DB)",target:"4×8 @RPE 7–8",incrementKg:2.0},
{type:"skill",id:"pullup",name:"Skill – Pull-up (Level)",target:"Level 1–3 (kurz)"}
]},
{dayIndex:5,title:"Samstag – Rotationstag",tags:["Steph / Shapes / Barre"],duration:"moderat",blocks:[
{type:"conditioning",id:"rotation",name:"Rotation (Class)",target:"1 Class (moderat)"}
]},
{dayIndex:6,title:"Sonntag – Yoga oder Off",tags:["Recovery"],duration:"Optional",blocks:[
{type:"recovery",id:"yoga",name:"Yoga / Stretch / Off",target:"Optional (Recovery)"}
]}
];

export const SKILLS={
pullup:{name:"Pull-up",levels:[
"Level 1: Dead Hang Gesamtzeit 30–60s (z.B. 6×10s) + Scap Pulls 3×5",
"Level 2: Band-Assists 4×3–5 ODER Negatives 3×1–3 (wenn möglich) + Hang 30–60s",
"Level 3: 1× echter Pull-up (Ziel) + Back-off mit Band 3×3"
]},
handstand:{name:"Handstand",levels:[
"Level 1: Wall-Facing Holds 6×20–30s (Qualität) + Schulter-Taps (leicht)",
"Level 2: Chest-to-wall 4×30–45s + 3×10 Shoulder Shrugs",
"Level 3: 5–10 Freiversuche + 3×30s Wall Holds"
]}
};
