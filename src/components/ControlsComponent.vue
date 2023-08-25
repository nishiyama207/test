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
  import { ref, onMounted, watch, computed } from 'vue';

  

  const pointLayerVisible = ref<boolean>(true);
  const lineLayerVisible = ref<boolean>(true);
  const polygonLayerVisible = ref<boolean>(true);
  const vectorLayerVisible = ref<boolean>(true);  
  
  const props = defineProps(['PointLayer','LineLayer','PolygonLayer','pointLayerVisible', 'lineLayerVisible', 'polygonLayerVisible', 'vectorLayerVisible']);
  // const emit = defineEmits();

  //   // レイヤ表示切替
  //   watch([props.pointLayerVisible, props.lineLayerVisible, props.polygonLayerVisible], () => {
  //   props.PointLayer.setVisible(props.pointLayerVisible.value);
  //   props.LineLayer.setVisible(props.lineLayerVisible.value);
  //   props.PolygonLayer.setVisible(props.polygonLayerVisible.value);
  // });

    // レイヤ表示切替
    watch([pointLayerVisible, lineLayerVisible, polygonLayerVisible], () => {
    props.PointLayer.setVisible(pointLayerVisible.value);
    props.LineLayer.setVisible(lineLayerVisible.value);
    props.PolygonLayer.setVisible(polygonLayerVisible.value);
  });

  // vectorLayerVisible チェックボックスがオンの場合、各レイヤーの表示状態も連動して切り替わる
  watch(props.vectorLayerVisible, (newVal) => {
    if (newVal) {
      props.PointLayer.setVisible(props.pointLayerVisible.value);
      props.LineLayer.setVisible(props.lineLayerVisible.value);
      props.PolygonLayer.setVisible(props.polygonLayerVisible.value);
    } else {
      props.PointLayer.setVisible(false);
      props.LineLayer.setVisible(false);
      props.PolygonLayer.setVisible(false);
    }
  });
  </script>
  