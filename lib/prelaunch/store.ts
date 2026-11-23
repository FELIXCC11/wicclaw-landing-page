import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { Pool } from "pg";
import type { Lead } from "./validation";

export class LeadRateLimitError extends Error {}
export function leadDatabase() {
  const connectionString=process.env.WICCLAW_LEADS_DATABASE_URL||process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Lead storage is not configured");
  // Per-request connections are compatible with Workers' request I/O ownership.
  return new Pool({connectionString,max:1,connectionTimeoutMillis:5000,statement_timeout:8000,ssl:process.env.DATABASE_SSL==="true"?{rejectUnauthorized:true}:undefined});
}
export async function saveLead(db:Pool, lead:Lead, network:string) {
  const window=Math.floor(Date.now()/600000);
  const rateKeys=[`network:${network}:${window}`,`email:${lead.email}:${window}`].map(value=>createHash("sha256").update(value).digest("hex"));
  await db.query("DELETE FROM prelaunch_rate_limits WHERE expires_at < now()");
  for(const key of rateKeys) {
    const counter=await db.query<{hits:number}>(`INSERT INTO prelaunch_rate_limits(key,hits,expires_at) VALUES($1,1,now()+interval '10 minutes') ON CONFLICT(key) DO UPDATE SET hits=prelaunch_rate_limits.hits+1 RETURNING hits`,[key]);
    if(counter.rows[0].hits>10) throw new LeadRateLimitError("Too many submissions. Please try again in 10 minutes.");
  }
  const id=randomUUID();
  const data={firstName:lead.firstName,name:lead.name,businessName:lead.businessName,description:lead.description,workflows:[...lead.workflows].sort(),tools:[...lead.tools].sort()};
  const status=process.env.RESEND_API_KEY&&process.env.WICCLAW_EMAIL_FROM&&process.env.WICCLAW_EMAIL_SENDER_VERIFIED==="true"?"pending":"not_configured";
  const table=lead.type==="waitlist"?"prelaunch_waitlist":"prelaunch_demo_requests";
  const dedupe=createHash("sha256").update(JSON.stringify({email:lead.email,...data})).digest("hex");
  const inserted=lead.type==="waitlist"
    ? await db.query(`INSERT INTO prelaunch_waitlist(id,email,form_data,consent,email_status) VALUES($1,$2,$3,true,$4) ON CONFLICT(email) DO NOTHING RETURNING id`,[id,lead.email,JSON.stringify(data),status])
    : await db.query(`INSERT INTO prelaunch_demo_requests(id,email,form_data,consent,email_status,dedupe_key) VALUES($1,$2,$3,true,$4,$5) ON CONFLICT(dedupe_key) DO NOTHING RETURNING id`,[id,lead.email,JSON.stringify(data),status,dedupe]);
  // Use the same response for existing and newly stored entries to avoid email enumeration.
  if(inserted.rowCount && status==="pending") await sendLeadEmail(db,table,id,lead);
  return {ok:true};
}
async function sendLeadEmail(db:Pool, table:"prelaunch_waitlist"|"prelaunch_demo_requests", id:string, lead:Lead) {
  await db.query(`UPDATE ${table} SET email_status='sending',email_attempt_at=now() WHERE id=$1`,[id]);
  try {
    const response=await fetch("https://api.resend.com/emails",{method:"POST",signal:AbortSignal.timeout(8000),headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json","Idempotency-Key":`wicclaw-lead-${id}`},body:JSON.stringify({from:process.env.WICCLAW_EMAIL_FROM,to:[lead.email],subject:lead.type==="waitlist"?"You're on the WICCLAW waitlist":"WICCLAW demo request received",text:lead.type==="waitlist"?"Thanks for your interest in WICCLAW. We'll contact you when your pre-order invitation is available. No payment has been collected. If you did not request this, contact us to remove your entry.":"Thank you for your interest in WICCLAW. We'll review your demo request and contact you by email about the next steps. If you did not request this, contact us to remove your entry.",reply_to:process.env.WICCLAW_SUPPORT_EMAIL||"hello@wicclaw.ai"})});
    if(!response.ok) throw new Error("Email provider rejected the request");
    const result=await response.json() as {id?:string};
    if(!result.id) throw new Error("Email provider did not acknowledge the request");
    await db.query(`UPDATE ${table} SET email_status='accepted',email_provider_id=$2 WHERE id=$1`,[id,result.id]);
  } catch {
    // The lead is durably saved; a mail failure must not lose it or claim delivery.
    await db.query(`UPDATE ${table} SET email_status='failed' WHERE id=$1`,[id]);
  }
}
