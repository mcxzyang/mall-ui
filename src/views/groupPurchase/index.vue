<template>
  <div class="container">
    <Breadcrumb :items="['团购管理', '团购列表']" />
    <a-card class="general-card" title="团购列表">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="12">
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
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 40px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space :size="18">
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
            <a-button type="primary" @click="handleAdd">
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
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columnsList"
        :data="renderData"
        :bordered="true"
        :size="size"
        @page-change="onPageChange"
      >
        <!-- <template #status="{ record }">
          <span v-if="record.status === 1" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ record.status === 1 ? '未成团' : '已成团' }}
        </template> -->
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
      :form-data="formData"
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
    // saveRecord,
  } from '@/api/groupPurchase';
  import { Message } from '@arco-design/web-vue';

  import {
    queryPolicyList as queryCompanyList,
    PolicyRecord as CompanyRecord,
  } from '@/api/company';
  import FormModal from './components/form-modal.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const generateFormModel = () => {
    return {
      companies: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<PolicyRecord[]>([]);
  const formModel = ref(generateFormModel());

  const formData = ref<any>();
  const modalVisble = ref(false);

  const size = ref<SizeProps>('large');

  const basePagination: Pagination = {
    page: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const companyList = ref<CompanyRecord[]>([]);
  const fetchCompanyList = async () => {
    const { data } = await queryCompanyList({ paging: 0 });
    companyList.value = data;
  };
  fetchCompanyList();

  const columnsList = ref<TableColumnData[]>([
    // {
    //   title: '商品主图',
    //   dataIndex: 'product.image',
    //   slotName: 'image',
    // },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '商品名称',
      dataIndex: 'product.title',
    },
    {
      title: '售价（元）',
      dataIndex: 'product.first_sku.sale_price',
    },
    {
      title: '团购价（元）',
      dataIndex: 'price',
    },
    {
      title: '成团人数',
      dataIndex: 'number_count',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

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

  const handleAdd = () => {
    formData.value = {};
    modalVisble.value = true;
  };

  const handleEdit = (item: any) => {
    formData.value = item;
    modalVisble.value = true;
  };

  const updateVisible = (visible: boolean) => {
    modalVisble.value = visible;
    formData.value = {};
  };

  const updateSuccess = () => {
    modalVisble.value = false;
    fetchData();
  };

  const handledelete = async (item: any) => {
    await deleteRecord(item.id);
    Message.success('删除成功');
    fetchData();
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as PolicyParams);
  };
  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, ...formModel.value, page });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  // const changeStatus = async (value: any, record: PolicyRecord) => {
  //   await saveRecord(record.id, record);
  //   Message.success('操作成功');
  //   fetchData();
  // };
</script>
