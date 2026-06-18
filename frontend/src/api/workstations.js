import { request } from './http'

export function fetchWorkstations(status = '', area = '') {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (area) params.set('area', area)
  const query = params.toString()
  return request(`/workstations${query ? '?' + query : ''}`)
}

export function createWorkstation(payload) {
  return request('/workstations', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateWorkstation(id, payload) {
  return request(`/workstations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
}
