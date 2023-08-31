<template>
  <div id="map" class="map"></div>
  <div id="app">
    <div>
      <label for="type">Draw type：</label>
      <select id="type" v-model="selectedType">
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
        <option value="Polygon">Polygon</option>
      </select>
    </div>
    <div>
      <input type="checkbox" id="pointlayer" v-model="pointLayerVisible" /> Point
      <input type="checkbox" id="linelayer" v-model="lineLayerVisible" /> LineString
      <input type="checkbox" id="polygonlayer" v-model="polygonLayerVisible" /> Polygon
      <br />
      <input type="checkbox" id="vectorlayer" v-model="vectorLayerVisible" /> Vector
    </div>
    <MapComponent
      :pointLayerVisible="pointLayerVisible"
      :lineLayerVisible="lineLayerVisible"
      :polygonLayerVisible="polygonLayerVisible"
      :vectorLayerVisible="vectorLayerVisible"
      :selectedType="selectedType"
    />
  </div>
</template>

<script setup lang="ts">
  import { defineComponent,ref } from 'vue';
  import MapComponent from './components/MapComponent.vue';
  import MapControls from './components/MapControls.vue';
  const pointLayerVisible = ref<boolean>(true);
  const lineLayerVisible = ref<boolean>(true);
  const polygonLayerVisible = ref<boolean>(true);
  const vectorLayerVisible = ref<boolean>(true);
  const selectedType = ref<'Point'|'LineString'|'Polygon'>('Point'); 
</script>

<script lang="ts">
  export default {
    components: {
      MapComponent,
      MapControls
    },
    data() {
      return {
      };
    }
  };
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
