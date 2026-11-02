export function initFiltering(elements, indexes) {
    const sellerOptions = Object.values(indexes?.sellers ?? {});
    const sellerSelect = elements.searchBySeller;

    if (sellerSelect) {
        sellerSelect.innerHTML = '<option value="">—</option>' + sellerOptions
            .map((seller) => `<option value="${seller}">${seller}</option>`)
            .join('');
    }

    return (data, state, action) => {
        if (action && action.name === 'clear') {
            const {field} = action.dataset || {};

            if (field === 'date') {
                elements.searchByDate.value = '';
            }

            if (field === 'customer') {
                elements.searchByCustomer.value = '';
            }

            if (field === 'seller') {
                elements.searchBySeller.value = '';
            }

            if (field === 'total') {
                elements.totalFrom.value = '';
                elements.totalTo.value = '';
            }
        }

        const filters = {
            date: String(state?.date ?? '').trim().toLowerCase(),
            customer: String(state?.customer ?? '').trim().toLowerCase(),
            seller: String(state?.seller ?? '').trim().toLowerCase(),
            totalFrom: state?.totalFrom === '' || state?.totalFrom === undefined || state?.totalFrom === null
                ? null
                : Number(state.totalFrom),
            totalTo: state?.totalTo === '' || state?.totalTo === undefined || state?.totalTo === null
                ? null
                : Number(state.totalTo)
        };

        return data.filter((item) => {
            if (filters.date && !String(item.date).toLowerCase().includes(filters.date)) {
                return false;
            }

            if (filters.customer && !String(item.customer).toLowerCase().includes(filters.customer)) {
                return false;
            }

            if (filters.seller && String(item.seller).toLowerCase() !== filters.seller) {
                return false;
            }

            if (filters.totalFrom !== null && !Number.isNaN(filters.totalFrom) && Number(item.total) < filters.totalFrom) {
                return false;
            }

            if (filters.totalTo !== null && !Number.isNaN(filters.totalTo) && Number(item.total) > filters.totalTo) {
                return false;
            }

            return true;
        });
    }
}