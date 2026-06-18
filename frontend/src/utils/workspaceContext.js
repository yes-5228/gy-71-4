import { reactive } from 'vue'

const ctx = reactive({
  statusFilter: '',
  areaFilter: '',
  selectedWorkstationId: null,
  workstationsNeedRefresh: false,
  contractsNeedRefresh: false,
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

  function markWorkstationsNeedRefresh() {
    ctx.workstationsNeedRefresh = true
  }

  function consumeWorkstationsRefresh() {
    const val = ctx.workstationsNeedRefresh
    ctx.workstationsNeedRefresh = false
    return val
  }

  function markContractsNeedRefresh() {
    ctx.contractsNeedRefresh = true
  }

  function consumeContractsRefresh() {
    const val = ctx.contractsNeedRefresh
    ctx.contractsNeedRefresh = false
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
    markWorkstationsNeedRefresh,
    consumeWorkstationsRefresh,
    markContractsNeedRefresh,
    consumeContractsRefresh,
    setLastSignedWorkstation,
    consumeLastSigned
  }
}
