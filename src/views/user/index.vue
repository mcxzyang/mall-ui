<template>
  <div class="container">
    <Breadcrumb :items="['用户管理', '用户列表']" />
    <a-card class="general-card" title="用户列表">
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
              <a-col :span="12">
                <a-form-item field="title" label="姓名">
                  <a-input v-model="formModel.name" placeholder="姓名" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="title" label="昵称">
                  <a-input v-model="formModel.nickname" placeholder="昵称" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="title" label="手机号码">
                  <a-input v-model="formModel.phone" placeholder="手机号码" />
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
      <!-- <a-row style="margin-bottom: 16px">
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
      </a-row> -->
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
        <template #status="{ record }">
          <span v-if="record.status === 1" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ record.status === 1 ? '正常' : '已禁用' }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="mini" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-button type="text" size="mini" @click="handlePoint(record)">
              操作积分
            </a-button>
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
    <FormModal
      :visible="modalVisble"
      :form-data="formData"
      :company-list="companyList"
      @update-visible="updateVisible"
      @update-success="updateSuccess"
    />

    <PointModal
      :visible="pointVisble"
      :user-data="currentUser"
      @update-visible="updatePointVisible"
      @update-success="updatePointSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  // import cloneDeep from 'lodash/cloneDeep';
  import {
    queryPolicyList as queryCompanyList,
    PolicyRecord as CompanyRecord,
  } from '@/api/company';

  import { queryPolicyList, PolicyRecord, PolicyParams } from '@/api/user';

  import { Message } from '@arco-design/web-vue';
  import FormModal from './components/form-modal.vue';
  import PointModal from './components/point-modal.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const generateFormModel = () => {
    return {
      name: '',
      phone: '',
      nickname: '',
      companies: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<PolicyRecord[]>([]);
  const formModel = ref(generateFormModel());

  const modalVisble = ref(false);
  const formData = ref<PolicyRecord>();

  const size = ref<SizeProps>('large');

  const currentUser = ref(null) as any;

  const pointVisble = ref(false);

  const basePagination: Pagination = {
    page: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const searchParams = ref(null as any);

  const columnsList = ref<TableColumnData[]>([
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '商城',
      dataIndex: 'company.name',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '积分',
      dataIndex: 'point',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: '创建时间',
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

  const companyList = ref<CompanyRecord[]>([]);
  const fetchCompanyList = async () => {
    const { data } = await queryCompanyList({ paging: 0 });
    companyList.value = data;
  };
  fetchCompanyList();

  const handleEdit = (item: any) => {
    formData.value = item;
    modalVisble.value = true;
  };

  const handlePoint = (item: any) => {
    currentUser.value = item;
    pointVisble.value = true;
  };
  // const handledelete = async (item: any) => {
  //   await deleteRecord(item.id);
  //   Message.success('删除成功');
  //   fetchData();
  // };

  // const handleAdd = () => {
  //   modalVisble.value = true;
  // };

  const updateVisible = (visible: boolean) => {
    modalVisble.value = visible;
  };

  const updateSuccess = () => {
    modalVisble.value = false;
    fetchData(searchParams.value);
  };

  const updatePointVisible = (visible: boolean) => {
    pointVisble.value = visible;
  };

  const updatePointSuccess = () => {
    pointVisble.value = false;
    fetchData(searchParams.value);
  };

  const search = () => {
    searchParams.value = {
      ...basePagination,
      ...formModel.value,
    } as unknown as PolicyParams;
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
</script>
