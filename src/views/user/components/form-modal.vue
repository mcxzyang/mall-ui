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
              label="商城"
              field="company_id"
              :rules="[{ required: true, message: '请选择商城' }]"
            >
              <a-select v-model="modalData.company_id">
                <a-option
                  v-for="(item, key) in (companyList as any)"
                  :key="key"
                  :value="item.id"
                  >{{ item.name }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="姓名" field="name">
              <a-input v-model="modalData.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="昵称" field="nickname">
              <a-input v-model="modalData.nickname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="联系电话" field="pid">
              <a-input v-model="modalData.phone"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  import { saveRecord } from '@/api/user';
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
    companyList: {
      type: Array,
      default: () => [],
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
      company_id: '',
      name: '',
      nickname: '',
      phone: '',
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
            await saveRecord(modalData.value.id, modalData.value);
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
