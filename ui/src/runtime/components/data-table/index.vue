<template>
  <div>
    <div :class="cn('w-full overflow-x-auto', props.class)">
      <WTable :class="tableClass">
        <WTableHeader>
          <WTableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <WTableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colspan="header.colSpan"
              :class="[
                'relative group',
                header.column.getCanSort() && 'cursor-pointer select-none',
              ]"
              :style="{
                width: `${header.getSize()}px`
              }"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <template v-if="!header.isPlaceholder">
                <div class="flex items-center gap-3">
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <w-icon
                    v-if="
                      header.column.getCanSort() &&
                        header.column.getIsSorted() === 'asc'
                    "
                    name="radix:TriangleUpIcon"
                    default-class="w-4 h-4"
                  />
                  <w-icon
                    v-else-if="
                      header.column.getCanSort() &&
                        header.column.getIsSorted() === 'desc'
                    "
                    name="radix:TriangleDownIcon"
                    default-class="w-4 h-4"
                  />
                </div>
              </template>
              <div
                :data-isresizing="header.column.getIsResizing()"
                :class="['@apply absolute translate-x-1/2 h-full w-[4px] cursor-col-resize select-none touch-none right-0 top-0 hover:opacity-1 data-[isresizing=true]:bg-primary']"
                @mousedown="header.getResizeHandler()?.($event)"
                @touchstart="header.getResizeHandler()?.($event)"
              />
            </WTableHead>
          </WTableRow>
        </WTableHeader>

        <WTableBody>
          <WTableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : ''"
          >
            <WTableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </WTableCell>
          </WTableRow>
          <WTableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : ''"
          >
            <WTableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </WTableCell>
          </WTableRow>

          <WTableEmpty
            v-if="table.getRowModel().rows.length === 0"
            :colspan="table.getAllLeafColumns().length"
          >
            <slot
              :table="table"
              name="empty"
            >
              No data available.
            </slot>
          </WTableEmpty>
        </WTableBody>
      </WTable>
    </div>

    <div
      v-if="showPagination"
      class="my-6 flex flex-col justify-between gap-4 px-2 md:flex-row md:items-center"
    >
      <div class="flex items-center justify-between gap-3">
        <slot
          name="rowsSelected"
          :table="table"
        >
          <div
            v-if="showSelect"
            class="whitespace-nowrap text-sm text-muted-foreground"
          >
            <span>
              {{ table.getFilteredSelectedRowModel().rows.length }} of
              {{ " " }} {{ table.getFilteredRowModel().rows.length }} row(s)
              selected
            </span>
          </div>
        </slot>
        <slot
          name="rowsPerPage"
          :table="table"
        >
          <div class="flex items-center space-x-2 whitespace-nowrap">
            <p
              class="hidden text-sm font-medium text-foreground md:inline-block"
            >
              {{ rowsPerPageText }}
            </p>
            <WSelect v-model="pageSizeModel">
              <WSelectTrigger class="h-9 w-[70px]">
                {{ table.getState().pagination.pageSize }}
              </WSelectTrigger>
              <WSelectContent
                side="top"
                align="start"
              >
                <WSelectGroup>
                  <WSelectItem
                    v-for="pageSize in pageSizes"
                    :key="pageSize"
                    :value="`${pageSize}`"
                  >
                    {{ pageSize }}
                  </WSelectItem>
                </WSelectGroup>
              </WSelectContent>
            </WSelect>
          </div>
        </slot>
      </div>

      <div class="flex items-center justify-between gap-3">
        <slot
          :table="table"
          name="page"
        >
          <div
            class="flex items-center justify-center whitespace-nowrap text-sm font-medium text-foreground"
          >
            Page {{ table.getState().pagination.pageIndex + 1 }} of
            {{ table.getPageCount() }}
          </div>
        </slot>

        <slot
          :table="table"
          name="pageButtons"
        >
          <div class="flex items-center space-x-2">
            <WButton
              variant="outline"
              title="First page"
              class="h-9 w-9 p-0"
              :disabled="!table.getCanPreviousPage()"
              @click="table.setPageIndex(0)"
            >
              <svg

                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </WButton>
            <WButton
              variant="outline"
              title="Previous page"
              class="h-9 w-9 p-0"
              :disabled="!table.getCanPreviousPage()"
              @click="table.previousPage()"
            >
              <svg

                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </WButton>
            <WButton
              variant="outline"
              title="Next page"
              class="h-9 w-9 p-0"
              :disabled="!table.getCanNextPage()"
              @click="table.nextPage()"
            >
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </WButton>
            <WButton
              variant="outline"
              title="Last page"
              class="h-9 w-9 p-0"
              :disabled="!table.getCanNextPage()"
              @click="table.setPageIndex(table.getPageCount() - 1)"
            >
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </WButton>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup generic="T">
import WCheckBox from "../checkbox/index.vue";
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import type { ColumnDef, SortingState, Table } from "@tanstack/vue-table";
import { cn } from "../../utils";

