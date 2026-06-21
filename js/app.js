/* ══════════════════════════════════════════
   ALL SPLIT PLANS
══════════════════════════════════════════ */
const ALL_PLANS = {

  ppl:{
    name:"Push / Pull / Leg",
    short:"PPL",
    days:"6 Days",
    desc:"Classic bodybuilder split. Maximum volume per muscle group with full recovery.",
    heroTitle:"PUSH<br><span class='stroke'>PULL</span><br>LEG",
    schedule:{
      mon:{label:"PUSH",sub:"Chest · Shoulders · Triceps"},
      tue:{label:"PULL",sub:"Back · Biceps · Rear Delt"},
      wed:{label:"LEG",sub:"Quads · Hamstrings · Glutes"},
      thu:{label:"PUSH",sub:"Volume Day"},
      fri:{label:"PULL",sub:"Volume Day"},
      sat:{label:"LEG",sub:"Explosive & Endurance"},
      sun:{label:"REST",sub:"Active Recovery"}
    },
    exercises:{
      mon:[
        {name:"Archer Push-Up",sets:"5",reps:"6"},{name:"Pike Push-Up (Elevated)",sets:"4",reps:"8"},
        {name:"Wide Push-Up",sets:"4",reps:"12"},{name:"Diamond Push-Up",sets:"4",reps:"10"},
        {name:"Planche Lean Hold",sets:"3",reps:"20s"},{name:"Decline Push-Up",sets:"3",reps:"12"}
      ],
      tue:[
        {name:"Pull-Up",sets:"5",reps:"6"},{name:"Towel Row (Door)",sets:"4",reps:"10"},
        {name:"Inverted Row (Table)",sets:"4",reps:"10"},{name:"Superman Hold",sets:"3",reps:"12"},
        {name:"Towel Bicep Curl",sets:"4",reps:"12"},{name:"Rear Delt Fly (Floor)",sets:"3",reps:"15"}
      ],
      wed:[
        {name:"Bulgarian Split Squat",sets:"5",reps:"8"},{name:"Single-Leg RDL",sets:"4",reps:"10"},
        {name:"Shrimp Squat",sets:"3",reps:"6"},{name:"Nordic Hamstring Curl",sets:"3",reps:"5"},
        {name:"Glute Bridge (Single Leg)",sets:"4",reps:"12"},{name:"Calf Raise (Elevated)",sets:"4",reps:"20"}
      ],
      thu:[
        {name:"Push-Up Cluster Set",sets:"5",reps:"10"},{name:"Incline Push-Up",sets:"4",reps:"15"},
        {name:"Pseudo-Planche Push-Up",sets:"4",reps:"8"},{name:"Close-Grip Push-Up",sets:"3",reps:"15"},
        {name:"Shoulder Tap Push-Up",sets:"3",reps:"10"},{name:"Push-Up Death Set",sets:"1",reps:"MAX"}
      ],
      fri:[
        {name:"Chin-Up (Supinated)",sets:"5",reps:"6"},{name:"Scapular Pull-Up",sets:"3",reps:"12"},
        {name:"Towel Row — Wide Grip",sets:"4",reps:"12"},{name:"Face Pull Alternative",sets:"4",reps:"15"},
        {name:"Hammer Curl (Towel)",sets:"3",reps:"12"},{name:"Dead Bug",sets:"3",reps:"10"}
      ],
      sat:[
        {name:"Jump Squat",sets:"5",reps:"8"},{name:"Lateral Lunge",sets:"4",reps:"10"},
        {name:"Pistol Squat (Assisted)",sets:"3",reps:"6"},{name:"Reverse Lunge",sets:"4",reps:"12"},
        {name:"Hamstring Slide Curl",sets:"3",reps:"10"},{name:"Wall Sit",sets:"3",reps:"45s"}
      ],
      sun:[
        {name:"Full Body Stretch",sets:"1",reps:"10min"},{name:"Outdoor Walk",sets:"1",reps:"40min"},
        {name:"Breathwork",sets:"1",reps:"10min"}
      ]
    }
  },

  fullbody:{
    name:"Full Body Workout",
    short:"FULL BODY",
    days:"3 Days",
    desc:"Train every muscle every session. Ideal for building a solid base or when short on time.",
    heroTitle:"FULL<br><span class='stroke'>BODY</span>",
    schedule:{
      mon:{label:"FULL",sub:"Full Body — Session A"},
      tue:{label:"REST",sub:"Active Recovery"},
      wed:{label:"FULL",sub:"Full Body — Session B"},
      thu:{label:"REST",sub:"Active Recovery"},
      fri:{label:"FULL",sub:"Full Body — Session C"},
      sat:{label:"REST",sub:"Rest & Mobility"},
      sun:{label:"REST",sub:"Full Rest"}
    },
    exercises:{
      mon:[
        {name:"Push-Up",sets:"4",reps:"12"},{name:"Inverted Row (Table)",sets:"4",reps:"10"},
        {name:"Bulgarian Split Squat",sets:"3",reps:"8"},{name:"Pike Push-Up",sets:"3",reps:"10"},
        {name:"Glute Bridge",sets:"3",reps:"15"},{name:"Plank Hold",sets:"3",reps:"45s"}
      ],
      tue:[
        {name:"Outdoor Walk",sets:"1",reps:"30min"},{name:"Full Body Stretch",sets:"1",reps:"10min"}
      ],
      wed:[
        {name:"Diamond Push-Up",sets:"4",reps:"10"},{name:"Pull-Up",sets:"4",reps:"6"},
        {name:"Shrimp Squat",sets:"3",reps:"6"},{name:"Archer Push-Up",sets:"3",reps:"6"},
        {name:"Single-Leg RDL",sets:"3",reps:"10"},{name:"Dead Bug",sets:"3",reps:"10"}
      ],
      thu:[
        {name:"Outdoor Walk",sets:"1",reps:"30min"},{name:"Full Body Stretch",sets:"1",reps:"10min"}
      ],
      fri:[
        {name:"Decline Push-Up",sets:"4",reps:"12"},{name:"Chin-Up (Supinated)",sets:"4",reps:"6"},
        {name:"Jump Squat",sets:"4",reps:"8"},{name:"Shoulder Tap Push-Up",sets:"3",reps:"10"},
        {name:"Nordic Hamstring Curl",sets:"3",reps:"5"},{name:"Calf Raise (Elevated)",sets:"4",reps:"20"}
      ],
      sat:[
        {name:"Foam Roll / Stretch",sets:"1",reps:"15min"},{name:"Breathwork",sets:"1",reps:"10min"}
      ],
      sun:[
        {name:"Full Rest",sets:"1",reps:"—"}
      ]
    }
  },

  upperlower:{
    name:"Upper / Lower Split",
    short:"UPPER / LOWER",
    days:"4 Days",
    desc:"Balanced frequency. Upper body and lower body trained twice per week each.",
    heroTitle:"UPPER<br><span class='stroke'>LOWER</span>",
    schedule:{
      mon:{label:"UPPER",sub:"Chest · Back · Shoulders · Arms"},
      tue:{label:"LOWER",sub:"Quads · Hamstrings · Glutes · Calves"},
      wed:{label:"REST",sub:"Active Recovery"},
      thu:{label:"UPPER",sub:"Upper — Volume Day"},
      fri:{label:"LOWER",sub:"Lower — Volume Day"},
      sat:{label:"REST",sub:"Rest & Mobility"},
      sun:{label:"REST",sub:"Full Rest"}
    },
    exercises:{
      mon:[
        {name:"Archer Push-Up",sets:"4",reps:"6"},{name:"Pull-Up",sets:"4",reps:"6"},
        {name:"Pike Push-Up (Elevated)",sets:"3",reps:"8"},{name:"Inverted Row",sets:"3",reps:"10"},
        {name:"Diamond Push-Up",sets:"3",reps:"12"},{name:"Towel Bicep Curl",sets:"3",reps:"12"}
      ],
      tue:[
        {name:"Bulgarian Split Squat",sets:"4",reps:"8"},{name:"Nordic Hamstring Curl",sets:"3",reps:"5"},
        {name:"Glute Bridge (Single Leg)",sets:"3",reps:"12"},{name:"Shrimp Squat",sets:"3",reps:"6"},
        {name:"Calf Raise (Elevated)",sets:"4",reps:"20"},{name:"Wall Sit",sets:"3",reps:"45s"}
      ],
      wed:[
        {name:"Outdoor Walk",sets:"1",reps:"30min"},{name:"Full Body Stretch",sets:"1",reps:"15min"}
      ],
      thu:[
        {name:"Wide Push-Up",sets:"4",reps:"15"},{name:"Towel Row (Door)",sets:"4",reps:"12"},
        {name:"Decline Push-Up",sets:"3",reps:"12"},{name:"Face Pull Alternative",sets:"3",reps:"15"},
        {name:"Close-Grip Push-Up",sets:"3",reps:"15"},{name:"Rear Delt Fly (Floor)",sets:"3",reps:"15"}
      ],
      fri:[
        {name:"Jump Squat",sets:"4",reps:"8"},{name:"Reverse Lunge",sets:"4",reps:"12"},
        {name:"Single-Leg RDL",sets:"3",reps:"10"},{name:"Lateral Lunge",sets:"3",reps:"10"},
        {name:"Hamstring Slide Curl",sets:"3",reps:"10"},{name:"Calf Raise (Elevated)",sets:"3",reps:"20"}
      ],
      sat:[
        {name:"Foam Roll",sets:"1",reps:"10min"},{name:"Breathwork",sets:"1",reps:"10min"}
      ],
      sun:[
        {name:"Full Rest",sets:"1",reps:"—"}
      ]
    }
  },

  bro:{
    name:"Bro Split",
    short:"BRO SPLIT",
    days:"5 Days",
    desc:"One muscle group per day. High volume isolation for maximum muscle pump.",
    heroTitle:"BRO<br><span class='stroke'>SPLIT</span>",
    schedule:{
      mon:{label:"CHEST",sub:"Chest Day"},
      tue:{label:"BACK",sub:"Back Day"},
      wed:{label:"SHOULDER",sub:"Shoulders Day"},
      thu:{label:"ARMS",sub:"Biceps & Triceps"},
      fri:{label:"LEGS",sub:"Leg Day"},
      sat:{label:"REST",sub:"Rest & Mobility"},
      sun:{label:"REST",sub:"Full Rest"}
    },
    exercises:{
      mon:[
        {name:"Archer Push-Up",sets:"4",reps:"8"},{name:"Wide Push-Up",sets:"4",reps:"12"},
        {name:"Decline Push-Up",sets:"4",reps:"12"},{name:"Incline Push-Up",sets:"3",reps:"15"},
        {name:"Push-Up Cluster Set",sets:"3",reps:"10"},{name:"Push-Up Death Set",sets:"1",reps:"MAX"}
      ],
      tue:[
        {name:"Pull-Up",sets:"5",reps:"6"},{name:"Inverted Row (Table)",sets:"4",reps:"10"},
        {name:"Towel Row (Door)",sets:"4",reps:"10"},{name:"Scapular Pull-Up",sets:"3",reps:"12"},
        {name:"Superman Hold",sets:"3",reps:"12"},{name:"Rear Delt Fly (Floor)",sets:"3",reps:"15"}
      ],
      wed:[
        {name:"Pike Push-Up (Elevated)",sets:"5",reps:"8"},{name:"Planche Lean Hold",sets:"4",reps:"20s"},
        {name:"Pseudo-Planche Push-Up",sets:"4",reps:"8"},{name:"Shoulder Tap Push-Up",sets:"3",reps:"10"},
        {name:"Face Pull Alternative",sets:"4",reps:"15"},{name:"Pike Push-Up (Floor)",sets:"3",reps:"12"}
      ],
      thu:[
        {name:"Diamond Push-Up",sets:"5",reps:"10"},{name:"Close-Grip Push-Up",sets:"4",reps:"12"},
        {name:"Towel Bicep Curl",sets:"4",reps:"12"},{name:"Hammer Curl (Towel)",sets:"4",reps:"12"},
        {name:"Tricep Dips (Chair)",sets:"4",reps:"12"},{name:"Chin-Up (Supinated)",sets:"3",reps:"8"}
      ],
      fri:[
        {name:"Bulgarian Split Squat",sets:"5",reps:"8"},{name:"Jump Squat",sets:"4",reps:"8"},
        {name:"Nordic Hamstring Curl",sets:"4",reps:"5"},{name:"Pistol Squat (Assisted)",sets:"3",reps:"6"},
        {name:"Glute Bridge (Single Leg)",sets:"4",reps:"12"},{name:"Calf Raise (Elevated)",sets:"4",reps:"20"}
      ],
      sat:[
        {name:"Foam Roll",sets:"1",reps:"15min"},{name:"Full Body Stretch",sets:"1",reps:"10min"}
      ],
      sun:[
        {name:"Full Rest",sets:"1",reps:"—"}
      ]
    }
  },

  arnold:{
    name:"Arnold Split",
    short:"ARNOLD",
    days:"6 Days",
    desc:"Arnold's classic 3-day split done twice. Chest+Back, Shoulders+Arms, Legs — repeated.",
    heroTitle:"ARNOLD<br><span class='stroke'>SPLIT</span>",
    schedule:{
      mon:{label:"CHEST+BACK",sub:"Chest & Back — Day 1"},
      tue:{label:"SH+ARMS",sub:"Shoulders & Arms — Day 1"},
      wed:{label:"LEGS",sub:"Leg Day — Day 1"},
      thu:{label:"CHEST+BACK",sub:"Chest & Back — Day 2"},
      fri:{label:"SH+ARMS",sub:"Shoulders & Arms — Day 2"},
      sat:{label:"LEGS",sub:"Leg Day — Day 2"},
      sun:{label:"REST",sub:"Full Rest"}
    },
    exercises:{
      mon:[
        {name:"Archer Push-Up",sets:"4",reps:"8"},{name:"Pull-Up",sets:"4",reps:"6"},
        {name:"Wide Push-Up",sets:"3",reps:"12"},{name:"Inverted Row",sets:"3",reps:"10"},
        {name:"Decline Push-Up",sets:"3",reps:"12"},{name:"Superman Hold",sets:"3",reps:"12"}
      ],
      tue:[
        {name:"Pike Push-Up (Elevated)",sets:"4",reps:"8"},{name:"Diamond Push-Up",sets:"4",reps:"10"},
        {name:"Towel Bicep Curl",sets:"4",reps:"12"},{name:"Planche Lean Hold",sets:"3",reps:"20s"},
        {name:"Hammer Curl (Towel)",sets:"3",reps:"12"},{name:"Face Pull Alternative",sets:"3",reps:"15"}
      ],
      wed:[
        {name:"Bulgarian Split Squat",sets:"4",reps:"8"},{name:"Nordic Hamstring Curl",sets:"3",reps:"5"},
        {name:"Jump Squat",sets:"3",reps:"8"},{name:"Single-Leg RDL",sets:"3",reps:"10"},
        {name:"Glute Bridge (Single Leg)",sets:"3",reps:"12"},{name:"Calf Raise (Elevated)",sets:"4",reps:"20"}
      ],
      thu:[
        {name:"Archer Push-Up",sets:"5",reps:"6"},{name:"Chin-Up (Supinated)",sets:"4",reps:"6"},
        {name:"Close-Grip Push-Up",sets:"4",reps:"12"},{name:"Towel Row (Door)",sets:"4",reps:"10"},
        {name:"Push-Up Cluster Set",sets:"3",reps:"10"},{name:"Rear Delt Fly (Floor)",sets:"3",reps:"15"}
      ],
      fri:[
        {name:"Pseudo-Planche Push-Up",sets:"4",reps:"8"},{name:"Close-Grip Push-Up",sets:"4",reps:"12"},
        {name:"Scapular Pull-Up",sets:"3",reps:"12"},{name:"Shoulder Tap Push-Up",sets:"3",reps:"10"},
        {name:"Towel Bicep Curl",sets:"4",reps:"12"},{name:"Rear Delt Fly (Floor)",sets:"3",reps:"15"}
      ],
      sat:[
        {name:"Pistol Squat (Assisted)",sets:"4",reps:"6"},{name:"Reverse Lunge",sets:"4",reps:"12"},
        {name:"Hamstring Slide Curl",sets:"3",reps:"10"},{name:"Lateral Lunge",sets:"3",reps:"10"},
        {name:"Wall Sit",sets:"3",reps:"45s"},{name:"Calf Raise (Elevated)",sets:"4",reps:"20"}
      ],
      sun:[
        {name:"Full Body Stretch",sets:"1",reps:"15min"},{name:"Breathwork",sets:"1",reps:"10min"},
        {name:"Outdoor Walk",sets:"1",reps:"30min"}
      ]
    }
  }

};

