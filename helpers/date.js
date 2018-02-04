let getDateString = () => {
    let date = new Date().toISOString();
    return date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2);
};

let addOffsetToDate = (timeOffset) => {
    return new Date(new Date().getTime() + timeOffset);
};

module.exports = { getDateString, addOffsetToDate };
