import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initSearching} from "./components/searching.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initPagination} from "./components/pagination.js";

// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search'],
    after: ['pagination']
}, render);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

let searching = initSearching('search');
let sorting = initSorting(['date', 'total']);
let filtering = initFiltering(sampleTable.elements, indexes);
let pagination = initPagination({
    pages: sampleTable.elements.pages,
    fromRow: sampleTable.elements.fromRow,
    toRow: sampleTable.elements.toRow,
    totalRows: sampleTable.elements.totalRows,
    rowsPerPage: sampleTable.elements.rowsPerPage
}, null);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    return {
        ...state
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    const state = collectState();
    let result = [...data];

    result = searching(result, state, action);
    result = sorting(result, state, action);
    result = filtering(result, state, action);
    result = pagination(result, state, action);

    sampleTable.render(result);
}

render();
