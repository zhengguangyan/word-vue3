<template>
  <input type="file" accept="image/*" @change="onChange" id="fileBtn" style="display: none" />
  <!-- <el-button @click="uploadClick">图片上传</el-button> -->
  <div class="user-info-head" @click="uploadClick()">
    <img :src="options.img" title="点击上传头像" class="img-circle img-lg" />
  </div>
  <el-dialog v-model="dialogVisible" title="图片裁剪" width="50%" :before-close="handleClose">
    <div style="width: 50%; height: 50vh; display: inline-block;">
      <vueCropper ref="cropperRef" :img="options.img" :info="true" :infoTrue="options.infoTrue"
        :auto-crop="options.autoCrop" :fixed-box="options.fixedBox" :fixedNumber="options.fixedNumber"
        :fixed="options.fixed" :centerBox="options.centerBox" @real-time="realTime" />
    </div>

    <!-- 裁剪的内容 -->
    <div style="float: right; width: 50%; height: 50vh;text-align: center;line-height: 50vh;">
      <img :src="previews" class="cropper-img" />
    </div>

    <div style="margin-top: 20px;">
      <el-row>
        <el-col :lg="2" :sm="3" :xs="3">
          <el-button type="primary" @click="uploadFile()">
            重新选择
          </el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :sm="2" :xs="2">
          <el-button type="success" :icon="Plus" @click="changeScale(1)" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button type="success" :icon="Minus" @click="changeScale(-1)" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button type="danger" :icon="RefreshLeft" @click="rotateLeft()" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button type="danger" :icon="RefreshRight" @click="rotateRight()" />
        </el-col>
      </el-row>
    </div>
    <!-- <div class="reupload_text" @click="uploadFile()">
      重新上传
    </div> -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="" @click="refreshCrop">重置</el-button>
        <el-button type="primary" @click="finish"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import vueCropper from "vue-cropper/src/vue-cropper.vue";
import { uploadAvatar, getInfo } from '@/api/user/user'
import { ElMessage } from 'element-plus'
import userImg from '@/assets/imgs/user.png'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import avatarStore from '@/store/modules/app'
import { Plus, Minus, RefreshLeft, RefreshRight } from '@element-plus/icons-vue'
// import { config } from '@/config/axios/config'
// const { base_url } = config
const { wsCache } = useCache()
const appStore = useAppStore()
interface Options {
  img: any; // 裁剪图片的地址
  info: true; // 裁剪框的大小信息
  outputSize: number; // 裁剪生成图片的质量 [1至0.1]
  outputType: "jpeg"; // 裁剪生成图片的格式
  canScale: boolean; // 图片是否允许滚轮缩放
  autoCrop: boolean; // 是否默认生成截图框
  autoCropWidth: number; // 默认生成截图框宽度
  autoCropHeight: number; // 默认生成截图框高度
  fixedBox: boolean; // 固定截图框大小 不允许改变
  fixed: boolean; // 是否开启截图框宽高固定比例
  fixedNumber: Array<number>; // 截图框的宽高比例  需要配合centerBox一起使用才能生效
  full: boolean; // 是否输出原图比例的截图
  canMoveBox: boolean; // 截图框能否拖动
  original: boolean; // 上传图片按照原始比例渲染
  centerBox: boolean; // 截图框是否被限制在图片里面
  infoTrue: boolean; // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
}

const imageURL = avatarStore()

const avatar = wsCache.get(appStore.getUserInfo).user.avatar
const image = avatar ? imageURL.imageLink + avatar : userImg

const options: Options = reactive({
  img: image, // 需要剪裁的图片
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 150, // 默认生成截图框的宽度
  autoCropHeight: 150, // 默认生成截图框的长度
  fixedBox: false, // 是否固定截图框的大小 不允许改变
  info: true, // 裁剪框的大小信息
  outputSize: 1, // 裁剪生成图片的质量 [1至0.1]
  outputType: "jpeg", // 裁剪生成图片的格式
  canScale: false, // 图片是否允许滚轮缩放
  fixed: true, // 是否开启截图框宽高固定比例
  fixedNumber: [1, 1], // 截图框的宽高比例 需要配合centerBox一起使用才能生效
  full: true, // 是否输出原图比例的截图
  canMoveBox: false, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
});
const previews: any = ref({});
let fileItem = reactive({});
const cropperRef: any = ref({});
const dialogVisible = ref(false);
// 触发点击事件
const uploadClick = () => {
  document.getElementById("fileBtn")?.click();
};
const onChange = (e: any) => {
  const file = e.target.files[0];
  fileItem = file;
  const URL = window.URL || window.webkitURL;
  options.img = URL.createObjectURL(file);
  dialogVisible.value = true;
};
const refreshCrop = () => {
  cropperRef.value.refresh();
};
const uploadFile = () => {
  document.getElementById("fileBtn")?.click();
}
const handleClose = () => {
  options.img = image || '';
  dialogVisible.value = false;
}

// 向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft();
}
// 向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight();
}
// 图片缩放
const changeScale = (num) => {
  num = num || 1;
  cropperRef.value.changeScale(num);
}

// 裁剪之后的数据
const realTime = () => {
  cropperRef.value.getCropData((data: any) => {
    previews.value = data;
    // data为base64图片，供接口使用
  });
}
// 上传图片（点击保存按钮）
const finish = () => {
  // cropperRef.value.getCropData((data: any) => {
  //   // data为base64图片，供接口使用
  // });
  cropperRef.value.getCropBlob(data => {
    // 下面是将blob转为formData
    let formData = new FormData();
    formData.append("avatarfile", data);
    uploadAvatar(formData).then(async (response) => {
      if (response.code == '200') {
        ElMessage.success('修改成功！');
        const getInfos = await getInfo()
        options.img = imageURL.imageLink + getInfos.user.avatar || '';
        await wsCache.set(appStore.getUserInfo, getInfos)
        imageURL.avatar = options.img
      } else {
        ElMessage.error('修改失败！');
      }
    });
    // 下面是将blob转换为file
    data.lastModifiedDate = new Date(); // 文件最后的修改日期
    let file = new File([data], fileItem?.name, {
      type: data.type,
      lastModified: Date.now(),
    });
  });
  dialogVisible.value = false;
};
</script>
<style lang="less" scoped>
.reupload_text {
  color: #e58600;
  padding: 10px;
  border-bottom: #e58600;
}

.reupload_text:hover {
  cursor: pointer;
}

.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
  content: '+';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 120px;
  border-radius: 50%;
  text-align: center;
}

.img-circle {
  border-radius: 50%;
}

.img-lg {
  width: 120px;
  height: 120px;
}

.cropper-img {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  display: inline-block;
}
</style>