const API_BASE = '/api'

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

  getDesigns: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchJSON(`/designs/${query ? '?' + query : ''}`)
  },
  getDesign: (id) => fetchJSON(`/designs/${id}/`),
  exportDesign: (id) => fetchJSON(`/designs/${id}/export/`, { method: 'POST' }),
  getStats: () => fetchJSON('/stats/'),

  adminLogin: (data) => fetchJSON('/admin-auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  adminStats: () => fetchJSON('/admin-auth/stats/'),
  adminLogs: () => fetchJSON('/admin-auth/logs/'),
  adminUsers: () => fetchJSON('/admin-auth/users/'),
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

  getOriginkit: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchJSON(`/originkit/${query ? '?' + query : ''}`)
  },
  getOriginkitDetail: (name) => fetchJSON(`/originkit/${name}/`),
}
