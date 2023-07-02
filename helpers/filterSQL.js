function arrayWhereClause(arr, criteriaName, filters, index, values) {
    console.log('arr to pass in is', arr)
    if (arr !== undefined && arr.length > 0) {
        arr.forEach((l, idx) => {
            if (idx === 0) {
                filters += ` AND (`
            }

            else if ((idx !== arr.length - 1 && arr[idx + 1])) {
                //if this is not the last one
                filters += `${criteriaName} = $${index} OR `
                values.push(l)
                index++

            } else if (idx === arr.length - 1) {

                //this is the last one
                filters += ` ${criteriaName} = $${index} ) `
                values.push(l)
                index++
            }

        })
    };
    return [filters, index, values];
}

module.exports = { arrayWhereClause }