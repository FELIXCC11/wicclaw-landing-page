const origin = process.env.NEXT_PUBLIC_SITE_URL;
const token = process.env.WICCLAW_ADMIN_TOKEN;
if (!origin || !token) throw new Error("Set NEXT_PUBLIC_SITE_URL and WICCLAW_ADMIN_TOKEN securely.");
const response = await fetch(new URL("/api/admin/emails",origin),{ method:"POST",headers:{Authorization:"Bearer "+token}});
if (!response.ok) throw new Error("Email retry failed with status "+response.status);
console.log("Email outbox processed.");
