// Netlify Function: serves /api/* and /media/* (content, enquiries, admin API, uploaded photos).
import { handle } from '../../server/handler.mjs';

export default async (req) => handle(req);
export const config = { path: ['/api/*', '/media/*'] };
