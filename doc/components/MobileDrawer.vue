<template>
  <HTransitionRoot appear :show="isOpen" as="template">
    <HDialog as="div" @close="isOpen = false" class="relative z-50 lg:hidden">
      <HTransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        leave="duration-150 ease-in"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-background/50 backdrop-blur-sm"></div>
      </HTransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full">
          <HTransitionChild
            as="template"
            enter="duration-300 ease-in"
            leave="duration-300 ease-out"
            enter-from="-translate-x-full"
            leave-to="-translate-x-full"
          >
            <HDialogPanel class="relative h-screen w-72 border-r bg-background p-5">
              <div v-if="isOpen" class="absolute -right-12 top-2">
                <button
                  @click="isOpen = false"
                  class="flex h-9 w-9 items-center justify-center rounded-full border bg-background lg:hidden"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <MainNav />
            </HDialogPanel>
          </HTransitionChild>
        </div>
      </div>
    </HDialog>
  </HTransitionRoot>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false });
  const props = defineProps<{
    modelValue?: boolean;
  }>();

  const emits = defineEmits<{
    "update:modelValue": [boolean];
  }>();

  const isOpen = computed<boolean>({
    get() {
      return props.modelValue ?? false;
    },
    set(value) {
      emits("update:modelValue", value);
    },
  });
</script>
