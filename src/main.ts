
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {Draw, Modify, Snap} from 'ol/interaction.js';
import {get} from 'ol/proj.js';

// OpenStreetMapから地図タイルを表示する
const raster = new TileLayer({
  source: new OSM(),
});


// ベクタデータを表示するためのソースとレイヤ
const source = new VectorSource({wrapX: false});
const vector = new VectorLayer({
  source: source,
  
});

// mapを作成
const defaultExtent = [-20037508.34, -20037508.34, 20037508.34, 20037508.34]; // デフォルトのExtentを設定
const extent = get('EPSG:3857')?.getExtent()?.slice() || defaultExtent;
extent[0] += extent[0];
extent[2] += extent[2];
const map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [-11000000, 4600000],
    zoom: 4,
    extent,
  }),
});



// 編集
const modify = new Modify({source: source});
map.addInteraction(modify);

let draw: Draw;
let snap: Snap;

const typeSelect = document.getElementById('type') as HTMLSelectElement;

function addInteraction() {
  draw = new Draw({
    source: source,
    type: typeSelect.value,
  });
  map.addInteraction(draw);
  snap = new Snap({source: source});
  map.addInteraction(snap);
}

/**
 * Handle change event.
 */
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteraction();
};

addInteraction();