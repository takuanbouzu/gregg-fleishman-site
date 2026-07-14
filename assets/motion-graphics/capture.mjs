import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require=createRequire(import.meta.url);
const { chromium }=require('playwright');

const FPS=30000/1001;
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const OUT=path.resolve(ROOT,'04_DELIVERABLES/production/masters');
const STILL_OUT=path.resolve(ROOT,'04_DELIVERABLES/production/review_frames');
const BEATS_PATH=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'beats.json');
const BASE=process.env.GF_MG_URL||'http://127.0.0.1:8766/gregg-fleishman-site/film-motion-graphics-v2.html';
const FFMPEG=process.env.FFMPEG_EXE||'ffmpeg';
const timing=JSON.parse(await fs.readFile(BEATS_PATH,'utf8'));
const specs=Object.fromEntries(timing.beats.map(beat=>[beat.id,beat.duration]));
const args=Object.fromEntries(process.argv.slice(2).map((v,i,a)=>v.startsWith('--')?[v.slice(2),a[i+1]?.startsWith('--')?true:a[i+1]]:null).filter(Boolean));
const beats=args.beat==='all'||!args.beat?Object.keys(specs):[args.beat];
const alpha=args.alpha==='1';
const review=args.review==='1';
const stills=args.stills==='1';
const width=stills?3840:(review?960:1920),height=stills?2160:(review?540:1080);

async function run(cmdArgs){
  await new Promise((resolve,reject)=>{const p=spawn(FFMPEG,cmdArgs,{stdio:'inherit'});p.on('error',reject);p.on('exit',c=>c===0?resolve():reject(new Error(`ffmpeg exited ${c}`)))});
}
async function removeFrames(dir){
  for(let attempt=0;attempt<5;attempt++){
    try{await fs.rm(dir,{recursive:true,force:true});return}catch(error){if(error.code!=='EBUSY'||attempt===4){console.warn(`Temporary frames retained: ${dir}`);return}await new Promise(r=>setTimeout(r,500*(attempt+1)))}
  }
}

await fs.mkdir(stills?STILL_OUT:OUT,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXE||undefined});
const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});

for(const id of beats){
  if(!(id in specs))throw new Error(`Unknown beat ${id}`);
  const contentFrames=Math.round(specs[id]*FPS),totalFrames=contentFrames+8;
  if(stills){
    await page.goto(`${BASE}?beat=${id}&clean=1&captions=0`,{waitUntil:'networkidle'});
    await page.waitForFunction(()=>window.GF_MG);
    const heroFrame=Math.max(0,Math.min(contentFrames-1,Math.round(contentFrames*.72)));
    await page.evaluate(f=>window.GF_MG.setFrame(f),heroFrame);
    const output=path.join(STILL_OUT,`GF_MG_${id}_v001_keyframe_4k.png`);
    await page.screenshot({path:output,omitBackground:false});
    console.log(`Wrote ${output}`);
    continue;
  }
  const seq=path.join(OUT,`.frames_${id}_${alpha?'alpha':'black'}`);
  await fs.rm(seq,{recursive:true,force:true});await fs.mkdir(seq,{recursive:true});
  await page.goto(`${BASE}?beat=${id}&clean=1${alpha?'&alpha=1':''}`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.GF_MG);
  for(let outFrame=0;outFrame<totalFrames;outFrame++){
    const contentFrame=Math.max(0,Math.min(contentFrames-1,outFrame-4));
    await page.evaluate(f=>window.GF_MG.setFrame(f),contentFrame);
    await page.screenshot({path:path.join(seq,`${String(outFrame).padStart(6,'0')}.png`),omitBackground:alpha});
    if(outFrame%60===0)console.log(`${id} ${alpha?'alpha':'black'}: ${outFrame}/${totalFrames}`);
  }
  const stem=`GF_MG_${id}_v001${alpha?'_alpha':''}`;
  const output=path.join(OUT,`${stem}.mov`);
  const codec=alpha?['-c:v','prores_ks','-profile:v','4','-pix_fmt','yuva444p10le']:['-c:v','prores_ks','-profile:v','3','-pix_fmt','yuv422p10le'];
  await run(['-y','-framerate','30000/1001','-i',path.join(seq,'%06d.png'),...codec,'-an','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',output]);
  await removeFrames(seq);
  console.log(`Wrote ${output}`);
}
await browser.close();
