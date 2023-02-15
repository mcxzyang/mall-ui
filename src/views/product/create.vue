<template>
  <div class="container">
    <Breadcrumb :items="['商品管理', '创建商品']" />
    <a-form
      ref="formRef"
      layout="vertical"
      :model="formData"
      @submit="handleSubmit"
    >
      <a-space direction="vertical" fill>
        <a-card>
          <div class="flex-between">
            <router-link :to="{ name: 'ProductList' }">
              <a-button type="outline">返回</a-button>
            </router-link>
            <a-space>
              <a-button @click="($refs.formRef as any).resetFields()">
                重置
              </a-button>
              <a-button type="primary" html-type="submit"> 提交 </a-button>
            </a-space>
          </div>
        </a-card>
        <a-card class="general-card" title="基本属性">
          <a-row :gutter="80">
            <a-col :span="12">
              <a-form-item
                label="商品标题"
                field="title"
                :rules="[
                  { required: true, message: '请填写商品标题' },
                  {
                    minLength: 5,
                    message: 'must be greater than 5 characters',
                  },
                ]"
              >
                <a-input v-model="formData.title"> </a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item field="multiSelect" label="请选择需要发布的企业">
                <a-select v-model="formData.company_ids" multiple>
                  <a-option
                    v-for="(item, key) in companyList"
                    :key="key"
                    :value="item.id"
                    >{{ item.name }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="product_number" label="商品编码">
                <a-input v-model="formData.product_number"> </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="product_group_id" label="商品分组">
                <a-select v-model="formData.product_group_id">
                  <a-option
                    v-for="(item, key) in productGroupList"
                    :key="key"
                    :value="item.id"
                    >{{ item.name }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="category_id" label="商品分类">
                <a-tree-select
                  v-model="formData.category_id"
                  :data="(categoryList as any)"
                  :field-names="{
                    key: 'id',
                    title: 'name',
                  }"
                ></a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="provider" label="供应商">
                <a-input v-model="formData.provider"> </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="image" label="商品图片">
                <Uploader v-model="formData.image" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="is_free_post" label="是否免邮">
                <a-switch
                  v-model="formData.is_free_post"
                  :checked-value="1"
                  :unchecked-value="0"
                >
                  <template #checked> 是 </template>
                  <template #unchecked> 否 </template>
                </a-switch>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item field="content" label="详细内容">
                <Editor ref="editorRef" v-model="formData.content" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="general-card" title="商品规格">
          <template #title>
            <div class="flex-between">
              <span>商品规格</span>
              <a-button type="primary" @click="addSku"> 添加规格 </a-button>
            </div>
          </template>
          <a-table
            :columns="skuColumns"
            :data="formData.product_skus"
            row-key="index"
            :pagination="false"
          >
            <template #sku_number="{ record }">
              <a-input v-model="record.sku_number" />
            </template>
            <template #sku_name="{ record }">
              <a-input v-model="record.sku_name" />
            </template>
            <template #sale_price="{ record }">
              <a-input v-model="record.sale_price" />
            </template>
            <template #original_price="{ record }">
              <a-input v-model="record.original_price" />
            </template>
            <template #stock="{ record }">
              <a-input v-model="record.stock" />
            </template>
            <template #unit="{ record }">
              <a-input v-model="record.unit" />
            </template>
            <template #operations="{ rowIndex }">
              <a-space>
                <a-button
                  type="outline"
                  status="danger"
                  size="small"
                  @click="deleteSku(rowIndex)"
                >
                  删除
                </a-button>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </a-space>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  import { Editor } from '@/components/editor';
  import Uploader from '@/components/uploader/index.vue';

  import { queryPolicyList, PolicyRecord } from '@/api/company';
  import {
    PolicyRecord as ProductGroupPolicy,
    queryPolicyList as queryProductGroupList,
  } from '@/api/productGroup';

  import {
    PolicyRecord as CategoryPolicy,
    queryPolicyList as queryCategoryList,
  } from '@/api/category';

  import { PolicyRecord as ProductPolicy, addRecord } from '@/api/product';
  import { Message } from '@arco-design/web-vue';

  const router = useRouter();

  const formData = reactive<ProductPolicy>({
    id: 0,
    title: '',
    company_ids: [],
    image: '',
    content: '',
    product_number: '',
    product_group_id: '',
    category_id: '',
    provider: '',
    is_free_post: true,
    product_skus: [],
  });

  const skuColumns = ref<TableColumnData[]>([
    {
      title: '规格编码',
      dataIndex: 'sku_number',
      slotName: 'sku_number',
    },
    {
      title: '规格名称',
      dataIndex: 'sku_name',
      slotName: 'sku_name',
    },
    {
      title: '售价（元）',
      dataIndex: 'sale_price',
      slotName: 'sale_price',
    },
    {
      title: '市场价（元）',
      dataIndex: 'original_price',
      slotName: 'original_price',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      slotName: 'stock',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      slotName: 'unit',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const generateSku = () => {
    return {
      id: 0,
      index: 0,
      sku_number: '',
      sku_name: '',
      sale_price: '',
      original_price: '',
      stock: '',
      unit: '',
    };
  };

  const companyList = ref<PolicyRecord[]>([]);
  const fetchCompanyList = async () => {
    const { data } = await queryPolicyList({ paging: 0 });
    companyList.value = data;
  };
  fetchCompanyList();

  const productGroupList = ref<ProductGroupPolicy[]>([]);
  const fetchProductGroupList = async () => {
    const { data } = await queryProductGroupList({ paging: 0 });
    productGroupList.value = data;
  };
  fetchProductGroupList();

  const categoryList = ref<CategoryPolicy[]>([]);
  const fetchCategoryList = async () => {
    const { data } = await queryCategoryList({ paging: 0 });
    categoryList.value = data;
  };
  fetchCategoryList();

  const addSku = () => {
    const tmpSku = generateSku();
    // tmpSku.index = productSkuList.length + 1;
    formData.product_skus?.push(tmpSku);
  };

  const deleteSku = (rowIndex: number) => {
    formData.product_skus?.splice(rowIndex, 1);
  };

  const handleSubmit = async ({
    values,
    errors,
  }: {
    values: any;
    errors: any;
  }) => {
    if (errors) {
      return;
    }
    await addRecord({ ...values });

    router.push({ name: 'ProductList' });
    Message.success('操作成功');
  };
</script>

<style scoped></style>
