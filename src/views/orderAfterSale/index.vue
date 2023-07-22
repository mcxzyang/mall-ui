<template>
  <div class="container">
    <Breadcrumb :items="['售后订单管理', '售后订单列表']" />
    <a-card class="general-card" title="售后订单列表">
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
                <a-form-item field="name" label="售后订单号">
                  <a-input v-model="formModel.no" placeholder="售后订单号" />
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

      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columnsList"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="mini" @click="handleView(record)">
              查看
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
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  import {
    queryOrderAfterSaleList,
    OrderAfterSaleRecord,
    PolicyParams,
    deleteRecord,
  } from '@/api/orderAfterSale';
  import { Message } from '@arco-design/web-vue';
  import router from '@/router';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const generateFormModel = () => {
    return {
      no: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<OrderAfterSaleRecord[]>([]);
  const formModel = ref(generateFormModel());

  const size = ref<SizeProps>('large');

  const basePagination: Pagination = {
    page: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const columnsList = ref<TableColumnData[]>([
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '售后订单号',
      dataIndex: 'no',
      slotName: 'no',
    },
    // {
    //   title: '订单号',
    //   dataIndex: 'order.order_no',
    // },
    {
      title: '发起人',
      dataIndex: 'user.nickname',
    },
    {
      title: '售后类型',
      dataIndex: 'type_text',
    },
    {
      title: '退款金额',
      dataIndex: 'price',
    },
    {
      title: '售后状态',
      dataIndex: 'after_status_text',
    },
    {
      title: '发起时间',
      dataIndex: 'created_at',
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
      const { data } = await queryOrderAfterSaleList(params);
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
      name: 'OrderAfterSaleDetail',
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
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as PolicyParams);
  };
  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, page });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };
</script>
