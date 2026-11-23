"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toolChoices, workflows } from "@/lib/prelaunch/validation";

type Answers = { email:string; firstName:string; name:string; businessName:string; description:string; workflows:string[]; tools:string[]; consent:boolean; website:string };
const empty:Answers = {email:"",firstName:"",name:"",businessName:"",description:"",workflows:[],tools:[],consent:false,website:""};
export default function LeadForm({type}:{type:"waitlist"|"demo"}) {
  const [answers,setAnswers] = useState<Answers>(empty);
  const [step,setStep] = useState(0);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [success,setSuccess] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const interacted = useRef(false);
  useEffect(()=>{ if(interacted.current) heading.current?.focus(); },[step,success]);
  function update<K extends keyof Answers>(key:K,value:Answers[K]) { setAnswers(old=>({...old,[key]:value})); }
  function field(key:"email"|"firstName"|"name"|"businessName", label:string, required=true) {
    return <label className="launch-field" key={key}>{label}{!required&&<span>Optional</span>}<input name={key} type={key==="email"?"email":"text"} autoComplete={{email:"email",firstName:"given-name",name:"name",businessName:"organization"}[key]} required={required} maxLength={key==="email"?254:key==="businessName"?200:100} value={answers[key]} onChange={e=>update(key,e.target.value)} /></label>;
  }
  function options(key:"workflows"|"tools", choices:readonly string[], legend:string) {
    return <fieldset className="launch-options"><legend>{legend}</legend>{choices.map(choice=><label className="launch-option" key={choice}><input type="checkbox" name={key} value={choice} checked={answers[key].includes(choice)} onChange={e=>update(key,e.target.checked?[...answers[key],choice]:answers[key].filter(v=>v!==choice))}/>{choice}</label>)}</fieldset>;
  }
  const consent = <label className="launch-consent"><input type="checkbox" name="consent" required checked={answers.consent} onChange={e=>update("consent",e.target.checked)}/><span>I agree to receive emails about {type==="waitlist"?"my pre-order invitation":"my demo request"}. See our <Link href="/privacy">Privacy Policy</Link>.</span></label>;
  async function submit(event:React.FormEvent) {
    event.preventDefault();
    if(busy)return;
    if(type==="demo"&&step<3){interacted.current=true;setError("");setStep(step+1);return;}
    setBusy(true);setError("");
    try {
      const response=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...answers,type}),signal:AbortSignal.timeout(25000)});
      const result=await response.json();
      if(!response.ok||result.ok!==true) throw new Error(result.error||"We couldn't save your request. Please try again.");
      interacted.current=true;setSuccess(true);
    } catch(error) {setError(error instanceof Error&&error.name!=="TimeoutError"?error.message:"The connection took too long. Please try again; retries won't create duplicate entries.");}
    finally {setBusy(false);}
  }
  const titles=["Tell Us About Your Business.","What Would You Like WICCLAW to Handle?","What Tools Do You Use?","Review Your Request."];
  return <section className="launch-form-stage"><div className="launch-panel">
    {success?<div className="launch-success" role="status"><span className="launch-check" aria-hidden="true">✓</span><h1 ref={heading} tabIndex={-1}>{type==="waitlist"?"You're on the list.":"Request Received."}</h1><p>{type==="waitlist"?"Thanks for your interest in WICCLAW. We'll contact you at your email address when your pre-order invitation is available.":"Thank you for your interest in WICCLAW. We'll review your request and contact you by email about the next steps."}</p><Link className="launch-button launch-secondary" href="/">BACK TO WICCLAW</Link></div>:<>
      {type==="demo"?<><div className="launch-progress" aria-label={`Step ${step+1} of 4`}>{titles.map((title,i)=><span key={title} data-active={i<=step}/>)}</div><p className="launch-step-count">REQUEST A DEMO · STEP {step+1} OF 4</p></>:<p className="launch-eyebrow">WICCLAW / EARLY ACCESS</p>}
      <div className="launch-step" key={step}><h1 ref={heading} tabIndex={-1}>{type==="waitlist"?"Be First to Work Differently.":titles[step]}</h1>
      {type==="waitlist"&&<><p>WICCLAW is preparing for its next release. Join the pre-order waitlist to receive early access details and your private pre-order link.</p><div className="launch-price">$49</div><p className="launch-price-note">Expected pre-order price. No payment is collected when joining the waitlist.</p></>}
      <form ref={form} onSubmit={submit} aria-busy={busy}>
        <label className="launch-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={answers.website} onChange={e=>update("website",e.target.value)}/></label>
        {type==="waitlist"?<>{field("email","Email address")}{field("firstName","First name",false)}{consent}</>:<>
          {step===0&&<>{field("businessName","Business name")}{field("email","Business email")}{field("name","Your name")}</>}
          {step===1&&<>{options("workflows",workflows,"What type of work would you like to automate? Select all that apply.")}<label className="launch-field">Tell us about the workflow. <span>Optional</span><textarea name="description" maxLength={2000} value={answers.description} onChange={e=>update("description",e.target.value)}/></label></>}
          {step===2&&<>{options("tools",toolChoices,"Select all that apply.")}<p className="launch-fineprint">These choices help us understand your integration interests. They do not indicate current integration support.</p></>}
          {step===3&&<><dl className="launch-review"><dt>Business</dt><dd>{answers.businessName}</dd><dt>Contact</dt><dd>{answers.name}<br/>{answers.email}</dd><dt>Workflows</dt><dd>{answers.workflows.join(", ")||"None selected"}</dd>{answers.description&&<><dt>Your workflow</dt><dd>{answers.description}</dd></>}<dt>Tools</dt><dd>{answers.tools.join(", ")||"None selected"}</dd></dl>{consent}</>}
        </>}
        {error&&<p role="alert" className="launch-error">{error}</p>}
        {type==="waitlist"?<button className="launch-button" disabled={busy}>{busy?"SAVING…":"JOIN THE WAITLIST →"}</button>:<div className="launch-controls">{step>0&&<button type="button" className="launch-button launch-secondary" disabled={busy} onClick={()=>{interacted.current=true;setError("");setStep(step-1);}}>PREVIOUS</button>}<button className="launch-button" disabled={busy}>{busy?"SENDING…":step===3?"REQUEST MY DEMO →":"CONTINUE →"}</button></div>}
      </form></div>{type==="waitlist"&&<p className="launch-fineprint">No charge today. Just a place on the list.</p>}
    </>}
  </div></section>;
}
