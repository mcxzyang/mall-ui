<template>
  <a-modal
    v-model:visible="modalVisible"
    width="auto"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <template #title> {{ modalData.id ? '编辑' : '创建' }} </template>
    <div>
      <a-form ref="modalFormRef" :model="modalData">
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="分类名称"
              field="name"
              :rules="[{ required: true, message: '请填写分类名称' }]"
            >
              <a-input v-model="modalData.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="分组图片" field="image">
              <Uploader v-model="modalData.image" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="上级分类" field="pid">
              <a-select v-model="modalData.pid">
                <a-option
                  v-for="item of categoryList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  import {
    PolicyRecord,
    getCategoryList,
    addRecord,
    saveRecord,
  } from '@/api/category';
  import { Message } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';

  import Uploader from '@/components/uploader/index.vue';

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
      pid: 0,
      image: '',
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

  const categoryList = ref<PolicyRecord[]>([
    {
      id: 0,
      name: '顶级',
    },
  ]);

  const fetchCategoryList = async () => {
    const data: any = await getCategoryList();
    categoryList.value = categoryList.value.concat(data.data);
  };
  fetchCategoryList();

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
