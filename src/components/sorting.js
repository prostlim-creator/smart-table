import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    const buttons = columns
        .map((field) => document.querySelector(`button[name="sort"][data-field="${field}"]`))
        .filter(Boolean);

    const updateButtons = (activeField, activeOrder) => {
        buttons.forEach((button) => {
            const field = button.dataset.field;
            const nextOrder = field === activeField ? activeOrder : 'none';
            button.dataset.value = nextOrder;
            const parent = button.closest('.sortable');
            if (parent) {
                parent.classList.toggle('active', field === activeField && nextOrder !== 'none');
            }
        });
    };

    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            field = action.dataset.field;
            order = sortMap[action.dataset.value || 'none'];
            if (!order) {
                order = 'up';
            }

            updateButtons(field, order);
        } else {
            const activeButton = buttons.find((button) => button.dataset.value && button.dataset.value !== 'none');
            if (activeButton) {
                field = activeButton.dataset.field;
                order = activeButton.dataset.value;
            }
        }

        return sortCollection(data, field, order);
    }
}