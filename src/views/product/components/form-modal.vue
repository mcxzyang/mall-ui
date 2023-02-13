<template>
  <div>
    <a-modal
      v-model:visible="showModal"
      title="Modal Form"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form :model="formData">
        <a-row :gutter="80">
          <a-col :span="8">
            <a-form-item label="商品标题" field="video.mode">
              <a-input></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:visible']);

  const showModal = computed(() => {
    return props.visible;
  });

  const formData = ref({});

  const handleCancel = () => {
    emit('update:visible', false);
  };

  const handleBeforeOk = () => {};
</script>

<style scoped></style>
