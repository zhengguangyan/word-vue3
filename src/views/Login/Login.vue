<script setup lang="ts">
import { LoginForm, RegisterForm } from './components'
// import { ThemeSwitch } from '@/components/ThemeSwitch'
// import { LocaleDropdown } from '@/components/LocaleDropdown'
// import { useI18n } from '@/hooks/web/useI18n'
// import { underlineToHump } from '@/utils'
// import { useAppStore } from '@/store/modules/app'
// import { useDesign } from '@/hooks/web/useDesign'
import { ref } from 'vue'

// const { getPrefixCls } = useDesign()

// const prefixCls = getPrefixCls('login')

// const appStore = useAppStore()

// const { t } = useI18n()

const isLogin = ref(true)

const toRegister = () => {
  isLogin.value = false
}

const toLogin = () => {
  isLogin.value = true
}
</script>

<template>
  <div class="imgbj">
    <!-- :class="prefixCls" class="h-[100%] relative <xl:bg-v-dark <sm:px-10px <xl:px-10px <md:px-10px" -->
    <div>
      <div class="relative h-full flex mx-auto">
        <!-- :class-"$[prefixcls) left flex-1 bg-gray-500 bg-opacity-20 relative p-30px <xl:hidden"" -->
        <div>
          <div class="flex items-center relative text-white">
            <!-- <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" /> -->
            <!-- <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span> -->
          </div>
          <div class="flex justify-center items-center h-[calc(100%-60px)]">
            <!-- <TransitionGroup appear tag="div" enter-active-class="animate__animated animate__bounceInLeft"> -->
            <!-- <img src="@/assets/svgs/login-box-bg.svg" key="1" alt="" class="w-350px" /> -->
            <!-- <div class="text-3xl text-white" key="2">{{ t('login.welcome') }}</div>
            <div class="mt-5 font-normal text-white text-14px" key="3">
              {{ t('login.message') }}
            </div> -->
            <!-- </TransitionGroup> -->
          </div>
        </div>
        <div class="flex-1 p-30px <sm:p-10px dark:bg-v-dark relative">
          <!-- <div class="flex justify-between items-center text-white @2xl:justify-end @xl:justify-end">
          <div class="flex items-center @2xl:hidden @xl:hidden">
            <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
            <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
          </div>

          <div class="flex justify-end items-center space-x-10px">
            <ThemeSwitch />
            <LocaleDropdown class="<xl:text-white dark:text-white" />
          </div>
        </div> -->
          <!-- enter-active-class="animate__animated animate__bounceInRight"表单从右边划出效果 @2xl:max-w-600px @xl:max-w-600px @md:max-w-600px @lg:max-w-600px -->
          <Transition appear>
            <div
              style="
                background-color: rgb(255, 255, 255, 0);
                display: flex;
                align-items: center;
                justify-content: center;
              "
              class="h-full m-auto w-[100%]"
            >
              <div style="flex: 1"></div>
              <div style="flex: 1; padding-top: 85px">
                <LoginForm
                  v-if="isLogin"
                  class="h-auto m-auto flex item-center"
                  @to-register="toRegister"
                  style="width: 56%"
                />
                <RegisterForm v-else class="h-auto m-auto" @to-login="toLogin" style="" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
// @prefix-cls: ~'@{namespace}-login';
// .@{prefix-cls} {
//   &__left {
//     &::before {
//       position: absolute;
//       top: 0;
//       left: 0;
//       z-index: -1;
//       width: 100%;
//       height: 100%;
//       background-image: url('@/assets/aimg/bg.png');
//       background-position: center;
//       background-repeat: no-repeat;
//       content: '';
//     }
//   }
// }

.imgbj {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/aimg/bg.png');
  background-position: center;
  background-repeat: no-repeat;
  // background-size: 100%;
  display: compact;
  background-size: cover;
  // background-attachment: fixed;
}

// ::v-deep(.m-auto) {
//   margin-right: 100px;
// }
::v-deep(.dark\:border-1) {
  border-width: 0px;
}

::v-deep(.el-input--large .el-input__inner) {
  width: 60px;
}
::v-deep(element.style) {
  padding-right: 10px;
  padding-left: 139px;
}
</style>
