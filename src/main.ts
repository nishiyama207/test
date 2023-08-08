// セットアップ系の処理
// olのcss読込や、「App.vue」とindex.html内のエレメントとの紐づけ処理

// import Map from 'ol/Map.js';
// import View from 'ol/View.js';
// import {OSM, Vector as VectorSource} from 'ol/source.js';
// import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
// import {Draw, Modify, Snap} from 'ol/interaction.js';
// import {get} from 'ol/proj.js';
// import { Select } from 'ol/interaction.js';
// import { Collection } from 'ol';
// import Feature from 'ol/Feature.js';
// import Geometry from 'ol/geom/Geometry';
// import Point from 'ol/geom/Point';
// import LineString from 'ol/geom/LineString';
// import Polygon from 'ol/geom/Polygon';
import { createApp } from 'vue'
import App from './App.vue'
//import { Geometry } from 'ol/geom';

createApp(App).mount('#app')

// // OpenStreetMapから地図タイルを表示する
// const raster = new TileLayer({
//   source: new OSM(),
// });

// // ベクタデータを表示するためのソースとレイヤ
// const source = new VectorSource({wrapX: false});
// const vector = new VectorLayer({
//   source: source,
// });
// // Pointソースとレイヤ
// const source1 = new VectorSource({wrapX: false});
// const vector1 = new VectorLayer({
//   source: source1,
// });
// // LineStringソースとレイヤ
// const source2 = new VectorSource({wrapX: false});
// const vector2 = new VectorLayer({
//   source: source2,
// });
// // Polygonソースとレイヤ
// const source3 = new VectorSource({wrapX: false});
// const vector3 = new VectorLayer({
//   source: source3,
// });

// // mapを作成
// const defaultExtent = [-20037508.34, -20037508.34, 20037508.34, 20037508.34]; // デフォルトのExtentを設定
// const extent = get('EPSG:3857')?.getExtent()?.slice() || defaultExtent; // 地図の範囲
// extent[0] += extent[0]; // 取得したExtentのx軸方向（東西方向）の最小値と最大値をそれぞれ2倍にしている
// extent[2] += extent[2]; // デフォルトのExtentを元の地図の倍率に合わせて拡大している。地図が非常に小さく表示されるのを防ぐため
// const map = new Map({
//   layers: [raster,vector, vector1,vector2,vector3],
//   target: 'map',
//   view: new View({
//     center: [-11000000, 4600000],
//     zoom: 4,
//     extent, // 地図の初期表示範囲
//   }),
// });

// // 選択中の図形
// const select = new Select({
//   layers: [vector1,vector2,vector3],
//   features: new Collection(source.getFeatures()), // sourceオブジェクトからすべての図形を取得して新しいCollectionに格納
// });

// // 属性情報テーブルを作成
// function createAttributesTable(feature: { get: any; setProperties?: any; }) {
//   const tableElement = document.createElement('table');
//   tableElement.innerHTML = `
//     <tr>
//       <th>id</th>
//       <td><input type="text" class="form-control" id="idInput" value="${feature.get('id')}" /></td>
//     </tr>
//     <tr>
//       <th>Name</th>
//       <td><input type="text" class="form-control" id="nameInput" value="${feature.get('name')}" /></td>
//     </tr>
//     <tr>
//       <th>Date</th>
//       <td><input type="text" class="form-control" id="dateInput" value="${feature.get('inputDate')}" /></td>
//     </tr>
//     <tr>
//       <td colspan="2"><button class="btn btn-light" id="saveButton">Save</button></td>
//     </tr>
//   `;

//   // 保存ボタンが押されると属性を更新する
//   const saveButton = tableElement.querySelector('#saveButton');
//   if(saveButton)
//   saveButton.addEventListener('click', function () {
//     const idInput = tableElement.querySelector('#idInput') as HTMLInputElement;
//     const nameInput = tableElement.querySelector('#nameInput') as HTMLInputElement;
//     const dateInput = tableElement.querySelector('#dateInput') as HTMLInputElement;
//     const id = idInput.value;
//     const name = nameInput.value;
//     const inputDate = dateInput.value;

//     feature.setProperties({
//       id: id,
//       name: name,
//       inputDate: inputDate,
//     });

//     // 更新
//     const attributesContainer = document.getElementById('attributes-table');
//     const updatedTable = createAttributesTable(feature);
//     if(attributesContainer){
//       attributesContainer.innerHTML = '';
//     }
//     attributesContainer?.appendChild(updatedTable);
//   });

//   return tableElement;
// }

// // 選択されたらテーブルに属性情報を表示する
// select.on('select', function (event) {
//   const selectedFeatures = event.target.getFeatures();
//   if (selectedFeatures.getLength() > 0) {
//     // 最初に選択されたフィーチャを取得
//     const selectedFeature = selectedFeatures.item(0);
//     // テーブルに属性情報を表示
//     const attributesTable = createAttributesTable(selectedFeature);
//     const attributesContainer = document.getElementById('attributes-table');
//     if(attributesContainer){
//       attributesContainer.innerHTML = '';
//     }
//     attributesContainer?.appendChild(attributesTable);
//   } else {
//     // テーブルをクリア
//     const attributesContainer = document.getElementById('attributes-table');
//     if(attributesContainer){
//       attributesContainer.innerHTML = '';
//     }
//   }
// });

