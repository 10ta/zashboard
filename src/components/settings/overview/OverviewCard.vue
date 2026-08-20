<template>
  <SettingItem :setting-key="OVERVIEW_ITEM_KEYS.chartsCard">
    <div class="setting-item-label">
      {{ $t('chartsCard') }}
      <span class="setting-item-summary">{{ $t('overviewCardVisibilityDescription') }}</span>
    </div>
    <input
      v-model="chartsCardVisible"
      type="checkbox"
      class="toggle"
    />
  </SettingItem>
  <SettingItem :setting-key="OVERVIEW_ITEM_KEYS.networkCard">
    <div class="setting-item-label">
      {{ $t('networkCard') }}
      <span class="setting-item-summary">{{ $t('overviewCardVisibilityDescription') }}</span>
    </div>
    <input
      v-model="networkCardVisible"
      type="checkbox"
      class="toggle"
    />
  </SettingItem>
</template>

<script setup lang="ts">
import SettingItem from '@/components/settings/SettingItem.vue'
import { OVERVIEW_ITEM_KEYS } from '@/config/settingsItems'
import { OVERVIEW_CARD } from '@/constant'
import { overviewCardOrder } from '@/store/settings'
import { computed } from 'vue'

const cardVisibility = (card: OVERVIEW_CARD) =>
  computed({
    get: () => overviewCardOrder.value.find((item) => item.card === card)?.visible ?? false,
    set: (visible: boolean) => {
      const item = overviewCardOrder.value.find((entry) => entry.card === card)
      if (item) item.visible = visible
    },
  })

const chartsCardVisible = cardVisibility(OVERVIEW_CARD.ChartsCard)
const networkCardVisible = cardVisibility(OVERVIEW_CARD.NetworkCard)
</script>
