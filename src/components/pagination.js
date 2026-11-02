import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows, rowsPerPage}, createPage) => {
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

    return (data, state, action) => {
        const total = data.length;
        const limit = Number(state?.rowsPerPage ?? 10) || 10;
        const maxPage = Math.max(1, Math.ceil(total / limit));
        let currentPage = Number(state?.page ?? 1) || 1;

        if (action && action.name === 'first') {
            currentPage = 1;
        }

        if (action && action.name === 'prev') {
            currentPage = Math.max(1, currentPage - 1);
        }

        if (action && action.name === 'next') {
            currentPage = Math.min(maxPage, currentPage + 1);
        }

        if (action && action.name === 'last') {
            currentPage = maxPage;
        }

        if (action && action.name === 'page') {
            currentPage = Number(action.value) || currentPage;
        }

        if (action && action.name === 'rowsPerPage') {
            currentPage = 1;
        }

        currentPage = Math.min(currentPage, maxPage);

        if (pages) {
            const visiblePages = getPages(currentPage, maxPage, 5);
            const pageButtons = visiblePages.map((page) => {
                const pageButton = createPage ? createPage(page) : createPageButton(page);
                const input = pageButton.querySelector('input');
                const pageText = pageButton.querySelector('span');

                if (input) {
                    input.name = 'page';
                    input.value = String(page);
                    input.checked = page === currentPage;
                }

                if (pageText) {
                    pageText.textContent = String(page);
                }

                pageButton.classList.toggle('active', page === currentPage);
                pageButton.setAttribute('aria-label', `Goto page ${page}`);
                return pageButton;
            });

            pages.replaceChildren(...pageButtons);
        }

        if (rowsPerPage) {
            rowsPerPage.value = String(limit);
        }

        if (fromRow) {
            fromRow.textContent = total ? (currentPage - 1) * limit + 1 : 0;
        }

        if (toRow) {
            toRow.textContent = Math.min(total, currentPage * limit);
        }

        if (totalRows) {
            totalRows.textContent = String(total);
        }

        return data.slice((currentPage - 1) * limit, currentPage * limit);
    }
}