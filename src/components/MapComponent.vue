<template>
  <div>
    <div id="map" class="map"></div>
    <label for="type">Draw type:</label>
    <select id="type" v-model="selectedType" @change="changeDrawType">
      <option value="Point">Point</option>
      <option value="LineString">LineString</option>
      <option value="Polygon">Polygon</option>
    </select>
    <button class="btn btn-light" id="remove">remove</button>
    <div>
      <input type="checkbox" id="pointlayer" v-model="pointLayerVisible"> Point
      <input type="checkbox" id="linelayer" v-model="lineLayerVisible"> LineString
      <input type="checkbox" id="polygonlayer" v-model="polygonLayerVisible"> Polygon
      <br>
      <input type="checkbox" id="vectorlayer" v-model="vectorLayerVisible"> Vector
    </div>
    <div id="attributes-table">
      <table><tbody>
      <tr>
        <td>ID: <input type="text" id="idInput" :value="selectedFeatures[0]?.id" /></td>
        <td>Name: <input type="text" id="nameInput" :value="selectedFeatures[0]?.name" /></td>
        <td>Date: <input type="text" id="dateInput" :value="selectedFeatures[0]?.inpDate" /></td>
      </tr>
      </tbody></table>
    </div>
    <button class="btn btn-light" id="saveButton" >保存</button>
  </div>
</template>
  
<script setup>
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
  import { Draw, Modify, Snap, Select } from 'ol/interaction';
  import { OSM, Vector as VectorSource } from 'ol/source';
  import { ref, onMounted, watch, computed, reactive, watchEffect } from 'vue';
  import { get as getProjection } from 'ol/proj';
  //import Feature from 'ol/Feature';
  import { Collection } from 'ol';
  import View from 'ol/View';
  import Map from 'ol/Map';
  
  const selectedType = ref('Point');
  let map;
  let draw;
  let snap;
  const source = new VectorSource({ wrapX: false });
  const source1 = new VectorSource({ wrapX: false });
  const source2 = new VectorSource({ wrapX: false });
  const source3 = new VectorSource({ wrapX: false });
  const pointLayerVisible = ref(true);
  const lineLayerVisible = ref(true);
  const polygonLayerVisible = ref(true);
  const vectorLayerVisible = ref(true);
  let select;
  const selectedFeatures = ref([]); // 選択されたフィーチャとその属性を格納する配列
  const idInput = ref('');
  const nameInput = ref('');
  const dateInput = ref('');

  onMounted(() => {
    // OpenStreetMapから地図タイルを表示する
    const raster = new TileLayer({
      source: new OSM(),
    });
    
    // ベクタデータを表示するためのソースとレイヤ
    const vector = new VectorLayer({ source: source, });
    const vector1 = new VectorLayer({ source: source1, });
    const vector2 = new VectorLayer({ source: source2, });
    const vector3 = new VectorLayer({ source: source3, });
    
    // mapを作成
    const extent = getProjection('EPSG:3857').getExtent().slice();
    extent[0] += extent[0];
    extent[2] += extent[2];
  
    map = new Map({
      layers: [raster,vector1,vector2,vector3,vector,],
      target: 'map',
      view: new View({
        center: [-11000000, 4600000],
        zoom: 4,
        extent: extent,
      }),
    });

    // 選択中の図形
    select = new Select({
      layers: [vector1,vector2,vector3],
      features: new Collection(source.getFeatures()),
    });
    // 属性表示
    select.on('select', (event) => {
      const selected = event.target.getFeatures().getArray();
      selectedFeatures.value = selected.map(feature => feature.getProperties());
    });

  // 保存ボタンがクリックされたときの処理
  const onSaveButtonClick = () => {
    console.log('selectedFeatures:', selectedFeatures.value);
    const idInput = document.getElementById('idInput');
    const nameInput = document.getElementById('nameInput');
    const dateInput = document.getElementById('dateInput');
    const id = idInput.value;
    const name = nameInput.value;
    const inpDate = dateInput.value;
    selectedFeatures.value.forEach((feature) => {
      feature.id = id;
      feature.name = name;
      feature.inpDate = inpDate;
      console.log('name:', feature.name);
    });
  };

    // 初期Point
    addInteraction();

    document.getElementById('saveButton').onclick = onSaveButtonClick;


    // 編集
    const modify1 = new Modify({source: source1});
    map.addInteraction(modify1);
    const modify2 = new Modify({source: source2});
    map.addInteraction(modify2);
    const modify3 = new Modify({source: source3});
    map.addInteraction(modify3);

    map.addInteraction(select);


    // レイヤ表示切替
    watch([pointLayerVisible, lineLayerVisible, polygonLayerVisible], () => {
      vector1.setVisible(pointLayerVisible.value);
      vector2.setVisible(lineLayerVisible.value);
      vector3.setVisible(polygonLayerVisible.value);
    });
    watch(vectorLayerVisible, (newVal) => {
      vector1.setVisible(newVal && pointLayerVisible.value);
      vector2.setVisible(newVal && lineLayerVisible.value);
      vector3.setVisible(newVal && polygonLayerVisible.value);
    });
    
  });
  // onMounted終わり

  // セレクトボックスが変更されたら
  watch(selectedType, () => {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteraction();
  });
  // watch関数:特定のリアクティブ変数の変更を監視する

  let nextid = 1; // 次のid

  function addInteraction() {
    // 以前の描画とスナップのインタラクションを削除
    map.removeInteraction(draw);
    map.removeInteraction(snap);

    // 描画オプションの設定
    const drawOptions = {
      source: null,
      type: selectedType.value,
    };
    // 選択された図形の種類に応じてソースを設定
    if (selectedType.value === 'Point') {
      drawOptions.source = source1;
    } else if (selectedType.value === 'LineString') {
      drawOptions.source = source2;
    } else if (selectedType.value === 'Polygon') {
      drawOptions.source = source3;
    }

    // Draw インスタンスを作成
    draw = new Draw(drawOptions);

    // 描画が終わったら
    draw.on('drawend', (event) => {
      // 属性追加
      const feature = event.feature;
      const id = nextid++;
      const name = 'name';
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const inpDate = formattedDate;
      feature.setProperties({
        id: id,
        name: name,
        inpDate: inpDate,
      });
      map.removeInteraction(draw);
      map.removeInteraction(snap);
      addInteraction();
    });

    map.addInteraction(draw);
    snap = new Snap({ source: drawOptions.source });
    map.addInteraction(snap);

    // sourceを設定
    drawOptions.source.on('addfeature', (event) => {
      const feature = event.feature;
      feature.set('source', drawOptions.source);
    });

    // 削除
    document.getElementById('remove').onclick = function (event) {
      event.preventDefault();
      const selectedFeatures = select?.getFeatures();
      if (selectedFeatures) {
        const feature = selectedFeatures.item(0);
        const featureSource = feature.get('source');
        if (featureSource) {
          featureSource.removeFeature(feature);
        }
        selectedFeatures.clear();
      }
    };
  }
  // addInteraction終わり
</script>
  
<style>
  .map {
    width: 100%;
    height: 600px;
  }
</style>
