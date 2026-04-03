import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

export async function verifyAdminToken(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  if (!process.env.ADMIN_PASSWORD) return false;
  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
