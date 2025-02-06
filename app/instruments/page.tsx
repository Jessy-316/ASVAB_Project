import createServerClient from '@/utils/supabase/server';

export default async function Instruments() {
  const supabase = await createServerClient();
  const { data: instruments } = await supabase
    .from('instruments')
    .select() as any;
  
  return <pre>{JSON.stringify(instruments, null, 2)}</pre>
}
