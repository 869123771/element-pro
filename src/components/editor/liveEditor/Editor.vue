<template>
  <editor v-model="stableCode"
          @init="editorInit"
          @input = "updatePreview"
          v-bind="editorProps"
  />
</template>

<script>

import {debounce} from "30-seconds-of-code";
import getScript from "./utils/getScript";

const UPDATE_DELAY = 300;

export default {
  name: "VueLiveEditor",
  components: {
    editor: require('vue2-ace-editor'),
  },
  props: {
    code: {
      type: String,
      required: true,
    },
    delay: {
      type: Number,
      default: UPDATE_DELAY,
    },
    editorProps: {
      type: Object,
      default: () => ({
        theme : 'twilight',
        lang : 'html',
        ref : 'editor',
        options : {
          fontSize : 16,
          showLineNumbers : true,
          showGutter : true,                     //显示行号区域
          displayIndentGuides : false,            //显示参考线
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true,
          enableEmmet : true,
          //minLines : 6,
          //maxLines : Infinity,
        }
      }),
    },
    lang: {
      type: String,
      default: "html",
      //validator: (val) => ["html", "vsg"].includes(val),
    },
    jsx: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      updatePreview: () => {},
      /**
       * this data only gets changed when changing language.
       * it allows for copy and pasting without having the code
       * editor repainted every keystroke
       */
      stableCode: this.code,
    };
  },
  methods: {
    highlighter(code) {
      return highlight(this.lang, this.jsx)(code);
    },
    editorInit(){
      require('brace/ext/textarea')
      require('brace/ext/emmet')
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/sql')
      require('brace/mode/javascript')    //language
      require('brace/mode/html')
      require('brace/mode/less')
      require('brace/theme/twilight')
      require('brace/snippets/javascript')
      require('brace/snippets/sql')
      require('brace/snippets/html')
    }
  },
  watch: {
    code(value) {
      this.updatePreview(value);
    },
  },
  created() {
    this.updatePreview = debounce((value) => {
      this.stableCode = value;
      this.$emit("change", value);
    }, this.delay);
  },
};
</script>
