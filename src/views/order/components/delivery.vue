<template>
  <a-modal
    v-model:visible="modalVisible"
    width="auto"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <template #title> {{ title() }} </template>
    <div>
      <a-form ref="modalFormRef" :model="modalData">
        <a-row>
          <a-col :span="24">
            <a-form-item label="商品名称">
              {{ props.orderItem?.product_sku?.product?.title }}
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="快递公司"
              field="express_company_name"
              :rules="[{ required: true, message: '请填写快递公司名称' }]"
            >
              <a-select v-model="modalData.express_company_name">
                <a-option
                  v-for="(item, key) in expressCompanyList"
                  :key="key"
                  :value="item?.name"
                  >{{ item?.name }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="快递单号"
              field="express_no"
              :rules="[{ required: true, message: '请填写快递单号' }]"
            >
              <a-input v-model="modalData.express_no"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { deliveryOrderItem, updateOrderItem } from '@/api/order';
  import { Message } from '@arco-design/web-vue';
  import { PolicyRecord as ExpressCompanyI } from '@/api/expressCompany';
  import { clone } from 'lodash';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: [Number, String],
      default: () => null,
    },
    orderItem: {
      type: Object,
      default: () => null,
    },
    expressCompanyList: {
      type: Array<ExpressCompanyI>,
      default: () => [],
    },
    ifDelivery: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits(['update-visible', 'update-success']);

  const modalVisible = ref(false);

  const title = () => {
    return props.ifDelivery ? '发货' : '修改快递信息';
  };

  const generateForm = () => {
    return {
      express_company_name: '',
      express_no: '',
    };
  };

  const modalData = ref(generateForm());

  watch(
    () => props.visible,
    (value) => {
      modalVisible.value = value;
    }
  );

  watch(
    () => props.orderItem,
    (value) => {
      const orderItem = clone(value);
      modalData.value = orderItem as any;
    },
    {
      deep: true,
      immediate: true,
    }
  );

  const handleCancel = () => {
    modalData.value = generateForm();
    emit('update-visible', false);
  };

  const modalFormRef = ref(null);
  const handleBeforeOk = (done: (closed: boolean) => void) => {
    const validateRef: any = modalFormRef.value;
    if (validateRef) {
      validateRef.validate().then(async (res: any) => {
        if (!res) {
          try {
            if (props.ifDelivery) {
              await deliveryOrderItem(props.orderItem?.id, modalData.value);
            } else {
              await updateOrderItem(props.orderItem?.id, modalData.value);
            }

            done(true);
            modalData.value = generateForm();
            emit('update-success');
            Message.success('操作成功');
          } catch (e) {
            done(false);
          }
        }
        done(false);
      });
    }
  };
</script>

<style scoped></style>
