<template>
  <div class="container">
    <Breadcrumb :items="['商品管理', '商品列表']" />
    <a-card class="general-card" title="商品列表">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="title" label="商品名称">
                  <a-input v-model="formModel.title" placeholder="商品名称" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="product_number" label="商品编码">
                  <a-input
                    v-model="formModel.product_number"
                    placeholder="商品编码"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="vendor_id" label="供应商">
                  <a-select v-model="formModel.vendor_id" :allow-clear="true">
                    <a-option
                      v-for="(item, key) in vendorList"
                      :key="key"
                      :value="item.id"
                      >{{ item.name }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="company_id" label="商城">
                  <a-select v-model="formModel.companies" multiple>
                    <a-option
                      v-for="(item, key) in companyList"
                      :key="key"
                      :value="item.id"
                      >{{ item.name }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="tags" label="标签">
                  <a-select v-model="formModel.tags" multiple>
                    <a-option
                      v-for="(item, key) in tagList"
                      :key="key"
                      :value="item.id"
                      >{{ item.name }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 80px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space :size="18" direction="vertical">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="addProduct()">
              <template #icon>
                <icon-plus />
              </template>
              新增
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button
            type="primary"
            :disabled="publishDisabled()"
            @click="publishToCompany"
          >
            <template #icon>
              <icon-send />
            </template>
            发布到商城
          </a-button>
        </a-col>
      </a-row>
      <a-table
        v-model:selected-keys="selectedKeys"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columnsList"
        :data="renderData"
        :bordered="true"
        :size="size"
        :row-selection="rowSelection"
        @page-change="onPageChange"
      >
        <template #stock="{ record }">
          <span v-if="record.first_sku.stock > 0">{{
            record.first_sku.stock
          }}</span>
          <span v-else>无限制</span>
        </template>
        <template #image="{ record }">
          <a-image
            v-if="record.image"
            fit="fill"
            width="100"
            :style="{ cursor: 'pointer' }"
            :src="record.image"
          />
        </template>
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            :checked-value="1"
            :unchecked-value="0"
            @change="changeStatus($event, record)"
          >
            <template #checked> 是 </template>
            <template #unchecked> 否 </template>
          </a-switch>

          <!-- <span v-if="record.status === 1" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ record.status === 1 ? '正常' : '已禁用' }} -->
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="mini" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-popconfirm
              content="确定删除此条记录吗?"
              type="warning"
              @ok="handledelete(record)"
            >
              <a-button type="text" status="danger" size="mini">
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <FormModal
      :visible="modalVisble"
      :product-ids="selectedKeys"
      @update-visible="updateVisible"
      @update-success="updateSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  import {
    queryPolicyList,
    deleteRecord,
    PolicyRecord,
    PolicyParams,
    saveRecord,
  } from '@/api/product';
  import { Message } from '@arco-design/web-vue';
  import router from '@/router';

  import {
    queryPolicyList as getVendorList,
    PolicyRecord as vendorRecord,
  } from '@/api/vendor';

  import {
    queryPolicyList as queryCompanyList,
    PolicyRecord as CompanyRecord,
  } from '@/api/company';

  import {
    queryPolicyList as getTagList,
    PolicyRecord as tagRecord,
  } from '@/api/tag';

  import FormModal from './components/form-modal.vue';

  const modalVisble = ref(false);

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const generateFormModel = () => {
    return {
      title: '',
      product_number: '',
      vendor_id: '',
      companies: [],
      tags: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<PolicyRecord[]>([]);
  const formModel = ref(generateFormModel());

  const size = ref<SizeProps>('large');

  const searchParams = ref(null as any);

  const basePagination: Pagination = {
    page: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
    'show-total': true,
  });

  const vendorList = ref<vendorRecord[]>([]);
  const fetchVendorList = async () => {
    const { data } = await getVendorList({ paging: 0 });
    vendorList.value = data;
  };
  fetchVendorList();

  const companyList = ref<CompanyRecord[]>([]);
  const fetchCompanyList = async () => {
    const { data } = await queryCompanyList({ paging: 0 });
    companyList.value = data;
  };
  fetchCompanyList();

  const tagList = ref<tagRecord[]>([]);
  const fetchTagList = async () => {
    const { data } = await getTagList({ paging: 0 });
    tagList.value = data;
  };
  fetchTagList();

  const columnsList = ref<TableColumnData[]>([
    {
      title: '主图',
      dataIndex: 'image',
      slotName: 'image',
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '商品名称',
      dataIndex: 'title',
    },
    {
      title: '商品编码',
      dataIndex: 'product_number',
    },
    {
      title: '售价（元）',
      dataIndex: 'first_sku.sale_price',
    },
    {
      title: '库存',
      dataIndex: 'first_sku.stock',
      slotName: 'stock',
    },
    {
      title: '销量',
      dataIndex: 'sales_number',
    },
    {
      title: '上架状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'created_at',
    // },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  }) as any;

  const selectedKeys = ref([]);

  const publishDisabled = () => {
    return selectedKeys.value.length <= 0;
  };

  const fetchData = async (
    params: PolicyParams = { page: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryPolicyList(params);
      renderData.value = data.data;
      pagination.page = data.current_page;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    router.push({
      name: 'ProductOperation',
      params: {
        id: item.id,
      },
    });
  };
  const handledelete = async (item: any) => {
    await deleteRecord(item.id);
    Message.success('删除成功');
    fetchData(searchParams.value);
  };

  const search = () => {
    searchParams.value = {
      ...basePagination,
      ...formModel.value,
    };
    fetchData(searchParams.value);
  };
  const onPageChange = (page: number) => {
    searchParams.value = { ...basePagination, ...formModel.value, page };
    fetchData(searchParams.value);
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const changeStatus = async (value: any, record: PolicyRecord) => {
    await saveRecord(record.id, record);
    Message.success('操作成功');
    fetchData(searchParams.value);
  };

  const publishToCompany = () => {
    modalVisble.value = true;
  };

  const updateVisible = (visible: boolean) => {
    modalVisble.value = visible;
  };

  const updateSuccess = () => {
    modalVisble.value = false;
    selectedKeys.value = [];
  };

  const addProduct = () => {
    const t = new Date().getTime();

    router.push({
      name: 'ProductOperation',
      query: {
        t,
      },
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'ProductList',
  };
</script>
