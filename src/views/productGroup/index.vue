<template>
  <div class="container">
    <Breadcrumb :items="['商品分组管理', '商品分组列表']" />
    <a-card class="general-card" title="商品分组列表">
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
                <a-form-item field="name" label="分组名称">
                  <a-input v-model="formModel.name" placeholder="分组名称" />
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
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.page - 1) * pagination.pageSize }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status === 'offline'" class="circle"></span>
          <span v-else class="circle pass"></span>
          已上线
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="outline" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-popconfirm
              content="确定删除此条记录吗?"
              type="warning"
              @ok="handledelete(record)"
            >
              <a-button type="outline" status="danger" size="small">
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:visible="visible"
      width="auto"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <template #title> {{ modalData.id ? '编辑' : '创建' }} </template>
      <div>
        <a-form ref="modalFormRef" :model="modalData">
          <a-row>
            <a-col :span="24">
              <a-form-item
                label="分组名称"
                field="name"
                :rules="[{ required: true, message: '请填写分组名称' }]"
              >
                <a-input v-model="modalData.name"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="分组图片" field="image">
                <a-input v-model="modalData.image"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
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
    saveRecord,
    addRecord,
    deleteRecord,
    PolicyRecord,
    PolicyParams,
  } from '@/api/productGroup';
  import { Message } from '@arco-design/web-vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  // type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      name: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<PolicyRecord[]>([]);
  const formModel = ref(generateFormModel());

  const visible = ref(false);
  const generateModalData = () => {
    return {
      id: null,
      name: '',
      image: '',
    };
  };
  const modalData = ref({
    id: null,
    name: '',
    image: '',
  });

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    page: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const columnsList = ref<TableColumnData[]>([
    {
      title: '序号',
      dataIndex: 'id',
      slotName: 'id',
    },
    {
      title: '分组名称',
      dataIndex: 'name',
    },
    {
      title: '分组图片',
      dataIndex: 'image',
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
  const modalFormRef = ref(null);

  const handleCancel = () => {
    const validateRef: any = modalFormRef.value;
    validateRef?.clearValidate();
    visible.value = false;
  };
  const handleEdit = (item: any) => {
    modalData.value = item;
    visible.value = true;
  };
  const handledelete = async (item: any) => {
    await deleteRecord(item.id);
    Message.success('删除成功');
    fetchData();
  };
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

            visible.value = false;
            fetchData();
            generateFormModel();
            Message.success('操作成功');
          } catch (e) {
            done(false);
          }
        } else {
          done(false);
        }
      });
    }
  };

  const handleAdd = () => {
    modalData.value = generateModalData();
    visible.value = true;
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
