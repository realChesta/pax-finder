
let stores = false;

const getStoresInfo = async () => {
    // try https://api.allorigins.win/raw?url=https://www.ikea.com/ch/en/meta-data/navigation/stores-detailed.json
    if (!stores) {
        stores = localStorage.getItem('stores');
        if (stores) {
            stores = JSON.parse(stores);
        }
        else {
            let res = await fetch('https://api.allorigins.win/raw?url=https://www.ikea.com/ch/en/meta-data/navigation/stores-detailed.json');
            stores = await res.json();
            localStorage.setItem('stores', JSON.stringify(stores));
        }
    }
    return stores;
}

const getArticlesFromPaxCode = async (pax) => {
    let res = await fetch(`https://api.dexf.ikea.com/vpc/v1/configurations/retailunit/CH/locale/en-CH/${pax}`, {
        headers: {
            'Dexf-Api-Key': '5bf70f96-11aa-4773-a4dd-f67330b651ee'
        }
    })
    res = await res.json();
    return res.itemList.item;

    // returns list of objects in the shape:
    // {itemType: 'ART', itemNo: '40201723', quantity: 1};
};

const getItemDetails = async (itemNos) => {
    let res = await fetch(`https://api.ingka.ikea.com/salesitem/communications/ru/ch?itemNos=${itemNos.join(',')}`, {
        headers: {
            'X-Client-Id': 'c4faceb6-0598-44a2-bae4-2c02f4019d06',
            'Accept': 'application/json;version=2'
        }
    });
    res = await res.json();
    return res.data;
};

const getItemAvailabilities = async (itemNos, zip) => {
    // get store availabilities first
    let storeRes = await fetch(`https://api.ingka.ikea.com/cia/availabilities/ru/ch?itemNos=${itemNos.join(',')}&zip=${zip}&expand=StoresList,Restocks`, {
        headers: {
            'X-Client-Id': 'b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631',
            'Accept': 'application/json;version=2'
        }
    });
    storeRes = await storeRes.json();

    return storeRes.availabilities;
};

export const pax = {getArticlesFromPaxCode};
export const item = {getItemDetails, getItemAvailabilities};
export const misc = {getStoresInfo};

export default {pax, item, misc};