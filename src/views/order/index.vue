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
          <a-tag :color="record.status_color">{{ record.status_text }}</a-tag>

          <!-- <span v-if="record.status === 1" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ record.status === 1 ? '正常' : '已禁用' }} -->
        </template>
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
    queryOrderList,
    OrderRecord,
    PolicyParams,
    deleteRecord,
  } from '@/api/order';
  import { Message } from '@arco-design/web-vue';
  import router from '@/router';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const generateFormModel = () => {
    return {
      order_no: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<OrderRecord[]>([]);
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
      title: '订单号',
      dataIndex: 'order_no',
      slotName: 'order_no',
    },
    {
      title: '购买人',
      dataIndex: 'user.name',
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