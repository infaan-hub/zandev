import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, GripVertical, Star, X, Check } from 'lucide-react'
import { api } from '../lib/api'

export default function AdminPricingPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editPlan, setEditPlan] = useState(null)
  const [form, setForm] = useState({
    name: '', slug: '', price: '', period: 'month', description: '',
    features: [''], design_limit: 0, is_popular: false, is_active: true, order: 0,
  })

  const load = async () => {
    try {
      setLoading(true)
      const data = await api.adminGetPricingPlans()
      setPlans(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditPlan(null)
    setForm({ name: '', slug: '', price: '', period: 'month', description: '', features: [''], design_limit: 0, is_popular: false, is_active: true, order: 0 })
    setShowForm(true)
  }

  const openEdit = (plan) => {
    setEditPlan(plan)
    setForm({
      name: plan.name, slug: plan.slug, price: plan.price, period: plan.period,
      description: plan.description, features: plan.features?.length ? plan.features : [''],
      design_limit: plan.design_limit, is_popular: plan.is_popular, is_active: plan.is_active, order: plan.order,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...form,
        price: parseFloat(form.price) || 0,
        features: form.features.filter(f => f.trim()),
      }
      if (editPlan) {
        await api.adminUpdatePricingPlan(editPlan.id, data)
      } else {
        await api.adminCreatePricingPlan(data)
      }
      setShowForm(false)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan?')) return
    try {
      await api.adminDeletePricingPlan(id)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  const addFeature = () => setForm({ ...form, features: [...form.features, ''] })
  const updateFeature = (i, val) => {
    const f = [...form.features]
    f[i] = val
    setForm({ ...form, features: f })
  }
  const removeFeature = (i) => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-white">Pricing Plans</h1>
          <p className="text-[11px] text-[#666] mt-1">Manage pricing plans for your platform</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-[11px] font-semibold hover:-translate-y-0.5 transition-transform">
          <Plus size={14} /> Add Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-[#4ade80] animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className={`rounded-2xl border p-5 ${plan.is_popular ? 'border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-blue-500/5' : 'border-white/[0.08] bg-[#080808]'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-white">{plan.name}</h3>
                    {plan.is_popular && <Star size={12} className="text-violet-400 fill-violet-400" />}
                  </div>
                  <p className="text-[10px] text-[#666] mt-1">{plan.period}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(plan)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#666] hover:text-white hover:bg-white/[0.06] transition-colors">
                    <Edit size={13} />
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-[28px] font-bold text-white">${plan.price}</span>
                <span className="text-[11px] text-[#666]">/{plan.period}</span>
              </div>
              {plan.description && <p className="text-[11px] text-[#888] mb-3">{plan.description}</p>}
              <div className="space-y-2">
                {(plan.features || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-[#aaa]">
                    <Check size={11} className="text-[#4ade80] shrink-0" /> {f}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${plan.is_active ? 'bg-[#4ade80]/10 text-[#4ade80]' : 'bg-red-500/10 text-red-400'}`}>
                  {plan.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-[9px] text-[#555]">Limit: {plan.design_limit || 'Unlimited'}</span>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-3 text-center py-20 text-[#444] text-[12px]">No pricing plans yet. Click "Add Plan" to create one.</div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-[500px] max-h-[90vh] overflow-auto p-6 rounded-2xl border border-white/[0.10] bg-[#0a0a0a]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-semibold">{editPlan ? 'Edit Plan' : 'Create Plan'}</h3>
              <button onClick={() => setShowForm(false)} className="text-[#666] hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-semibold uppercase tracking-wider text-[#666] mb-2">Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                    className="w-full h-[38px] px-3 rounded-lg border border-white/[0.10] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/[0.25]" placeholder="Pro" />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold uppercase tracking-wider text-[#666] mb-2">Slug</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full h-[38px] px-3 rounded-lg border border-white/[0.10] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/[0.25]" placeholder="pro" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-semibold uppercase tracking-wider text-[#666] mb-2">Price ($)</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required
                    className="w-full h-[38px] px-3 rounded-lg border border-white/[0.10] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/[0.25]" placeholder="9.99" />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold uppercase tracking-wider text-[#666] mb-2">Period</label>
                  <select value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}
                    className="w-full h-[38px] px-3 rounded-lg border border-white/[0.10] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/[0.25]">
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                    <option value="one-time">One Time</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-wider text-[#666] mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.10] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/[0.25] resize-none" />
              </div>
              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-wider text-[#666] mb-2">Features</label>
                <div className="space-y-2">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={f} onChange={e => updateFeature(i, e.target.value)}
                        className="flex-1 h-[36px] px-3 rounded-lg border border-white/[0.10] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/[0.25]" placeholder="Feature text" />
                      <button type="button" onClick={() => removeFeature(i)} className="w-[36px] h-[36px] rounded-lg flex items-center justify-center text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addFeature} className="text-[10px] text-[#4ade80] hover:underline">+ Add feature</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-semibold uppercase tracking-wider text-[#666] mb-2">Design Limit (0=unlimited)</label>
                  <input type="number" value={form.design_limit} onChange={e => setForm({ ...form, design_limit: parseInt(e.target.value) || 0 })}
                    className="w-full h-[38px] px-3 rounded-lg border border-white/[0.10] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/[0.25]" />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold uppercase tracking-wider text-[#666] mb-2">Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full h-[38px] px-3 rounded-lg border border-white/[0.10] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/[0.25]" />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_popular} onChange={e => setForm({ ...form, is_popular: e.target.checked })} className="accent-violet-500" />
                  <span className="text-[11px] text-[#888]">Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-[#4ade80]" />
                  <span className="text-[11px] text-[#888]">Active</span>
                </label>
              </div>
              <button type="submit" className="w-full h-[40px] rounded-lg bg-white text-black text-[12px] font-semibold hover:-translate-y-0.5 transition-transform">
                {editPlan ? 'Update Plan' : 'Create Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
