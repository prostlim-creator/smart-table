import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before = [], after = []} = settings;
    const root = cloneTemplate(tableTemplate);
    const wrapper = document.createElement('div');
    const elements = {...root.elements};

    const insertNamedTemplate = (templateId) => {
        const {container, elements: namedElements} = cloneTemplate(templateId);
        Object.assign(elements, namedElements);
        return container;
    };

    const header = cloneTemplate('header');
    const filter = cloneTemplate('filter');
    Object.assign(elements, header.elements, filter.elements);
    root.elements.rows.before(header.container, filter.container);

    const beforeNodes = before.map((templateId) => insertNamedTemplate(templateId, root.container));
    const afterNodes = after.map((templateId) => insertNamedTemplate(templateId));

    wrapper.append(...beforeNodes, root.container, ...afterNodes);

    wrapper.addEventListener('submit', (event) => {
        event.preventDefault();

        if (typeof onAction === 'function') {
            onAction(event.submitter || event.target);
        }
    });

    wrapper.addEventListener('input', (event) => {
        if (event.target && typeof onAction === 'function') {
            onAction(event.target);
        }
    });

    wrapper.addEventListener('change', (event) => {
        if (event.target && typeof onAction === 'function') {
            onAction(event.target);
        }
    });

    wrapper.addEventListener('reset', () => {
        if (typeof onAction === 'function') {
            requestAnimationFrame(() => onAction(undefined));
        }
    });

    const render = (data) => {
        const nextRows = (Array.isArray(data) ? data : []).map((item) => {
            const row = cloneTemplate(rowTemplate);
            row.elements.date.textContent = item.date;
            row.elements.customer.textContent = item.customer;
            row.elements.seller.textContent = item.seller;
            row.elements.total.textContent = `$${Number(item.total).toFixed(2)}`;
            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    return {container: wrapper, elements, render};
}