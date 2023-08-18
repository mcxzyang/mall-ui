<template>
  <div class="container">
    <Breadcrumb :items="['积分流水管理', '积分流水列表']" />
    <a-card class="general-card" title="积分流水列表">
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
                <a-form-item field="name" label="姓名">
                  <a-input v-model="formModel.name" placeholder="姓名" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="nickname" label="昵称">
                  <a-input v-model="formModel.nickname" placeholder="昵称" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="phone" label="手机号">
                  <a-input v-model="formModel.phone" placeholder="手机号" />
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
        :bordered="true"
        :size="size"
        @page-change="onPageChange"
      >
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  // import cloneDeep from 'lodash/cloneDeep';
  import {
    queryPolicyList,
    PolicyRecord,
    PolicyParams,
  } from '@/api/userPointLog';
  import { Message } from '@arco-design/web-vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const generateFormModel = () => {
    return {
      name: '',
      phone: '',
      nickname: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<PolicyRecord[]>([]);
  const formModel = ref(generateFormModel());

  const formData = ref<PolicyRecord>();

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
      title: '姓名',
      dataIndex: 'user.name',
    },
    {
      title: '昵称',
      dataIndex: 'user.nickname',
    },
    {
      title: '手机号',
      dataIndex: 'user.phone',
    },
    {
      title: '流水事件',
      dataIndex: 'type_text',
    },
    {
      title: '积分改变前',
      dataIndex: 'change_before',
    },
    {
      title: '积分改变数值',
      dataIndex: 'change_number',
    },
    {
      title: '积分改变后',
      dataIndex: 'change_after',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
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
