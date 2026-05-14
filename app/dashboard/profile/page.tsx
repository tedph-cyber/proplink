'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import styles from '@/styles/admin.module.css'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    whatsapp_number: '',
    seller_type: 'individual' as 'individual' | 'agent' | 'developer',
    company_name: '',
  })

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      setUserEmail(user.email || '')
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        const p = data as Profile
        setFormData({
          username: p.username || '',
          whatsapp_number: p.whatsapp_number || '',
          seller_type: p.seller_type || 'individual',
          company_name: p.company_name || '',
        })
        setAvatarUrl(p.avatar_url || null)
      }
      setLoading(false)
    }
    loadProfile()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const updates: Record<string, any> = {
      whatsapp_number: formData.whatsapp_number,
      seller_type: formData.seller_type,
      company_name: formData.company_name,
      username: formData.username || null,
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (error) {
      if (error.message.includes('profiles_username_key') || error.message.includes('unique')) {
        setMessage({ type: 'error', text: 'This username is already taken. Please choose another.' })
      } else {
        setMessage({ type: 'error', text: 'Error updating profile: ' + error.message })
      }
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setMessage(null), 4000)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className={styles.loadingCenter}><div className={styles.loadingSpinner} /></div>
  }

  const typeOptions = [
    { value: 'individual', label: 'Individual', desc: 'Private property owner', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { value: 'agent', label: 'Agent', desc: 'Licensed real estate agent', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { value: 'developer', label: 'Developer', desc: 'Property developer or company', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  ]

  return (
    <div className={styles.pageNarrow}>
      {/* Header */}
      <div>
        <h1 className={styles.pageTitleLg}>Profile Settings</h1>
        <p className={styles.pageSubtitle}>Manage your account information and preferences.</p>
      </div>

      {/* Avatar */}
      <div className={styles.profileCard}>
        <p className={styles.profileCardTitle}>Profile Photo</p>
        <AvatarUpload
          userId={userId}
          currentAvatarUrl={avatarUrl}
          onUploadComplete={(url) => setAvatarUrl(url)}
        />
        <p className={styles.profileInputHint + ' mt-3'}>Square image recommended. Max 2MB.</p>
      </div>

      {/* Email card (read-only) */}
      <div className={styles.profileCard}>
        <p className={styles.profileCardTitle}>Account Email</p>
        <div className={styles.profileEmailRow}>
          <div className={styles.profileEmailIcon}>
            <svg className={styles.profileIconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className={styles.profileEmailValue}>{userEmail}</p>
            <p className={styles.profileEmailHint}>Email address cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        {/* Account Type */}
        <div className={styles.profileCard}>
          <p className={styles.profileCardTitle}>Account Type</p>
          <div className={styles.typeGrid}>
            {typeOptions.map(({ value, label, desc, icon }) => {
              const active = formData.seller_type === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, seller_type: value as typeof formData.seller_type })}
                  className={active ? styles.typeOptionActive : styles.typeOption}
                >
                  <div className={active ? styles.typeOptionIconActive : styles.typeOptionIconDefault}>
                    <svg className={styles.typeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                  </div>
                  <p className={active ? styles.typeLabelActive : styles.typeLabelDefault}>{label}</p>
                  <p className={styles.typeDesc}>{desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Contact & Identity */}
        <div className={styles.profileCard}>
          <p className={styles.profileCardTitle}>Contact Details</p>
          <div className={styles.fieldGroup}>

            {/* Username */}
            <div>
              <label className={styles.fieldLabel}>Username</label>
              <div className={styles.profileNameWrap}>
                <div className={styles.profileNameIcon}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={styles.profileNameInput}
                />
              </div>
              <p className={styles.profileInputHint}>Public handle. Must be unique.</p>
            </div>

            {/* WhatsApp */}
            <div>
              <label className={styles.fieldLabel}>WhatsApp Number</label>
              <div className={styles.inputWrap}>
                <div className={styles.inputPrefix}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  className={styles.profileNameInput}
                />
              </div>
              <p className={styles.profileInputHint}>Include country code, e.g., +234 for Nigeria</p>
            </div>

            {/* Company Name (conditional) */}
            {(formData.seller_type === 'agent' || formData.seller_type === 'developer') && (
              <div>
                <label className={styles.fieldLabel}>Company Name</label>
                <div className={styles.profileNameWrap}>
                  <div className={styles.profileNameIcon}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Your company or agency name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className={styles.profileNameInput}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={message.type === 'error' ? styles.messageError : styles.messageSuccess}>
            <svg className={styles.messageIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {message.type === 'error'
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
            </svg>
            {message.text}
          </div>
        )}

        {/* Actions */}
        <div className={styles.formActions}>
          <button type="submit" disabled={saving} className={styles.btnPrimary}>
            {saving ? (
              <>
                <div className={styles.spinnerSm} />
                Saving…
              </>
            ) : (
              <>
                <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
          <button type="button" onClick={() => router.push('/dashboard')} className={styles.btnSecondary}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
