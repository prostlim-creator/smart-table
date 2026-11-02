import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    const comparator = createComparison(['skipNonExistentSourceFields'], [
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller', 'total'])
    ]);

    return (data, state, action) => {
        const searchText = String(state?.[searchField] ?? '').trim();

        if (!searchText) {
            return data;
        }

        return data.filter((item) => comparator(item, {[searchField]: searchText}));
    }
}