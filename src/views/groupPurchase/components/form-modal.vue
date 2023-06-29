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
          <a-col :span="24">
            <a-form-item label="团购商品" field="product_id">
              <a-select
                v-model="modalData.product_id"
                :options="productOptions"
                :loading="productLoading"
                :filter-option="false"
                :show-extra-options="false"
                allow-search
                @search="productSearch"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="团购价" field="price">
              <a-input v-model="modalData.price"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="成团人数" field="number_count">
              <a-input-number v-model="modalData.number_count"></a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="开始时间" field="start_at">
              <a-date-picker v-model="modalData.start_at"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="结束时间" field="start_at">
              <a-date-picker v-model="modalData.end_at"></a-date-picker>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  import { addRecord, saveRecord } from '@/api/groupPurchase';
  import { Message } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';

  import {
    queryPolicyList as getCompanyList,
    PolicyRecord as CompanyRecord,
  } from '@/api/company';
  import {
    queryPolicyListSearch as getProductList,
    // PolicyRecord as ProductRecord,
    getRecord as getProduct,
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
      number_count: 0,
      start_at: '',
      end_at: '',
      price: '',
      companies: [],
    };
  };

  const modalData = ref(generateForm());

  const companyList = ref<CompanyRecord[]>([]);
  const fetchCompanyList = async () => {
    const { data } = await getCompanyList({ paging: 0 });
    companyList.value = data;
  };
  fetchCompanyList();

  // const productList = ref<ProductRecord[]>([]);
  // const fetchProductList = async () => {
  //   const { data } = await getProductList({ paging: 0 });
  //   productList.value = data;
  // };
  // fetchProductList();

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
