import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows, rowsPerPage}, createPage) => {
    let pageCount;

    const createPageButton = (page) => {
        const label = document.createElement('label');
        label.className = 'pagination-button';
        label.setAttribute('aria-label', `Goto page ${page}`);

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'page';
        radio.value = String(page);
        label.append(radio, document.createElement('span'));

        label.querySelector('span').textContent = String(page);

        return label;
    };

    const applyPagination = (query, state, action) => {
        const limit = Number(state?.rowsPerPage ?? 10) || 10;
        let currentPage = Number(state?.page ?? 1) || 1;
        const changesPage = action && ['page', 'rowsPerPage', 'first', 'prev', 'next', 'last'].includes(action.name);

        if (!changesPage) {
            currentPage = 1;
        }

        if (action && action.name === 'first') {
            currentPage = 1;
        }

        if (action && action.name === 'prev') {
            currentPage = Math.max(1, currentPage - 1);
        }

        if (action && action.name === 'next') {
            currentPage = Math.min(pageCount || 1, currentPage + 1);
        }

        if (action && action.name === 'last') {
            currentPage = pageCount || 1;
        }

        if (action && action.name === 'page') {
            currentPage = Number(action.value) || currentPage;
        }

        if (action && action.name === 'rowsPerPage') {
            currentPage = 1;
        }

        currentPage = Math.max(1, currentPage);

        return Object.assign({}, query, {
            limit,
            page: currentPage
        });
    };

    const updatePagination = (total, {page, limit}) => {
        const currentPage = Number(page) || 1;
        const perPage = Number(limit) || 10;
        pageCount = Math.max(1, Math.ceil(total / perPage));
        const maxPage = pageCount;
        const safePage = Math.min(currentPage, maxPage);

        if (pages) {
            const visiblePages = getPages(safePage, maxPage, 5);
            const pageButtons = visiblePages.map((page) => {
                const pageButton = createPage ? createPage(page) : createPageButton(page);
                const input = pageButton.querySelector('input');
                const pageText = pageButton.querySelector('span');

                if (input) {
                    input.name = 'page';
                    input.value = String(page);
                    input.checked = page === safePage;
                }

                if (pageText) {
                    pageText.textContent = String(page);
                }

                pageButton.classList.toggle('active', page === safePage);
                pageButton.setAttribute('aria-label', `Goto page ${page}`);
                return pageButton;
            });

            pages.replaceChildren(...pageButtons);
        }

        if (rowsPerPage) {
            rowsPerPage.value = String(perPage);
        }

        if (fromRow) {
            fromRow.textContent = total ? (safePage - 1) * perPage + 1 : 0;
        }

        if (toRow) {
            toRow.textContent = Math.min(total, safePage * perPage);
        }

        if (totalRows) {
            totalRows.textContent = String(total);
        }
    };

    return {
        updatePagination,
        applyPagination
    };
};