/* ── BUILD PLAN FROM SPLIT ── */
function buildPlan(splitKey){
  const s=ALL_PLANS[splitKey];
  const result={};
  ['mon','tue','wed','thu','fri','sat','sun'].forEach(day=>{
    const sch=s.schedule[day];
    const exList=(s.exercises[day]||[]).map(e=>({...e,note:''}));
    result[day]={label:sch.label,sub:sch.sub,exercises:exList};
  });
  return result;
}

/* ── KEYS ── */
const PLAN_KEY='ppl_plan_v4';
const DONE_KEY='ppl_done_v4';
const SPLIT_KEY='ppl_split_v4';
const THEME_KEY='ppl_theme';
const DAYS=['mon','tue','wed','thu','fri','sat','sun'];

let activeSplit = localStorage.getItem(SPLIT_KEY)||'ppl';
let plan = loadJSON(PLAN_KEY)||buildPlan(activeSplit);
let done = loadJSON(DONE_KEY)||{};
let activeDay='mon';

function loadJSON(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch{return null}}
function saveJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
function gk(day,i){return`${day}_${i}`}

/* ── WEEK STRIP ── */
function renderWeekStrip(){
  const strip=document.getElementById('today');
  const dNames=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  strip.innerHTML=DAYS.map((day,i)=>{
    const d=plan[day];
    const dc=d.exercises.filter((_,idx)=>done[gk(day,idx)]).length;
    const isDone=dc>0;
    const isActive=day===activeDay;
    return`<div class="day-tab${isActive?' active':''}${isDone?' done':''}" data-day="${day}" onclick="switchDay('${day}')">
      <button class="dt-edit-btn" onclick="event.stopPropagation();openDayEdit('${day}')" title="Edit day">
        <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
      <div class="dt-name">${dNames[i]}</div>
      <div class="dt-type">${d.label}</div>
      <div class="dt-dot"></div>
    </div>`;
  }).join('');
}

