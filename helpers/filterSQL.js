function arrayWhereClause(arr, criteriaName, filters, index, values) {

    if (arr !== undefined && arr.length > 0) {
        arr.forEach((l, idx) => {
            if (idx === 0) {
                filters += ` AND (`
            }

            if ((idx !== arr.length - 1 && arr[idx + 1])) {
                //if this is not the last one
                filters += ` ${criteriaName} = $${index} OR `
                values.push(l)
                index++

            } else {
                filters += ` ${criteriaName} = $${index} `
                values.push(l)
                index++
            }

            if (idx === arr.length - 1) {

                //this is the last one
                filters += ` ) `

            }

        })
    };
    return [filters, index, values];
}

module.exports = { arrayWhereClause }