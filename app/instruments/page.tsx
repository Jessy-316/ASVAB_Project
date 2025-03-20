import createServerClient from '@/utils/supabase/server';

// Force dynamic rendering instead of static generation
export const dynamic = 'force-dynamic';
// Skip during static generation
export const generateStaticParams = () => {
  return [];
}

export default async function Instruments() {
  try {
    // Only try to connect to Supabase if we're not in a static build context
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createServerClient();
      const { data: instruments, error } = await supabase
        .from('instruments')
        .select() as any;
      
      if (error) {
        console.error('Supabase error:', error);
        return <div>Error fetching instruments: {error.message}</div>;
      }
      
      return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
    } else {
      // During static build, return a placeholder
      return <div>Loading instruments data...</div>;
    }
  } catch (error: any) {
    // Handle any errors gracefully
    console.error('Error in Instruments page:', error);
    return <div>Failed to load instruments: {error.message || 'Unknown error'}</div>;
  }
}
