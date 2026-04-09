/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/Components/Table.js"
/*!***************************************!*\
  !*** ./src/admin/Components/Table.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


const $ = jQuery;
const Table = () => {
  const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [currentForm, setCurrentForm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [columns, setColumns] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [currentData, setCurrentData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [table, setTable] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(`${window.svbData?.ajaxUrl}?action=svb_get_all_data&nonce=${window.svbData?.nonce}`).then(res => res.json()).then(res => setData(res.data));
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // First set Form Id 
    if (data) {
      setCurrentForm(data.columns[0]?.form_id);
    }
  }, [data]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (data) {
      if (table) {
        table.destroy();
      }
      let columns = [];
      columns = data?.columns.find(item => item.form_id === currentForm)?.columns;
      setCurrentData(data.data.filter(item => item.form_id === currentForm).map(item => item.data));
      setColumns(columns);

      // initialize DataTable
      $(document).ready(function () {
        if (columns) {
          setTimeout(() => {
            const table = $('#svb_table_id').DataTable();
            setTable(table);
          }, 10);
        }
      });
    }
  }, [currentForm]);
  if (!data) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "text-3xl"
    }, "Loading...");
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "w-[80%] mt-[30px] m-auto"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex gap-[15px]"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "form",
    className: "text-[18px] font-medium"
  }, "Select form"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
    className: "w-[200px]",
    name: "form",
    id: "form",
    value: currentForm,
    onChange: e => setCurrentForm(e.target.value)
  }, data?.columns.map(form => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
      value: form.form_id
    }, form.form_name), "  ");
  }))), columns && currentData?.length > 0 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", {
    className: "text-[20px] font-[500] text-[#000] mb-[15px]",
    id: "myTable"
  }, " List "), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    id: "svb_table_id",
    className: `svb_table_id`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
    className: "border border-slate-300 p-[6px] text-[16px] font-[500] text-[#000]"
  }, "S.N"), Object.values(columns)?.map(column => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
    key: column,
    className: "border border-slate-300 p-[6px] text-[16px] font-[500] text-[#000]"
  }, column)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, currentData.length < 1 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
    key: 0
  }, Object.keys(columns)?.map(column => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    key: column,
    className: "border border-slate-300 p-[4px] text-[16px] font-[400] text-[#000]"
  }, column))) : currentData.map((item, index) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
    key: index
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    className: "border border-slate-300 p-[4px] text-[16px] font-[400] text-[#000]"
  }, index + 1), Object.keys(columns)?.map(column => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    key: column,
    className: "border border-slate-300 p-[4px] text-[16px] font-[400] text-[#000]"
  }, Array.isArray(item[column]) ? item[column].join(", ") : item[column]))))))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "No data submitted yet!"));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Table);

/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

/***/ },

/***/ "react-dom"
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
(module) {

module.exports = window["ReactDOM"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************************!*\
  !*** ./src/admin/adminScript.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Components_Table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Components/Table */ "./src/admin/Components/Table.js");



document.addEventListener('DOMContentLoaded', () => {
  const ele = document.querySelector('#svbAdminContainer');
  (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createRoot)(ele).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Table__WEBPACK_IMPORTED_MODULE_2__["default"], null)));
});
})();

/******/ })()
;
//# sourceMappingURL=admin-script.js.map