import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolvePurchase } from "../data/hardware";

const scrypt = promisify(scryptCallback);
export const SESSION_COOKIE = "wicclaw_session";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;
export type Account = { id: string; email: string; name: string };
type StoredAccount = Account & { passwordHash: string };
type Session = { hash: string; accountId: string; expiresAt: number };
export type Preview = { id: string; accountId: string; status: "preview"; items: { sku: string; option: "full" | "reserve"; quantity: number; unitAmountCents: number }[]; shipping: Record<string, string>; paymentMethod: "card" | "apple-pay"; totalCents: number; currency: "USD"; createdAt: string };
type Store = { accounts: StoredAccount[]; sessions: Session[]; previews: Preview[] };
export class ShopError extends Error { constructor(message: string, public status = 400) { super(message); } }
const publicAccount = ({ id, email, name }: Account): Account => ({ id, email, name });
const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
let queue: Promise<unknown> = Promise.resolve();

async function localStore<T>(operation: (store: Store) => T): Promise<T> {
  if (process.env.WICCLAW_DEPLOYMENT_STAGE === "production" || (process.env.NODE_ENV === "production" && process.env.WICCLAW_LOCAL_PREVIEW !== "true")) throw new ShopError("Account service is not configured.", 503);
  const directory = process.env.WICCLAW_PREVIEW_STORAGE_DIR || path.join(process.cwd(), ".runtime");
  const file = path.join(directory, "shop.json");
  const task = queue.catch(() => undefined).then(async () => {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    let store: Store;
    try { store = JSON.parse(await readFile(file, "utf8")) as Store; }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; store = { accounts: [], sessions: [], previews: [] }; }
    store.sessions = store.sessions.filter(session => session.expiresAt > Date.now());
    const result = operation(store);
    const temporary = `${file}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(store), { mode: 0o600 });
    await rename(temporary, file);
    return result;
  });
  queue = task;
  return task;
}

async function db() { return (await import("./db")).database(); }
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}
export async function verifyPassword(password: string, encoded: string) {
  const [salt, expected] = encoded.split(":");
  if (!salt || !expected || expected.length !== 128) return false;
  const actual = await scrypt(password, salt, 64) as Buffer;
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}

export async function registerAccount(input: Record<string, unknown>) {
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new ShopError("Enter a valid email address.");
  if (!name || name.length > 100) throw new ShopError("Enter your name (up to 100 characters).");
  if (typeof input.password !== "string" || input.password.length < 12 || input.password.length > 128) throw new ShopError("Use a password between 12 and 128 characters.");
  const account: StoredAccount = { id: randomUUID(), email, name, passwordHash: await hashPassword(input.password) };
  if (process.env.DATABASE_URL) {
    try { await (await db()).query("INSERT INTO shop_accounts (id,email,name,password_hash) VALUES ($1,$2,$3,$4)", [account.id,email,name,account.passwordHash]); }
    catch (error) { if ((error as {code?: string}).code === "23505") throw new ShopError("An account already uses this email. Sign in instead.",409); throw error; }
  } else await localStore(store => { if (store.accounts.some(item => item.email === email)) throw new ShopError("An account already uses this email. Sign in instead.",409); store.accounts.push(account); });
  return publicAccount(account);
}

export async function loginAccount(input: Record<string, unknown>) {
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase().slice(0,254) : "";
  if (typeof input.password !== "string" || input.password.length > 128) throw new ShopError("Email or password is incorrect.",401);
  const account: StoredAccount | undefined = process.env.DATABASE_URL
    ? (await (await db()).query('SELECT id,email,name,password_hash AS "passwordHash" FROM shop_accounts WHERE email=$1',[email])).rows[0]
    : await localStore(store => store.accounts.find(item => item.email === email));
  // Run the same expensive derivation even for unknown accounts.
  const valid = await verifyPassword(input.password, account?.passwordHash || `${"0".repeat(32)}:${"0".repeat(128)}`);
  if (!account || !valid) throw new ShopError("Email or password is incorrect.",401);
  return publicAccount(account);
}

export async function createSession(accountId: string) {
  const token = randomBytes(32).toString("hex");
  const session: Session = { hash: tokenHash(token), accountId, expiresAt: Date.now() + SESSION_SECONDS * 1000 };
  if (process.env.DATABASE_URL) await (await db()).query("INSERT INTO shop_sessions (token_hash,account_id,expires_at) VALUES ($1,$2,$3)",[session.hash,accountId,new Date(session.expiresAt)]);
  else await localStore(store => { store.sessions.push(session); });
  return token;
}
export async function sessionAccount(token?: string): Promise<Account | null> {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const hash = tokenHash(token);
  if (process.env.DATABASE_URL) return (await (await db()).query("SELECT a.id,a.email,a.name FROM shop_accounts a JOIN shop_sessions s ON s.account_id=a.id WHERE s.token_hash=$1 AND s.expires_at>now()",[hash])).rows[0] || null;
  return localStore(store => { const session = store.sessions.find(item => item.hash === hash); const account = store.accounts.find(item => item.id === session?.accountId); return account ? publicAccount(account) : null; });
}
export async function deleteSession(token?: string) {
  if (!token) return;
  if (process.env.DATABASE_URL) await (await db()).query("DELETE FROM shop_sessions WHERE token_hash=$1",[tokenHash(token)]);
  else await localStore(store => { store.sessions = store.sessions.filter(item => item.hash !== tokenHash(token)); });
}

export function validatePreview(accountId: string, input: Record<string, unknown>): Preview {
  if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 10) throw new ShopError("Your bag must contain between 1 and 10 items.");
  const items = input.items.map(value => {
    if (!value || typeof value !== "object") throw new ShopError("Invalid bag item.");
    const item = value as Record<string, unknown>;
    const purchase = resolvePurchase(item.sku,item.option);
    if (!purchase || !Number.isInteger(item.quantity) || Number(item.quantity) < 1 || Number(item.quantity) > 10) throw new ShopError("This product, payment option, or quantity is unavailable.");
    return { sku: purchase.product.sku, option: purchase.option, quantity: Number(item.quantity), unitAmountCents: purchase.amountDueCents };
  });
  if (!input.shipping || typeof input.shipping !== "object") throw new ShopError("Enter your delivery address.");
  const raw = input.shipping as Record<string, unknown>;
  const shipping: Record<string,string> = {};
  for (const key of ["name","address1","address2","city","region","postalCode","country","phone"]) {
    if (raw[key] !== undefined && typeof raw[key] !== "string") throw new ShopError("Invalid delivery address.");
    shipping[key] = typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
    if (shipping[key].length > 150 || (key !== "address2" && !shipping[key])) throw new ShopError(`Enter a valid ${key === "address1" ? "street address" : key}.`);
  }
  if (shipping.country !== "US" || !/^\d{5}(-\d{4})?$/.test(shipping.postalCode)) throw new ShopError("Use a US delivery address and valid ZIP code for this preview.");
  if (!/^[A-Za-z]{2}$/.test(shipping.region)) throw new ShopError("Use a two-letter state code.");
  if (shipping.phone.replace(/\D/g, "").length < 10 || shipping.phone.replace(/\D/g, "").length > 15) throw new ShopError("Enter a valid phone number.");
  if (input.paymentMethod !== "card" && input.paymentMethod !== "apple-pay") throw new ShopError("Choose a payment method.");
  return { id: randomUUID(), accountId, status: "preview", items, shipping, paymentMethod: input.paymentMethod, totalCents: items.reduce((sum,item) => sum + item.unitAmountCents * item.quantity,0), currency: "USD", createdAt: new Date().toISOString() };
}
export async function savePreview(accountId: string, input: Record<string, unknown>) {
  const preview = validatePreview(accountId,input);
  if (process.env.DATABASE_URL) await (await db()).query("INSERT INTO shop_preview_orders (id,account_id,payload) VALUES ($1,$2,$3)",[preview.id,accountId,JSON.stringify(preview)]);
  else await localStore(store => { store.previews.push(preview); });
  return preview;
}
export async function getPreview(accountId: string, id: string): Promise<Preview | null> {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  if (process.env.DATABASE_URL) return (await (await db()).query("SELECT payload FROM shop_preview_orders WHERE id=$1 AND account_id=$2",[id,accountId])).rows[0]?.payload || null;
  return localStore(store => store.previews.find(item => item.id === id && item.accountId === accountId) || null);
}

const attempts = new Map<string,{count: number; until: number}>();
export function enforceRateLimit(key: string, limit = 15) {
  const now = Date.now();
  for (const [id, entry] of attempts) if (entry.until <= now) attempts.delete(id);
  const entry = attempts.get(key) || { count: 0, until: now + 15 * 60 * 1000 };
  if (attempts.size >= 10000 && !attempts.has(key)) throw new ShopError("Try again in a few minutes.",429);
  entry.count++; attempts.set(key,entry);
  if (entry.count > limit) throw new ShopError("Too many attempts. Try again in 15 minutes.",429);
}
export async function accountOrders(accountId: string) {
  if (!process.env.DATABASE_URL) return [];
  return (await (await db()).query(
    "SELECT id,product_name,quantity,payment_option,payment_status,fulfillment_status,amount_paid_cents,amount_refunded_cents,hardware_balance_cents,created_at FROM preorders WHERE account_id=$1 ORDER BY created_at DESC LIMIT 100",
    [accountId],
  )).rows;
}

