export function roundTo(x,inc){return Math.round(x/inc)*inc;}
export function isDeloadWeek(w){return w===4||w===8||w===12;}
export function applyCoach({lift,lastLog,nextWeek,incrementKg}){
  const planned=lift.plannedByWeek||{};
  const prevWeek=nextWeek-1;
  const prevPlanned=(planned[String(prevWeek)]??lift.startKg??0);
  if(isDeloadWeek(nextWeek)){
    let w=prevWeek;while(w>1&&isDeloadWeek(w)) w--;
    const ref=(planned[String(w)]??prevPlanned);
    planned[String(nextWeek)]=Math.max(0,roundTo(ref*0.85,incrementKg));
    return {plannedByWeek:planned,note:"Deload: −15% Last."};
  }
  let base=prevPlanned;
  if(isDeloadWeek(prevWeek)){
    let w=prevWeek-1;while(w>1&&isDeloadWeek(w)) w--;
    base=(planned[String(w)]??base);
  }
  let delta=0;
  if(lastLog){
    const rpe=Number(lastLog.rpe??8);
    const tech=String(lastLog.technique??"OK").toLowerCase();
    const techOk=tech.includes("ok")||tech.includes("sauber")||tech.includes("good");
    const techShaky=tech.includes("wack")||tech.includes("shaky")||tech.includes("schmerz");
    if(rpe<=7 && techOk) delta=+1;
    else if(rpe>=9 || techShaky) delta=-1;
    else delta=0;
  }
  const next=Math.max(0,roundTo(base + (delta*incrementKg),incrementKg));
  planned[String(nextWeek)]=next;
  const why=delta>0?`+${incrementKg}kg`:(delta<0?`-${incrementKg}kg`:"Hold");
  return {plannedByWeek:planned,note:why};
}
