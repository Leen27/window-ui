<script setup lang="ts" generic="TData, TValue">
import { type ColumnDef, type Row, type Table,
  FlexRender,
  getCoreRowModel,
  useVueTable
} from '@tanstack/vue-table'
import { h, ref, type HTMLAttributes } from 'vue';
import Checkbox from '../checkbox/index.vue'
import { valueUpdater } from '../../ui.config/data-table'

type Props = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  class?: HTMLAttributes['class']
  checkable?: boolean
  onClickCell?: (row: Row<TData>) => void
}

const props = defineProps<Props>()

const rowSelection = ref({})

const checkColDef: ColumnDef<TData> = {
  id: 'select',
  header: ({table}) => h(Checkbox, {
    'checked': table.getIsAllPageRowsSelected(),
    'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
    'ariaLable': 'Select all'
  }),
  cell: ({row}) => h(Checkbox, {
    'checked': row.getIsSelected(),
    'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
    'ariaLabel': 'Select row'
  }),
  enableSorting: false,
  enableHiding: false
}

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.checkable ? [checkColDef, ...props.columns] : props.columns },
  getCoreRowModel: getCoreRowModel(),
  enableRowSelection: true,
  onRowSelectionChange: updateOrValue => valueUpdater(updateOrValue, rowSelection),
  state: {
    get rowSelection() { return rowSelection.value }
  }
})

const handleCellClick = (row: Row<TData>) => {
  props.onClickCell && props.onClickCell(row)
}

defineExpose({
  table
})
</script>
<template>
  <w-table :class="props.class">
    <w-table-header class="sticky">
      <w-table-row
        v-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <U-table-head
          v-for="header in headerGroup.headers"
          :key="header.id"
        >
          <flex-render
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </U-table-head>
      </w-table-row>
    </w-table-header>
    <w-table-body :lass="'min-h-5 overflow-y-scroll'">
      <template v-if="table.getRowModel().rows?.length">
        <w-table-row
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          :data-state="row.getIsSelected() ? 'selected' : undefined"
        >
          <w-table-cell
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            @click="handleCellClick(row)"
          >
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </w-table-cell>
        </w-table-row>
      </template>
      <template v-else>
        <w-table-row>
          <w-table-cell
            :col-span="columns.length"
            class="h-24 text-center"
          >
            NO Data.
          </w-table-cell>
        </w-table-row>
      </template>
    </w-table-body>
  </w-table>
</template>