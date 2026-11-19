const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData() {
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    const mapRecords = (data) => data.map((item) => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    const getIndexes = async () => {
        if (!sellers || !customers) {
            const fetchIndex = async (url) => {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Index request failed: ${response.status}`);
                }
                return response.json();
            };

            [sellers, customers] = await Promise.all([
                fetchIndex(`${BASE_URL}/sellers`),
                fetchIndex(`${BASE_URL}/customers`)
            ]);
        }

        return {sellers, customers};
    };

    const getRecords = async (query, isUpdated = false) => {
        await getIndexes();

        const nextQuery = new URLSearchParams(query).toString();

        if (lastQuery === nextQuery && !isUpdated) {
            return lastResult;
        }

        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        if (!response.ok) {
            throw new Error(`Records request failed: ${response.status}`);
        }

        const records = await response.json();

        lastQuery = nextQuery;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords
    };
}