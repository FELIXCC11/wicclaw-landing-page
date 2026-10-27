import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { GET as accountStatus, POST as accountAction } from "../app/api/account/route";
import { GET as previewStatus, POST as previewAction } from "../app/api/shop/preview-order/route";

test("HTTP account and preview flow rejects cross-origin writes and unauthenticated requests", async () => {
  const directory = await mkdtemp(path.join(tmpdir(),"wicclaw-api-test-"));
  const previous = {storage:process.env.WICCLAW_PREVIEW_STORAGE_DIR, database:process.env.DATABASE_URL, origin:process.env.NEXT_PUBLIC_SITE_URL};
  process.env.WICCLAW_PREVIEW_STORAGE_DIR = directory;
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  delete process.env.DATABASE_URL;
  const post = (url: string, body: unknown, cookie = "", origin = "http://localhost:3000") => new NextRequest(`http://localhost:3000${url}`,{method:"POST",headers:{origin,"content-type":"application/json",cookie},body:JSON.stringify(body)});
  const get = (url: string, cookie = "") => new NextRequest(`http://localhost:3000${url}`,{headers:{cookie}});
  try {
    const credentials = {action:"register",name:"API Customer",email:"api@example.com",password:"a sufficiently long password"};
    assert.equal((await accountAction(post("/api/account",credentials,"","https://attacker.invalid"))).status,403);
    assert.equal((await previewAction(post("/api/shop/preview-order",{}))).status,401);
    const response = await accountAction(post("/api/account",credentials));
    assert.equal(response.status,200);
    const setCookie = response.headers.get("set-cookie") || "";
    assert.match(setCookie,/HttpOnly/i);
    assert.match(setCookie,/SameSite=lax/i);
    const cookie = setCookie.split(";")[0];
    assert.equal((await (await accountStatus(get("/api/account",cookie))).json()).account.email,"api@example.com");
    const previewResponse = await previewAction(post("/api/shop/preview-order",{items:[{sku:"wicmini-current",option:"reserve",quantity:1}],shipping:{name:"API Customer",address1:"123 Main Street",city:"Austin",region:"TX",postalCode:"78701",country:"US",phone:"5125550100"},paymentMethod:"apple-pay"},cookie));
    assert.equal(previewResponse.status,201);
    const {preview} = await previewResponse.json();
    assert.equal(preview.totalCents,2000);
    assert.equal((await previewStatus(get(`/api/shop/preview-order?id=${preview.id}`,cookie))).status,200);
    const other = await accountAction(post("/api/account",{...credentials,email:"other@example.com"}));
    const otherCookie = (other.headers.get("set-cookie") || "").split(";")[0];
    assert.equal((await previewStatus(get(`/api/shop/preview-order?id=${preview.id}`,otherCookie))).status,404);
    assert.equal((await accountAction(post("/api/account",{action:"logout"},cookie))).status,200);
    assert.equal((await (await accountStatus(get("/api/account",cookie))).json()).account,null);
  } finally {
    for (const [key,value] of Object.entries({WICCLAW_PREVIEW_STORAGE_DIR:previous.storage,DATABASE_URL:previous.database,NEXT_PUBLIC_SITE_URL:previous.origin})) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    await rm(directory,{recursive:true,force:true});
  }
});
