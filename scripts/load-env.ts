/**
 * Loads environment variables the same way Next.js's own dev/build server
 * does: `.env.local` takes priority (the file many devs reach for first),
 * falling back to `.env`. dotenv never overwrites a variable that's already
 * set, so listing `.env.local` first gives it precedence.
 *
 * This must be imported as the very first import in any standalone script
 * (before importing anything that reads `process.env` at module-load time,
 * such as `lib/db.ts` reading `MONGODB_URI`) — side-effect imports run in
 * the order they're written, so this needs to run before the rest.
 */
import { config } from 'dotenv';
import path from 'path';

config({
  path: [path.resolve(process.cwd(), '.env.local'), path.resolve(process.cwd(), '.env')],
});
