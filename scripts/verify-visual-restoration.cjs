/* Deterministic local comparisons against the recovered prelaunch application. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const sharp = require("sharp");
const beforeOrigin = process.env.VISUAL_BEFORE || "http://127.0.0.1:3101";
const afterOrigin = process.env.VISUAL_AFTER || "http://127.0.0.1:3100";
const output = process.env.VISUAL_EVIDENCE || "docs/restoration";
const bag = [{sku:"wicmini-current",option:"reserve",quantity:2}];
const focus = process.env.VISUAL_FOCUS;
const results = [];
const errors = [];
const failures = [];

async function settle(page, route) {
  await page.bringToFront();
  const response = await page.goto(page.origin+route,{waitUntil:"networkidle"});
  assert.equal(response.status(),200,route);
  // The Next.js development badge is tooling, not part of the recovered website.
  await page.addStyleTag({content:"nextjs-portal{display:none!important}"});
  if(route === "/") await page.locator(".preloader").waitFor({state:"detached",timeout:15000});
  const skip = page.getByRole("button",{name:"Skip animation",exact:true});
  if(await skip.count()) await skip.click();
  await page.evaluate(async()=>{
    await document.fonts.ready;
    for(const animation of document.getAnimations()) {
      if(animation.constructor.name === "CSSAnimation" && animation.effect.getComputedTiming().iterations === Infinity) { animation.pause(); animation.currentTime=0; }
    }
    await Promise.all([...document.images].filter(image=>image.loading!=="lazy").map(image=>image.decode().catch(()=>{})));
  });
  await page.waitForTimeout(1000);
}

async function videoSettled(page) {
  await page.waitForFunction(()=>[...document.querySelectorAll("#design video")].every(video=>video.readyState>=2&&!video.seeking));
  await page.waitForTimeout(800);
}

async function capture(page,label,selector) {
  await page.bringToFront();
  if(selector) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.locator(selector).locator("img").evaluateAll(async images=>{
      await Promise.all(images.map(image=>image.decode().catch(()=>{})));
    });
  }
  await page.waitForTimeout(700);
  const filename=path.join(output,label+"-"+page.side+".png");
  if(selector) await page.locator(selector).screenshot({path:filename});
  else await page.screenshot({path:filename});
  return {
    filename,
    video:await page.locator("#design video").count() ? await page.locator("#design video").evaluate(v=>({time:v.currentTime,duration:v.duration,seeking:v.seeking,ready:v.readyState,visibility:document.visibilityState,stage:document.querySelector("#design").dataset.stage})) : undefined,
    geometry:await page.locator(selector || "main").evaluate(element=>{
      const style=getComputedStyle(element),rect=element.getBoundingClientRect();
      return {width:rect.width,height:rect.height,font:style.fontFamily,fontSize:style.fontSize,color:style.color,background:style.backgroundColor};
    }),
  };
}

async function compare(label,before,after) {
  const a=await sharp(before.filename).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const b=await sharp(after.filename).removeAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(a.info.width,b.info.width,label+" width");
  assert.equal(a.info.height,b.info.height,label+" height");
  let different=0,total=0;
  for(let pixel=0;pixel<a.data.length;pixel+=3) {
    let maximum=0;
    for(let channel=0;channel<3;channel++) {
      const diff=Math.abs(a.data[pixel+channel]-b.data[pixel+channel]);
      total+=diff;maximum=Math.max(maximum,diff);
    }
    if(maximum>10) different++;
  }
  const result={label,before:before.filename,after:after.filename,
    width:a.info.width,height:a.info.height,changedPixelPercent:different/(a.info.width*a.info.height)*100,
    meanChannelDifference:total/a.data.length,beforeVideo:before.video,afterVideo:after.video,beforeGeometry:before.geometry,afterGeometry:after.geometry};
  results.push(result);
  console.log(JSON.stringify({label,changedPixelPercent:result.changedPixelPercent,meanChannelDifference:result.meanChannelDifference,...(label.startsWith("rotation") ? {beforeVideo:before.video,afterVideo:after.video} : {})}));
}

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch();
  for(const viewport of (focus && focus !== "home" ? [{width:1440,height:900}] : [{width:1440,height:900},{width:390,height:844}])) {
    const pages=[];
    for(const [side,origin] of [["before",beforeOrigin],["after",afterOrigin]]) {
      const context=await browser.newContext({viewport});
      await context.addInitScript(items=>localStorage.setItem("wicclaw-shopping-bag-v1",JSON.stringify(items)),bag);
      const page=await context.newPage();page.side=side;page.origin=origin;
      page.on("pageerror",error=>errors.push({side,message:error.message}));
      page.on("response",response=>{if(response.status()>=400)failures.push({side,status:response.status(),url:response.url()});});
      pages.push(page);
    }
    for(const [label,route] of [["home","/"],["preorder-hero","/pre-order"],["configuration","/shop/buy-wicclaw"],["bag","/shop/bag"]]) {
      if (focus && (focus !== "home" || route !== "/")) continue;
      const captures=[];
      for(const page of pages) {
        await settle(page,route);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
        captures.push(await capture(page,label+"-"+viewport.width));
      }
      await compare(label+"-"+viewport.width,...captures);
      if(route === "/") {
        const productCaptures=[];
        for(const page of pages) {
          await page.bringToFront();
          await page.locator("#products").scrollIntoViewIfNeeded();
          await page.waitForTimeout(1000);
          productCaptures.push(await capture(page,"home-products-"+viewport.width,"#products"));
        }
        await compare("home-products-"+viewport.width,...productCaptures);
      }
    }
    if(viewport.width===1440 && focus !== "home") {
      for(const page of pages) {
        await settle(page,"/pre-order");
        await page.locator("#highlights").scrollIntoViewIfNeeded();
        await page.getByRole("button",{name:"Pause highlights",exact:true}).click();
        await page.getByRole("button",{name:"Show design highlight",exact:true}).click();
        await page.waitForFunction(()=>{const t=document.querySelector(".highlights-track"),card=t.children[2];return Math.abs(card.getBoundingClientRect().left-t.getBoundingClientRect().left-parseFloat(getComputedStyle(t).paddingLeft))<3;},{},{timeout:12000});
        await page.locator("#design video").evaluate(video=>video.load());
        await page.waitForFunction(()=>Number.isFinite(document.querySelector("#design video").duration));
        // Prime each paused video decoder equally; a first seek can otherwise retain its poster in headless Chromium.
        await page.locator("#design video").evaluate(async video=>{await video.play();await new Promise(resolve=>setTimeout(resolve,100));video.pause();video.currentTime=0;});
        await videoSettled(page);
      }
      await compare("carousel-design",...(await Promise.all(pages.map(page=>capture(page,"carousel-design","#highlights")))));
      for(const [label,offset] of [["rotation-top",.6],["rotation-front",2],["rotation-rear",2.9],["rotation-reverse-front",2]]) {
        const captures=[];
        for(const page of pages) {
          await page.bringToFront();
          const y=await page.locator("#design").evaluate((element,u)=>element.getBoundingClientRect().top+scrollY+u*innerHeight,offset);
          await page.mouse.wheel(0,y-await page.evaluate(()=>scrollY));
          await page.waitForTimeout(800);await videoSettled(page);
          await page.mouse.wheel(0,1); await page.waitForTimeout(100); await page.mouse.wheel(0,-1);
          await videoSettled(page);
          captures.push(await capture(page,label));
        }
        await compare(label,...captures);
      }
      const comparisons=[];
      for(const page of pages) comparisons.push(await capture(page,"hardware-comparison","#compare"));
      await compare("hardware-comparison",...comparisons);
      for(const page of pages) {
        await page.locator("#highlights").scrollIntoViewIfNeeded();
        await page.getByRole("button",{name:"Show chip performance highlight",exact:true}).click();
        await page.getByRole("button",{name:"Play highlights",exact:true}).click();
        await page.waitForTimeout(7500);
        assert.equal(await page.getByRole("button",{name:"Show ai highlight",exact:true}).getAttribute("aria-pressed"),"true");
        await page.getByRole("button",{name:"Pause highlights",exact:true}).click();
      }
    }
    for(const page of pages) await page.context().close();
  }
  assert.deepEqual(errors,[]);
  assert.deepEqual(failures,[]);
  if(focus && fs.existsSync(path.join(output,"visual-comparison.json"))) {
    const previous=JSON.parse(fs.readFileSync(path.join(output,"visual-comparison.json"),"utf8"));
    results.unshift(...previous.results.filter(item=>!results.some(current=>current.label===item.label)));
  }
  fs.writeFileSync(path.join(output,"visual-comparison.json"),JSON.stringify({beforeOrigin,afterOrigin,results,errors,failures},null,2));
  const pairs=results.map(item=>'<section><h2>'+item.label+' — '+item.changedPixelPercent.toFixed(4)+'% changed pixels</h2><div><figure><figcaption>Prelaunch backup</figcaption><img src="'+path.basename(item.before)+'"></figure><figure><figcaption>Restored</figcaption><img src="'+path.basename(item.after)+'"></figure></div></section>').join("");
  fs.writeFileSync(path.join(output,"comparison.html"),'<!doctype html><meta charset="utf-8"><title>WICCLAW visual restoration comparison</title><style>body{font:16px system-ui;margin:24px}section{margin-bottom:48px}section>div{display:flex;gap:16px}figure{margin:0;flex:1;min-width:0}img{width:100%;height:auto;border:1px solid #ddd}figcaption{margin-bottom:12px}</style><h1>Prelaunch backup versus selective restoration</h1>'+pairs);
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
