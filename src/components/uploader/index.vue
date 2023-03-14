<template>
  <a-upload
    :custom-request="customRequest"
    :file-list="fileList"
    :default-file-list="fileList"
    list-type="picture-card"
    :limit="1"
    :show-upload-button="true"
    image-preview
    @change="uploadChange"
  >
  </a-upload>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  import type {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';

  import { userUploadApi } from '@/api/tools';

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  });

  const fileList = ref<FileItem[]>([]);

  const emits = defineEmits(['update:modelValue']);

  const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
    if (fileItemList.length === 0) {
      emits('update:modelValue', '');
    }
  };

  watch(
    () => props.modelValue,
    (value) => {
      if (value && fileList.value.length === 0) {
        fileList.value = [
          {
            uid: '-2',
            name: 'avatar.png',
            url: value,
          },
        ];
      } else {
        fileList.value = [];
      }
    },
    {
      immediate: true,
    }
  );

  const customRequest = (options: RequestOption) => {
    // docs: https://axios-http.com/docs/cancellation
    const controller = new AbortController();

    (async function requestWrap() {
      const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        name = 'pic',
      } = options;
      onProgress(20);
      const formData = new FormData();
      formData.append(name as string, fileItem.file as Blob);

      try {
        // https://github.com/axios/axios/issues/1630
        // https://github.com/nuysoft/Mock/issues/127

        const res = await userUploadApi(formData);
        const url = res.data.url as any;
        emits('update:modelValue', url);
        onSuccess(res);
      } catch (error) {
        onError(error);
      }
    })();
    return {
      abort() {
        controller.abort();
      },
    };
  };
</script>

<style scoped lang="less">
  :deep(.arco-upload-list-picture) {
    width: 160px;
    height: 160px;
  }
  :deep(.arco-upload-list-picture-mask) {
    line-height: 160px;
  }
  :deep(.arco-upload-picture-card) {
    width: 160px;
    height: 160px;
  }
  :deep(.arco-upload-list-picture-operation) {
    font-size: 30px;

    .arco-upload-icon-remove {
      font-size: 30px;
    }
  }
</style>
