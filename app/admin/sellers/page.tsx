import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

export default async function AdminSellersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch all sellers with property count
  const { data: sellers } = await supabase
    .from('profiles')
    .select(`
      *,
      properties:properties(count)
    `)
    .eq('role', 'seller')
    .order('created_at', { ascending: false })

  const typedSellers = sellers as (Profile & { properties: { count: number }[] })[] | null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Manage Sellers</h1>
          <p className="mt-2 text-zinc-600">
            {typedSellers?.length || 0} {typedSellers?.length === 1 ? 'seller' : 'sellers'} registered
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {!typedSellers || typedSellers.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center">
          <p className="text-zinc-600">No sellers registered yet</p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-zinc-600">Seller</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-zinc-600">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-zinc-600">WhatsApp</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-zinc-600">Properties</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-zinc-600">Joined</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-zinc-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {typedSellers.map((seller) => {
                  const propertyCount = seller.properties?.[0]?.count || 0

                  return (
                    <tr key={seller.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-zinc-900">
                            {seller.company_name || 'Individual Seller'}
                          </p>
                          <p className="text-sm text-zinc-600">{seller.id.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className="capitalize">
                          {seller.seller_type || 'individual'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-zinc-600">
                        {seller.whatsapp_number || '-'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-zinc-600">
                        {new Date(seller.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/sellers/${seller.id}`}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
