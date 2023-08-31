<template>
  <tr>
    <td>ID: <input type="text" id="idInput" v-model="idInput" :readonly="true" /></td>
    <td>Name: <input type="text" id="nameInput" v-model="nameInput" /></td>
    <td>Date: <input type="date" id="dateInput" v-model="dateInput" /></td>
    <td><button class="btn btn-light" @click="updateAttributes">保存</button></td>
  </tr>
  <button class="btn btn-light" @click="removeSelectedFeature">削除</button>
</template>
  
<script setup lang="ts">
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
  import { Draw, Modify, Snap, Select } from 'ol/interaction';
  import { OSM, Vector as VectorSource } from 'ol/source';
  import { ref, onMounted, watch, computed, PropType } from 'vue';
  import { Collection } from 'ol';
  import View from 'ol/View';
  import Map from 'ol/Map';
  import Feature from 'ol/Feature'
  import { altKeyOnly, click } from "ol/events/condition";
  import axios from 'axios';
  import GeoJSON from 'ol/format/GeoJSON';
  import { Geometry } from 'ol/geom';

  type DrawType =  'Point' | 'LineString' | 'Polygon' ;
  
  const props = defineProps({
    pointLayerVisible: Boolean,
    lineLayerVisible: Boolean,
    polygonLayerVisible: Boolean,
    vectorLayerVisible: Boolean,
    selectedType: {
    type: String as PropType<DrawType>,
    required: true,
  },
  });

  // ---------------------------------------------------------------------
  // map系
  // ---------------------------------------------------------------------
  let draw : Draw ;
  let snap : Snap ;
  const source = new VectorSource({ wrapX: false });
  const pointSource = new VectorSource({ wrapX: false });
  const lineSource = new VectorSource({ wrapX: false });
  const polygonSource = new VectorSource({ wrapX: false });
  const vector = new VectorLayer({ source: source, });
  const pointLayer = new VectorLayer({ source: pointSource, });
  const lineLayer = new VectorLayer({ source: lineSource, });
  const polygonLayer = new VectorLayer({ source: polygonSource, });
  const pointFeatures: Feature<Geometry>[] = [];
  const lineFeatures: Feature<Geometry>[] = [];
  const polygonFeatures: Feature<Geometry>[] = [];
  let select : Select ;
  let selectedFeatures ;
  let selectedFeature : Feature ;
  let delflag = 0 ;

  // OpenStreetMapから地図タイルを表示する
  const raster = new TileLayer({
    source: new OSM(),
  });

  // mapを作成
  const  map = new Map({
    layers: [raster,pointLayer,lineLayer,polygonLayer,vector],
    view: new View({
      center: [-11000000, 4600000],
      zoom: 4,
    }),
  });

  // ---------------------------------------------------------------------
  // state
  // ---------------------------------------------------------------------
  const idInput = ref<string>('')
  const nameInput = ref<string>('')
  const dateInput = ref<string>('')
  const featureData = ref<Array<any>>([]);

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
  async function fetchFeatures() {
    console.log('fetchFeaturesが実行された');
    try {
      const response = await axios.get('http://localhost:5000/api/getshapes');
      featureData.value = response.data;
      console.log('featureData.value:', featureData.value);

      // データを図形の種類ごとに分類
      featureData.value.features.forEach((feature: { geometry: { type: string; }; }) => {
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
      pointSource.clear();
      lineSource.clear();
      polygonSource.clear();
      pointSource.addFeatures(pointFeatures);
      lineSource.addFeatures(lineFeatures);
      polygonSource.addFeatures(polygonFeatures);
      
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
    console.log('削除ボタンがクリックされた');
    selectedFeatures = select?.getFeatures();
    if (selectedFeatures.getLength() > 0) {
      const feature = selectedFeatures.item(0);
      console.log('feature',feature);
      //const featureSource = feature.get('source');
      // 削除する図形のidを取得
      const id = feature.get('id');

      // 選択中の図形のgeometryTypeに応じてソースを取得
      let featureSource;
      const geometryType = feature.getGeometry().getType();
      if (geometryType === 'Point') {
        featureSource = pointSource;
      } else if (geometryType === 'LineString') {
        featureSource = lineSource;
      } else if (geometryType === 'Polygon') {
        featureSource = polygonSource;
      }
      // 地図上から図形を削除
      featureSource?.removeFeature(feature);
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
  function updateAttributes() {
    console.log('保存ボタンがクリックされた')
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
        const response = await axios.post(`http://localhost:5000/api/updateattributes`,attributes);
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
  async function modifyFeature(event: { features: { item: (arg0: number) => any; }; }) {
    const modifiedFeature = event.features.item(0); // 修正された図形を取得

    if (modifiedFeature) {
      
      const modifiedGeometry = modifiedFeature.getGeometry();
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
        const response = await axios.post(`http://localhost:5000/api/updatefeature`, updateData);
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
    const modifyPoint = new Modify({source: pointSource});
    map.addInteraction(modifyPoint);
    const modifyLine = new Modify({source: lineSource});
    map.addInteraction(modifyLine);
    const modifyPolygon = new Modify({source: polygonSource});
    map.addInteraction(modifyPolygon);

    modifyPoint.on('modifyend', modifyFeature);
    modifyLine.on('modifyend', modifyFeature);
    modifyPolygon.on('modifyend', modifyFeature);
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
      layers: [pointLayer,lineLayer,polygonLayer],
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
      type: props.selectedType,
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

      const featureData = {
        type: 'Feature',
        geometry: {
          type: props.selectedType,
          coordinates: lonlat,
        },
        properties: {
          name: name,
          inpDate: inpDate,
        },
      };

      axios
        .post('http://localhost:5000/api/savefeature', featureData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          console.log('フィーチャの登録に成功しました', response.data);
        })
        .catch(error => {
          console.error('フィーチャの登録に失敗しました', error);
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
  
  // レイヤ表示切替
  watch(props, () => {
    pointLayer.setVisible(props.pointLayerVisible);
    lineLayer.setVisible(props.lineLayerVisible);
    polygonLayer.setVisible(props.polygonLayerVisible);
    if(!props.vectorLayerVisible){
      pointLayer.setVisible(false);
      lineLayer.setVisible(false);
      polygonLayer.setVisible(false);
    }
  });

  // セレクトボックスが変更されたら
  watch(() => props.selectedType, () => {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteraction();
  });
  

  onMounted(() => {
    map.setTarget("map");
    // データをAPIから取得してリアクティブ変数にセット
    fetchFeatures();
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
