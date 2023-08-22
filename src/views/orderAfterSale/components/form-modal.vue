<template>
  <a-modal
    v-model:visible="modalVisible"
    width="60%"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <template #title> 拒绝理由 </template>
    <div>
      <a-form ref="modalFormRef" :model="modalData">
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="拒绝理由"
              field="review_remark"
              :rules="[{ required: true, message: '请填写拒绝理由' }]"
            >
              <a-input v-model="modalData.review_remark"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  import { Message } from '@arco-design/web-vue';
  import { auditRecord } from '@/api/orderAfterSale';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    orderAfterSaleId: {
      type: Number,
      default: null,
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
      review_remark: '',
    };
  };

  const modalData = ref(generateForm());

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
            await auditRecord(props.orderAfterSaleId, {
              type: 2,
              review_remark: modalData.value.review_remark,
            });
            done(true);
            emit('update-success', modalData.value);
            modalData.value = generateForm();
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
