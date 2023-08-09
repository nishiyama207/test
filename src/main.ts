// セットアップ系の処理
// olのcss読込や、「App.vue」とindex.html内のエレメントとの紐づけ処理

import { createApp } from 'vue'
import App from './App.vue'
import 'ol/ol.css'

createApp(App).mount('#app')


// // 属性情報テーブルを作成
// function createAttributesTable(feature: { get: any; setProperties?: any; }) {
//   const tableElement = document.createElement('table');
//   tableElement.innerHTML = `
//     <tr><th>id</th><td><input type="text" class="form-control" id="idInput" value="${feature.get('id')}" /></td>
//     </tr>
//     <tr><th>Name</th><td><input type="text" class="form-control" id="nameInput" value="${feature.get('name')}" /></td>
//     </tr>
//     <tr><th>Date</th><td><input type="text" class="form-control" id="dateInput" value="${feature.get('inputDate')}" /></td>
//     </tr>
//     <tr><td colspan="2"><button class="btn btn-light" id="saveButton">Save</button></td>
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
