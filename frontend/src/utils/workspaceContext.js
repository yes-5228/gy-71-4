import { reactive } from 'vue'

const ctx = reactive({
  statusFilter: '',
  areaFilter: '',
  selectedWorkstationId: null,
  needsRefresh: false,
  lastSignedWorkstation: null
})

export function useWorkstationContext() {
  function setFilters(status, area) {
    ctx.statusFilter = status
    ctx.areaFilter = area
  }

  function selectForContract(workstationId) {
    ctx.selectedWorkstationId = workstationId
  }

  function clearSelection() {
    ctx.selectedWorkstationId = null
  }

  function markNeedsRefresh() {
    ctx.needsRefresh = true
  }

  function consumeRefresh() {
    const val = ctx.needsRefresh
    ctx.needsRefresh = false
    return val
  }

  function setLastSignedWorkstation(workstation) {
    ctx.lastSignedWorkstation = workstation
  }

  function consumeLastSigned() {
    const val = ctx.lastSignedWorkstation
    ctx.lastSignedWorkstation = null
    return val
  }

  return {
    ctx,
    setFilters,
    selectForContract,
    clearSelection,
    markNeedsRefresh,
    consumeRefresh,
    setLastSignedWorkstation,
    consumeLastSigned
  }
}
