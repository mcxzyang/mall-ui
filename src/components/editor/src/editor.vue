<script setup lang="ts">
  import {
    onBeforeUnmount,
    computed,
    PropType,
    unref,
    nextTick,
    ref,
    watch,
    shallowRef,
  } from 'vue';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
  import { isNumber } from '@/utils/is';
  // import propTypes from '@/utils/propTypes';

  import { userUploadApi } from '@/api/tools';
  import { Message } from '@arco-design/web-vue';

  type InsertFnType = (url: string, alt: string, href: string) => void;

  const props = defineProps({
    // editorId: propTypes.string.def('wangeEditor-1'),
    editorId: {
      type: String,
      default: 'wangeEditor-1',
    },
    // height: propTypes.oneOfType([Number, String]).def('500px'),
    height: {
      type: [Number, String],
      default: '500px',
    },
    editorConfig: {
      type: Object as PropType<IEditorConfig>,
      default: () => undefined,
    },
    // modelValue: propTypes.string.def(''),
    modelValue: {
      type: String,
      default: '',
    },
  });
  const emit = defineEmits(['change', 'update:modelValue']);
  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef<IDomEditor>();
  const valueHtml = ref('');
  watch(
    () => props.modelValue,
    (val: string) => {
      if (val === unref(valueHtml)) return;
      valueHtml.value = val;
    },
    {
      immediate: true,
    }
  );
  // 监听
  watch(
    () => valueHtml.value,
    (val: string) => {
      emit('update:modelValue', val);
    }
  );
  const handleCreated = (editor: IDomEditor) => {
    editorRef.value = editor;
  };
  // 编辑器配置
  const editorConfig = computed((): IEditorConfig => {
    return {
      readOnly: false,
      customAlert: (s: string, t: string) => {
        switch (t) {
          case 'success':
            break;
          case 'info':
            break;
          case 'warning':
            break;
          case 'error':
            break;
          default:
            break;
        }
      },
      MENU_CONF: {
        uploadImage: {
          async customUpload(file: File, insertFn: InsertFnType) {
            const formData = new FormData();
            formData.append('pic', file);

            try {
              const res = await userUploadApi(formData);
              const url = res.data.url as any;
              insertFn(url, 'image', url);
            } catch (error) {
              Message.error('上传失败');
            }
          },
        },
      },
      autoFocus: false,
      scroll: true,
      ...(props.editorConfig || {}),
    };
  });

  // const editorConfig: Partial<IEditorConfig> = {
  //   MENU_CONF: {
  //     uploadImage: {
  //       server: '/api/upload',
  //       fileName: 'pic',
  //     },
  //   },
  // };
  const editorStyle = computed(() => {
    return {
      height: isNumber(props.height) ? `${props.height}px` : props.height,
    };
  });
  // 回调函数
  const handleChange = (editor: IDomEditor) => {
    emit('change', editor);
  };
  // 组件销毁时，及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = unref(editorRef.value);
    if (editor === null) return;
    // 销毁，并移除 editor
    editor?.destroy();
  });
  const getEditorRef = async (): Promise<IDomEditor> => {
    await nextTick();
    return unref(editorRef.value) as IDomEditor;
  };
  defineExpose({
    getEditorRef,
  });
</script>

<template>
  <div class="border-1">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :editor-id="editorId"
      class="border-bottom-1"
    />
    <!-- 编辑器 -->
    <Editor
      v-model="valueHtml"
      :editor-id="editorId"
      :default-config="editorConfig"
      :style="editorStyle"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style lang="less">
  .border-1 {
    border: 1px solid #ccc;
    width: 100%;
  }
  .border-bottom-1 {
    border-bottom: 1px solid #ccc;
  }
</style>
