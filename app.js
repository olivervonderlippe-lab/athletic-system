import { APP, CYCLE, WEEK_TEMPLATE } from "./data.js";
import { loadState, saveState, hardReset } from "./storage.js";
import { toISODateLocal, formatDE, mondayGuard, weekIndexFromStart, dayIndexFromISO } from "./date.js";
import { applyCoach } from "./coach.js";

const $ = (s)=>document.querySelector(s);
const el=(t,c)=>{const x=document.createElement(t);if(c)x.className=c;return x;};
let state=loadState();

function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(t._to);t._to=setTimeout(()=>t.classList.remove("show"),1400);}

function clampWeek(w){if(!w||w<1) return 1;return ((w-1)%12)+1;}
function cycleInfo(w){return CYCLE.find(x=>x.week===w)||{week:w,phase:"—",note:"—"};}

function save(){saveState(state);}

function init(){
  $("#title").textContent=APP.name;
  $("#sub").textContent=`Strukturell sauber. Kein Service Worker. Stabile Kalender-Logik + konservativer Coach. Version ${APP.version}.`;
  $("#startInput").value=state.startISO?formatDE(state.startISO):"";
  $("#coachToggle").checked=!!state.coachMode;
  $("#viewSelect").value=state.view||"week";

  $("#btnSetStart").onclick=setStart;
  $("#btnToday").onclick=()=>{state.view="today";save();render();};
  $("#btnReload").onclick=()=>{state=loadState();init();render();toast("Neu geladen.");};
  $("#btnReset").onclick=()=>{if(confirm("Reset löscht lokalen Progress.")){hardReset();state=loadState();init();render();toast("Reset.");}};
  $("#coachToggle").onchange=(e)=>{state.coachMode=!!e.target.checked;save();render();};
  $("#viewSelect").onchange=(e)=>{state.view=e.target.value;save();render();};
  $("#weekSelect").onchange=(e)=>{state.selectedWeek=Number(e.target.value);state.view="week";save();render();};

  $("#btnExport").onclick=exportJSON;
  $("#importFile").onchange=importJSON;
  $("#btnBackfill").onclick=openModal;
  $("#modalClose").onclick=closeModal;
  $("#modal").onclick=(e)=>{if(e.target.id==="modal") closeModal();};

  render();
  toast("Bereit.");
}

function setStart(){
  const raw=prompt("Startdatum (Montag) TT.MM.JJJJ:", state.startISO?formatDE(state.startISO):"");
  if(!raw) return;
  const m=raw.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if(!m){alert("Format TT.MM.JJJJ");return;}
  const dd=String(m[1]).padStart(2,"0"), mm=String(m[2]).padStart(2,"0"), yy=m[3];
  const iso=`${yy}-${mm}-${dd}`;
  state.startISO=mondayGuard(iso);
  const todayISO=toISODateLocal(new Date());
  state.selectedWeek=clampWeek(weekIndexFromStart(state.startISO,todayISO));
  $("#startInput").value=formatDE(state.startISO);
  save();render();toast("Start gesetzt.");
}

function renderWeekOptions(){
  const sel=$("#weekSelect");
  sel.innerHTML="";
  if(!state.startISO){
    const o=el("option");o.value="";o.textContent="Bitte Startdatum setzen";sel.appendChild(o);
    sel.disabled=true;return;
  }
  sel.disabled=false;
  for(const w of CYCLE){
    const o=el("option");o.value=String(w.week);o.textContent=`Woche ${w.week} (${w.phase})`;sel.appendChild(o);
  }
  sel.value=String(state.selectedWeek||1);
}

function renderMeta(){
  const todayISO=toISODateLocal(new Date());
  $("#metaStart").textContent=state.startISO?formatDE(state.startISO):"—";
  $("#metaToday").textContent=formatDE(todayISO);
  const w=state.startISO?clampWeek(weekIndexFromStart(state.startISO,todayISO)):1;
  const ci=cycleInfo(w);
  $("#cycleChip").textContent=state.startISO?`Cycle-Woche ${ci.week}/12 · ${ci.phase}`:"Cycle-Woche —";
  $("#cycleNote").textContent=state.startISO?ci.note:"Setze Startdatum (Montag).";
}

