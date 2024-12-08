import { disconnectByIdAPI } from '@/api'
import { LANG } from '@/config'
import {
  fromNow,
  getIPLabelFromMap,
  getProcessFromConnection,
  isLargeScreen,
  prettyBytesHelper,
} from '@/helper'
import { compactConnectionCard, language } from '@/store/settings'
import type { Connection } from '@/types'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import { defineComponent } from 'vue'

export default defineComponent<{
  conn: Connection
}>({
  props: {
    conn: Object,
  },
  name: 'ConnectionCard',
  setup(props, { emit }) {
    return () => {
      const flex1 = <span class="flex-1"></span>
      const host = (
        <span class="w-80 grow break-all text-sm tracking-tight text-primary/80 sm:text-base">
          {props.conn.metadata.host || props.conn.metadata.destinationIP}
          <span class="hidden sm:inline">:{props.conn.metadata.destinationPort}</span>
        </span>
      )
      const download = (
        <div class="badge flex px-1 text-sm text-base-content">
          <ArrowDownIcon class="h-4 w-3" />
          <div class="hidden w-16 text-right sm:inline">
            {prettyBytesHelper(props.conn.download)} |{' '}
          </div>
          <div class="w-20 text-right">{prettyBytesHelper(props.conn.downloadSpeed)}/s</div>
        </div>
      )
      const uploadCompact = (
        <div class="badge hidden px-1 text-sm text-base-content 2xl:flex">
          <ArrowUpIcon class="h-4 w-3" />
          <div class="w-16 text-right">{prettyBytesHelper(props.conn.upload)} | </div>
          <div class="w-20 text-right">{prettyBytesHelper(props.conn.uploadSpeed)}/s</div>
        </div>
      )
      const upload = (
        <div class="badge hidden px-1 text-sm text-base-content lg:flex">
          <ArrowUpIcon class="h-4 w-3" />
          <div class="w-16 text-right">{prettyBytesHelper(props.conn.upload)} | </div>
          <div class="w-20 text-right">{prettyBytesHelper(props.conn.uploadSpeed)}/s</div>
        </div>
      )

      const info = (
        <div class="flex w-12 gap-1">
          <button
            class="btn btn-circle btn-xs"
            onClick={() => emit('info', props.conn)}
          >
            <InformationCircleIcon class="h-4 w-4" />
          </button>
          <button onClick={() => disconnectByIdAPI(props.conn.id)}>
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      )
      const chians = (
        <span class="inline w-56 truncate text-sm">
          {[...props.conn.chains].reverse().join('->')}
        </span>
      )
      const rule = <span class="hidden text-sm tracking-tight xl:inline">{props.conn.rule}</span>
      const processPath = (
        <span class={`hidden min-w-48 px-2 text-sm 2xl:inline`}>
          {getProcessFromConnection(props.conn)}
        </span>
      )
      const startTime = (
        <span
          class={twMerge(
            'inline whitespace-nowrap text-right text-sm tracking-tight',
            language.value === LANG.ZH_CN ? 'w-20' : 'w-32',
          )}
        >
          {fromNow(props.conn.start)}
        </span>
      )
      const type = (
        <span class={`hidden w-36 text-sm lg:inline`}>
          {props.conn.metadata.type} | {props.conn.metadata.network}
        </span>
      )
      const typeCompact = (
        <span class={`hidden w-36 text-sm md:inline`}>
          {props.conn.metadata.type} | {props.conn.metadata.network}
        </span>
      )
      const destination = props.conn.metadata.destinationIP || 'remote-resolve'
      const sourceIP = getIPLabelFromMap(props.conn.metadata.sourceIP)
      const connection = (
        <span class="hidden w-96 truncate text-sm tracking-tight xl:flex">
          <span>
            {sourceIP}:{props.conn.metadata.sourcePort}
          </span>
          <span>-&gt;</span>
          <span>
            {destination}:{props.conn.metadata.destinationPort}
          </span>
        </span>
      )
      const connectionCompact = (
        <span class="hidden w-52 truncate text-sm tracking-tight 3xl:flex">
          <span>{sourceIP}</span>
          <span>-&gt;</span>
          <span>{destination}</span>
        </span>
      )

      if (isLargeScreen.value && compactConnectionCard.value) {
        return (
          <div class="card w-full flex-row items-center justify-between gap-1 px-2 py-1">
            {host}
            {chians}
            {connectionCompact}
            {typeCompact}
            {download}
            {uploadCompact}
            {startTime}
            {info}
          </div>
        )
      } else {
        return (
          <div class="card w-full gap-[1px] px-2 py-[1px]">
            <div class="flex flex-row items-center gap-1 px-1">
              {host}
              {flex1}
              {processPath}
              {connection}
              {download}
              {upload}
            </div>
            <div class="flex flex-row items-center gap-1 px-1">
              {chians}
              {rule}
              {flex1}
              {type}
              {startTime}
              {info}
            </div>
          </div>
        )
      }
    }
  },
})
