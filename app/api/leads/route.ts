import { NextRequest, NextResponse } from "next/server";
import { validateLead, LeadValidationError } from "@/lib/prelaunch/validation";
import { leadDatabase, saveLead, LeadRateLimitError } from "@/lib/prelaunch/store";

export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:NextRequest) {
  const respond=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"no-store",...(status===429?{"Retry-After":"600"}:{})}});
  const origin=process.env.NEXT_PUBLIC_SITE_URL?new URL(process.env.NEXT_PUBLIC_SITE_URL).origin:request.nextUrl.origin;
  if(request.headers.get("origin")!==origin) return respond({error:"Invalid request origin."},403);
  if(!request.headers.get("content-type")?.startsWith("application/json"))return respond({error:"Use a JSON request."},415);
  const reader=request.body?.getReader();
  if(!reader)return respond({error:"Empty submission."},400);
  let bytes=0,raw="";const decoder=new TextDecoder();
  try {
    while(true){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.byteLength;if(bytes>12000){await reader.cancel();return respond({error:"Submission is too large."},413);}raw+=decoder.decode(chunk.value,{stream:true});}
    raw+=decoder.decode();
    let value:unknown;try{value=JSON.parse(raw);}catch{return respond({error:"Invalid JSON."},400);}
    const lead=validateLead(value);
    const db=leadDatabase();
    try {
      // Cloudflare replaces CF-Connecting-IP at the trusted production edge.
      const network=request.headers.get("cf-connecting-ip")||"local";
      return respond(await saveLead(db,lead,network));
    } finally {await db.end();}
  } catch(error) {
    if(error instanceof LeadValidationError)return respond({error:error.message},400);
    if(error instanceof LeadRateLimitError)return respond({error:error.message},429);
    console.error("Lead submission unavailable",{type:error instanceof Error?error.name:"Unknown"});
    return respond({error:"We couldn't save your request right now. Please try again shortly."},503);
  }
}
