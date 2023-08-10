<template>
  <div>
    <div id="map" class="map"></div>
    <label for="type">Draw type:</label>
    <select id="type" v-model="selectedType">
      <option value="Point">Point</option>
      <option value="LineString">LineString</option>
      <option value="Polygon">Polygon</option>
    </select>
    <button class="btn btn-light" @click="removeSelectedFeature">削除</button>
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
        <td>ID: <input type="text" id="idInput" v-model="idInput" /></td>
        <td>Name: <input type="text" id="nameInput" v-model="nameInput"  /></td>
        <td>Date: <input type="text" id="dateInput" v-model="dateInput"  /></td>
      </tr>
      </tbody></table>
    </div>
    <button class="btn btn-light" @click="saveAttributes">保存</button>
  </div>
</template>
  
<script setup lang="ts">
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
  import { Draw, Modify, Snap, Select } from 'ol/interaction';
  import { OSM, Vector as VectorSource } from 'ol/source';
  import { ref, onMounted, watch, computed } from 'vue';
  import { Collection } from 'ol';
  import View from 'ol/View';
  import Map from 'ol/Map';
  import Feature from 'ol/Feature'
  import { altKeyOnly, click } from "ol/events/condition";

  // ---------------------------------------------------------------------
  // map系
  // ---------------------------------------------------------------------
  let draw :Draw;
  let snap :Snap;
  const source = new VectorSource({ wrapX: false });
  const PointSource = new VectorSource({ wrapX: false });
  const LineSource = new VectorSource({ wrapX: false });
  const PolygonSource = new VectorSource({ wrapX: false });
  const vector = new VectorLayer({ source: source, });
  const PointLayer = new VectorLayer({ source: PointSource, });
  const LineLayer = new VectorLayer({ source: LineSource, });
  const PolygonLayer = new VectorLayer({ source: PolygonSource, });
  let select :Select;
  let nextid = 1; // 次のid

  // OpenStreetMapから地図タイルを表示する
  const raster = new TileLayer({
    source: new OSM(),
  });

  // mapを作成
  const  map = new Map({
    layers: [raster,PointLayer,LineLayer,PolygonLayer,vector,],
    // target: 'map',
    view: new View({
      center: [-11000000, 4600000],
      zoom: 4,
    }),
  });

  // ---------------------------------------------------------------------
  // state
  // ---------------------------------------------------------------------
  const selectedType = ref<'Point'|'LineString'|'Polygon'>('Point');  
  const pointLayerVisible = ref<boolean>(true);
  const lineLayerVisible = ref<boolean>(true);
  const polygonLayerVisible = ref<boolean>(true);
  const vectorLayerVisible = ref<boolean>(true);  
  const selectedFeatures = ref<Feature[]>([]);
  const idInput = ref<string>('')
  const nameInput = ref<string>('')
  const dateInput = ref<string>('')
  
  // ---------------------------------------------------------------------
  // computed
  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------
  // 関数系
  // ---------------------------------------------------------------------
    /**
   *  drawendのEvent用関数
   *
   *  選択した図形を削除する
   *  @param e DrawEvent
   *  @return {void}
   */
  function removeSelectedFeature() {
    const selectedFeatures = select?.getFeatures();
    if (selectedFeatures.getLength() > 0) {
      const feature = selectedFeatures.item(0);
      const featureSource = feature.get('source');
      featureSource.removeFeature(feature);
      selectedFeatures.clear();
    }
  }

    /**
   *  drawendのEvent用関数
   *
   *  属性情報を更新する
   *  @param e DrawEvent
   *  @return {void}
   */
   function saveAttributes() {
      const id = idInput.value;
      const name = nameInput.value;
      const inpDate = dateInput.value;

      selectedFeatures.value.forEach((feature) => {
        feature.setProperties({
          id: id,
          name: name,
          inpDate: inpDate,
        });
      });
    }

   /**
   *  drawendのEvent用関数
   *
   *  インタラクション追加
   *  @param e DrawEvent
   *  @return {void}
   */
  function addInteraction() {
    // 以前の描画とスナップのインタラクションを削除
    map.removeInteraction(draw);
    map.removeInteraction(snap);

    // 描画オプションの設定
    const drawOptions = {
      source: source, // 仮
      type: selectedType.value,
    };
    // 選択された図形の種類に応じてソースを設定
    if (selectedType.value === 'Point') {
      drawOptions.source = PointSource;
    } else if (selectedType.value === 'LineString') {
      drawOptions.source = LineSource;
    } else if (selectedType.value === 'Polygon') {
      drawOptions.source = PolygonSource;
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
      feature?.set('source', drawOptions.source);
    });

  }
  // ---------------------------------------------------------------------
  // ライフサイクルフック系
  // ---------------------------------------------------------------------
  
  // watch関数:特定のリアクティブ変数の変更を監視する
  // レイヤ表示切替
  watch([pointLayerVisible, lineLayerVisible, polygonLayerVisible], () => {
    PointLayer.setVisible(pointLayerVisible.value);
    LineLayer.setVisible(lineLayerVisible.value);
    PolygonLayer.setVisible(polygonLayerVisible.value);
  });

  // vectorLayerVisible チェックボックスがオンの場合、各レイヤーの表示状態も連動して切り替わる
  watch(vectorLayerVisible, (newVal) => {
    if (newVal) {
      PointLayer.setVisible(pointLayerVisible.value);
      LineLayer.setVisible(lineLayerVisible.value);
      PolygonLayer.setVisible(polygonLayerVisible.value);
    } else {
      PointLayer.setVisible(false);
      LineLayer.setVisible(false);
      PolygonLayer.setVisible(false);
    }
  });

  // セレクトボックスが変更されたら
  watch(selectedType, () => {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteraction();
  });

  // selectedFeaturesの変更を監視して、属性情報を図形に反映する
  watch(selectedFeatures, () => {
    selectedFeatures.value.forEach((feature) => {
      feature.setProperties({
        id: idInput.value,
        name: nameInput.value,
        inpDate: dateInput.value,
      });
    });
  });
  

  onMounted(() => {
    map.setTarget("map");

    // 初期Point
    addInteraction();

    // 選択
    select = new Select({
      layers: [PointLayer,LineLayer,PolygonLayer],
      features: new Collection(source.getFeatures()),
      condition: (mapBrowserEvent) => {
      return click(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
    },
    });

    // 選択中の図形を取得し、属性情報をテキストボックスにセットする
    select.on('select', (event) => {
      const selectedFeature = event.target.getFeatures().getArray()[0]; // 選択された最初の図形を取得
      if (selectedFeature) {
        idInput.value = selectedFeature.get('id') ;
        nameInput.value = selectedFeature.get('name') ;
        dateInput.value = selectedFeature.get('inpDate') ;
      }
    });

    // 編集
    // const modify1 = new Modify({source: PointSource});
    // map.addInteraction(modify1);
    // const modify2 = new Modify({source: LineSource});
    // map.addInteraction(modify2);
    // const modify3 = new Modify({source: PolygonSource});
    // map.addInteraction(modify3);

    map.addInteraction(select);
    
  });

</script>
<style>
  .map {
    width: 100%;
    height: 600px;
  }
</style>
