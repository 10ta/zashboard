import {
  CONNECTIONS_TABLE_ACCESSOR_KEY,
  DETAILED_CARD_STYLE,
  FONTS,
  GLOBAL,
  IP_INFO_API,
  LANG,
  PROXY_CARD_SIZE,
  PROXY_CHAIN_DIRECTION,
  PROXY_COUNT_MODE,
  PROXY_PREVIEW_TYPE,
  PROXY_SORT_TYPE,
  TABLE_SIZE,
  TABLE_WIDTH_MODE,
  TEST_URL,
  type THEME,
} from '@/constant'
import { getMinCardWidth, isMiddleScreen, isPreferredDark } from '@/helper/utils'
import type { SourceIPLabel } from '@/types'
import { useStorage } from '@vueuse/core'
import { isEmpty } from 'lodash'
import { v4 as uuid } from 'uuid'
import { computed } from 'vue'

// global
const themeOld = useStorage<string>('config/theme', 'default')
const isDefault = themeOld.value === 'default'

export const defaultTheme = useStorage<string>(
  'config/default-theme',
  isDefault ? 'dark' : themeOld.value,
)
export const darkTheme = useStorage<string>('config/dark-theme', 'dark')
export const autoTheme = useStorage<boolean>('config/auto-theme', false)

const replaceLegacyTheme = (theme: string) => {
  if (theme === 'light-daisyui-v5') {
    return 'light'
  }

  if (theme === 'dark-daisyui-v5') {
    return 'dark'
  }

  return theme
}

defaultTheme.value = replaceLegacyTheme(defaultTheme.value)
darkTheme.value = replaceLegacyTheme(darkTheme.value)

export const theme = computed(() => {
  if (autoTheme.value && isPreferredDark.value) {
    return darkTheme.value
  }
  return defaultTheme.value
})

export const customThemes = useStorage<THEME[]>('config/custom-themes', [])

export const language = useStorage<LANG>(
  'config/language',
  Object.values(LANG).includes(navigator.language as LANG)
    ? (navigator.language as LANG)
    : LANG.EN_US,
)
export const isSidebarCollapsedConfig = useStorage('config/is-sidebar-collapsed', false)
export const isSidebarCollapsed = computed({
  get: () => {
    if (isMiddleScreen.value) {
      return true
    }

    return isSidebarCollapsedConfig.value
  },
  set: (value) => {
    isSidebarCollapsedConfig.value = value
  },
})
export const font = useStorage<FONTS>('config/font', FONTS.PING_FANG)
export const customBackgroundURL = useStorage(
  'config/custom-background-image',
  'https://a.f22a.net/get-image/zash.jpg',
)
export const dashboardTransparent = useStorage('config/dashboard-transparent', 75)
export const autoUpgrade = useStorage('config/auto-upgrade', false)
export const checkUpgradeCore = useStorage('config/check-upgrade-core', true)
export const autoUpgradeCore = useStorage('config/auto-upgrade-core', false)
export const swipeInPages = useStorage('config/swipe-in-pages', true)
export const swipeInTabs = useStorage('config/swipe-in-tabs', false)
export const disablePullToRefresh = useStorage('config/disable-pull-to-refresh', true)
export const displayAllFeatures = useStorage('config/display-all-features', true)
export const blurIntensity = useStorage('config/blur-intensity', 20)
export const scrollAnimationEffect = useStorage('config/scroll-animation-effect', true)
export const IPInfoAPI = useStorage('config/geoip-info-api', IP_INFO_API.IPSB)
export const autoDisconnectIdleUDP = useStorage('config/auto-disconnect-idle-udp', false)
export const autoDisconnectIdleUDPTime = useStorage('config/auto-disconnect-idle-udp-time', 300)

// overview
export const splitOverviewPage = useStorage('config/split-overview-page', true)
export const showIPAndConnectionInfo = useStorage('config/show-ip-and-connection-info', true)
export const autoIPCheck = useStorage('config/auto-ip-check', true)
export const autoConnectionCheck = useStorage('config/auto-connection-check', true)
export const showStatisticsWhenSidebarCollapsed = useStorage(
  'config/show-statistics-when-sidebar-collapsed',
  true,
)
export const numberOfChartsInSidebar = useStorage<1 | 2 | 3>(
  'config/number-of-charts-in-sidebar',
  3,
)
export const displayProxiesRelationship = useStorage('config/display-proxies-relationship', true)

