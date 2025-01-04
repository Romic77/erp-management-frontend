<template>
  <div class="page-header">
    <div class="left">
      <h2 class="title">{{ title }}</h2>
      <div class="breadcrumb" v-if="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadcrumb" :key="item.path" :to="item.path">
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="right">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  breadcrumb: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;

  .left {
    .title {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    .breadcrumb {
      margin-top: 8px;
    }
  }
}
</style> 