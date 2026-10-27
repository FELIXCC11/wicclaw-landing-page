import test from "node:test";
import assert from "node:assert/strict";
import { localReferenceReviewAllowed } from "../scripts/assert-reference-assets.mjs";

test("temporary reference review requires explicit opt-in and a loopback origin", () => {
  assert.equal(localReferenceReviewAllowed({}),false);
  assert.equal(localReferenceReviewAllowed({WICCLAW_LOCAL_REFERENCE_REVIEW:"true"}),true);
  for (const overrides of [
    {WICCLAW_DEPLOYMENT_STAGE:"production"},
    {VERCEL_ENV:"production"},
    {VERCEL_ENV:"preview"},
    {NEXT_PUBLIC_SITE_URL:"https://wicclaw.ai"},
    {NEXT_PUBLIC_SITE_URL:"invalid"},
  ]) assert.equal(localReferenceReviewAllowed({WICCLAW_LOCAL_REFERENCE_REVIEW:"true",...overrides}),false);
});
