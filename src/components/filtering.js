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
            const container = action.closest('.filter-wrapper, .range-inputs');
            const fields = container?.querySelectorAll('input, select') || [];

            fields.forEach((field) => {
                field.value = '';
                if (field.name) {
                    state[field.name] = '';
                }
            });
        }

        const filter = {};
        const filterContainer = elements.filter;
        if (filterContainer) {
            filterContainer.querySelectorAll('input, select').forEach((element) => {
                if (element.name && element.value) {
                    filter[`filter[${element.name}]`] = element.value;
                }
            });
        }

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}