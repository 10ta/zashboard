import {
  disconnectByIdAPI,
  fetchProxiesAPI,
  fetchProxyGroupLatencyAPI,
  fetchProxyLatencyAPI,
  selectProxyAPI,
} from '@/api'
import type { Proxy } from '@/types'
import { last } from 'lodash'
import { ref } from 'vue'
import { speedtestTimeout, speedtestUrl } from './config'
import { activeConnections } from './connections'

export const GLOBAL = 'GLOBAL'
export const proxyGroups = ref<string[]>([])
export const proxyMap = ref<Record<string, Proxy>>({})
export const latencyMap = ref<Record<string, number>>({})

export const getLatencyByName = (proxyName: string) => {
  return latencyMap.value[getNowProxyNodeName(proxyName)]
}

export const fetchProxies = async () => {
  const { data } = await fetchProxiesAPI()
  const sortIndex = data.proxies[GLOBAL].all ?? []

  proxyMap.value = data.proxies
  proxyGroups.value = Object.values(data.proxies)
    .filter((proxy) => proxy.all?.length && proxy.name !== GLOBAL)
    .sort((prev, next) => sortIndex.indexOf(prev.name) - sortIndex.indexOf(next.name))
    .map((proxy) => proxy.name)

  latencyMap.value = Object.fromEntries(
    Object.entries(data.proxies).map(([name, proxy]) => [name, getLatencyFromHistory(proxy)]),
  )
}

export const selectProxy = async (proxyGroup: string, name: string) => {
  await selectProxyAPI(proxyGroup, name)
  proxyMap.value[proxyGroup].now = name
  activeConnections.value
    .filter((c) => c.chains.includes(proxyGroup))
    .forEach((c) => disconnectByIdAPI(c.id))
}

export const proxyLatencyTest = async (proxyName: string) => {
  const { data: latencyResult } = await fetchProxyLatencyAPI(
    proxyName,
    speedtestUrl.value,
    speedtestTimeout.value,
  )

  latencyMap.value[getNowProxyNodeName(proxyName)] = latencyResult.delay
}

export const proxyGroupLatencyTest = async (proxyGroupName: string) => {
  const { data: latencyResult } = await fetchProxyGroupLatencyAPI(
    proxyGroupName,
    speedtestUrl.value,
    speedtestTimeout.value,
  )

  Object.entries(latencyResult).forEach(([name, latency]) => {
    latencyMap.value[getNowProxyNodeName(name)] = latency
  })
}

const getLatencyFromHistory = (proxy: Proxy) => {
  return last(proxy.history)?.delay ?? 0
}

const getNowProxyNodeName = (name: string) => {
  let node = proxyMap.value[name]

  if (!name || !node) {
    return name
  }

  while (node.now && node.now !== node.name) {
    const nextNode = proxyMap.value[node.now]

    if (!nextNode) {
      return node.name
    }

    node = nextNode
  }

  return node.name
}
