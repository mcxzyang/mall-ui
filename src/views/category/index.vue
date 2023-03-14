<template>
  <div class="container">
    <Breadcrumb :items="['分类管理', '第三方分类列表']" />
    <a-card class="general-card" title="第三方分类列表">
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
                <a-form-item field="name" label="分类名称">
                  <a-input v-model="formModel.name" placeholder="分类名称" />
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
        :columns="columnsList"
        :data="renderData"
        :bordered="false"
        :pagination="false"
      >
        <template #image="{ record }">
          <a-image
            v-if="record.image"
            fit="fill"
            width="100"
            :src="record.image"
          />
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
  // import cloneDeep from 'lodash/cloneDeep';
  import {
    queryPolicyList,
    deleteRecord,
    PolicyRecord,
    PolicyParams,
  } from '@/api/category';
  import { Message } from '@arco-design/web-vue';
  import FormModal from './components/form-modal.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const generateFormModel = () => {
    return {
      name: '',
    };
  };

  const { loading, setLoading } = useLoading(true);
  const renderData = ref<PolicyRecord[]>([]);
  const formModel = ref(generateFormModel());

  const modalVisble = ref(false);
  const formData = ref<PolicyRecord>();

  const columnsList = ref<TableColumnData[]>([
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '图片',
      dataIndex: 'image',
      slotName: 'image',
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   slotName: 'status',
    // },
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
      renderData.value = data;
      // pagination.page = data.current_page;
      // pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    formData.value = item;
    modalVisble.value = true;
  };
  const handledelete = async (item: any) => {
    await deleteRecord(item.id);
    Message.success('删除成功');
    fetchData();
  };

  const handleAdd = () => {
    modalVisble.value = true;
  };

  const updateVisible = (visible: boolean) => {
    modalVisble.value = visible;
  };

  const updateSuccess = () => {
    modalVisble.value = false;
    fetchData();
  };

  const search = () => {
    fetchData({
      ...formModel.value,
    } as unknown as PolicyParams);
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };
</script>
