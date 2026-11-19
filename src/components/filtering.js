export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const element = elements?.[elementName];
            if (!element) {
                return;
            }

            element.append(...Object.values(indexes[elementName]).map((name) => {
                const option = document.createElement('option');
                option.textContent = name;
                option.value = name;
                return option;
            }));
        });
    };

    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
            const {field} = action.dataset || {};
            if (field === 'date') {
                elements.searchByDate.value = '';
                state.date = '';
            }
            if (field === 'customer') {
                elements.searchByCustomer.value = '';
                state.customer = '';
            }
            if (field === 'seller') {
                elements.searchBySeller.value = '';
                state.seller = '';
            }
            if (field === 'total') {
                elements.totalFrom.value = '';
                elements.totalTo.value = '';
                state.totalFrom = '';
                state.totalTo = '';
            }
        }

        const filter = {};
        Object.keys(state).forEach((key) => {
            if (['date', 'customer', 'seller', 'totalFrom', 'totalTo'].includes(key) && state[key]) {
                filter[`filter[${key}]`] = state[key];
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}