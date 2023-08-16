<template>
  <a-modal
    v-model:visible="modalVisible"
    width="600"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <template #title> 操作积分 </template>
    <div>
      <a-form ref="modalFormRef" :model="formData">
        <a-row>
          <a-col :span="24">
            <a-form-item label="用户ID">
              {{ userData?.id }}
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="用户姓名">
              {{ userData?.name }}
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="手机号码">
              {{ userData?.phone }}
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="积分" field="point_number">
              <a-input v-model="formData.point_number"></a-input>
              <template #extra>
                <div>增加积分请填正数，扣除积分请填负数</div>
              </template>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  import { operatePoint } from '@/api/user';
  import { Message } from '@arco-design/web-vue';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    userData: {
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

  const formData = ref({
    point_number: '',
  });

  const handleCancel = () => {
    formData.value.point_number = '';
    emit('update-visible', false);
  };

  const modalFormRef = ref(null);
  const handleBeforeOk = (done: (closed: boolean) => void) => {
    const validateRef: any = modalFormRef.value;
    if (validateRef) {
      validateRef.validate().then(async (res: any) => {
        if (!res) {
          try {
            await operatePoint(props.userData.id, formData.value);
            done(true);
            formData.value.point_number = '';
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
