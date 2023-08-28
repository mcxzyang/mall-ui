<template>
  <a-card>
    <a-form
      ref="formRef"
      :model="formData"
      class="form"
      :label-col-props="{ span: 8 }"
      :wrapper-col-props="{ span: 16 }"
    >
      <a-form-item
        field="password"
        label="旧密码"
        :rules="[
          {
            required: true,
            message: '请填写旧密码',
          },
        ]"
      >
        <a-input v-model="formData.password" type="password" />
      </a-form-item>
      <a-form-item
        field="new_password"
        label="新密码"
        :rules="[
          {
            required: true,
            message: '请填写新密码',
          },
        ]"
      >
        <a-input v-model="formData.new_password" type="password" />
      </a-form-item>
      <a-form-item
        field="new_password_confirmation"
        label="重复新密码"
        :rules="[
          {
            required: true,
            message: '请填写重复新密码',
          },
        ]"
      >
        <a-input v-model="formData.new_password_confirmation" type="password" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="validate"> 保存 </a-button>
          <a-button type="secondary" @click="reset"> 重置 </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message } from '@arco-design/web-vue';
  import { updatePassword } from '@/api/user';

  const formRef = ref<FormInstance>();
  const formData = ref({
    password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const reset = async () => {
    await formRef.value?.resetFields();
  };

  const validate = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      await updatePassword(formData.value);
      reset();
      Message.success('操作成功');
      // do some thing
      // you also can use html-type to submit
    }
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>