// map.addInteraction(select);

// // 図形編集
// const modify1 = new Modify({source: source1}); // Point
// map.addInteraction(modify1);
// const modify2 = new Modify({source: source2}); // LineString
// map.addInteraction(modify2);
// const modify3 = new Modify({source: source3}); // Polygon
// map.addInteraction(modify3);

// let draw: Draw;
// let snap: Snap;

// const typeSelect = document.getElementById('type') as HTMLSelectElement;

// let nextFeatureId = 1; // 次に割り当てるidの初期値

// // 属性追加
// function addAttributesToFeature(feature: Feature<Geometry>, featuretype: string | undefined) {
//   const id = nextFeatureId;
//   nextFeatureId++;
//   const name = featuretype;
//   const today = new Date()
//   const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
//   const inputDate = formattedDate

//   // Set the attributes to the feature
//   feature.setProperties({
//     id: id,
//     name: name,
//     inputDate: inputDate,
//   });
// }

// // geometrytype,属性データを追加
// function getGeometryFromType(type: string): Geometry | null {
//   switch (type) {
//     case 'Point':
//       return new Point([0, 0]);
//     case 'LineString':
//       return new LineString([[0, 0], [1, 1]]);
//     case 'Polygon':
//       return new Polygon([[[0, 0], [1, 1], [1, 0], [0, 0]]]);
//     default:
//       return null;
//   }
// }
// function addDrawInteraction(source: VectorSource<Geometry>) {
//   const geometryType = getGeometryFromType(typeSelect.value);
//   if (geometryType) {
//     draw = new Draw({
//       source: source,
//       type: geometryType.getType(),
//     });
//     map.addInteraction(draw);
//     snap = new Snap({ source: source });
//     map.addInteraction(snap);

//     // 描画が終わると属性データを追加
//     draw.on('drawend', function (event) {
//       const feature = event.feature;
//       addAttributesToFeature(feature, geometryType.getType());
//     });
//   }
// }

// // 追加
// function addInteraction() {
//   map.removeInteraction(draw);
//   map.removeInteraction(snap);

//   if (typeSelect.value === 'Point') {
//     addDrawInteraction(source1);
//   } else if (typeSelect.value === 'LineString') {
//     addDrawInteraction(source2);
//   } else if (typeSelect.value === 'Polygon') {
//     addDrawInteraction(source3);
//   }
// }

// // フィーチャが追加されるとカスタムプロパティ 'source' を設定する
// source1.on('addfeature', (event) => {
//   const feature = event.feature;
//   feature?.set('source', source1);
// });
// source2.on('addfeature', (event) => {
//   const feature = event.feature;
//   feature?.set('source', source2);
// });
// source3.on('addfeature', (event) => {
//   const feature = event.feature;
//   feature?.set('source', source3);
// });

// // 削除
// const removeButton = document.getElementById('remove');
// if (removeButton) {
//   removeButton.onclick = function (event) {
//     event.preventDefault(); // ページのリロードを防ぐ
//     const selectedFeatures = select.getFeatures(); // 選択されたフィーチャを取得
//     if (selectedFeatures.getLength() > 0) { // 少なくとも1つ以上のフィーチャが選択されている場合
//       selectedFeatures.forEach((feature) => { // 各フィーチャに対して以下の処理を行う
//         console.log('Feature:', feature);
//         const featureSource = feature.get('source'); // フィーチャがどのソースから追加されたか
//         console.log('Source:', featureSource);
//         if (featureSource) {
//           featureSource.removeFeature(feature);
//         } else {
//           console.log('Feature source is undefined.');
//         }
//       });
//       // 削除後に選択を解除
//       selectedFeatures.clear();
//     }
//   };
// }

// // Handle change event.
// typeSelect.onchange = function () {
//   map.removeInteraction(draw);
//   map.removeInteraction(snap);
//   addInteraction();
// };

// // HTML内のチェックボックス要素を取得
// const pointCheckbox = document.getElementById('pointlayer') as HTMLInputElement;
// const lineCheckbox = document.getElementById('linelayer') as HTMLInputElement;
// const polygonCheckbox = document.getElementById('polygonlayer') as HTMLInputElement;
// const vectorCheckbox = document.getElementById('vectorlayer') as HTMLInputElement;

// // チェックボックスが変更されると表示非表示を切り替える
// function handleLayerVisibility(layer: VectorLayer<VectorSource<Geometry>>, checkbox: HTMLInputElement) {
//   layer.setVisible(checkbox.checked); // checkbox.checkedがtrueならレイヤを表示する
// }
// // Point
// pointCheckbox?.addEventListener('change', function () {
//   handleLayerVisibility(vector1, pointCheckbox);
// });
// // LineString
// lineCheckbox?.addEventListener('change', function () {
//   handleLayerVisibility(vector2, lineCheckbox);
// });
// // Polygon
// polygonCheckbox?.addEventListener('change', function () {
//   handleLayerVisibility(vector3, polygonCheckbox);
// });
// // Vector全体
// vectorCheckbox?.addEventListener('change', function () {
//   handleLayerVisibility(vector1, vectorCheckbox);
//   handleLayerVisibility(vector2, vectorCheckbox);
//   handleLayerVisibility(vector3, vectorCheckbox);
// });

// addInteraction();

