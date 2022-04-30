
const formatItemName = (details) => {
    let localized = details.localisedCommunications.find(i => i.languageCode === 'en');

    let res = `${localized.productName} ${localized.productType.name}`;

    if (localized.measurements.referenceMeasurements) {
        res += ' ' + localized.measurements.referenceMeasurements[0].metric;
    }

    return res;
};

const formatItemNumber = (itemNo) => {
    let is = itemNo.toString();
    return `${is.slice(0, 3)}.${is.slice(3, 6)}.${is.slice(6)}`;
};

const getStoreName = (stores, id) => stores.find(s => s.id === id).displayName;

export default {
    formatItemName,
    formatItemNumber,
    getStoreName
}