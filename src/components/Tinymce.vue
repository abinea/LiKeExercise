<template>
  <div class="tinymce-boxz">
    <Editor v-model="content" :api-key="apiKey" :init="init" />
  </div>
</template>

<script lang="ts">
import Editor from "@tinymce/tinymce-vue";
export default defineComponent({
  name: "Tinymce",
  components: {
    Editor,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  setup(props, context) {
    const content = ref("");
    watch(() => props.value, (newVal) => {
      content.value = newVal
    })
    console.log(content);

    const tiny = reactive({
      //https://github.com/tinymce/tinymce-vue/blob/main/src/demo/views/Iframe.vue
      apiKey: "qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc",
      init: {
        language: "zh_CN", // 显示中文
        branding: false, // tiny的logo是否显示
        placeholder: props.placeholder,
        min_width: 300,
        min_height: 220,
        width: props.width, // 编辑器宽度
        height: props.height, // 引入autoresize插件后失效
        resize: "true", // 编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可
        statusbar: false,  // 状态栏（元素路径、字数统计）是否显示
        // elementpath: false, // 元素路径是否显示
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;", //字体样式
        plugins: [
          "link", "fullscreen", "autolink", "lists", "table", "hr",
          "image", "charmap", "codesample", "link", "advlist", "help"]
        ,
        toolbar: [
          "undo redo | formatselect | bold italic underline strikethrough forecolor backcolor  subscript superscript removeformat| outdent indent bullist numlist codesample table image charmap hr  help fullscreen",
        ], // 工具栏配置，false-隐藏，不配置该属性-默认采用简单配置，也可自定义配置
        // toolbar: [ //数组写法
        //   'undo redo | bold italic | link image',
        //   'alignleft aligncenter alignright'
        // ],
        menubar: false, // 菜单栏配置,false-隐藏，不配置该属性-默认显示全部菜单，也可自定义配置
        paste_data_images: true, // 图片是否可粘贴
        // 图片上传处理
        images_upload_handler: (blobInfo: any, success: any, failure: any) => {
          let reader = new FileReader();
          reader.readAsDataURL(blobInfo.blob()); // 用base64形式上传图片
          reader.onloadend = function () {
            const imgbase64 = reader.result;
            success(imgbase64);
          };
        },
        // // 文件上传处理
        file_picker_types: "file image media", // 插件对应 link，image && axupimgs
        file_picker_callback: function (callback: any, value: any, meta: any) {
          let filetype; // 限制文件的上传类型,添加具体后缀即可
          if (meta.filetype == "image") {
            filetype = ".jpg, .jpeg, .png, .gif, .ico, .svg";
          } else if (meta.filetype == "media") {
            filetype = ".mp3, .mp4, .avi, .mov";
          } else {
            filetype =
              ".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4, .jpg, .jpeg, .png, .gif, .ico, .svg";
          }
          let inputElem = document.createElement("input"); //创建文件选择
          inputElem.setAttribute("type", "file");
          inputElem.setAttribute("accept", filetype);
          inputElem.click();
          inputElem.onchange = () => {
            // https://www.tiny.cloud/docs/configure/file-image-upload/#file_picker_callback
            let file = inputElem.files[0]; //获取文件信息
            let reader = new FileReader();
            reader.readAsDataURL(file); // 统一转成base64文件流
            reader.onload = function () {
              let id = "blobid" + new Date().getTime();
              // @ts-ignore
              let blobCache = tinymce.activeEditor.editorUpload.blobCache;
              // @ts-ignore
              let base64 = reader.result.split(",")[1];
              let blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);
              callback(blobInfo.blobUri(), { title: file.name });
            };
          };
        },
      }
    });
    watchEffect(() => {
      //内容有变化，就更新内容，将值返回给父组件
      context.emit("update:value", content.value);
    });
    return {
      content,
      ...toRefs(tiny)
    };
  },
});
</script>

<style scoped>
.tinymce-boxz>textarea {
  display: none;
}
</style>
<style>
/* 隐藏apikey没有绑定这个域名的提示 */
.tox-notifications-container .tox-notification--warning {
  display: none !important;
}

.tox.tox-tinymce {
  max-width: 100%;
}
</style>


