import { IDomEditor } from '@wangeditor/editor';
import Editor from './src/editor.vue';

export interface EditorExpose {
  getEditorRef: () => Promise<IDomEditor>;
}

export { Editor };
