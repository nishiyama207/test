<template>
  <div id="app">
    <MapComponent />
    <!-- <ControlsComponent /> -->
  </div>
    <!-- <ControlsComponent
      :pointLayerVisible="pointLayerVisible"
      :lineLayerVisible="lineLayerVisible"
      :polygonLayerVisible="polygonLayerVisible"
      :vectorLayerVisible="vectorLayerVisible"
    /> -->
  
   <div>
  </div>
</template>

<script lang="ts">
  import { defineComponent,ref } from 'vue';
  import MapComponent from './components/MapComponent.vue';
  //import ControlsComponent from './components/ControlsComponent.vue';
//   const { pointLayerVisible, lineLayerVisible, polygonLayerVisible, vectorLayerVisible } = defineProps(['pointLayerVisible', 'lineLayerVisible', 'polygonLayerVisible', 'vectorLayerVisible']);




export default defineComponent({
  name: 'App',
  components: {
    MapComponent,
    //ControlsComponent
  },

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
