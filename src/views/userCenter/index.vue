<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>个人信息</span>
          </div>
        </template>
        <div class="card-avatar">
          <userAvatar />
        </div>
        <div class="card-content" style="border-top: 1px solid #ddd">
          <span>用户名称</span><span>{{ userInfo?.username || '暂无名称' }}</span>
        </div>
        <div class="card-content">
          <span>手机号码</span><span>{{ userInfo?.mobile || '暂无号码' }}</span>
        </div>
        <!-- <div class="card-content">
                    <span>用户邮箱</span><span>{{ userInfo?.email || '暂无邮箱' }}</span>
                </div> -->
        <div class="card-content">
          <span>所属部门</span><span>{{ userInfo?.dept?.name }} / {{ adminDeptNames }}</span>
        </div>
        <div class="card-content">
          <span>所属角色</span><span>{{ roleGroup || '暂无角色' }}</span>
        </div>
        <div class="card-content">
          <span>创建日期</span><span>{{ userInfo?.createTime }}</span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>基本资料</span>
          </div>
        </template>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="基本资料" name="userInfo">
            <el-form
              ref="ruleFormRef"
              :model="form"
              label-width="100px"
              :rules="rules"
              v-if="form?.username"
            >
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="form.nickname" class="demo-form-inline" maxlength="30" />
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" maxlength="11" class="demo-form-inline" />
              </el-form-item>
              <!-- <el-form-item label="邮箱" prop="email">
                                <el-input v-model="form.email" maxlength="50" class="demo-form-inline" />
                            </el-form-item> -->
              <el-form-item label="性别">
                <el-radio-group v-model="form.sex">
                  <el-radio value="0">男</el-radio>
                  <el-radio value="1">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit(ruleFormRef)">确定</el-button>
                <el-button @click="close">取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="resetPwd">
            <el-form ref="pwdFormRef" :model="password" :rules="passwordRules" label-width="100px">
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input
                  v-model="password.oldPassword"
                  placeholder="请输入旧密码"
                  class="demo-form-inline"
                  type="password"
                  show-password
                />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="password.newPassword"
                  placeholder="请输入新密码"
                  class="demo-form-inline"
                  type="password"
                  show-password
                />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="password.confirmPassword"
                  placeholder="请确认新密码"
                  class="demo-form-inline"
                  type="password"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit(pwdFormRef)">确定</el-button>
                <el-button @click="activeName = 'userInfo'">取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, TabsPaneContext } from 'element-plus'
import { useRouter } from 'vue-router'
import userAvatar from './userAvatar.vue'
import { updateUserInfo, updateUserPwd, getUserProfile } from '@/api/user/user'
import { reactive } from 'vue'
// import { useCache } from '@/hooks/web/useCache'
// import { useAppStore } from '@/store/modules/app'
// const { wsCache } = useCache()
// const appStore = useAppStore()
// let userInfo = wsCache.get(appStore.getUserInfo).user
let userInfo = ref()
let adminDeptNames = ref()
let roleGroup = ref()
let form = ref()

onMounted(() => {
  getUserInfo()
})
async function getUserInfo() {
  await getUserProfile().then((res) => {
    userInfo.value = res.data
    adminDeptNames.value = res.adminDeptNames
    roleGroup.value = res.roleGroup
    form.value = res.data
    // avatar.value = res.data.avatar
  })
}

const activeName = ref('userInfo')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  reset()
}

const ruleFormRef = ref()
const pwdFormRef = ref()

const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ]
  // email: [
  //     { required: true, message: '请输入邮箱', trigger: 'blur' },
  //     {
  //         type: "email",
  //         message: "请输入正确的邮箱地址",
  //         trigger: ["blur", "change"]
  //     }
  // ]
}

const onSubmit = async (ruleFormRef) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate(async (valid) => {
    if (valid) {
      await updateUserInfo(form.value).then((response) => {
        if (response.code == '200') {
          ElMessage.success('修改成功！')
          getUserInfo()
        } else {
          ElMessage.error('修改失败！')
        }
      })
    } else {
    }
  })
}

let password = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const submit = async (pwdFormRef) => {
  if (!pwdFormRef) return
  await pwdFormRef.validate(async (valid) => {
    if (valid) {
      if (password.newPassword !== password.confirmPassword) {
        ElMessage.error('确认密码与新密码一致！')
        return false
      }
      await updateUserPwd(password.oldPassword, password.newPassword).then((response) => {
        if (response.code == '200') {
          ElMessage.success('修改成功！')
          reset()
        } else {
          ElMessage.error('修改失败！')
        }
      })
    } else {
    }
  })
}

function reset() {
  Object.assign(password, {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
}

const { replace } = useRouter()
const close = () => {
  replace('/dashboard/analysis')
}
</script>

<style lang="less" scoped>
.card-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
}
.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}
.demo-form-inline {
  width: 420px;
}

.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  background-color: #cccccc;
  border-color: #cccccc;
}
.el-button:hover {
  border-color: #ffbf66;
  background-color: #ffbf66;
  color: #fff;
}

.el-button:active {
  border-color: #e58600;
  background-color: #e58600;
}

.el-button:focus-visible {
  outline: 2px solid #e58600;
  outline-offset: 1px;
}

.el-button:focus {
  border-color: #e58600;
  background-color: #e58600;
  outline: 0;
}
.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: 1px dashed #ddd;
}
:deep(.el-card__body) {
  padding: 0 15px !important;
}
:deep(.card-header) {
  padding: 10px;
}
</style>
