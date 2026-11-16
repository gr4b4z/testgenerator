// Logika quizu „Ułamkowy Trening” – bez DOM, testowana w tests/ulamki.test.mjs.
// Liczby są przechowywane jako dokładne ułamki {n, d}, nigdy jako przybliżone liczby zmiennoprzecinkowe.
"use strict";
/* ---------- arytmetyka ułamków ---------- */
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a||1};
const lcm=(a,b)=>a/gcd(a,b)*b;
function F(n,d=1){if(d<0){n=-n;d=-d}const g=gcd(n,d);return {n:n/g,d:d/g}}
const fAdd=(x,y)=>F(x.n*y.d+y.n*x.d,x.d*y.d), fSub=(x,y)=>F(x.n*y.d-y.n*x.d,x.d*y.d),
      fMul=(x,y)=>F(x.n*y.n,x.d*y.d), fDiv=(x,y)=>F(x.n*y.d,x.d*y.n),
      fEq=(x,y)=>x.n*y.d===y.n*x.d, fLt=(x,y)=>x.n*y.d<y.n*x.d;
const calc=(op,a,b)=>op==='+'?fAdd(a,b):op==='-'?fSub(a,b):op==='·'?fMul(a,b):fDiv(a,b);
function decPlaces(f){for(let k=0;k<=10;k++){if((10**k)%f.d===0)return k}return -1}
const isTerm=f=>decPlaces(f)>=0;
const scaled=(f,p)=>Math.round(f.n*10**p/f.d);
function decStr(f,places){const k=decPlaces(f);const p=places==null?k:places;const v=scaled(f,p);
  let s=String(Math.abs(v));if(p>0){s=s.padStart(p+1,'0');s=s.slice(0,-p)+','+s.slice(-p)}return (v<0?'-':'')+s}

/* ---------- wyświetlanie ---------- */
const frH=(n,d)=>`<span class="fr"><span class="n">${n}</span><span class="d">${d}</span></span>`;
function mixedH(f){const w=Math.floor(f.n/f.d),r=f.n%f.d;
  if(r===0)return `<span class="num">${w}</span>`;
  if(w===0)return frH(r,f.d);
  return `<span class="mx"><span class="num">${w}</span>${frH(r,f.d)}</span>`}
