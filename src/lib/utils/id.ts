/**
 * ULID (Universally Unique Lexicographically Sortable Identifier) generator.
 * Spec §5.1: every table uses ULID as primary key.
 *
 * ULIDs are:
 * - 26 chars, URL-safe, case-insensitive
 * - Sortable by creation time (unlike UUID v4)
 * - Suitable as Postgres varchar(26) PK
 *
 * Implementation: hand-rolled to avoid runtime dependency in Sprint 0.1.
 * When `ulid` package is installed in a future sprint, replace with:
 *   import { ulid } from "ulid";
 *   export { ulid as generateId };
 */

const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ENCODING_LEN = ENCODING.length;
const TIME_LEN = 10;
const RANDOM_LEN = 16;

function encodeTime(now: number, len: number): string {
  let mod: number;
  let str = "";
  for (let i = len; i > 0; i--) {
    mod = now % ENCODING_LEN;
    str = (ENCODING[mod] ?? "0") + str;
    now = Math.floor(now / ENCODING_LEN);
  }
  return str;
}

function encodeRandom(len: number): string {
  let str = "";
  const randomBytes = new Uint8Array(len);
  crypto.getRandomValues(randomBytes);
  for (let i = 0; i < len; i++) {
    str += ENCODING[(randomBytes[i] ?? 0) % ENCODING_LEN] ?? "0";
  }
  return str;
}

/**
 * Generates a ULID string — 26 chars, lexicographically sortable.
 * Safe to call from both server and client (uses Web Crypto API).
 */
export function generateId(): string {
  return encodeTime(Date.now(), TIME_LEN) + encodeRandom(RANDOM_LEN);
}
