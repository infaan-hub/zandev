const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function fetchJSON(url, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Token ${token}`

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `API error: ${res.status}`)
  return data
}

async function fetchUpload(url, formData) {
  const token = localStorage.getItem('token')
  const headers = {}
  if (token) headers['Authorization'] = `Token ${token}`

  const res = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers,
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `API error: ${res.status}`)
  return data
}

export const api = {
  register: (data) => fetchJSON('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => fetchJSON('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  getUser: () => fetchJSON('/auth/user/'),
  updateUser: (data) => fetchJSON('/auth/user/update/', { method: 'PUT', body: JSON.stringify(data) }),
  requestPasswordReset: (data) => fetchJSON('/auth/password-reset/', { method: 'POST', body: JSON.stringify(data) }),
  confirmPasswordReset: (data) => fetchJSON('/auth/password-reset/confirm/', { method: 'POST', body: JSON.stringify(data) }),

  getDesigns: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchJSON(`/designs/${query ? '?' + query : ''}`)
  },
  getDesign: (id) => fetchJSON(`/designs/${id}/`),
  exportDesign: (id) => fetchJSON(`/designs/${id}/export/`, { method: 'POST' }),
  compareDesigns: (ids) => fetchJSON(`/designs/compare/?ids=${ids}`),
  getStats: () => fetchJSON('/stats/'),
  getCategories: () => fetchJSON('/categories/'),
  contact: (data) => fetchJSON('/contact/', { method: 'POST', body: JSON.stringify(data) }),

  getCollections: () => fetchJSON('/collections/'),
  createCollection: (data) => fetchJSON('/collections/', { method: 'POST', body: JSON.stringify(data) }),
  deleteCollection: (id) => fetchJSON(`/collections/${id}/`, { method: 'DELETE' }),
  addToCollection: (collectionId, designId) => fetchJSON(`/collections/${collectionId}/`, { method: 'POST', body: JSON.stringify({ design_id: designId, action: 'add' }) }),
  removeFromCollection: (collectionId, designId) => fetchJSON(`/collections/${collectionId}/`, { method: 'POST', body: JSON.stringify({ design_id: designId, action: 'remove' }) }),

  getReviews: (designId) => fetchJSON(`/designs/${designId}/reviews/`),
  createReview: (designId, data) => fetchJSON(`/designs/${designId}/reviews/`, { method: 'POST', body: JSON.stringify(data) }),

  getRemixes: () => fetchJSON('/remixes/'),

  getWebhooks: () => fetchJSON('/webhooks/'),
  createWebhook: (data) => fetchJSON('/webhooks/', { method: 'POST', body: JSON.stringify(data) }),
  deleteWebhook: (id) => fetchJSON(`/webhooks/${id}/`, { method: 'DELETE' }),

  getAnalyticsDashboard: () => fetchJSON('/analytics/dashboard/'),

  adminLogin: (data) => fetchJSON('/admin-auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  adminStats: () => fetchJSON('/admin-auth/stats/'),
  adminLogs: () => fetchJSON('/admin-auth/logs/'),
  adminAuditLogs: () => fetchJSON('/admin-auth/audit-logs/'),
  adminUsers: () => fetchJSON('/admin-auth/users/'),
  adminUpdateUser: (id, data) => fetchJSON(`/admin-auth/users/${id}/update/`, { method: 'POST', body: JSON.stringify(data) }),
  adminBlockUser: (id) => fetchJSON(`/admin-auth/users/${id}/block/`, { method: 'POST' }),
  adminUnblockUser: (id) => fetchJSON(`/admin-auth/users/${id}/unblock/`, { method: 'POST' }),
  adminDeleteUser: (id) => fetchJSON(`/admin-auth/users/${id}/delete/`, { method: 'POST' }),
  adminDownloads: () => fetchJSON('/admin-auth/downloads/'),
  adminSecurityScan: () => fetchJSON('/admin-auth/security/scan/', { method: 'POST' }),
  adminThreats: () => fetchJSON('/admin-auth/threats/'),
  adminResolveThreat: (id) => fetchJSON('/admin-auth/threats/resolve/', { method: 'POST', body: JSON.stringify({ threat_id: id }) }),
  adminBlockedIPs: () => fetchJSON('/admin-auth/blocked-ips/'),
  adminBlockIP: (data) => fetchJSON('/admin-auth/blocked-ips/', { method: 'POST', body: JSON.stringify(data) }),
  adminUnblockIP: (id) => fetchJSON(`/admin-auth/blocked-ips/${id}/`, { method: 'DELETE' }),

  adminGetDesigns: () => fetchJSON('/admin-auth/designs/'),
  adminCreateDesign: (formData) => fetchUpload('/admin-auth/designs/create/', formData),
  adminUpdateDesign: (id, formData) => fetchUpload(`/admin-auth/designs/${id}/update/`, formData),
  adminDeleteDesign: (id) => fetchJSON(`/admin-auth/designs/${id}/delete/`, { method: 'POST' }),
  adminBulkDesigns: (data) => fetchJSON('/admin-auth/designs/bulk/', { method: 'POST', body: JSON.stringify(data) }),
  adminGetDesignVersions: (id) => fetchJSON(`/admin-auth/designs/${id}/versions/`),
  adminContactMessages: () => fetchJSON('/admin-auth/contact-messages/'),
  adminMarkMessageRead: (id) => fetchJSON('/admin-auth/contact-messages/', { method: 'POST', body: JSON.stringify({ id }) }),
}
