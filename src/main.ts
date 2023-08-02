import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {Draw, Modify, Snap} from 'ol/interaction.js';
import {get} from 'ol/proj.js';
import { Select } from 'ol/interaction.js';
import { Collection } from 'ol';

// OpenStreetMapから地図タイルを表示する
const raster = new TileLayer({
  source: new OSM(),
});

// ベクタデータを表示するためのソースとレイヤ
const source = new VectorSource({wrapX: false});
const vector = new VectorLayer({
  source: source,
});
const source1 = new VectorSource({wrapX: false});
const vector1 = new VectorLayer({
  source: source1,
});
const source2 = new VectorSource({wrapX: false});
const vector2 = new VectorLayer({
  source: source2,
});
const source3 = new VectorSource({wrapX: false});
const vector3 = new VectorLayer({
  source: source3,
});

// mapを作成
const defaultExtent = [-20037508.34, -20037508.34, 20037508.34, 20037508.34]; // デフォルトのExtentを設定
const extent = get('EPSG:3857')?.getExtent()?.slice() || defaultExtent;
extent[0] += extent[0];
extent[2] += extent[2];
const map = new Map({
  layers: [raster,vector, vector1,vector2,vector3],
  target: 'map',
  view: new View({
    center: [-11000000, 4600000],
    zoom: 4,
    extent,
  }),
});

// 選択中の図形
const select = new Select({
  layers: [vector1,vector2,vector3],
  features: new Collection(source.getFeatures()),
});
map.addInteraction(select);

// 編集
const modify1 = new Modify({source: source1});
map.addInteraction(modify1);

const modify2 = new Modify({source: source2});
map.addInteraction(modify2);

const modify3 = new Modify({source: source3});
map.addInteraction(modify3);

let draw: Draw;
let snap: Snap;

const typeSelect = document.getElementById('type') as HTMLSelectElement;

// 追加
function addInteraction() {

  map.removeInteraction(draw);
  map.removeInteraction(snap);

  if (typeSelect.value === 'Point') {
    draw = new Draw({
      source: source1,
      type: typeSelect.value,
    });
    map.addInteraction(draw);
    snap = new Snap({source: source1});
    map.addInteraction(snap);
  }else if (typeSelect.value === 'LineString') {
    draw = new Draw({
      source: source2,
      type: typeSelect.value,
    });
    map.addInteraction(draw);
    snap = new Snap({ source: source2 });
    map.addInteraction(snap);
  }else if (typeSelect.value === 'Polygon') {
    draw = new Draw({
      source: source3,
      type: typeSelect.value,
    });
    map.addInteraction(draw);
    snap = new Snap({ source: source3 });
    map.addInteraction(snap);
  }
}

// フィーチャが追加される箇所でカスタムプロパティ 'source' を設定する
source1.on('addfeature', (event) => {
  const feature = event.feature;
  feature?.set('source', source1);
});

source2.on('addfeature', (event) => {
  const feature = event.feature;
  feature?.set('source', source2);
});

source3.on('addfeature', (event) => {
  const feature = event.feature;
  feature?.set('source', source3);
});

// 削除
document.getElementById('remove').onclick = function (event) {
  event.preventDefault(); // ページのリロードを防ぐ
  const selectedFeatures = select.getFeatures();
  if (selectedFeatures.getLength() > 0) {
    selectedFeatures.forEach((feature) => {
      console.log('Feature:', feature);
      const featureSource = feature.get('source');
      console.log('Source:', featureSource);
      if (featureSource) {
        featureSource.removeFeature(feature);
      } else {
        console.log('Feature source is undefined.');
      }
    });
    // 削除後に選択を解除
    selectedFeatures.clear();
  }
};

// Handle change event.
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteraction();
};

// HTML内のチェックボックス要素を取得
const vector1Checkbox = document.getElementById('pointlayer');
const vector2Checkbox = document.getElementById('linelayer');
const vector3Checkbox = document.getElementById('polygonlayer');
const vectorCheckbox = document.getElementById('vectorlayer');

// チェックボックスの変更イベント
function handleLayerVisibility(layer, checkbox) {
  layer.setVisible(checkbox.checked);
}

// チェックボックスの変更イベントをリスナーに追加
vector1Checkbox?.addEventListener('change', function () {
  handleLayerVisibility(vector1, vector1Checkbox);
});

vector2Checkbox?.addEventListener('change', function () {
  handleLayerVisibility(vector2, vector2Checkbox);
});

vector3Checkbox?.addEventListener('change', function () {
  handleLayerVisibility(vector3, vector3Checkbox);
});

vectorCheckbox?.addEventListener('change', function () {
  handleLayerVisibility(vector1, vectorCheckbox);
  handleLayerVisibility(vector2, vectorCheckbox);
  handleLayerVisibility(vector3, vectorCheckbox);
});

addInteraction();