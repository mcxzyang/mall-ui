<template>
  <div class="container">
    <Breadcrumb :items="['售后订单列表', '售后订单详情']" />
    <a-card>
      <div class="flex-between">
        <router-link :to="{ name: 'OrderAfterSale' }">
          <a-button type="outline">返回</a-button>
        </router-link>
        <!-- v-if="orderAfterSaleData?.after_status === 1" -->
        <a-space v-if="orderAfterSaleData?.after_status === 1">
          <a-button
            type="primary"
            status="danger"
            :loading="btnLoading"
            @click="audit(2)"
          >
            <template #icon>
              <icon-close />
            </template>
            <!-- Use the default slot to avoid extra spaces -->
            <template #default>拒绝退款申请</template>
          </a-button>
          <a-button
            type="primary"
            status="success"
            :loading="btnLoading"
            @click="audit(1)"
          >
            <template #icon>
              <icon-check />
            </template>
            <!-- Use the default slot to avoid extra spaces -->
            <template #default>同意退款申请</template>
          </a-button>
        </a-space>
      </div>
    </a-card>
    <a-divider style="margin-top: 0" />
    <a-card class="general-card" title="售后订单信息">
      <a-row :gutter="80">
        <a-col :span="8">
          <a-form-item label="售后订单号">
            {{ orderAfterSaleData?.no }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="支付方式">
            <a-tag
              v-if="orderAfterSaleData?.order?.pay_type_text"
              :color="orderAfterSaleData?.order?.pay_type_color"
              >{{ orderAfterSaleData?.order?.pay_type_text }}</a-tag
            >
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="售后类型">
            {{ orderAfterSaleData?.type_text }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="退款金额">
            {{ orderAfterSaleData?.price }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="发起人">
            {{ orderAfterSaleData?.user?.nickname }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="申请时间">
            {{ orderAfterSaleData?.created_at }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="最近处理时间">
            {{ orderAfterSaleData?.updated_at }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="备注">
            {{ orderAfterSaleData?.reason }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="售后状态">
            {{ orderAfterSaleData?.after_status_text }}
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>

    <a-divider style="margin-top: 0" />
    <a-card class="general-card" title="订单信息">
      <a-row :gutter="80">
        <a-col :span="8">
          <a-form-item label="订单号">
            {{ orderAfterSaleData?.order?.order_no }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="创建时间">
            {{ orderAfterSaleData?.order?.created_at }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="订单总价">
            {{ orderAfterSaleData?.order?.total }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="订单来源">
            <a-tag :color="orderAfterSaleData?.order?.source_color">{{
              orderAfterSaleData?.order?.source_text
            }}</a-tag>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="订单状态">
            <a-tag :color="orderAfterSaleData?.order?.status_color">{{
              orderAfterSaleData?.order?.status_text
            }}</a-tag>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>

    <a-divider style="margin-top: 0" />
    <a-card class="general-card" title="商品信息">
      <a-table
        :columns="orderItemColumns"
        :data="orderItemList"
        :pagination="false"
      >
        <template #product_image="{ record }">
          <a-image
            v-if="record.product_sku.product.image"
            fit="fill"
            width="100"
            :style="{ cursor: 'pointer' }"
            :src="record.product_sku.product.image"
          />
        </template>
      </a-table>
    </a-card>
    <a-divider style="margin-top: 0" />
    <a-card class="general-card" title="售后记录">
      <a-timeline
        v-if="
          orderAfterSaleData?.order_after_sale_items &&
          orderAfterSaleData?.order_after_sale_items?.length > 0
        "
      >
        <a-timeline-item
          v-for="(item, key) in orderAfterSaleData?.order_after_sale_items"
          :key="key"
          :label="item.created_at"
          line-type="dashed"
        >
          <div>内容：{{ item.content }}</div>
          <div style="margin-top: 4px; margin-bottom: 4px">
            <a-typography-text type="secondary">
              备注：{{ item.remark }}
            </a-typography-text>
          </div>
          <div v-if="item.images && item.images.length > 0">
            <a-image-preview-group infinite>
              <a-space>
                <a-image
                  v-for="(img, k) in item.images"
                  :key="k"
                  :src="img"
                  width="200"
                />
              </a-space>
            </a-image-preview-group>
          </div>
        </a-timeline-item>
      </a-timeline>
    </a-card>
    <FormModal
      :visible="modalVisble"
      :order-after-sale-id="orderAfterSaleData.id"
      @update-visible="updateVisible"
      @update-success="updateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  import {
    OrderAfterSaleRecord,
    getRecord,
    auditRecord,
  } from '@/api/orderAfterSale';

  import { Message } from '@arco-design/web-vue';

  import FormModal from './components/form-modal.vue';

  // const router = useRouter();
  const route = useRoute();

  const orderId: any = route.params?.id;

  const orderAfterSaleData = ref<OrderAfterSaleRecord>(
    {} as OrderAfterSaleRecord
  );
  // const modalVisble = ref(false);
  // let orderItem = {};

  const modalVisble = ref(false);

  const orderItemList = ref([] as any);

  const fetchData = async () => {
    if (orderId) {
      const { data } = await getRecord(orderId);
      orderAfterSaleData.value = data;
      orderItemList.value = [];
      orderItemList.value.push(data?.order_item);
      // orderItemList = data?.order_item ? [data?.order_item] : [];
    }
  };

  const updateVisible = (visible: boolean) => {
    modalVisble.value = visible;
  };

  const updateSuccess = () => {
    modalVisble.value = false;
    fetchData();
  };

  const btnLoading = ref(false);

  onMounted(async () => {
    fetchData();
  });

  const orderItemColumns = ref<TableColumnData[]>([
    {
      title: '商品图片',
      dataIndex: 'product_sku.product.image',
      slotName: 'product_image',
    },
    {
      title: '商品名称',
      dataIndex: 'product_sku.product.title',
    },
    {
      title: '规格名称',
      dataIndex: 'product_sku.sku_name',
    },
    {
      title: '单价',
      dataIndex: 'price',
    },
    {
      title: '数量',
      dataIndex: 'stock',
    },
    {
      title: '小计',
      dataIndex: 'total',
      slotName: 'total',
    },
    {
      title: '状态',
      dataIndex: 'status_text',
    },
  ]);

  // const updateVisible = (visible: boolean) => {
  //   modalVisble.value = visible;
  // };

  // const updateSuccess = () => {
  //   modalVisble.value = false;
  //   fetchData();
  // };

  const audit = async (type: number) => {
    if (type === 2) {
      modalVisble.value = true;
      return;
    }
    btnLoading.value = true;
    await auditRecord(orderAfterSaleData.value?.id, { type });

    btnLoading.value = false;
    Message.success('操作成功');
    fetchData();
  };
</script>

<style scoped></style>
