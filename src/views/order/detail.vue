<template>
  <div class="container">
    <Breadcrumb :items="['订单列表', '订单详情']" />
    <a-card class="general-card" title="订单信息">
      <a-row :gutter="80">
        <a-col :span="8">
          <a-form-item label="订单号"> {{ orderData?.order_no }} </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="支付单号">
            {{ orderData?.trade_order_no }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="创建时间">
            {{ orderData?.created_at }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="支付时间">
            {{ orderData?.pay_at }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="订单总价">
            {{ orderData?.total }}
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
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  import { OrderRecord, getRecord } from '@/api/order';

  const router = useRouter();
  const route = useRoute();

  const orderId: any = route.params?.id;

  const orderData = ref<OrderRecord>();

  onMounted(async () => {
    if (orderId) {
      const { data } = await getRecord(orderId);
      orderData.value = data;
    }
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
  ]);

  const deleteSku = (record: any) => {
    // const index: any = formData.value.product_skus?.indexOf(record);
    // if (index !== -1) {
    //   formData.value.product_skus?.splice(index, 1);
    // }
  };
</script>

<style scoped></style>
