/* Browser QA against a local production build. No external payments are submitted. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const references = process.env.WICCLAW_LOCAL_REFERENCE_REVIEW === "true";
const origin = process.env.QA_ORIGIN || "http://localhost:3100";
const evidence = process.env.QA_EVIDENCE || "docs/launch-evidence";
(async () => {
  fs.mkdirSync(evidence,{recursive:true});
  const browser = await chromium.launch();
  const context = await browser.newContext({viewport:{width:1440,height:1000}});
  const page = await context.newPage();
  const errors=[], failures=[], requests=[];
  page.on("pageerror",error=>errors.push(error.message));
  page.on("request",request=>requests.push(request.url()));
  page.on("response",response=>{if(response.status()>=400 && !response.url().includes("/api/")) failures.push(response.status()+" "+response.url());});
  const checks=[];
  for (const width of [1440,768,390,360]) {
    await page.setViewportSize({width,height:900});
    for (const route of ["/","/pre-order","/shop/buy-wicclaw","/shop/bag","/shop/account","/terms","/refunds","/shipping"]) {
      const response=await page.goto(origin+route,{waitUntil:"networkidle"});
      assert.equal(response.status(),200,route);
      await page.waitForTimeout(route==="/" ? 2500 : 200);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+" overflow at "+width);
      const pictures=await page.locator("img").evaluateAll(images=>images.filter(image=>image.complete && image.naturalWidth===0).map(image=>image.src));
      assert.deepEqual(pictures,[],route+" broken images");
      if (["/","/pre-order","/shop/buy-wicclaw"].includes(route)) await page.screenshot({path:evidence+"/"+(route==="/"?"home":route.split("/").at(-1))+"-"+width+".png"});
    }
    checks.push("Responsive pages at "+width+"px");
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(origin+"/pre-order",{waitUntil:"networkidle"});
  for (const tab of ["Accounting","Communication","Sales","Operations","Reports"]) {
    await page.getByRole("tab",{name:tab,exact:true}).click();
    assert.equal(await page.getByRole("tab",{name:tab,exact:true}).getAttribute("aria-selected"),"true");
  }
  for (const tab of ["Agentic AI","Your Apps","Your Control"]) {
    await page.getByRole("tab",{name:tab,exact:true}).click();
    assert.equal(await page.getByRole("tab",{name:tab,exact:true}).getAttribute("aria-selected"),"true");
  }
  checks.push("Five application tabs and three AI tabs");
  await page.locator("#highlights").scrollIntoViewIfNeeded();
  await page.getByRole("button",{name:"Pause highlights",exact:true}).click();
  await page.getByRole("button",{name:"Show design highlight",exact:true}).click();
  await page.waitForTimeout(600);
  assert.equal(await page.getByRole("button",{name:"Show design highlight",exact:true}).getAttribute("aria-pressed"),"true");
  await page.locator("#why-wicclaw").scrollIntoViewIfNeeded();
  const before=await page.locator(".reasons-track").evaluate(element=>element.scrollLeft);
  await page.getByRole("button",{name:"Next buying benefits"}).click();
  await page.waitForTimeout(700);
  assert.ok(await page.locator(".reasons-track").evaluate(element=>element.scrollLeft)>before);
  checks.push("Highlight selection and buying carousel");
  await page.locator("#design").scrollIntoViewIfNeeded();
  assert.equal(await page.locator("#design video").count(),0);
  assert.equal(await page.locator("#design .design-static-grid img").count(),4);
  assert.equal(await page.locator("#design .port-caption").count(),0);
  for(const route of ["/","/pre-order"]){
    await page.goto(origin+route,{waitUntil:"networkidle"});
    for(const section of await page.locator("main section").all()) await section.scrollIntoViewIfNeeded().catch(()=>{});
    await page.waitForTimeout(500);await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
    await page.screenshot({path:evidence+"/"+(route==="/"?"home":"preorder")+"-full.png",fullPage:true});
    assert.deepEqual(await page.locator("img").evaluateAll(images=>images.filter(el=>el.complete&&el.naturalWidth===0).map(el=>el.src)),[]);
  }
  const sitemap=await (await context.request.get(origin+"/sitemap.xml")).text();
  const paths=[...new Set([...sitemap.matchAll(new RegExp("<loc>(.*?)</loc>","g"))].map(match=>new URL(match[1]).pathname))];
  for(const path of paths) assert.equal((await context.request.get(origin+path)).status(),200,path);
  checks.push("Four static design images; full-page lazy media; "+paths.length+" sitemap routes");
  await page.goto(origin+"/shop/buy-wicclaw",{waitUntil:"networkidle"});
  await page.getByRole("button",{name:"Add to Bag",exact:true}).click();
  await page.waitForURL("**/shop/bag");
  await page.getByRole("combobox",{name:"Quantity for reserve"}).selectOption("2");
  assert.match(await page.locator("main").innerText(),/\$40\.00/);
  assert.match(await page.locator("main").innerText(),/\$1,558\.00/);
  await page.getByRole("link",{name:"Check Out",exact:true}).first().click();
  await page.waitForURL("**/shop/checkout");
  await page.getByLabel("Full name",{exact:true}).fill("Launch QA");
  await page.getByLabel("Email address",{exact:true}).fill("qa-"+Date.now()+"@example.invalid");
  await page.getByLabel("Password",{exact:true}).fill("Local-QA-only-password-2026");
  await page.getByRole("button",{name:"Create Account",exact:true}).click();
  await page.getByRole("heading",{name:"Everything look right?"}).waitFor();
  await page.locator('input[type="checkbox"]').check();
  assert.equal(await page.getByRole("button",{name:"Ordering opens soon"}).isDisabled(),true);
  assert.equal(await page.getByText("Apple Pay",{exact:true}).count(),0);
  await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
  await page.screenshot({path:evidence+"/checkout-review.png",fullPage:true});
  assert.ok(await page.locator('.wc-consent input').evaluate(el=>el.getBoundingClientRect().width<30));
  await page.goto(origin+"/shop/account",{waitUntil:"networkidle"});
  await page.getByRole("heading",{name:"Welcome, Launch."}).waitFor();
  await page.getByRole("button",{name:"Sign Out",exact:true}).click();
  await page.getByRole("button",{name:"Create Account",exact:true}).waitFor();
  checks.push("Product → bag → quantity two → checkout → account → review → closed payment gate → logout");
  assert.equal((await context.request.post(origin+"/api/checkout",{data:{sku:"wicmini-current",option:"reserve"}})).status(),503);
  assert.equal((await context.request.post(origin+"/api/stripe/webhook",{data:{}})).status(),400);
  assert.equal((await context.request.get(origin+"/api/admin/preorders")).status(),401);
  assert.equal((await context.request.post(origin+"/api/admin/emails")).status(),401);
  assert.equal((await context.request.get(origin+"/sites/apple/sf-pro-display_regular.woff2")).status(),references ? 200 : 404);
  checks.push(references ? "Checkout closed; unsigned webhook and unauthorized admin requests rejected; temporary reference assets available locally" : "Checkout closed; unsigned webhook and unauthorized admin requests rejected; Apple assets unavailable");
  const reducedContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const reducedPage=await reducedContext.newPage();
  await reducedPage.goto(origin+"/pre-order",{waitUntil:"networkidle"});
  assert.equal(await reducedPage.locator(".hero-entry").evaluate(video=>video.paused),true);
  await reducedPage.getByRole("button",{name:"Open menu"}).click();
  assert.equal(await reducedPage.locator(".nav-links").evaluate(element=>element.classList.contains("open")),true);
  await reducedContext.close();
  checks.push("Reduced motion and mobile navigation");
  if (!references) assert.deepEqual(requests.filter(url=>url.includes("/sites/apple/")||/apple\.com|sf-pro/.test(url)),[]);
  assert.deepEqual(errors,[]);
  assert.deepEqual(failures.filter(value=>!value.includes("/sites/apple/")),[]);
  fs.writeFileSync(evidence+"/verification.json",JSON.stringify({origin,checks,errors,failures,externalPaymentsTested:false},null,2));
  console.log(JSON.stringify({checks,errors,failures,externalPaymentsTested:false},null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
