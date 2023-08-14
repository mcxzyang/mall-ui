<template>
  <a-modal
    v-model:visible="modalVisible"
    width="70%"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <template #title> 发布商品到指定商城 </template>
    <div>
      <a-form ref="modalFormRef" :model="modalData">
        <a-row>
          <a-col :span="24">
            <a-form-item label="请选择需要发布的商城">
              <a-select v-model="modalData.company_id">
                <a-option
                  v-for="(item, key) in companyList"
                  :key="key"
                  :value="item.id"
                  >{{ item.name }}</a-option
                >
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

  import { Message } from '@arco-design/web-vue';

  import {
    queryPolicyList as getCompanyList,
    PolicyRecord as CompanyRecord,
  } from '@/api/company';
  import { publishCompany } from '@/api/product';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    productIds: {
      type: Array,
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
      company_id: '',
    };
  };

  const modalData = ref(generateForm());

  const companyList = ref<CompanyRecord[]>([]);
  const fetchCompanyList = async () => {
    const { data } = await getCompanyList({ paging: 0 });
    companyList.value = data;
  };
  fetchCompanyList();

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
            await publishCompany({
              company_id: modalData.value.company_id,
              product_ids: props.productIds,
            });

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
