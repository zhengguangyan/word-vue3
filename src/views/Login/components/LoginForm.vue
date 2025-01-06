<script setup lang="ts">
import { reactive, ref, unref, watch } from 'vue'
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElMessage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginApi, getTestRoleApi, getAdminRoleApi, getInfo, getRouters } from '@/api/login'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import Cookies from 'js-cookie'
const { required } = useValidator()
// const emit = defineEmits(['to-register'])

const appStore = useAppStore()
const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const { wsCache } = useCache()

const { t } = useI18n()

const rules = {
  username: [required()],
  password: [required()]
}
const { register, elFormRef, methods } = useForm()
// const { setValues } = methods
// if (Cookies.get('rmbPass') == true) {
//   setValues({
//     username: Cookies.get('username'),
//     password: Cookies.get('password'),
//   })
// }
const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    }
  },
  {
    field: 'username',
    label: t('login.username'),
    value: Cookies.get('rmbPass') == 'true' ? Cookies.get('username') : '',
    component: 'Input',
    colProps: {
      span: 26
    },
    componentProps: {
      style: {
        width: '451px'
      },
      placeholder: t('login.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    value: Cookies.get('rmbPass') == 'true' ? Cookies.get('password') : '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '451px'
      },
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    }
  },
  {
    field: 'Loginnow',
    colProps: {
      span: 24
    }
  }
  // {
  //   field: 'other',
  //   component: 'Divider',
  //   label: t('login.otherLogin'),
  //   componentProps: {
  //     contentPosition: 'center'
  //   }
  // },
  // {
  //   field: 'otherIcon',
  //   colProps: {
  //     span: 24
  //   }
  // }
])

// const iconSize = 30

const remember = ref(true)

const loading = ref(false)

// const iconColor = '#999'

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// 登录
const signIn = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      const formData = await getFormData<UserType>()
      try {
        const res = await loginApi(formData)
        if (res) {
          cookie(res)
          Cookies.set('rmbPass', remember.value)
          Cookies.set('username', formData.username)
          Cookies.set('password', formData.password)
          const getInfos = await getInfo()
          await wsCache.set(appStore.getUserInfo, getInfos)
          wsCache.set('areaCode', '00')

          const rut = await getRouters()
          // wsCache.set(appStore.getToken, res)
          await wsCache.set('roleRouters', rut.data)
          // 是否使用动态路由
          if (appStore.getDynamicRouter) {
            getRole()
          } else {
            await permissionStore.generateRoutes('admin', rut.data).catch(() => {})
            permissionStore.getAddRouters.forEach((route) => {
              addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
            })
            permissionStore.setIsAddRouters(true)

            // push({ path: redirect.value || permissionStore.addRouters[0].path })
            push('/')
          }
          ElMessage.success('登录成功')
        }
      } finally {
        loading.value = false
      }
    }
  })
}
const cookie = (res) => {
  Cookies.set('TokenKey', res.token)
}

// userName.value = Cookies.get('rmbPass') == true ? Cookies.get('username') : ''
// passWord.value = Cookies.get('rmbPass') == true ? Cookies.get('password') : ''
const checkChange = async () => {
  // const { getFormData } = methods
  // const formData = await getFormData<UserType>()
  // wsCache.set(appStore.getUserRem, remember.value)
  // // wsCache.set(appStore.getUserMsg, formData)
}
// 获取角色信息
const getRole = async () => {
  const { getFormData } = methods
  const formData = await getFormData<UserType>()
  const params = {
    roleName: formData.username
  }
  // admin - 模拟后端过滤菜单
  // test - 模拟前端过滤菜单
  const res = formData.username === 'admin' ? await getAdminRoleApi(params) : await getTestRoleApi(params)
  if (res) {
    const { wsCache } = useCache()
    const routers = res.data || []
    wsCache.set('roleRouters', routers)

    formData.username === 'admin' ? await permissionStore.generateRoutes('admin', routers).catch(() => {}) : await permissionStore.generateRoutes('test', routers).catch(() => {})

    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  }
}

// 去注册页面
// const toRegister = () => {
//   emit('to-register')
// }
</script>

<template>
  <Form
    @keyup.enter="signIn"
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="register"
    style="width: 100%"
  >
    <template #title>
      <div class="titleimg"></div>
      <h3 class="texta">{{ t('login.login') }}</h3>
    </template>

    <template #tool>
      <div class="flex justify-between items-center w-[88%]">
        <ElCheckbox v-model="remember" :change="checkChange()" :label="t('login.remember')" size="small" class="remember" />
        <!-- <ElLink type="primary" :underline="false" class="col">{{ t('login.forgetPassword') }}</ElLink> -->
      </div>
    </template>

    <template #login>
      <div class="w-[100%]">
        <!-- 立即登入按钮 -->
        <el-button type="primary" style="background-color: #ff9500; border: none; outline: none; width: 451px" @click="signIn" :loading="loading">{{ t('login.Loginnow') }} </el-button>
        <!-- <ElButton :loading="loading"  class="w-[80%]" @click="signIn" style="background-color: rgb(240, 135, 98); border-bottom: 1px solid  rgb(240, 135, 98);">
 
        </ElButton> -->
      </div>
      <div class="wenzi">© 2021-2023 厦门智宇信息技术有限公司</div>
      <!-- <div class="w-[100%] mt-15px">
        <ElButton class="w-[80%]" @click="toRegister">
          {{ t('login.register') }}
        </ElButton>
      </div> -->
    </template>

    <!-- <template #otherIcon>
      <div class="flex justify-between w-[100%]">
        <Icon icon="ant-design:github-filled" :size="iconSize" class="cursor-pointer anticon" :color="iconColor" />
        <Icon icon="ant-design:wechat-filled" :size="iconSize" class="cursor-pointer anticon" :color="iconColor" />
        <Icon icon="ant-design:alipay-circle-filled" :size="iconSize" :color="iconColor" class="cursor-pointer anticon" />
        <Icon icon="ant-design:weibo-circle-filled" :size="iconSize" :color="iconColor" class="cursor-pointer anticon" />
      </div>
    </template> -->
  </Form>
</template>

<style lang="less" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
:deep(.el-form-item__label) {
  &::after {
    display: none;
  }
}

.texta {
  width: 600px;
  margin-top: -65px;
  // margin-left: 30px;
  color: var(--el-color-primary);
  font-size: 30px;
  font-weight: normal;
  font-family: FZLTHJW, FZLTHJW--GB1-0;
  margin-left: 90px;
}

.titleimg {
  background-image: url('@/assets/aimg/logo.png');
  width: 60px;
  height: 60px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
  display: compact;
  margin-top: 45px;
  // margin-left: 50px;
}

.col {
  color: var(--el-color-primary);
  border-bottom: 1px solid var(--el-color-primary);
}

.wenzi {
  width: 500px;
  height: 25px;
  font-size: 16px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 100;
  text-align: center;
  color: var(--el-color-primary);
  margin-top: 66px;
  margin-left: -20px;
}

::deep(element.style) {
  padding-right: 10px;
  padding-left: 139px;
}
</style>