// proxies
export const collapseGroupMap = useStorage<Record<string, boolean>>('config/collapse-group-map', {})
export const twoColumnProxyGroup = useStorage('config/two-columns', false)
export const speedtestUrl = useStorage<string>('config/speedtest-url', TEST_URL)
export const independentLatencyTest = useStorage('config/independent-latency-test', false)
export const speedtestTimeout = useStorage<number>('config/speedtest-timeout', 5000)
export const proxySortType = useStorage<PROXY_SORT_TYPE>(
  'config/proxy-sort-type',
  PROXY_SORT_TYPE.DEFAULT,
)
export const automaticDisconnection = useStorage('config/automatic-disconnection', true)
export const truncateProxyName = useStorage('config/truncate-proxy-name', false)
export const proxyPreviewType = useStorage('config/proxy-preview-type', PROXY_PREVIEW_TYPE.DOTS)
export const hideUnavailableProxies = useStorage('config/hide-unavailable-proxies', false)
export const lowLatency = useStorage('config/low-latency', 400)
export const mediumLatency = useStorage('config/medium-latency', 800)
export const IPv6test = useStorage('config/ipv6-test', false)
export const proxyCardSize = useStorage<PROXY_CARD_SIZE>(
  'config/proxy-card-size',
  PROXY_CARD_SIZE.LARGE,
)
export const minProxyCardWidth = useStorage<number>(
  'config/min-proxy-card-width',
  getMinCardWidth(proxyCardSize.value),
)
export const manageHiddenGroup = useStorage('config/manage-hidden-group-mode', false)

export const displayGlobalByMode = useStorage('config/display-global-by-mode', false)
export const customGlobalNode = useStorage('config/custom-global-node-name', GLOBAL)

const iconSize = useStorage('config/icon-size', 14)
export const proxyGroupIconSize = useStorage('config/proxy-group-icon-size', iconSize.value + 4)
export const proxyGroupIconMargin = useStorage('config/proxy-group-icon-margin', 6)
export const proxyCountMode = useStorage('config/proxies-count-mode', PROXY_COUNT_MODE.ALIVE_TOTAL)
export const iconReflectList = useStorage<
  {
    icon: string
    name: string
    uuid: string
  }[]
>('config/icon-reflect-list', [])
export const groupProxiesByProvider = useStorage('config/group-proxies-by-provider', false)
export const useSmartGroupSort = useStorage('config/use-smart-group-sort', false)

// connections
export const useConnectionCard = useStorage('config/use-connecticon-card', window.innerWidth < 640)
export const proxyChainDirection = useStorage(
  'config/proxy-chain-direction',
  PROXY_CHAIN_DIRECTION.NORMAL,
)
export const tableSize = useStorage<TABLE_SIZE>('config/connecticon-table-size', TABLE_SIZE.SMALL)
export const tableWidthMode = useStorage('config/table-width-mode', TABLE_WIDTH_MODE.AUTO)
export const connectionTableColumns = useStorage<CONNECTIONS_TABLE_ACCESSOR_KEY[]>(
  'config/connection-table-columns',
  [
    CONNECTIONS_TABLE_ACCESSOR_KEY.Close,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Host,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Type,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Rule,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Chains,
    CONNECTIONS_TABLE_ACCESSOR_KEY.DlSpeed,
    CONNECTIONS_TABLE_ACCESSOR_KEY.UlSpeed,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Download,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Upload,
    CONNECTIONS_TABLE_ACCESSOR_KEY.ConnectTime,
  ],
)
export const connectionCardLines = useStorage<CONNECTIONS_TABLE_ACCESSOR_KEY[][]>(
  'config/connection-card-lines',
  DETAILED_CARD_STYLE,
)

const filterLegacyDetailsOpt = (key: string) => key !== 'details'
const replaceLegacyKey = (key: string) => {
  if (key === 'transferType') {
    return CONNECTIONS_TABLE_ACCESSOR_KEY.DestinationType
  }

  if (key === 'proxyNodeAddress') {
    return CONNECTIONS_TABLE_ACCESSOR_KEY.RemoteAddress
  }

  return key as CONNECTIONS_TABLE_ACCESSOR_KEY
}

connectionTableColumns.value = connectionTableColumns.value
  .filter(filterLegacyDetailsOpt)
  .map(replaceLegacyKey)
connectionCardLines.value = connectionCardLines.value.map((lines) =>
  lines.filter(filterLegacyDetailsOpt).map(replaceLegacyKey),
)

const sourceIPLabelMap = useStorage<Record<string, string>>('config/source-ip-label-map', {})

export const sourceIPLabelList = useStorage<SourceIPLabel[]>('config/source-ip-label-list', () => {
  const oldMap = sourceIPLabelMap.value

  if (isEmpty(oldMap)) {
    return []
  }

  return Object.entries(oldMap)
    .sort((prev, next) => prev[0].localeCompare(next[0]))
    .map(([key, label]) => ({ key, label, id: uuid() }))
})

// rules
export const displayNowNodeInRule = useStorage('config/display-now-node-in-rule', true)
export const displayLatencyInRule = useStorage('config/display-latency-in-rule', true)

// logs
export const logRetentionLimit = useStorage<number>('config/log-retention-limit', 1000)
export const logSearchHistory = useStorage<string[]>('config/log-search-history', [])
