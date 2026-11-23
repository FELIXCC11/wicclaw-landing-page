import {test} from "node:test";
import assert from "node:assert/strict";
import {validateLead,workflows,toolChoices} from "../lib/prelaunch/validation";
const valid={type:"waitlist",email:" Person+early@Example.com ",consent:true};
test("waitlist normalizes email, does not require name",()=>{const lead=validateLead(valid);assert.equal(lead.email,"person+early@example.com");assert.equal(lead.firstName,"");});
test("rejects invalid addresses, consent, spam and oversized fields",()=>{
  for(const email of ["a@b","a..b@example.com",".a@example.com","a.@example.com","a@-bad.com","a@example..com","a\n@example.com","a@b@example.com"]){assert.throws(()=>validateLead({...valid,email}));}
  for(const changes of [{consent:false},{website:"spam"},{firstName:"x".repeat(101)},{type:"checkout"},{tools:["unlisted"]},{workflows:"Other"}])assert.throws(()=>validateLead({...valid,...changes}));
});
test("demo preserves selections and requires business and contact",()=>{
  const demo={...valid,type:"demo",businessName:"Example Co",name:"Reviewer",workflows:[...workflows],tools:[...toolChoices],description:"Monthly reports"};
  assert.deepEqual(validateLead(demo).workflows,workflows);assert.deepEqual(validateLead(demo).tools,toolChoices);
  assert.throws(()=>validateLead({...demo,name:""}));assert.throws(()=>validateLead({...demo,businessName:""}));
});
