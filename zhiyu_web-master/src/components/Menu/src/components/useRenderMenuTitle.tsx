import type { RouteMeta } from 'vue-router'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta: RouteMeta) => {
    const { t } = useI18n()
    const { title = 'Please set title', icon } = meta

    return icon ? icon != '#' ? (
      <>
        <Icon icon={meta.icon}></Icon>
        <span class="v-menu__title">{t(title as string)}</span>
      </>
    ) : (
      <span class="v-menu__title" style="padding-left: 10px">{t(title as string)}</span>
    ) : (
      <>
        <Icon icon='ant-design:home-outlined'></Icon>
        <span class="v-menu__title">{t(title as string)}</span>
      </>
    )
  }

  return {
    renderMenuTitle
  }
}
