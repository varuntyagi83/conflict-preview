import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════
// PALETTE & FONTS
// ════════════════════════════════════════════
const DARK = {
  bg:"#080C14",srf:"#0E1420",pnl:"#131B2B",edg:"#1B2540",edgL:"#283656",
  fire:"#F0544F",flm:"#F5853F",sun:"#E9C53A",leaf:"#30C77B",
  sky:"#4C9CF5",vio:"#9B6DF5",rose:"#E96DA0",aqua:"#34BFC9",sage:"#21AD99",
  tx:"#D8DEE9",tx2:"#8D99AE",tx3:"#5A6882",tx4:"#3D4D66",
};
const LIGHT = {
  bg:"#F4F6F9",srf:"#FFFFFF",pnl:"#EDF0F5",edg:"#D0D7E2",edgL:"#B8C2D0",
  fire:"#D93025",flm:"#E8710A",sun:"#C68A00",leaf:"#1A8F54",
  sky:"#1A73E8",vio:"#7B3FD4",rose:"#C93B76",aqua:"#0D8F96",sage:"#0E7C6B",
  tx:"#1A1D23",tx2:"#4A5568",tx3:"#718096",tx4:"#A0AEC0",
};

function useTheme() {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("cm-theme") || "night"; } catch { return "night"; }
  });
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const handler = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  useEffect(() => {
    try { localStorage.setItem("cm-theme", mode); } catch {}
  }, [mode]);
  const isDark = mode === "night" || (mode === "system" && systemDark);
  return { mode, setMode, isDark, P: isDark ? DARK : LIGHT };
}

function ThemeToggle({ mode, setMode, P }) {
  const opts = [
    { id: "day", icon: "☀", label: "Day" },
    { id: "night", icon: "☾", label: "Night" },
    { id: "system", icon: "◐", label: "System" },
  ];
  return (
    <div style={{ display: "flex", gap: 2, background: `${P.edg}60`, borderRadius: 6, padding: 2 }}>
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => setMode(o.id)}
          style={{
            display: "flex", alignItems: "center", gap: 3,
            padding: "3px 8px", border: "none", borderRadius: 4, cursor: "pointer",
            background: mode === o.id ? P.srf : "transparent",
            color: mode === o.id ? P.tx : P.tx3,
            fontSize: 10, fontWeight: 700, fontFamily: "'IBM Plex Mono','Menlo',monospace",
            boxShadow: mode === o.id ? `0 1px 3px ${P.bg}40` : "none",
            transition: "all .2s",
          }}
        >
          <span style={{ fontSize: 12 }}>{o.icon}</span> {o.label}
        </button>
      ))}
    </div>
  );
}

let P = DARK; // default, overridden at render
const fn="'IBM Plex Mono','Menlo',monospace";
const fs="'DM Sans','Helvetica Neue',sans-serif";

// ════════════════════════════════════════════
// BASELINE STATIC DATA
// ════════════════════════════════════════════
const BASE_IRAN_ARMS = [
  {nm:"Shahab-3",tp:"MRBM",rng:"1,300 km",spd:"Mach 7",st:"DEPLOYED",nt:"Medium-range workhorse"},
  {nm:"Emad",tp:"MRBM",rng:"1,700 km",spd:"Mach 7",st:"DEPLOYED",nt:"Improved guidance, reaches Israel"},
  {nm:"Ghadr-1",tp:"MRBM",rng:"1,950 km",spd:"Mach 7",st:"DEPLOYED",nt:"Extended Shahab variant"},
  {nm:"Kheibar Shekan",tp:"MRBM",rng:"1,450 km",spd:"Mach 8",st:"DEPLOYED",nt:"Solid-fuel, maneuvering RV"},
  {nm:"Sejjil",tp:"MRBM",rng:"2,000 km",spd:"Mach 14",st:"DEPLOYED",nt:"Fastest in Iran's arsenal"},
  {nm:"Fattah-1",tp:"Hypersonic?",rng:"1,400 km",spd:"Mach 15?",st:"CLAIMED",nt:"Hypersonic claim unverified"},
  {nm:"Shahed-136",tp:"OWA Drone",rng:"2,500 km",spd:"185 km/h",st:"MASS USE",nt:"$20K/unit, swarms of 50-100+"},
  {nm:"Khorramshahr",tp:"MRBM",rng:"2,000 km",spd:"Mach 10",st:"DEPLOYED",nt:"Heaviest warhead"},
  {nm:"Anti-Ship Suite",tp:"Coastal",rng:"300 km",spd:"Sub/Supersonic",st:"ACTIVE",nt:"Hormuz defense"},
];
const BASE_US_ARMS = [
  {nm:"GBU-57 MOP",tp:"Bunker Buster",rng:"Gravity",spd:"Terminal",st:"PROVEN",nt:"30,000-lb, 200ft depth, B-2 only"},
  {nm:"GBU-31 JDAM",tp:"Guided Bomb",rng:"28 km",spd:"GPS/INS",st:"MASS USE",nt:"2,000-lb GPS bomb, backbone"},
  {nm:"Tomahawk",tp:"Cruise Missile",rng:"1,600 km",spd:"Mach 0.75",st:"DEPLOYED",nt:"Navy destroyers, Arabian Sea"},
  {nm:"B-2 Spirit",tp:"Stealth Bomber",rng:"11,000 km",spd:"Mach 0.95",st:"ACTIVE",nt:"80x 500lb or 16x 2,000lb JDAMs"},
  {nm:"F-15E Strike Eagle",tp:"Strike Fighter",rng:"3,900 km",spd:"Mach 2.5",st:"MASS USE",nt:"4x GBU-31 + AIM-120"},
  {nm:"F-35I Adir",tp:"Stealth Fighter",rng:"2,200 km",spd:"Mach 1.6",st:"DEPLOYED",nt:"Israeli stealth strike"},
  {nm:"LUCAS Drone",tp:"OWA Drone",rng:"~1,000 km",spd:"~200 km/h",st:"1ST USE",nt:"US Shahed copy, first combat"},
  {nm:"Patriot PAC-3",tp:"Air Defense",rng:"160 km",spd:"Mach 5",st:"ACTIVE",nt:"Hit-to-kill interceptor"},
  {nm:"Arrow-3 + Iron Dome",tp:"Layered ABM",rng:"Exo/70km",spd:"Mach 9/2.2",st:"ACTIVE",nt:"Israeli multi-layer shield"},
];

const BASE_LOCS = [
  {nm:"Tehran",la:35.69,lo:51.39,k:"at",sz:28,nfo:"Leadership House, IRIB, Parliament, IRGC HQ, Mehrabad Airport",ct:"250+"},
  {nm:"Isfahan",la:32.65,lo:51.67,k:"nu",sz:22,nfo:"Nuclear enrichment & missile plants",ct:"85+"},
  {nm:"Fordow",la:34.16,lo:51.59,k:"nu",sz:20,nfo:"Underground enrichment — GBU-57 MOPs",ct:"14 MOPs"},
  {nm:"Natanz",la:33.72,lo:51.73,k:"nu",sz:18,nfo:"Primary enrichment facility",ct:"40+"},
  {nm:"Bushehr",la:28.92,lo:50.82,k:"at",sz:14,nfo:"Naval & military facilities",ct:"40+"},
  {nm:"Tabriz",la:38.08,lo:46.29,k:"at",sz:13,nfo:"Missile Base — tunnels collapsed",ct:"25+"},
  {nm:"Minab",la:27.10,lo:57.09,k:"at",sz:10,nfo:"IRGC base — school hit, 180+ killed",ct:"15+"},
  {nm:"Beirut",la:33.89,lo:35.50,k:"lb",sz:18,nfo:"Dahiyeh — Hezbollah HQ",ct:"80+"},
  {nm:"Tel Aviv",la:32.09,lo:34.78,k:"ir",sz:17,nfo:"40+ buildings hit",ct:"30+"},
  {nm:"Beit Shemesh",la:31.75,lo:34.99,k:"ir",sz:10,nfo:"Direct BM hit — 9 killed",ct:"5+"},
  {nm:"Kuwait City",la:29.38,lo:47.98,k:"ir",sz:14,nfo:"US Embassy hit, closed",ct:"15+"},
  {nm:"Al Udeid",la:25.12,lo:51.32,k:"ir",sz:14,nfo:"US base — 2 BMs, flights grounded",ct:"14 BMs"},
  {nm:"Manama",la:26.23,lo:50.59,k:"ir",sz:12,nfo:"75 missiles + 123 drones intercepted",ct:"20+"},
  {nm:"Erbil",la:36.19,lo:44.01,k:"ir",sz:11,nfo:"Rotana Arjaan Hotel hit by Iran-backed militia drone",ct:"12+"},
  {nm:"Riyadh",la:24.71,lo:46.68,k:"ir",sz:12,nfo:"US Embassy drone hit",ct:"12+"},
  {nm:"Hormuz Strait",la:26.57,lo:56.25,k:"ch",sz:18,nfo:"Iran: open but will target US/Israeli ships — 20% world oil",ct:"CLOSED"},
  {nm:"Doha",la:25.29,lo:51.53,k:"ir",sz:11,nfo:"14 BMs + 4 drones",ct:"14+"},
  {nm:"Dubai",la:25.20,lo:55.27,k:"ir",sz:12,nfo:"Int'l airport hit by drone attacks Saturday. Palm Jumeirah hit earlier",ct:"15+"},
  {nm:"Bandar Abbas",la:27.19,lo:56.27,k:"at",sz:12,nfo:"Naval HQ — 20+ ships sunk",ct:"Major"},
  {nm:"Nakhchivan",la:39.21,lo:45.41,k:"ir",sz:8,nfo:"Azerbaijan struck",ct:"?"},
];
const locClr={at:P.fire,nu:P.sun,ir:P.vio,ch:P.flm,lb:P.rose};
const locLbl={at:"US/Israel Airstrike",nu:"Nuclear Target",ir:"Iranian Retaliation",ch:"Strategic Chokepoint",lb:"Lebanon Front"};

const BASE_SCENARIOS = [
  {nm:"Ceasefires Hold → Deal",p:35,oil:"$75-85",mkt:"Rally continues, ATH territory",end:"Lebanon + Iran ceasefires extended. Hormuz stays open. Peace talks resume",cl:P.leaf},
  {nm:"Partial Deal / Frozen",p:30,oil:"$85-100",mkt:"Grinding uncertainty",end:"Hormuz open but US blockade stays. No nuclear deal. Extended ceasefires",cl:P.sun},
  {nm:"War Resumes",p:25,oil:"$110-150",mkt:"Sharp reversal, recession risk",end:"Lebanon ceasefire expires. Iran re-closes Hormuz. Strikes restart",cl:P.fire},
  {nm:"Full Escalation",p:10,oil:">$150",mkt:"Global recession",end:"Blockade escalation + Houthi + Lebanon collapse. Oil supply crisis",cl:P.vio},
];

const BASE_SPILLS = [
  {r:"Lebanon Ceasefire",lv:"HIGH",p:60,st:"ACTIVE",d:"10-day truce started Apr 16. 2,196 killed, 7,061 wounded, 1M+ displaced. First direct Israel-Lebanon talks in decades. Hezbollah conditional acceptance",cl:P.leaf},
  {r:"Strait of Hormuz",lv:"HIGH",p:50,st:"OPENING",d:"Iran declared 'COMPLETELY OPEN' during Lebanon truce. But US blockade of Iranian ports REMAINS. Maersk/Hapag cautious — risk assessments pending",cl:P.sun},
  {r:"US Naval Blockade",lv:"CRITICAL",p:90,st:"ACTIVE",d:"13 tankers intercepted. Blockade of Iranian ports remains 'in full force' per Trump. Even with Hormuz open",cl:P.fire},
  {r:"Paris Hormuz Summit",lv:"MODERATE",p:40,st:"ACTIVE",d:"49 countries. UK+France leading 'strictly peaceful' naval escort + mine clearance mission. Planning meeting in London next week",cl:P.sky},
  {r:"Iran-US Peace Talks",lv:"CRITICAL",p:70,st:"STALLED",d:"Islamabad talks collapsed Apr 12 after 21 hours. Nuclear issue the sticking point. No next round scheduled",cl:P.fire},
  {r:"Houthis / Yemen",lv:"HIGH",p:75,st:"ACTIVE",d:"In the war. Shipping attacks continue. Bab al-Mandab threatened",cl:P.flm},
  {r:"Iraq Militias",lv:"HIGH",p:80,st:"ACTIVE",d:"85+ PMF killed. US Embassy attacks. Drone strikes continue despite ceasefire",cl:P.flm},
  {r:"Global Economy",lv:"HIGH",p:60,st:"IMPROVING",d:"Oil crashed to $89. S&P 500 NEW ATH at 7,100+. Gas still $4.14. But temporary — Hormuz open only during Lebanon truce",cl:P.sun},
];

const BIASES = [
  {nm:"Confirmation Bias",ds:"Seeking confirming info",lv:"HIGH",fw:"ISA 240 / SOX 302"},
  {nm:"Anchoring Bias",ds:"Over-relying on first data",lv:"HIGH",fw:"ISA 315 / COSO"},
  {nm:"Availability Heuristic",ds:"Overweighting vivid events",lv:"MEDIUM",fw:"Basel III"},
  {nm:"Framing Effect",ds:"Conclusions vary by framing",lv:"HIGH",fw:"SEC Reg S-K"},
  {nm:"Survivorship Bias",ds:"Only counting hits",lv:"MEDIUM",fw:"ISA 520 / GAAS"},
];

const SOURCES = [
  {name:"US Central Command (CENTCOM)",type:"Military",cred:9,bias:"Pro-US",url:"centcom.mil",used:"Strike counts, operational updates, munitions data, BDA",cl:P.sky},
  {name:"Al Jazeera",type:"News Agency",cred:8,bias:"Qatar-aligned, critical of US/Israel",url:"aljazeera.com",used:"Death tolls, Iranian statements, Gulf state impacts, live blogs",cl:P.aqua},
  {name:"CNN",type:"US News",cred:7,bias:"Center-left US",url:"cnn.com",used:"Market data, Pentagon briefings, evacuation updates, war costs",cl:P.fire},
  {name:"NPR",type:"US News",cred:8,bias:"Center-US",url:"npr.org",used:"Oil prices, Hezbollah/Lebanon, defense analysis, ceasefire talks",cl:P.leaf},
  {name:"NBC News",type:"US News",cred:7,bias:"Center-US",url:"nbcnews.com",used:"Araghchi interview, cost estimates ($1B/day), stock reactions",cl:P.sky},
  {name:"BBC",type:"Intl News",cred:9,bias:"UK/Western",url:"bbc.com",used:"Cross-verification of casualty figures, diplomatic reactions",cl:P.aqua},
  {name:"Reuters / AP",type:"Wire Service",cred:9,bias:"Neutral",url:"reuters.com / apnews.com",used:"Breaking events, confirmed kills, leadership succession, verified facts",cl:P.leaf},
  {name:"Bellingcat",type:"OSINT",cred:9,bias:"Western-funded",url:"bellingcat.com",used:"Weapons identification, geolocation, munitions analysis (JDAM, MOP, Shahed)",cl:P.sun},
  {name:"ACLED",type:"Data/Research",cred:9,bias:"Academic",url:"acleddata.com",used:"Strike counts (90+ on Israel), conflict pattern mapping, daily data",cl:P.leaf},
  {name:"CSIS",type:"Think Tank",cred:9,bias:"US establishment",url:"csis.org",used:"War cost analysis ($3.7B/100hrs, $891M/day), munitions expenditure",cl:P.sun},
  {name:"Goldman Sachs",type:"Finance",cred:8,bias:"Market-focused",url:"goldmansachs.com",used:"Oil price forecasting ($78=4wk war), demand destruction thresholds",cl:P.sun},
  {name:"Morgan Stanley",type:"Finance",cred:8,bias:"Market-focused",url:"morganstanley.com",used:"Defense sector analysis, inflation outlook, portfolio strategy",cl:P.sky},
  {name:"Oxford Economics",type:"Research",cred:8,bias:"Academic",url:"oxfordeconomics.com",used:"'Won't last >2 months', GCC/Asia dip-buying advice, growth forecasts",cl:P.leaf},
  {name:"Wikipedia",type:"Aggregator",cred:7,bias:"Crowdsourced",url:"en.wikipedia.org",used:"Timeline compilation, official kill lists, diplomatic chronology",cl:P.tx2},
  {name:"WHO",type:"UN Agency",cred:9,bias:"Neutral/humanitarian",url:"who.int",used:"Health infrastructure damage (13 sites hit), humanitarian impact",cl:P.leaf},
  {name:"UNICEF",type:"UN Agency",cred:9,bias:"Neutral/humanitarian",url:"unicef.org",used:"Child casualties (181+ children killed), school strikes",cl:P.aqua},
  {name:"Iranian Red Crescent / Tasnim",type:"Iranian State-Adjacent",cred:5,bias:"Pro-Iran govt",url:"tasnimnews.com",used:"Iranian death toll (1,332), wounded figures — requires cross-verification",cl:P.fire},
  {name:"IDF / Israeli Military",type:"Military",cred:6,bias:"Pro-Israel",url:"idf.il",used:"Strike numbers (2,500), air defense claims (80% destroyed), ops updates",cl:P.vio},
  {name:"Penn Wharton Budget Model",type:"Academic",cred:9,bias:"Non-partisan",url:"budgetmodel.wharton.upenn.edu",used:"Long-term war cost projection ($40-95B for 2-month war)",cl:P.sun},
  {name:"Brown Univ Costs of War",type:"Academic",cred:9,bias:"Anti-war lean",url:"costsofwar.watson.brown.edu",used:"Total US spending since Oct 7 ($33.7B), historical cost comparisons",cl:P.sage},
  {name:"Kpler",type:"Commodity Intel",cred:8,bias:"Market-focused",url:"kpler.com",used:"Hormuz shipping data, de facto closure analysis, oil flow tracking",cl:P.flm},
  {name:"House of Commons Library",type:"Government",cred:9,bias:"UK/Western",url:"commonslibrary.parliament.uk",used:"UK policy response, ceasefire positions, legal analysis",cl:P.sky},
];

// ════════════════════════════════════════════
// LIVE DATA FETCHING VIA CLAUDE API + WEB SEARCH

// ════════════════════════════════════════════
// REUSABLE COMPONENTS
// ════════════════════════════════════════════
function Blink({color=P.fire,size=8}) {
  const [on,setOn]=useState(true);
  useEffect(()=>{const t=setInterval(()=>setOn(v=>!v),950);return()=>clearInterval(t)},[]);
  return (<span style={{width:size,height:size,borderRadius:"50%",background:color,display:"inline-block",opacity:on?1:.2,transition:"opacity .95s",boxShadow:on?`0 0 ${size+4}px ${color}`:"none"}} />);
}

function Clk() {
  const [now,setNow]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const short = tz.split("/").pop().replace(/_/g," ");
  return (<span style={{fontFamily:fn,fontSize:11,color:P.tx2}}>{now.toLocaleString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false})} <span style={{color:P.tx3}}>({short})</span></span>);
}

