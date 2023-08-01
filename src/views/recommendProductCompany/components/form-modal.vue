<template>
  <a-modal
    v-model:visible="modalVisible"
    width="70%"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <template #title> {{ modalData.id ? '编辑' : '创建' }} </template>
    <div>
      <a-form ref="modalFormRef" :model="modalData">
        <a-row>
          <a-col :span="24">
            <a-form-item label="推荐商品" field="product_id">
              <a-select
                v-model="modalData.product_id"
                :options="productOptions"
                :loading="productLoading"
                :filter-option="false"
                :show-extra-options="false"
                allow-search
                @search="productSearch"
                @change="getCompanyList"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="multiSelect" label="请选择需要发布的商城">
              <a-select v-model="modalData.companies" multiple>
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

  import { addRecord } from '@/api/recommendProductCompany';
  import { Message } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';

  import {
    // queryPolicyList as getCompanyList,
    PolicyRecord as CompanyRecord,
  } from '@/api/company';
  import {
    queryPolicyListSearch as getProductList,
    // PolicyRecord as ProductRecord,
    getRecord as getProduct,
    queryCompanyList,
  } from '@/api/product';

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
      product_id: '',
      companies: [],
    };
  };

  const modalData = ref(generateForm());

  const companyList = ref<CompanyRecord[]>([]);
  // const fetchCompanyList = async () => {
  //   const { data } = await getCompanyList({ paging: 0 });
  //   companyList.value = data;
  // };
  // fetchCompanyList();

  const getCompanyList = async (productId: any) => {
    const { data } = await queryCompanyList(productId);
    companyList.value = data;
  };

  const productOptions = ref<any[]>([]);
  const productLoading = ref(false);

  const productSearch = async (keyword: string) => {
    if (keyword) {
      productLoading.value = true;
      const { data } = await getProductList({ paging: 0, title: keyword });
      productOptions.value = data.map((item: any) => {
        return { value: item.id, label: item.title };
      });
      productLoading.value = false;
    } else {
      productOptions.value = [];
    }
  };

  watch(
    () => props.formData,
    async (value) => {
      if (value) {
        modalData.value = cloneDeep(value) as any;
        if (value.product_id) {
          const { data: product } = await getProduct(value.product_id);
          productOptions.value = [{ value: product.id, label: product.title }];
        }
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
