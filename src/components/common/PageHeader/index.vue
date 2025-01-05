<template>
  <div class="page-header">
    <div class="left">
      <h2 class="title">{{ title }}</h2>
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
  }
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #1f2f3d;
}
</style> 