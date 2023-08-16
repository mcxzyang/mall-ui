<template>
  <div class="container">
    <Breadcrumb :items="['订单管理', '订单列表']" />
    <a-card class="general-card" title="订单列表">
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
                <a-form-item field="name" label="订单号">
                  <a-input v-model="formModel.order_no" placeholder="订单号" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" label="收件人">
                  <a-input
                    v-model="formModel.receive"
                    placeholder="收件人姓名或者手机"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="source" label="商城来源">
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
                <a-form-item field="type" label="类型">
                  <a-select v-model="formModel.type" :allow-clear="true">
                    <a-option
                      v-for="(item, key) in typeList"
                      :key="key"
                      :value="item.id"
                      >{{ item.name }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="created_at" label="创建时间">
                  <a-range-picker v-model="formModel.created_at" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" label="状态">
                  <a-select v-model="formModel.status" :allow-clear="true">
                    <a-option
                      v-for="(item, key) in statusList"
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
            <!-- <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button> -->
            <a-button :loading="downloadLoading" @click="download">
              <template #icon>
                <icon-download />
              </template>
              下载
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />

      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columnsList"
        :data="renderData"
        :bordered="true"
        scrollbar
        column-resizable
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
        <template #pay_type="{ record }">
          <a-tag v-if="record.pay_type_text" :color="record.pay_type_color">{{
            record.pay_type_text
          }}</a-tag>
        </template>
        <template #source="{ record }">
          <a-tag :color="record.source_color">{{ record.source_text }}</a-tag>
        </template>
        <template #status="{ record }">
          <a-tag :color="record.status_color">{{ record.status_text }}</a-tag>
        </template>
        <template #type="{ record }">
          <a-tag color="arcoblue">{{ orderTypeFilter(record.type) }}</a-tag>
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="mini" @click="handleView(record)">
              查看
            </a-button>
            <a-dropdown @select="handleSelectList($event, record)">
              <a-button type="text" size="mini">更多</a-button>
              <template #content>
                <a-doption value="delete">删除</a-doption>
              </template>
            </a-dropdown>
            <!-- <a-popconfirm
              content="确定删除此条记录吗?"
              type="warning"
              @ok="handledelete(record)"
            >
              <a-button type="text" status="danger" size="mini">
                删除
              </a-button>
            </a-popconfirm> -->
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  import {
    queryOrderList,
    OrderRecord,
    PolicyParams,
    deleteRecord,
    // sourceType,
    // getSourceTypeList,
    statusRecord,
    getStatusMapping,
    downloadExcel,
  } from '@/api/order';

  import {
    queryPolicyList as queryCompanyList,
    PolicyRecord as CompanyRecord,
  } from '@/api/company';

  import { Message } from '@arco-design/web-vue';
  import router from '@/router';

  const generateFormModel = () => {
    return {
      order_no: '',
      source: '',
      type: '',
      created_at: [],
      status: '',
      companies: [],
      receive: '',
    };
  };

  const searchParams = ref(null as any);

  const downloadLoading = ref(false);

  // const sourceTypeList = ref<sourceType[]>([]);
  // const fetchSourceTypelist = async () => {
  //   const { data } = await getSourceTypeList();
  //   sourceTypeList.value = data;
  // };
  // fetchSourceTypelist();

  const companyList = ref<CompanyRecord[]>([]);
  const fetchCompanyList = async () => {
    const { data } = await queryCompanyList({ paging: 0 });
    companyList.value = data;
  };
  fetchCompanyList();

  const statusList = ref<statusRecord[]>([]);
  const fetchStatuslist = async () => {
    const { data } = await getStatusMapping();
    statusList.value = data;
  };
  fetchStatuslist();

  const typeList = reactive([
    {
      id: 1,
      name: '普通订单',
    },
    {
      id: 2,
      name: '团购订单',
    },
  ]);

  const { loading, setLoading } = useLoading(true);
  const renderData = ref<OrderRecord[]>([]);
  const formModel = ref(generateFormModel());

  // const size = ref<SizeProps>('large');

  const basePagination: Pagination = {
    page: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
    'show-total': true,
  });

  const columnsList = ref<TableColumnData[]>([
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '订单号',
      dataIndex: 'order_no',
      slotName: 'order_no',
    },
    {
      title: '商城来源',
      dataIndex: 'company.name',
      // slotName: 'source',
    },
    {
      title: '类型',
      dataIndex: 'type',
      slotName: 'type',
    },
    {
      title: '购买人',
      dataIndex: 'user.nickname',
    },
    {
      title: '支付方式',
      dataIndex: 'pay_type',
      slotName: 'pay_type',
    },
    {
      title: '总计',
      dataIndex: 'total',
    },
    {
      title: '支付时间',
      dataIndex: 'pay_at',
    },
    {
      title: '商品数量',
      dataIndex: 'order_items_count',
    },
    {
      title: '状态',
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

  const fetchData = async (
    params: PolicyParams = { page: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryOrderList(params);
      renderData.value = data.data;
      pagination.page = data.current_page;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item: any) => {
    router.push({
      name: 'OrderDetail',
      params: {
        id: item.id,
      },
    });
  };
  const handledelete = async (item: any) => {
    await deleteRecord(item.id);
    Message.success('删除成功');
    fetchData();
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
  // const reset = () => {
  //   formModel.value = generateFormModel();
  // };

  const download = async () => {
    downloadLoading.value = true;
    const params = searchParams.value;
    const response = await downloadExcel(params);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([response as any]));

    link.setAttribute('download', '订单列表.xlsx');

    document.body.appendChild(link);
    link.click();
    downloadLoading.value = false;
  };

  const orderTypeFilter = (type: number) => {
    const typeMap: any = {
      1: '普通订单',
      2: '团购订单',
    };
    return typeMap[type] || null;
  };

  const handleSelectList = (v: any, record: any) => {
    if (v === 'delete') {
      handledelete(record);
    }
  };
</script>