const props = withDefaults(
  defineProps<{
    data?: T[];
    columns?: ColumnDef<T>[];
    search?: string;
    showSelect?: boolean;
    pageSizes?: number[];
    pageSize?: number;
    sorting?: SortingState;
    tableClass?: any;
    ascIcon?: string;
    descIcon?: string;
    unsortedIcon?: string;
    class?: any;
    showPagination?: boolean;
    rowsPerPageText?: string;
  }>(),
  {
    pageSizes: () => [10, 20, 30, 40, 50, 100],
    pageSize: () => 10,
    columns: () => [],
    data: () => [],
    sorting: () => [],
    ascIcon: "heroicons:chevron-up",
    descIcon: "heroicons:chevron-down",
    unsortedIcon: "heroicons:chevron-up-down",
    showPagination: true,
    rowsPerPageText: "Rows per page:",
  },
);

defineOptions({ inheritAttrs: false });

const checkBoxHeader: ColumnDef<any> = {
  id: "checkbox",
  header: ({ table, header }) => {
    return h(
      "div",
      { class: "w-full flex items-center justify-center" },
      h(WCheckBox, {
        checked: table.getIsAllRowsSelected()
          ? true
          : table.getIsSomeRowsSelected()
          ? "indeterminate"
          : false,
        "onUpdate:checked": (value: boolean) =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    );
  },
  cell: ({ row }) => {
    return h(
      "div",
      { class: "flex items-center justify-center " },
      h(WCheckBox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
    );
  },
  enableSorting: false,
  enableHiding: false,
};

const localColumns: ColumnDef<T>[] = [...props.columns];

if (props.showSelect) {
  localColumns.unshift(checkBoxHeader);
}

const emit = defineEmits<{
  ready: [table: Table<T>];
}>();

const localSorting = ref(props.sorting);
const globalFilter = ref(props.search);
const columnVisibility = ref({});
const rowSelection = ref({});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return localColumns;
  },
  initialState: {
    pagination: {
      pageSize: props.pageSize,
    },
    rowSelection: rowSelection.value,
    globalFilter: props.search,
  },
  state: {
    get sorting() {
      return localSorting.value;
    },
    get globalFilter() {
      return props.search;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
  },
  onSortingChange: (updaterOrValue) => {
    localSorting.value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(localSorting.value)
        : updaterOrValue;
  },
  onGlobalFilterChange: (updaterOrValue) => {
    globalFilter.value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(globalFilter.value)
        : updaterOrValue;
  },
  onRowSelectionChange: (updaterOrValue) => {
    rowSelection.value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(rowSelection.value)
        : updaterOrValue;
  },
  columnResizeMode: 'onChange', //change column resize mode to "onChange"
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  enableRowSelection: () => !!props.showSelect,
});

function toggleColumnVisibility(column: any) {
  columnVisibility.value = {
    ...columnVisibility.value,
    [column.id]: !column.getIsVisible(),
  };
}

const pageSizeModel = computed({
  get() {
    return table.getState().pagination.pageSize.toString();
  },
  set(value) {
    table.setPageSize(Number(value));
  },
});

onMounted(() => {
  emit("ready", table);
});

defineExpose({ toggleColumnVisibility });
</script>

