const readableDate = (createdAt) => {
    const date = new Date(createdAt);
    const readableTime = date.toLocaleTimeString('en-US', {hour:'numeric', second:'numeric', minute:'numeric'});
    const readableDate = date.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', hour12: 'true' });
    const day = readableDate.split(' ')[1];
    const month = readableDate.split(' ')[0];
    const year = date.getFullYear();
    return {
        year,
        day,
        month,
        readableTime
    }
}
export {readableDate}