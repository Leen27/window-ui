<script setup lang="ts">
const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
]
</script>

<template>
  <WTable>
    <WTableCaption>
      A list of your recent invoices.
    </WTableCaption>
    <WTableHeader>
      <WTableRow>
        <WTableHead class="w-[100px]">
          Invoice
        </WTableHead>
        <WTableHead>
          Status
        </WTableHead>
        <WTableHead>
          Method
        </WTableHead>
        <WTableHead class="text-right">
          Amount
        </WTableHead>
      </WTableRow>
    </WTableHeader>
    <WTableBody>
      <WTableRow
        v-for="invoice in invoices"
        :key="invoice.invoice"
      >
        <WTableCell class="font-medium">
          {{ invoice.invoice }}
        </WTableCell>
        <WTableCell>
          {{ invoice.paymentStatus }}
        </WTableCell>
        <WTableCell>
          {{ invoice.paymentMethod }}
        </WTableCell>
        <WTableCell class="text-right">
          {{ invoice.totalAmount }}
        </WTableCell>
      </WTableRow>
    </WTableBody>
  </WTable>
</template>