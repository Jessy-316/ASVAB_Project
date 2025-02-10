// pages/api/webhooks/clerk.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { id, email_addresses, first_name, last_name } = req.body

        const email = email_addresses[0]?.email_address || ''
        const fullName = `${first_name} ${last_name}`.trim()

        // Upsert user into Supabase
        const { error } = await supabase
            .from('users')
            .upsert([
                {
                    clerk_id: id,
                    email: email,
                    name: fullName || null,
                },
            ])

        if (error) throw error

        return res.status(200).json({ message: 'User saved to Supabase' })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        return res.status(500).json({ error: errorMessage })
    }
}
