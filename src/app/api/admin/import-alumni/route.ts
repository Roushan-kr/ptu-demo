import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import { parseFile } from '@/lib/parse-import-file';
import { processImportBatch } from '@/lib/import-db-service';
import { isValidFileType } from '@/lib/import-utils';

export async function POST(req: NextRequest) {
  // 1. Authenticate via cookie (our JWT system)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let adminId: string;
  try {
    const payload = verifyAccessToken(accessToken);
    adminId = payload.id;
    // Optional: verify admin exists
    const admin = await prisma.staff.findUnique({ where: { id: adminId } });
    if (!admin) throw new Error('Admin not found');
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // 2. Parse multipart form
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const batchLabel = formData.get('batchLabel') as string | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  if (!batchLabel?.trim()) {
    return NextResponse.json({ error: 'Batch label is required' }, { status: 400 });
  }
  if (!isValidFileType(file.name)) {
    return NextResponse.json({ error: 'Only .csv, .xlsx, .xls files are allowed' }, { status: 400 });
  }

  // 3. Parse file
  let rows;
  try {
    rows = await parseFile(file);
  } catch (err: any) {
    return NextResponse.json({ error: `File parsing failed: ${err.message}` }, { status: 400 });
  }

  if (!rows.length) {
    return NextResponse.json({ error: 'File contains no valid data rows' }, { status: 400 });
  }

  // 4. Process import
  try {
    const result = await processImportBatch(rows, batchLabel, adminId, file.name);
    return NextResponse.json({
      message: `Import completed. ${result.success} inserted, ${result.failed} failed.`,
      result,
    });
  } catch (err: any) {
    console.error('[IMPORT_ALUMNI]', err);
    return NextResponse.json({ error: 'Database error during import', details: err.message }, { status: 500 });
  }
}