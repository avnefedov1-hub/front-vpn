// Hero live moment: a topographic contour map (marching squares over a slow field). The pointer raises a hill that follows with lag.
(()=>{
const cv=document.getElementById('topo');if(!cv)return;const hero=cv.closest('.hero'),ctx=cv.getContext('2d');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;let W=0,H=0,dpr=1,G=14,cols=0,rows=0,F=null,run=false,last=0,t=0;
const P={x:.72,y:.42,tx:.72,ty:.42,h:0,th:0};
function size(){const r=cv.getBoundingClientRect();dpr=Math.min(2,devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;G=W<700?12:14;cols=Math.ceil(W/G)+1;rows=Math.ceil(H/G)+1;F=new Float32Array(cols*rows)}
function field(){const px=P.x*W,py=P.y*H,s2=2*Math.pow(Math.min(W,H)*.22,2);
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const x=i*G,y=j*G,u=x/W,v=y/H;
  let f=Math.sin(u*6.3+t*.2)*.7+Math.cos(v*5.2-t*.15+u*2.1)*.6+Math.sin((u-v)*9.1+t*.11)*.3+Math.cos(u*13+v*4-t*.07)*.12+Math.exp(-(Math.pow(x-W*.76,2)+Math.pow(y-H*.45,2))/(2*Math.pow(Math.min(W,H)*.3,2)))*1.3;
  const dx=x-px,dy=y-py;f+=P.h*Math.exp(-(dx*dx+dy*dy)/s2);F[j*cols+i]=f}}
function draw(){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);ctx.lineJoin='round';
 for(let L=-2,k=0;L<3.4;L+=.14,k++){const major=k%5===0;ctx.beginPath();ctx.strokeStyle=major?'rgba(20,127,114,.7)':'rgba(20,127,114,.32)';ctx.lineWidth=major?1.6:1;
  for(let j=0;j<rows-1;j++)for(let i=0;i<cols-1;i++){const a=F[j*cols+i],b=F[j*cols+i+1],c=F[(j+1)*cols+i+1],d=F[(j+1)*cols+i];
   const idx=(a>L)|((b>L)<<1)|((c>L)<<2)|((d>L)<<3);if(idx===0||idx===15)continue;
   const x=i*G,y=j*G,e=[[x+G*(L-a)/(b-a),y],[x+G,y+G*(L-b)/(c-b)],[x+G*(L-d)/(c-d),y+G],[x,y+G*(L-a)/(d-a)]];
   const S=SEG[idx];for(let q=0;q<S.length;q+=2){ctx.moveTo(e[S[q]][0],e[S[q]][1]);ctx.lineTo(e[S[q+1]][0],e[S[q+1]][1])}}
  ctx.stroke()}}
const SEG=[[],[3,0],[0,1],[3,1],[1,2],[3,0,1,2],[0,2],[3,2],[2,3],[2,0],[0,1,2,3],[2,1],[1,3],[1,0],[0,3],[]];
function frame(now){if(!run)return;requestAnimationFrame(frame);if(now-last<33)return;const dt=Math.min(.1,(now-last)/1000);last=now;t+=dt;
 P.x+=(P.tx-P.x)*.06;P.y+=(P.ty-P.y)*.06;P.h+=(P.th-P.h)*.05;field();draw()}
size();field();draw();hero.classList.add('live');
addEventListener('resize',()=>{size();field();draw()});
if(RM)return; // poster frame only
hero.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();P.tx=(e.clientX-r.left)/r.width;P.ty=(e.clientY-r.top)/r.height;P.th=1.1},{passive:true});
hero.addEventListener('pointerleave',()=>{P.th=0},{passive:true});
new IntersectionObserver(es=>{const v=es[0].isIntersecting;if(v&&!run){run=true;last=performance.now();requestAnimationFrame(frame)}else if(!v)run=false}).observe(hero);
document.addEventListener('visibilitychange',()=>{if(document.hidden)run=false;else if(!run){run=true;last=performance.now();requestAnimationFrame(frame)}});
})();
