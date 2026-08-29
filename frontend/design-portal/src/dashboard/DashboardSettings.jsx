import { User, Bell, Shield, Palette, Save, CreditCard, Globe, Key, CheckCircle, Download as DownloadIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useDashboard } from './DashboardContext'

export default function DashboardSettings() {
  const { settings, updateSettings, toggleNotification, downloads, addToast, isLight } = useDashboard()
  const [name, setName] = useState(settings.name)
  const [email, setEmail] = useState(settings.email)
  const [username, setUsername] = useState(settings.username)
  const [bio, setBio] = useState(settings.bio)
  const [website, setWebsite] = useState(settings.website)
  const [activeTab, setActiveTab] = useState('profile')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactor, setTwoFactor] = useState(false)

  const c = {
    card: isLight ? 'bg-white border-black/[0.06]' : 'bg-[#080808] border-white/[0.10]',
    muted: isLight ? 'text-[#888]' : 'text-[#6c6c6c]',
    subtle: isLight ? 'text-[#666]' : 'text-[#555]',
    body: isLight ? 'text-[#333]' : 'text-[#888]',
    text: isLight ? 'text-[#1a1a1a]' : 'text-white',
    border: isLight ? 'border-black/[0.06]' : 'border-white/[0.06]',
    input: isLight ? 'bg-black/[0.03] border-black/[0.06] text-[#1a1a1a] placeholder:text-[#999] focus:border-black/[0.15]' : 'bg-white/[0.03] border-white/[0.08] text-white placeholder:text-[#555] focus:border-white/[0.2]',
    btn: isLight ? 'bg-black/[0.04] text-[#666] border-black/[0.08] hover:text-[#1a1a1a] hover:bg-black/[0.06]' : 'bg-white/[0.03] text-[#888] border-white/[0.08] hover:text-white hover:bg-white/[0.06]',
    toggleOn: 'bg-[#4ade80] border-[#4ade80]',
    toggleOff: isLight ? 'bg-black/[0.08] border-black/[0.1]' : 'bg-white/[0.08] border-white/[0.1]',
    toggleKnob: isLight ? 'bg-white' : 'bg-[#555]',
    dangerCard: isLight ? 'bg-[#fef2f2] border-[#fecaca]' : 'bg-[#ef4444]/5 border-[#ef4444]/20',
  }

  const handleSaveProfile = () => { updateSettings({ name, email, username, bio, website }) }
  const handleSavePassword = () => {
    if (!currentPassword || !newPassword) { addToast('Please fill in all password fields', 'error'); return }
    if (newPassword !== confirmPassword) { addToast('New passwords do not match', 'error'); return }
    if (newPassword.length < 8) { addToast('Password must be at least 8 characters', 'error'); return }
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    addToast('Password updated successfully')
  }
  const handleToggle2FA = () => { setTwoFactor(!twoFactor); addToast(twoFactor ? '2FA disabled' : '2FA enabled') }
  const handleExportAll = () => {
    const blob = new Blob([JSON.stringify(downloads, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'zandev-downloads.json'; a.click(); URL.revokeObjectURL(url)
    addToast('All downloads exported')
  }
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) addToast('Account deletion requested', 'error')
  }

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'billing', label: 'Billing', icon: CreditCard },
    { key: 'appearance', label: 'Appearance', icon: Palette },
    { key: 'data', label: 'Data', icon: DownloadIcon },
  ]

  return (
    <div>
      <div className="mb-[32px]">
        <h1 className={`${c.text} text-[clamp(28px,4vw,40px)] leading-[0.95] tracking-[-0.06em] font-bold`}>Settings</h1>
        <p className={`${c.body} text-[12px] leading-[1.7] mt-[8px]`}>Manage your account and preferences.</p>
      </div>

      <div className="flex items-center gap-[6px] mb-[24px] flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] text-[10px] font-medium border transition-colors ${activeTab === tab.key ? 'bg-white text-black border-white' : c.btn}`}>
              <Icon size={12} />{tab.label}
            </button>
          )
        })}
      </div>

      <div className="max-w-[640px]">
        {activeTab === 'profile' && (
          <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
            <div className="flex items-center gap-[10px] mb-[20px]"><User size={16} className={c.muted} /><div className={`text-[12px] font-semibold ${c.text}`}>Profile Information</div></div>
            <div className="flex items-center gap-[16px] mb-[20px]">
              <div className="w-[64px] h-[64px] rounded-full border grid place-items-center text-[22px] font-bold" style={{ background: `${settings.accentColor}20`, borderColor: `${settings.accentColor}30`, color: settings.accentColor }}>{(name || 'D')[0].toUpperCase()}</div>
              <div>
                <div className={`text-[12px] font-medium ${c.text}`}>{name || 'Developer'}</div>
                <div className={`${c.body} text-[10px]`}>@{username || 'developer'}</div>
                <button className={`mt-[6px] text-[9px] ${c.body} hover:${c.text} transition-colors`}>Change avatar</button>
              </div>
            </div>
            <div className="flex flex-col gap-[14px]">
              <div className="grid grid-cols-2 gap-[12px]">
                <div><label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[6px] block`}>Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full px-[14px] py-[10px] rounded-[10px] border text-[12px] outline-none transition-colors ${c.input}`} /></div>
                <div><label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[6px] block`}>Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={`w-full px-[14px] py-[10px] rounded-[10px] border text-[12px] outline-none transition-colors ${c.input}`} /></div>
              </div>
              <div><label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[6px] block`}>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-[14px] py-[10px] rounded-[10px] border text-[12px] outline-none transition-colors ${c.input}`} /></div>
              <div><label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[6px] block`}>Bio</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className={`w-full px-[14px] py-[10px] rounded-[10px] border text-[12px] outline-none transition-colors resize-none ${c.input}`} /></div>
              <div><label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[6px] block`}>Website</label><div className="flex items-center gap-[8px]"><Globe size={14} className={c.subtle} /><input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={`flex-1 px-[14px] py-[10px] rounded-[10px] border text-[12px] outline-none transition-colors ${c.input}`} /></div></div>
              <button onClick={handleSaveProfile} className="self-start flex items-center gap-[8px] px-[16px] py-[10px] rounded-[10px] text-[11px] font-semibold bg-white text-black hover:bg-white/90 transition-colors"><Save size={14} />Save Profile</button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
            <div className="flex items-center gap-[10px] mb-[20px]"><Bell size={16} className={c.muted} /><div className={`text-[12px] font-semibold ${c.text}`}>Notification Preferences</div></div>
            <div className="flex flex-col gap-[4px]">
              {[
                { key: 'email', label: 'Email notifications', desc: 'Receive email updates about your account activity' },
                { key: 'downloads', label: 'Download alerts', desc: 'Get notified when new designs match your interests' },
                { key: 'updates', label: 'Product updates', desc: 'Learn about new features and improvements' },
                { key: 'marketing', label: 'Marketing emails', desc: 'Receive tips, trends, and design inspiration' },
              ].map((item) => (
                <label key={item.key} className={`flex items-center justify-between p-[14px] rounded-[10px] cursor-pointer transition-colors ${isLight ? 'hover:bg-black/[0.02]' : 'hover:bg-white/[0.02]'}`}>
                  <div>
                    <div className={`text-[11px] font-medium ${c.text}`}>{item.label}</div>
                    <div className={`${c.body} text-[9px] mt-[2px]`}>{item.desc}</div>
                  </div>
                  <button onClick={() => toggleNotification(item.key)} className={`w-[36px] h-[20px] rounded-full border relative cursor-pointer transition-colors ${settings.notifications[item.key] ? c.toggleOn : c.toggleOff}`}>
                    <div className={`absolute top-[3px] w-[14px] h-[14px] rounded-full transition-all ${settings.notifications[item.key] ? 'left-[19px] bg-white' : `left-[3px] ${c.toggleKnob}`}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="flex flex-col gap-[12px]">
            <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
              <div className="flex items-center gap-[10px] mb-[20px]"><Key size={16} className={c.muted} /><div className={`text-[12px] font-semibold ${c.text}`}>Change Password</div></div>
              <div className="flex flex-col gap-[14px] max-w-[400px]">
                <div><label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[6px] block`}>Current Password</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className={`w-full px-[14px] py-[10px] rounded-[10px] border text-[12px] outline-none transition-colors ${c.input}`} /></div>
                <div><label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[6px] block`}>New Password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className={`w-full px-[14px] py-[10px] rounded-[10px] border text-[12px] outline-none transition-colors ${c.input}`} /></div>
                <div><label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[6px] block`}>Confirm New Password</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={`w-full px-[14px] py-[10px] rounded-[10px] border text-[12px] outline-none transition-colors ${c.input}`} /></div>
                <button onClick={handleSavePassword} className="self-start flex items-center gap-[8px] px-[16px] py-[10px] rounded-[10px] text-[11px] font-semibold bg-white text-black hover:bg-white/90 transition-colors"><Save size={14} />Update Password</button>
              </div>
            </div>
            <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
              <div className="flex items-center gap-[10px] mb-[20px]"><Shield size={16} className={c.muted} /><div className={`text-[12px] font-semibold ${c.text}`}>Two-Factor Authentication</div></div>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-[11px] ${c.text}`}>Add an extra layer of security to your account</div>
                  <div className={`text-[9px] mt-[2px]`}>Currently <span className={twoFactor ? 'text-[#4ade80]' : 'text-[#ef4444]'}>{twoFactor ? 'enabled' : 'disabled'}</span></div>
                </div>
                <button onClick={handleToggle2FA} className={`px-[14px] py-[8px] rounded-[8px] text-[10px] font-medium transition-colors ${twoFactor ? 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 hover:bg-[#ef4444]/20' : 'bg-white text-black hover:bg-white/90'}`}>
                  {twoFactor ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
            <div className="flex items-center gap-[10px] mb-[20px]"><CreditCard size={16} className={c.muted} /><div className={`text-[12px] font-semibold ${c.text}`}>Subscription Plan</div></div>
            <div className={`p-[20px] rounded-[14px] border mb-[20px] ${isLight ? 'border-[#4ade80]/30 bg-[#f0fdf4]' : 'border-[#4ade80]/30 bg-[#4ade80]/5'}`}>
              <div className="flex items-center gap-[8px] mb-[8px]"><CheckCircle size={14} className="text-[#4ade80]" /><span className={`text-[12px] font-semibold ${c.text}`}>Pro Plan</span></div>
              <div className={`${c.body} text-[10px]`}>$19/month · Renews on Sep 15, 2026</div>
              <div className="flex gap-[12px] mt-[12px] text-[9px]"><span className="text-[#4ade80]">✓ Unlimited downloads</span><span className="text-[#4ade80]">✓ All frameworks</span><span className="text-[#4ade80]">✓ Priority export</span></div>
            </div>
            <div className="flex gap-[8px]">
              <button onClick={() => addToast('Plan management coming soon')} className={`px-[14px] py-[8px] rounded-[8px] text-[10px] font-medium border transition-colors ${c.btn}`}>Change Plan</button>
              <button onClick={() => addToast('Cancellation flow coming soon', 'error')} className="px-[14px] py-[8px] rounded-[8px] text-[10px] font-medium text-[#ef4444] border border-[#ef4444]/20 hover:bg-[#ef4444]/10 transition-colors">Cancel Subscription</button>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
            <div className="flex items-center gap-[10px] mb-[20px]"><Palette size={16} className={c.muted} /><div className={`text-[12px] font-semibold ${c.text}`}>Appearance</div></div>
            <div className="flex flex-col gap-[14px]">
              <div>
                <label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[8px] block`}>Theme</label>
                <div className="flex gap-[8px]">
                  {['Dark', 'Light', 'System'].map((theme) => (
                    <button key={theme} onClick={() => { updateSettings({ theme }); addToast(`Theme changed to ${theme}`) }} className={`flex-1 py-[10px] rounded-[10px] text-[10px] font-medium border transition-colors ${settings.theme === theme ? 'bg-white text-black border-white' : c.btn}`}>{theme}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[8px] block`}>Accent Color</label>
                <div className="flex gap-[8px]">
                  {[{ color: '#4ade80', name: 'Green' }, { color: '#60a5fa', name: 'Blue' }, { color: '#f472b6', name: 'Pink' }, { color: '#fbbf24', name: 'Yellow' }, { color: '#a78bfa', name: 'Purple' }].map((clr) => (
                    <button key={clr.color} onClick={() => { updateSettings({ accentColor: clr.color }); addToast(`Accent color changed to ${clr.name}`) }} className={`w-[32px] h-[32px] rounded-full border-2 transition-colors ${settings.accentColor === clr.color ? 'border-white scale-110' : 'border-transparent hover:border-white/50'}`} style={{ background: clr.color }} title={clr.name} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="flex flex-col gap-[12px]">
            <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
              <div className="flex items-center gap-[10px] mb-[20px]"><DownloadIcon size={16} className={c.muted} /><div className={`text-[12px] font-semibold ${c.text}`}>Export Your Data</div></div>
              <p className={`${c.body} text-[10px] mb-[16px]`}>Download all your downloads and project data as JSON.</p>
              <button onClick={handleExportAll} className={`flex items-center gap-[8px] px-[14px] py-[8px] rounded-[8px] text-[10px] font-medium border transition-colors ${c.btn}`}><DownloadIcon size={12} />Export All Data</button>
            </div>
            <div className={`p-[24px] rounded-[18px] border ${c.dangerCard}`}>
              <div className="flex items-center gap-[10px] mb-[20px]"><Trash2 size={16} className="text-[#ef4444]" /><div className="text-[12px] font-semibold text-[#ef4444]">Danger Zone</div></div>
              <p className={`${c.body} text-[10px] mb-[16px]`}>Permanently delete your account and all associated data. This cannot be undone.</p>
              <button onClick={handleDeleteAccount} className="flex items-center gap-[8px] px-[14px] py-[8px] rounded-[8px] text-[10px] font-medium text-[#ef4444] border border-[#ef4444]/20 hover:bg-[#ef4444]/10 transition-colors"><Trash2 size={12} />Delete Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
