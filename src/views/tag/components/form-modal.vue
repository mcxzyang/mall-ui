<template>
  <a-modal
    v-model:visible="modalVisible"
    width="60%"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <template #title> {{ modalData.id ? '编辑' : '创建' }} </template>
    <div>
      <a-form ref="modalFormRef" :model="modalData">
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="标签名称"
              field="name"
              :rules="[{ required: true, message: '请填写标签名称' }]"
            >
              <a-input v-model="modalData.name"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  import { addRecord, saveRecord } from '@/api/tag';
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
