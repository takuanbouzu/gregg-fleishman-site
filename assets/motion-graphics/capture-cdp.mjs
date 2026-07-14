import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const ROOT=path.resolve(new URL('../../../',import.meta.url).pathname.replace(/^\/(.:)/,'$1'));
const args=Object.fromEntries(process.argv.slice(2).map((v,i,a)=>v.startsWith('--')?[v.slice(2),a[i+1]?.startsWith('--')?true:a[i+1]]:null).filter(Boolean));
const beat=args.beat||'2A';
const fps=30000/1001;
const duration=Number(args.duration||20.387);
const width=Number(args.width||1920);
const height=Number(args.height||1080);
const frameLimit=args.frames?Number(args.frames):Math.round(duration*fps)+8;
const port=Number(args.port||9333);
const chrome=args.chrome||process.env.CHROME_EXE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outRoot=path.resolve(ROOT,'04_DELIVERABLES/production');
const frameDir=path.resolve(outRoot,`frames_${beat}_cdp`);
const url=args.url||`http://127.0.0.1:8766/gregg-fleishman-site/film-motion-graphics-v2.html?beat=${beat}&clean=1&captions=0`;

function delay(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
async function json(url){
  const response=await fetch(url);
  if(!response.ok)throw new Error(`${url} ${response.status}`);
  return response.json();
}
async function waitForWs(){
  for(let i=0;i<80;i++){
    try{
      const pages=await json(`http://127.0.0.1:${port}/json/list`);
      const page=pages.find(p=>p.type==='page'&&p.webSocketDebuggerUrl);
      if(page)return page.webSocketDebuggerUrl;
    }catch{}
    await delay(250);
  }
  throw new Error('Chrome DevTools websocket not available');
}
function makeCdp(wsUrl){
  const ws=new WebSocket(wsUrl);
  let id=0;
  const pending=new Map();
  ws.addEventListener('message',event=>{
    const data=JSON.parse(event.data);
    if(data.id&&pending.has(data.id)){
      const {resolve,reject}=pending.get(data.id);
      pending.delete(data.id);
      data.error?reject(new Error(JSON.stringify(data.error))):resolve(data.result);
    }
  });
  return {
    open:()=>new Promise((resolve,reject)=>{
      ws.addEventListener('open',resolve,{once:true});
      ws.addEventListener('error',reject,{once:true});
    }),
    send:(method,params={})=>new Promise((resolve,reject)=>{
      const request={id:++id,method,params};
      pending.set(request.id,{resolve,reject});
      ws.send(JSON.stringify(request));
    }),
    close:()=>ws.close()
  };
}

await fs.rm(frameDir,{recursive:true,force:true});
await fs.mkdir(frameDir,{recursive:true});
const userData=path.resolve(outRoot,`.chrome-cdp-profile-${process.pid}-${Date.now()}`);
const chromeArgs=[
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userData}`,
  '--headless=new',
  '--disable-gpu',
  '--use-angle=swiftshader',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  `--window-size=${width},${height}`,
  'about:blank'
];
const proc=spawn(chrome,chromeArgs,{stdio:'ignore'});
try{
  const wsUrl=await waitForWs();
  const cdp=makeCdp(wsUrl);
  await cdp.open();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url});
  await delay(2500);
  await cdp.send('Runtime.evaluate',{expression:'window.GF_MG !== undefined',awaitPromise:true});
  const contentFrames=Math.round(duration*fps);
  for(let outFrame=0;outFrame<frameLimit;outFrame++){
    const contentFrame=Math.max(0,Math.min(contentFrames-1,outFrame-4));
    await cdp.send('Runtime.evaluate',{expression:`window.GF_MG.setFrame(${contentFrame});`,awaitPromise:true});
    await delay(12);
    const shot=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});
    await fs.writeFile(path.join(frameDir,`${String(outFrame).padStart(6,'0')}.png`),Buffer.from(shot.data,'base64'));
    if(outFrame%60===0)console.log(`${beat}: ${outFrame}/${frameLimit}`);
  }
  cdp.close();
}finally{
  proc.kill();
  await once(proc,'exit').catch(()=>{});
  await fs.rm(userData,{recursive:true,force:true}).catch(()=>{});
}
console.log(frameDir);