const decH=f=>`<span class="num">${decStr(f)}</span>`;
const opH=o=>o.form==='dec'?decH(o.v):mixedH(o.v);
const OPNAME={'+':'Dodawanie','-':'Odejmowanie','·':'Mnożenie',':':'Dzielenie'};
const OPSHOW={'+':'+','-':'−','·':'·',':':':'};
const CATNAME={frac:'Ułamki zwykłe',dec:'Ułamki dziesiętne',mix:'Zwykłe i dziesiętne'};
const LEVELNAME={1:'Łatwy',2:'Średni',3:'Trudny'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function plural(n,one,few,many){if(n===1)return one;const a=n%10,b=n%100;return (a>=2&&a<=4&&!(b>=12&&b<=14))?few:many}

/* ---------- losowanie ---------- */
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[R(0,a.length-1)];
function properFrac(dMin,dMax){let d,n;do{d=R(dMin,dMax);n=R(1,d-1)}while(gcd(n,d)!==1);return F(n,d)}
function fracOperand(L){
  const c={1:{d:[2,10],w:0,wm:0},2:{d:[2,12],w:.35,wm:3},3:{d:[2,16],w:.55,wm:5}}[L];
  let f=properFrac(c.d[0],c.d[1]);
  if(Math.random()<c.w)f=fAdd(f,F(R(1,c.wm)));
  return f}
function decOperand(p,maxInt){const s=10**p;let m;do{m=R(1,maxInt*s)}while(p>0&&m%10===0);return F(m,s)}

function genFrac(op,L){
  for(let t=0;t<500;t++){
    let a,b;
    if(L===1){
      if(op==='+'||op==='-'){const d=R(3,12);let x,y;
        do{x=R(1,d-1);y=R(1,d-1)}while(gcd(x,d)>1||gcd(y,d)>1||(op==='-'&&x<=y));
        a=F(x,d);b=F(y,d)}
      else{a=properFrac(2,6);b=Math.random()<.35?F(R(2,5)):properFrac(2,6);
        if(op==='·'&&Math.random()<.5)[a,b]=[b,a]}
    }else{
      a=fracOperand(L);b=fracOperand(L);
      if(op==='-'){if(fEq(a,b))continue;if(fLt(a,b))[a,b]=[b,a]}
      if(op==='+'||op==='-'){if(lcm(a.d,b.d)>(L===2?60:144))continue}
      else{const lim=L===2?250:1500;if(a.n*b.n>lim||a.d*b.d>lim||a.n*b.d>lim||a.d*b.n>lim)continue}
    }
    if(op===':'&&fEq(a,b))continue; // a : a = 1 – zbyt banalne
    const r=calc(op,a,b);
    if(r.d>(L===3?300:144))continue;
    return {cat:'frac',op,L,a:{form:'frac',v:a},b:{form:'frac',v:b},r};
  }
  return genFrac(op,1);
}
function genDec(op,L){
  for(let t=0;t<500;t++){
    let a,b;
    if(op==='+'||op==='-'){
      const P=L===1?()=>1:L===2?()=>R(1,2):()=>R(1,3), M=L===1?20:L===2?50:100;
      a=decOperand(P(),M);b=decOperand(P(),M);
      if(op==='-'){if(fEq(a,b))continue;if(fLt(a,b))[a,b]=[b,a]}
    }else if(op==='·'){
      if(L===1){a=decOperand(1,10);b=F(R(2,9))}
      else if(L===2){a=decOperand(1,10);b=decOperand(1,5)}
      else{a=decOperand(R(1,2),12);b=decOperand(1,5)}
      if(Math.random()<.5)[a,b]=[b,a];
    }else{
      let q;
      if(L===1){b=F(R(2,9));q=decOperand(1,10)}
      else if(L===2){b=decOperand(1,5);q=decOperand(R(0,1),20)}
      else{b=pick([decOperand(2,2),decOperand(1,3),F(R(5,95),100)]);q=decOperand(R(1,2),30)}
      a=fMul(b,q);if(decPlaces(a)>4)continue;
    }
    const r=calc(op,a,b);
    if(!isTerm(r)||decPlaces(r)>5)continue;
    return {cat:'dec',op,L,a:{form:'dec',v:a},b:{form:'dec',v:b},r};
  }
  return genDec(op,1);
}
function genMix(op,L){
  const dens=L===1?[2,4,5,10]:[2,4,5,8,10,20,25];
  const fracT=()=>{const d=pick(dens);let n;do{n=R(1,d-1)}while(gcd(n,d)>1);let f=F(n,d);
    if(L>1&&Math.random()<.3)f=fAdd(f,F(R(1,3)));return f};
  const decT=()=>decOperand(L===1?1:R(1,2),L===1?10:20);
  for(let t=0;t<500;t++){
    let a,b,fa,fb;
    if(op===':'){
      if(L===1||Math.random()<.5){b=fracT();a=fMul(b,decOperand(1,L===1?10:20));fa='dec';fb='frac';
        if(decPlaces(a)>3)continue}
      else{a=fracT();b=pick([F(1,2),F(1,4),F(1,5),F(1,10),F(3,2),F(5,2),F(2,5),F(3,4),F(5,4)]);fa='frac';fb='dec'}
    }else{
      a=fracT();b=decT();fa='frac';fb='dec';
      if(Math.random()<.5){[a,b]=[b,a];[fa,fb]=[fb,fa]}
      if(op==='-'){if(fEq(a,b))continue;if(fLt(a,b)){[a,b]=[b,a];[fa,fb]=[fb,fa]}}
    }
    const r=calc(op,a,b);
    if(!isTerm(r)||decPlaces(r)>4)continue;
    return {cat:'mix',op,L,a:{form:fa,v:a},b:{form:fb,v:b},r};
  }
  return genDec(op,L);
}

/* ---------- rozwiązania krok po kroku ---------- */
function toImproperStep(list,withInts){
  const mixed=[],ints=[];
  for(const f of list){const w=Math.floor(f.n/f.d),r=f.n%f.d;
    if(f.d===1){if(withInts)ints.push(`<span class="num">${f.n}</span> = ${frH(f.n,1)}`)}
    else if(w>0)mixed.push(`${mixedH(f)} = ${frH(`${w}·${f.d}+${r}`,f.d)} = ${frH(f.n,f.d)}`)}
  const out=[];
  if(mixed.length)out.push(`Zamieniamy ${mixed.length>1?'liczby mieszane':'liczbę mieszaną'} na ${mixed.length>1?'ułamki niewłaściwe':'ułamek niewłaściwy'}: ${mixed.join(', ')}`);
  if(ints.length)out.push(`Liczbę całkowitą zapisujemy jako ułamek: ${ints.join(', ')}`);
  return out;
}
function finishSteps(N,D,steps){
  const g=gcd(N,D);let n=N/g,d=D/g;
  if(g>1)steps.push(`Skracamy przez ${g} (dzielimy licznik i mianownik przez ${g}): ${frH(N,D)} = ${d===1?`<span class="num">${n}</span>`:frH(n,d)}`);
  else if(d===1&&D!==1)steps.push(`${frH(N,D)} = ${n}`);
  if(d>1&&n>d){const w=Math.floor(n/d),r=n%d;
    steps.push(`Wyłączamy całości (${n} : ${d} = ${w} reszty ${r}): ${frH(n,d)} = ${mixedH(F(n,d))}`)}
}
function fracSteps(op,a,b){
  const s=[];
  if(op==='+'||op==='-'){
    s.push(...toImproperStep([a,b],false));
    const word=op==='+'?'Dodajemy':'Odejmujemy', sym=OPSHOW[op];
    let N,D;
    if(a.d===b.d){D=a.d;N=op==='+'?a.n+b.n:a.n-b.n;
      s.push(`Mianowniki są takie same, więc ${word.toLowerCase()} tylko liczniki: ${frH(a.n,D)} ${sym} ${frH(b.n,D)} = ${frH(`${a.n} ${sym} ${b.n}`,D)} = ${frH(N,D)}`)}
    else{D=lcm(a.d,b.d);const ka=D/a.d,kb=D/b.d,A=a.n*ka,B=b.n*kb;N=op==='+'?A+B:A-B;
      s.push(`Szukamy wspólnego mianownika. Najmniejsza wspólna wielokrotność liczb ${a.d} i ${b.d} to <b>${D}</b>.`);
      const ex=[];if(ka>1)ex.push(`${frH(a.n,a.d)} = ${frH(`${a.n}·${ka}`,`${a.d}·${ka}`)} = ${frH(A,D)}`);
      if(kb>1)ex.push(`${frH(b.n,b.d)} = ${frH(`${b.n}·${kb}`,`${b.d}·${kb}`)} = ${frH(B,D)}`);
      s.push(`Rozszerzamy ${ex.length>1?'ułamki':'ułamek'}: ${ex.join(', ')}`);
      s.push(`${word} liczniki: ${frH(A,D)} ${sym} ${frH(B,D)} = ${frH(N,D)}`)}
    finishSteps(N,D,s);
  }else{
    s.push(...toImproperStep([a,b],true));
    let x=b;
    if(op===':'){x=F(b.d,b.n);
      s.push(`Dzielenie zamieniamy na mnożenie przez odwrotność dzielnika: ${frH(a.n,a.d)} : ${frH(b.n,b.d)} = ${frH(a.n,a.d)} · ${frH(x.n,x.d)}`)}
    const N=a.n*x.n,D=a.d*x.d;
    s.push(`Mnożymy licznik przez licznik i mianownik przez mianownik: ${frH(a.n,a.d)} · ${frH(x.n,x.d)} = ${frH(`${a.n}·${x.n}`,`${a.d}·${x.d}`)} = ${frH(N,D)}`);
    finishSteps(N,D,s);
  }
  return s;
}
function column(aS,bS,rS,sym){const w=Math.max(aS.length,bS.length,rS.length)+2;
  return `<pre class="col">${aS.padStart(w)}\n${(sym+' ').padEnd(w-bS.length)}${bS}\n${'─'.repeat(w)}\n${rS.padStart(w)}</pre>`}
function decSteps(op,a,b){
  const s=[],r=calc(op,a,b),pa=decPlaces(a),pb=decPlaces(b);
  if(op==='+'||op==='-'){
    const p=Math.max(pa,pb),aS=decStr(a,p),bS=decStr(b,p),rS=decStr(r,p);
    if(pa!==pb)s.push(`Wyrównujemy liczbę cyfr po przecinku, dopisując zera: ${pa<p?`${decStr(a)} → <b>${aS}</b>`:`${decStr(b)} → <b>${bS}</b>`}`);
    s.push(`Piszemy liczby jedna pod drugą, przecinek pod przecinkiem, i ${op==='+'?'dodajemy':'odejmujemy'} jak zwykłe liczby:${column(aS,bS,rS,op==='+'?'+':'−')}`);
    if(rS!==decStr(r))s.push(`Zera na końcu po przecinku można skreślić: ${rS} = ${decStr(r)}`);
  }else if(op==='·'){
    const A=scaled(a,pa),B=scaled(b,pb),P=A*B,p=pa+pb,rS=decStr(r,p);
    if(p===0){s.push(`Mnożymy: ${A} · ${B} = ${P}`);return s}
    s.push(`Mnożymy tak, jakby nie było przecinków: ${A} · ${B} = ${P}`);
    s.push(`Liczby mają razem ${pa} + ${pb} = ${p} ${plural(p,'cyfrę','cyfry','cyfr')} po przecinku, więc w wyniku odliczamy od prawej ${p} ${plural(p,'cyfrę','cyfry','cyfr')}: <b>${rS}</b>`);
    if(rS!==decStr(r))s.push(`Zera na końcu po przecinku można skreślić: ${rS} = ${decStr(r)}`);
  }else{
    let A=a,B=b;
    if(pb>0){const k=F(10**pb);A=fMul(a,k);B=fMul(b,k);
      s.push(`Przesuwamy przecinek w obu liczbach o ${pb} ${plural(pb,'miejsce','miejsca','miejsc')} w prawo, żeby dzielnik był liczbą całkowitą: ${decStr(a)} : ${decStr(b)} = <b>${decStr(A)} : ${decStr(B)}</b>`)}
    s.push(`Dzielimy${decPlaces(A)>0?' (przecinek w wyniku stawiamy, gdy dojdziemy do przecinka w dzielnej)':''}: ${decStr(A)} : ${decStr(B)} = <b>${decStr(r)}</b>`);
    s.push(`Sprawdzenie mnożeniem: ${decStr(r)} · ${decStr(B)} = ${decStr(fMul(r,B))} ✓`);
  }
  return s;
}
function toDecText(f){
  const w=Math.floor(f.n/f.d),r=F(f.n-w*f.d,f.d),k=decPlaces(r),m=10**k/r.d;
  let core=m===1?`${frH(r.n,r.d)} = ${decStr(r)}`:`${frH(r.n,r.d)} = ${frH(`${r.n}·${m}`,`${r.d}·${m}`)} = ${frH(r.n*m,10**k)} = ${decStr(r)}`;
  return w>0?`${core}, więc ${mixedH(f)} = ${decStr(f)}`:core;
}
function mixSteps(q){
  const s=[],fr=[q.a,q.b].filter(o=>o.form==='frac').map(o=>o.v);
  s.push(`Zamieniamy ułamek zwykły na dziesiętny (rozszerzamy go tak, żeby w mianowniku było 10, 100 lub 1000): ${fr.map(toDecText).join('; ')}`);
  s.push(...decSteps(q.op,q.a.v,q.b.v));
  if(q.r.d!==1)s.push(`Ten sam wynik jako ułamek zwykły: ${decStr(q.r)} = ${mixedH(q.r)}`);
  return s;
}
function stepsFor(q){return q.cat==='frac'?fracSteps(q.op,q.a.v,q.b.v):q.cat==='dec'?decSteps(q.op,q.a.v,q.b.v):mixSteps(q)}
function hintFor(q){
  const a=q.a.v,b=q.b.v,hasMixed=[a,b].some(f=>f.d>1&&f.n>f.d);
  if(q.cat==='frac'){
    const pre=hasMixed?'Najpierw zamień liczby mieszane na ułamki niewłaściwe. ':'';
    if(q.op==='+'||q.op==='-'){
      if(a.d===b.d)return pre+`Mianowniki są równe. ${q.op==='+'?'Dodaj':'Odejmij'} same liczniki, mianownik zostaje ${a.d}.`;
      return pre+`Sprowadź ułamki do wspólnego mianownika. Spróbuj ${lcm(a.d,b.d)}.`}
    if(q.op==='·')return pre+'Pomnóż licznik przez licznik i mianownik przez mianownik, a potem skróć.';
    return pre+`Zamień dzielenie na mnożenie przez odwrotność dzielnika: odwrotność ${mixedH(b)} to ${frH(b.d,b.n)}.`;
  }
  if(q.cat==='mix')return `Zamień ułamek zwykły na dziesiętny: ${[q.a,q.b].filter(o=>o.form==='frac').map(o=>toDecText(o.v)).join('; ')}`;
  const pa=decPlaces(a),pb=decPlaces(b);
  if(q.op==='+'||q.op==='-')return 'Zapisz liczby jedna pod drugą tak, żeby przecinek był pod przecinkiem. Brakujące miejsca uzupełnij zerami.';
  if(q.op==='·')return `Pomnóż bez przecinków, a w wyniku odlicz od prawej ${pa+pb} ${plural(pa+pb,'cyfrę','cyfry','cyfr')} po przecinku (tyle, ile razem mają obie liczby).`;
  if(pb>0){const k=F(10**pb);return `Przesuń przecinek w obu liczbach o ${pb} w prawo: ${decStr(fMul(a,k))} : ${decStr(fMul(b,k))}.`}
  return 'Dziel jak zwykłe liczby. Przecinek w wyniku postaw w chwili, gdy dojdziesz do przecinka w dzielnej.';
}
