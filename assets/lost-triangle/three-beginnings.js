/* Lost Triangle — Three Beginnings v2
   Converted from the design handoff "Lost Triangle - Three Beginnings v2.dc.html"
   to a plain React class (no build step). Four chapters (three constructions +
   one reveal) showing that three different starting pivots (45°, 35.26°, 54.74°)
   all contain the same 1 : √2 : √3 right triangle.
   Defines window.LostTriangleThreeBeginnings, mounted by mathematics.html. */
(function () {
  'use strict';

  class LostTriangleThreeBeginnings extends React.Component {
    constructor(props){
      super(props);
      this.END=60; this.cx=660; this.cy=680; this.KEY='lt_begin2';
      this.HOME={az:-0.55, el:26*Math.PI/180, S:210};
      this.C={ink:'#F0EDE8',blue:'#FFC178',lblBlue:'#FFD9AC',gold:'#5DC26D',lblGold:'#DCDCDC',green:'#85B4F2',act:'#E0349E',len2:'#DF7BEC',ang:'#FFFFFF'};
      this.CH=[0,16,32,48];
      this.CHAP=['BEGIN AT 45°','BEGIN AT 35.26°','BEGIN AT 54.74°','ONE TRIANGLE'];
      this.CHSUB=['fan 45° · rise 45° — √2 : √2 : 2','fan 35.26° · rise 30° — 1 : √3 : 2','fan 54.74° · rise 30° — the box’s own angle','three beginnings · one triangle'];
      this.CHC=['#D8BE8F','#F05BB5','#7FB2E6','#F0EDE8'];
      this.CHIP=['I · 45°','II · 35.26°','III · 54.74°','IV · ONE'];
      var A45=Math.PI/4, A35=Math.atan(1/Math.SQRT2), A54=Math.atan(Math.SQRT2), R45=Math.PI/4, R30=Math.PI/6;
      this.BEG=[
        {az:A45, alt:R45, fanTxt:'45.00°', riseTxt:'45.00°', runLab:'√2', postLab:'√2', runCol:this.C.gold, postCol:this.C.gold, ident:'√2² + √2² = 2²', story:'A square tile, crossed corner to corner — a √2 diagonal. A post √2 tall. The stick is the ramp, leaning at 45°.', story2:'Look at the wall it made — sides 1, √2, √3. Remember that triangle.', Pc:[1,0,0], leg1Lab:'1', leg1Col:this.C.blue, leg2Lab:'1', leg2Col:this.C.blue, wallEdge:true, weLab:'√2', weCol:this.C.gold, lts:['wall'], fc:{floor:'#45C4B0',wall:'#F5A800',section:'#F080F0',oblique:'#47BE7E'}},
        {az:A35, alt:R30, fanTxt:'35.26°', riseTxt:'30.00°', runLab:'√3', postLab:'1', runCol:this.C.green, postCol:this.C.blue, ident:'1² + √3² = 2²', story:'The floor run is √3 — fanned 35.26° off the x-axis. A post one unit tall, and the stick lands at 30°.', story2:'The triangle you were told to remember? You just walked across it — flat on the floor.', Pc:[Math.SQRT2,0,0], leg1Lab:'√2', leg1Col:this.C.gold, leg2Lab:'1', leg2Col:this.C.blue, wallEdge:true, weLab:'√2', weCol:this.C.gold, lts:['floor'], fc:{floor:'#F5A800',wall:'#45C4B0',section:'#47BE7E',oblique:'#F080F0'}},
        {az:A54, alt:R30, fanTxt:'54.74°', riseTxt:'30.00°', runLab:'√3', postLab:'1', runCol:this.C.green, postCol:this.C.blue, ident:'1² + √2² + 1² = 2²', story:'A small box — 1 wide, √2 deep, 1 tall. Run the stick through it corner to corner. It fits, leaning on the box’s own angle: 35.26°.', story2:'The remembered triangle is here twice — on the floor, and standing in the wall.', Pc:[1,0,0], leg1Lab:'1', leg1Col:this.C.blue, leg2Lab:'√2', leg2Col:this.C.gold, wallEdge:true, weLab:'√3', weCol:this.C.green, lts:['floor','wall'], fc:{floor:'#F5A800',wall:'#F5A800',section:'#47BE7E',oblique:'#47BE7E'}}
      ];
      this.BEG.forEach((b)=>{ var fmt=(v)=>{ var r=Math.round(v*100)/100; return (Math.abs(r-Math.round(r))<0.005?Math.round(r):r.toFixed(2))+'°'; };
        var xr=Math.acos(Math.cos(b.alt)*Math.cos(b.az))*180/Math.PI;   // x-axis to rod
        b.xrDeg=xr; b.xrTxt=fmt(xr); b.supTxt=fmt(180-xr);
        b.compLine='x-axis to rod · '+fmt(xr);
        b.supLine=fmt(xr)+' + '+fmt(180-xr)+' = 180°'; });
      this.state={t:0,playing:false,caz:this.HOME.az,cel:this.HOME.el,cS:this.HOME.S,spin:false,dragging:false,focusBeg:null,vw:(typeof window!=='undefined'?window.innerWidth:1280)};
      this._containerRef=(el)=>{this.container=el;if(el)this.fit();};
      this._stageRef=(el)=>{this.stage=el;if(el)this.fit();};
    }

    componentDidMount(){
      var saved=parseFloat(localStorage.getItem(this.KEY));
      if(!isNaN(saved)&&saved>0&&saved<this.END) this.setState({t:saved});
      else if(this.props.autoplay!==false) this.setState({playing:true});
      this._fit=()=>this.fit(); window.addEventListener('resize',this._fit); this.fit();
      this._key=(e)=>{ if(e.key==='ArrowRight'){this.goNext();} else if(e.key==='ArrowLeft'){this.goPrev();} else if(e.key===' '){e.preventDefault();this.toggle();} else if(e.key==='Escape'){this.setState({t:0,playing:false});localStorage.setItem(this.KEY,'0');} else if(e.key==='s'||e.key==='S'){this.setState(s=>({spin:!s.spin}));} };
      window.addEventListener('keydown',this._key);
      this._last=performance.now();
      var loop=(now)=>{ var dt=(now-this._last)/1000; this._last=now;
        if(this.state.playing){ var nt=this.state.t+dt; if(nt>=this.END){nt=this.END;this.setState({t:nt,playing:false});} else this.setState({t:nt});
          if(Math.floor(nt*4)!==this._sv){this._sv=Math.floor(nt*4);localStorage.setItem(this.KEY,nt.toFixed(2));} }
        if(this.state.spin && !this.state.dragging) this.setState(s=>({caz:s.caz+dt*0.10}));
        this._raf=requestAnimationFrame(loop); };
      this._raf=requestAnimationFrame(loop);
    }

    componentWillUnmount(){ cancelAnimationFrame(this._raf); window.removeEventListener('resize',this._fit); window.removeEventListener('keydown',this._key); }

    fit(){
      if(this.state.vw!==window.innerWidth) this.setState({vw:window.innerWidth});
      if(!this.container||!this.stage) return;
      var w=this.container.clientWidth||window.innerWidth;
      var h=this.container.clientHeight||window.innerHeight;
      var s=Math.min(w/1920,h/1080);
      this._scale=s;
      this.stage.style.transform='translate(-50%,-50%) scale('+s+')';
    }

    curCI(){ var ci=0; for(var i=0;i<this.CH.length;i++){ if(this.state.t>=this.CH[i]-0.001) ci=i; } return ci; }
    goStage(i){ var nt=this.CH[i]; this.setState({t:nt,playing:true}); localStorage.setItem(this.KEY,nt.toFixed(2)); }
    goPrev(){ this.goStage(Math.max(0,this.curCI()-1)); }
    goNext(){ this.goStage(Math.min(this.CH.length-1,this.curCI()+1)); }
    toggle(){ if(this.state.t>=this.END) this.setState({t:0,playing:true}); else this.setState(s=>({playing:!s.playing})); }
    onSeek(e){ var v=parseFloat(e.target.value)/1000*this.END; this.setState({t:v,playing:false}); localStorage.setItem(this.KEY,v.toFixed(2)); }
    restart(){ this.setState({t:0,playing:true}); localStorage.setItem(this.KEY,'0'); }
    resetView(){ this.setState({caz:this.HOME.az,cel:this.HOME.el,cS:this.HOME.S,spin:false}); }
    toggleSpin(){ this.setState(s=>({spin:!s.spin})); }

    sm(t,a,b){ if(b<=a) return t>=b?1:0; var e=(t-a)/(b-a); e=e<0?0:e>1?1:e; return e*e*(3-2*e); }
    fio(t,a,b,c,d){ return this.sm(t,a,b)*(1-this.sm(t,c,d)); }
    proj(p){ var a=this.state.caz,ce=Math.cos(a),se=Math.sin(a),el=this.state.cel,S=this.state.cS; var xr=p[0]*ce-p[1]*se, yr=p[0]*se+p[1]*ce; return [this.cx+xr*S, this.cy-(yr*Math.sin(el)+p[2]*Math.cos(el))*S]; }
    L3(a,b,k){ return [a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k]; }
    seg(p0,p1,prog,color,w,o){ o=o||{}; if(prog<=0) return null; var A=this.proj(p0),B0=this.proj(p1),B=[A[0]+(B0[0]-A[0])*prog,A[1]+(B0[1]-A[1])*prog]; return React.createElement('line',{key:'s'+(this._k++),x1:A[0],y1:A[1],x2:B[0],y2:B[1],stroke:color,strokeWidth:w,strokeLinecap:'round',strokeDasharray:o.dash,opacity:o.op==null?1:o.op,filter:o.glow===false?undefined:'url(#lt3b-g)'}); }
    ln2(a,b,color,w,op,dash){ return React.createElement('line',{key:'L'+(this._k++),x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:color,strokeWidth:w,strokeLinecap:'round',opacity:op==null?1:op,strokeDasharray:dash}); }
    dot(p,rad,color,op){ if(op<=0) return null; var P=this.proj(p); return React.createElement('circle',{key:'c'+(this._k++),cx:P[0],cy:P[1],r:rad,fill:color,opacity:op,filter:'url(#lt3b-g)'}); }
    labP(p,txt,color,op,o){ o=o||{}; if(op<=0) return null; var P=this.proj(p); return React.createElement('text',{key:'l'+(this._k++),x:P[0]+(o.dx||0),y:P[1]+(o.dy||0),fill:color,opacity:op,fontSize:o.size||30,fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:o.w||600,textAnchor:o.anchor||'middle',filter:'url(#lt3b-g)'},txt); }
    txt(x,y,s,color,op,o){ o=o||{}; if(op<=0) return null; return React.createElement('text',{key:'x'+(this._k++),x,y,fill:color,opacity:op,fontSize:o.size||34,fontFamily:o.face||"'Cormorant Garamond',serif",fontStyle:o.italic?'italic':'normal',fontWeight:o.w||500,textAnchor:o.anchor||'middle',letterSpacing:o.ls||0,filter:o.glow?'url(#lt3b-g)':undefined},s); }
    arc3(fn,a0,a1,prog,color,o){ o=o||{}; if(prog<=0) return null; var n=30,pts=[]; var a1p=a0+(a1-a0)*prog; for(var i=0;i<=n;i++){ var a=a0+(a1p-a0)*i/n; var P=this.proj(fn(a)); pts.push((i?'L':'M')+P[0].toFixed(1)+' '+P[1].toFixed(1)); } return React.createElement('path',{key:'a'+(this._k++),d:pts.join(' '),fill:'none',stroke:color,strokeWidth:o.w||2.4,strokeDasharray:o.dash||'5 6',opacity:o.op==null?1:o.op,filter:'url(#lt3b-g)'}); }
    rang(O3,A3,B3,c,op){ if(op<=0) return null; var D=this.proj(O3),A=this.proj(A3),B=this.proj(B3); var v1=[A[0]-D[0],A[1]-D[1]],v2=[B[0]-D[0],B[1]-D[1]]; var n1=Math.hypot(v1[0],v1[1])||1,n2=Math.hypot(v2[0],v2[1])||1,s=15; var a=[D[0]+v1[0]/n1*s,D[1]+v1[1]/n1*s],b=[D[0]+v2[0]/n2*s,D[1]+v2[1]/n2*s],cc=[a[0]+v2[0]/n2*s,a[1]+v2[1]/n2*s]; return React.createElement('path',{key:'r'+(this._k++),d:'M '+a[0]+' '+a[1]+' L '+cc[0]+' '+cc[1]+' L '+b[0]+' '+b[1],fill:'none',stroke:c,strokeWidth:2,opacity:op,filter:'url(#lt3b-g)'}); }
    poly3(ps,fill,stroke,sw,op){ if(op<=0) return null; return React.createElement('polygon',{key:'p'+(this._k++),points:ps.map((p)=>{var P=this.proj(p);return P[0].toFixed(1)+','+P[1].toFixed(1);}).join(' '),fill:fill,stroke:stroke||'none',strokeWidth:sw||0,opacity:op}); }
    cen3(ps){ return [(ps[0][0]+ps[1][0]+ps[2][0])/3,(ps[0][1]+ps[1][1]+ps[2][1])/3,(ps[0][2]+ps[1][2]+ps[2][2])/3]; }
    hx(h,a){ return 'rgba('+parseInt(h.slice(1,3),16)+','+parseInt(h.slice(3,5),16)+','+parseInt(h.slice(5,7),16)+','+a+')'; }
    labOut(p,cen,s2,color,op,size,w){ if(op<=0) return null; var P=this.proj(p),Cq=this.proj(cen); var dx=P[0]-Cq[0],dy=P[1]-Cq[1],n=Math.hypot(dx,dy)||1; return this.labP(p,s2,color,op,{dx:dx/n*50,dy:dy/n*50+9,size:size||28,w:w||600}); }
    tipOf(b,cAz,cAlt){ return [2*Math.cos(cAlt)*Math.cos(cAz),2*Math.cos(cAlt)*Math.sin(cAz),2*Math.sin(cAlt)]; }
    fmtT(s){ s=Math.max(0,Math.round(s)); return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2); }

    legend(push,op){
      var x=1360,y0=220;
      push(this.txt(x,y0-30,'LINE LEGEND','rgba(240,237,232,.35)',op,{size:12,anchor:'start',face:"'Space Mono',monospace",ls:3}));
      var rows=[['1',this.C.blue,null,1],['√2',this.C.gold,null,1],['2',this.C.len2,null,1],['√3',this.C.green,null,1],['angle',this.C.ang,'5 6',0],['motion','#E5484D','7 7',0]];
      rows.forEach((r,i)=>{ var y=y0+i*32;
        push(React.createElement('line',{key:'lg'+(this._k++),x1:x,y1:y,x2:x+40,y2:y,stroke:r[1],strokeWidth:3,strokeLinecap:'round',strokeDasharray:r[2]||undefined,opacity:op}));
        if(r[3]) push(React.createElement('text',{key:'lgt'+(this._k++),x:x+54,y:y+9,fill:r[1],opacity:op,fontSize:23,fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:600,textAnchor:'start'},r[0]));
        else push(this.txt(x+54,y+6,r[0],r[1],op*0.85,{size:15,anchor:'start',face:"'Space Grotesk',sans-serif",ls:1.5}));
      });
      var xs=x+180;
      push(this.txt(xs,y0-30,'SURFACES','rgba(240,237,232,.35)',op,{size:12,anchor:'start',face:"'Space Mono',monospace",ls:3}));
      var surf=[['1 + 1 + √2','#45C4B0'],['1 + 2 + √3','#47BE7E'],['1 + √2 + √3 · the Lost Triangle','#F5A800'],['2 + √2 + √2','#F080F0']];
      surf.forEach((r,i)=>{ var y=y0+i*32;
        push(React.createElement('rect',{key:'lgs'+(this._k++),x:xs,y:y-8,width:26,height:16,rx:3,fill:this.hx(r[1],0.45),stroke:r[1],strokeWidth:1.2,opacity:op}));
        push(this.txt(xs+40,y+6,r[0],'#DCDCDC',op*0.85,{size:15,anchor:'start',face:"'Space Grotesk',sans-serif",ls:1}));
      });
    }

    scaffold(push,fade){
      var C=this.C, O=[0,0,0];
      for(var i=0;i<=3;i++){ push(this.ln2(this.proj([i,0,0]),this.proj([i,3,0]),'rgba(240,237,232,0.05)',1,fade)); push(this.ln2(this.proj([0,i,0]),this.proj([3,i,0]),'rgba(240,237,232,0.05)',1,fade)); }
      push(this.ln2(this.proj(O),this.proj([3.3,0,0]),'rgba(169,205,238,0.30)',1.6,fade));
      push(this.ln2(this.proj(O),this.proj([0,3.3,0]),'rgba(169,205,238,0.30)',1.6,fade));
      push(this.ln2(this.proj(O),this.proj([0,0,2.4]),'rgba(169,205,238,0.30)',1.6,fade));
      var Px=this.proj([3.3,0,0]),Py=this.proj([0,3.3,0]),Pz=this.proj([0,0,2.4]);
      push(this.txt(Px[0]+16,Px[1]+6,'x','rgba(169,205,238,0.6)',fade,{size:26,italic:true,anchor:'start'}));
      push(this.txt(Py[0]+12,Py[1]+4,'y','rgba(169,205,238,0.6)',fade,{size:26,italic:true,anchor:'start'}));
      push(this.txt(Pz[0]-4,Pz[1]-14,'z','rgba(169,205,238,0.6)',fade,{size:26,italic:true,anchor:'middle'}));
      push(this.dot(O,6,C.ink,fade));
    }

    computeFrame(){
      var t=this.state.t,C=this.C,k=[],O=[0,0,0]; this._k=0;
      var push=(e)=>{ if(e) k.push(e); };
      var ci=this.curCI();

      push(React.createElement('defs',{key:'d'},
        React.createElement('filter',{id:'lt3b-g',x:'-60%',y:'-60%',width:'220%',height:'220%'},
          React.createElement('feGaussianBlur',{stdDeviation:2.4,result:'b'}),
          React.createElement('feMerge',null,React.createElement('feMergeNode',{in:'b'}),React.createElement('feMergeNode',{in:'SourceGraphic'})))));
      push(React.createElement('rect',{key:'bd',x:30,y:30,width:1860,height:1020,fill:'none',stroke:'rgba(240,237,232,0.06)',strokeWidth:1.5}));
      push(this.txt(64,80,'GREGG FLEISHMAN · THREE BEGINNINGS','rgba(240,237,232,0.30)',1,{size:17,anchor:'start',face:"'Space Mono',monospace",ls:3}));
      push(this.txt(88,148,('0'+(ci+1)).slice(-2)+' / 04','rgba(240,237,232,0.30)',1,{size:17,anchor:'start',face:"'Space Mono',monospace",ls:3}));

      var caption=null, capOp=0, ctaOp=0;
      this.legend(push,0.85);

      if(ci<3){
        var b=this.BEG[ci], tau=t-this.CH[ci];
        var grow=this.sm(tau,0,2);
        var cAz=b.az*this.sm(tau,2,4.5);
        var cAlt=b.alt*this.sm(tau,4.5,7);
        this.scaffold(push,1);
        var tip=this.tipOf(b,cAz,cAlt);
        var tipG=[tip[0]*grow,tip[1]*grow,tip[2]*grow];
        var floorFull=[2*Math.cos(b.alt)*Math.cos(b.az),2*Math.cos(b.alt)*Math.sin(b.az),0];
        var tipFull=this.tipOf(b,b.az,b.alt);
        var cenT=[(b.Pc[0]+floorFull[0]+tipFull[0])/4,(b.Pc[1]+floorFull[1]+tipFull[1])/4,tipFull[2]/4];
        var az=b.az, alt=b.alt;
        var fanP=this.sm(tau,2,4.5);
        push(this.arc3((a)=>[0.82*Math.cos(a),0.82*Math.sin(a),0],0,az,fanP,C.ang,{op:0.85}));
        if(fanP>0.15) push(this.labP([0.95*Math.cos(az/2),0.95*Math.sin(az/2),0],b.fanTxt,C.lblGold,this.sm(tau,2.5,3.4),{size:26,dy:30}));
        var riseP=this.sm(tau,4.5,7);
        push(this.arc3((a)=>[0.82*Math.cos(a)*Math.cos(az),0.82*Math.cos(a)*Math.sin(az),0.82*Math.sin(a)],0,alt,riseP,C.ang,{op:0.85}));
        var fanTrail=0.8*this.sm(tau,2,2.4)*(1-this.sm(tau,4.8,5.9));
        if(fanTrail>0) push(this.arc3((a)=>[2*Math.cos(a),2*Math.sin(a),0],0,az,fanP,'#E5484D',{dash:'7 7',w:2.6,op:fanTrail}));
        var riseTrail=0.8*this.sm(tau,4.5,4.9)*(1-this.sm(tau,7.2,8.3));
        if(riseTrail>0) push(this.arc3((a)=>[2*Math.cos(a)*Math.cos(az),2*Math.cos(a)*Math.sin(az),2*Math.sin(a)],0,alt,riseP,'#E5484D',{dash:'7 7',w:2.6,op:riseTrail}));
        if(riseP>0.15) push(this.labP([0.82*Math.cos(alt/2)*Math.cos(az),0.82*Math.cos(alt/2)*Math.sin(az),0.82*Math.sin(alt/2)],b.riseTxt,C.lblGold,this.sm(tau,5,5.9),{size:26,dx:-12,dy:-14}));
        var cf=this.sm(tau,7,9), cp=this.sm(tau,7.6,9.5);
        push(this.seg(O,floorFull,cf,b.runCol,3.4,{dash:'10 9',op:0.92}));
        push(this.seg(floorFull,tipFull,cp,b.postCol,3.4,{dash:'10 9',op:0.92}));
        push(this.rang(floorFull,O,tipFull,'rgba(255,255,255,.85)',cp));
        if(cf>0.6) push(this.labOut(this.L3(O,floorFull,0.5),cenT,b.runLab,b.runCol,cf,30));
        if(cp>0.6) push(this.labOut(this.L3(floorFull,tipFull,0.5),cenT,b.postLab,b.postCol,cp,30));
        var settle=this.sm(tau,7,8.2);
        push(this.seg(O,tipG,1,C.act,10,{op:0.22*(1-settle),glow:false}));
        push(this.seg(O,tipG,1,C.act,4.2,{op:1-settle}));
        push(this.seg(O,tipG,1,C.len2,10,{op:0.18*settle,glow:false}));
        push(this.seg(O,tipG,1,C.len2,4.6,{op:settle}));
        if(settle>0.4) push(this.labOut(this.L3(O,tipFull,0.52),cenT,'2',C.len2,settle,32));
        push(this.dot(tipG,6,settle>0.5?C.len2:C.act,this.sm(tau,0.3,1.4)));
        var runEnd=floorFull, Pc=b.Pc;
        var g1=this.sm(tau,9.5,10.5), g2=this.sm(tau,10.2,11.2), ge=this.sm(tau,11,12), ltO=this.sm(tau,12,13.2);
        push(this.seg(O,Pc,g1,b.leg1Col,3,{op:0.85}));
        if(g1>0.6) push(this.labOut(this.L3(O,Pc,0.5),cenT,b.leg1Lab,b.leg1Col,g1,28));
        push(this.seg(Pc,runEnd,g2,b.leg2Col,3,{op:0.85}));
        if(g2>0.6) push(this.labOut(this.L3(Pc,runEnd,0.5),cenT,b.leg2Lab,b.leg2Col,g2,28));
        if(b.wallEdge){ push(this.seg(Pc,tipFull,ge,b.weCol,3,{dash:'7 7',op:0.85})); if(ge>0.6) push(this.labOut(this.L3(Pc,tipFull,0.5),cenT,b.weLab,b.weCol,ge,28)); }
        if(ltO>0){
          var faces=[
            {ps:[O,Pc,runEnd], nm:'floor'},
            {ps:[Pc,runEnd,tipFull], nm:'wall'},
            {ps:[O,runEnd,tipFull], nm:'section'},
            {ps:[O,Pc,tipFull], nm:'oblique'}
          ];
          faces.forEach((f,fi)=>{
            var fp=ltO*this.sm(tau,12+fi*0.3,12.9+fi*0.3);
            if(fp<=0) return;
            var col=b.fc[f.nm], isLT=b.lts.indexOf(f.nm)>=0;
            push(this.poly3(f.ps,this.hx(col,(isLT?0.22:0.10)*fp),isLT?this.hx(col,0.7*fp):'none',isLT?1.4:0,1));
            if(isLT) push(this.rang(f.nm==='floor'?Pc:runEnd,f.nm==='floor'?O:Pc,f.nm==='floor'?runEnd:tipFull,'rgba(255,255,255,.85)',fp));
          });
          push(this.labP(this.cen3(b.lts[0]==='floor'?[O,Pc,runEnd]:[Pc,runEnd,tipFull]),'1 : √2 : √3','#F5A800',ltO*this.fio(tau,12.4,13,15.2,15.8),{size:22}));
        }
        var chipOp=this.sm(tau,8.5,9.5);
        if(chipOp>0){
          push(React.createElement('rect',{key:'chip',x:72,y:400,width:436,height:64,rx:12,fill:'rgba(200,169,110,0.06)',stroke:'rgba(200,169,110,0.4)',strokeWidth:1,opacity:chipOp}));
          push(this.txt(94,430,'IDENTITY','rgba(227,208,172,.7)',chipOp,{size:12,anchor:'start',face:"'Space Mono',monospace",ls:3}));
          push(this.txt(94,452,b.ident,C.lblGold,chipOp,{size:24,anchor:'start',italic:true}));
        }
        var angleMode=this.props.angleMode||'both';
        var angFade=this.sm(tau,9.6,10.3);
        var angSweep=this.sm(tau,9.6,11.4);
        if(angFade>0&&angleMode!=='none'){
          var lines=angleMode==='both'?[b.compLine,b.supLine]:angleMode==='supplement'?[b.supLine]:[b.compLine];
          var ah=40+lines.length*26;
          push(React.createElement('rect',{key:'achip',x:72,y:480,width:436,height:ah,rx:12,fill:'rgba(240,237,232,0.05)',stroke:'rgba(240,237,232,0.22)',strokeWidth:1,opacity:angFade}));
          push(this.txt(94,510,'ANGLE COMPLETES','rgba(227,208,172,.7)',angFade,{size:12,anchor:'start',face:"'Space Mono',monospace",ls:3}));
          lines.forEach((ln,li)=>{ push(this.txt(94,536+li*26,ln,'#F0EDE8',angFade,{size:21,anchor:'start',italic:true})); });
          var rod=tipFull, rl=Math.hypot(rod[0],rod[1],rod[2])||1, rh=[rod[0]/rl,rod[1]/rl,rod[2]/rl];
          var thRod=Math.acos(Math.max(-1,Math.min(1,rh[0])));           // x-axis to rod, in the (x-axis, rod) plane
          var pl=Math.hypot(rh[1],rh[2])||1, nh=[0,rh[1]/pl,rh[2]/pl];   // in-plane up direction (leans toward y)
          var vp=(R)=>((a)=>[R*Math.cos(a),R*Math.sin(a)*nh[1],R*Math.sin(a)*nh[2]]);
          var drawSweep=(a0,a1,txt,col,R)=>{
            var fn=vp(R);
            push(this.arc3(fn,a0,a1,angSweep,col,{w:3.2,op:angFade}));
            if(angSweep>0.55){ var am=a0+(a1-a0)*angSweep, lp=fn(am);
              push(this.labP([lp[0]*1.14,lp[1]*1.14,lp[2]*1.14],txt,col,angFade,{size:30,anchor:'middle',italic:true,glow:true}));
            }
          };
          if(angleMode==='complement'||angleMode==='both') drawSweep(0,thRod,b.xrTxt,'#8AD1FF',1.0);
          if(angleMode==='supplement'||angleMode==='both') drawSweep(Math.PI,thRod,b.supTxt,'#E8C34A',1.32);
        }
        var cap2=this.fio(tau,12.2,13.2,15.4,16);
        if(cap2>0){ caption=b.story2; capOp=cap2; }
        else { caption=b.story; capOp=this.fio(tau,7.5,8.5,11.4,12); }
      } else {
        // REVEAL — step back: all three constructions, everything fades but the same triangle glowing in each
        var tau3=t-this.CH[3];
        var fadeOthers=this.sm(tau3,4.0,6.2);
        this.scaffold(push,0.5*(1-0.6*fadeOthers));
        var gA=this.sm(tau3,0,2.4);
        var fb=(this.state.focusBeg==null?-1:this.state.focusBeg);
        var ghost=this.sm(tau3,1.8,3.2);
        var dimmed=1-0.72*fadeOthers;
        for(var bi=0;bi<3;bi++){
          var bb=this.BEG[bi];
          var fmul=(fb<0||fb===bi)?1:0.08;
          var tp=this.tipOf(bb,bb.az,bb.alt); var tg=[tp[0]*gA,tp[1]*gA,tp[2]*gA];
          var fl=[tp[0],tp[1],0];
          // rod
          push(this.seg(O,tg,1,C.len2,9,{op:0.20*dimmed*fmul,glow:false}));
          push(this.seg(O,tg,1,C.len2,3.6,{op:dimmed*fmul}));
          push(this.dot(tg,5.5,C.len2,gA*dimmed*fmul));
          // ghost construction (context for the triangles)
          push(this.seg(O,fl,ghost,'rgba(240,237,232,0.5)',1.8,{dash:'10 9',op:0.55*dimmed*fmul}));
          push(this.seg(fl,tp,ghost,'rgba(240,237,232,0.5)',1.8,{dash:'10 9',op:0.55*dimmed*fmul}));
          push(this.seg(O,bb.Pc,ghost,'rgba(240,237,232,0.5)',1.6,{dash:'7 7',op:0.45*dimmed*fmul}));
          push(this.seg(bb.Pc,fl,ghost,'rgba(240,237,232,0.5)',1.6,{dash:'7 7',op:0.45*dimmed*fmul}));
          if(bb.wallEdge) push(this.seg(bb.Pc,tp,ghost,'rgba(240,237,232,0.5)',1.6,{dash:'7 7',op:0.45*dimmed*fmul}));
          // the same triangle, glowing in place
          var ltp=this.sm(tau3,4.2+bi*0.9,5.4+bi*0.9)*fmul;
          if(ltp>0){
            var tris={floor:[O,bb.Pc,fl],wall:[bb.Pc,fl,tp]};
            bb.lts.forEach((nm)=>{ var T=tris[nm];
              push(this.poly3(T,this.hx('#F5A800',0.20*ltp),this.hx('#F5A800',0.85*ltp),2.2,1));
            });
            var cT=this.cen3(bb.lts[0]==='floor'?tris.floor:tris.wall);
            push(this.labP(cT,'1 : √2 : √3','#F5A800',ltp*this.fio(tau3,5+bi*0.9,5.6+bi*0.9,10.6,11.2),{size:22}));
          }
        }
        // revelation flash on the 45° wall
        var fl0=this.tipOf(this.BEG[0],this.BEG[0].az,this.BEG[0].alt);
        var wallCen=this.cen3([this.BEG[0].Pc,[fl0[0],fl0[1],0],fl0]);
        var flash=this.sm(tau3,7.4,8.8);
        if(flash>0&&flash<1){ var WP=this.proj(wallCen); push(React.createElement('circle',{key:'fr',cx:WP[0],cy:WP[1],r:26+250*flash,fill:'none',stroke:C.act,strokeWidth:4*(1-flash),opacity:0.9*(1-flash),filter:'url(#lt3b-g)'})); }
        caption='Step back — three different beginnings, and the same triangle is glowing in all three. Sides 1, √2, √3. You cannot avoid it.';
        capOp=this.fio(tau3,4.6,5.6,10.6,11.2);
        ctaOp=this.sm(tau3,8.8,10.2);
      }

      if(caption) push(this.txt(960,928,caption,C.ink,capOp,{size:30,italic:true}));

      var scene=React.createElement('svg',{viewBox:'0 0 1920 1080',width:'100%',height:'100%',role:'img',style:{position:'absolute',inset:0,display:'block'}},k);
      var chips=this.CH.map((_,i)=>({
        label:this.CHIP[i], title:this.CHAP[i],
        bg:i===ci?'rgba(200,169,110,0.16)':'rgba(240,237,232,0.04)',
        fg:i===ci?'#E3D0AC':'rgba(240,237,232,0.5)',
        border:i===ci?'rgba(200,169,110,0.5)':'rgba(240,237,232,0.10)',
        onClick:()=>this.goStage(i)
      }));
      var focusChips=['ALL','I · 45°','II · 35.26°','III · 54.74°'].map((lb,i)=>{
        var v=i-1, on=(this.state.focusBeg==null?-1:this.state.focusBeg)===v;
        return { label:lb,
          bg:on?'rgba(200,169,110,0.16)':'rgba(240,237,232,0.04)',
          fg:on?'#E3D0AC':'rgba(240,237,232,0.5)',
          border:on?'rgba(200,169,110,0.5)':'rgba(240,237,232,0.10)',
          onClick:()=>this.setState({focusBeg:v}) };
      });
      return {
        scene, ci, chips, focusChips,
        chapterTitle:this.CHAP[ci], chapterSub:this.CHSUB[ci],
        chapterColor:this.CHC[ci], chapterGlow:this.CHC[ci]+'55',
        chapterOp:this.sm(t,this.CH[ci],this.CH[ci]+0.6),
        ctaOp,
        focusDisplay:ci===3?'flex':'none',
        playIcon:this.state.playing?'❚❚':'▶',
        scrubVal:Math.round(t/this.END*1000),
        timeLabel:this.fmtT(t)+' / '+this.fmtT(this.END)
      };
    }

    render(){
      var f=this.computeFrame();
      var navScale=this.state.vw<420?0.78:(this.state.vw<640?0.88:1);
      var cr=React.createElement;

      return cr('div',{ref:this._containerRef,style:{position:'relative',width:'100%',height:'100vh',background:'#0B0B0B',overflow:'hidden'}},
        cr('div',{
          ref:this._stageRef,
          onPointerDown:(e)=>{ if(e.button!==0) return; this._px=e.clientX; this._py=e.clientY; this.setState({dragging:true}); try{e.currentTarget.setPointerCapture(e.pointerId);}catch(_){} },
          onPointerMove:(e)=>{ if(!this.state.dragging) return; var s=this._scale||1; var dx=(e.clientX-this._px)/s, dy=(e.clientY-this._py)/s; this._px=e.clientX; this._py=e.clientY;
            this.setState(st=>({caz:st.caz+dx*0.004, cel:Math.max(0.10,Math.min(1.38,st.cel+dy*0.004))})); },
          onPointerUp:()=>{ if(this.state.dragging) this.setState({dragging:false}); },
          onPointerLeave:()=>{ if(this.state.dragging) this.setState({dragging:false}); },
          onWheel:(e)=>{ e.preventDefault(); this.setState(st=>({cS:Math.max(90,Math.min(340,st.cS*(1-e.deltaY*0.0011)))})); },
          style:{position:'absolute',left:'50%',top:'50%',width:'1920px',height:'1080px',transformOrigin:'center center',touchAction:'none',cursor:this.state.dragging?'grabbing':'grab'}
        },
          cr('div',{style:{position:'absolute',inset:0,background:'radial-gradient(ellipse 72% 64% at 50% 44%, #16140F 0%, #0E0E0D 54%, #0B0B0B 100%)'}}),

          cr('div',{style:{position:'absolute',left:'72px',top:'150px',pointerEvents:'none'}},
            cr('div',{style:{fontFamily:"'Syne', sans-serif",fontWeight:800,fontSize:'40px',letterSpacing:'-0.01em',maxWidth:'460px',color:f.chapterColor,opacity:f.chapterOp,transition:'color .5s ease',textShadow:'0 0 40px '+f.chapterGlow}},f.chapterTitle),
            cr('div',{style:{fontFamily:"'Space Grotesk', sans-serif",fontWeight:400,fontSize:'15px',letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(138,132,128,.72)',marginTop:'13px',opacity:f.chapterOp}},f.chapterSub)
          ),

          cr('div',{style:{position:'absolute',left:'50%',bottom:'64px',transform:'translateX(-50%)',pointerEvents:'none',whiteSpace:'nowrap',fontFamily:"'Space Mono', monospace",fontSize:'16px',letterSpacing:'.14em',color:'rgba(240,237,232,.34)'}},'drag to orbit · wheel to zoom · S spins · ⊙ resets'),

          f.scene,

          cr('div',{style:{position:'absolute',left:'72px',top:'300px',display:f.focusDisplay,flexDirection:'column',alignItems:'flex-start',gap:'8px'}},
            cr('div',{style:{fontFamily:"'Space Mono', monospace",fontSize:'12px',letterSpacing:'.24em',color:'rgba(240,237,232,.35)'}},'TETRAHEDRON'),
            ...f.focusChips.map((fc,i)=>cr('button',{key:'fchip'+i,onClick:fc.onClick,style:{height:'32px',padding:'0 12px',border:'1px solid '+fc.border,borderRadius:'8px',background:fc.bg,color:fc.fg,fontFamily:"'Space Mono', monospace",fontSize:'11px',letterSpacing:'.08em',cursor:'pointer',whiteSpace:'nowrap',transition:'background .15s ease, border-color .15s ease, color .15s ease, transform .1s ease'}},fc.label))
          ),

          cr('div',{style:{position:'absolute',left:'50%',bottom:'250px',transform:'translateX(-50%)',opacity:f.ctaOp,textAlign:'center',pointerEvents:'none',whiteSpace:'nowrap'}},
            cr('div',{style:{fontFamily:"'Cormorant Garamond', serif",fontStyle:'italic',fontSize:'19px',letterSpacing:'.22em',textTransform:'uppercase',color:'#8A8480',marginBottom:'20px'}},'every path arrives at the same wall'),
            cr('div',{style:{display:'inline-block',fontFamily:"'Syne', sans-serif",fontSize:'16px',fontWeight:700,letterSpacing:'.28em',textTransform:'uppercase',color:'#C8A96E',border:'1px solid rgba(200,169,110,.45)',borderRadius:'3px',padding:'16px 44px',background:'rgba(200,169,110,.06)',animation:'lt3b-pulse-glow 3s ease-in-out infinite'}},'The Lost Triangle · 1 : √2 : √3'),
            cr('div',{style:{marginTop:'20px',fontFamily:"'Cormorant Garamond', serif",fontStyle:'italic',fontSize:'15px',letterSpacing:'.06em',color:'rgba(138,132,128,.6)'}},'gregg fleishman')
          )
        ),

        cr('div',{style:{position:'absolute',bottom:'16px',left:'50%',transform:'translateX(-50%) scale('+navScale+')',transformOrigin:'bottom center',display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:'8px',padding:'8px 14px',background:'rgba(12,11,10,.80)',backdropFilter:'blur(14px)',border:'1px solid rgba(240,237,232,.09)',borderRadius:'14px',boxShadow:'0 10px 34px rgba(0,0,0,.55)',fontFamily:"'Space Grotesk', sans-serif",maxWidth:'94vw',zIndex:10}},
          cr('button',{onClick:()=>this.goPrev(),title:'previous chapter',style:{width:'36px',height:'36px',border:'none',borderRadius:'9px',background:'rgba(240,237,232,.06)',color:'#F0EDE8',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},'‹'),
          cr('button',{onClick:()=>this.toggle(),title:'play / pause',style:{width:'40px',height:'40px',border:'none',borderRadius:'9px',background:'rgba(200,169,110,.16)',color:'#F0EDE8',fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},f.playIcon),
          cr('button',{onClick:()=>this.goNext(),title:'next chapter',style:{width:'36px',height:'36px',border:'none',borderRadius:'9px',background:'rgba(240,237,232,.06)',color:'#F0EDE8',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},'›'),
          cr('div',{style:{width:'1px',height:'18px',background:'rgba(240,237,232,.10)'}}),
          cr('div',{style:{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'4px',alignItems:'center',maxWidth:'min(64vw, 460px)'}},
            f.chips.map((c,i)=>cr('button',{key:'chip'+i,onClick:c.onClick,title:c.title,style:{height:'32px',padding:'0 clamp(6px, 1.6vw, 11px)',border:'1px solid '+c.border,borderRadius:'8px',background:c.bg,color:c.fg,fontFamily:"'Space Mono', monospace",fontSize:'clamp(9px, 2vw, 11px)',letterSpacing:'.08em',cursor:'pointer',whiteSpace:'nowrap'}},c.label))
          ),
          cr('div',{style:{width:'1px',height:'18px',background:'rgba(240,237,232,.10)'}}),
          cr('button',{onClick:()=>this.restart(),title:'restart (Esc)',style:{width:'34px',height:'34px',border:'none',borderRadius:'9px',background:'rgba(240,237,232,.06)',color:'#F0EDE8',fontSize:'15px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},'↺'),
          cr('button',{onClick:()=>this.resetView(),title:'reset camera',style:{width:'34px',height:'34px',border:'none',borderRadius:'9px',background:'rgba(240,237,232,.06)',color:'#F0EDE8',fontSize:'15px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},'⊙'),
          cr('button',{onClick:()=>this.toggleSpin(),title:'toggle slow orbit (S)',style:{width:'34px',height:'34px',border:'none',borderRadius:'9px',background:this.state.spin?'rgba(200,169,110,0.20)':'rgba(240,237,232,.06)',color:this.state.spin?'#E3D0AC':'#F0EDE8',fontSize:'15px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},'⟳'),
          cr('div',{style:{width:'1px',height:'18px',background:'rgba(240,237,232,.10)'}}),
          cr('input',{className:'lt-scrub',type:'range',min:'0',max:'1000',value:f.scrubVal,onChange:(e)=>this.onSeek(e),style:{width:'190px'}}),
          cr('span',{style:{fontSize:'11px',color:'rgba(240,237,232,.40)',letterSpacing:'.10em',minWidth:'86px',textAlign:'right',fontFamily:"'Space Mono', monospace",whiteSpace:'nowrap'}},f.timeLabel)
        )
      );
    }
  }

  window.LostTriangleThreeBeginnings = LostTriangleThreeBeginnings;
})();
