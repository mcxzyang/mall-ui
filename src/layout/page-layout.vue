<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in" enter-from-class="fade-enter" appear>
      <component
        :is="Component"
        v-if="route.meta.ignoreCache"
        :key="route.fullPath"
      />
      <keep-alive v-else :include="cacheList">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useTabBarStore } from '@/store';

  const tabBarStore = useTabBarStore();

  const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less">
  /* 渐变设置 */
  .fade-enter-from,
  .fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }
  .fade-enter-active {
    transition: all 0.7s ease;
  }
  .fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.6, 0.6, 1);
  }
</style>
