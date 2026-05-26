import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server-auth';

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message || 'Sign out failed.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
