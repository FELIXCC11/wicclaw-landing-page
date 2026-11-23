import {test} from "node:test";
import assert from "node:assert/strict";
import {NextRequest} from "next/server";
import {POST} from "../../app/api/leads/route";

test("lead endpoint never returns success when storage is unconfigured",async()=>{
  const previous={db:process.env.DATABASE_URL,lead:process.env.WICCLAW_LEADS_DATABASE_URL,origin:process.env.NEXT_PUBLIC_SITE_URL};
  delete process.env.DATABASE_URL;delete process.env.WICCLAW_LEADS_DATABASE_URL;process.env.NEXT_PUBLIC_SITE_URL="https://wicclaw.it";
  try {
    const response=await POST(new NextRequest("https://wicclaw.it/api/leads",{method:"POST",headers:{origin:"https://wicclaw.it","content-type":"application/json"},body:JSON.stringify({type:"waitlist",email:"qa@example.com",consent:true})}));
    assert.equal(response.status,503);const body=await response.json();assert.equal(body.ok,undefined);assert.match(body.error,/couldn't save/);
  } finally {
    for(const [key,value] of [["DATABASE_URL",previous.db],["WICCLAW_LEADS_DATABASE_URL",previous.lead],["NEXT_PUBLIC_SITE_URL",previous.origin]]){if(value===undefined)delete process.env[key!];else process.env[key!]=value;}
  }
});
