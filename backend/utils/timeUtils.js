exports.calculateTAT = (entryTime, exitTime) => {
    if (!entryTime || !exitTime) return null;
    const tat = (new Date(exitTime) - new Date(entryTime)) / (1000 * 60); // Minutes
    return { entryTime, exitTime, tat: `${tat.toFixed(2)} minutes` };
};
