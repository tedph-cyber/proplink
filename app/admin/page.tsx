import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
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

  // Get statistics
  const { count: totalSellers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'seller')

  const { count: totalProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })

  const { count: activeProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: soldProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sold')

  // Recent properties
  const { data: recentProperties } = await supabase
    .from('properties')
    .select(`
      id,
      title,
      property_type,
      status,
      created_at,
      profiles!properties_seller_id_fkey (
        id,
        whatsapp_number
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Admin Dashboard</h1>
        <p className="mt-2 text-zinc-600">Manage sellers, properties, and platform content</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Total Sellers</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900">{totalSellers || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Total Properties</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900">{totalProperties || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Active Listings</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900">{activeProperties || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Sold Properties</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900">{soldProperties || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/admin/sellers"
          className="rounded-lg border border-zinc-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Manage Sellers</h3>
              <p className="text-sm text-zinc-600">View and manage seller accounts</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/properties"
          className="rounded-lg border border-zinc-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Manage Properties</h3>
              <p className="text-sm text-zinc-600">View, edit, and delete all listings</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Properties */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Recent Properties</h2>
        
        {!recentProperties || recentProperties.length === 0 ? (
          <p className="text-sm text-zinc-600">No properties yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="py-3 px-4 text-left font-medium text-zinc-600">Title</th>
                  <th className="py-3 px-4 text-left font-medium text-zinc-600">Type</th>
                  <th className="py-3 px-4 text-left font-medium text-zinc-600">Status</th>
                  <th className="py-3 px-4 text-left font-medium text-zinc-600">Date</th>
                  <th className="py-3 px-4 text-left font-medium text-zinc-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProperties.map((property: any) => (
                  <tr key={property.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-3 px-4 font-medium text-zinc-900">{property.title}</td>
                    <td className="py-3 px-4 text-zinc-600 capitalize">{property.property_type}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        property.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'sold'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-zinc-100 text-zinc-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      {new Date(property.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/properties/${property.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

