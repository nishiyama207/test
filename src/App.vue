<template>
  <div id="app">
    <MapComponent />
  </div>
    <!-- CheckboxControls コンポーネントをインクルード -->
    <!-- <CheckboxControls
      :pointLayerVisible="pointLayerVisible"
      :lineLayerVisible="lineLayerVisible"
      :polygonLayerVisible="polygonLayerVisible"
      :vectorLayerVisible="vectorLayerVisible"
      @checkbox-change="handleCheckboxChange"
    />
   -->
</template>

<script lang="ts">
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
  import { OSM, Vector as VectorSource } from 'ol/source';
  import { defineComponent,ref } from 'vue';
  import MapComponent from './components/MapComponent.vue';
//   import Controls from './components/Controls.vue';
//   const { pointLayerVisible, lineLayerVisible, polygonLayerVisible, vectorLayerVisible } = defineProps(['pointLayerVisible', 'lineLayerVisible', 'polygonLayerVisible', 'vectorLayerVisible']);


//   const source = new VectorSource({ wrapX: false });
//   const PointSource = new VectorSource({ wrapX: false });
//   const LineSource = new VectorSource({ wrapX: false });
//   const PolygonSource = new VectorSource({ wrapX: false });
//   const vector = new VectorLayer({ source: source, });
//   const PointLayer = new VectorLayer({ source: PointSource, });
//   const LineLayer = new VectorLayer({ source: LineSource, });
//   const PolygonLayer = new VectorLayer({ source: PolygonSource, });

  
// // CheckboxControls から発火されたイベントをハンドル
// function handleCheckboxChange(payload) {
//   PointLayer.setVisible(payload.pointLayerVisible);
//   LineLayer.setVisible(payload.lineLayerVisible);
//   PolygonLayer.setVisible(payload.polygonLayerVisible);
//   if (!payload.vectorLayerVisible) {
//     PointLayer.setVisible(false);
//     LineLayer.setVisible(false);
//     PolygonLayer.setVisible(false);
//   }
// }

export default defineComponent({
  name: 'App',
  components: {
    MapComponent,
    //Controls
  },
  // setup() {
  //   const pointLayerVisible = ref(true);
  //   const lineLayerVisible = ref(true);
  //   const polygonLayerVisible = ref(true);
  //   const vectorLayerVisible = ref(true);

  //   // CheckboxControls から発火されたイベントをハンドル
  //   function handleCheckboxChange(payload) {
  //     pointLayerVisible.value = payload.pointLayerVisible;
  //     lineLayerVisible.value = payload.lineLayerVisible;
  //     polygonLayerVisible.value = payload.polygonLayerVisible;
  //     vectorLayerVisible.value = payload.vectorLayerVisible;
  //   }

  //   return {
  //     pointLayerVisible,
  //     lineLayerVisible,
  //     polygonLayerVisible,
  //     vectorLayerVisible,
  //     handleCheckboxChange
  //   };
  // }
});


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