function renderCoachRules(){
  $("#coachModeText").textContent=state.coachMode?"AN":"AUS";
  $("#coachRules").textContent=[
    "Startgewicht via 'Letzte Einheit nachtragen'.",
    "RPE ≤ 7 & Technik ok → +Increment.",
    "RPE 7.5–8.5 & Technik ok → HOLD.",
    "RPE ≥ 9 oder Technik wacklig → −Increment.",
    "Deload Wochen 4/8/12: −15% Last."
  ].join("\n");
}

function computePlanned(blockId, week){
  const lift=state.lifts?.[blockId];
  return lift?.plannedByWeek?.[String(week)] ?? null;
}

function renderPlan(){
  const mount=$("#planMount");
  mount.innerHTML="";
  if(!state.startISO){
    const d=el("div","day");d.innerHTML=`<div class="dayTitle">Start fehlt</div><div class="kicker">Speichern & Starten drücken.</div>`;mount.appendChild(d);return;
  }
  const todayISO=toISODateLocal(new Date());
  const week=state.selectedWeek||1;
  const todayIdx=dayIndexFromISO(todayISO);
  const view=state.view||"week";
  const days=(view==="week")?WEEK_TEMPLATE:[WEEK_TEMPLATE.find(x=>x.dayIndex===todayIdx)||WEEK_TEMPLATE[0]];
  for(const day of days){
    const card=el("div","day");
    const head=el("div","dayHead");
    const left=el("div");
    const t=el("div","dayTitle");t.textContent=day.title;
    const k=el("div","kicker");k.textContent=`Dauer: ${day.duration}`;
    left.appendChild(t);left.appendChild(k);
    const tags=el("div","tags");
    for(const tg of day.tags){const x=el("div","tag");x.textContent=tg;tags.appendChild(x);}
    if(day.dayIndex===todayIdx){const x=el("div","tag today");x.textContent="Heute";tags.appendChild(x);}
    head.appendChild(left);head.appendChild(tags);
    card.appendChild(head);

    const ul=el("ul","exList");
    for(const b of day.blocks){
      const li=el("li");
      if(b.type==="mainlift"||b.type==="assist"){
        const p=computePlanned(b.id, week);
        const ptxt=p?` · Plan W${week}: ${p} kg`:"";
        li.innerHTML=`<strong>${b.name}</strong> — ${b.target}${ptxt}`;
      }else if(b.type==="skill"){
        const lvl=state.skills?.[b.id]?.level ?? 1;
        li.innerHTML=`<strong>${b.name}</strong> — ${b.target} · Level ${lvl}`;
      }else{
        li.innerHTML=`<strong>${b.name}</strong> — ${b.target}`;
      }
      ul.appendChild(li);
    }
    card.appendChild(ul);
    mount.appendChild(card);
  }
}

function renderProgress(){
  const week=state.selectedWeek||1;
  const logs=(state.logs||[]).filter(x=>x.week===week);
  const done=new Set(logs.map(x=>x.dayIndex));
  const pct=Math.round((done.size/7)*100);
  $("#progressMeta").textContent=`${done.size}/7 Tage geloggt in Woche ${week}`;
  $("#progressPct").textContent=`${pct}%`;
  $("#progressFill").style.width=`${pct}%`;
}

function exportJSON(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="athletik_progress_v12.json";
  document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  toast("Export erstellt.");
}