/* ── DAY EDIT ── */
let editingDay=null;
let selectedDayOption=null;
const dFullNames={mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday',sun:'Sunday'};

const DAY_OPTIONS_BY_PLAN={
  ppl:[
    {label:'PUSH',sub:'Chest · Shoulders · Triceps'},
    {label:'PULL',sub:'Back · Biceps · Rear Delt'},
    {label:'LEG',sub:'Quads · Hamstrings · Glutes'},
    {label:'REST',sub:'Active Recovery'},
  ],
  fullbody:[
    {label:'FULL',sub:'Full Body Session'},
    {label:'REST',sub:'Active Recovery'},
  ],
  upperlower:[
    {label:'UPPER',sub:'Chest · Back · Shoulders · Arms'},
    {label:'LOWER',sub:'Quads · Hamstrings · Glutes · Calves'},
    {label:'REST',sub:'Active Recovery'},
  ],
  bro:[
    {label:'CHEST',sub:'Chest Day'},
    {label:'BACK',sub:'Back Day'},
    {label:'SHOULDER',sub:'Shoulders Day'},
    {label:'ARMS',sub:'Biceps & Triceps'},
    {label:'LEGS',sub:'Leg Day'},
    {label:'REST',sub:'Rest & Mobility'},
  ],
  arnold:[
    {label:'CHEST+BACK',sub:'Chest & Back'},
    {label:'SH+ARMS',sub:'Shoulders & Arms'},
    {label:'LEGS',sub:'Leg Day'},
    {label:'REST',sub:'Full Rest'},
  ],
};
// fallback full list if plan not matched
const DAY_OPTIONS_ALL=[
  {label:'PUSH',sub:'Chest · Shoulders · Triceps'},
  {label:'PULL',sub:'Back · Biceps · Rear Delt'},
  {label:'LEG',sub:'Quads · Hamstrings · Glutes'},
  {label:'CHEST',sub:'Chest Day'},
  {label:'BACK',sub:'Back Day'},
  {label:'SHOULDER',sub:'Shoulders Day'},
  {label:'ARMS',sub:'Biceps & Triceps'},
  {label:'LEGS',sub:'Leg Day'},
  {label:'UPPER',sub:'Chest · Back · Shoulders · Arms'},
  {label:'LOWER',sub:'Quads · Hamstrings · Glutes · Calves'},
  {label:'FULL',sub:'Full Body Session'},
  {label:'CARDIO',sub:'Cardio & Conditioning'},
  {label:'REST',sub:'Active Recovery'},
];

function openDayEdit(day){
  editingDay=day;
  const d=plan[day];
  selectedDayOption={label:d.label,sub:d.sub};
  document.getElementById('de-title').textContent='Edit Day';
  document.getElementById('de-sub-display').textContent=dFullNames[day];

  const opts=DAY_OPTIONS_BY_PLAN[activeSplit]||DAY_OPTIONS_ALL;
  const grid=document.getElementById('de-options-grid');
  grid.innerHTML=opts.map((opt,i)=>`
    <div class="day-option-card${d.label===opt.label?' selected':''}" onclick="selectDayOption(${i})" style="cursor:pointer">
      <div class="opt-label">${opt.label}</div>
      <div class="opt-sub">${opt.sub}</div>
    </div>`).join('');

  document.getElementById('day-edit-modal').classList.add('open');
}

function selectDayOption(i){
  const opts=DAY_OPTIONS_BY_PLAN[activeSplit]||DAY_OPTIONS_ALL;
  selectedDayOption=opts[i];
  document.querySelectorAll('#de-options-grid .day-option-card').forEach((el,idx)=>{
    el.classList.toggle('selected',idx===i);
  });
}

function closeDayEdit(){
  document.getElementById('day-edit-modal').classList.remove('open');
  editingDay=null;
}

function saveDayEdit(){
  if(!editingDay||!selectedDayOption)return;
  plan[editingDay].label=selectedDayOption.label;
  plan[editingDay].sub=selectedDayOption.sub;
  saveJSON(PLAN_KEY,plan);
  closeDayEdit();
  renderWeekStrip();
  if(editingDay===activeDay)renderSession(activeDay);
}

document.getElementById('day-edit-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeDayEdit()});

/* ── PLAN MODAL ── */
function openPlanModal(){
  const grid=document.getElementById('split-grid');
  grid.innerHTML=Object.entries(ALL_PLANS).map(([key,s])=>`
    <div class="split-card${activeSplit===key?' current':''}" onclick="confirmSwitchPlan('${key}')">
      ${activeSplit===key?'<span class="split-current-badge">Current</span>':''}
      <div class="split-days">${s.days}</div>
      <div class="split-name">${s.name}</div>
      <div class="split-desc">${s.desc}</div>
    </div>`).join('');
  document.getElementById('plan-modal').classList.add('open');
}
function closePlanModal(){document.getElementById('plan-modal').classList.remove('open')}
document.getElementById('plan-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closePlanModal()});

function confirmSwitchPlan(key){
  if(key===activeSplit){closePlanModal();return}
  if(!confirm(`Switch to "${ALL_PLANS[key].name}"?\n\nThis will reset this week's progress and load the new plan.`))return;
  activeSplit=key;
  plan=buildPlan(key);
  done={};
  saveJSON(PLAN_KEY,plan);
  saveJSON(DONE_KEY,done);
  localStorage.setItem(SPLIT_KEY,key);
  // Update hero title
  const ht=document.getElementById('hero-title');
  if(ht)ht.innerHTML=ALL_PLANS[key].heroTitle;
  // Update footer
  const ft=document.querySelector('.footer-text');
  if(ft)ft.textContent='Home Training · '+ALL_PLANS[key].name;
  closePlanModal();
  renderWeekStrip();
  renderSession(activeDay);
  updateAll();
}

/* ── CALORIC CALCULATOR ── */
function calcCalories(){
  const age=parseFloat(document.getElementById('c-age').value);
  const weight=parseFloat(document.getElementById('c-weight').value);
  const height=parseFloat(document.getElementById('c-height').value);
  const gender=document.getElementById('c-gender').value;
  const activity=parseFloat(document.getElementById('c-activity').value);
  if(!age||!weight||!height){alert('Please fill in Age, Weight and Height.');return}
  let bmr=gender==='male'?10*weight+6.25*height-5*age+5:10*weight+6.25*height-5*age-161;
  const tdee=Math.round(bmr*activity);bmr=Math.round(bmr);
  document.getElementById('r-bmr').textContent=bmr;
  document.getElementById('r-tdee').textContent=tdee;
  document.getElementById('r-cut').textContent=tdee-500;
  document.getElementById('r-main').textContent=tdee;
  document.getElementById('r-gain').textContent=tdee+500;
  const protein=Math.round(weight*2.0);
  const fat=Math.round(tdee*0.25/9);
  const carbs=Math.round((tdee-protein*4-fat*9)/4);
  document.getElementById('r-protein').textContent=protein+'g';
  document.getElementById('r-carbs').textContent=carbs+'g';
  document.getElementById('r-fat').textContent=fat+'g';
  document.getElementById('result-empty').style.display='none';
  document.getElementById('result-content').style.display='flex';
}

/* ── RENDER SESSION ── */
function renderSession(day){
  const d=plan[day];
  const panel=document.getElementById('session-panel');
  const doneCount=d.exercises.filter((_,i)=>done[gk(day,i)]).length;
  const pct=d.exercises.length?Math.round(doneCount/d.exercises.length*100):0;
  const cards=d.exercises.map((ex,i)=>{
    const isDone=!!done[gk(day,i)];
    const logKey=`log_${day}_${i}`;
    const lastLog=ex.lastLog||'';
    return`<div class="ex-card${isDone?' done-card':''}" id="card_${day}_${i}">
      <div class="ex-card-top">
        <div class="ex-num">EX ${String(i+1).padStart(2,'0')}</div>
        <button class="del-btn" onclick="deleteExercise('${day}',${i})" title="Remove">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="ex-name" contenteditable="true" spellcheck="false"
        onblur="updateField('${day}',${i},'name',this.textContent.trim())"
        onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur()}">${ex.name}</div>
      <div class="ex-footer">
        <div class="ex-sets-group">
          <input class="sets-input" type="text" value="${ex.sets}" title="Sets" onchange="updateField('${day}',${i},'sets',this.value)">
          <span class="sets-sep">×</span>
          <input class="reps-input" type="text" value="${ex.reps}" title="Reps" onchange="updateField('${day}',${i},'reps',this.value)">
        </div>
        <button class="check-btn${isDone?' done':''}" id="btn_${day}_${i}" onclick="toggleDone('${day}',${i})">${isDone?'✓':''}</button>
      </div>
      <div class="ex-last-log">
        <span class="ex-last-label">Last</span>
        <input class="ex-last-input" type="text" placeholder="e.g. 20kg / 45s" value="${lastLog}"
          onchange="updateField('${day}',${i},'lastLog',this.value)"
          onkeydown="if(event.key==='Enter')this.blur()">
      </div>
    </div>`;
  }).join('');

  panel.innerHTML=`
    <div class="session-header">
      <div><div class="s-eyebrow">${d.sub}</div><div class="s-title">${d.label} <span class="outline">DAY</span></div></div>
      <div class="s-meta">
        <div><div class="s-stat-val" id="s-done">${doneCount}/${d.exercises.length}</div><div class="s-stat-label">Done</div></div>
        <div><div class="s-stat-val" id="s-pct">${pct}%</div><div class="s-stat-label">Complete</div></div>
      </div>
    </div>
    <div class="prog-wrap">
      <div class="prog-top"><span class="prog-label">Session Progress</span><span class="prog-pct" id="prog-pct">${pct}%</span></div>
      <div class="prog-track"><div class="prog-fill" id="prog-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="ex-grid" id="ex-grid">${cards}</div>
    <button class="add-ex-btn" onclick="addExercise('${day}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add Exercise
    </button>`;
}

function updateField(day,i,field,val){if(!val)return;plan[day].exercises[i][field]=val;saveJSON(PLAN_KEY,plan)}

function addExercise(day){
  plan[day].exercises.push({name:"New Exercise",note:"",sets:"3",reps:"10"});
  saveJSON(PLAN_KEY,plan);renderSession(day);updateAll();
  setTimeout(()=>{const g=document.getElementById('ex-grid');g&&g.lastElementChild?.scrollIntoView({behavior:'smooth',block:'nearest'})},100);
}

function deleteExercise(day,i){
  if(plan[day].exercises.length<=1){alert('Need at least 1 exercise.');return}
  plan[day].exercises.splice(i,1);
  const newDone={};
  Object.keys(done).forEach(k=>{if(!k.startsWith(day+'_'))newDone[k]=done[k]});
  plan[day].exercises.forEach((_,idx)=>{const ok=`${day}_${idx>=i?idx+1:idx}`;if(done[ok])newDone[gk(day,idx)]=true});
  done=newDone;saveJSON(PLAN_KEY,plan);saveJSON(DONE_KEY,done);
  renderSession(day);updateAll();
}

function toggleDone(day,i){
  const key=gk(day,i);done[key]=!done[key];saveJSON(DONE_KEY,done);
  const isDone=done[key];
  const btn=document.getElementById(`btn_${day}_${i}`);
  const card=document.getElementById(`card_${day}_${i}`);
  if(btn){btn.classList.toggle('done',isDone);btn.textContent=isDone?'✓':'';btn.classList.add('pop');setTimeout(()=>btn.classList.remove('pop'),350)}
  if(card)card.classList.toggle('done-card',isDone);
  updateProgress(day);updateWeekStrip();updateOverview();updateTotals();saveMonthSnapshot();
}

function updateProgress(day){
  const d=plan[day];
  const dc=d.exercises.filter((_,i)=>done[gk(day,i)]).length;
  const pct=d.exercises.length?Math.round(dc/d.exercises.length*100):0;
  const pf=document.getElementById('prog-fill');const pp=document.getElementById('prog-pct');
  const sd=document.getElementById('s-done');const sp=document.getElementById('s-pct');
  if(pf)pf.style.width=pct+'%';if(pp)pp.textContent=pct+'%';
  if(sd)sd.textContent=`${dc}/${d.exercises.length}`;if(sp)sp.textContent=pct+'%';
}

function switchDay(day){
  activeDay=day;
  renderWeekStrip();
  renderSession(day);
  document.getElementById('session-panel').scrollIntoView({behavior:'smooth',block:'start'});
}

function updateWeekStrip(){renderWeekStrip()}

function updateOverview(){renderMonthChart()}

/* ── MONTHLY CHART ── */
const MONTH_KEY='ppl_month_v1';

function getTodayStr(){
  const d=new Date();
  return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function saveMonthSnapshot(){
  // Called after every toggle — saves today's completion % to monthly log
  let log=loadJSON(MONTH_KEY)||{};
  let totalEx=0,totalDone=0;
  DAYS.forEach(day=>{
    const d=plan[day];
    totalEx+=d.exercises.length;
    totalDone+=d.exercises.filter((_,i)=>done[gk(day,i)]).length;
  });
  const pct=totalEx?Math.round(totalDone/totalEx*100):0;
  log[getTodayStr()]=pct;
  saveJSON(MONTH_KEY,log);
}

function renderMonthChart(){
  const now=new Date();
  const year=now.getFullYear();
  const month=now.getMonth();
  const today=now.getDate();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const log=loadJSON(MONTH_KEY)||{};

  document.getElementById('chart-month-label').textContent=`${monthNames[month]} ${year}`;

  // Build bars
  let completedDays=0,totalPct=0,streakCur=0,streakMax=0,streak=0;
  const bars=[];
  for(let d=1;d<=31;d++){
    const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isFuture=d>today;
    const isToday=d===today;
    const isPast=d<today;
    const isValid=d<=daysInMonth;
    const pct=log[dateStr]??null;
    const displayPct=isToday?(()=>{
      // live calc for today
      let te=0,td=0;
      DAYS.forEach(day=>{const dv=plan[day];te+=dv.exercises.length;td+=dv.exercises.filter((_,i)=>done[gk(day,i)]).length});
      return te?Math.round(td/te*100):0;
    })():pct;

    let heightPct=0,barClass='future',tipText='';
    if(!isValid){
      bars.push(`<div class="bar-col"></div>`);continue;
    }
    if(isFuture){
      heightPct=0;barClass='future';tipText='Future';
    } else if(isToday){
      heightPct=displayPct??0;
      barClass=heightPct===100?'':'today';
      tipText=`Today · ${heightPct}%`;
      if(heightPct>0){totalPct+=heightPct;completedDays++;}
    } else {
      // past
      const p=displayPct??0;
      heightPct=p;
      if(p===0){barClass='zero';tipText=`${monthNames[month].slice(0,3)} ${d} · Rest/Missed`;}
      else{barClass='';tipText=`${monthNames[month].slice(0,3)} ${d} · ${p}%`;totalPct+=p;completedDays++;}
      // streak
      if(p>0){streak++;streakMax=Math.max(streakMax,streak);}
      else{streak=0;}
    }
    const opacity=barClass===''&&heightPct>0&&heightPct<100?0.55:1;
    const todayLbl=isToday?' today-lbl':'';
    bars.push(`
      <div class="bar-col">
        <div class="bar-tooltip">${tipText}</div>
        <div class="bar-fill ${barClass}" style="height:${Math.max(heightPct,barClass==='future'?0:2)}%;opacity:${opacity}"></div>
        <div class="bar-label${todayLbl}">${d%5===0||d===1||isToday?d:''}</div>
      </div>`);
  }
  document.getElementById('chart-bars').innerHTML=bars.join('');

  // current streak (from today backward)
  streakCur=0;
  for(let d=today;d>=1;d--){
    const ds=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const p=log[ds]??(d===today?(()=>{let te=0,td=0;DAYS.forEach(day=>{const dv=plan[day];te+=dv.exercises.length;td+=dv.exercises.filter((_,i)=>done[gk(day,i)]).length});return te?Math.round(td/te*100):0;})():null);
    if(p&&p>0)streakCur++;else break;
  }

  const avg=completedDays?Math.round(totalPct/completedDays):0;
  document.getElementById('chart-summary').innerHTML=`
    <div class="cs-card"><div class="cs-val">${completedDays}</div><div class="cs-label">Days Trained</div></div>
    <div class="cs-card"><div class="cs-val">${avg}%</div><div class="cs-label">Avg Completion</div></div>
    <div class="cs-card"><div class="cs-val">${streakCur}</div><div class="cs-label">Current Streak</div></div>
    <div class="cs-card"><div class="cs-val">${streakMax}</div><div class="cs-label">Best Streak</div></div>
  `;
}

function updateTotals(){
  let totalEx=0,totalDone=0;
  DAYS.forEach(day=>{const d=plan[day];totalEx+=d.exercises.length;totalDone+=d.exercises.filter((_,i)=>done[gk(day,i)]).length});
  document.getElementById('total-done').textContent=totalDone;
  document.getElementById('total-ex').textContent=totalEx;
}

function updateAll(){updateWeekStrip();updateOverview();updateTotals()}

function resetWeek(){
  if(!confirm('Reset all completed exercises for this week?'))return;
  done={};saveJSON(DONE_KEY,done);renderSession(activeDay);updateAll();
}

/* ── CALCULATOR TOGGLE ── */
function toggleCalc(){
  document.getElementById('calc').classList.toggle('open');
  if(document.getElementById('calc').classList.contains('open')) syncProfileToCalc();
}

/* ── DARK MODE ── */
function initTheme(){
  const saved=localStorage.getItem(THEME_KEY)||'light';
  document.documentElement.setAttribute('data-theme',saved);
}
document.getElementById('dm-toggle').addEventListener('click',()=>{
  const cur=document.documentElement.getAttribute('data-theme');
  const next=cur==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  localStorage.setItem(THEME_KEY,next);
});

/* ── PROGRESS PHOTO ── */
const PHOTO_KEY='ppl_hero_photo_v1';

function loadProgressPhoto(){
  try{
    const saved=JSON.parse(localStorage.getItem(PHOTO_KEY)||'null');
    if(saved){applyProgressPhoto(saved.src,saved.date)}
  }catch(e){}
}

function handleProgressPhoto(e){
  const file=e.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const src=ev.target.result;
    const date=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
    applyProgressPhoto(src,date);
    try{localStorage.setItem(PHOTO_KEY,JSON.stringify({src,date}))}
    catch(e){console.warn('Image too large for localStorage — try a smaller file.')}
  };
  reader.readAsDataURL(file);
}

function applyProgressPhoto(src,date){
  const zone=document.getElementById('upload-zone');
  const preview=document.getElementById('upload-preview');
  const dateEl=document.getElementById('upload-date');
  if(!zone||!preview)return;
  preview.src=src;
  dateEl.textContent=date;
  zone.classList.add('has-img');
}

function deleteProgressPhoto(){
  const zone=document.getElementById('upload-zone');
  const preview=document.getElementById('upload-preview');
  const dateEl=document.getElementById('upload-date');
  if(!zone||!preview)return;
  preview.src='';
  dateEl.textContent='';
  zone.classList.remove('has-img');
  localStorage.removeItem(PHOTO_KEY);
}

/* ── PROFILE INFO ── */
const PROFILE_KEY='ppl_profile_v1';

function saveProfileInfo(){
  const age=document.getElementById('info-age').value;
  const weight=document.getElementById('info-weight').value;
  const height=document.getElementById('info-height').value;
  localStorage.setItem(PROFILE_KEY,JSON.stringify({age,weight,height}));
  // Sync to caloric calculator
  syncProfileToCalc();
}

function syncProfileToCalc(){
  try{
    const p=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');
    if(!p)return;
    const ca=document.getElementById('c-age');
    const cw=document.getElementById('c-weight');
    const ch=document.getElementById('c-height');
    if(ca&&p.age&&!ca.value)ca.value=p.age;
    if(cw&&p.weight&&!cw.value)cw.value=p.weight;
    if(ch&&p.height&&!ch.value)ch.value=p.height;
    // Always update if profile has values (allow override)
    if(ca&&p.age)ca.value=p.age;
    if(cw&&p.weight)cw.value=p.weight;
    if(ch&&p.height)ch.value=p.height;
  }catch(e){}
}

function loadProfileInfo(){
  try{
    const p=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');
    if(!p)return;
    if(p.age)document.getElementById('info-age').value=p.age;
    if(p.weight)document.getElementById('info-weight').value=p.weight;
    if(p.height)document.getElementById('info-height').value=p.height;
    syncProfileToCalc();
  }catch(e){}
}

/* ── SHARE MODAL ── */
function openShareModal(){
  document.getElementById('share-link-box').style.display='none';
  document.getElementById('generate-link-btn').style.display='flex';
  document.getElementById('share-modal').classList.add('open');
}
function closeShareModal(){ document.getElementById('share-modal').classList.remove('open') }
document.getElementById('share-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeShareModal()});

function generateShareLink(){
  const btn=document.getElementById('generate-link-btn');
  btn.textContent='Generating...';

  // Collect all data
  const profile=loadJSON(PROFILE_KEY)||{};
  const photo=localStorage.getItem(PHOTO_KEY)||null;
  const monthLog=loadJSON(MONTH_KEY)||{};

  const payload={
    v:1,
    split:activeSplit,
    plan:plan,
    profile:profile,
    photo:photo,
    monthLog:monthLog,
    date:new Date().toISOString()
  };

  try{
    const json=JSON.stringify(payload);
    const b64=btoa(unescape(encodeURIComponent(json)));

    // Build the data URL — self-contained viewer HTML
    const viewerHtml=buildViewerHTML(b64);
    const blob=new Blob([viewerHtml],{type:'text/html'});
    const url=URL.createObjectURL(blob);

    // Show link
    document.getElementById('share-link-input').value=url;
    document.getElementById('share-link-box').style.display='block';
    btn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Link Ready — Copy It Above';
    btn.style.background='#2a7a2a';
  }catch(e){
    btn.textContent='Error — try removing the photo first';
    btn.style.background='#c0392b';
  }
}

function copyShareLink(){
  const input=document.getElementById('share-link-input');
  input.select();
  navigator.clipboard.writeText(input.value).then(()=>{
    const b=document.getElementById('share-copy-link-btn');
    b.textContent='Copied!';
    setTimeout(()=>b.textContent='Copy Link',2000);
  });
}

function buildViewerHTML(b64){
  return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>T-O — Shared Plan</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Montserrat',sans-serif;background:#0d0d0d;color:#f0f0f0;min-height:100vh}
nav{display:flex;justify-content:space-between;align-items:center;padding:18px 40px;border-bottom:1px solid #2a2a2a}
.logo{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:3px;color:#fff}.logo span{color:#e85d26}
.load-btn{background:#e85d26;color:#fff;border:none;padding:10px 20px;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:2px;cursor:pointer;border-radius:2px}
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:60vh;border-bottom:1px solid #2a2a2a}
.hero-left{padding:60px 40px;display:flex;flex-direction:column;justify-content:center}
.eyebrow{font-size:10px;letter-spacing:5px;text-transform:uppercase;color:#e85d26;font-weight:600;margin-bottom:16px}
.big-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(60px,10vw,110px);line-height:.9;letter-spacing:2px}
.stroke{-webkit-text-stroke:2px #fff;color:transparent;display:block}
.stats{margin-top:32px;display:flex;flex-direction:column;gap:0}
.stat-row{display:flex;align-items:baseline;justify-content:space-between;padding:14px 0;border-bottom:1px solid #2a2a2a}
.stat-row:first-child{border-top:1px solid #2a2a2a}
.stat-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#666;font-weight:600}
.stat-val{font-family:'Bebas Neue',sans-serif;font-size:32px;color:#fff}
.stat-unit{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#555;margin-left:6px}
.hero-right{border-left:1px solid #2a2a2a;position:relative;display:flex;align-items:center;justify-content:center;background:#111;min-height:400px}
.hero-right img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
.no-photo{color:#333;font-size:11px;letter-spacing:3px;text-transform:uppercase}
.section{padding:50px 40px;border-bottom:1px solid #2a2a2a}
.s-eyebrow{font-size:10px;letter-spacing:5px;text-transform:uppercase;color:#e85d26;font-weight:500;margin-bottom:6px}
.s-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(36px,6vw,64px);line-height:1;letter-spacing:2px;margin-bottom:32px}
.s-title span{-webkit-text-stroke:1.5px #fff;color:transparent}
.week-grid{display:grid;grid-template-columns:repeat(7,1fr);border:1px solid #2a2a2a;margin-bottom:32px}
.week-cell{padding:20px 12px;border-right:1px solid #2a2a2a;text-align:center}
.week-cell:last-child{border-right:none}
.wc-day{font-size:8px;letter-spacing:3px;text-transform:uppercase;color:#555;margin-bottom:4px}
.wc-type{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;color:#e85d26}
.ex-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.ex-card{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:2px;padding:20px}
.ex-num{font-size:10px;letter-spacing:3px;color:#e85d26;font-family:'Bebas Neue',sans-serif;margin-bottom:6px}
.ex-name{font-size:14px;font-weight:700;margin-bottom:12px}
.ex-sets{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px}
.day-tabs{display:flex;gap:0;border-bottom:1px solid #2a2a2a;margin-bottom:28px;overflow-x:auto}
.day-btn{padding:12px 20px;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:600;color:#666;cursor:pointer;border-bottom:2px solid transparent;background:none;border-top:none;border-left:none;border-right:none;font-family:'Montserrat',sans-serif;white-space:nowrap;transition:color .2s,border-color .2s}
.day-btn:hover{color:#fff}
.day-btn.active{color:#e85d26;border-bottom-color:#e85d26}
.plan-badge{display:inline-flex;align-items:center;gap:8px;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:2px;padding:8px 16px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#888;margin-bottom:24px}
.plan-badge span{color:#e85d26;font-weight:700}
footer{padding:32px 40px;display:flex;justify-content:space-between;align-items:center}
.footer-logo{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:3px;color:#333}.footer-logo span{color:#e85d26}
.footer-note{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#444}
@media(max-width:700px){.hero{grid-template-columns:1fr}.hero-right{min-height:260px}.week-grid{grid-template-columns:repeat(4,1fr)}}
</style>
</head>
<body>
<nav>
  <div class="logo">T-O<span>.</span></div>
  <button class="load-btn" onclick="loadPlan()">Load This Plan Into My App</button>
</nav>
<div id="app"></div>
<footer>
  <div class="footer-logo">T-O<span>.</span></div>
  <div class="footer-note">Shared via T-O Training App</div>
</footer>
<script>
const DATA=JSON.parse(decodeURIComponent(escape(atob('${b64}'))));
const DAYS=['mon','tue','wed','thu','fri','sat','sun'];
const dNames=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
let currentDay=DAYS[new Date().getDay()===0?6:new Date().getDay()-1]||'mon';

function render(){
  const p=DATA.profile||{};
  const plan=DATA.plan||{};
  const splitName=DATA.split||'ppl';
  const sharedDate=new Date(DATA.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});

  document.getElementById('app').innerHTML=\`
    <!-- HERO -->
    <div class="hero">
      <div class="hero-left">
        <div class="eyebrow">Shared Training Profile · \${sharedDate}</div>
        <div class="big-title">
          \${splitName.toUpperCase().replace('PPL','PUSH<br><span class=stroke>PULL</span><br>LEG').replace('FULLBODY','FULL<br><span class=stroke>BODY</span>').replace('UPPERLOWER','UPPER<br><span class=stroke>LOWER</span>').replace('BRO','BRO<br><span class=stroke>SPLIT</span>').replace('ARNOLD','ARNOLD<br><span class=stroke>SPLIT</span>')}
        </div>
        \${p.age||p.weight||p.height?\`
        <div class="stats">
          \${p.age?\`<div class="stat-row"><span class="stat-label">Age</span><span><span class="stat-val">\${p.age}</span><span class="stat-unit">yrs</span></span></div>\`:''}
          \${p.weight?\`<div class="stat-row"><span class="stat-label">Weight</span><span><span class="stat-val">\${p.weight}</span><span class="stat-unit">kg</span></span></div>\`:''}
          \${p.height?\`<div class="stat-row"><span class="stat-label">Height</span><span><span class="stat-val">\${p.height}</span><span class="stat-unit">cm</span></span></div>\`:''}
        </div>\`:''}
      </div>
      <div class="hero-right">
        \${DATA.photo?
          \`<img src="\${JSON.parse(DATA.photo).src}" alt="progress">\`
          :\`<div class="no-photo">No Photo Uploaded</div>\`}
      </div>
    </div>

    <!-- PLAN SECTION -->
    <div class="section">
      <div class="s-eyebrow">Training Plan</div>
      <div class="s-title">FULL <span>WEEK</span></div>
      <div class="plan-badge">Plan: <span>\${splitName.toUpperCase()}</span></div>
      <div class="week-grid">
        \${DAYS.map((day,i)=>{
          const d=plan[day];if(!d)return'<div class="week-cell"></div>';
          return\`<div class="week-cell"><div class="wc-day">\${dNames[i]}</div><div class="wc-type">\${d.label}</div></div>\`;
        }).join('')}
      </div>

      <!-- DAY TABS -->
      <div class="day-tabs" id="day-tabs">
        \${DAYS.map((day,i)=>{
          const d=plan[day];if(!d)return'';
          return\`<button class="day-btn\${day===currentDay?' active':''}" onclick="switchDay('\${day}')">\${dNames[i]} · \${d.label}</button>\`;
        }).join('')}
      </div>
      <div id="day-exercises"></div>
    </div>
  \`;
  renderDay(currentDay);
}

function switchDay(day){
  currentDay=day;
  document.querySelectorAll('.day-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.day-btn').forEach(b=>{if(b.textContent.startsWith(dNames[DAYS.indexOf(day)]))b.classList.add('active')});
  renderDay(day);
}

function renderDay(day){
  const d=DATA.plan[day];if(!d){return}
  const el=document.getElementById('day-exercises');
  el.innerHTML=\`
    <div style="margin-bottom:16px">
      <div style="font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#e85d26;font-weight:500;margin-bottom:4px">\${d.sub||''}</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:2px;margin-bottom:20px">\${d.label} DAY</div>
    </div>
    <div class="ex-grid">
      \${d.exercises.map((ex,i)=>\`
        <div class="ex-card">
          <div class="ex-num">EX \${String(i+1).padStart(2,'0')}</div>
          <div class="ex-name">\${ex.name}</div>
          <div class="ex-sets">\${ex.sets} × \${ex.reps}</div>
          \${ex.lastLog?\`<div style="font-size:10px;color:#555;margin-top:8px;border-top:1px solid #222;padding-top:8px">LAST: \${ex.lastLog}</div>\`:''}
        </div>\`).join('')}
    </div>\`;
}

function loadPlan(){
  if(!confirm('Load this plan into your T-O app?\\n\\nThis will replace your current plan and progress.')){return}
  localStorage.setItem('ppl_plan_v4',JSON.stringify(DATA.plan));
  localStorage.setItem('ppl_split_v4',DATA.split);
  if(DATA.profile)localStorage.setItem('ppl_profile_v1',JSON.stringify(DATA.profile));
  if(DATA.photo)localStorage.setItem('ppl_hero_photo_v1',DATA.photo);
  alert('Plan loaded! Open your T-O app (index.html) to see it.');
}

render();
<\/script>
</body>
</html>`;
}

/* ── OLD SHARE FUNCTIONS (kept for compatibility) ── */
function downloadShareImage(){}
function copyShareText(){}

/* ── CURSOR ── */
const cur=document.getElementById('cursor');
document.addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px'});
document.addEventListener('mouseover',e=>{
  const t=e.target.closest('button,.ex-card,.day-tab,.ov-cell,.split-card,a,input,.form-select,.dm-toggle,[contenteditable]');
  cur.classList.toggle('big',!!t);
});

/* ── FOOTER DATE ── */
document.getElementById('footer-date').textContent=new Date().toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

/* ── AUTH GUARD & LOGOUT ── */
function checkAuthGuard(){
  const loggedIn=localStorage.getItem('to_logged_in');
  if(loggedIn!=='true'){
    window.location.href='index.html';
    return false;
  }
  return true;
}

function logoutUser(){
  if(!confirm('Log out of T-O?'))return;
  localStorage.removeItem('to_logged_in');
  localStorage.removeItem('to_active_role');
  window.location.href='index.html';
}

/* ── INIT ── */
checkAuthGuard();
initTheme();
// Restore hero title for saved split (keep T-O logo fixed)
const _s=ALL_PLANS[activeSplit];
const _ht=document.getElementById('hero-title');if(_ht)_ht.innerHTML=_s.heroTitle;

const dayMap={0:'sun',1:'mon',2:'tue',3:'wed',4:'thu',5:'fri',6:'sat'};
activeDay=dayMap[new Date().getDay()];
renderWeekStrip();
renderSession(activeDay);
updateAll();
loadProgressPhoto();
loadProfileInfo();