function Ticker({items}) {
  const [x,setX]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setX(v=>v-1),28);return()=>clearInterval(t)},[]);
  const str=items.join("   ·   ");
  return (
    <div style={{overflow:"hidden",whiteSpace:"nowrap",background:"linear-gradient(90deg,#1A0A0A,#140E18,#1A0A0A)",borderTop:`1px solid ${P.fire}18`,borderBottom:`1px solid ${P.fire}18`,padding:"7px 0",position:"relative"}}>
      <span style={{position:"absolute",left:10,top:5,background:P.fire,color:"#fff",fontSize:11,fontWeight:800,padding:"2px 7px",borderRadius:3,letterSpacing:2,zIndex:2}}>LIVE</span>
      <div style={{paddingLeft:60,transform:`translateX(${x%(str.length*6.8)}px)`,fontSize:11,color:P.tx,fontFamily:fn}}>{str+"   ·   "+str}</div>
    </div>
  );
}

function HBar({val,max=100,color,h=5}) {
  return (<div style={{background:"#1A2236",borderRadius:h,height:h,flex:1}}><div style={{width:`${Math.min((val/max)*100,100)}%`,height:"100%",background:`linear-gradient(90deg,${color},${color}AA)`,borderRadius:h}}/></div>);
}

function KPI({label,value,accent,sub,trend,trendBad}) {
  const arrow = trend === "up" ? "▲" : trend === "down" ? "▼" : null;
  const arrowColor = trendBad ? P.fire : P.leaf;
  return (
    <div className="cm-kpi" style={{background:P.srf,border:`1px solid ${accent||P.edg}35`,borderRadius:10,padding:"10px 13px",flex:"1 1 120px",minWidth:120}}>
      <div className="cm-kpi-label" style={{fontSize:11,color:accent||P.tx3,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,fontFamily:fn}}>{label}</div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
        <span className="cm-kpi-val" style={{fontSize:23,fontWeight:800,color:P.tx,fontFamily:fn}}>{value}</span>
        {arrow && <span style={{fontSize:14,color:arrowColor,fontWeight:800,lineHeight:1}}>{arrow}</span>}
      </div>
      {sub&&<div className="cm-kpi-sub" style={{fontSize:11,color:P.tx3,marginTop:2}}>{sub}</div>}
    </div>
  );
}

function Tag({text,color}) {
  return (<span style={{background:`${color}18`,color,padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700,fontFamily:fn,letterSpacing:.5}}>{text}</span>);
}

