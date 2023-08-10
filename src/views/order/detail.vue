<template>
  <div class="container">
    <Breadcrumb :items="['订单列表', '订单详情']" />
    <a-card>
      <div class="flex-between">
        <router-link :to="{ name: 'OrderList' }">
          <a-button type="outline">返回</a-button>
        </router-link>
        <a-space>
          <!-- <a-button v-if="orderData?.status === 2" status="success">
            发货
          </a-button> -->
        </a-space>
      </div>
    </a-card>
    <a-divider style="margin-top: 0" />
    <a-card class="general-card" title="订单信息">
      <a-row :gutter="80">
        <a-col :span="8">
          <a-form-item label="订单号"> {{ orderData?.order_no }} </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="创建时间">
            {{ orderData?.created_at }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="订单总价">
            {{ orderData?.total }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="订单来源">
            <!-- <a-tag :color="orderData?.source_color">{{
              orderData?.source_text
            }}</a-tag> -->
            {{ orderData.company?.name }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="订单状态">
            <a-tag :color="orderData?.status_color">{{
              orderData?.status_text
            }}</a-tag>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-divider style="margin-top: 0" />
    <a-card class="general-card" title="支付信息">
      <a-row :gutter="80">
        <a-col :span="8">
          <a-form-item label="支付单号">
            {{ orderData?.trade_order_no }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="支付方式">
            <a-tag
              v-if="orderData?.pay_type_text"
              :color="orderData?.pay_type_color"
              >{{ orderData?.pay_type_text }}</a-tag
            >
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="支付时间">
            {{ orderData?.pay_at }}
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-divider style="margin-top: 0" />
    <a-card class="general-card" title="地址信息">
      <a-row :gutter="80">
        <a-col :span="8">
          <a-form-item label="省份">
            {{ orderData?.address?.province }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="市区">
            {{ orderData?.address?.area }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="地区">
            {{ orderData?.address?.city }}
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="详细地址">
            {{ orderData?.address?.address }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="联系人">
            {{ orderData?.address?.contact_name }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="联系电话">
            {{ orderData?.address?.contact_phone }}
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-divider style="margin-top: 0" />
    <a-card class="general-card" title="商品信息">
      <a-table
        :columns="orderItemColumns"
        :data="orderData?.order_items"
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
        <template #operate="{ record }">
          <a-space>
            <a-button
              v-if="record.status === 2"
              type="text"
              size="mini"
              @click="delivery(record)"
            >
              发货
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <DeliveryModule
      :visible="modalVisble"
      :order-item="orderItem"
      :order-id="orderId"
      @update-visible="updateVisible"
      @update-success="updateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  import { OrderRecord, getRecord } from '@/api/order';

  import DeliveryModule from './components/delivery.vue';

  // const router = useRouter();
  const route = useRoute();

  const orderId: any = route.params?.id;

  const orderData = ref<OrderRecord>({} as OrderRecord);
  const modalVisble = ref(false);
  let orderItem = {};

  const fetchData = async () => {
    if (orderId) {
      const { data } = await getRecord(orderId);
      orderData.value = data;
    }
  };

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
    {
      title: '操作',
      slotName: 'operate',
    },
  ]);

  const updateVisible = (visible: boolean) => {
    modalVisble.value = visible;
  };

  const updateSuccess = () => {
    modalVisble.value = false;
    fetchData();
  };

  const delivery = (record: any) => {
    orderItem = record;
    modalVisble.value = true;
  };
</script>

<style scoped></style>
