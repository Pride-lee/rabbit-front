<template>
  <van-sticky ref="stickyRef">
  </van-sticky>
  <div class="container">
    <router-view #="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  <van-tabbar ref="tabbarRef" route>
    <template v-for="item in main" :key="item.name">
      <van-tabbar-item :to="item.path" :icon="item.meta?.icon">
        {{ item.meta?.title }}
      </van-tabbar-item>
    </template>
  </van-tabbar>
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { Sticky, Tabbar } from 'vant';
  import { main } from '@/router/modules/main';

  defineOptions({ name: 'Layout' });

  const stickyRef = ref<InstanceType<typeof Sticky>>();
  const tabbarRef = ref<InstanceType<typeof Tabbar>>();
  const containerHeight = ref('');

  nextTick(() => {
    containerHeight.value = `${
      stickyRef.value?.$el?.offsetHeight + tabbarRef.value?.$el.offsetHeight
    }px`;
  });
</script>

<style lang="scss">
  .container {
    --height: v-bind('containerHeight');
    --container-height: calc(100vh - var(--height));

    height: calc(100vh - var(--height));
    overflow: auto;
  }
</style>
