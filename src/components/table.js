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
    const elements = {...root.elements};

    const insertNamedTemplate = (templateId) => {
        const {container, elements: namedElements} = cloneTemplate(templateId);
        Object.assign(elements, namedElements);
        return container;
    };

    const header = cloneTemplate('header');
    const filter = cloneTemplate('filter');
    Object.assign(elements, header.elements, filter.elements);

    const beforeNodes = before.map((templateId) => insertNamedTemplate(templateId));
    const afterNodes = after.map((templateId) => insertNamedTemplate(templateId));

    root.container.prepend(...beforeNodes, header.container, filter.container);
    root.container.append(...afterNodes);

    root.container.addEventListener('submit', (event) => {
        event.preventDefault();

        if (typeof onAction === 'function') {
            onAction(event.submitter || event.target);
        }
    });

    root.container.addEventListener('input', (event) => {
        if (event.target && typeof onAction === 'function') {
            onAction(event.target);
        }
    });

    root.container.addEventListener('change', (event) => {
        if (event.target && typeof onAction === 'function') {
            onAction(event.target);
        }
    });

    root.container.addEventListener('reset', () => {
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

    return {...root, elements, render};
}