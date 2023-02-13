<template>
  <a-form :model="formData">
    <a-row :gutter="80">
      <a-col :span="24">
        <a-form-item label="分组名称" field="name">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="分组图片" field="image">
          <a-input></a-input>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
  const props = defineProps({
    formData: {
      type: Object,
      default: () => {},
    },
  });
</script>

<style scoped></style>
