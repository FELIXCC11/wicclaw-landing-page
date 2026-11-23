import fs from 'node:fs';
fs.mkdirSync('public/prelaunch', {recursive:true});
let html = fs.readFileSync(new URL('../wicclaw-animated-ascii-mountain-birds.html',import.meta.url),'utf8');
const embedded = html.match(/data:image\/png;base64,([^"]+)/);
if (!embedded) throw new Error('Reference image missing');
fs.writeFileSync('public/prelaunch/mountain.png', Buffer.from(embedded[1], 'base64'));
html = html.replace(embedded[0], '/prelaunch/mountain.png');
html = html.replace('</style>', '.hero{height:100vh;min-height:0}#mountain{max-height:none;width:145%;max-width:none;flex-shrink:0;transform:translateX(-20%)}@media(max-width:700px){.hero{min-height:0}#mountain{width:180%;transform:translateX(-35%)}}</style>');
html = html.replace('let elapsed=0, previous=0;', 'let elapsed=0, previous=0, lastDraw=0;');
html = html.replace('mountainMotion(elapsed);', 'if(now-lastDraw<50){raf=requestAnimationFrame(frame);return;}lastDraw=now;mountainMotion(elapsed);');
// Cache geometry and the mask at resize instead of reading layout and copying the image every frame.
html = html.replace('let width=1, height=1, scale=1, raf=0, active=false;', 'let width=1, height=1, scale=1, raf=0, active=false, cachedRect={x:0,y:0,w:1,h:1};');
html = html.replace('maskContext.setTransform(scale,0,0,scale,0,0);', 'maskContext.setTransform(scale,0,0,scale,0,0); cachedRect=imageRect(); const maskRect=cachedRect; if(image.complete && image.naturalWidth)maskContext.drawImage(image,maskRect.x,maskRect.y,maskRect.w,maskRect.h);');
html = html.replace('const r=imageRect();', 'const r=cachedRect;');
html = html.replace('maskContext.clearRect(0,0,width,height);\n    maskContext.drawImage(image,r.x,r.y,r.w,r.h);', '');
// The source artwork remains full-resolution; only the faint moving overlay is sampled more sparsely.
html = html.replace('clamp(width/180,6,11)', 'clamp(width/100,12,18)');
html = html.replace('clamp(height/13,27,65)', 'clamp(height/26,12,36)');
html = html.replace('Math.min(window.devicePixelRatio||1,2)', 'Math.min(window.devicePixelRatio||1,1.5)');
// Rasterize the few ASCII glyphs once instead of shaping text hundreds of times per frame.
html = html.replace('const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));', `const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const glyphs={};
  for(const color of ['#FFF1DC','#FE764E','#F2C7A5']) for(const char of ['/',String.fromCharCode(92),'+']) {
    const sprite=document.createElement('canvas');sprite.width=16;sprite.height=16;
    const paint=sprite.getContext('2d');paint.font='11px ui-monospace,Consolas,monospace';paint.fillStyle=color;paint.fillText(char,1,12);glyphs[color+char]=sprite;
  }`);
html = html.replace("ctx.fillText(selector===2?'/':selector===7?'\\\\':'+',x,yy)", "ctx.drawImage(glyphs[ctx.fillStyle.toUpperCase()+(selector===2?'/':selector===7?String.fromCharCode(92):'+')],x,yy-12)");
fs.writeFileSync('public/prelaunch/landscape.html', html);
