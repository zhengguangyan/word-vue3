<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="onPreview"
      :limit="limit"
      :class="{ disabled: fileList.length === limit }"
      :on-remove="onRemove"
      :on-change="onChange"
      :before-upload="beforeUpload"
      :http-request="httpRequest"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="预览123" v-model="showImgDialog">
      <img :src="showImgUrl" style="width: 100%" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ImageUpload',
  props: {
    // 限定只能上传几个
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showImgUrl: '',
      showImgDialog: false,
      fileList: [
        {
          name: 'aaa',
          url: 'https://t7.baidu.com/it/u=1819248061,230866778&fm=193&f=GIF'
        },
        {
          name: 'bbb',
          url: 'https://t7.baidu.com/it/u=1297102096,3476971300&fm=193&f=GIF'
        }
      ]
    }
  },
  methods: {
    // 图片预览的时候
    onPreview(file) {
      this.showImgUrl = file.url
      this.showImgDialog = true
    },
    // 图片移除的钩子
    onRemove(file, fileList) {
      // file是删除的那个图片信息，fileList是剩余的最新的fileList
      this.fileList = fileList
    },
    // 文件改变的时候====> 1. 添加文件    2. 上传成功或失败都调用
    onChange(file, fileList) {
      // ready 的时候，fileList其实多了一个元素【本地预览的地址】
      // fail  的时候，fileList会把刚才没成功的移除了
      // success 的时候， fileList 多了个元素 【真实的线上地址】
      this.fileList = fileList
    },
    // 上传之前的检查钩子
    beforeUpload({ size, type }) {
      // 检测大小
      const maxSize = 3
      if (size > 1024 * 1024 * maxSize) {
        this.$message.warning(`体积不允许超过${maxSize}M`)
        return false
      }
      // 检测类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(type)) {
        this.$message.warning(`格式不正确`)
        return Promise.reject()
      }
      // 通过就是true
      return true
    },
    // 覆盖默认的上传行为
    httpRequest(data) {
      // 发起上传文件的请求操作 【自己服务器的还是用第三方的，根据项目情况】
      // 优点达项目： let fd = new FormData()  fd.append(xx,xxx)   请求方法调用，  成功之后去替换fileList的本地预览的地址
      // 人资项目： 调用第三方的上传接口进行使用 腾讯 cos 服务上传 减轻公司浏览器的负载
    }
  }
}
</script>
<style lang="scss">
.disabled {
  .el-upload {
    display: none;
  }
}
</style>
