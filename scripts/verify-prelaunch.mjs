import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from '@playwright/test';
import pg from 'pg';

const origin=process.env.QA_ORIGIN||'http://localhost:3100';
const evidence=process.env.QA_EVIDENCE||'.runtime/prelaunch-qa';
fs.mkdirSync(evidence,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({extraHTTPHeaders:origin.includes('localhost')||origin.includes('127.0.0.1')?{'CF-Connecting-IP':`qa-${crypto.randomUUID()}`}:{}});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const checks=[];
const id=crypto.randomUUID();
const email=`wicclaw-qa-${id}@example.com`;
const demoEmail=`wicclaw-demo-qa-${id}@example.com`;
const db=new pg.Pool({connectionString:process.env.DATABASE_URL,max:1});
try {
 for(const width of [1920,1440,1280,1024,768,430,375]) {
  await page.setViewportSize({width,height:width<600?812:1000});
  for(const route of ['/','/pre-order','/request-demo']) {
   const response=await page.goto(origin+route,{waitUntil:'networkidle'});assert.equal(response.status(),200);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Overflow ${route} ${width}`);
   assert.equal(await page.locator('h1').count(),1);
   const frame=page.frames().find(f=>f.url().includes('/prelaunch/landscape'));assert.ok(frame);
   assert.ok(await frame.locator('#mountain').evaluate(img=>img.complete&&img.naturalWidth>0));
   await page.screenshot({path:`${evidence}/${route==='/'?'home':route.slice(1)}-${width}.png`,fullPage:true});
  }
  checks.push(`Three public routes render without overflow at ${width}px`);
 }
 for(const path of ['/products','/hardware','/platform','/help','/help/anything','/contact','/shop/account','/shop/checkout','/pre-order/order','/pre-order/complete','/does-not-exist']) {
  const r=await context.request.get(origin+path,{maxRedirects:0});assert.equal(r.status(),307,path);assert.equal(new URL(r.headers().location,origin).pathname,'/');
 }
 checks.push('Old marketing, shopping and nested preorder routes redirect');
 for(const path of ['/admin/preorders','/api/admin/preorders'])assert.equal((await context.request.get(origin+path)).status(),401,path);
 assert.equal((await context.request.post(origin+'/api/admin/emails')).status(),401);
 assert.equal((await context.request.post(origin+'/api/checkout')).status(),503);
 assert.equal((await context.request.post(origin+'/api/shop/preview-order')).status(),503);
 checks.push('Privileged endpoints deny unauthenticated access; payment routes closed');
 const sitemap=await (await context.request.get(origin+'/sitemap.xml')).text();assert.equal((sitemap.match(/<loc>/g)||[]).length,4);assert.ok(!sitemap.includes('/products'));
 await page.goto(origin+'/pre-order');await page.getByRole('button',{name:'JOIN THE WAITLIST'}).click();assert.ok(await page.locator('input[name=email]').evaluate(el=>!el.validity.valid));
 await page.getByLabel('Email address').fill(email);await page.getByLabel('First name').fill('QA');await page.getByRole('checkbox').check();await page.getByRole('button',{name:'JOIN THE WAITLIST'}).click();await page.getByRole('heading',{name:"You're on the list."}).waitFor();
 const post=data=>context.request.post(origin+'/api/leads',{headers:{Origin:origin},data});
 const waitlist={type:'waitlist',email,firstName:'QA',consent:true};
 assert.equal((await post(waitlist)).status(),200);
 const persisted=await db.query('SELECT id,email_status,email_verified_at,consent FROM prelaunch_waitlist WHERE email=$1',[email]);assert.equal(persisted.rowCount,1);assert.equal(persisted.rows[0].consent,true);assert.equal(persisted.rows[0].email_status,'not_configured');assert.equal(persisted.rows[0].email_verified_at,null);
 checks.push('Waitlist UI stores one real database record; duplicate retry is idempotent; no false email verification');
 for(const changes of [{email:'bad'},{consent:false},{website:'spam'},{tools:['invalid']},{firstName:'x'.repeat(101)}])assert.equal((await post({...waitlist,...changes})).status(),400);
 assert.equal((await context.request.post(origin+'/api/leads',{headers:{Origin:'https://invalid.example'},data:waitlist})).status(),403);
 assert.equal((await context.request.post(origin+'/api/leads',{headers:{Origin:origin,'Content-Type':'application/json'},data:'{broken'})).status(),400);
 assert.equal((await post({...waitlist,description:'x'.repeat(13000)})).status(),413);
 checks.push('Server rejects invalid email, missing consent, honeypot, unsupported selections, large bodies, malformed JSON and foreign origins');
 await page.goto(origin+'/request-demo');await page.getByLabel('Business name').fill('WICCLAW QA');await page.getByLabel('Business email').fill(demoEmail);await page.getByLabel('Your name').fill('QA Reviewer');await page.getByRole('button',{name:'CONTINUE'}).click();
 await page.getByLabel('Accounting and bookkeeping',{exact:true}).check();await page.getByLabel('Reporting and analytics',{exact:true}).check();await page.getByLabel('Tell us about the workflow.').fill('Synthetic QA submission.');await page.getByRole('button',{name:'PREVIOUS'}).click();assert.equal(await page.getByLabel('Business name').inputValue(),'WICCLAW QA');await page.getByRole('button',{name:'CONTINUE'}).click();assert.ok(await page.getByLabel('Accounting and bookkeeping',{exact:true}).isChecked());await page.getByRole('button',{name:'CONTINUE'}).click();await page.getByLabel('QuickBooks',{exact:true}).check();await page.getByLabel('Microsoft 365',{exact:true}).check();await page.getByRole('button',{name:'CONTINUE'}).click();
 await page.getByRole('checkbox').check();await page.screenshot({path:`${evidence}/demo-review-mobile.png`,fullPage:true});await page.getByRole('button',{name:'REQUEST MY DEMO'}).click();await page.getByRole('heading',{name:'Request Received.'}).waitFor();
 const demo={type:'demo',email:demoEmail,name:'QA Reviewer',businessName:'WICCLAW QA',description:'Synthetic QA submission.',workflows:['Accounting and bookkeeping','Reporting and analytics'],tools:['QuickBooks','Microsoft 365'],consent:true};assert.equal((await post(demo)).status(),200);
 const saved=await db.query('SELECT form_data FROM prelaunch_demo_requests WHERE email=$1',[demoEmail]);assert.equal(saved.rowCount,1);assert.deepEqual(saved.rows[0].form_data.workflows,demo.workflows);assert.deepEqual(saved.rows[0].form_data.tools,demo.tools.slice().sort());
 checks.push('Four demo steps retain answers; UI and retries preserve all selections in one database record');
 await page.goto(origin+'/pre-order');await page.route('**/api/leads',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Service temporarily unavailable.'})}));await page.getByLabel('Email address').fill(email);await page.getByRole('checkbox').check();await page.getByRole('button',{name:'JOIN THE WAITLIST'}).click();await page.locator('.launch-error').waitFor();assert.equal(await page.getByLabel('Email address').inputValue(),email);await page.unroute('**/api/leads');checks.push('Submission failure is visible and retains entered answers');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(origin+'/');const frame=page.frames().find(f=>f.url().includes('/prelaunch/landscape'));assert.equal(await frame.locator('canvas').evaluate(el=>getComputedStyle(el).display),'none');checks.push('Reduced motion keeps mountain visible and disables animation');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.reload();const animated=page.frames().find(f=>f.url().includes('/prelaunch/landscape'));await page.waitForTimeout(200);const before=await animated.locator('canvas').evaluate(el=>el.toDataURL());await page.waitForTimeout(250);assert.notEqual(await animated.locator('canvas').evaluate(el=>el.toDataURL()),before);checks.push('Mountain and bird canvas animates in normal motion mode');
 let limited=false;for(let i=0;i<12;i++){const r=await post(waitlist);if(r.status()===429){limited=true;assert.equal(r.headers()['retry-after'],'600');break;}}assert.ok(limited);checks.push('Persistent rate limit rejects excessive submissions with retry guidance');
 assert.deepEqual(errors,[]);checks.push('No browser JavaScript errors');
 fs.writeFileSync(`${evidence}/results.json`,JSON.stringify({origin,time:new Date().toISOString(),checks},null,2));console.log(JSON.stringify({status:'VERIFIED',checks},null,2));
} finally {
 // Only synthetic addresses generated by this invocation are removed.
 await db.query('DELETE FROM prelaunch_waitlist WHERE email=$1',[email]);await db.query('DELETE FROM prelaunch_demo_requests WHERE email=$1',[demoEmail]);await db.end();await browser.close();
}
