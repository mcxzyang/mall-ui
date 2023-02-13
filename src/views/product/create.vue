<template>
  <div class="container">
    <Breadcrumb :items="['商品管理', '创建商品']" />
    <a-form
      ref="formRef"
      layout="vertical"
      :model="formData"
      @submit="handleSubmit"
    >
      <a-card class="general-card" title="创建商品">
        <a-row :gutter="80">
          <a-col :span="24">
            <a-form-item
              label="标题"
              field="title"
              :rules="[
                { required: true, message: '请填写商品标题' },
                { minLength: 5, message: 'must be greater than 5 characters' },
              ]"
            >
              <a-input v-model="formData.title"> </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="multiSelect" label="请需要需要发布的企业">
              <a-select v-model="formData.companyIds" multiple>
                <a-option value="section one">Section One</a-option>
                <a-option value="section two">Section Two</a-option>
                <a-option value="section three">Section Three</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="content" label="详细内容">
              <Editor ref="editorRef" v-model="formData.content" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <div class="actions">
        <a-space>
          <a-button @click="($refs.formRef as any).resetFields()">
            重置
          </a-button>
          <a-button type="primary" html-type="submit"> 提交 </a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';

  import { Editor } from '@/components/editor';

  const formData = reactive({
    title: '',
    companyIds: [],
    content: '',
  });

  const handleSubmit = ({ values, errors: any }) => {
    console.log(values);
  };
</script>

<style scoped></style>
