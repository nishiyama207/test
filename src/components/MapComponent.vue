<template>
  <div>
    <div id="map" class="map"></div>
    <label for="type">Draw type </label>
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
        <td>ID: <input type="text" id="idInput" v-model="idInput" :readonly="true" /></td>
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
  import axios from 'axios';
  import GeoJSON from 'ol/format/GeoJSON';
  import { Geometry } from 'ol/geom';
  import Point from 'ol/geom/Point';

  // ---------------------------------------------------------------------
  // map系
  // ---------------------------------------------------------------------
  let draw : Draw ;
  let snap : Snap ;
  const source = new VectorSource({ wrapX: false });
  const PointSource = new VectorSource({ wrapX: false });
  const LineSource = new VectorSource({ wrapX: false });
  const PolygonSource = new VectorSource({ wrapX: false });
  const vector = new VectorLayer({ source: source, });
  const PointLayer = new VectorLayer({ source: PointSource, });
  const LineLayer = new VectorLayer({ source: LineSource, });
  const PolygonLayer = new VectorLayer({ source: PolygonSource, });
  const pointFeatures: Feature<Geometry>[] = [];
  const lineFeatures: Feature<Geometry>[] = [];
  const polygonFeatures: Feature<Geometry>[] = [];
  let select : Select ;
  let selectedFeatures ;
  let selectedFeature : Feature ;
  //let nextid = 1 ; // 次のid
  let delflag = 0 ;

  // OpenStreetMapから地図タイルを表示する
  const raster = new TileLayer({
    source: new OSM(),
  });

  // mapを作成
  const  map = new Map({
    layers: [raster,PointLayer,LineLayer,PolygonLayer,vector],
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
  //const selectedFeatures = ref<Feature[]>([]);
  const idInput = ref<string>('')
  const nameInput = ref<string>('')
  const dateInput = ref<string>('')
  const shapeData = ref<Array<any>>([]); // データを保持するためのリアクティブ変数

  // ---------------------------------------------------------------------
  // computed
  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------
  // 関数系
  // ---------------------------------------------------------------------

    /**
   *  DBからフィーチャ情報を取得して表示
   *  @param e DrawEvent
   *  @return {void}
   */
  async function fetchShapes() {
    console.log('fetchShapesが実行された');
    try {
      const response = await axios.get('http://localhost:5000/api/getshapes');
      shapeData.value = response.data;
      console.log('shapeData.value:', shapeData.value);

      // データを図形の種類ごとに分類
      shapeData.value.features.forEach((feature: { geometry: { type: string; }; }) => {
        const geometryType = feature.geometry.type;
        const Feature = new GeoJSON().readFeature(feature);
        
        if (geometryType === 'Point') {
          pointFeatures.push(Feature);
        } else if (geometryType === 'LineString') {
          lineFeatures.push(Feature);
        } else if (geometryType === 'Polygon') {
          polygonFeatures.push(Feature);
        }
      });

      // 各データソースに図形を追加
      PointSource.clear();
      LineSource.clear();
      PolygonSource.clear();
      PointSource.addFeatures(pointFeatures);
      LineSource.addFeatures(lineFeatures);
      PolygonSource.addFeatures(polygonFeatures);
      
    } catch (error) {
      console.error('フィーチャの表示に失敗しました', error);
    }
  }

    /**
   *  削除ボタンクリックで呼び出す
   *
   *  選択した図形を削除する
   *  @param e DrawEvent
   *  @return {void}
   */
  async function removeSelectedFeature() {
    selectedFeatures = select?.getFeatures();
    if (selectedFeatures.getLength() > 0) {
      const feature = selectedFeatures.item(0);
      const featureSource = feature.get('source');
      // 削除する図形のidを取得
      const id = feature.get('id');
      // 地図上から図形を削除
      featureSource.removeFeature(feature);
      // データベースから図形を削除するリクエストを送信
      try{
        const response = await axios.post(`http://localhost:5000/api/delete`,id)
        console.log('削除に成功しました', response.data);
      }catch(error){
        console.error('削除に失敗しました', error);
      }
      // テキストボックスクリア
      idInput.value = "" ;
      nameInput.value = "" ;
      dateInput.value = "" ;
    }
  }

    /**
   *  保存ボタンクリックで呼び出す
   *
   *  属性情報を更新する
   *  @param e DrawEvent
   *  @return {void}
   */
  function saveAttributes() {
    selectedFeatures = select?.getFeatures();
    selectedFeatures.forEach(async (feature) => {
      feature.setProperties({
        id: idInput.value,
        name: nameInput.value,
        inpDate: dateInput.value,
      });
      // 情報更新
      const attributes = {
        properties: {
            id: idInput.value,
            name: nameInput.value,
            inpDate: dateInput.value,
        }
      };
      try{
        const response = await axios.post(`http://localhost:5000/api/update`,attributes);
        console.log('属性情報更新に成功しました', response.data);
      }catch(error){
        console.error('属性情報更新に失敗しました', error);
      }
      
    });
  }

   /**
   *  修正された図形をDBに反映する
   *  @param e DrawEvent
   *  @return {void}
   */
  async function ModifyEnd(event: { features: { item: (arg0: number) => any; }; }) {
    const modifiedFeature = event.features.item(0); // 修正された図形を取得

    if (modifiedFeature) {
      
      const modifiedGeometry = modifiedFeature.getGeometry();
      //const modifiedProperties = modifiedFeature.getProperties();
      const modifiedProperties = {
        id: modifiedFeature.get('id'),
        name: modifiedFeature.get('name'),
        inpDate: modifiedFeature.get('inpDate'),
      };

      const updateData = {
        geometryType: modifiedGeometry.getType(),
        geometry: modifiedGeometry.getCoordinates(), 
        properties: modifiedProperties, 
      };

      // データベースに更新リクエストを送信
      try {
        const response = await axios.post(`http://localhost:5000/api/updateShape`, updateData);
        console.log('フィーチャの修正を登録しました', response.data);
      } catch (error) {
        console.error('フィーチャの修正を登録できませんでした', error);
      }
    }
  }

     /**
   *  図形を修正可能にする
   *  @param e DrawEvent
   *  @return {void}
   */
  function modityFeatures(){
    const modifyPoint = new Modify({source: PointSource});
    map.addInteraction(modifyPoint);
    const modifyLine = new Modify({source: LineSource});
    map.addInteraction(modifyLine);
    const modifyPolygon = new Modify({source: PolygonSource});
    map.addInteraction(modifyPolygon);

    modifyPoint.on('modifyend', ModifyEnd);
    modifyLine.on('modifyend', ModifyEnd);
    modifyPolygon.on('modifyend', ModifyEnd);
  }

     /**
   *  選択された図形の属性情報をテキストボックスにセットする
   *  @param e DrawEvent
   *  @return {void}
   */
  function handleSelection(event: { target: { getFeatures: () => { (): any; new(): any; getArray: { (): Feature<Geometry>[]; new(): any; }; }; }; }){
      selectedFeature = event.target.getFeatures().getArray()[0]; // 選択された最初の図形を取得
      console.log('select:',selectedFeature)
      if (selectedFeature) {
        idInput.value = selectedFeature.get('id') ;
        nameInput.value = selectedFeature.get('name') ;
        dateInput.value = selectedFeature.get('inpDate') ;
      }
  }

     /**
   *  選択可能にする
   *  @param e DrawEvent
   *  @return {void}
   */
  function setSelect(){
    select = new Select({
      layers: [PointLayer,LineLayer,PolygonLayer],
      features: new Collection(source.getFeatures()),
      condition: (mapBrowserEvent) => {
      return click(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
    },
    });
  }

   /**
   *  インタラクション追加
   *  @param e DrawEvent
   *  @return {void}
   */
   function addInteraction() {
    console.log('addInteractionが実行された');

    map.removeInteraction(draw);
    map.removeInteraction(snap);

    const drawOptions = {
      source: source,
      type: selectedType.value,
    };

    drawOptions.source.on('addfeature', event => {
      const feature = event.feature;
      feature?.set('source', drawOptions.source);
      if (feature && delflag === 1)
      drawOptions.source.removeFeature(feature);
      delflag = 0;
    });

    draw = new Draw(drawOptions);
    draw.on('drawend', handleDrawEnd);

    map.addInteraction(draw);
    snap = new Snap({ source: drawOptions.source });
    map.addInteraction(snap);
  }

     /**
   *  図形描画
   *  @param e DrawEvent
   *  @return {void}
   */
  function handleDrawEnd(event: { feature: any; }) {
    console.log('描画された');
    const feature = event.feature;

    if (window.confirm('保存しますか')) {
      const name = 'name';
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const inpDate = formattedDate;
      feature.setProperties({
        name: name,
        inpDate: inpDate,
      });

      const lonlat = feature.getGeometry().getCoordinates();

      const shapeData = {
        type: 'Feature',
        geometry: {
          type: selectedType.value,
          coordinates: lonlat,
        },
        properties: {
          name: name,
          inpDate: inpDate,
        },
      };

      axios
        .post('http://localhost:5000/api/saveattributes', shapeData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          console.log('フィーチャの登録に成功しました', response.data);
        })
        .catch(error => {
          console.error('フィーチャの登録に失敗しました', error);
          // ユーザーにエラーメッセージを提供する
        });

      location.reload();
    } else {
      console.log('キャンセルが押された');
      delflag = 1;
    }

    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteraction();
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
      pointLayerVisible.value = true;
      lineLayerVisible.value = true;
      polygonLayerVisible.value = true;
    } else {
      pointLayerVisible.value = false;
      lineLayerVisible.value = false;
      polygonLayerVisible.value = false;
    }
  });

  // セレクトボックスが変更されたら
  watch(selectedType, () => {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteraction();
  });
  

  onMounted(() => {
    map.setTarget("map");

    // データをAPIから取得してリアクティブ変数にセット
    fetchShapes();
    // 起動時にPointで描画できる状態にしておく
    addInteraction();
    // 選択
    setSelect();
    // 選択中の図形を取得し、属性情報をテキストボックスにセットする
    select.on('select', handleSelection);
    // 編集
    modityFeatures();

    map.addInteraction(select);    
  });

</script>
<style>
  .map {
    width: 100%;
    height: 550px;
  }
</style>
