class TraditionalColorEngine{
  constructor(data){this.data=data;this.items=[...(data.colors||[])].sort((a,b)=>a.order-b.order);this.map=new Map(this.items.map(x=>[x.id,x]));}
  getMeta(){return this.data.meta;}
  list(){return this.items.slice();}
  get(id){return this.map.get(id)||null;}
  families(){return [...new Set(this.items.map(x=>x.family))];}
  filter(family="全部",query=""){
    const q=String(query||"").trim().toLowerCase();
    return this.items.filter(x=>(family==="全部"||x.family===family)&&(!q||[x.name,x.commonName,x.family,x.culturalNote].join(" ").toLowerCase().includes(q)));
  }
  displayRGB(item){
    const s=item.standard||{};
    let X,Y,Z;
    if(Number.isFinite(s.Y10)&&Number.isFinite(s.x10)&&Number.isFinite(s.y10)){
      Y=s.Y10/100; X=s.x10*Y/s.y10; Z=(1-s.x10-s.y10)*Y/s.y10;
    }else if(Number.isFinite(s.L)&&Number.isFinite(s.a)&&Number.isFinite(s.b)){
      const fy=(s.L+16)/116, fx=fy+s.a/500, fz=fy-s.b/200;
      const inv=t=>Math.pow(t,3)>.008856?Math.pow(t,3):(116*t-16)/903.3;
      X=.95047*inv(fx); Y=1.00000*inv(fy); Z=1.08883*inv(fz);
    }else return [128,128,128];
    return [
      3.2406*X-1.5372*Y-0.4986*Z,
      -0.9689*X+1.8758*Y+0.0415*Z,
      0.0557*X-0.2040*Y+1.0570*Z
    ].map(v=>Math.max(0,Math.min(1,v)))
     .map(v=>v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055)
     .map(v=>Math.round(v*255));
  }
  displayHex(item){
    return "#"+this.displayRGB(item).map(v=>v.toString(16).padStart(2,"0")).join("").toUpperCase();
  }
}
async function loadTraditionalColorEngine(url="./data/colors.json"){
  const r=await fetch(url,{cache:"no-cache"}); if(!r.ok) throw new Error("Unable to load color data");
  return new TraditionalColorEngine(await r.json());
}
if(typeof window!=="undefined"){window.TraditionalColorEngine=TraditionalColorEngine;window.loadTraditionalColorEngine=loadTraditionalColorEngine;}
if(typeof module!=="undefined"&&module.exports)module.exports={TraditionalColorEngine,loadTraditionalColorEngine};
