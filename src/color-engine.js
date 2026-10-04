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
    const {Y10,x10:x,y10:y}=item.standard; const Y=Y10/100;
    const X=x*Y/y, Z=(1-x-y)*Y/y;
    let rgb=[
      3.2406*X-1.5372*Y-0.4986*Z,
      -0.9689*X+1.8758*Y+0.0415*Z,
      0.0557*X-0.2040*Y+1.0570*Z
    ].map(v=>Math.max(0,Math.min(1,v))).map(v=>v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055).map(v=>Math.round(v*255));
    return rgb;
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