function importJSON(e){
  const f=e.target.files?.[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{try{const p=JSON.parse(r.result);if(!p||p.schema!==APP.schema){alert("Schema passt nicht.");return;}
    state=p;save();init();toast("Import ok.");}catch(err){alert("Import kaputt.");}};
  r.readAsText(f);
}

function openModal(){
  if(!state.startISO){alert("Erst Startdatum setzen.");return;}
  $("#modal").classList.add("show");
  renderModal();
}
function closeModal(){ $("#modal").classList.remove("show"); }

function ensureLift(id, startKg){
  if(!state.lifts[id]) state.lifts[id]={startKg:startKg,plannedByWeek:{},lastLoggedWeek:0};
}

function renderModal(){
  const body=$("#modalBody"); body.innerHTML="";
  const info=el("div","small");info.textContent="Nachtragen = Log speichern + Coach für nächste Woche planen.";body.appendChild(info);

  const blocks=[{id:"deadlift",name:"Deadlift",inc:2.5},{id:"bulgarian",name:"Bulgarian/Front (Wahl)",inc:2.0},{id:"bench",name:"Bench",inc:2.0},{id:"row",name:"Row",inc:2.0}];
  const sel=el("select");sel.className="input";
  for(const b of blocks){const o=el("option");o.value=b.id;o.textContent=b.name;sel.appendChild(o);}
  const w=el("input");w.className="input";w.placeholder="Gewicht (kg)";w.inputMode="decimal";
  const reps=el("input");reps.className="input";reps.placeholder="Reps";reps.inputMode="numeric";
  const rpe=el("select");rpe.className="input";for(const x of [6,6.5,7,7.5,8,8.5,9,9.5,10]){const o=el("option");o.value=String(x);o.textContent=String(x);rpe.appendChild(o);}rpe.value="8.5";
  const tech=el("select");tech.className="input";for(const t of ["OK (sauber)","OK (hart)","Wacklig","Schmerz/Stop"]){const o=el("option");o.value=t;o.textContent=t;tech.appendChild(o);}

  const grid=el("div","row");
  const f1=el("div");f1.appendChild(label("Übung"));f1.appendChild(sel);
  const f2=el("div");f2.appendChild(label("Gewicht"));f2.appendChild(w);
  const f3=el("div");f3.appendChild(label("Reps"));f3.appendChild(reps);
  const f4=el("div");f4.appendChild(label("RPE"));f4.appendChild(rpe);
  body.appendChild(grid);grid.appendChild(f1);grid.appendChild(f2);grid.appendChild(f3);grid.appendChild(f4);
  const f5=el("div");f5.appendChild(label("Technik"));f5.appendChild(tech);body.appendChild(f5);

  const actions=el("div","actions");
  const saveBtn=el("button","btn primary");saveBtn.textContent="Speichern + Coach planen";
  const cancel=el("button","btn");cancel.textContent="Abbrechen";cancel.onclick=closeModal;
  saveBtn.onclick=()=>{
    const id=sel.value;
    const weight=Number(String(w.value).replace(",","."));
    const repsN=Number(reps.value||0);
    const rpeN=Number(rpe.value);
    const technique=tech.value;
    if(!weight||weight<=0){alert("Gewicht fehlt");return;}
    if(!repsN||repsN<=0){alert("Reps fehlt");return;}

    const todayISO=toISODateLocal(new Date());
    const absW=weekIndexFromStart(state.startISO,todayISO);
    const week=clampWeek(absW);
    const dayIndex=(id==="bench"||id==="row")?4:0;

    state.logs.push({dateISO:todayISO,week,dayIndex,blockId:id,weightKg:weight,reps:repsN,rpe:rpeN,technique});
    ensureLift(id, weight);
    const lift=state.lifts[id];
    if(!lift.plannedByWeek[String(week)]) lift.plannedByWeek[String(week)]=weight;

    if(state.coachMode){
      const inc=blocks.find(b=>b.id===id).inc;
      const res=applyCoach({lift,lastLog:{rpe:rpeN,technique},nextWeek:clampWeek(week+1),incrementKg:inc});
      lift.plannedByWeek=res.plannedByWeek;
      $("#statusText").textContent=`Log gespeichert. Coach: ${id} → Woche ${clampWeek(week+1)} = ${lift.plannedByWeek[String(clampWeek(week+1))]} kg (${res.note}).`;
    }else{
      $("#statusText").textContent="Log gespeichert (Coach aus).";
    }
    save();render();closeModal();toast("Gespeichert.");
  };
  actions.appendChild(saveBtn);actions.appendChild(cancel);body.appendChild(actions);
}

function label(t){const l=el("div","label");l.textContent=t;return l;}

function render(){
  renderWeekOptions();
  renderMeta();
  renderCoachRules();
  renderProgress();
  renderPlan();
}

init();
