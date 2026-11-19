export function initSearching(searchField) {
    return (query, state) => {
        const search = String(state?.[searchField] ?? '').trim();
        return search ? Object.assign({}, query, {search}) : query;
    };
}