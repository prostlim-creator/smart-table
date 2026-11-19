import './fonts/ys-display/fonts.css'
import './style.css'

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initSearching} from "./components/searching.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initPagination} from "./components/pagination.js";

const api = initData();

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search'],
    after: ['pagination']
}, render);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

let latestRequest = 0;

const searching = initSearching('search');
const sorting = initSorting(['date', 'total']);
const {applyFiltering, updateIndexes} = initFiltering(sampleTable.elements);
const {applyPagination, updatePagination} = initPagination({
    pages: sampleTable.elements.pages,
    fromRow: sampleTable.elements.fromRow,
    toRow: sampleTable.elements.toRow,
    totalRows: sampleTable.elements.totalRows,
    rowsPerPage: sampleTable.elements.rowsPerPage
});

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
async function render(action) {
    const requestNumber = ++latestRequest;
    const state = collectState();
    let query = {};

    query = searching(query, state, action);
    query = sorting(query, state, action);
    query = applyFiltering(query, state, action);
    query = applyPagination(query, state, action);

    const {total, items} = await api.getRecords(query);

    if (requestNumber !== latestRequest) {
        return;
    }

    updatePagination(total, query);
    sampleTable.render(items);
}

async function init() {
    const indexes = await api.getIndexes();
    updateIndexes(sampleTable.elements, {
        searchBySeller: indexes.sellers
    });
}

init().then(() => render());
