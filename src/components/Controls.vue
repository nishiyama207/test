<template>
    <div>
      <input type="checkbox" id="pointlayer" v-model="pointLayerVisible" /> ポイント
      <input type="checkbox" id="linelayer" v-model="lineLayerVisible" /> ライン
      <input type="checkbox" id="polygonlayer" v-model="polygonLayerVisible" /> ポリゴン
      <br />
      <input type="checkbox" id="vectorlayer" v-model="vectorLayerVisible" /> ベクター
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps(['pointLayerVisible', 'lineLayerVisible', 'polygonLayerVisible', 'vectorLayerVisible']);
  const emit = defineEmits();
  
  // チェックボックスの値が変更されたらイベントを発火
  watch([props.pointLayerVisible, props.lineLayerVisible, props.polygonLayerVisible, props.vectorLayerVisible], () => {
    const payload = {
      pointLayerVisible: props.pointLayerVisible,
      lineLayerVisible: props.lineLayerVisible,
      polygonLayerVisible: props.polygonLayerVisible,
      vectorLayerVisible: props.vectorLayerVisible,
    };
    emit('checkbox-change', payload);
  });
  </script>
  