/* Lost Triangle — The Device
   Converted from DC component to plain React class (no build step).
   Defines window.LostTriangleAnimation, mounted by mathematics.html. */
(function () {
  'use strict';

  var cr = React.createElement;

  // Model-true station rod vectors: derived from window.PROOF_MATH27 (Gregg's
  // math27.3dm export, see assets/lost-triangle/fleishman-proof-data-math27.js)
  // rather than typed as idealized constants. Each station's rod is its one
  // "len":"200" (length-2) member centerline. Falls back to the exact unit-
  // vector family if the proof data isn't loaded. Used by LostTriangleConstruction.
  function ltRodsFromProof(PM) {
    if (!PM || !PM.lines) return null;
    var rods = PM.lines.filter(function(l){ return l.len === '200'; }).map(function(l){
      var base = l.a[2] <= l.b[2] ? l.a : l.b, tip = l.a[2] <= l.b[2] ? l.b : l.a;
      return [tip[0]-base[0], tip[1]-base[1], tip[2]-base[2]];
    });
    return rods.length === 3 ? rods : null;
  }
  function ltAz(v){ return Math.atan2(v[1], v[0]) * 180 / Math.PI; }
  function ltAlt(v){ return Math.atan2(v[2], Math.hypot(v[0], v[1])) * 180 / Math.PI; }

  var CARD_BORDERS   = ['#4A90D9','#E0349E','rgba(240,237,232,.65)','#3CCB8E','#C8A96E','#E0349E'];
  var CARD_FSIZES    = ['19px','19px','19px','21px','21px','17px'];
  var CARD_BADGES    = ['1','2','3','σ','✸','2\xd7'];
  var CARD_LABELS    = ['FOLD','EXTRUDE','CLOSE','REFLECT','GENERATE','DOUBLE'];
  var CARD_DESCS     = [
    'the √2 face diagonal — a 45° reflection in the square',
    'rise by exactly 1, orthogonal to the plane',
    'the √3 hypotenuse — the cube’s space diagonal',
    'mirror across its legs → 48 copies tile the cube',
    'a Wythoff seed point → the cubic polyhedron family',
    'double its angles → 70.53° / 109.47° space-filling faces'
  ];

  var CHAIN_LABELS  = ['Lost Triangle','Cubic symmetry','Cube \xb7 Octahedron','Rhombic dodecahedron'];
  var CHAIN_SUBS    = ['1 : √2 : √3','Oₕ \xb7 48 copies','Cuboctahedron \xb7 Trunc-octa','faces 70.53° / 109.47° — fills space'];
  var CHAIN_BORDERS = ['#3CCB8E','#4A90D9','#C8A96E','#E0349E'];
  var CHAIN_BGS     = ['rgba(60,203,142,.05)','rgba(74,144,217,.05)','rgba(200,169,110,.05)','rgba(224,52,158,.05)'];
  var CHAIN_ARROWS  = [
    { label:'reflect σ',  w:82, x2:72, ax:73 },
    { label:'Wythoff seed',    w:98, x2:88, ax:89 },
    { label:'dual',            w:64, x2:54, ax:55 }
  ];

  class LostTriangleDevice extends React.Component {
    constructor(props) {
      super(props);
      this.END=66; this.S=300; this.cx=960; this.cy=560;
      this.el=20*Math.PI/180; this.az0=-0.55; this.KEY='lt_device';
      this.C={ink:'#F0EDE8',blue:'#4A90D9',terra:'#E0349E',gold:'#C8A96E',green:'#3CCB8E'};
      this.CH=[0,9,18,27,39,51];
      this.NAME=['FOLD','EXTRUDE','CLOSE','REFLECT','GENERATE','DOUBLE'];
      this.CAP=[
        'the √2 face diagonal — a 45° fold',
        'rise by exactly 1, orthogonal to the plane',
        'the √3 hypotenuse closes the triangle',
        'mirror across its legs — 48 copies tile the cube',
        'a Wythoff seed opens the cubic family',
        'double the angles — space-filling faces'
      ];
      this.COL=['#4A90D9','#E0349E','#F0EDE8','#3CCB8E','#C8A96E','#E0349E'];
      this.RGB=['74,144,217','224,52,158','240,237,232','60,203,142','200,169,110','224,52,158'];
      this.CHC=['60,203,142','74,144,217','200,169,110','224,52,158'];
      this.O=[0,0,0]; this.E=[1,0,1]; this.V=[1,1,1];
      this.cube=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
      this.edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

      var perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],signs=[];
      for(var a=0;a<2;a++)for(var b=0;b<2;b++)for(var c=0;c<2;c++)signs.push([a?-1:1,b?-1:1,c?-1:1]);
      var G=[]; perms.forEach(function(p){signs.forEach(function(s){G.push([p,s]);});});
      var gp=function(m,p){var pe=m[0],si=m[1];return[si[0]*p[pe[0]],si[1]*p[pe[1]],si[2]*p[pe[2]]];};
      this.TR=G.map((m)=>[gp(m,this.E),gp(m,this.V)]);

      this.CUBO=[[1,1,0],[1,-1,0],[-1,1,0],[-1,-1,0],[1,0,1],[1,0,-1],[-1,0,1],[-1,0,-1],[0,1,1],[0,1,-1],[0,-1,1],[0,-1,-1]];
      this.CUBOE=[];
      for(var i=0;i<12;i++)for(var j=i+1;j<12;j++){
        var d=Math.hypot(this.CUBO[i][0]-this.CUBO[j][0],this.CUBO[i][1]-this.CUBO[j][1],this.CUBO[i][2]-this.CUBO[j][2]);
        if(Math.abs(d-Math.SQRT2)<1e-6)this.CUBOE.push([i,j]);
      }

      var RDc=[]; for(var x=0;x<2;x++)for(var y=0;y<2;y++)for(var z=0;z<2;z++)RDc.push([x?1:-1,y?1:-1,z?1:-1]);
      var RDax=[[2,0,0],[-2,0,0],[0,2,0],[0,-2,0],[0,0,2],[0,0,-2]];
      this.RDV=RDc.concat(RDax); this.RDE=[];
      var self=this;
      RDc.forEach(function(c,ci){
        for(var ax=0;ax<3;ax++){
          var tt=[0,0,0]; tt[ax]=2*(c[ax]>0?1:-1);
          for(var k=0;k<RDax.length;k++)if(RDax[k][0]===tt[0]&&RDax[k][1]===tt[1]&&RDax[k][2]===tt[2])self.RDE.push([ci,8+k]);
        }
      });

      this.state={t:0,playing:false};
      this.fitEl=null; this.frameEl=null;
      this._fitRef  =(el)=>{this.fitEl  =el; if(el)this.fit();};
      this._frameRef=(el)=>{this.frameEl=el; if(el)this.fit();};
    }

    componentDidMount(){
      var saved=parseFloat(localStorage.getItem(this.KEY));
      if(!isNaN(saved)&&saved>0&&saved<this.END) this.setState({t:saved});
      else if(this.props.autoplay??true) this.setState({playing:true});
      this._key=(e)=>{
        if(e.key==='ArrowRight')this.nextCh();
        else if(e.key==='ArrowLeft')this.prevCh();
        else if(e.key==='Escape')this.restart();
      };
      window.addEventListener('keydown',this._key);
      this._fit=()=>this.fit(); window.addEventListener('resize',this._fit); this.fit();
      this._last=performance.now();
      var loop=(now)=>{
        var dt=Math.min(0.05,(now-this._last)/1000); this._last=now;
        this.setState(s=>{
          if(!s.playing) return null;
          var nt=s.t+dt;
          if(nt>=this.END){nt=this.END; setTimeout(()=>this.setState({playing:false}),0); return {t:nt};}
          if(Math.floor(nt*4)!==this._sv){this._sv=Math.floor(nt*4);localStorage.setItem(this.KEY,nt.toFixed(2));}
          var nci=0;for(var i=0;i<this.CH.length;i++){if(nt>=this.CH[i]-0.001)nci=i;}
          if(nci!==this._ci){this._ci=nci;setTimeout(()=>this._dispatchChapter(nci),0);}
          return {t:nt};
        });
        this._raf=requestAnimationFrame(loop);
      };
      this._raf=requestAnimationFrame(loop);
    }

    componentWillUnmount(){
      cancelAnimationFrame(this._raf);
      window.removeEventListener('keydown',this._key);
      window.removeEventListener('resize',this._fit);
    }

    fit(){
      if(!this.frameEl||!this.fitEl)return;
      var availW=window.innerWidth-28, availH=window.innerHeight-104;
      var s=Math.min(availW/1180,availH/1020,1);
      this.frameEl.style.transform='scale('+s+')';
      this.fitEl.style.width=(1180*s)+'px';
      this.fitEl.style.height=(1020*s)+'px';
    }

    curCI(){var ci=0;for(var i=0;i<this.CH.length;i++){if(this.state.t>=this.CH[i]-0.001)ci=i;}return ci;}
    _dispatchChapter(ci){window.dispatchEvent(new CustomEvent('lt-chapter',{detail:ci}));}
    seekCh(i){i=Math.max(0,Math.min(5,i));this.setState({t:this.CH[i]+0.02,playing:true});localStorage.setItem(this.KEY,this.CH[i].toFixed(2));this._dispatchChapter(i);}
    nextCh(){this.seekCh(this.curCI()+1);}
    prevCh(){this.seekCh(this.curCI()-1);}
    restart(){this.setState({t:0,playing:true});}
    toggle(){if(this.state.t>=this.END)this.setState({t:0,playing:true});else this.setState(s=>({playing:!s.playing}));}
    onSeek(e){var val=parseFloat(e.target.value)/1000*this.END;this.setState({t:val,playing:false});localStorage.setItem(this.KEY,val.toFixed(2));}

    sm(t,a,b){if(b<=a)return t>=b?1:0;var e=(t-a)/(b-a);e=e<0?0:e>1?1:e;return e*e*(3-2*e);}
    fio(t,a,b,c,d){return this.sm(t,a,b)*(1-this.sm(t,c,d));}
    proj(p,sc){sc=sc||this.S;var a=this._az,ce=Math.cos(a),se=Math.sin(a);var xa=p[0]*ce-p[1]*se,ya=p[0]*se+p[1]*ce,za=p[2];var zb=ya*Math.sin(this.el)+za*Math.cos(this.el);return[this.cx+xa*sc,this.cy-zb*sc];}
    mid(a,b){return[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];}

    seg(p0,p1,prog,color,w,sc,o){
      o=o||{}; if(prog<=0)return null;
      var A=this.proj(p0,sc),B0=this.proj(p1,sc),B=[A[0]+(B0[0]-A[0])*prog,A[1]+(B0[1]-A[1])*prog];
      return cr('line',{key:'s'+(this._k++),x1:A[0],y1:A[1],x2:B[0],y2:B[1],stroke:color,strokeWidth:w,strokeLinecap:'round',strokeDasharray:o.dash,opacity:o.op==null?1:o.op,filter:o.glow===false?undefined:'url(#g)'});
    }
    ln(a,b,color,w,op,dash){
      return cr('line',{key:'L'+(this._k++),x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:color,strokeWidth:w,strokeLinecap:'round',opacity:op==null?1:op,strokeDasharray:dash});
    }
    poly(ps,fill,op,sc){
      var pts=ps.map((p)=>{var P=this.proj(p,sc);return P[0].toFixed(1)+','+P[1].toFixed(1);}).join(' ');
      return cr('polygon',{key:'p'+(this._k++),points:pts,fill:fill,stroke:'none',opacity:op});
    }
    dot(p,rad,color,op,sc){
      if(op<=0)return null;
      var P=this.proj(p,sc);
      return cr('circle',{key:'c'+(this._k++),cx:P[0],cy:P[1],r:rad,fill:color,opacity:op,filter:'url(#g)'});
    }
    labP(p,txt,color,op,o){
      o=o||{}; if(op<=0)return null;
      var P=this.proj(p,o.sc);
      return cr('text',{key:'l'+(this._k++),x:P[0]+(o.dx||0),y:P[1]+(o.dy||0),fill:color,opacity:op,fontSize:o.size||32,fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:o.w||600,textAnchor:'middle',filter:'url(#g)'},txt);
    }
    txt(x,y,s,color,op,o){
      o=o||{}; if(op<=0)return null;
      return cr('text',{key:'x'+(this._k++),x,y,fill:color,opacity:op,fontSize:o.size||34,fontFamily:o.face||"'Cormorant Garamond',serif",fontStyle:o.italic?'italic':'normal',fontWeight:o.w||500,textAnchor:o.anchor||'middle',letterSpacing:o.ls||0,filter:o.glow?'url(#g)':undefined},s);
    }
    rang(O3,A3,B3,c,op,sc){
      if(op<=0)return null;
      var D=this.proj(O3,sc),A=this.proj(A3,sc),B=this.proj(B3,sc);
      var v1=[A[0]-D[0],A[1]-D[1]],v2=[B[0]-D[0],B[1]-D[1]];
      var n1=Math.hypot(v1[0],v1[1])||1,n2=Math.hypot(v2[0],v2[1])||1,s=18;
      var a=[D[0]+v1[0]/n1*s,D[1]+v1[1]/n1*s],b=[D[0]+v2[0]/n2*s,D[1]+v2[1]/n2*s],cc=[a[0]+v2[0]/n2*s,a[1]+v2[1]/n2*s];
      return cr('path',{key:'r'+(this._k++),d:'M '+a[0]+' '+a[1]+' L '+cc[0]+' '+cc[1]+' L '+b[0]+' '+b[1],fill:'none',stroke:c,strokeWidth:2,opacity:op,filter:'url(#g)'});
    }

    buildScene(){
      var t=this.state.t,C=this.C,k=[]; this._k=0; this._az=this.az0+0.12*t;
      var push=(e)=>{if(e)k.push(e);};
      var O=this.O,E=this.E,V=this.V;
      var showCube=this.props.showCube??true, showAngles=this.props.showAngles??true;

      push(cr('defs',{key:'d'},
        cr('filter',{id:'g',x:'-60%',y:'-60%',width:'220%',height:'220%'},
          cr('feGaussianBlur',{stdDeviation:2.2,result:'b'}),
          cr('feMerge',null,
            cr('feMergeNode',{in:'b'}),
            cr('feMergeNode',{in:'SourceGraphic'})))));

      var aSc=this.S+80*this.fio(t,17,22,28,32);
      var cubeOp=(showCube?1:0)*this.sm(t,0.3,2)*(1-this.sm(t,46,50)*0.7);
      this.edges.forEach((e)=>{var a=this.proj(this.cube[e[0]],aSc),b=this.proj(this.cube[e[1]],aSc);push(this.ln(a,b,'rgba(74,144,217,0.16)',1.2,cubeOp));});

      var mainOp=1-this.sm(t,27.5,29.5)*0.55;
      var fillp=this.sm(t,18,20)*(1-this.sm(t,27.5,29.5)*0.4);
      if(fillp>0)push(this.poly([O,E,V],'rgba(60,203,142,'+(0.20*fillp)+')',1,aSc));

      var fd=this.sm(t,1,5); push(this.seg(O,E,fd,C.blue,4,aSc,{op:mainOp})); if(fd>0.6)push(this.labP(this.mid(O,E),'√2',C.blue,mainOp,{dy:34,size:30,sc:aSc}));
      var ri=this.sm(t,9.5,13); push(this.seg(E,V,ri,C.terra,4,aSc,{op:mainOp})); if(ri>0.6)push(this.labP(this.mid(E,V),'1',C.terra,mainOp,{dx:30,size:30,sc:aSc}));
      var hy=this.sm(t,18.5,22); push(this.seg(O,V,hy,C.ink,4.4,aSc,{op:mainOp})); if(hy>0.6)push(this.labP(this.mid(O,V),'√3',C.ink,mainOp,{dx:-32,size:30,sc:aSc}));
      push(this.rang(E,O,V,'rgba(60,203,142,.9)',fillp,aSc));

      if(showAngles&&this.fio(t,20,24,30,33)>0){
        var apo=this.fio(t,20,24,30,33)*mainOp;
        push(this.labP(O,'35.25°',C.gold,apo,{dx:54,dy:-26,size:28,sc:aSc}));
        push(this.labP(V,'54.75°',C.gold,apo,{dx:-6,dy:42,size:28,sc:aSc}));
      }

      push(this.dot(O,7,C.ink,this.sm(t,0.3,2),aSc));
      push(this.dot(E,6,C.blue,fd,aSc));
      push(this.dot(V,7,C.ink,hy,aSc));

      var lo=this.sm(t,0.3,2)*mainOp;
      if(lo>0.3){
        push(this.labP(O,'O',C.ink,lo,{dx:-22,dy:6,size:21,sc:aSc}));
        if(fd>0.4)push(this.labP(E,'E',C.ink,fd*mainOp,{dx:20,dy:8,size:21,sc:aSc}));
        if(hy>0.4)push(this.labP(V,'V',C.ink,hy*mainOp,{dx:16,dy:-12,size:21,sc:aSc}));
      }

      var rv=this.fio(t,27.5,29,50,51.5);
      if(rv>0){
        var N=Math.floor(48*this.sm(t,28.5,38));
        for(var i=0;i<N&&i<48;i++){
          push(this.poly([O,this.TR[i][0],this.TR[i][1]],'rgba(60,203,142,0.08)',rv));
          push(this.ln(this.proj(O),this.proj(this.TR[i][0]),'rgba(74,144,217,0.55)',1.2,rv*0.7));
          push(this.ln(this.proj(this.TR[i][0]),this.proj(this.TR[i][1]),'rgba(224,52,158,0.55)',1.2,rv*0.7));
        }
      }

      var wv=this.fio(t,39,40.5,51,52);
      if(wv>0){
        var seed=this.sm(t,39.5,40.8);
        push(this.dot(E,12*seed,C.gold,wv));
        var cloud=this.sm(t,40.5,43);
        this.CUBO.forEach((p)=>push(this.dot(p,6,C.gold,wv*cloud)));
        var ce2=this.sm(t,43,46);
        this.CUBOE.forEach((e)=>push(this.seg(this.CUBO[e[0]],this.CUBO[e[1]],ce2,C.gold,2.4,null,{op:wv})));
        var rd=this.sm(t,46.5,50);
        this.RDE.forEach((e)=>push(this.seg(this.RDV[e[0]],this.RDV[e[1]],rd,C.terra,2.8,this.S*0.62,{op:wv})));
        this.RDV.forEach((p)=>push(this.dot(p,4.5,C.terra,wv*rd,this.S*0.62)));
      }

      var dv=this.fio(t,51.5,53,66,67);
      if(dv>0){
        var pp=150,qq=150*Math.tan(35.264*Math.PI/180),C0=960,C1=560;
        push(cr('polygon',{key:'rh',points:C0+','+(C1-pp)+' '+(C0+qq)+','+C1+' '+C0+','+(C1+pp)+' '+(C0-qq)+','+C1,fill:'rgba(60,203,142,0.16)',stroke:C.green,strokeWidth:3,opacity:dv,filter:'url(#g)'}));
        push(this.txt(C0,C1-pp-16,'70.53°',C.gold,dv,{size:24,italic:true}));
        push(this.txt(C0,C1+pp+34,'70.53°',C.gold,dv,{size:24,italic:true}));
        push(this.txt(C0-qq-14,C1+8,'109.47°',C.gold,dv,{size:22,anchor:'end',italic:true}));
        push(this.txt(C0+qq+14,C1+8,'109.47°',C.gold,dv,{size:22,anchor:'start',italic:true}));
        push(this.txt(C0+qq/2+18,C1-pp/2+10,'120° dihedral',C.gold,dv*this.sm(t,53.5,56),{size:18,italic:true,anchor:'start'}));
      }

      return cr('svg',{viewBox:'500 100 920 920',width:'100%',height:'100%',preserveAspectRatio:'xMidYMid meet',role:'img',style:{position:'absolute',inset:0,display:'block',overflow:'visible'}},k);
    }

    render(){
      var t=this.state.t;
      var ci=this.curCI();
      var scene=this.buildScene();

      var caption   = this.CAP[ci];
      var stepColor = this.COL[ci];
      var stepGlow  = 'rgba('+this.RGB[ci]+',.4)';
      var stepLabel = ('0'+(ci+1)).slice(-2)+' \xb7 '+this.NAME[ci];
      var playIcon  = this.state.playing?'❚❚':'▶';
      var scrubVal  = Math.round(t/this.END*1000);
      var tcMM=Math.floor(t/60); var tcSS=Math.floor(t%60); var tcStr=tcMM+':'+(tcSS<10?'0':'')+tcSS;

      var cards=[];
      for(var j=0;j<6;j++){
        var active=(j===ci);
        cards.push({
          op:     active?1:.5,
          border: active?this.COL[j]:'rgba(240,237,232,.08)',
          shadow: active?'0 0 30px rgba('+this.RGB[j]+',.18)':'none',
          bg:     active?this.COL[j]:'rgba('+this.RGB[j]+',.10)',
          txt:    active?'#0B0B0B':this.COL[j],
          glow:   active?'0 0 22px rgba('+this.RGB[j]+',.5)':'0 0 12px rgba('+this.RGB[j]+',.16)'
        });
      }

      var chIdx=ci<=2?0:ci===3?1:ci===4?2:3;
      var chains=[];
      for(var c2=0;c2<4;c2++){
        var act=chIdx===c2;
        chains.push({op:act?1:.45, glow:act?'0 0 30px rgba('+this.CHC[c2]+',.28)':'none'});
      }
      var chPicks=[2,3,4,5];

      return cr('div',{style:{display:'flex',justifyContent:'center',alignItems:'flex-start',padding:'24px 14px',background:'#070707',minHeight:'100%',boxSizing:'border-box',fontFamily:"'Space Grotesk',sans-serif"}},
        cr('div',{ref:this._fitRef,style:{position:'relative',flex:'0 0 auto'}},
          cr('div',{ref:this._frameRef,style:{position:'relative',width:'1180px',height:'1020px',transformOrigin:'top left',background:'#0B0B0B',border:'1px solid rgba(240,237,232,.06)',boxShadow:'0 30px 90px rgba(0,0,0,.6)',overflow:'hidden'}},

            cr('div',{style:{position:'absolute',inset:0,background:'radial-gradient(ellipse 76% 70% at 52% 42%, #16140F 0%, #0E0E0D 56%, #0A0A0A 100%)'}}),

            cr('div',{style:{position:'absolute',left:'34px',top:'24px',right:'34px'}},
              cr('div',{style:{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'31px',letterSpacing:'-.01em',color:'#F0EDE8',lineHeight:1,textShadow:'0 0 24px rgba(240,237,232,.18)'}},'THE LOST TRIANGLE AS A DEVICE'),
              cr('div',{style:{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'17px',color:'#9b958c',marginTop:'8px'}},'the cube’s characteristic triangle — centre-to-face, centre-to-edge, centre-to-vertex = 1 : √2 : √3')
            ),

            cr('div',{style:{position:'absolute',left:'36px',top:'182px',width:'400px',display:'flex',flexDirection:'column',gap:'18px'}},
              ...cards.map((card,j)=>
                cr('div',{key:'card'+j,onClick:()=>this.seekCh(j),style:{display:'flex',alignItems:'center',gap:'18px',height:'80px',padding:'0 20px',boxSizing:'border-box',background:'rgba(240,237,232,.03)',border:'1px solid '+card.border,borderRadius:'11px',cursor:'pointer',opacity:card.op,boxShadow:card.shadow,transition:'all .4s ease'}},
                  cr('div',{style:{flex:'0 0 auto',width:'48px',height:'48px',borderRadius:'50%',border:'1.5px solid '+CARD_BORDERS[j],background:card.bg,color:card.txt,boxShadow:card.glow,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:CARD_FSIZES[j],transition:'all .4s ease'}},CARD_BADGES[j]),
                  cr('div',null,
                    cr('div',{style:{fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'15px',letterSpacing:'.12em',color:'#F0EDE8'}},CARD_LABELS[j]),
                    cr('div',{style:{fontFamily:"'Space Mono',monospace",fontSize:'11.5px',lineHeight:1.5,color:'rgba(240,237,232,.5)',marginTop:'4px'}},CARD_DESCS[j])
                  )
                )
              )
            ),

            cr('div',{style:{position:'absolute',left:'560px',top:'132px'}},
              cr('div',{style:{fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:'13px',letterSpacing:'.34em',color:'rgba(240,237,232,.75)'}},'THE DEVICE'),
              cr('div',{style:{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'15px',color:'#9b958c',marginTop:'6px'}},'triangle O–E–V = 1 of the 48 pieces the cube’s symmetry cuts it into')
            ),

            cr('div',{style:{position:'absolute',left:'484px',top:'182px',width:'664px',height:'438px',pointerEvents:'none'}},scene),

            cr('div',{style:{position:'absolute',left:'560px',width:'540px',top:'632px',textAlign:'center'}},
              cr('div',{style:{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'26px',color:stepColor,textShadow:'0 0 22px '+stepGlow,transition:'color .4s ease, text-shadow .4s ease',lineHeight:1.2}},caption)
            ),

            cr('div',{style:{position:'absolute',left:'560px',width:'540px',top:'690px',display:'flex',flexDirection:'column',alignItems:'center',gap:'20px'}},
              cr('div',{style:{display:'flex',alignItems:'center',gap:'12px',padding:'9px 16px',borderRadius:'13px',background:'rgba(240,237,232,.04)',border:'1px solid rgba(240,237,232,.08)',fontFamily:"'Space Mono',monospace",width:'436px',boxSizing:'border-box'}},
                cr('button',{onClick:()=>this.prevCh(),style:{flex:'0 0 auto',width:'34px',height:'34px',border:'none',borderRadius:'9px',background:'rgba(240,237,232,.06)',color:'#F0EDE8',fontSize:'15px',cursor:'pointer'}},'‹'),
                cr('button',{onClick:()=>this.toggle(),style:{flex:'0 0 auto',width:'40px',height:'40px',border:'none',borderRadius:'9px',background:'rgba(200,169,110,.18)',color:'#F0EDE8',fontSize:'13px',cursor:'pointer'}},playIcon),
                cr('button',{onClick:()=>this.nextCh(),style:{flex:'0 0 auto',width:'34px',height:'34px',border:'none',borderRadius:'9px',background:'rgba(240,237,232,.06)',color:'#F0EDE8',fontSize:'15px',cursor:'pointer'}},'›'),
                cr('input',{className:'lt-scrub',type:'range',min:0,max:1000,value:scrubVal,onChange:(e)=>this.onSeek(e),style:{flex:'1 1 auto',minWidth:'60px'}}),
                cr('span',{style:{flex:'0 0 auto',fontFamily:"'Space Mono',monospace",fontSize:'10px',letterSpacing:'.08em',color:'rgba(240,237,232,.32)',minWidth:'36px',textAlign:'center',whiteSpace:'nowrap'}},tcStr),
                cr('span',{style:{flex:'0 0 auto',fontSize:'11px',letterSpacing:'.16em',color:'rgba(240,237,232,.6)',minWidth:'96px',textAlign:'right',whiteSpace:'nowrap'}},stepLabel)
              ),
              cr('a',{href:'explore.html',style:{textDecoration:'none',padding:'13px 26px',border:'1px solid rgba(200,169,110,.55)',borderRadius:'4px',background:'rgba(200,169,110,.05)',boxShadow:'0 0 26px rgba(200,169,110,.12)',fontFamily:"'Space Mono',monospace",fontSize:'12px',letterSpacing:'.22em',color:'#C8A96E'}},'ENTER THE CUBE MODEL →')
            ),

            cr('div',{style:{position:'absolute',left:'36px',top:'824px',fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:'13px',letterSpacing:'.26em',color:'rgba(240,237,232,.78)'}},'WHAT THE DEVICE BUILDS'),

            cr('div',{style:{position:'absolute',left:'36px',top:'856px',right:'36px',display:'flex',alignItems:'center'}},
              ...[0,1,2,3].reduce(function(acc,i){
                acc.push(
                  cr('div',{key:'ch'+i,onClick:()=>this.seekCh(chPicks[i]),style:{flex:'1 1 0',minWidth:0,boxSizing:'border-box',padding:'0 14px',height:'86px',border:'1px solid '+CHAIN_BORDERS[i],borderRadius:'10px',background:CHAIN_BGS[i],boxShadow:chains[i].glow,opacity:chains[i].op,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'6px',transition:'all .4s ease'}},
                    cr('div',{style:{fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'15px',color:'#F0EDE8',whiteSpace:i===3?'nowrap':undefined}},CHAIN_LABELS[i]),
                    cr('div',{style:{fontFamily:"'Space Mono',monospace",fontSize:'11px',color:'rgba(240,237,232,.55)',lineHeight:1.4,textAlign:'center'}},CHAIN_SUBS[i])
                  )
                );
                if(i<3){
                  var ar=CHAIN_ARROWS[i];
                  acc.push(
                    cr('div',{key:'ar'+i,style:{flex:'0 0 '+ar.w+'px',position:'relative',height:'86px',display:'flex',alignItems:'center',justifyContent:'center'}},
                      cr('div',{style:{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'14px',color:'#E0349E',position:'absolute',top:'28px',width:'100%',textAlign:'center'}},ar.label),
                      cr('svg',{viewBox:'0 0 '+ar.w+' 16',style:{width:ar.w+'px',height:'16px',marginTop:'16px',overflow:'visible'}},
                        cr('line',{x1:0,y1:8,x2:ar.x2,y2:8,stroke:'rgba(240,237,232,.5)',strokeWidth:1.6,strokeLinecap:'round'}),
                        cr('path',{d:'M '+ar.ax+' 3 L '+ar.w+' 8 L '+ar.ax+' 13 Z',fill:'rgba(240,237,232,.5)'})
                      )
                    )
                  );
                }
                return acc;
              }.bind(this),[])
            )

          ),

          // Scroll chevron — leads to Construction Triangles below
          cr('div',{style:{position:'absolute',bottom:'18px',right:'36px',display:'flex',alignItems:'center',gap:'10px'}},
            cr('button',{
              onClick:()=>{ var el=document.getElementById('lt-root-2'); if(el){ el.scrollIntoView({behavior:'smooth'}); } else { window.location.href='lost-triangle-construction-triangles.html'; } },
              style:{display:'flex',alignItems:'center',gap:'8px',padding:'8px 16px',border:'1px solid rgba(240,237,232,.12)',borderRadius:'8px',background:'rgba(240,237,232,.04)',cursor:'pointer',fontFamily:"'Space Mono',monospace",fontSize:'11px',letterSpacing:'.16em',color:'rgba(240,237,232,.5)',transition:'all .2s'}
            },'CONSTRUCTION TRIANGLES ↓')
          )

        )
      );
    }
  }

  window.LostTriangleAnimation = LostTriangleDevice;

  /* ── Construction Triangles ──────────────────────────────────────────────
     Shows the three triangles embedded in the Lost Triangle (35.26°, 45°,
     54.74°) plus a FAN view. Converted from DC component. */
  class LostTriangleConstruction extends React.Component {
    constructor(props){
      super(props);
      this.END=12; this.KEY='lt_optb_dark';
      var r2=Math.SQRT2;
      var rods=ltRodsFromProof(window.PROOF_MATH27);
      var rodA=rods?rods[0]:[1,1,r2], rodB=rods?rods[1]:[r2,1,1], rodC=rods?rods[2]:[1,r2,1];
      this.V=[
        {v:rodB, az:ltAz(rodB), alt:ltAlt(rodB), run:'√3', rise:'1', tri:'30-60-90 · 1:√3:2', angT:'60°', hl:'o', note:'= Lost Triangle small angle'},
        {v:rodA, az:ltAz(rodA), alt:ltAlt(rodA), run:'√2', rise:'√2', tri:'45-45-90 · 1:1:√2', angT:'45°', hl:'b', note:'= bisector of the two LT angles'},
        {v:rodC, az:ltAz(rodC), alt:ltAlt(rodC), run:'√3', rise:'1', tri:'30-60-90 · 1:√3:2', angT:'60°', hl:'v', note:'= Lost Triangle large angle'}
      ];
      this.ACC=['#7FB2E6','#C8A96E','#E0349E'];
      this.TITLES=['#7FB2E6','#D8BE8F','#F05BB5'];
      this.ANGS=['35.26°','45°','54.74°'];
      this.PHASES=[
        {t:0,   label:'Ground'},
        {t:1.3, label:'Azimuth'},
        {t:3.4, label:'Rise'},
        {t:5.4, label:'Triangle'},
        {t:7,   label:'Lengths'},
        {t:8.6, label:'Key'}
      ];
      this.state={t:0, playing:false, clip:0};
      this.stage=null;
      this._stageRef=(el)=>{ this.stage=el; if(el) this.fit(); };
    }

    componentDidMount(){
      try {
        var saved=JSON.parse(localStorage.getItem(this.KEY));
        if(saved&&typeof saved.t==='number'&&saved.t>0&&saved.t<this.END){
          this.setState({t:saved.t, clip:(saved.clip!=null?saved.clip:0), playing:this.props.autoplay!==false});
        } else if(this.props.autoplay!==false){ this.setState({playing:true}); }
      } catch(e){ if(this.props.autoplay!==false) this.setState({playing:true}); }
      this._fit=()=>this.fit(); window.addEventListener('resize',this._fit); this.fit();
      // 0=FOLD→45°(1), 1=EXTRUDE→35.26°(0), 2=CLOSE→35.26°(0), 3–5→FAN(3)
      this._chMap=[1,0,0,3,3,3];
      this._onChapter=(e)=>{ var c=this._chMap[e.detail]; if(c!=null) this.setClip(c); };
      window.addEventListener('lt-chapter',this._onChapter);
      this._last=performance.now();
      var loop=(now)=>{
        var dt=Math.min(0.05,(now-this._last)/1000); this._last=now;
        this.setState(s=>{
          if(!s.playing) return null;
          var nt=s.t+dt; if(nt>=this.END) nt-=this.END;
          if(Math.floor(nt*4)!==this._sv){ this._sv=Math.floor(nt*4); this.save(nt,s.clip); }
          return {t:nt};
        });
        this._raf=requestAnimationFrame(loop);
      };
      this._raf=requestAnimationFrame(loop);
    }
    componentWillUnmount(){ cancelAnimationFrame(this._raf); window.removeEventListener('resize',this._fit); window.removeEventListener('lt-chapter',this._onChapter); }

    save(t,clip){ try { localStorage.setItem(this.KEY,JSON.stringify({t,clip})); } catch(e){} }
    fit(){
      if(!this.stage||!this.section) return;
      var sw=this.section.offsetWidth, sh=this.section.offsetHeight;
      var s=Math.min(sw/1920, sh/1080);
      this.stage.style.transform='translate(-50%,-50%) scale('+s+')';
    }

    curPhase(){ var t=this.state.t,ci=0; for(var i=0;i<this.PHASES.length;i++){ if(t>=this.PHASES[i].t-1e-6) ci=i; } return ci; }
    goPhase(i){ var nt=this.PHASES[i].t; this.setState({t:nt,playing:false}); this.save(nt,this.state.clip); }
    goPrev(){ this.goPhase(Math.max(0,this.curPhase()-1)); }
    goNext(){ this.goPhase(Math.min(this.PHASES.length-1,this.curPhase()+1)); }
    setClip(i){ this.setState({clip:i}); this.save(this.state.t,i); }

    defs(){ return '<defs><filter id="g2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'; }

    buildScene(V,t,acc){
      var DEG=Math.PI/180,el=22*Math.PI/180,PCX=960,PCY=540,PS=200;
      var AZ=-0.6+0.14*t;
      var INK='#F0EDE8',MUT='#8A8480',GMUT='rgba(240,237,232,0.4)';
      var L1='#4A90D9',L2='#C8A96E',L3='#3CCB8E',L2u='#F0EDE8';
      var ANG='#C8A96E',ANGT='#D8BE8F';
      var LC={'1':L1,'√2':L2,'√3':L3,'2':L2u};
      function proj(p){var ce=Math.cos(AZ),se=Math.sin(AZ);var xa=p[0]*ce-p[1]*se,ya=p[0]*se+p[1]*ce,za=p[2];var zb=ya*Math.sin(el)+za*Math.cos(el);return[PCX+xa*PS,PCY-zb*PS];}
      function sm(tt,a,b){if(b<=a)return tt>=b?1:0;var e=(tt-a)/(b-a);e=e<0?0:e>1?1:e;return e*e*(3-2*e);}
      function A(o){var s='';for(var k in o){if(o[k]!=null)s+=' '+k+'="'+o[k]+'"';}return s;}
      function es(x){return(''+x).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
      function rawln(a,b,c,w,dash,op){return'<line'+A({x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:c,'stroke-width':w,'stroke-linecap':'round','stroke-dasharray':dash,opacity:op==null?1:op})+'/>';}
      function lnXY(a,b,c,w,prog,dash,op){if(prog<=0)return'';var e=[a[0]+(b[0]-a[0])*prog,a[1]+(b[1]-a[1])*prog];return rawln(a,e,c,w,dash,op);}
      function seg(p0,p1,prog,c,w,dash,op){return lnXY(proj(p0),proj(p1),c,w,prog,dash,op);}
      function dot(p,r,c,op){if(op<=0)return'';var P=proj(p);return'<circle'+A({cx:P[0],cy:P[1],r:r,fill:c,opacity:op})+'/>';}
      function poly(ps,fill,op){return'<polygon'+A({points:ps.map(function(p){var P=proj(p);return P[0].toFixed(1)+','+P[1].toFixed(1);}).join(' '),fill:fill,stroke:'none',opacity:op})+'/>';}
      function pl(pts,c,w,op){return'<polyline'+A({points:pts.map(function(P){return P[0].toFixed(1)+','+P[1].toFixed(1);}).join(' '),fill:'none',stroke:c,'stroke-width':w,'stroke-linecap':'round',opacity:op})+'/>';}
      function mid(a,b){return[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];}
      function fam(mono){return mono?"'Space Mono',monospace":"'Cormorant Garamond',serif";}
      function tx(p,dx,dy,s,c,sz,wt,mono){if(!p)return'';var P=proj(p);return'<text'+A({x:P[0]+dx,y:P[1]+dy,fill:c,'font-size':sz,'font-weight':wt||(mono?'400':'600'),'font-style':mono?'normal':'italic','font-family':fam(mono),'text-anchor':'middle'})+'>'+es(s)+'</text>';}
      function txXY(x,y,s,c,sz,wt,anc,mono){return'<text'+A({x:x,y:y,fill:c,'font-size':sz,'font-weight':wt||(mono?'400':'600'),'font-style':mono?'normal':'italic','font-family':fam(mono),'text-anchor':anc||'middle'})+'>'+es(s)+'</text>';}
      function rang(O3,A3,B3,c,op){if(op<=0)return'';var D=proj(O3),Aa=proj(A3),Bb=proj(B3);var v1=[Aa[0]-D[0],Aa[1]-D[1]],v2=[Bb[0]-D[0],Bb[1]-D[1]];var n1=Math.hypot(v1[0],v1[1])||1,n2=Math.hypot(v2[0],v2[1])||1;var s=30,a=[D[0]+v1[0]/n1*s,D[1]+v1[1]/n1*s];var b=[D[0]+v2[0]/n2*s,D[1]+v2[1]/n2*s];var cc=[a[0]+v2[0]/n2*s,a[1]+v2[1]/n2*s];return'<path'+A({d:'M '+a[0]+' '+a[1]+' L '+cc[0]+' '+cc[1]+' L '+b[0]+' '+b[1],fill:'none',stroke:c,'stroke-width':3.5,opacity:op})+'/>';}
      function azArc(azRad,r,prog,c,op){var pts=[],n=20;for(var i=0;i<=n;i++){var f=azRad*prog*i/n;pts.push(proj([r*Math.cos(f),r*Math.sin(f),0]));}return pl(pts,c,5.5,op);}
      function altArc(fh,altRad,r,prog,c,op){var pts=[],n=18;for(var i=0;i<=n;i++){var th=altRad*prog*i/n;pts.push(proj([r*Math.cos(th)*fh[0],r*Math.cos(th)*fh[1],r*Math.sin(th)]));}return pl(pts,c,5,op);}
      function grid(g){if(g<=0)return'';var s='',N=5,GC='#4A90D9',o=g*0.12;for(var i=-N;i<=N;i++){s+=rawln(proj([i,-N,0]),proj([i,N,0]),GC,1,null,o)+rawln(proj([-N,i,0]),proj([N,i,0]),GC,1,null,o);}return s;}
      function ground(g){if(g<=0)return'';var GC='#4A90D9';var s=seg([-5,0,0],[5,0,0],g,GC,1.6,null,g*0.40)+seg([0,-5,0],[0,5,0],g,GC,1.6,null,g*0.40);s+=seg([0,0,0],[0,0,2.2],g,'rgba(240,237,232,0.25)',2,'4 5');return s;}
      function drawLT(ox,oy,w,hl,tt){var Gb=[ox+w,oy],Go=[ox,oy],Gv=[ox+w,oy-w*0.7071];var s='';
        s+='<polygon'+A({points:Gb[0]+','+Gb[1]+' '+Go[0]+','+Go[1]+' '+Gv[0]+','+Gv[1],fill:'rgba(60,203,142,0.06)',stroke:'none'})+'/>';
        s+=rawln(Gb,Go,L2,8)+rawln(Gb,Gv,L1,8)+rawln(Go,Gv,L3,8);
        s+='<path d="M '+(Gb[0]-25)+' '+Gb[1]+' L '+(Gb[0]-25)+' '+(Gb[1]-25)+' L '+Gb[0]+' '+(Gb[1]-25)+'" fill="none" stroke="rgba(60,203,142,.7)" stroke-width="2.8"/>';
        s+=txXY((Go[0]+Gb[0])/2,Gb[1]+35,'√2',L2,30)+txXY(Gb[0]+20,(Gb[1]+Gv[1])/2+8,'1',L1,30,null,'start')+txXY((Go[0]+Gv[0])/2-20,(Go[1]+Gv[1])/2-8,'√3',L3,30);
        if(hl){var P=hl==='o'?Go:hl==='v'?Gv:[(Go[0]+Gv[0])/2,(Go[1]+Gv[1])/2];var pulse=0.45+0.55*(0.5+0.5*Math.sin(tt*2.0));
          s+='<circle'+A({cx:P[0],cy:P[1],r:14,fill:'none',stroke:ANG,'stroke-width':4,opacity:pulse})+'/>'+'<circle'+A({cx:P[0],cy:P[1],r:5.5,fill:ANG,opacity:pulse})+'/>'; }
        s+=txXY(ox+w/2,oy-w*0.7071-26,'the Lost Triangle  1 : √2 : √3',GMUT,22,'400','middle',true);return s;}

      var lt=t%12,v=V.v,O=[0,0,0],foot=[v[0],v[1],0];
      var run=Math.hypot(v[0],v[1]),fh=[v[0]/run,v[1]/run,0];
      var azRad=V.az*DEG,altRad=V.alt*DEG;
      var runC=LC[V.run],riseC=LC[V.rise],hypC=LC['2'];
      var g=sm(lt,0.2,1.3);
      var s=this.defs()+grid(g)+'<g filter="url(#g2)">'+ground(g);
      var azp=sm(lt,1.3,3.4);s+=seg(O,foot,azp,runC,8.5);s+=azArc(azRad,1.6,azp,ANG,0.9*azp);
      if(azp>0.55){var am=proj([1.0*Math.cos(azRad/2),1.0*Math.sin(azRad/2),0]);s+=txXY(am[0],am[1]+12,V.az.toFixed(2)+'°  (xy)',ANGT,34,'600');}
      var altp=sm(lt,3.4,5.4);s+=seg(foot,v,altp,riseC,8.5);s+=altArc(fh,altRad,2.4,altp,ANG,0.9*altp);
      if(altp>0.55){var hm=proj([1.2*Math.cos(altRad/2)*fh[0],1.2*Math.cos(altRad/2)*fh[1],1.2*Math.sin(altRad/2)]);s+=txXY(hm[0]+15,hm[1],V.alt.toFixed(2)+'°  (z-rise)',ANGT,32,'600','start');}
      var trp=sm(lt,5.4,7);if(trp>0)s+=poly([O,foot,v],'rgba(60,203,142,'+(0.13*trp)+')',1);
      var vecp=sm(lt,5.2,7);s+=seg(O,v,vecp,hypC,10);s+=rang(foot,O,v,'rgba(60,203,142,.8)',trp);
      var lp=sm(lt,7,8.6);
      if(lp>0){s+=tx(mid(O,foot),0,40,V.run,runC,40,'600')+tx(mid(foot,v),40,5,V.rise,riseC,40,'600')+tx(mid(O,v),-40,-10,'2',hypC,40,'600')+tx(v,-5,45,V.angT,ANGT,32,'600');}
      s+=dot(O,10,INK,g)+dot(foot,8.5,runC,azp)+dot(v,12,hypC,vecp);
      s+=drawLT(1565,250,175,V.hl,t);
      s+='<text x="70" y="118" fill="'+acc+'" font-size="50" font-weight="800" letter-spacing="-1" font-family="\'Syne\',sans-serif">'+es(V.tri)+'</text>';
      s+='<text x="70" y="1022" fill="rgba(240,237,232,.8)" font-size="33" font-style="italic" font-family="\'Cormorant Garamond\',serif">'+es('xy-plane angle '+V.az.toFixed(2)+'°  '+V.note)+'</text>';
      s+='</g>';
      return s;
    }

    buildFan(t){
      var DEG=Math.PI/180,el=22*Math.PI/180,PCX=920,PCY=660,PS=300;
      var AZ=-0.6+0.14*t;
      var INK='#F0EDE8';
      var ACC=this.ACC,V=this.V,ANGS=this.ANGS;
      function proj(p){var ce=Math.cos(AZ),se=Math.sin(AZ);var xa=p[0]*ce-p[1]*se,ya=p[0]*se+p[1]*ce,za=p[2];var zb=ya*Math.sin(el)+za*Math.cos(el);return[PCX+xa*PS,PCY-zb*PS];}
      function sm(tt,a,b){if(b<=a)return tt>=b?1:0;var e=(tt-a)/(b-a);e=e<0?0:e>1?1:e;return e*e*(3-2*e);}
      function A(o){var s='';for(var k in o){if(o[k]!=null)s+=' '+k+'="'+o[k]+'"';}return s;}
      function es(x){return(''+x).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
      function rawln(a,b,c,w,dash,op){return'<line'+A({x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:c,'stroke-width':w,'stroke-linecap':'round','stroke-dasharray':dash,opacity:op==null?1:op})+'/>';}
      function lnXY(a,b,c,w,prog,dash,op){if(prog<=0)return'';var e=[a[0]+(b[0]-a[0])*prog,a[1]+(b[1]-a[1])*prog];return rawln(a,e,c,w,dash,op);}
      function seg(p0,p1,prog,c,w,dash,op){return lnXY(proj(p0),proj(p1),c,w,prog,dash,op);}
      function dot(p,r,c,op){if(op<=0)return'';var P=proj(p);return'<circle'+A({cx:P[0],cy:P[1],r:r,fill:c,opacity:op})+'/>';}
      function pl(pts,c,w,op){return'<polyline'+A({points:pts.map(function(P){return P[0].toFixed(1)+','+P[1].toFixed(1);}).join(' '),fill:'none',stroke:c,'stroke-width':w,'stroke-linecap':'round',opacity:op})+'/>';}
      function fam(mono){return mono?"'Space Mono',monospace":"'Cormorant Garamond',serif";}
      function txXY(x,y,s,c,sz,wt,anc,mono){return'<text'+A({x:x,y:y,fill:c,'font-size':sz,'font-weight':wt||(mono?'400':'600'),'font-style':mono?'normal':'italic','font-family':fam(mono),'text-anchor':anc||'middle'})+'>'+es(s)+'</text>';}
      function azArc(azRad,r,prog,c,op){var pts=[],n=20;for(var i=0;i<=n;i++){var f=azRad*prog*i/n;pts.push(proj([r*Math.cos(f),r*Math.sin(f),0]));}return pl(pts,c,4,op);}
      function grid(g){if(g<=0)return'';var s='',N=5,GC='#4A90D9',o=g*0.12;for(var i=-N;i<=N;i++){s+=rawln(proj([i,-N,0]),proj([i,N,0]),GC,1,null,o)+rawln(proj([-N,i,0]),proj([N,i,0]),GC,1,null,o);}return s;}
      function ground(g){if(g<=0)return'';var GC='#4A90D9';var s=seg([-5,0,0],[5,0,0],g,GC,1.6,null,g*0.40)+seg([0,-5,0],[0,5,0],g,GC,1.6,null,g*0.40);s+=seg([0,0,0],[0,0,2.4],g,'rgba(240,237,232,0.25)',2,'4 5');return s;}

      var lt=t%12,O=[0,0,0];
      var g=sm(lt,0.2,1.3);
      var s=this.defs()+grid(g)+'<g filter="url(#g2)">'+ground(g);
      var lift=sm(lt,4,7.5);
      V.forEach(function(d,i){var v=d.v,c=ACC[i];var azp=sm(lt,1.3,3.6);
        var tip=[v[0],v[1],v[2]*lift],foot=[v[0],v[1],0];
        s+=azArc(d.az*DEG,1.3,azp,c,0.95*azp);
        s+=seg(O,tip,azp,c,7);
        if(lift>0)s+=lnXY(proj(tip),proj(foot),c,2,1,'6 6',0.5*lift);
        s+=dot(tip,10,c,azp);
      });
      if(lift>0.5){V.forEach(function(d,i){var tip=proj([d.v[0],d.v[1],d.v[2]]);s+=txXY(tip[0]+18,tip[1]-12,'|v|=2',ACC[i],28,'600','start');});}
      s+=dot(O,11,INK,g);
      var kx=1565,ky=220,rel=['= LT small angle','= bisector','= LT large angle'];
      s+=txXY(kx,ky-50,'AZIMUTH KEY','#8A8480',22,'700','start',true);
      V.forEach(function(d,i){var yy=ky+i*58;
        s+=rawln([kx,yy],[kx+46,yy],ACC[i],8);
        s+=txXY(kx+62,yy+8,ANGS[i],INK,30,'600','start');
        s+=txXY(kx+210,yy+6,rel[i],'#8A8480',18,'400','start',true);
      });
      s+='<text x="70" y="118" fill="#D8BE8F" font-size="50" font-weight="800" letter-spacing="-1" font-family="\'Syne\',sans-serif">THE FAN — three length-2 vectors</text>';
      var capt=lift<0.5?'xy-plane angles   35.26°  <  45°  <  54.74°':'…they stand up out of the xy-plane  (z-rise 30° · 45° · 30°)';
      s+='<text x="70" y="1022" fill="rgba(240,237,232,.8)" font-size="33" font-style="italic" font-family="\'Cormorant Garamond\',serif">'+es(capt)+'</text>';
      s+='</g>';
      return s;
    }

    render(){
      var t=this.state.t, ci=this.state.clip;
      var acc=ci<3?this.TITLES[ci]:'#D8BE8F';
      var sceneHTML=ci<3?this.buildScene(this.V[ci],t,acc):this.buildFan(t);
      var cp=this.curPhase();
      var clipName=ci<3?('0'+(ci+1)):'FAN';
      var barLabel=clipName+' · '+this.PHASES[cp].label;
      var playIcon=this.state.playing?'❚❚':'▶';
      var scrubVal=Math.round(t/this.END*1000);

      var clips=this.V.map((d,i)=>{
        var on=i===ci;
        return {key:'c'+i, label:'0'+(i+1), angle:this.ANGS[i],
          bg:on?'rgba(200,169,110,.12)':'transparent',
          fg:on?'#F0EDE8':'rgba(240,237,232,.55)',
          sub:on?this.ACC[i]:'rgba(240,237,232,.38)',
          onClick:()=>this.setClip(i)};
      });
      clips.push({key:'fan', label:'FAN', angle:'all three',
        bg:ci===3?'rgba(200,169,110,.12)':'transparent',
        fg:ci===3?'#F0EDE8':'rgba(240,237,232,.55)',
        sub:ci===3?'#C8A96E':'rgba(240,237,232,.38)',
        onClick:()=>this.setClip(3)});

      var cr=React.createElement;
      return cr('div',{
        ref:(el)=>{ this.section=el; if(el) this.fit(); },
        style:{position:'relative', width:'100%', height:'100vh', background:'#0B0B0B', overflow:'hidden', fontFamily:"'Space Grotesk',sans-serif"}
      },
        // 1920×1080 stage
        cr('div',{
          ref:this._stageRef,
          style:{position:'absolute',left:'50%',top:'50%',width:'1920px',height:'1080px',
            transformOrigin:'center center',
            background:'radial-gradient(ellipse 72% 64% at 50% 44%, #16140F 0%, #0E0E0D 54%, #0B0B0B 100%)',
            boxShadow:'0 30px 80px rgba(0,0,0,.6)'}
        },
          cr('svg',{viewBox:'0 0 1920 1080',width:'100%',height:'100%',role:'img',
            style:{position:'absolute',inset:0,display:'block'},
            dangerouslySetInnerHTML:{__html:sceneHTML}
          })
        ),
        // Back link to Device
        cr('button',{
          onClick:()=>{ var el=document.getElementById('lt-root'); if(el) el.scrollIntoView({behavior:'smooth'}); },
          style:{position:'absolute',top:'16px',left:'16px',zIndex:10,display:'flex',alignItems:'center',gap:'6px',padding:'7px 14px',border:'1px solid rgba(240,237,232,.10)',borderRadius:'8px',background:'rgba(18,18,18,.7)',backdropFilter:'blur(10px)',cursor:'pointer',fontFamily:"'Space Mono',monospace",fontSize:'11px',letterSpacing:'.12em',color:'rgba(240,237,232,.45)'}
        },'↑ THE DEVICE'),
        // Clip switcher
        cr('div',{style:{position:'absolute',top:'16px',left:'50%',
          transform:'translateX(-50%)',
          display:'flex',gap:'6px',padding:'6px',
          background:'rgba(18,18,18,.85)',backdropFilter:'blur(12px)',
          border:'1px solid rgba(240,237,232,.07)',borderRadius:'12px',
          boxShadow:'0 8px 26px rgba(0,0,0,.4)',zIndex:10}
        },
          ...clips.map(c=>
            cr('button',{key:c.key, onClick:c.onClick,
              style:{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'2px',
                padding:'7px 14px',border:'none',borderRadius:'8px',cursor:'pointer',
                transition:'background .15s',background:c.bg}
            },
              cr('span',{style:{fontFamily:"'Space Mono',monospace",fontSize:'13px',fontWeight:700,letterSpacing:'.04em',color:c.fg}},c.label),
              cr('span',{style:{fontFamily:"'Space Mono',monospace",fontSize:'10px',letterSpacing:'.02em',color:c.sub}},c.angle)
            )
          )
        ),
        // Playback nav
        cr('div',{style:{position:'absolute',bottom:'16px',left:'50%',
          transform:'translateX(-50%)',
          display:'flex',alignItems:'center',gap:'12px',padding:'11px 18px',
          background:'rgba(18,18,18,.66)',backdropFilter:'blur(10px)',
          border:'1px solid rgba(240,237,232,.07)',borderRadius:'14px',
          boxShadow:'0 8px 30px rgba(0,0,0,.5)',zIndex:10}
        },
          cr('button',{onClick:()=>this.goPrev(),style:{width:'36px',height:'36px',border:'none',borderRadius:'10px',background:'rgba(240,237,232,.06)',color:'#F0EDE8',fontSize:'15px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},'‹'),
          cr('button',{onClick:()=>this.setState(s=>({playing:!s.playing})),style:{width:'40px',height:'40px',border:'none',borderRadius:'10px',background:'rgba(200,169,110,.16)',color:'#F0EDE8',fontSize:'14px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},playIcon),
          cr('button',{onClick:()=>this.goNext(),style:{width:'36px',height:'36px',border:'none',borderRadius:'10px',background:'rgba(240,237,232,.06)',color:'#F0EDE8',fontSize:'15px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},'›'),
          cr('input',{className:'lt-scrub',type:'range',min:0,max:1000,value:scrubVal,
            onChange:(e)=>{ var v=parseFloat(e.target.value)/1000*this.END; this.setState({t:v,playing:false}); this.save(v,ci); },
            style:{width:'300px'}}),
          cr('span',{style:{fontFamily:"'Space Mono',monospace",fontSize:'11px',color:'#8A8480',letterSpacing:'.14em',textTransform:'uppercase',minWidth:'158px',textAlign:'left',whiteSpace:'nowrap'}},barLabel)
        )
      );
    }
  }

  window.LostTriangleConstruction = LostTriangleConstruction;
})();
