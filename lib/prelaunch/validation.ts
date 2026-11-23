export const workflows = ["Accounting and bookkeeping", "Data entry and spreadsheets", "Reporting and analytics", "Administrative tasks", "Customer support", "Business operations", "Other"] as const;
export const toolChoices = ["QuickBooks", "Microsoft 365", "Google Workspace", "ADP", "CRM software", "Other"] as const;
export type Lead = { type: "waitlist" | "demo"; email: string; firstName: string; businessName: string; name: string; workflows: string[]; tools: string[]; description: string; consent: true };
export class LeadValidationError extends Error {}
export function validateLead(value: unknown): Lead {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new LeadValidationError("Please submit a valid form.");
  const body = value as Record<string, unknown>;
  const text = (key: string, max: number, required = false) => {
    const raw = body[key];
    if (raw !== undefined && typeof raw !== "string") throw new LeadValidationError("Please check your form fields.");
    const result = ((raw || "") as string).trim();
    if ((required && !result) || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(result)) throw new LeadValidationError("Please complete the required fields within the character limits.");
    return result;
  };
  if (body.type !== "waitlist" && body.type !== "demo") throw new LeadValidationError("Unknown submission type.");
  if (body.website) throw new LeadValidationError("Unable to accept this submission.");
  if (body.consent !== true) throw new LeadValidationError("Please agree to be contacted about your request.");
  const email = text("email", 254, true).toLowerCase();
  const [local, domain, extra] = email.split("@");
  if (extra !== undefined || !local || local.length > 64 || !domain || !/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+$/i.test(local) || local.startsWith(".") || local.endsWith(".") || local.includes("..") || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain)) throw new LeadValidationError("Enter a valid email address.");
  const selections = (key: string, allowed: readonly string[]) => {
    const values = body[key] ?? [];
    if (!Array.isArray(values) || values.length > allowed.length || values.some(v => typeof v !== "string" || !allowed.includes(v))) throw new LeadValidationError("Please choose from the listed options.");
    return [...new Set(values)] as string[];
  };
  return { type: body.type, email, firstName: text("firstName", 100), businessName: text("businessName", 200, body.type === "demo"), name: text("name", 150, body.type === "demo"), workflows: selections("workflows", workflows), tools: selections("tools", toolChoices), description: text("description", 2000), consent: true };
}
