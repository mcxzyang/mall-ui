<template>
  <a-modal
    v-model:visible="modalVisible"
    width="600"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <template #title> {{ modalData.id ? '编辑' : '创建' }} </template>
    <div>
      <a-form ref="modalFormRef" :model="modalData">
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="供应商名称"
              field="name"
              :rules="[{ required: true, message: '请填写供应商名称' }]"
            >
              <a-input v-model="modalData.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="联系人" field="link_name">
              <a-input v-model="modalData.link_name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="联系电话" field="link_phone">
              <a-input v-model="modalData.link_phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="微信号" field="wechat_no">
              <a-input v-model="modalData.wechat_no"></a-input>
            </a-form-item>
          </a-col>
          <a-col v-if="modalData.id" :span="24">
            <a-form-item label="Client ID" field="client_id">
              <a-input v-model="modalData.client_id"></a-input>
            </a-form-item>
          </a-col>
          <a-col v-if="modalData.id" :span="24">
            <a-form-item label="Client Secret" field="client_secret">
              <a-input v-model="modalData.client_secret"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="登录用户名" field="username">
              <a-input v-model="modalData.username"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="登录密码" field="password">
              <a-input v-model="modalData.password" type="password"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  import { addRecord, saveRecord } from '@/api/vendor';
  import { Message } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => null,
    },
  });

  const emit = defineEmits(['update-visible', 'update-success']);

  const modalVisible = ref(false);

  watch(
    () => props.visible,
    (value) => {
      modalVisible.value = value;
    }
  );

  const generateForm = () => {
    return {
      id: 0,
      name: '',
      link_phone: '',
      link_name: '',
      wechat_no: '',
      client_id: '',
      client_secret: '',
      username: '',
      password: '',
    };
  };

  const modalData = ref(generateForm());

  watch(
    () => props.formData,
    (value) => {
      if (value) {
        modalData.value = cloneDeep(value) as any;
      }
    },
    { immediate: true }
  );

  const handleCancel = () => {
    modalData.value = generateForm();
    emit('update-visible', false);
  };

  const modalFormRef = ref(null);
  const handleBeforeOk = (done: (closed: boolean) => void) => {
    const validateRef: any = modalFormRef.value;
    if (validateRef) {
      validateRef.validate().then(async (res: any) => {
        if (!res) {
          try {
            if (!modalData.value.id) {
              await addRecord(modalData.value);
            } else {
              await saveRecord(modalData.value.id, modalData.value);
            }
            done(true);
            modalData.value = generateForm();
            emit('update-success');
            Message.success('操作成功');
          } catch (e) {
            done(false);
          }
        }
        done(false);
      });
    }
  };
</script>

<style scoped></style>
