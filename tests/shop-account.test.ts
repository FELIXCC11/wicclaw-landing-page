import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createSession, deleteSession, getPreview, loginAccount, registerAccount, savePreview, sessionAccount, validatePreview } from "../lib/shop-account";

test("accounts persist hashed credentials, sessions revoke, and previews enforce ownership and catalog prices", async () => {
  const directory = await mkdtemp(path.join(tmpdir(),"wicclaw-shop-test-"));
  const previous = process.env.WICCLAW_PREVIEW_STORAGE_DIR;
  const database = process.env.DATABASE_URL;
  process.env.WICCLAW_PREVIEW_STORAGE_DIR = directory;
  delete process.env.DATABASE_URL;
  try {
    const account = await registerAccount({email:" TEST@example.com ",name:"Test Customer",password:"a secure test password"});
    assert.equal(account.email,"test@example.com");
    assert.equal("passwordHash" in account,false);
    await assert.rejects(registerAccount({email:"test@example.com",name:"Test",password:"a secure test password"}),/already uses/);
    await assert.rejects(loginAccount({email:account.email,password:"wrong"}),/incorrect/);
    assert.equal((await loginAccount({email:account.email,password:"a secure test password"})).id,account.id);
    const token = await createSession(account.id);
    assert.equal((await sessionAccount(token))?.id,account.id);
    assert.equal(await sessionAccount("0".repeat(64)),null);
    const input = {items:[{sku:"wicmini-current",option:"full",quantity:2,unitAmountCents:1}],shipping:{name:"Test Customer",address1:"123 Main St",city:"Austin",region:"TX",postalCode:"78701",country:"US",phone:"5125550100"},paymentMethod:"card",totalCents:1};
    const preview = await savePreview(account.id,input);
    assert.equal(preview.totalCents,159800);
    assert.equal(preview.status,"preview");
    assert.equal((await getPreview(account.id,preview.id))?.id,preview.id);
    assert.equal(await getPreview("another-account",preview.id),null);
    assert.throws(() => validatePreview(account.id,{...input,items:[{sku:"wicmini-current",option:"full",quantity:-1}]}));
    assert.throws(() => validatePreview(account.id,{...input,items:[{sku:"fake",option:"full",quantity:1}]}));
    assert.equal(validatePreview(account.id,{...input,items:[{sku:"wicmini-current",option:"reserve",quantity:1}]}).totalCents,2000);
    const persisted = await readFile(path.join(directory,"shop.json"),"utf8");
    assert.equal(persisted.includes("a secure test password"),false);
    assert.equal(persisted.includes(token),false);
    await deleteSession(token);
    assert.equal(await sessionAccount(token),null);
  } finally {
    if (previous === undefined) delete process.env.WICCLAW_PREVIEW_STORAGE_DIR; else process.env.WICCLAW_PREVIEW_STORAGE_DIR = previous;
    if (database === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = database;
    await rm(directory,{recursive:true,force:true});
  }
});