function BarChart({data,maxVal,title}) {
  const mx = maxVal || Math.max(...data.map(d=>d.val));
  return (
    <div style={{border:`1px solid ${P.edg}`,borderRadius:10,padding:"12px 16px",background:P.srf,marginTop:12}}>
      {title && <div style={{fontSize:10,color:P.tx3,fontWeight:700,letterSpacing:1.5,fontFamily:fn,marginBottom:10}}>{title}</div>}
      {data.map((d,i)=>{
        const pct = Math.min((d.val/mx)*100,100);
        const isShort = pct < 15;
        return (
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{fontSize:10,color:P.tx2,width:85,textAlign:"right",fontFamily:fn,flexShrink:0}}>{d.label}</span>
            <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}>
              <div style={{flex:1,background:"#1A2236",borderRadius:5,height:20,position:"relative",overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${d.color},${d.color}88)`,borderRadius:5,transition:"width 0.8s ease"}} />
                {!isShort && <span style={{position:"absolute",right:8,top:2,fontSize:10,color:P.tx,fontFamily:fn,fontWeight:600}}>{d.display||d.val}</span>}
              </div>
              {isShort && <span style={{fontSize:10,color:d.color,fontFamily:fn,fontWeight:600,flexShrink:0}}>{d.display||d.val}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniBarGroup({data,title,height=140}) {
  const mx = Math.max(...data.map(d=>d.val));
  return (
    <div style={{border:`1px solid ${P.edg}`,borderRadius:10,padding:"12px 16px",background:P.srf,marginTop:12}}>
      {title && <div style={{fontSize:10,color:P.tx3,fontWeight:700,letterSpacing:1.5,fontFamily:fn,marginBottom:24}}>{title}</div>}
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-around",height,gap:6,paddingBottom:28,paddingTop:18,position:"relative"}}>
        {data.map((d,i)=>(
          <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
            <span style={{fontSize:10,color:d.color,fontWeight:700,fontFamily:fn,marginBottom:6}}>{d.display||d.val}</span>
            <div style={{width:"100%",maxWidth:44,height:`${Math.max((d.val/mx)*(height-46)*0.7,6)}px`,background:`linear-gradient(180deg,${d.color},${d.color}55)`,borderRadius:"5px 5px 0 0",transition:"height 0.6s ease"}} />
            <span style={{fontSize:9,color:P.tx3,fontFamily:fn,marginTop:5,textAlign:"center",lineHeight:1.2}}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CandlestickChart({data, title, width=720, height=260}) {
  // data = [{label, open, high, low, close}]
  const allVals = data.flatMap(d => [d.high, d.low]);
  const maxP = Math.max(...allVals);
  const minP = Math.min(...allVals);
  const range = maxP - minP || 1;
  const pad = range * 0.18;
  const yMin = minP - pad;
  const yMax = maxP + pad;
  const yRange = yMax - yMin;
  const topPad = 40;
  const botPad = 35;
  const toY = (v) => height - botPad - ((v - yMin) / yRange) * (height - topPad - botPad);
  const candleW = Math.min(Math.floor((width - 100) / data.length) - 8, 30);
  const gap = (width - 80) / data.length;

  const gridLines = [];
  const step = Math.ceil(range / 4);
  for (let p = Math.floor(minP); p <= Math.ceil(maxP) + step; p += step) {
    if (p >= yMin && p <= yMax) gridLines.push(p);
  }

  return (
    <div style={{border:`1px solid ${P.edg}`, borderRadius:10, padding:"14px 16px", background:P.srf, marginTop:12}}>
      {title && <div style={{fontSize:10, color:P.tx3, fontWeight:700, letterSpacing:1.5, fontFamily:fn, marginBottom:8}}>{title}</div>}
      <svg viewBox={`0 0 ${width} ${height}`} style={{width:"100%", height:"auto", display:"block"}}>
        {gridLines.map((p, i) => {
          const y = toY(p);
          return (
            <g key={i}>
              <line x1={55} y1={y} x2={width - 15} y2={y} stroke={P.edg} strokeWidth={0.5} strokeDasharray="3,3" opacity={0.5} />
              <text x={50} y={y + 4} textAnchor="end" fill={P.tx3} fontSize={9} fontFamily="monospace">${p}</text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const x = 70 + i * gap + gap / 2;
          const isUp = d.close >= d.open;
          const color = isUp ? P.leaf : P.fire;
          const bodyTop = toY(Math.max(d.open, d.close));
          const bodyBot = toY(Math.min(d.open, d.close));
          const bodyH = Math.max(bodyBot - bodyTop, 3);
          const wickTop = toY(d.high);
          const wickBot = toY(d.low);

          return (
            <g key={i}>
              <line x1={x} y1={wickTop} x2={x} y2={wickBot} stroke={color} strokeWidth={1.5} opacity={0.7} />
              <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH} rx={2}
                fill={color} opacity={0.85} stroke={color} strokeWidth={0.5} />
              <text x={x} y={wickTop - 8} textAnchor="middle" fill={color} fontSize={8} fontWeight={700} fontFamily="monospace">
                ${d.close}
              </text>
              <text x={x} y={height - 12} textAnchor="middle" fill={P.tx3} fontSize={8} fontFamily="monospace">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function StockCandles({data, title, width=740, height=220}) {
  const allVals = data.flatMap(d => [d.high, d.low]);
  const maxV = Math.max(...allVals.map(Math.abs));
  const leftMargin = 70;
  const rightMargin = 70;
  const center = leftMargin + (width - leftMargin - rightMargin) / 2;
  const scale = ((width - leftMargin - rightMargin) / 2) / (maxV || 1);
  const rowH = Math.min(20, (height - 30) / data.length);

  return (
    <div style={{border:`1px solid ${P.edg}`, borderRadius:10, padding:"14px 16px", background:P.srf, marginTop:12}}>
      {title && <div style={{fontSize:10, color:P.tx3, fontWeight:700, letterSpacing:1.5, fontFamily:fn, marginBottom:8}}>{title}</div>}
      <svg viewBox={`0 0 ${width} ${height}`} style={{width:"100%", height:"auto", display:"block"}}>
        <line x1={center} y1={8} x2={center} y2={height - 8} stroke={P.tx4} strokeWidth={1} strokeDasharray="2,2" opacity={0.5} />
        <text x={center} y={8} textAnchor="middle" fill={P.tx3} fontSize={7} fontFamily="monospace">0%</text>

        {data.map((d, i) => {
          const y = 18 + i * ((height - 28) / data.length);
          const barH = Math.max(rowH - 6, 10);
          const isUp = d.close > 0;
          const bodyL = Math.min(d.open, d.close);
          const bodyR = Math.max(d.open, d.close);
          const color = isUp ? P.leaf : P.fire;

          return (
            <g key={i}>
              <line
                x1={center + d.low * scale} y1={y + barH / 2}
                x2={center + d.high * scale} y2={y + barH / 2}
                stroke={color} strokeWidth={1.5} opacity={0.6} />
              <rect
                x={center + Math.min(bodyL, bodyR) * scale} y={y}
                width={Math.max(Math.abs(bodyR - bodyL) * scale, 4)} height={barH}
                rx={2} fill={color} opacity={0.8} />
              <text x={leftMargin - 8} y={y + barH / 2 + 4} textAnchor="end" fill={color} fontSize={10} fontWeight={700} fontFamily="monospace">{d.sym}</text>
              <text
                x={isUp ? Math.min(center + d.high * scale + 8, width - rightMargin + 20) : Math.max(center + d.low * scale - 8, leftMargin - 30)}
                y={y + barH / 2 + 4}
                textAnchor={isUp ? "start" : "end"}
                fill={color} fontSize={9} fontWeight={600} fontFamily="monospace">
                {isUp ? "+" : ""}{d.close}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


// ════════════════════════════════════════════
// TAB: OVERVIEW
// ════════════════════════════════════════════
function OverviewTab() {
  const day = (()=>{const now=new Date();const start=new Date(2026,1,28);now.setHours(0,0,0,0);start.setHours(0,0,0,0);return Math.round((now-start)/864e5)+1})();
  return (
    <div>
      <div className="cm-kpi-row" style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        <KPI label="War Day" value={day} accent={P.flm} sub="Since Feb 28. HORMUZ OPEN. Lebanon ceasefire"/>
        <KPI label="Iran Killed" value="9,226" accent={P.fire} sub="6,174 military + 3,052 civilian. 26,500+ injured" trend="up" trendBad/>
        <KPI label="Israel" value="40 killed" accent={P.vio} sub="27 civilians. 7,453 injured"/>
        <KPI label="US Military" value="13 KIA" accent={P.sky} sub="303 wounded. 1 health death in Kuwait"/>
        <KPI label="Lebanon" value="2,196" accent={P.rose} sub="7,061 wounded. 1M+ displaced. 10-day ceasefire started" trend="up" trendBad/>
        <KPI label="Gulf States" value="28+ killed" accent={P.sun} sub="Saudi capacity -600K bpd. 13 tankers intercepted by USN" trend="up" trendBad/>
      </div>
      <div className="cm-kpi-row" style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        <KPI label="Brent Oil" value="~$89" accent={P.leaf} sub="Crashed 12% on Hormuz opening. Was $103 yesterday" trend="down"/>
        <KPI label="WTI Crude" value="~$83" accent={P.leaf} sub="Erasing nearly all war gains" trend="down"/>
        <KPI label="S&P 500" value="7,100+" accent={P.leaf} sub="NEW ALL-TIME HIGH. +1.3% today" trend="up"/>
        <KPI label="Dow Jones" value="+1,005" accent={P.leaf} sub="+2.1% today. Russell 2000 also ATH" trend="up"/>
        <KPI label="Nasdaq" value="+1.5%" accent={P.leaf} sub="Tech rallying on oil relief" trend="up"/>
        <KPI label="US Gas" value="$4.14/gal" accent={P.fire} sub="+39% since war. Should ease if Hormuz stays open" trend="up" trendBad/>
      </div>
      <div className="cm-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[{t:"STATUS (DAY 48)",cl:P.leaf,items:["Iran-US ceasefire holds (expires ~Apr 22)","Israel-Lebanon 10-DAY CEASEFIRE started Apr 16","HORMUZ DECLARED OPEN for commercial vessels","But US BLOCKADE of Iranian ports REMAINS in force","Paris Summit: 49 countries. UK+France naval escort mission","S&P 500 hit ALL-TIME HIGH on Hormuz news"]},
          {t:"KEY RISKS",cl:P.fire,items:["Hormuz open only during Lebanon ceasefire (~10 days)","US blockade on Iranian ports still active","Islamabad talks collapsed Apr 12. No peace deal","Iran military: 6,620 killed (Hengaw). 26,500 wounded","Shipping cos cautious — Maersk: 'risk assessments' needed","Goldman: $100+ Brent all 2026 if Hormuz closes again"]}
        ].map((col,ci)=>(
          <div key={ci} style={{border:`1px solid ${col.cl}20`,borderRadius:10,padding:14,background:P.srf}}>
            <div style={{fontSize:11,color:col.cl,fontWeight:700,letterSpacing:1.2,fontFamily:fn,marginBottom:8}}>{col.t}</div>
            {col.items.map((t,i)=>(<div key={i} style={{fontSize:11,color:P.tx,padding:"2px 0",fontFamily:fn}}>› {t}</div>))}
          </div>
        ))}
      </div>
      <div className="cm-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <BarChart title="CASUALTIES BY REGION (40 DAYS)" data={[
          {label:"Iran",val:3400,color:P.fire,display:"3,400+ (HRANA)"},
          {label:"Lebanon",val:1400,color:P.rose,display:"1,400+"},
          {label:"Iraq",val:109,color:P.flm,display:"109+"},
          {label:"Gulf States",val:28,color:P.sun,display:"28+"},
          {label:"Israel",val:23,color:P.vio,display:"23"},
          {label:"US Military",val:15,color:P.sky,display:"15"},
        ]} maxVal={3500}/>
        <MiniBarGroup title="STRIKE INTENSITY BY PERIOD (EST.)" height={130} data={[
          {label:"Feb 28",val:450,color:P.fire,display:"450+"},
          {label:"Mar 1-2",val:350,color:P.fire,display:"350+"},
          {label:"Mar 3-5",val:240,color:P.flm,display:"240+"},
          {label:"Mar 6-8",val:300,color:P.fire,display:"300+"},
          {label:"Mar 9-12",val:270,color:P.flm,display:"270+"},
          {label:"Mar 13-20",val:200,color:P.sun,display:"200+"},
          {label:"Mar 21-31",val:180,color:P.sun,display:"180+"},
          {label:"Apr 1-7",val:220,color:P.flm,display:"220+"},
          {label:"Apr 8+",val:30,color:P.leaf,display:"CF"},
        ]}/>
      </div>
    </div>
  );
}
// ════════════════════════════════════════════
function WeaponsTab() {
  const [side,setSide]=useState("iran");
  const data=side==="iran"?BASE_IRAN_ARMS:BASE_US_ARMS;
  const stC={DEPLOYED:P.leaf,"MASS USE":P.flm,CLAIMED:P.sun,ACTIVE:P.aqua,PROVEN:P.fire,"1ST USE":P.rose};
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[["iran","🇮🇷  IRAN","~2,500 BMs · 1,000+ drones",P.fire],["us","🇺🇸🇮🇱  COALITION","2,000+ targets · 500+ sorties",P.sky]].map(([k,lb,sub,cl])=>(
          <button key={k} onClick={()=>setSide(k)} style={{flex:1,padding:"10px 13px",background:side===k?`${cl}0F`:P.srf,border:`1px solid ${side===k?cl:P.edg}`,borderRadius:10,cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:11,fontWeight:700,color:side===k?cl:P.tx,fontFamily:fn}}>{lb}</div>
            <div style={{fontSize:11,color:P.tx3,marginTop:2}}>{sub}</div>
          </button>))}
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:`1px solid ${P.edg}`}}>
            {["SYSTEM","TYPE","RANGE","SPEED","STATUS","INTEL"].map(h=>(
              <th key={h} style={{textAlign:"left",padding:"10px 12px",color:P.tx3,fontSize:11,fontWeight:700,letterSpacing:1.2,fontFamily:fn}}>{h}</th>))}
          </tr></thead>
          <tbody>{data.map((w,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${P.edg}18`}}>
              <td style={{padding:"11px 12px",color:side==="iran"?P.sun:P.aqua,fontWeight:700,fontFamily:fn,fontSize:11}}>{w.nm}</td>
              <td style={{padding:"11px 12px",color:P.tx2,fontSize:11}}>{w.tp}</td>
              <td style={{padding:"11px 12px",color:P.tx,fontFamily:fn,fontSize:11}}>{w.rng}</td>
              <td style={{padding:"11px 12px",color:P.tx,fontFamily:fn,fontSize:11}}>{w.spd}</td>
              <td style={{padding:"11px 12px"}}><Tag text={w.st} color={stC[w.st]||P.leaf}/></td>
              <td style={{padding:"11px 12px",color:P.tx2,fontSize:11,maxWidth:240}}>{w.nt}</td>
            </tr>))}</tbody>
        </table>
      </div>
      <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
        {side==="iran"
          ?<><KPI label="Total Arsenal" value="~2,500 BMs" accent={P.fire}/><KPI label="Missiles Fired" value="500+" accent={P.flm}/><KPI label="Drones" value="1,000+" accent={P.rose}/><KPI label="Countries Hit" value="12+" accent={P.sun}/></>
          :<><KPI label="Targets Struck" value="~5,000" accent={P.sky}/><KPI label="Sorties" value="500+" accent={P.aqua}/><KPI label="Ships Sunk" value="30+" accent={P.vio}/><KPI label="Carriers" value="4 CVNs" accent={P.leaf}/></>}
      </div>
      {side==="iran" ? (
        <BarChart title="PROJECTILES FIRED BY TYPE (ESTIMATED)" maxVal={1100} data={[
          {label:"Ballistic Missiles",val:500,color:P.fire,display:"500+"},
          {label:"Drones (Shahed)",val:2000,color:P.rose,display:"2,000+"},
          {label:"Anti-Ship",val:30,color:P.sun,display:"30+"},
          {label:"Cruise Missiles",val:50,color:P.flm,display:"~50"},
        ]}/>
      ) : (
        <BarChart title="MUNITIONS EXPENDED (ESTIMATED)" maxVal={1300} data={[
          {label:"JDAMs / GBUs",val:1200,color:P.sky,display:"1,200+"},
          {label:"Tomahawks",val:200,color:P.aqua,display:"200+"},
          {label:"MOPs (30K-lb)",val:14,color:P.fire,display:"14"},
          {label:"LUCAS Drones",val:50,color:P.vio,display:"~50"},
          {label:"Torpedoes",val:2,color:P.sage,display:"2+"},
        ]}/>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// TAB: STRIKE MAP (SVG with coastlines)
// ════════════════════════════════════════════
function MapTab() {
  const [hov,setHov]=useState(null);
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(v=>v+1),80);return()=>clearInterval(t)},[]);
  const B={mnLa:20,mxLa:42,mnLo:31,mxLo:62};
  const W=880,H=600;
  const px=(la,lo)=>({x:((lo-B.mnLo)/(B.mxLo-B.mnLo))*W,y:((B.mxLa-la)/(B.mxLa-B.mnLa))*H});
  const poly=c=>c.map(([la,lo])=>{const p=px(la,lo);return`${p.x},${p.y}`}).join(" ");

  // Country polygons (approximate but recognizable shapes)
  const countries = [
    {id:"iran",nm:"IRAN",cl:"#1A1520",bdr:"#F0544F30",pts:[[39.8,44.5],[39.4,45.5],[38.8,46],[38.4,47],[37.5,49],[38.2,49.8],[38.8,49],[39.3,48.8],[40,50],[41,50.8],[41.5,52],[41,54],[40.5,55.5],[39,57],[38,57.5],[37,58],[35,59],[33,60],[31,60.5],[29,60],[27.2,60.5],[25.8,59.5],[25.3,58.2],[25.6,57.8],[26.6,57.1],[27,57],[26.5,57],[26.4,56.4],[25.5,55.5],[25.2,55],[24.5,54.4],[24,53.5],[24.4,52.2],[25.2,51.6],[25.3,51.2],[26,50.5],[26.6,50.5],[27.2,50.5],[28.5,49.8],[28.9,49.3],[29.4,48.5],[30,48.2],[30.5,47.5],[31.5,46.5],[33,45.5],[34.5,45.8],[36,45],[36.5,44.5],[37.5,44],[38,44.5],[39.8,44.5]]},
    {id:"iraq",nm:"IRAQ",cl:"#161218",bdr:"#3D4D6640",pts:[[37.5,44],[36.5,44.5],[36,45],[34.5,45.8],[33,45.5],[31.5,46.5],[30.5,47.5],[30,48.2],[29.4,48.5],[29,47.5],[29.5,46],[30,44],[30,43],[30.5,42],[31,41],[32,39.5],[33,39],[33.5,38.5],[34.5,38.8],[35.5,39],[36,40],[36.5,41],[37,42],[37.5,42.5],[37.5,44]]},
    {id:"sa",nm:"SAUDI\nARABIA",cl:"#14111A",bdr:"#3D4D6640",pts:[[32,39.5],[31,41],[30.5,42],[30,43],[30,44],[29.5,46],[29,47.5],[29.4,48.5],[28.5,49.8],[27.2,50.5],[26.6,50.5],[26,50.5],[25.3,51.2],[25.2,51.6],[24.4,52.2],[24,53.5],[23,54],[22,54.5],[21,53],[20.5,51],[20,49],[20,47],[20,45],[20.5,43],[21,41.5],[22,40],[24,38.5],[25,38],[27,36.5],[28,35],[29.5,34.8],[30.5,34.3],[31.6,34.6],[32,36],[32,38],[32,39.5]]},
    {id:"turkey",nm:"TURKEY",cl:"#161420",bdr:"#3D4D6640",pts:[[36.5,32],[37,33],[37.2,35],[37,36.5],[37.2,38],[37,40],[37.3,42],[37.5,42.5],[37.5,44],[38,44.5],[39.8,44.5],[40.5,44],[41.5,43],[42,42],[42,40],[42,38],[42,36],[41,34],[40,33],[38,32],[36.5,32]]},
    {id:"jordan",nm:"JORDAN",cl:"#151220",bdr:"#3D4D6640",pts:[[33,39],[32,39.5],[32,38],[32,36],[31.6,34.6],[30.5,34.3],[29.5,34.8],[30,36],[30.5,37.5],[31.5,39],[32,40],[33,39]]},
    {id:"israel",nm:"IL",cl:"#18152A",bdr:"#9B6DF540",pts:[[33.3,35.5],[32.8,35.2],[32.5,34.9],[31.6,34.6],[31.3,34.5],[30.5,34.3],[29.5,34.8],[29.5,35],[31,35.5],[31.8,35.5],[33.3,35.5]]},
    {id:"leb",nm:"LB",cl:"#1A1528",bdr:"#E96DA040",pts:[[34.7,35.9],[33.9,35.5],[33.3,35.5],[33.5,36.2],[34,36.5],[34.5,36.2],[34.7,35.9]]},
    {id:"kuwait",nm:"KW",cl:"#151220",bdr:"#3D4D6640",pts:[[30,48.2],[29.4,48.5],[29,47.5],[29.5,47.2],[30,47.5],[30,48.2]]},
    {id:"qatar",nm:"QA",cl:"#151220",bdr:"#3D4D6640",pts:[[26.2,51.2],[25.3,51.2],[25.2,51.6],[25.5,51.8],[26,51.7],[26.2,51.2]]},
    {id:"uae",nm:"UAE",cl:"#14111A",bdr:"#3D4D6640",pts:[[24.4,52.2],[24,53.5],[24.5,54.4],[25.2,55],[25.5,55.5],[26.4,56.4],[26,55],[25.5,54],[25,53],[24.4,52.2]]},
    {id:"oman",nm:"OMAN",cl:"#131018",bdr:"#3D4D6640",pts:[[26.4,56.4],[26.5,57],[27,57],[26.6,57.1],[25.6,57.8],[25.3,58.2],[25.8,59.5],[24,60],[23,59.5],[22,59],[21,58],[20.5,57.5],[21,56],[22,55.5],[23,55],[24,54.5],[24.5,54.4],[25.2,55],[25.5,55.5],[26.4,56.4]]},
    {id:"yemen",nm:"YEMEN",cl:"#12101A",bdr:"#3D4D6640",pts:[[20,49],[20,47],[20,45],[20.5,43],[21,41.5],[20,41],[19.5,42],[18.5,42.5],[16,43.5],[13,45],[12.5,45.5],[13,47],[14,48.5],[15,50],[16.5,52],[18,53],[20,53],[20.5,51],[20,49]]},
    {id:"azerb",nm:"AZ",cl:"#151220",bdr:"#3D4D6640",pts:[[39.8,44.5],[40.5,44],[41,45],[41.5,46],[41,47],[40.5,48],[40,50],[39.3,48.8],[38.8,49],[38.2,49.8],[37.5,49],[38.4,47],[38.8,46],[39.4,45.5],[39.8,44.5]]},
  ];

  // Water bodies (filled polygons)
  const waters = [
    {id:"pgulf",nm:"Persian Gulf",pts:[[30,48.2],[29.4,48.5],[28.9,49.3],[28.5,49.8],[27.2,50.5],[26.6,50.5],[26,50.5],[26.2,51.2],[25.3,51.2],[25.2,51.6],[24.4,52.2],[25,53],[25.5,54],[26,55],[26.4,56.4],[26.5,57],[27,57],[27.2,57],[28,56.5],[28.5,55],[28.8,54],[29,53],[29.2,52],[29.5,51],[29.5,50],[30,49.5],[30,48.2]]},
    {id:"oman_g",nm:"Gulf of Oman",pts:[[26.5,57],[26.6,57.1],[25.6,57.8],[25.3,58.2],[24,59],[23,59],[22,58],[21,57.5],[22,56.5],[24,56.5],[25.5,56.8],[26.5,57]]},
    {id:"caspian",nm:"Caspian\nSea",pts:[[37.5,49],[38.2,49.8],[38.8,49],[39.3,48.8],[40,50],[40.5,50.5],[41,50.8],[41.5,52],[42,52],[42,50],[41.5,48.5],[40.5,48],[40,50],[39.3,48.8]]},
  ];

  // Missile arcs
  const missiles=[
    {from:[32.65,51.67],to:[32.09,34.78],color:P.vio,dashed:true},
    {from:[35.69,51.39],to:[25.12,51.32],color:P.vio,dashed:true},
    {from:[33.89,35.50],to:[32.09,34.78],color:P.rose,dashed:true},
    {from:[32.09,34.78],to:[35.69,51.39],color:P.sky,dashed:false},
    {from:[32.09,34.78],to:[32.65,51.67],color:P.sky,dashed:false},
  ];

  const carriers=[
    {la:24.5,lo:58,nm:"CSG Truman"},{la:23,lo:56,nm:"CSG Lincoln"},
    {la:27.5,lo:49,nm:"CSG Reagan"},{la:21.5,lo:58,nm:"CSG Eisenhower"},
    {la:29,lo:34,nm:"CSG Ford"},
  ];

  const vis=BASE_LOCS.filter(l=>l.la>=20&&l.la<=42&&l.lo>=31&&l.lo<=62);

  const arcPath=(from,to)=>{
    const p1=px(from[0],from[1]),p2=px(to[0],to[1]);
    const dx=p2.x-p1.x,dy=p2.y-p1.y;
    const dist=Math.sqrt(dx*dx+dy*dy);
    const mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2-dist*0.3;
    return `M${p1.x},${p1.y} Q${mx},${my} ${p2.x},${p2.y}`;
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontSize:11,color:P.tx3}}>Hover/tap strike zones for intel. Arcs show missile trajectories.</div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <Blink color={P.fire} size={5}/>
          <span style={{fontSize:9,color:P.fire,fontFamily:fn,fontWeight:700}}>LIVE WARZONE</span>
        </div>
      </div>
      <div style={{position:"relative",borderRadius:12,overflow:"hidden",border:`1px solid ${P.fire}20`,boxShadow:`0 0 40px ${P.fire}08`}}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
          <defs>
            <radialGradient id="explode" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F0544F" stopOpacity="0.8"/>
              <stop offset="30%" stopColor="#F5853F" stopOpacity="0.4"/>
              <stop offset="60%" stopColor="#F0544F" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#F0544F" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="nuke" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E9C53A" stopOpacity="0.9"/>
              <stop offset="25%" stopColor="#F5853F" stopOpacity="0.5"/>
              <stop offset="60%" stopColor="#E9C53A" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#E9C53A" stopOpacity="0"/>
            </radialGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Ocean / water background */}
          <rect width={W} height={H} fill="#0B1929"/>

          {/* Water bodies - bright teal/cyan */}
          {waters.map(w=>(<polygon key={w.id} points={poly(w.pts)} fill="#0E2A3D" stroke="#1A4A6A" strokeWidth={0.5} opacity={0.9}/>))}

          {/* Country filled polygons */}
          {countries.map(c=>(<polygon key={c.id} points={poly(c.pts)} fill={c.cl} stroke={c.bdr} strokeWidth={1.2} strokeLinejoin="round"/>))}

          {/* Iran highlight glow */}
          {(()=>{const c=px(32,53);return(<ellipse cx={c.x} cy={c.y} rx={180} ry={160} fill={P.fire} opacity={0.03}/>)})()}

          {/* Water labels */}
          {[{t:"Persian Gulf",la:27.5,lo:52.5,sz:9},{t:"Gulf of Oman",la:24.5,lo:58,sz:8},{t:"Red Sea",la:24,lo:37,sz:8},{t:"Caspian Sea",la:40,lo:50.5,sz:8},{t:"Arabian Sea",la:21,lo:57,sz:8}].map((w,i)=>{const p=px(w.la,w.lo);return(<text key={i} x={p.x} y={p.y} textAnchor="middle" fill="#1A5070" fontSize={w.sz} fontStyle="italic" fontFamily="Georgia,serif" fontWeight={500}>{w.t}</text>)})}

          {/* Country name labels */}
          {[{n:"IRAN",la:32.5,lo:53,sz:16,cl:"#F0544F35"},{n:"IRAQ",la:33,lo:42,sz:11,cl:P.tx4},{n:"SAUDI ARABIA",la:24,lo:44,sz:11,cl:P.tx4},{n:"TURKEY",la:39.5,lo:37,sz:11,cl:P.tx4},{n:"ISRAEL",la:31.5,lo:34.3,sz:8,cl:P.tx4},{n:"JORDAN",la:31,lo:37.5,sz:8,cl:P.tx4},{n:"LEBANON",la:34.2,lo:36.2,sz:7,cl:P.tx4},{n:"KUWAIT",la:29.5,lo:48,sz:7,cl:P.tx4},{n:"QATAR",la:25.5,lo:51.6,sz:6,cl:P.tx4},{n:"UAE",la:24.2,lo:54.5,sz:9,cl:P.tx4},{n:"BAHRAIN",la:26.2,lo:50.2,sz:6,cl:P.tx4},{n:"OMAN",la:22,lo:57.5,sz:9,cl:P.tx4},{n:"YEMEN",la:20.5,lo:46,sz:9,cl:P.tx4},{n:"AZERBAIJAN",la:40.5,lo:47,sz:8,cl:P.tx4}].map((c,i)=>{const p=px(c.la,c.lo);return(<text key={i} x={p.x} y={p.y} textAnchor="middle" fill={c.cl} fontSize={c.sz} fontWeight={700} fontFamily="monospace" letterSpacing={c.n==="IRAN"?5:1.5}>{c.n}</text>)})}

          {/* Hormuz Strait danger zone */}
          {(()=>{const p1=px(26.3,56),p2=px(26.8,56.8);return(
            <g>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={P.fire} strokeWidth={3} opacity={.15+Math.sin(tick*.08)*.1}/>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={P.flm} strokeWidth={2} opacity={.6} strokeDasharray="5,4">
                <animate attributeName="stroke-dashoffset" values="0;18" dur="1.5s" repeatCount="indefinite"/>
              </line>
              <text x={(p1.x+p2.x)/2-40} y={(p1.y+p2.y)/2+16} fill={P.fire} fontSize={8} fontFamily="monospace" fontWeight={800} opacity={.6+Math.sin(tick*.1)*.3}>✕ CLOSED</text>
            </g>
          )})()}

          {/* Missile arcs */}
          {missiles.map((m,i)=>(
            <path key={`m${i}`} d={arcPath(m.from,m.to)} fill="none" stroke={m.color} strokeWidth={1.2} strokeDasharray={m.dashed?"6,4":"3,6"} opacity={.35} filter="url(#glow)">
              <animate attributeName="stroke-dashoffset" values="0;-20" dur={m.dashed?"2s":"3s"} repeatCount="indefinite"/>
            </path>
          ))}

          {/* Carrier groups */}
          {carriers.map((c,i)=>{const p=px(c.la,c.lo);return(
            <g key={`cv${i}`}>
              <circle cx={p.x} cy={p.y} r={8} fill="none" stroke={P.sky} strokeWidth={.6} opacity={.3} strokeDasharray="2,2">
                <animate attributeName="r" values="6;10;6" dur="4s" repeatCount="indefinite"/>
              </circle>
              <text x={p.x} y={p.y+3} textAnchor="middle" fontSize={8} fill={P.sky} opacity={.6}>⚓</text>
              <text x={p.x} y={p.y+13} textAnchor="middle" fontSize={6} fill={P.sky} opacity={.4} fontFamily="monospace">{c.nm}</text>
            </g>
          )})}

          {/* Strike locations with explosion effects */}
          {vis.map((loc,i)=>{const p=px(loc.la,loc.lo);const r=Math.max(loc.sz*.55,6);const col=locClr[loc.k]||P.sky;const isH=hov===i;const isNuke=loc.k==="nu";const isStrike=loc.k==="at";
          const rays=isStrike||isNuke?6:0;
          return(
            <g key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} style={{cursor:"pointer"}}>
              <circle cx={p.x} cy={p.y} r={r*3.5} fill={isNuke?"url(#nuke)":"url(#explode)"} opacity={isStrike||isNuke?.6:.3}/>
              <circle cx={p.x} cy={p.y} r={r*2} fill={col} opacity={isH?.15:.06}>
                <animate attributeName="r" values={`${r*1.8};${r*2.8};${r*1.8}`} dur="2.5s" repeatCount="indefinite"/>
              </circle>
              {Array.from({length:rays}).map((_,j)=>{
                const angle=(j/rays)*Math.PI*2+(tick*.02);
                const len=r*1.5+Math.sin(tick*.05+j)*4;
                return(<line key={j} x1={p.x} y1={p.y} x2={p.x+Math.cos(angle)*len} y2={p.y+Math.sin(angle)*len} stroke={col} strokeWidth={1} opacity={.2+Math.sin(tick*.08+j)*.1}/>);
              })}
              <circle cx={p.x} cy={p.y} r={r*.65} fill={col} opacity={.9} filter="url(#glow)"/>
              <circle cx={p.x} cy={p.y} r={r} fill="none" stroke={col} strokeWidth={isH?2.5:1.2} opacity={isH?.8:.35}>
                <animate attributeName="r" values={`${r};${r+10};${r}`} dur="2.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values={`${isH?.8:.35};0.05;${isH?.8:.35}`} dur="2.8s" repeatCount="indefinite"/>
              </circle>
              {(isStrike||isNuke)&&<circle cx={p.x} cy={p.y} r={r*1.5} fill="none" stroke={col} strokeWidth={.8} opacity={.15}>
                <animate attributeName="r" values={`${r*1.2};${r*2};${r*1.2}`} dur="3.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.15;0;0.15" dur="3.5s" repeatCount="indefinite"/>
              </circle>}
              <text x={p.x} y={p.y-r-9} textAnchor="middle" fill="#D8DEE9" fontSize={isH?12:10} fontWeight={800} fontFamily="monospace" filter={isH?"url(#glow)":"none"}>{loc.nm}</text>
              {isH&&<g>
                <rect x={p.x+r+4} y={p.y-8} width={36} height={16} rx={3} fill={col} opacity={.2}/>
                <text x={p.x+r+22} y={p.y+2} textAnchor="middle" fill={col} fontSize={9} fontWeight={800} fontFamily="monospace">{loc.ct}</text>
              </g>}
            </g>)})}
        </svg>

        {/* Hover tooltip */}
        {hov!==null&&vis[hov]&&(()=>{const loc=vis[hov];const p=px(loc.la,loc.lo);const tx=Math.min(p.x*(100/W)+2,62);const ty=Math.max(p.y*(100/H)-5,2);return(
          <div style={{position:"absolute",left:`${tx}%`,top:`${ty}%`,background:"rgba(6,9,18,.96)",border:`1px solid ${locClr[loc.k]||P.sky}`,borderRadius:10,padding:"10px 14px",maxWidth:250,pointerEvents:"none",zIndex:10,backdropFilter:"blur(8px)",boxShadow:`0 4px 24px ${locClr[loc.k]}40`}}>
            <div style={{fontWeight:800,fontSize:12,color:P.tx,fontFamily:fn}}>{loc.nm}</div>
            <div style={{fontSize:10,color:locClr[loc.k],fontWeight:700,marginTop:2,fontFamily:fn}}>{locLbl[loc.k]}</div>
            <div style={{fontSize:10,color:P.tx2,marginTop:5,lineHeight:1.5}}>{loc.nfo}</div>
            <div style={{fontSize:10,color:P.sun,fontWeight:700,marginTop:6,fontFamily:fn}}>Strikes: {loc.ct}</div>
          </div>)})()}

        {/* Legend */}
        <div style={{position:"absolute",top:12,right:12,background:"rgba(6,9,18,.92)",borderRadius:8,padding:"10px 14px",border:`1px solid ${P.edg}`,backdropFilter:"blur(4px)"}}>
          {Object.entries(locLbl).map(([k,lb])=>(<div key={k} style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,fontSize:10,color:P.tx2}}>
            <span style={{width:10,height:10,borderRadius:"50%",background:locClr[k],display:"inline-block",boxShadow:`0 0 8px ${locClr[k]}60`}}/>{lb}
          </div>))}
          <div style={{borderTop:`1px solid ${P.edg}`,marginTop:4,paddingTop:4}}>
            <div style={{display:"flex",alignItems:"center",gap:7,fontSize:10,color:P.sky}}><span style={{fontSize:9}}>⚓</span> US Carrier Group</div>
            <div style={{display:"flex",alignItems:"center",gap:7,fontSize:10,color:P.vio,marginTop:2}}><span style={{width:14,height:0,borderTop:`1.5px dashed ${P.vio}`,display:"inline-block"}}/> Missile Arc</div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(0deg,rgba(6,9,18,.95),rgba(6,9,18,0))",padding:"20px 14px 10px",display:"flex",justifyContent:"space-around"}}>
          {[{v:"6,000+",l:"Strikes",c:P.fire},{v:"20",l:"Locations",c:P.flm},{v:"5 CSGs",l:"Carrier Groups",c:P.sky},{v:"CLOSED",l:"Hormuz Strait",c:P.fire},{v:"43+",l:"Ships Sunk",c:P.vio}].map((s,i)=>(<div key={i} style={{textAlign:"center"}}>
            <div style={{fontSize:14,fontWeight:800,color:s.c,fontFamily:fn}}>{s.v}</div>
            <div style={{fontSize:8,color:P.tx3,fontFamily:fn,letterSpacing:1}}>{s.l}</div>
          </div>))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// TAB: TIMELINE
// ════════════════════════════════════════════
const BASE_EVTS = [
  {d:"Feb 28",t:"Pre-dawn",e:"US-Israel launch coordinated strikes — Op Epic Fury / Roaring Lion",g:"a",v:5},
  {d:"Feb 28",t:"04:00",e:"100 aircraft hit Leadership House — Khamenei assassinated",g:"a",v:5},
  {d:"Feb 28",t:"10:00",e:"Iran launches True Promise IV — BMs + drones at Israel & Gulf bases",g:"i",v:5},
  {d:"Feb 28",t:"16:00",e:"Minab school strike — ~180 children killed near IRGC base",g:"a",v:5},
  {d:"Mar 1",t:"01:00",e:"Iran confirms Khamenei killed. 40+ officials dead",g:"k",v:5},
  {d:"Mar 2",t:"08:00",e:"Hezbollah launches missiles at Israel — first in over a year",g:"i",v:5},
  {d:"Mar 2",t:"15:00",e:"Iranian BM kills 9 in Beit Shemesh, Israel",g:"i",v:4},
  {d:"Mar 3",t:"10:00",e:"IRGC closes Strait of Hormuz — oil surges 13%",g:"i",v:5},
  {d:"Mar 4",t:"06:00",e:"US sub torpedoes IRIS Dena off Sri Lanka",g:"a",v:5},
  {d:"Mar 4",t:"14:00",e:"NATO intercepts Iranian missile near Turkey — first ever",g:"d",v:4},
  {d:"Mar 5",t:"06:00",e:"Iran death toll 1,045. WHO: 13 health sites hit",g:"k",v:5},
  {d:"Mar 5",t:"14:00",e:"Israel: 'broad-scale wave' on Tehran. Evacuate ALL south Beirut",g:"a",v:4},
  {d:"Mar 5",t:"22:00",e:"Senate + House reject War Powers. Trump: 'no time limits'",g:"k",v:3},
  {d:"Mar 6",t:"02:00",e:"Massive explosions Tehran — residential + university area, Pasteur St (govt area) hit",g:"a",v:4},
  {d:"Mar 6",t:"06:00",e:"Israel strikes 6 Iranian missile launchers overnight, destroys 3 advanced defense systems",g:"a",v:4},
  {d:"Mar 6",t:"08:00",e:"FM Araghchi: 'No reason to negotiate.' Larijani warns: 'waiting for ground invasion'",g:"k",v:4},
  {d:"Mar 6",t:"09:00",e:"IDF chief: 'next phase' of war — 3,000+ strikes with 6,000+ weapons. 80% of Iran air defense destroyed",g:"a",v:5},
  {d:"Mar 6",t:"10:00",e:"Iran hits Bahrain oil refinery with missile. Fire contained. Strikes also on Shiraz — 20 killed",g:"i",v:4},
  {d:"Mar 6",t:"11:00",e:"Brent crude breaks $90/bbl — first time in 2 years. WTI past $84. Hormuz shipping near-total halt",g:"k",v:5},
  {d:"Mar 6",t:"12:00",e:"UNICEF: 181+ children killed in Iran strikes. Tehran school at Niloufar Square hit",g:"k",v:5},
  {d:"Mar 6",t:"13:00",e:"Trump: Mojtaba Khamenei 'unacceptable' as next leader. Wants direct role in choosing successor",g:"k",v:4},
  {d:"Mar 6",t:"14:00",e:"S&P 500 -1.3%, Dow -900 pts. Bitcoin below $70K. Stagflation fears mount on weak jobs + oil surge",g:"k",v:4},
  {d:"Mar 6",t:"15:00",e:"Kurdish-Iranian groups launch ground offensive in NW Iran. Iraqi Kurds on 'standby' per US request",g:"a",v:5},
  {d:"Mar 6",t:"16:00",e:"Iran death toll passes 1,320. Qatar shoots down 2 Iranian Su-24 bombers — first air-to-air kill",g:"d",v:5},
  {d:"Mar 6",t:"17:00",e:"Maersk suspends all Middle East shipping ops. Italy says US-Israel attack 'violated international law'",g:"k",v:4},
  {d:"Mar 6",t:"18:00",e:"Iran launches hybrid drone + missile attack on Tel Aviv. Cluster warheads seen over central Israel",g:"i",v:4},
  {d:"Mar 6",t:"19:00",e:"Russia providing Iran intelligence on US warship/aircraft locations — first confirmed foreign support",g:"k",v:5},
  {d:"Mar 6",t:"20:00",e:"Iran armed forces launch new drone wave targeting US bases in Kuwait. 8 Israeli soldiers wounded by Hezbollah",g:"i",v:4},
  {d:"Mar 6",t:"21:00",e:"Lebanon death toll reaches 123. Israeli strikes pound southern Beirut again. 500K+ displaced",g:"a",v:4},
  {d:"Mar 6",t:"22:00",e:"Penn Wharton: 2-month war could cost $40-95 billion. Pentagon preparing $50B supplemental request",g:"k",v:4},
  {d:"Mar 6",t:"20:00",e:"DAY 7 — 1,332+ killed in Iran. $90 oil. Russia aiding Iran. Dow -949. $3.7B spent in 100 hours",g:"k",v:5},
  {d:"Mar 7",t:"01:00",e:"Trump demands 'UNCONDITIONAL SURRENDER' from Iran. No deal without it",g:"k",v:5},
  {d:"Mar 7",t:"03:00",e:"Iran BM attacks down 90%, drone attacks down 83% per CENTCOM. IRGC launches 23rd wave",g:"d",v:4},
  {d:"Mar 7",t:"05:00",e:"Israel struck 400+ targets in western Iran on Friday alone — missile launchers, defense systems",g:"a",v:5},
  {d:"Mar 7",t:"06:00",e:"Brent crude surges to $92.65 — up 8.49% on the day. Qatar warns $150 oil without quick end",g:"k",v:5},
  {d:"Mar 7",t:"07:00",e:"Hezbollah commander Zaid Ali Jumaa killed in Beirut. Hamas commander killed near Tripoli",g:"a",v:4},
  {d:"Mar 7",t:"08:00",e:"2 more schools hit by missiles southwest of Tehran — Fars News. UNICEF: 181+ children killed",g:"k",v:5},
  {d:"Mar 7",t:"09:00",e:"US jobs report: Non-farm payrolls fell 92,000 in Feb. Stagflation fears intensify",g:"k",v:4},
  {d:"Mar 7",t:"10:00",e:"S&P 500 closes at 6,740 (-1.33%). Dow -949. KOSPI circuit breaker again. Private credit cracks",g:"k",v:4},
  {d:"Mar 7",t:"11:00",e:"Europe drawn in: UK, France, Spain providing military support. British counter-drone gear to Cyprus",g:"k",v:4},
  {d:"Mar 7",t:"12:00",e:"20,000+ Americans evacuated from Middle East. Charter flights arranged for remaining citizens",g:"k",v:3},
  {d:"Mar 7",t:"13:00",e:"Saudi intercepted 3 drones + 3 BMs targeting Riyadh. Pro-regime rally in Tehran after Friday prayers",g:"d",v:4},
  {d:"Mar 7",t:"14:00",e:"Pezeshkian: 'We are committed to peace yet have no hesitation in defending our sovereignty'",g:"k",v:3},
  {d:"Mar 7",t:"15:00",e:"CENTCOM: US has now struck 5,000+ targets in Iran since war began — up from 2,500",g:"a",v:5},
  {d:"Mar 7",t:"16:00",e:"Tehran's Mehrabad Airport on fire after new Israeli strikes. 94 weekly domestic routes disrupted",g:"a",v:5},
  {d:"Mar 7",t:"17:00",e:"Saudi intercepts 16 drones heading toward Shaybah oil field — 1M bbl/day capacity",g:"d",v:5},
  {d:"Mar 7",t:"18:00",e:"Iran interim council: will stop attacking neighbors unless attacks on Iran originate from their soil",g:"k",v:4},
  {d:"Mar 7",t:"19:00",e:"USS Gerald R. Ford transits Suez Canal — 5th carrier group now in theater",g:"a",v:4},
  {d:"Mar 7",t:"20:00",e:"US approves $151.8M emergency sale to Israel: 12,000 BLU-110A/B 1,000-lb bombs",g:"a",v:4},
  {d:"Mar 7",t:"21:00",e:"Fars News: Iran fired 500+ BMs and 2,000 drones since Feb 28. 40% at Israel, 60% at US bases",g:"i",v:5},
  {d:"Mar 7",t:"22:00",e:"IDF video shows dismantling of Khamenei's underground bunker in central Tehran",g:"a",v:4},
  {d:"Mar 7",t:"23:00",e:"UN Sec-Gen Guterres: war 'could spiral beyond anyone's control.' Lebanon PM: 'humanitarian disaster looming'",g:"k",v:4},
  {d:"Mar 7",t:"23:30",e:"Kurdish camps targeted by Iranian drones after CIA arming of Kurdish groups revealed",g:"i",v:4},
  {d:"Mar 7",t:"24:00",e:"DAY 8 — 5,000+ targets. Mehrabad Airport burning. Iran de-escalates vs neighbors. 5 carrier groups",g:"k",v:5},
  {d:"Mar 8",t:"01:00",e:"Trump on Truth Social: 'today Iran will be hit very hard.' Pentagon: 'accelerating, not decelerating'",g:"k",v:5},
  {d:"Mar 8",t:"02:00",e:"Israel deploys 80 jets in 'broad-scale wave' of strikes on Tehran — explosions east and west of capital",g:"a",v:5},
  {d:"Mar 8",t:"04:00",e:"Pezeshkian delivers televised address — apologizes to Gulf nations, vows Iran 'will never capitulate'",g:"k",v:5},
  {d:"Mar 8",t:"05:00",e:"Trump claims Iran 'surrendered' to neighbors. Dubai airport hit by drones — passengers report impact",g:"k",v:5},
  {d:"Mar 8",t:"06:00",e:"Gulf hit AGAIN: Saudi, Qatar, Bahrain, UAE all report fresh drone/missile attacks Saturday morning",g:"i",v:4},
  {d:"Mar 8",t:"07:00",e:"CENTCOM: 43 Iranian warships destroyed. Pentagon: 'twice the air power of Shock and Awe 2003'",g:"a",v:5},
  {d:"Mar 8",t:"08:00",e:"Dignified transfer of 6 US KIA at Dover AFB — Trump and JD Vance attending",g:"k",v:4},
  {d:"Mar 8",t:"09:00",e:"Iran deputy FM warns Europe will become 'legitimate targets' if they join US-Israel",g:"k",v:4},
  {d:"Mar 8",t:"10:00",e:"Gulf allies reviewing $3 TRILLION in US investment pledges — pressure on Trump to end war",g:"k",v:5},
  {d:"Mar 8",t:"11:00",e:"White House: campaign may run 4-6 weeks. Trump met defense CEOs to 'quadruple' weapons production",g:"k",v:4},
  {d:"Mar 8",t:"12:00",e:"Lebanon: 200+ killed since war began. Iran Hormuz: 'open but will target US/Israeli ships'",g:"k",v:4},
  {d:"Mar 8",t:"13:00",e:"FIRST OIL STRIKES: US/Israel hit Tehran oil storage depots and refineries — massive fires across capital",g:"a",v:5},
  {d:"Mar 8",t:"14:00",e:"Trump: war ends when Iran leaders 'cry uncle' or military no longer functional. 'Certain death' warning",g:"k",v:5},
  {d:"Mar 8",t:"15:00",e:"Israel struck 16 Iranian military aircraft at Mehrabad Airport",g:"a",v:4},
  {d:"Mar 8",t:"16:00",e:"Larijani: Iran 'will not let Trump go' — 'he must pay the price, he has martyred our leader and people'",g:"k",v:5},
  {d:"Mar 8",t:"17:00",e:"Iran may choose new supreme leader within 24 HOURS — Assembly of Experts member tells Fars",g:"k",v:5},
  {d:"Mar 8",t:"18:00",e:"Pezeshkian BACKTRACKED apology to Gulf after hardliner criticism — leadership rifts exposed",g:"k",v:4},
  {d:"Mar 8",t:"19:00",e:"China's Wang Yi: 'flames of war risk spreading.' War 'should never have happened, benefits no one'",g:"k",v:4},
  {d:"Mar 8",t:"20:00",e:"UK grants RAF Fairford to US — B-1 Lancer bomber arrives. 7th US KIA: NYPD officer in Kuwait",g:"a",v:4},
  {d:"Mar 8",t:"21:00",e:"Kuwait Airport fuel storage hit by 'wave of hostile drones' Sunday morning. Bahrain, Qatar explosions",g:"i",v:4},
  {d:"Mar 8",t:"22:00",e:"Iranian Red Crescent: 6,668 civilian units targeted by strikes. 4 killed in Beirut hotel building strike",g:"k",v:5},
  {d:"Mar 8",t:"23:00",e:"Chinese company Mizarvision tracking US military deployments via satellite — security concern",g:"k",v:3},
  {d:"Mar 9",t:"01:00",e:"MOJTABA KHAMENEI named new Supreme Leader by Assembly of Experts — Trump had called him 'unacceptable'",g:"k",v:5},
  {d:"Mar 9",t:"02:00",e:"Israel enters new phase: targeting OIL STORAGE sites. Blackened rain falls on Tehran from burning fuel",g:"a",v:5},
  {d:"Mar 9",t:"04:00",e:"IDF launches 'wide-scale' strikes on IRGC aerospace force headquarters",g:"a",v:5},
  {d:"Mar 9",t:"05:00",e:"7th US service member dies from initial attack injuries. 2 Israeli soldiers killed in south Lebanon — first IDF deaths",g:"k",v:5},
  {d:"Mar 9",t:"06:00",e:"Saudi Arabia: 2 killed, 12 injured by projectile hitting residential area — first Saudi civilian deaths",g:"k",v:5},
  {d:"Mar 9",t:"07:00",e:"Kuwait airport targeted by 'wave of hostile drones' at fuel storage. Gulf attacks continue despite Iran apology",g:"i",v:4},
  {d:"Mar 9",t:"08:00",e:"UN declares war a 'major humanitarian emergency' — 25 million refugees affected across region",g:"k",v:5},
  {d:"Mar 9",t:"09:00",e:"UK Akrotiri base in Cyprus hit by Iranian drone. 14 Israeli soldiers wounded in Lebanon border fighting",g:"i",v:4},
  {d:"Mar 9",t:"01:00",e:"MOJTABA KHAMENEI officially named Supreme Leader. Military + political leaders pledge allegiance",g:"k",v:5},
  {d:"Mar 9",t:"03:00",e:"BRENT CRUDE HITS $119.50 — first time past $100 since 2022. Asian markets crash: KOSPI -8%, Nikkei -7%",g:"k",v:5},
  {d:"Mar 9",t:"04:00",e:"Israel strikes oil depots in Tehran — Sharan and Shar Rey facilities. Toxic smoke, blackened rain across city",g:"a",v:5},
  {d:"Mar 9",t:"05:00",e:"8th US service member dies: Sgt Benjamin Pennington, 26, from injuries at Prince Sultan AB, Saudi Arabia",g:"k",v:5},
  {d:"Mar 9",t:"06:00",e:"Iranian warship sinking confirmed: 104 killed, 32 wounded in US sub torpedo attack off Sri Lanka",g:"a",v:5},
  {d:"Mar 9",t:"07:00",e:"Bahrain: 32 injured including children in Sitra strike. Fujairah UAE: oil facility on fire from overnight attack",g:"i",v:4},
  {d:"Mar 9",t:"08:00",e:"HRW: Israel used WHITE PHOSPHORUS in residential areas of southern Lebanon — war crime allegation",g:"k",v:5},
  {d:"Mar 9",t:"09:00",e:"China FM Wang Yi: 'war should never have happened.' Calls for immediate halt. Pope Leo XIV prays for peace",g:"k",v:4},
  {d:"Mar 9",t:"10:00",e:"Switzerland declares US-Israel attack violates international law. Spain denies US use of Rota/Morón bases",g:"k",v:4},
  {d:"Mar 9",t:"11:00",e:"Trump: oil price rise is 'very small price to pay.' Rubio: Iran regime 'trying to hold world hostage'",g:"k",v:4},
  {d:"Mar 9",t:"12:00",e:"Araghchi rejects ceasefire on Meet the Press: 'need to continue fighting for our people.' Denies Russia intel link",g:"k",v:4},
  {d:"Mar 9",t:"13:00",e:"IDF strikes Quds Force commanders in Beirut Ramada hotel — 4 killed, 10 wounded. Senate Dems 'horrified' by school strike",g:"a",v:5},
  {d:"Mar 9",t:"14:00",e:"Saudi: 2 Bangladeshi workers killed in Kharj attack. Saudi FM warns 'full right to take all necessary measures'",g:"k",v:4},
  {d:"Mar 9",t:"18:00",e:"DAY 10 — Oil hit $119.50. Mojtaba is Supreme Leader. 8 US KIA. White phosphorus. Asian markets crash",g:"k",v:5},
  {d:"Mar 10",t:"01:00",e:"Trump: war could end 'very soon.' Then threatens to hit Iran '20 times harder' if Hormuz stays blocked",g:"k",v:5},
  {d:"Mar 10",t:"03:00",e:"BRENT CRASHES from $119→$90 after Trump peace signal + G7 to discuss releasing strategic petroleum reserves",g:"k",v:5},
  {d:"Mar 10",t:"05:00",e:"IRGC rejects US claims missile program destroyed — says deploying warheads weighing more than 1 tonne",g:"i",v:5},
  {d:"Mar 10",t:"06:00",e:"Iranians rally nationwide for Mojtaba Khamenei. Israel vows new supreme leader is 'target for elimination'",g:"k",v:5},
  {d:"Mar 10",t:"07:00",e:"Kamal Kharazi (FM advisor): Iran prepared for 'long war.' Rules out diplomacy. War ends through economic pain",g:"k",v:4},
  {d:"Mar 10",t:"08:00",e:"Bahrain declares FORCE MAJEURE on Bapco energy operations. Kuwait airport fuel storage targeted again",g:"k",v:4},
  {d:"Mar 10",t:"09:00",e:"5 Iranian women's soccer players seek asylum in Australia — refused to sing anthem, flashed SOS signal",g:"k",v:3},
  {d:"Mar 10",t:"10:00",e:"32,000+ Americans evacuated. US State Dept orders non-emergency diplomats out of Saudi Arabia",g:"k",v:4},
  {d:"Mar 10",t:"11:00",e:"Gas prices up 50 cents (+17%) since war. Schumer demands Strategic Petroleum Reserve release",g:"k",v:4},
  {d:"Mar 10",t:"12:00",e:"NATO shoots down ANOTHER Iranian BM entering Turkish airspace. Strikes continue on Qom and Tehran",g:"d",v:4},
  {d:"Mar 10",t:"14:00",e:"Trump: 'war is very complete, pretty much' — then later: 'haven't won enough, seeking ultimate victory'",g:"k",v:5},
  {d:"Mar 10",t:"15:00",e:"CENTCOM: US has now struck 5,000+ targets. 11 MQ-9 Reaper drones lost so far",g:"a",v:5},
  {d:"Mar 10",t:"16:00",e:"40 killed in Tehran residential building attack. Iran: 1,400+ killed, ~10,000 injured total",g:"k",v:5},
  {d:"Mar 10",t:"17:00",e:"Hegseth: 'Tuesday will be our MOST INTENSE day of strikes.' Iran vows 'eye for an eye'",g:"a",v:5},
  {d:"Mar 10",t:"18:00",e:"IRGC: 'Iran will determine when the war ends, not Trump.' Araghchi rules out negotiations",g:"k",v:5},
  {d:"Mar 10",t:"19:00",e:"Iran army drones attack Haifa oil/gas refinery. Lebanon deaths surge to ~500. Internet at 4% in Iran",g:"i",v:5},
  {d:"Mar 10",t:"20:00",e:"Macron: 'attack on Cyprus is attack on Europe.' Australia sending missiles to UAE + surveillance aircraft",g:"k",v:4},
  {d:"Mar 10",t:"21:00",e:"IAEA Grossi: some impacts at Natanz/Isfahan nuclear sites. Trump-Putin call on Iran + Ukraine",g:"k",v:5},
  {d:"Mar 10",t:"22:00",e:"5 Arak civilians killed in residential strike. Ghalibaf pledges 'harsh response' to residential targeting",g:"k",v:4},
  {d:"Mar 10",t:"23:00",e:"DAY 11 — 5,000+ targets. 'Most intense day' promised. 1,400+ killed. Oil $90. Lebanon ~500 dead. Iran at 4% internet",g:"k",v:5},
  {d:"Mar 11",t:"01:00",e:"Israel 'wide-scale wave of strikes' on Tehran regime infrastructure + Hezbollah in Beirut",g:"a",v:5},
  {d:"Mar 11",t:"03:00",e:"IEA announces largest-ever emergency oil release: 400M barrels. US contributes 172M from SPR",g:"k",v:5},
  {d:"Mar 11",t:"05:00",e:"Iran attacks 3 ships in Strait of Hormuz overnight — Thai, Liberian, Japanese vessels. 16 ships total since war",g:"i",v:5},
  {d:"Mar 11",t:"07:00",e:"Lebanon death toll reaches 634. 816,700 displaced. Israeli strike on residential building in central Beirut",g:"k",v:5},
  {d:"Mar 11",t:"08:00",e:"IDF struck Taleqan nuclear facility — 'deep and sustained damage' to nuclear program foundations",g:"a",v:5},
  {d:"Mar 11",t:"09:00",e:"Kuwait shoots down 8 drones. UAE intercepted 26 drones (9 fell inside territory). Qatar missile intercept",g:"d",v:4},
  {d:"Mar 11",t:"10:00",e:"US CPI: inflation 2.4% YoY in Feb — but oil surge threatens to undo progress. Fed likely to hold rates",g:"k",v:4},
  {d:"Mar 11",t:"11:00",e:"Israeli strike kills 4 Iranian diplomats in Beirut. Iran calls it 'terrorist attack' at UNSC",g:"a",v:5},
  {d:"Mar 11",t:"12:00",e:"Drones strike Oman's Salalah port fuel tanks. Two oil tankers set ablaze off Basra, Iraq — 1 killed",g:"i",v:4},
  {d:"Mar 11",t:"13:00",e:"Pentagon: 7 KIA, 140 wounded (8 severe). 108 returned to duty. 47,000 Americans evacuated from ME",g:"k",v:4},
  {d:"Mar 11",t:"14:00",e:"Lebanon bans Hezbollah's military & security operations. Calls for weapons handover. Israel: 'not enough'",g:"k",v:5},
  {d:"Mar 11",t:"15:00",e:"Ukrainian anti-drone teams operating in Qatar, UAE, Saudi Arabia — Zelenskyy confirms",g:"k",v:4},
  {d:"Mar 11",t:"16:00",e:"Citi evacuates Dubai office. PwC closes offices in Saudi, Qatar, UAE, Kuwait",g:"k",v:3},
  {d:"Mar 11",t:"17:00",e:"US investigating Tomahawk missile strike on Iranian girls school — 175 killed. Evidence suggests US responsible",g:"k",v:5},
  {d:"Mar 11",t:"18:00",e:"Trump rally: 'nothing left to target.' Then: 'any time I want it to end, it will end'",g:"k",v:4},
  {d:"Mar 11",t:"19:00",e:"S&P 500 -0.08% to 6,776. Dow -0.61% to 47,417. Brent +4.8% to $92 despite IEA release",g:"k",v:4},
  {d:"Mar 11",t:"20:00",e:"WHO warns of toxic 'black rain' from burning oil depots mixing with clouds over Tehran",g:"k",v:5},
  {d:"Mar 11",t:"22:00",e:"DAY 12 — IEA 400M bbl release fails to cool oil. 634 killed in Lebanon. Taleqan nuke site struck. 16 ships attacked",g:"k",v:5},
  {d:"Mar 12",t:"01:00",e:"MOJTABA KHAMENEI breaks silence: Hormuz stays closed. Warns of more attacks on US bases",g:"k",v:5},
  {d:"Mar 12",t:"03:00",e:"Iran launches 'most intense operation since war began' — advanced BMs at Tel Aviv and Haifa",g:"i",v:5},
  {d:"Mar 12",t:"04:00",e:"3 more oil tankers attacked overnight in Arabian Gulf — broadening campaign beyond Strait",g:"i",v:5},
  {d:"Mar 12",t:"05:00",e:"IEA: war causing 'largest supply disruption in history of global oil market'",g:"k",v:5},
  {d:"Mar 12",t:"06:00",e:"Brent crude surges back above $100. IEA record reserve release absorbed in 26 days at current loss rate",g:"k",v:5},
  {d:"Mar 12",t:"07:00",e:"Lebanon death toll rises to 687. 816K+ displaced. IDF chief: war on Hezbollah 'won't be short'",g:"k",v:5},
  {d:"Mar 12",t:"08:00",e:"Iran police chief: protesters now treated as 'enemies'. UNHCR: 3.2 million displaced within Iran",g:"k",v:5},
  {d:"Mar 12",t:"09:00",e:"Trump touts US oil production: 'when oil prices go up, we make a lot of money'",g:"k",v:4},
  {d:"Mar 12",t:"10:00",e:"CENTCOM eliminated 16 Iranian minelayers + multiple naval vessels near Strait of Hormuz",g:"a",v:4},
  {d:"Mar 12",t:"11:00",e:"Pezeshkian demands: recognition of Iran's rights, war reparations, guarantees against future aggression",g:"k",v:4},
  {d:"Mar 12",t:"12:00",e:"USS Gerald R. Ford non-combat fire onboard — 2 sailors injured, stable condition",g:"k",v:3},
  {d:"Mar 12",t:"13:00",e:"Energy Sec Wright: Navy not ready to escort tankers through Hormuz. 'All assets focused on destroying Iran'",g:"k",v:4},
  {d:"Mar 12",t:"14:00",e:"Morgan Stanley + Cliffwater cap private credit withdrawals. Deutsche Bank flags $30B exposure. Banks sink",g:"k",v:5},
  {d:"Mar 12",t:"15:00",e:"S&P 500 -1.3%. Dow -600 pts. Lowest levels since November. Stagflation fears intensify",g:"k",v:5},
  {d:"Mar 12",t:"16:00",e:"Brent closes at $100.46 (+9.2%). WTI $95.73 (+9.7%). ING: 'market highs still ahead of us'",g:"k",v:5},
  {d:"Mar 12",t:"17:00",e:"Iran World Cup withdrawal confirmed. FIFA exploring replacements. Sports Minister: team won't participate",g:"k",v:3},
  {d:"Mar 12",t:"18:00",e:"IDF: 250+ drone sites struck in Iran. Over 6,000 targets hit total since war began",g:"a",v:5},
  {d:"Mar 12",t:"Now",e:"DAY 13 — Brent $100+. Khamenei: Hormuz stays shut. IEA: largest supply disruption in history. 687 killed in Lebanon. Private credit cracking",g:"k",v:5},
  {d:"Mar 13",t:"01:00",e:"Trump: Iran leaders are 'deranged scumbags.' Promises 'watch what happens' — highest volume of strikes yet",g:"k",v:5},
  {d:"Mar 13",t:"02:00",e:"US refueling aircraft crashes in western Iraq — all 6 crew killed. CENTCOM: 'not hostile fire.' Iraqi militia claims credit",g:"k",v:5},
  {d:"Mar 13",t:"03:00",e:"US total deaths reach 13 (7 KIA + 6 crash + 1 health). 2,200 Marines ordered to Middle East",g:"k",v:5},
  {d:"Mar 13",t:"04:00",e:"Hegseth: Mojtaba Khamenei 'likely disfigured' — casts doubt on authenticity of his purported address",g:"k",v:5},
  {d:"Mar 13",t:"05:00",e:"Israel launches 'extensive wave' of strikes on Tehran. City covered in thick smoke on Al Quds Day morning",g:"a",v:5},
  {d:"Mar 13",t:"06:00",e:"EXPLOSION near massive Al Quds Day rally in Tehran — at least 1 killed. Larijani: shows Israel's 'desperation'",g:"a",v:5},
  {d:"Mar 13",t:"07:00",e:"US eases sanctions on Russian oil to stabilize markets. Ukraine and Europe criticize the move",g:"k",v:5},
  {d:"Mar 13",t:"08:00",e:"Iran UN ambassador: 1,348 civilians killed (age 8 months to 88 years), 17,000+ injured",g:"k",v:5},
  {d:"Mar 13",t:"09:00",e:"Bahrain: intercepted 114 missiles + 190 drones since war began. Qatar airspace officially closed",g:"d",v:4},
  {d:"Mar 13",t:"10:00",e:"Qatar Airways operates 140 special flights to repatriate stranded residents. Australia orders ME evacuation",g:"k",v:4},
  {d:"Mar 13",t:"11:00",e:"Hegseth: denying Iran nukes remains 'core mission.' 'We have a range of options' including Iran giving them up",g:"k",v:4},
  {d:"Mar 13",t:"12:00",e:"GDP revised down to 1.2% (from 1.4%). Consumer sentiment: 55.5. Stagflation fears intensify",g:"k",v:4},
  {d:"Mar 13",t:"13:00",e:"Brent holding ~$101. S&P 500 -0.3% Fri. Dow flat. 3rd straight weekly loss. S&P down 1.3% for the week",g:"k",v:4},
  {d:"Mar 13",t:"14:00",e:"International Maritime Organization calls extraordinary session Mar 18-19 on Hormuz shipping threats",g:"k",v:4},
  {d:"Mar 13",t:"15:00",e:"Rotterdam synagogue arson — 4 suspects arrested. Michigan synagogue car-ramming: suspect lost family in Lebanon strike",g:"k",v:4},
  {d:"Mar 13",t:"16:00",e:"Trump to suspend Jones Act for 30 days — allows foreign tankers to carry oil between US ports amid shortage",g:"k",v:4},
  {d:"Mar 13",t:"24:00",e:"DAY 14 — 13 US dead. Plane crash in Iraq. Tehran struck on Al Quds Day. Russia sanctions eased. $101 oil. GDP revised down",g:"k",v:5},
  {d:"Mar 14-20",t:"WEEK 3",e:"Houthis enter war. South Korea hardest hit non-combatant. US cyber infrastructure threats escalate. Oil stays above $100",g:"k",v:5},
  {d:"Mar 21-27",t:"WEEK 4",e:"CSIS: Iran abandoning calibrated retaliation for rapid escalation. Munitions replenishment risk for US. Global agriculture threatened",g:"k",v:5},
  {d:"Mar 28-Apr 3",t:"WEEK 5",e:"Oil hit $110+. Gulf producers cut output. Kharg Island attacked. Universities struck. 14M Iranians volunteer to fight",g:"k",v:5},
  {d:"Apr 4",t:"08:00",e:"Trump threatens 'complete demolition' of Iran power plants and bridges if Hormuz not reopened by Tuesday 8pm ET",g:"k",v:5},
  {d:"Apr 5",t:"12:00",e:"Islamabad Accord proposed — 45-day ceasefire framework. Pakistan/Vance/Witkoff/Araghchi negotiate overnight",g:"k",v:5},
  {d:"Apr 6",t:"10:00",e:"Iran rejects 45-day ceasefire. Sends 10-point counter-demands: full sanctions relief, US base withdrawal, reconstruction",g:"k",v:5},
  {d:"Apr 7",t:"08:00",e:"Trump: 'A WHOLE CIVILIZATION WILL DIE TONIGHT.' Threatens to destroy bridges, power plants, water treatment",g:"k",v:5},
  {d:"Apr 7",t:"12:00",e:"Israel strikes Kharg Island oil hub. Bridges across Iran hit. US strikes intensify ahead of deadline",g:"a",v:5},
  {d:"Apr 7",t:"15:00",e:"Pakistan PM Sharif: requests 2-week extension. Calls on Iran to reopen Hormuz as 'goodwill gesture'",g:"k",v:5},
  {d:"Apr 7",t:"18:32",e:"CEASEFIRE: Trump announces 2-week suspension. Iran's 10-point plan 'a workable basis to negotiate'",g:"k",v:5},
  {d:"Apr 7",t:"19:00",e:"Iran FM Araghchi: safe passage through Hormuz 'possible' with coordination. Iran stops 'defensive operations'",g:"k",v:5},
  {d:"Apr 7",t:"20:00",e:"US military orders all offensive operations in Iran to CEASE immediately",g:"k",v:5},
  {d:"Apr 8",t:"02:00",e:"First 2 oil tankers pass through Hormuz with Iranian coordination. Markets surge overnight",g:"k",v:5},
  {d:"Apr 8",t:"06:00",e:"Israel: ceasefire DOES NOT include Lebanon. Launches Op Eternal Darkness — 254 killed in single day",g:"a",v:5},
  {d:"Apr 8",t:"08:00",e:"Iran PAUSES Hormuz traffic over Israeli Lebanon strikes. Ceasefire already fragmenting",g:"i",v:5},
  {d:"Apr 8",t:"09:00",e:"UAE, Bahrain, Kuwait report NEW Iranian attacks despite ceasefire. Lavan Island oil refinery struck",g:"i",v:5},
  {d:"Apr 8",t:"10:00",e:"Dow +1,300 pts. S&P +2.5%. Oil crashes 16% — biggest drop in 6 years. Brent to ~$92, WTI ~$93",g:"k",v:5},
  {d:"Apr 8",t:"12:00",e:"Vance + Kushner + Witkoff dispatched to Islamabad for talks Saturday. IRGC warns: stop Lebanon attacks or 'regretful response'",g:"k",v:5},
  {d:"Apr 8",t:"Now",e:"DAY 40 — CEASEFIRE. Fragile 2-week truce. Hormuz reopening then paused. Lebanon excluded. 3,400+ killed in Iran. Markets surging. Talks begin Friday",g:"k",v:5},
  {d:"Apr 9",t:"All Day",e:"No sign of Hormuz agreement being implemented. Ships blocked again. No new Gulf attacks reported. PAF mobilizes fighters to escort Iranian delegation",g:"k",v:4},
  {d:"Apr 10",t:"08:00",e:"Iranian delegation 'Minab 168' led by Ghalibaf + Araghchi arrives in Islamabad. 70+ person team. Red carpet welcome",g:"k",v:5},
  {d:"Apr 10",t:"10:00",e:"Ghalibaf: 2 preconditions unmet — Lebanon ceasefire + unfreezing Iran assets. 'Must be fulfilled before talks begin'",g:"k",v:5},
  {d:"Apr 10",t:"12:00",e:"Lebanon death toll surges to 1,950. 6,436 wounded. 165 children killed. 97 killed in last 24 hours alone",g:"k",v:5},
  {d:"Apr 10",t:"14:00",e:"US Embassy Baghdad targeted by multiple militia drone attacks on first day of ceasefire. All personnel safe",g:"i",v:4},
  {d:"Apr 10",t:"16:00",e:"13 Lebanese security personnel killed by Israel in Nabatiyeh. Hezbollah urges govt to refuse direct Israel talks",g:"a",v:4},
  {d:"Apr 10",t:"18:00",e:"Trump: Hormuz will reopen 'with or without Iran's cooperation.' Only 15 ships transit since ceasefire (vs 130/day)",g:"k",v:5},
  {d:"Apr 10",t:"20:00",e:"Pope Leo XIV: 'God does not bless any conflict.' Iraq oil still disrupted — 26 South Korean vessels stranded in Gulf",g:"k",v:4},
  {d:"Apr 11",t:"06:00",e:"Vance + Witkoff + Kushner arrive in Islamabad. Vance: talks will be 'positive' but warns Iran 'don't try to play us'",g:"k",v:5},
  {d:"Apr 11",t:"08:00",e:"Trump: US forces have started 'CLEARING' the Strait of Hormuz. Iran claims US vessel turned back after warning",g:"a",v:5},
  {d:"Apr 11",t:"10:00",e:"USS Peterson + USS Michael Murphy transit Hormuz — FIRST US Navy ships through since war began. Mine clearance ops",g:"a",v:5},
  {d:"Apr 11",t:"12:00",e:"DIRECT FACE-TO-FACE talks begin. Moved beyond 'proximate' format. US-Iran-Pakistan trilateral in same room",g:"k",v:5},
  {d:"Apr 11",t:"14:00",e:"Reports: some progress on Lebanon ceasefire conditions. Possible understanding to limit strikes to south Lebanon",g:"k",v:4},
  {d:"Apr 11",t:"15:00",e:"Talks enter 'detailed, technical phase.' Iran: ready for deal if US offers 'genuine agreement.' Ceasefire expires ~Apr 22",g:"k",v:5},
  {d:"Apr 11",t:"Now",e:"DAY 43 — ISLAMABAD TALKS LIVE. Direct US-Iran face-to-face. 2 destroyers in Hormuz. Lebanon 1,950+ dead. Ceasefire fragile but holding. Oil ~$93",g:"k",v:5},
  {d:"Apr 12",t:"02:00",e:"TALKS COLLAPSE after 21 hours. Vance: 'Iran refused to accept our terms.' Nuclear commitments the sticking point",g:"k",v:5},
  {d:"Apr 12",t:"03:00",e:"Araghchi: were 'inches away' from Islamabad MoU but US showed 'maximalism, shifting goalposts, and blockade'",g:"k",v:5},
  {d:"Apr 12",t:"04:00",e:"Ghalibaf: 'US failed to gain our trust.' Iran put forth constructive proposals. Ball now in US court",g:"k",v:4},
  {d:"Apr 12",t:"06:00",e:"Vance boards Air Force Two. Pakistan FM Dar urges ceasefire be maintained. Will facilitate new dialogue",g:"k",v:4},
  {d:"Apr 12",t:"08:00",e:"White House reveals 'red lines': dismantle enrichment, retrieve 400kg HEU, end Hamas/Hezbollah/Houthi funding",g:"k",v:5},
  {d:"Apr 12",t:"10:00",e:"Israel struck 200+ Hezbollah targets DURING Islamabad talks. Lebanon death toll surpasses 2,000. Red Cross paramedic killed",g:"a",v:5},
  {d:"Apr 12",t:"12:00",e:"March CPI: +0.9% MoM, 3.3% YoY. Inflation surging from oil shock. Fed rate cuts now unlikely in 2026",g:"k",v:5},
  {d:"Apr 12",t:"14:00",e:"Saudi Arabia: production capacity reduced 600K bpd from Iranian attacks on oil facilities. East-West Pipeline -700K bpd",g:"k",v:4},
  {d:"Apr 12",t:"18:00",e:"TRUMP ORDERS FULL NAVAL BLOCKADE of Iranian ports. 'Any and all ships' blocked from entering/leaving Hormuz",g:"k",v:5},
  {d:"Apr 12",t:"19:00",e:"CENTCOM: blockade of Iranian maritime traffic begins Monday 10am ET. Non-Iranian port traffic not impeded",g:"a",v:5},
  {d:"Apr 12",t:"20:00",e:"Oil surges: Brent +8% to ~$103, WTI +9% to ~$105. Stock futures -1%. Iran says won't allow blockade",g:"k",v:5},
  {d:"Apr 12",t:"21:00",e:"WSJ: Trump advisers considering resuming LIMITED strikes. Full bombing campaign 'less likely' due to destabilization risk",g:"k",v:5},
  {d:"Apr 12",t:"22:00",e:"Goldman Sachs: another month of Hormuz closure = Brent $100+ ALL of 2026. Q3 could hit $120. Q4 $115",g:"k",v:5},
  {d:"Apr 12",t:"Now",e:"DAY 44 — TALKS FAILED. BLOCKADE ORDERED. Oil $103-105. CPI 3.3%. Ceasefire expires Apr 22. War may resume",g:"k",v:5},
  {d:"Apr 13",t:"10:00",e:"US NAVAL BLOCKADE begins at 10am ET. CENTCOM: applies to vessels entering/leaving Iranian ports only",g:"a",v:5},
  {d:"Apr 13",t:"12:00",e:"Oil surges: Brent $103, WTI $105. Stock futures -1%. Iran says it will not allow blockade to proceed",g:"k",v:5},
  {d:"Apr 13-15",t:"WEEK 7",e:"Blockade in effect. 13 tankers intercepted — all complied. No boarding needed. Iran military lost control of some units",g:"k",v:5},
  {d:"Apr 16",t:"10:00",e:"ISRAEL-LEBANON 10-DAY CEASEFIRE announced. Trump: 'Israel will no longer be bombing Lebanon'",g:"k",v:5},
  {d:"Apr 16",t:"14:00",e:"Lebanon death toll at ceasefire: 2,196 killed, 7,061 wounded, 1M+ displaced. First direct Israel-Lebanon talks in decades",g:"k",v:5},
  {d:"Apr 16",t:"16:00",e:"Gen. Caine: 13 oil tankers intercepted by US Navy to enforce blockade. All complied without boarding",g:"a",v:4},
  {d:"Apr 17",t:"06:00",e:"IRAN DECLARES HORMUZ 'COMPLETELY OPEN' for commercial vessels during Lebanon ceasefire",g:"k",v:5},
  {d:"Apr 17",t:"07:00",e:"Trump: US blockade of Iranian ports REMAINS 'in full force' until peace deal signed. Hormuz ≠ Iranian ports",g:"k",v:5},
  {d:"Apr 17",t:"08:00",e:"Oil crashes: Brent -12% to ~$89, WTI to ~$83. Erasing nearly all war gains. Gas prices should ease",g:"k",v:5},
  {d:"Apr 17",t:"09:00",e:"S&P 500 crosses 7,100 — NEW ALL-TIME HIGH. Dow +1,005 pts (+2.1%). Russell 2000 ATH. Nasdaq +1.5%",g:"k",v:5},
  {d:"Apr 17",t:"10:00",e:"Paris Summit: 49 countries. Macron + Starmer: UK-France naval escort mission for commercial shipping. 'Peaceful and defensive'",g:"k",v:4},
  {d:"Apr 17",t:"11:00",e:"Maersk: 'Any transit decision based on risk assessments.' Hapag-Lloyd: 'open questions remain.' Insurance unclear",g:"k",v:4},
  {d:"Apr 17",t:"12:00",e:"Iran war total casualties: 9,226 killed (6,174 military + 3,052 civilian). Iran military alone: 6,620 killed per Hengaw",g:"k",v:5},
  {d:"Apr 17",t:"13:00",e:"Trump: negotiations 'should go very quickly.' Iran ceasefire still technically active — expires ~Apr 22",g:"k",v:4},
  {d:"Apr 17",t:"Now",e:"DAY 48 — HORMUZ OPEN. Lebanon ceasefire. S&P ATH. Oil $89. But US blockade remains. Iran ceasefire expires Apr 22",g:"k",v:5},
];
const eClr={a:P.sky,i:P.fire,d:P.leaf,k:P.sun};
const eLbl={a:"US/Israel",i:"Iran",d:"Defense",k:"Develop."};

function TimelineTab() {
  const [filt,setFilt]=useState("all");
  
  const allEvts = [...BASE_EVTS].reverse();
  const data=filt==="all"?allEvts:allEvts.filter(e=>e.g===filt);
  return (
    <div>
      <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>
        {[["all","ALL",P.tx2],...Object.entries(eLbl).map(([k,lb])=>[k,lb,eClr[k]])].map(([id,lb,cl])=>(
          <button key={id} onClick={()=>setFilt(id)} style={{background:filt===id?`${cl}18`:"transparent",border:`1px solid ${filt===id?cl:P.edg}`,borderRadius:5,padding:"3px 10px",fontSize:11,fontWeight:700,color:filt===id?cl:P.tx3,cursor:"pointer",fontFamily:fn}}>{lb}</button>))}
      </div>
      <MiniBarGroup title="EVENTS BY DAY / WEEK" height={80} data={[
        {label:"Feb 28",val:8,color:P.fire,display:"8"},
        {label:"Mar 1",val:4,color:P.flm,display:"4"},
        {label:"Mar 2",val:4,color:P.flm,display:"4"},
        {label:"Mar 3-5",val:10,color:P.sun,display:"10"},
        {label:"Mar 6-7",val:28,color:P.fire,display:"28"},
        {label:"Mar 8-9",val:22,color:P.fire,display:"22"},
        {label:"Mar 10-12",val:38,color:P.flm,display:"38"},
        {label:"Mar 13",val:18,color:P.fire,display:"18"},
        {label:"Wk 3-4",val:12,color:P.sun,display:"12"},
        {label:"Wk 5-6",val:10,color:P.sun,display:"10"},
        {label:"Apr 7-8",val:19,color:P.leaf,display:"19"},
        {label:"Apr 9-11",val:15,color:P.leaf,display:"15"},
        {label:"Apr 12",val:15,color:P.fire,display:"15"},
        {label:"Apr 13-16",val:8,color:P.sun,display:"8"},
        {label:"Apr 17",val:9,color:P.leaf,display:"9"},
      ]}/>
      <div style={{maxHeight:500,overflowY:"auto"}}>
        {data.map((ev,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"10px 13px",borderLeft:`3px solid ${eClr[ev.g]||P.sun}`,background:`${eClr[ev.g]||P.sun}06`,borderRadius:"0 6px 6px 0",marginBottom:2}}>
            <div style={{minWidth:56,fontFamily:fn,fontSize:11}}><div style={{fontWeight:700,color:P.tx}}>{ev.d}</div><div style={{color:P.tx3}}>{ev.t}</div></div>
            <div style={{flex:1,fontSize:11,color:P.tx,lineHeight:1.45}}>{ev.e}</div>
            <div style={{display:"flex",gap:2,alignItems:"center"}}>{Array.from({length:ev.v||3}).map((_,j)=>(<span key={j} style={{width:3,height:3,borderRadius:"50%",background:eClr[ev.g]||P.sun,opacity:.3+j*.15}}/>))}</div>
          </div>))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// TAB: MARKETS
// ════════════════════════════════════════════
function MarketsTab() {
  const stocks=[
    {sym:"LMT",name:"Lockheed Martin",change:"+18%",direction:1,sector:"Defense",note:"F-35, THAAD, PAC-3. All-time high"},
    {sym:"NOC",name:"Northrop Grumman",change:"+13%",direction:1,sector:"Defense",note:"B-2 Spirit bomber maker"},
    {sym:"RTX",name:"RTX (Raytheon)",change:"+7%",direction:1,sector:"Defense",note:"Tomahawk, Patriot demand surge"},
    {sym:"XOM",name:"ExxonMobil",change:"+15%",direction:1,sector:"Energy",note:"Benefits from $100 Brent"},
    {sym:"CVX",name:"Chevron",change:"+14%",direction:1,sector:"Energy",note:"Energy sector leading gains"},
    {sym:"GLD",name:"Gold SPDR",change:"+3%",direction:1,sector:"Haven",note:"~$5,177/oz haven demand"},
    {sym:"MS",name:"Morgan Stanley",change:"-4%",direction:-1,sector:"Finance",note:"Capped private credit withdrawals"},
    {sym:"DAL",name:"Delta Airlines",change:"-8%",direction:-1,sector:"Airlines",note:"Fuel + ME airspace closure"},
    {sym:"UAL",name:"United Airlines",change:"-9%",direction:-1,sector:"Airlines",note:"Worst S&P performer"},
    {sym:"KOSPI",name:"Korea Comp.",change:"-15%",direction:-1,sector:"Intl",note:"Multiple circuit breakers since war"},
  ];
  const up = "▲";
  const dn = "▼";
  return (
    <div>
      <div className="cm-kpi-row" style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        <KPI label="Brent Crude" value="~$92" accent={P.leaf} sub={`${dn} -16% ceasefire crash. Biggest drop in 6 yrs`}/>
        <KPI label="WTI Crude" value="~$93" accent={P.leaf} sub={`${dn} -17%. Was $110+ before deal`}/>
        <KPI label="Gold" value="~$4,804" accent={P.sun} sub={`${dn} Haven bid fading post-ceasefire`}/>
        <KPI label="Dow Jones" value="+1,300" accent={P.leaf} sub={`${up} Surging Wed. Biggest rally of 2026`}/>
        <KPI label="S&P 500" value="+2.5%" accent={P.leaf} sub={`${up} Still -5.5% from ATH. Cautious`}/>
        <KPI label="10Y Treasury" value="4.25%" accent={P.leaf} sub={`${dn} -9bps on ceasefire. Rate cut odds rising`}/>
      </div>
      <div style={{overflowX:"auto",marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:`1px solid ${P.edg}`}}>
            {["TICKER","NAME","CHANGE","SECTOR","NOTES"].map(h=>(<th key={h} style={{textAlign:"left",padding:"10px 13px",color:P.tx3,fontSize:11,fontWeight:700,letterSpacing:1,fontFamily:fn}}>{h}</th>))}
          </tr></thead>
          <tbody>{stocks.map((s,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${P.edg}12`}}>
              <td style={{padding:"10px 12px",fontWeight:800,color:s.direction>0?P.leaf:s.direction<0?P.fire:P.sun,fontFamily:fn,fontSize:11}}>{s.sym}</td>
              <td style={{padding:"10px 12px",color:P.tx,fontSize:11}}>{s.name}</td>
              <td style={{padding:"10px 12px",fontFamily:fn,fontWeight:700,color:s.direction>0?P.leaf:s.direction<0?P.fire:P.sun}}>{s.change}</td>
              <td style={{padding:"10px 12px"}}><Tag text={s.sector} color={s.sector?.includes("Def")?P.sky:s.sector==="Energy"?P.flm:s.sector==="Haven"?P.sun:P.fire}/></td>
              <td style={{padding:"10px 12px",color:P.tx2,fontSize:11}}>{s.note}</td>
            </tr>))}</tbody>
        </table>
      </div>
      <CandlestickChart title="BRENT CRUDE OIL — DAILY CANDLES ($/bbl)" data={[
        {label:"Feb 26",open:70,high:71,low:69,close:70},
        {label:"Feb 27",open:70,high:73,low:70,close:73},
        {label:"Feb 28",open:73,high:82,low:72,close:78},
        {label:"Mar 1",open:78,high:81,low:76,close:80},
        {label:"Mar 2",open:80,high:83,low:78,close:79},
        {label:"Mar 3",open:79,high:84,low:78,close:82},
        {label:"Mar 4",open:82,high:85,low:80,close:83},
        {label:"Mar 5",open:83,high:86,low:81,close:85},
        {label:"Mar 6",open:85,high:90,low:84,close:90},
        {label:"Mar 7",open:83,high:95,low:83,close:93},
        {label:"Mar 8",open:93,high:100,low:90,close:98},
        {label:"Mar 9",open:98,high:120,low:96,close:113},
        {label:"Mar 10",open:113,high:113,low:88,close:90},
        {label:"Mar 11",open:90,high:93,low:87,close:92},
        {label:"Mar 12",open:92,high:102,low:93,close:100},
        {label:"Mar 13",open:100,high:102,low:99,close:101},
      ]}/>
      <StockCandles title="STOCK PERFORMANCE — CANDLESTICK VIEW (% change since Feb 27)" data={[
        {sym:"LMT",open:2,close:14.9,high:16,low:1,color:P.leaf},
        {sym:"NOC",open:1.5,close:10.9,high:12,low:0.5,color:P.leaf},
        {sym:"XOM",open:1,close:11,high:12.5,low:0,color:P.flm},
        {sym:"RTX",open:0.5,close:4.7,high:6,low:-0.5,color:P.leaf},
        {sym:"PLTR",open:0,close:6,high:7.5,low:-1,color:P.sky},
        {sym:"GLD",open:0.5,close:5,high:6,low:0,color:P.sun},
        {sym:"DAL",open:0,close:-5.2,high:1,low:-7,color:P.fire},
        {sym:"UAL",open:0,close:-5.5,high:0.5,low:-8,color:P.fire},
        {sym:"KOSPI",open:0,close:-12,high:0,low:-14,color:P.fire},
      ]}/>
      <div className="cm-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <MiniBarGroup title="DEFENSE & ENERGY GAINS" height={130} data={[
          {label:"LMT",val:14.9,color:P.leaf,display:"+14.9%"},
          {label:"NOC",val:10.9,color:P.leaf,display:"+10.9%"},
          {label:"XOM",val:11,color:P.flm,display:"+11%"},
          {label:"RTX",val:4.7,color:P.leaf,display:"+4.7%"},
          {label:"PLTR",val:6,color:P.sky,display:"+6%"},
          {label:"CVX",val:11,color:P.flm,display:"+11%"},
        ]}/>
        <MiniBarGroup title="BIGGEST LOSERS" height={130} data={[
          {label:"UAL",val:5.5,color:P.fire,display:"-5.5%"},
          {label:"DAL",val:5.2,color:P.fire,display:"-5.2%"},
          {label:"KOSPI",val:12,color:P.fire,display:"-12%"},
          {label:"Nikkei",val:2,color:P.flm,display:"-2%"},
          {label:"Stoxx",val:1.6,color:P.flm,display:"-1.6%"},
        ]}/>
      </div>
      <div style={{border:`1px solid ${P.edg}`,borderRadius:10,padding:14,background:P.srf,marginTop:12}}>
        <div style={{fontSize:11,color:P.tx3,fontWeight:700,letterSpacing:1.5,marginBottom:10,fontFamily:fn}}>ANALYST VIEWS</div>
        {[["Goldman Sachs","$78 oil = ~4 week bet. Beyond that = triple-digit oil",P.sun],["Morgan Stanley","Defense + aerospace = structural beneficiaries",P.sky],["Oxford Economics","Sell spikes — won't last >2 months. Buy GCC dip",P.leaf],["Dan Niles","$100+ sustained = recession. Expects ~1 month",P.flm]].map(([src,v,cl],i)=>(
          <div key={i} style={{padding:"10px 13px",borderLeft:`3px solid ${cl}`,marginBottom:5,background:`${cl}06`,borderRadius:"0 8px 8px 0"}}>
            <div style={{fontSize:11,fontWeight:700,color:cl,fontFamily:fn}}>{src}</div>
            <div style={{fontSize:11,color:P.tx,marginTop:2,lineHeight:1.45}}>{v}</div>
          </div>))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// TAB: FORECASTS
// ════════════════════════════════════════════
function ForecastTab() {
  const preds=[
    {q:"When could this end?",a:"Goldman: ~4 weeks. Oxford: max 2 months. Trump: 'no time limits.' Most likely: intense 2-3 wks, then off-ramp via Oman/Qatar.",cn:65,src:"Goldman, Oxford, Kpler"},
    {q:"Will oil hit $100?",a:"Only if Hormuz closed >4 wks AND Gulf infrastructure damaged. Buffers exist. Short war peaks ~$85-90.",cn:55,src:"Goldman, Rystad Energy"},
    {q:"Recession risk?",a:"Sustained $100+ oil = probable. Current levels manageable. US production buffers. Asia most exposed.",cn:30,src:"CNBC, Morgan Stanley"},
    {q:"Iran's next leader?",a:"Mojtaba Khamenei frontrunner. Assembly bombed mid-meeting. Israel: 'any successor is a target.' Trump wants role in selection.",cn:70,src:"NPR, Reuters, AP"},
    {q:"Ground invasion?",a:"FM Araghchi: 'ready.' But US has air supremacy, no ground deployed. Pentagon focused on air+naval. Low probability.",cn:20,src:"NBC, CENTCOM"},
    {q:"Defense stocks?",a:"Rally continues. LMT +14.9%, ITA +14% YTD. White House meeting with defense CEOs. Paradox: neutralized Iran = less demand.",cn:80,src:"Capital Alpha, CNBC"},
  ];
  return (
    <div>
      <div style={{fontSize:11,color:P.tx3,fontWeight:700,letterSpacing:1.5,marginBottom:10,fontFamily:fn}}>WAR DURATION SCENARIOS</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8,marginBottom:18}}>
        {BASE_SCENARIOS.map((sc,i)=>(
          <div key={i} style={{border:`1px solid ${sc.cl}25`,borderRadius:10,padding:14,background:P.srf}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontSize:11,fontWeight:700,color:sc.cl,fontFamily:fn}}>{sc.nm}</div>
              <div style={{fontSize:25,fontWeight:800,color:sc.cl,fontFamily:fn}}>{sc.p}%</div></div>
            <div style={{background:"#1A2236",borderRadius:4,height:5,marginBottom:8}}><div style={{width:`${sc.p}%`,height:"100%",background:sc.cl,borderRadius:4}}/></div>
            <div style={{fontSize:11,color:P.tx2,marginBottom:2}}><b style={{color:P.tx}}>Oil:</b> {sc.oil}</div>
            <div style={{fontSize:11,color:P.tx2,marginBottom:2}}><b style={{color:P.tx}}>Markets:</b> {sc.mkt}</div>
            <div style={{fontSize:11,color:P.tx2}}><b style={{color:P.tx}}>End:</b> {sc.end}</div>
          </div>))}
      </div>
      <div style={{fontSize:11,color:P.tx3,fontWeight:700,letterSpacing:1.5,marginBottom:10,fontFamily:fn}}>KEY FORECASTS</div>
      {preds.map((p,i)=>(
        <div key={i} style={{border:`1px solid ${P.edg}`,borderRadius:10,padding:14,marginBottom:8,background:P.srf,display:"flex",gap:14,alignItems:"start"}}>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:P.tx,marginBottom:4}}>{p.q}</div><div style={{fontSize:11,color:P.tx2,lineHeight:1.5}}>{p.a}</div><div style={{fontSize:11,color:P.tx3,marginTop:4,fontFamily:fn}}>Sources: {p.src}</div></div>
          <div style={{textAlign:"center",minWidth:55}}><div style={{fontSize:25,fontWeight:800,color:p.cn>60?P.leaf:p.cn>40?P.sun:P.fire,fontFamily:fn}}>{p.cn}%</div><div style={{fontSize:11,color:P.tx3,fontFamily:fn,letterSpacing:1}}>CONFIDENCE</div></div>
        </div>))}
    </div>
  );
}

// ════════════════════════════════════════════
// TAB: SPILLOVER
// ════════════════════════════════════════════
function SpillTab() {
  return (
    <div>
      <div style={{fontSize:11,color:P.tx3,fontWeight:700,letterSpacing:1.5,marginBottom:10,fontFamily:fn}}>CONFLICT EXPANSION VECTORS</div>
      {BASE_SPILLS.map((sp,i)=>(
        <div key={i} style={{border:`1px solid ${sp.cl}20`,borderLeft:`4px solid ${sp.cl}`,borderRadius:"0 10px 10px 0",padding:"10px 13px",marginBottom:6,background:P.srf}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><Blink color={sp.cl} size={6}/><span style={{fontSize:11,fontWeight:700,color:P.tx}}>{sp.r}</span></div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}><Tag text={sp.lv} color={sp.cl}/><Tag text={sp.st} color={sp.st==="ACTIVE"?P.fire:sp.st==="INCIDENT"?P.flm:P.sun}/><span style={{fontSize:11,fontWeight:800,color:sp.cl,fontFamily:fn}}>{sp.p}%</span></div></div>
          <div style={{fontSize:11,color:P.tx2,lineHeight:1.4}}>{sp.d}</div>
        </div>))}
    </div>
  );
}

// ════════════════════════════════════════════
// TAB: AI PIPELINE
// ════════════════════════════════════════════
function SourcesTab() {
  const [sortBy, setSortBy] = useState("cred");
  const sorted = [...SOURCES].sort((a, b) => sortBy === "cred" ? b.cred - a.cred : a.name.localeCompare(b.name));
  const credColor = (c) => c >= 9 ? P.leaf : c >= 7 ? P.sun : c >= 5 ? P.flm : P.fire;
  const typeColor = (t) => t.includes("Military") ? P.sky : t.includes("News") || t.includes("Wire") ? P.aqua : t.includes("OSINT") || t.includes("Data") ? P.sun : t.includes("Think") || t.includes("Academic") || t.includes("Finance") ? P.leaf : t.includes("UN") ? P.sage : t.includes("Iran") ? P.fire : t.includes("Government") ? P.sky : P.tx3;
  return (
    <div>
      <div style={{border:`1px solid ${P.edg}`,borderRadius:12,padding:16,marginBottom:14,background:`linear-gradient(135deg,${P.srf},#0D1525)`}}>
        <div style={{fontSize:13,fontWeight:800,color:P.sun,fontFamily:fn}}>SOURCES & VERIFICATION</div>
        <div style={{fontSize:11,color:P.tx2,marginTop:6,lineHeight:1.55}}>
          This tracker draws from <b style={{color:P.tx}}>22 named sources</b> across military, news, OSINT, academic, financial, and humanitarian organizations. Every figure is attributed. Credibility scores reflect source reliability, independence, and verification record.
        </div>
        <div style={{marginTop:8,background:`${P.flm}10`,border:`1px solid ${P.flm}25`,borderRadius:6,padding:"6px 12px",fontSize:11,color:P.flm,fontFamily:fn}}>
          ⚠ No single source is treated as ground truth. Iranian state media figures require cross-verification. IDF claims are treated as assertions until independently confirmed.
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{fontSize:10,color:P.tx3,fontFamily:fn,fontWeight:700,letterSpacing:1}}>CREDIBILITY SCALE:</div>
        {[{s:9,l:"Highest",c:P.leaf},{s:7,l:"High",c:P.sun},{s:5,l:"Moderate",c:P.flm},{s:3,l:"Low",c:P.fire}].map(({s,l,c})=>(
          <div key={s} style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:18,height:18,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",background:`${c}20`,color:c,fontSize:10,fontWeight:800,fontFamily:fn}}>{s}</span>
            <span style={{fontSize:9,color:P.tx3}}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[["cred","BY CREDIBILITY"],["name","ALPHABETICAL"]].map(([k,lb])=>(
          <button key={k} onClick={()=>setSortBy(k)} style={{background:sortBy===k?`${P.sky}18`:"transparent",border:`1px solid ${sortBy===k?P.sky:P.edg}`,borderRadius:5,padding:"3px 10px",fontSize:9,fontWeight:700,color:sortBy===k?P.sky:P.tx3,cursor:"pointer",fontFamily:fn}}>{lb}</button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {sorted.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",background:P.srf,borderRadius:8,border:`1px solid ${P.edg}20`}}>
            <span style={{width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:`${credColor(s.cred)}15`,color:credColor(s.cred),fontSize:13,fontWeight:800,fontFamily:fn,flexShrink:0}}>{s.cred}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:12,fontWeight:700,color:P.tx}}>{s.name}</span>
                <Tag text={s.type} color={typeColor(s.type)}/>
                <span style={{fontSize:9,color:P.tx4,fontFamily:fn}}>{s.bias}</span>
              </div>
              <div style={{fontSize:10,color:P.tx2,marginTop:3,lineHeight:1.4}}>{s.used}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:14,border:`1px solid ${P.edg}`,borderRadius:10,padding:14,background:P.srf}}>
        <div style={{fontSize:10,color:P.tx3,fontWeight:700,letterSpacing:1.5,fontFamily:fn,marginBottom:8}}>METHODOLOGY NOTE</div>
        <div style={{fontSize:11,color:P.tx2,lineHeight:1.6}}>
          This dashboard was built by <b style={{color:P.tx}}>Claude Opus</b> (Anthropic) using real-time web search across the sources listed above. Data is manually refreshed — not auto-updating. Casualty figures use Iranian Red Crescent numbers as baseline but are flagged as requiring independent verification. Market data is sourced from Bloomberg, Yahoo Finance, and CNBC. War cost calculations are anchored to the CSIS report published March 6, 2026, with the $891.4M/day burn rate confirmed by CNN, NBC, and Washington Times. Baseline data last updated <b style={{color:P.tx}}>April 17, 2026</b>.
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// TAB: AI PIPELINE (real architecture)
// ════════════════════════════════════════════
function AITab() {
  return (
    <div>
      <div style={{border:`1px solid ${P.edg}`,borderRadius:12,padding:16,marginBottom:14,background:`linear-gradient(135deg,${P.srf},#0D1525)`}}>
        <div style={{fontSize:13,fontWeight:800,color:P.sky,fontFamily:fn}}>INTELLIGENCE PIPELINE</div>
        <div style={{fontSize:11,color:P.tx2,marginTop:6,lineHeight:1.55}}>
          This tracker is built and maintained by <b style={{color:P.tx}}>Claude Opus</b> (Anthropic). Data is compiled from 22 named sources via web search, then hardcoded into the artifact as verified baseline data. The REFRESH LIVE button calls the <b style={{color:P.tx}}>Claude Sonnet API</b> to attempt fresh data retrieval.
        </div>
      </div>

      <div style={{fontSize:10,color:P.tx3,fontWeight:700,letterSpacing:1.5,marginBottom:10,fontFamily:fn}}>HOW IT WORKS</div>
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>
        {["📰 50+ news sources","→","🧠 Claude Opus analyzes","→","📊 Structured into baseline","→","🔄 Sonnet API refreshes","→","📈 Dashboard renders"].map((s,i)=>(
          <span key={i} style={{fontSize:s==="→"?14:10,color:s==="→"?P.tx4:P.tx2,fontFamily:fn,fontWeight:s==="→"?400:600,padding:s==="→"?"0":"4px 8px",background:s==="→"?"transparent":`${P.edg}40`,borderRadius:4}}>{s}</span>
        ))}
      </div>

      <div style={{fontSize:10,color:P.tx3,fontWeight:700,letterSpacing:1.5,marginBottom:10,fontFamily:fn}}>DATA SOURCES BY TYPE</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8,marginBottom:16}}>
        {[
          {icon:"🏛",label:"Military / Government",sources:["CENTCOM","IDF","House of Commons"],count:3,color:P.sky},
          {icon:"📡",label:"News Agencies & Wire",sources:["Reuters","AP","BBC","CNN","NPR","NBC","Al Jazeera"],count:7,color:P.aqua},
          {icon:"🔍",label:"OSINT & Research",sources:["Bellingcat","ACLED","Wikipedia"],count:3,color:P.sun},
          {icon:"🏦",label:"Finance & Markets",sources:["Goldman Sachs","Morgan Stanley","Oxford Economics","Kpler"],count:4,color:P.leaf},
          {icon:"🏥",label:"Humanitarian",sources:["WHO","UNICEF","Iranian Red Crescent"],count:3,color:P.rose},
          {icon:"📚",label:"Academic",sources:["CSIS","Penn Wharton","Brown Univ"],count:3,color:P.sage},
        ].map((cat,i)=>(
          <div key={i} style={{border:`1px solid ${cat.color}25`,borderRadius:10,padding:12,background:P.srf}}>
            <div style={{fontSize:20,marginBottom:4}}>{cat.icon}</div>
            <div style={{fontSize:11,fontWeight:700,color:cat.color,fontFamily:fn}}>{cat.label}</div>
            <div style={{fontSize:10,color:P.tx2,marginTop:4}}>{cat.sources.join(", ")}</div>
            <div style={{fontSize:9,color:P.tx3,marginTop:4,fontFamily:fn}}>{cat.count} sources</div>
          </div>
        ))}
      </div>

      <div style={{border:`1px solid ${P.flm}25`,borderRadius:10,padding:14,marginBottom:14,background:`${P.flm}08`}}>
        <div style={{fontSize:10,color:P.flm,fontWeight:700,letterSpacing:1.5,fontFamily:fn,marginBottom:6}}>SANDBOX LIMITATION</div>
        <div style={{fontSize:11,color:P.tx2,lineHeight:1.5}}>
          Claude artifacts can only make API calls to <b style={{color:P.tx}}>api.anthropic.com</b>. All other external domains (n8n webhooks, OpenAI, Google, news sites) are blocked by the sandbox. This means live data comes exclusively from the Claude Sonnet API, which may use web search or its training knowledge depending on availability.
        </div>
      </div>

      <div style={{border:`1px solid ${P.edg}`,borderRadius:10,padding:14,background:P.srf}}>
        <div style={{fontSize:10,color:P.tx3,fontWeight:700,letterSpacing:1.5,fontFamily:fn,marginBottom:8}}>REFRESH BEHAVIOR</div>
        <div style={{fontSize:11,color:P.tx2,lineHeight:1.5}}>
          When you click <b style={{color:P.sky}}>REFRESH LIVE</b>, the artifact calls Claude Sonnet via the Anthropic API. Strategy 1 uses web search for real-time data. Strategy 2 falls back to Sonnet's training knowledge. If both fail, the hardcoded baseline (compiled by Claude Opus from 22 sources) is displayed. Baseline data was last updated <b style={{color:P.tx}}>April 17, 2026</b>.
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// TAB: BIAS AUDIT
// ════════════════════════════════════════════
function AuditTab() {
  return (
    <div>
      <div style={{border:`1px solid ${P.sun}20`,borderRadius:12,padding:16,marginBottom:14,background:`${P.sun}05`}}>
        <div style={{fontSize:11,fontWeight:800,color:P.sun,fontFamily:fn}}>⚖ COGNITIVE BIAS AUDIT</div>
        <div style={{fontSize:11,color:P.tx2,marginTop:6,lineHeight:1.5}}>SOX 404 + ISA audit rigor applied to wartime OSINT. Every assertion requires cross-model verification.</div>
        <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
          {["SOX 302/404","ISA 240","COSO","Basel III","PCAOB"].map(f=>(<span key={f} style={{background:P.edg,padding:"3px 9px",borderRadius:4,fontSize:11,color:P.tx,fontFamily:fn}}>{f}</span>))}
        </div>
      </div>
      {BIASES.map((b,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",padding:"9px 14px",borderLeft:`3px solid ${b.lv==="HIGH"?P.fire:P.sun}`,background:P.srf,borderRadius:"0 8px 8px 0",marginBottom:3}}>
          <div style={{flex:1}}><span style={{fontWeight:700,color:P.tx,fontSize:11}}>{b.nm}</span><span style={{color:P.tx3,fontSize:11,marginLeft:8}}>{b.ds}</span></div>
          <Tag text={b.lv} color={b.lv==="HIGH"?P.fire:P.sun}/>
          <span style={{fontSize:11,color:P.tx3,fontFamily:fn,marginLeft:10}}>{b.fw}</span>
        </div>))}
    </div>
  );
}

// ════════════════════════════════════════════
// TAB: WAR COSTS (Live Running Counter)
// ════════════════════════════════════════════
function CostsTab() {
  // $891.4M/day burn rate per CSIS (confirmed Mar 6, 2026)
  // Rate applies throughout — Pentagon has not published a reduced ceasefire rate
  // Forces remain deployed: 5 CSGs, mine clearance ops, 2,200 Marines, all forces on station
  const WAR_START = new Date("2026-02-28T00:00:00Z").getTime();
  const BURN_RATE_PER_DAY = 891_400_000;
  const BURN_RATE_PER_SEC = BURN_RATE_PER_DAY / 86400; // ~$10,317/sec

  const [cost, setCost] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const secSinceStart = (now - WAR_START) / 1000;
      setCost(secSinceStart * BURN_RATE_PER_SEC);
      setElapsed(Math.floor(secSinceStart));
    };
    tick();
    const t = setInterval(tick, 100);
    return () => clearInterval(t);
  }, []);

  const fmt = (n) => {
    if (n >= 1e12) return `$${(n/1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n/1e9).toFixed(3)}B`;
    if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
    return `$${n.toLocaleString()}`;
  };

  const days = Math.floor(elapsed / 86400);
  const hrs = Math.floor((elapsed % 86400) / 3600);
  const mins = Math.floor((elapsed % 3600) / 60);
  const secs = elapsed % 60;

  const perTaxpayer = cost / 150_000_000; // ~150M US taxpayers
  const snapBenefits = Math.floor(cost / 2400); // ~$200/mo SNAP = $2400/yr
  const teachers = Math.floor(cost / 65000); // avg teacher salary
  const homes = Math.floor(cost / 350000); // avg US home price

  const costBreakdown = [
    { item: "Munitions expended", cost: 1_800_000_000, note: "JDAMs, Tomahawks, MOPs, bombs", color: P.fire },
    { item: "Carrier strike group ops (4 CSGs)", cost: 910_000_000, note: "~$6.5M/day per CSG × 4 × 7 days", color: P.sky },
    { item: "Air operations (1,000+ sorties)", cost: 850_000_000, note: "B-2, F-15E, F-35 flight hours + fuel", color: P.aqua },
    { item: "Missile defense intercepts", cost: 620_000_000, note: "Patriot ($4M each), THAAD ($12.7M each)", color: P.sun },
    { item: "Pre-war buildup & deployment", cost: 630_000_000, note: "Repositioning 300+ aircraft to region", color: P.flm },
    { item: "Equipment losses", cost: 190_000_000, note: "3x F-15Es (friendly fire), damaged assets", color: P.vio },
    { item: "Intelligence & C2", cost: 150_000_000, note: "AWACS, satellites, cyber operations", color: P.sage },
  ];

  const iranCosts = [
    { item: "Ballistic missiles fired (500+)", cost: 2_500_000_000, note: "~$3-5M per MRBM", color: P.fire },
    { item: "Shahed drones (1,000+)", cost: 20_000_000, note: "~$20K per unit — asymmetric cost", color: P.rose },
    { item: "Naval losses (30+ ships)", cost: 3_000_000_000, note: "Frigates, corvettes, patrol boats", color: P.sky },
    { item: "Infrastructure destroyed", cost: 8_000_000_000, note: "IRIB, Parliament, IRGC bases, nuclear sites", color: P.flm },
    { item: "Military bases (26+ provinces)", cost: 5_000_000_000, note: "Missile caves, air defense, radar", color: P.sun },
    { item: "Economic disruption", cost: 15_000_000_000, note: "Oil exports halted, Hormuz closed, sanctions", color: P.vio },
  ];

  const israelCosts = [
    { item: "Air operations (Op Roaring Lion)", cost: 1_200_000_000, note: "100+ aircraft, precision strikes on Iran", color: P.sky },
    { item: "Iron Dome / Arrow intercepts", cost: 800_000_000, note: "Intercepting 90+ Iranian attacks on Israel", color: P.sun },
    { item: "Lebanon front (Hezbollah)", cost: 400_000_000, note: "Strikes on Beirut, southern Lebanon ops", color: P.rose },
    { item: "Reservist mobilization", cost: 300_000_000, note: "70,000 reservists called up", color: P.flm },
    { item: "Civilian damage / emergency", cost: 200_000_000, note: "40+ buildings in Tel Aviv, Beit Shemesh", color: P.fire },
  ];

  const totalIran = iranCosts.reduce((a, c) => a + c.cost, 0);
  const totalIsrael = israelCosts.reduce((a, c) => a + c.cost, 0);

  return (
    <div>
      {/* ── HERO COST COUNTER ── */}
      <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16, background: "linear-gradient(135deg, #1A0505 0%, #120408 40%, #0E0814 100%)", border: `1px solid ${P.fire}25`, boxShadow: `0 0 60px ${P.fire}10, inset 0 0 80px ${P.fire}05` }}>
        {/* Title bar */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${P.fire}15`, textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: P.tx, letterSpacing: 4, fontFamily: fn }}>IRAN WAR COST TRACKER</div>
          <div style={{ fontSize: 9, color: P.tx3, letterSpacing: 2, fontFamily: fn, marginTop: 2 }}>U.S. TAXPAYER DOLLARS · LIVE ESTIMATE</div>
        </div>

        {/* Main counter area */}
        <div style={{ padding: "24px 20px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: P.fire, letterSpacing: 2, fontFamily: fn, fontWeight: 600, marginBottom: 8 }}>OPERATION EPIC FURY — EST. U.S. COST SINCE STRIKES BEGAN</div>

          {/* Big dollar counter with individual digit boxes */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            {(() => {
              const costStr = "$" + Math.floor(cost).toLocaleString("en-US");
              return costStr.split("").map((ch, i) => {
                if (ch === "," || ch === "$") {
                  return (
                    <span key={i} style={{ fontSize: 36, fontWeight: 800, color: ch === "$" ? P.fire : P.tx3, fontFamily: fn, padding: "0 1px" }}>{ch}</span>
                  );
                }
                return (
                  <span key={i} style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 46, fontSize: 32, fontWeight: 800,
                    color: P.fire, fontFamily: fn,
                    background: "linear-gradient(180deg, #2A0A0A 0%, #1A0505 50%, #0F0303 100%)",
                    borderRadius: 5, border: `1px solid ${P.fire}20`,
                    boxShadow: `0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 ${P.fire}10`,
                    textShadow: `0 0 20px ${P.fire}60, 0 0 40px ${P.fire}30`,
                    position: "relative", overflow: "hidden",
                  }}>
                    {/* Flip line in middle */}
                    <span style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: `${P.fire}15` }} />
                    {ch}
                  </span>
                );
              });
            })()}
          </div>

          {/* Burn rate */}
          <div style={{ fontSize: 10, color: P.tx3, fontFamily: fn, marginTop: 10 }}>
            rate: <span style={{ color: P.flm }}>${Math.round(BURN_RATE_PER_SEC).toLocaleString()}/sec</span> · <span style={{ color: P.tx2 }}>~$891,400,000/day (CSIS)</span>
          </div>

          {/* Sustained ops badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 10, padding: "5px 14px", border: `1px solid ${P.fire}30`, borderRadius: 6, background: `${P.fire}08` }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: P.tx, letterSpacing: 2, fontFamily: fn }}>SUSTAINED OPERATIONS</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: P.flm, fontFamily: fn }}>~$891M/day</span>
          </div>
        </div>

        {/* War Clock - segmented display */}
        <div style={{ padding: "12px 20px 18px", display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
          {[
            { val: String(days).padStart(2, "0"), label: "DAYS" },
            { val: String(hrs).padStart(2, "0"), label: "HRS" },
            { val: String(mins).padStart(2, "0"), label: "MIN" },
            { val: String(secs).padStart(2, "0"), label: "SEC" },
          ].map((seg, si) => (
            <div key={si} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {seg.val.split("").map((d, di) => (
                    <span key={di} style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 30, height: 40, fontSize: 24, fontWeight: 800,
                      color: P.fire, fontFamily: fn,
                      background: "linear-gradient(180deg, #2A0808 0%, #180404 50%, #100303 100%)",
                      borderRadius: 6, border: `1px solid ${P.fire}25`,
                      boxShadow: "0 3px 10px rgba(0,0,0,0.6)",
                      textShadow: `0 0 15px ${P.fire}50`,
                      position: "relative", overflow: "hidden",
                    }}>
                      <span style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: `${P.fire}12` }} />
                      {d}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 8, color: P.tx3, fontFamily: fn, letterSpacing: 1, marginTop: 4 }}>{seg.label}</div>
              </div>
              {si < 3 && <span style={{ fontSize: 22, fontWeight: 800, color: P.fire, fontFamily: fn, opacity: secs % 2 === 0 ? 1 : 0.3, transition: "opacity 0.3s", marginBottom: 16 }}>:</span>}
            </div>
          ))}
        </div>

        {/* Source bar */}
        <div style={{ padding: "8px 20px", borderTop: `1px solid ${P.fire}10`, textAlign: "center" }}>
          <div style={{ fontSize: 8, color: P.tx4, fontFamily: fn }}>Sources: CSIS · Center for American Progress · Brown Univ Costs of War · CNN · IPS · NBC</div>
        </div>
      </div>

      {/* Per-taxpayer + equivalency */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <KPI label="Per US Taxpayer" value={`$${perTaxpayer.toFixed(2)}`} accent={P.fire} sub="~150M filers" />
        <KPI label="Burn Rate" value="$891M/day" accent={P.flm} sub="$10,317/second · CSIS confirmed" />
        <KPI label="SNAP Equiv." value={`${(snapBenefits/1e6).toFixed(1)}M people`} accent={P.sun} sub="1 year of benefits" />
        <KPI label="Teacher Salaries" value={`${(teachers/1000).toFixed(0)}K`} accent={P.leaf} sub="@ $65K/year" />
        <KPI label="US Homes" value={`${(homes/1000).toFixed(1)}K`} accent={P.aqua} sub="@ $350K avg" />
      </div>

      {/* US Cost Breakdown */}
      <BarChart title="US COST BREAKDOWN (ESTIMATED)" maxVal={2_000_000_000} data={
        costBreakdown.map(c => ({ label: c.item, val: c.cost, color: c.color, display: fmt(c.cost) }))
      } />

      {/* All parties comparison */}
      <MiniBarGroup title="TOTAL ESTIMATED COST BY PARTY" height={150} data={[
        { label: "United States", val: cost / 1e9, color: P.sky, display: fmt(cost) },
        { label: "Iran (losses)", val: totalIran / 1e9, color: P.fire, display: fmt(totalIran) },
        { label: "Israel", val: totalIsrael / 1e9, color: P.sun, display: fmt(totalIsrael) },
        { label: "Gulf States", val: 3, color: P.vio, display: "~$3B" },
        { label: "Global Economy", val: 50, color: P.flm, display: "~$50B+" },
      ]} />

      {/* Iran losses */}
      <BarChart title="IRAN — MILITARY & ECONOMIC LOSSES (EST.)" maxVal={15_000_000_000} data={
        iranCosts.map(c => ({ label: c.item, val: c.cost, color: c.color, display: fmt(c.cost) }))
      } />

      {/* Israel costs */}
      <BarChart title="ISRAEL — OPERATION COSTS (EST.)" maxVal={1_500_000_000} data={
        israelCosts.map(c => ({ label: c.item, val: c.cost, color: c.color, display: fmt(c.cost) }))
      } />

      {/* Context box */}
      <div style={{ border: `1px solid ${P.sun}20`, borderRadius: 10, padding: 14, marginTop: 12, background: `${P.sun}06` }}>
        <div style={{ fontSize: 10, color: P.sun, fontWeight: 700, letterSpacing: 1.5, fontFamily: fn, marginBottom: 6 }}>COST CONTEXT (LATEST — MAR 6)</div>
        {[
          ["$891.4M/day", "CSIS confirmed burn rate. Air ops $30M/day, naval $15M/day, munitions, deployed forces", P.fire],
          ["$3.7B / 100hrs", "CSIS: first 100 hours of Operation Epic Fury. $3.5B was unbudgeted", P.sun],
          ["$5B+ in 3 days", "Center for American Progress: 'conservative estimate' as of Mar 2", P.flm],
          ["$40-95B", "Penn Wharton: estimated cost of a 2-month war depending on ground troops", P.vio],
          ["$50B request", "Pentagon preparing emergency supplemental bill. Defense CEOs summoned to White House", P.sky],
          ["$44M per intercept", "Cost to shoot down a single Iranian missile (Patriot + THAAD combined)", P.rose],
          ["$33.7B total", "Brown Univ: total US spending on Israel-related ops since Oct 7, 2023", P.sage],
        ].map(([stat, desc, cl], i) => (
          <div key={i} style={{ padding: "7px 12px", borderLeft: `3px solid ${cl}`, marginBottom: 4, background: `${cl}06`, borderRadius: "0 6px 6px 0" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: cl, fontFamily: fn }}>{stat}</span>
            <span style={{ fontSize: 10, color: P.tx2, marginLeft: 8 }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════
const TABS=[
  {id:"dash",lb:"OVERVIEW",ic:"◈",cl:"#F5853F"},{id:"cost",lb:"WAR COSTS",ic:"$",cl:"#F0544F"},{id:"wpn",lb:"WEAPONS",ic:"⚔",cl:"#E9C53A"},{id:"map",lb:"STRIKE MAP",ic:"◎",cl:"#4C9CF5"},
  {id:"tl",lb:"TIMELINE",ic:"▸",cl:"#30C77B"},{id:"mkt",lb:"MARKETS",ic:"△",cl:"#9B6DF5"},{id:"pred",lb:"FORECAST",ic:"◇",cl:"#34BFC9"},
  {id:"spill",lb:"SPILLOVER",ic:"⊕",cl:"#E96DA0"},{id:"src",lb:"SOURCES",ic:"◉",cl:"#21AD99"},{id:"ai",lb:"AI",ic:"⬡",cl:"#4C9CF5"},{id:"aud",lb:"AUDIT",ic:"⚖",cl:"#E9C53A"},
];

export default function App() {
  const [tab,setTab]=useState("dash");
  const { mode, setMode, isDark, P: TP } = useTheme();
  P = TP; // update global P for all child components

  const headlines=[
    "BREAKING: Iran declares Strait of Hormuz 'COMPLETELY OPEN' for commercial vessels during Lebanon ceasefire",
    "S&P 500 crosses 7,100 — NEW ALL-TIME HIGH. Dow +1,005 pts. Russell 2000 ATH. Markets euphoric",
    "Oil CRASHES: Brent -12% to $89. WTI to $83. Erasing nearly all war gains since Feb 28",
    "BUT: Trump says US BLOCKADE of Iranian ports remains 'in full force' until peace deal signed",
    "Israel-Lebanon 10-day ceasefire started. 2,196 killed, 7,061 wounded, 1M+ displaced in Lebanon war",
    "Paris Summit: 49 countries. UK + France leading naval escort + mine clearance mission for Hormuz shipping",
    "Iran war total: 9,226 killed (6,174 military + 3,052 civilian). 26,500+ injured across all factions",
    "Iran military losses: 6,620 killed per Hengaw. IDF estimated 3,000-4,000 soldiers killed by Mar 13",
    "US: 13 KIA, 303 wounded. Israel: 40 killed, 7,453 injured. Iraq PMF: 85+ killed",
    "Maersk cautious: 'transit decision based on risk assessments.' Hapag-Lloyd: 'open questions remain'",
    "13 oil tankers intercepted by US Navy to enforce Iran blockade — all complied without boarding",
    "Islamabad talks collapsed Apr 12. Nuclear issue the sticking point. No next round scheduled",
    "Trump: Iran deal negotiations 'should go very quickly.' Ceasefire expires ~April 22",
    "Iran FM Araghchi: Hormuz open during Lebanon truce. Ships must use 'coordinated route'",
    "Lebanon: first direct Israel-Lebanon talks in decades. Hezbollah conditional acceptance of truce",
    "UN Sec-Gen Guterres: Hormuz reopening 'a step in the right direction.' Hopes for continued dialogue",
    "Macron warns against 'toll system' or privatization of Hormuz. London planning meeting next week",
    "Gas $4.14/gal but should ease if Hormuz stays open. EIA had forecast $4.30 peak in April",
  ];

  return (
    <div style={{background:P.bg,minHeight:"100vh",color:P.tx,fontFamily:fs}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${P.bg}}::-webkit-scrollbar-thumb{background:${P.edg};border-radius:3px}
        button{font-family:inherit}
        body{background:${P.bg};transition:background .3s}
        .cm-sticky{position:sticky;top:0;z-index:100}
        .cm-tabs::-webkit-scrollbar{height:3px}
        .cm-tabs::-webkit-scrollbar-thumb{background:${P.edg};border-radius:2px}
        @media(max-width:768px){
          .cm-title{font-size:16px!important;letter-spacing:2px!important}
          .cm-subtitle{display:none!important}
          .cm-header-right{gap:6px!important}
          .cm-header-right>div:last-child{display:none!important}
          .cm-tabs{flex-wrap:nowrap!important;overflow-x:auto!important}
          .cm-kpi-row{gap:6px!important}
          .cm-kpi{min-width:100px!important;padding:8px 10px!important}
          .cm-kpi-val{font-size:18px!important}
          .cm-kpi-label{font-size:9px!important;letter-spacing:1px!important}
          .cm-kpi-sub{font-size:9px!important}
          .cm-grid2{grid-template-columns:1fr!important}
          .cm-content{padding:10px 10px!important}
          .cm-tab-btn{padding:8px 9px!important;font-size:9px!important}
          .cm-footer{flex-direction:column;text-align:center}
        }
        @media(max-width:480px){
          .cm-title{font-size:13px!important}
          .cm-kpi{min-width:calc(50% - 6px)!important;flex:0 0 calc(50% - 6px)!important}
          .cm-kpi-val{font-size:16px!important}
          .cm-tab-btn{padding:7px 7px!important;font-size:8px!important;gap:3px!important}
        }
      `}</style>

      {/* STICKY HEADER + TABS */}
      <div className="cm-sticky" style={{background:P.bg,transition:"background .3s"}}>
      {/* HEADER */}
      <div style={{background:isDark?"linear-gradient(135deg,#0C0610,#080C14 60%,#0A0E16)":`linear-gradient(135deg,#E8ECF2,#F4F6F9 60%,#EAEFF5)`,borderBottom:`1px solid ${P.fire}15`,padding:"10px 13px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Blink color={P.fire} size={10}/>
            <div>
              <span className="cm-title" style={{fontSize:25,fontWeight:800,color:P.fire,letterSpacing:4,fontFamily:fn}}>CONFLICT MONITOR</span>
              <span className="cm-subtitle" style={{fontSize:11,color:P.tx3,marginLeft:12,fontFamily:fn}}>EPIC FURY · HORMUZ OPEN · LEBANON CEASEFIRE · US BLOCKADE REMAINS</span>
            </div>
          </div>
          <div className="cm-header-right" style={{display:"flex",alignItems:"center",gap:10}}>
            <ThemeToggle mode={mode} setMode={setMode} P={P}/>
            <Blink color={P.fire} size={6}/>
            <span style={{fontSize:11,color:P.fire,fontFamily:fn,fontWeight:700}}>DAY {(()=>{const now=new Date();const start=new Date(2026,1,28);now.setHours(0,0,0,0);start.setHours(0,0,0,0);return Math.round((now-start)/864e5)+1})()}</span>
            <div style={{textAlign:"right"}}><div style={{fontSize:11,color:P.tx3,fontFamily:fn}}>CLAUDE OPUS · 22 SOURCES</div><Clk/></div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="cm-tabs" style={{display:"flex",flexWrap:"wrap",borderBottom:`1px solid ${P.edg}`,padding:"0 10px",background:P.bg}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className="cm-tab-btn" style={{
            display:"flex",alignItems:"center",gap:5,padding:"10px 11px",background:"transparent",
            border:"none",borderBottom:tab===t.id?`2px solid ${P.sun}`:"2px solid transparent",
            color:tab===t.id?P.sun:P.tx3,fontSize:11,fontWeight:700,cursor:"pointer",
            fontFamily:fn,letterSpacing:.8,whiteSpace:"nowrap",transition:"all .2s"}}>
            <span style={{color:tab===t.id?t.cl:`${t.cl}60`,fontSize:11,flexShrink:0}}>{t.ic}</span>{t.lb}
          </button>))}
      </div>
      </div>{/* END STICKY */}

      {/* CONTENT */}
      <div className="cm-content" style={{padding:"16px 18px",minHeight:480}}>
        {tab==="dash"&&<OverviewTab/>}
        {tab==="cost"&&<CostsTab/>}
        {tab==="wpn"&&<WeaponsTab/>}
        {tab==="map"&&<MapTab/>}
        {tab==="tl"&&<TimelineTab/>}
        {tab==="mkt"&&<MarketsTab/>}
        {tab==="pred"&&<ForecastTab/>}
        {tab==="spill"&&<SpillTab/>}
        {tab==="src"&&<SourcesTab/>}
        {tab==="ai"&&<AITab/>}
        {tab==="aud"&&<AuditTab/>}
      </div>

      {/* TICKER */}
      <Ticker items={headlines}/>

      {/* FOOTER */}
      <div className="cm-footer" style={{padding:"8px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4}}>
        <div style={{fontSize:11,color:P.tx4,fontFamily:fn}}>CENTCOM · Bellingcat · Al Jazeera · CNN · NBC · NPR · Goldman Sachs · Morgan Stanley · ACLED · WHO · Kpler</div>
        <div style={{fontSize:11,color:P.tx4,fontFamily:fn}}>Built by <b style={{color:P.tx2}}>Varun Tyagi</b> · Claude Opus + Sonnet</div>
      </div>
      <div style={{padding:"10px 18px",textAlign:"center",borderTop:`1px solid ${P.edg}10`}}>
        <div style={{fontSize:11,color:P.tx4,fontStyle:"italic"}}>"Whoever kills a soul — it is as if he had slain mankind entirely."</div>
        <div style={{fontSize:11,color:P.tx4,marginTop:3}}>— Quran 5:32</div>
      </div>
    </div>
  );
}
