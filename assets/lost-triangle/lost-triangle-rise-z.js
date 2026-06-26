/* Lost Triangle — Rise-Z v1
   Converted from DC component to plain React class (no build step).
   Defines window.LostTriangleRiseZ, mounted by mathematics.html. */
(function () {
  'use strict';
  var cr = React.createElement;

  class LostTriangleRiseZ extends React.Component {
    constructor(props){
      super(props);
      this.END=48; this.S=360; this.cx=960; this.cy=560; this.el=22*Math.PI/180; this.az0=-0.6; this.KEY='lt_v1o';
      this.C={ink:'#F0EDE8',blue:'#4A90D9',terra:'#E0349E',gold:'#C8A96E',green:'#3CCB8E',
        lblBlue:'#A9CDEE',lblTerra:'#F58FCF',lblGold:'#E3D0AC'};
      this.COL='#4A90D9'; this.FOOT=[1,1,0];
      this.CH=[0,3.5,9,15,22.5,30.5,38]; this.CHAP=['THE CUBE','THE √2 FACE DIAGONAL','THE RISE & √3','THE LOST TRIANGLE','RECENTRE','REFLECT','WYTHOFF'];
      this.CHCOLOR=['#7FB2E6','#7FB2E6','#F05BB5','#D8BE8F','#D8BE8F','#7FB2E6','#C8A96E'];
      this.O=[0,0,0]; this.Sp=[1,1,1];
      this.cC=[0.5,0.5,0.5]; this.Opc=[0.5,0.5,0.5]; this.Epc=[1,0.5,1]; this.Vpc=[1,1,1];
      this.cube=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
      this.edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      var perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],signs=[];
      for(var a=0;a<2;a++)for(var b=0;b<2;b++)for(var c=0;c<2;c++)signs.push([a?-1:1,b?-1:1,c?-1:1]);
      var G=[]; perms.forEach(function(p){signs.forEach(function(s){G.push([p,s]);});});
      var cC=this.cC;
      var gpc=function(m,p){var pe=m[0],si=m[1];var q=[p[0]-cC[0],p[1]-cC[1],p[2]-cC[2]];return [cC[0]+si[0]*q[pe[0]],cC[1]+si[1]*q[pe[1]],cC[2]+si[2]*q[pe[2]]];};
      this.TR=G.map((m)=>[gpc(m,this.Epc),gpc(m,this.Vpc)]);
      var CUB=[[1,1,0],[1,-1,0],[-1,1,0],[-1,-1,0],[1,0,1],[1,0,-1],[-1,0,1],[-1,0,-1],[0,1,1],[0,1,-1],[0,-1,1],[0,-1,-1]];
      this.CUBO=CUB.map((p)=>[cC[0]+0.5*p[0],cC[1]+0.5*p[1],cC[2]+0.5*p[2]]);
      this.CUBOE=[]; for(var i=0;i<12;i++)for(var j=i+1;j<12;j++){var d=Math.hypot(CUB[i][0]-CUB[j][0],CUB[i][1]-CUB[j][1],CUB[i][2]-CUB[j][2]); if(Math.abs(d-Math.SQRT2)<1e-6)this.CUBOE.push([i,j]);}
      var RDc=[]; for(var x=0;x<2;x++)for(var y=0;y<2;y++)for(var z=0;z<2;z++)RDc.push([x?1:-1,y?1:-1,z?1:-1]);
      var RDax=[[2,0,0],[-2,0,0],[0,2,0],[0,-2,0],[0,0,2],[0,0,-2]];
      var RDVu=RDc.concat(RDax);
      this.RDV=RDVu.map((p)=>[cC[0]+0.4*p[0],cC[1]+0.4*p[1],cC[2]+0.4*p[2]]);
      this.RDE=[]; var self=this; RDc.forEach(function(c,ci){for(var ax=0;ax<3;ax++){var t=[0,0,0];t[ax]=2*(c[ax]>0?1:-1);for(var k=0;k<RDax.length;k++)if(RDax[k][0]===t[0]&&RDax[k][1]===t[1]&&RDax[k][2]===t[2])self.RDE.push([ci,8+k]);}});
      this.state={t:0,playing:false,vw:(typeof window!=='undefined'?window.innerWidth:1280)};
      this._containerRef=(el)=>{this.container=el;if(el)this.fit();};
      this._stageRef=(el)=>{this.stage=el;if(el)this.fit();};
    }

    componentDidMount(){
      var saved=parseFloat(localStorage.getItem(this.KEY));
      if(!isNaN(saved)&&saved>0&&saved<this.END) this.setState({t:saved});
      else if(this.props.autoplay) this.setState({playing:true});
      this._fit=()=>this.fit(); window.addEventListener('resize',this._fit); this.fit();
      this._last=performance.now();
      var loop=(now)=>{ var dt=(now-this._last)/1000; this._last=now;
        if(this.state.playing){ var nt=this.state.t+dt; if(nt>=this.END){nt=this.END;this.setState({t:nt,playing:false});} else this.setState({t:nt});
          if(Math.floor(nt*4)!==this._sv){this._sv=Math.floor(nt*4);localStorage.setItem(this.KEY,nt.toFixed(2));} }
        this._raf=requestAnimationFrame(loop); };
      this._raf=requestAnimationFrame(loop);
    }

    componentWillUnmount(){ cancelAnimationFrame(this._raf); window.removeEventListener('resize',this._fit); }

    fit(){
      if(this.state.vw!==window.innerWidth) this.setState({vw:window.innerWidth});
      if(!this.container||!this.stage) return;
      var w=this.container.clientWidth||window.innerWidth;
      var h=this.container.clientHeight||window.innerHeight;
      var s=Math.min(w/1920,h/1080);
      this.stage.style.transform='translate(-50%,-50%) scale('+s+')';
    }

    curCI(){ var ci=0; for(var i=0;i<this.CH.length;i++){ if(this.state.t>=this.CH[i]-0.001) ci=i; } return ci; }
    goStage(i){ var nt=this.CH[i]; this.setState({t:nt,playing:false}); localStorage.setItem(this.KEY,nt.toFixed(2)); }
    goPrev(){ this.goStage(Math.max(0,this.curCI()-1)); }
    goNext(){ this.goStage(Math.min(this.CH.length-1,this.curCI()+1)); }
    toggle(){ if(this.state.t>=this.END) this.setState({t:0,playing:true}); else this.setState(s=>({playing:!s.playing})); }
    onSeek(e){ var v=parseFloat(e.target.value)/1000*this.END; this.setState({t:v,playing:false}); localStorage.setItem(this.KEY,v.toFixed(2)); }

    sm(t,a,b){ if(b<=a) return t>=b?1:0; var e=(t-a)/(b-a); e=e<0?0:e>1?1:e; return e*e*(3-2*e); }
    fio(t,a,b,c,d){ return this.sm(t,a,b)*(1-this.sm(t,c,d)); }
    proj(p){ var a=this._az,ce=Math.cos(a),se=Math.sin(a); var x=p[0]-0.5,y=p[1]-0.5,z=p[2]-0.5; var xa=x*ce-y*se,ya=x*se+y*ce,za=z; var zb=ya*Math.sin(this.el)+za*Math.cos(this.el); return [this.cx+xa*this.S,this.cy-zb*this.S]; }
    L3(a,b,k){ return [a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k]; }

    seg(p0,p1,prog,color,w,o){ o=o||{}; if(prog<=0) return null; var A=this.proj(p0),B0=this.proj(p1),B=[A[0]+(B0[0]-A[0])*prog,A[1]+(B0[1]-A[1])*prog]; return cr('line',{key:'s'+(this._k++),x1:A[0],y1:A[1],x2:B[0],y2:B[1],stroke:color,strokeWidth:w,strokeLinecap:'round',strokeDasharray:o.dash,opacity:o.op==null?1:o.op,filter:'url(#rzg)'}); }
    ln(a,b,color,w,op){ return cr('line',{key:'L'+(this._k++),x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:color,strokeWidth:w,strokeLinecap:'round',opacity:op==null?1:op}); }
    poly(ps,fill,op){ var pts=ps.map((p)=>{var P=this.proj(p);return P[0].toFixed(1)+','+P[1].toFixed(1);}).join(' '); return cr('polygon',{key:'p'+(this._k++),points:pts,fill:fill,stroke:'none',opacity:op}); }
    dot(p,rad,color,op){ if(op<=0) return null; var P=this.proj(p); return cr('circle',{key:'c'+(this._k++),cx:P[0],cy:P[1],r:rad,fill:color,opacity:op,filter:'url(#rzg)'}); }
    labP(p,txt,color,op,o){ o=o||{}; if(op<=0) return null; var P=this.proj(p); return cr('text',{key:'l'+(this._k++),x:P[0]+(o.dx||0),y:P[1]+(o.dy||0),fill:color,opacity:op,fontSize:o.size||30,fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:o.w||600,textAnchor:'middle',filter:'url(#rzg)'},txt); }
    txt(x,y,s,color,op,o){ o=o||{}; if(op<=0) return null; return cr('text',{key:'x'+(this._k++),x,y,fill:color,opacity:op,fontSize:o.size||34,fontFamily:o.face||"'Cormorant Garamond',serif",fontStyle:o.italic?'italic':'normal',fontWeight:o.w||500,textAnchor:o.anchor||'middle',letterSpacing:o.ls||0,filter:o.glow?'url(#rzg)':undefined},s); }
    rang(O3,A3,B3,c,op){ if(op<=0) return null; var D=this.proj(O3),A=this.proj(A3),B=this.proj(B3); var v1=[A[0]-D[0],A[1]-D[1]],v2=[B[0]-D[0],B[1]-D[1]]; var n1=Math.hypot(v1[0],v1[1])||1,n2=Math.hypot(v2[0],v2[1])||1,s=15; var a=[D[0]+v1[0]/n1*s,D[1]+v1[1]/n1*s],b=[D[0]+v2[0]/n2*s,D[1]+v2[1]/n2*s],cc=[a[0]+v2[0]/n2*s,a[1]+v2[1]/n2*s]; return cr('path',{key:'r'+(this._k++),d:'M '+a[0]+' '+a[1]+' L '+cc[0]+' '+cc[1]+' L '+b[0]+' '+b[1],fill:'none',stroke:c,strokeWidth:2,opacity:op,filter:'url(#rzg)'}); }

    buildScene(){
      var t=this.state.t,C=this.C,k=[]; this._k=0; this._az=this.az0+0.12*t;
      var push=(e)=>{ if(e) k.push(e); };
      var ci=this.curCI();

      push(cr('defs',{key:'d'},
        cr('filter',{id:'rzg',x:'-60%',y:'-60%',width:'220%',height:'220%'},
          cr('feGaussianBlur',{stdDeviation:2.2,result:'b'}),
          cr('feMerge',null,
            cr('feMergeNode',{in:'b'}),
            cr('feMergeNode',{in:'SourceGraphic'})))));

      push(cr('rect',{key:'b1',x:30,y:30,width:1860,height:1020,fill:'none',stroke:'rgba(240,237,232,0.06)',strokeWidth:1.5}));

      push(this.txt(64,80,'GREGG FLEISHMAN · THE LOST TRIANGLE','rgba(240,237,232,0.30)',1,{size:17,anchor:'start',face:"'Space Mono',monospace",ls:3}));
      push(this.txt(1856,80,('0'+(ci+1)).slice(-2)+' / 07','rgba(240,237,232,0.30)',1,{size:17,anchor:'end',face:"'Space Mono',monospace",ls:3}));

      var cubeOp=this.sm(t,0.3,2)*(1-this.sm(t,40,44)*0.7);
      this.edges.forEach((e,i)=>{ var a=this.proj(this.cube[e[0]]),b=this.proj(this.cube[e[1]]); push(this.ln(a,b,'rgba(74,144,217,0.14)',1.2,cubeOp)); });

      var rc=this.sm(t,23,29);
      var A=this.L3(this.O,this.Opc,rc), B=this.L3(this.FOOT,this.Epc,rc), Cp=this.L3(this.Sp,this.Vpc,rc);
      var mainOp=1-this.sm(t,30.5,32.5)*0.62;
      var fillp=this.sm(t,15.5,17)*(1-this.sm(t,30.5,32.5));
      if(fillp>0) push(this.poly([A,B,Cp],'rgba(60,203,142,'+(0.20*fillp)+')',1));

      var e1=this.sm(t,3.5,6);   push(this.seg(A,B,e1,C.blue,4,{op:mainOp}));  if(e1>0.6) push(this.labP(this.L3(A,B,0.5),'√2',C.lblBlue,mainOp,{dy:30,size:30}));
      var e2=this.sm(t,9,11.5);  push(this.seg(B,Cp,e2,C.terra,4,{op:mainOp})); if(e2>0.6) push(this.labP(this.L3(B,Cp,0.5),'1',C.lblTerra,mainOp,{dx:26,size:30}));
      var e3=this.sm(t,15,17.5); push(this.seg(A,Cp,e3,C.ink,4.4,{op:mainOp})); if(e3>0.6) push(this.labP(this.L3(A,Cp,0.5),'√3',C.ink,mainOp,{dx:-28,size:30}));
      push(this.rang(B,A,Cp,'rgba(60,203,142,.9)',fillp));

      var apo=this.sm(t,17.5,18.5)*mainOp*(1-this.sm(t,30.5,31.5));
      if(apo>0){ push(this.labP(A,'35.26°',C.gold,apo,{dx:44,dy:-22,size:22})); push(this.labP(Cp,'54.74°',C.gold,apo,{dx:-4,dy:38,size:22})); }

      push(this.dot(A,6,C.ink,this.sm(t,0.3,2)));
      push(this.dot(B,5,this.COL,e1));
      push(this.dot(Cp,6,C.ink,e3));

      push(this.txt(960,210,'THE LOST TRIANGLE',C.ink,this.fio(t,18,19,22.6,23.2),{size:54,w:800,face:"'Syne',sans-serif",ls:-1.5,glow:true}));
      push(this.txt(960,260,'1 : √2 : √3   ·   90° · 35.26° · 54.74°',this.COL,this.fio(t,18.4,19.4,22.6,23.2),{size:30,face:"'Space Mono',monospace",glow:true}));

      push(this.txt(960,930,"the same triangle is the cube’s characteristic triangle — centre · edge · vertex",C.ink,this.fio(t,24,25,30,30.6),{size:32,italic:true}));

      var rv=this.fio(t,30.5,32,40.5,41.5);
      if(rv>0){ var N=Math.floor(48*this.sm(t,31.5,38.5));
        for(var i=0;i<N&&i<48;i++){ push(this.poly([this.Opc,this.TR[i][0],this.TR[i][1]],'rgba(60,203,142,0.07)',rv));
          push(this.ln(this.proj(this.Opc),this.proj(this.TR[i][0]),'rgba(74,144,217,0.55)',1.2,rv*0.7));
          push(this.ln(this.proj(this.TR[i][0]),this.proj(this.TR[i][1]),'rgba(224,52,158,0.55)',1.2,rv*0.7)); }
        push(this.txt(960,966,'σ — reflect across its legs → '+Math.min(N,48)+' / 48 copies tile the cube (Oₕ)',C.terra,1,{size:28,face:"'Space Grotesk',sans-serif",glow:true})); }

      var wv=this.fio(t,38,39.5,48,49);
      if(wv>0){ var seed=this.sm(t,38.5,39.8); push(this.dot(this.Epc,11*seed,C.gold,wv));
        var cloud=this.sm(t,39.5,42); this.CUBO.forEach((p)=>push(this.dot(p,6,C.gold,wv*cloud)));
        var ce2=this.sm(t,42,45); this.CUBOE.forEach((e)=>push(this.seg(this.CUBO[e[0]],this.CUBO[e[1]],ce2,C.gold,2.4,{op:wv})));
        var rd=this.sm(t,45,47.5); this.RDE.forEach((e)=>push(this.seg(this.RDV[e[0]],this.RDV[e[1]],rd,C.terra,2.8,{op:wv})));
        this.RDV.forEach((p)=>push(this.dot(p,4.5,C.terra,wv*rd)));
        var wlab=ce2<0.99?'Wythoff seed at the edge-midpoint → the cuboctahedron (12 verts)':'dual of the cuboctahedron → the rhombic dodecahedron';
        push(this.txt(960,966,wlab,ce2<0.99?C.gold:C.terra,1,{size:28,face:"'Space Grotesk',sans-serif",glow:true})); }

      push(this.txt(64,162,this.CHAP[ci],this.CHCOLOR[ci],this.sm(t,this.CH[ci],this.CH[ci]+0.6),{size:50,anchor:'start',w:800,face:"'Syne',sans-serif",ls:-1.2,glow:true}));

      push(cr('rect',{key:'pt',x:64,y:1020,width:1792,height:2,fill:'rgba(240,237,232,0.10)'}));
      push(cr('rect',{key:'pf',x:64,y:1020,width:Math.max(0,1792*Math.min(1,t/this.END)),height:2,fill:'#C8A96E'}));

      return cr('svg',{viewBox:'0 0 1920 1080',width:'100%',height:'100%',role:'img',style:{position:'absolute',inset:0,display:'block'}},k);
    }

    render(){
      var t=this.state.t,ci=this.curCI();
      var scene=this.buildScene();
      var navScale=this.state.vw<420?0.78:(this.state.vw<640?0.88:1);
      var dots=this.CH.map((_,i)=>({bg:i===ci?this.CHCOLOR[ci]:'rgba(240,237,232,.18)',tf:i===ci?'scale(1.5)':'scale(1)',title:this.CHAP[i],onClick:()=>this.goStage(i)}));
      var playIcon=this.state.playing?'❚❚':'▶';
      var counterLabel=('0'+(ci+1)).slice(-2)+' / 07';
      var scrubVal=Math.round(t/this.END*1000);

      return cr('div',{ref:this._containerRef,style:{position:'relative',width:'100%',height:'100vh',background:'#0B0B0B',overflow:'hidden'}},
        cr('div',{ref:this._stageRef,style:{position:'absolute',left:'50%',top:'50%',width:'1920px',height:'1080px',transformOrigin:'center center'}},
          cr('div',{style:{position:'absolute',inset:0,background:'radial-gradient(ellipse 72% 64% at 50% 44%, #16140F 0%, #0E0E0D 54%, #0B0B0B 100%)'}}),
          scene
        ),
        cr('div',{style:{position:'absolute',bottom:'16px',left:'50%',transform:'translateX(-50%) scale('+navScale+')',transformOrigin:'bottom center',display:'flex',alignItems:'center',gap:'8px',padding:'8px 14px',background:'rgba(12,11,10,.80)',backdropFilter:'blur(14px)',border:'1px solid rgba(240,237,232,.09)',borderRadius:'14px',boxShadow:'0 10px 34px rgba(0,0,0,.55)',fontFamily:"'Space Grotesk',sans-serif",maxWidth:'96vw',zIndex:10}},
          cr('button',{onClick:()=>this.goPrev(),style:{width:'36px',height:'36px',border:'none',borderRadius:'9px',background:'rgba(240,237,232,.06)',color:'#F0EDE8',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},'‹'),
          cr('button',{onClick:()=>this.toggle(),style:{width:'40px',height:'40px',border:'none',borderRadius:'9px',background:'rgba(200,169,110,.16)',color:'#F0EDE8',fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},playIcon),
          cr('button',{onClick:()=>this.goNext(),style:{width:'36px',height:'36px',border:'none',borderRadius:'9px',background:'rgba(240,237,232,.06)',color:'#F0EDE8',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},'›'),
          cr('div',{style:{width:'1px',height:'18px',background:'rgba(240,237,232,.10)'}}),
          cr('div',{style:{display:'flex',gap:'3px',alignItems:'center'}},
            dots.map(function(d,i){
              return cr('div',{key:'dot'+i,onClick:d.onClick,title:d.title,style:{display:'flex',alignItems:'center',justifyContent:'center',width:'22px',height:'36px',cursor:'pointer'}},
                cr('div',{style:{width:'7px',height:'7px',borderRadius:'50%',transition:'transform .18s, background .18s',background:d.bg,transform:d.tf}}));
            })
          ),
          cr('div',{style:{width:'1px',height:'18px',background:'rgba(240,237,232,.10)'}}),
          cr('input',{className:'lt-scrub',type:'range',min:'0',max:'1000',value:scrubVal,onInput:(e)=>this.onSeek(e),onChange:(e)=>this.onSeek(e),style:{width:'200px'}}),
          cr('span',{style:{fontSize:'11px',color:'rgba(240,237,232,.40)',letterSpacing:'.12em',minWidth:'48px',textAlign:'right',fontFamily:"'Space Mono',monospace",whiteSpace:'nowrap'}},counterLabel)
        )
      );
    }
  }

  window.LostTriangleRiseZ = LostTriangleRiseZ;
})();
