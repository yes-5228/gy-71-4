<template>
  <section class="panel">
    <SectionToolbar eyebrow="Workstations" title="工位管理">
      <div class="filter-bar">
        <select v-model="statusFilter" @change="onFilterChange">
          <option value="">全部状态</option>
          <option value="available">可租</option>
          <option value="leased">已租</option>
          <option value="maintenance">维护</option>
        </select>
        <select v-model="areaFilter" @change="onFilterChange">
          <option value="">全部区域</option>
          <option v-for="a in areaOptions" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
    </SectionToolbar>

    <form class="form-grid" @submit.prevent="submit">
      <input v-model="form.code" placeholder="工位编号" required />
      <input v-model="form.area" placeholder="区域" required />
      <input v-model="form.floor" placeholder="楼层" required />
      <input v-model.number="form.seats" type="number" min="1" placeholder="座位数" required />
      <input v-model.number="form.monthly_rent" type="number" min="0" placeholder="月租金" required />
      <input v-model="form.facilities" placeholder="配套设施" />
      <button type="submit">新增工位</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>区域</th>
            <th>楼层</th>
            <th>座位</th>
            <th>月租金</th>
            <th>状态</th>
            <th>配套</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in workstations" :key="item.id">
            <td>{{ item.code }}</td>
            <td>{{ item.area }}</td>
            <td>{{ item.floor }}</td>
            <td>{{ item.seats }}</td>
            <td>{{ currency(item.monthly_rent) }}</td>
            <td><StatusBadge :value="item.status" /></td>
            <td>{{ item.facilities || '-' }}</td>
            <td>
              <button
                v-if="item.status === 'available'"
                type="button"
                class="small-button"
                @click="goContract(item.id)"
              >签约</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { createWorkstation, fetchWorkstations } from '../api/workstations'
import SectionToolbar from '../components/SectionToolbar.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { currency } from '../utils/formatters'
import { useWorkstationContext } from '../utils/workspaceContext'

const emit = defineEmits(['navigate'])

const { ctx, setFilters, selectForContract, consumeRefresh } = useWorkstationContext()

const statusFilter = ref(ctx.statusFilter)
const areaFilter = ref(ctx.areaFilter)
const workstations = ref([])
const error = ref('')
const form = reactive({
  code: '',
  area: '',
  floor: '',
  seats: 1,
  monthly_rent: 0,
  status: 'available',
  facilities: ''
})

const areaOptions = ref([])

function extractAreas(list) {
  const seen = new Set()
  for (const ws of list) {
    if (ws.area) seen.add(ws.area)
  }
  areaOptions.value = [...seen].sort()
}

async function load() {
  error.value = ''
  try {
    const data = await fetchWorkstations(statusFilter.value, areaFilter.value)
    workstations.value = data
    if (!areaFilter.value) {
      const all = await fetchWorkstations(statusFilter.value, '')
      extractAreas(all)
    } else {
      extractAreas(data)
    }
  } catch (err) {
    error.value = err.message
  }
}

function onFilterChange() {
  setFilters(statusFilter.value, areaFilter.value)
  load()
}

function goContract(workstationId) {
  setFilters(statusFilter.value, areaFilter.value)
  selectForContract(workstationId)
  emit('navigate', 'contracts')
}

async function submit() {
  error.value = ''
  try {
    await createWorkstation({ ...form })
    Object.assign(form, { code: '', area: '', floor: '', seats: 1, monthly_rent: 0, status: 'available', facilities: '' })
    await load()
  } catch (err) {
    error.value = err.message
  }
}

onMounted(() => {
  if (consumeRefresh()) {
    load()
  } else {
    load()
  }
})
</script>
