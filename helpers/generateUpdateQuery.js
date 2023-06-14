const db = require("../db")
const { NotFoundError } = require("../error")

async function generateUpdateQuery(data, fromTableName, columnName, query, values, index) {

    if (data) {
        const id = await db.query(
            `SELECT id 
                FROM ${fromTableName}
                WHERE name=$1`, [data]
        )
        if (id.rows.length === 0) {
            throw new NotFoundError
        }

        query += index == 2 ? '' : ','
        query += ` ${columnName}= $${index}`
        index++
        values.push(id.rows[0].id)
    }
    return [query, values, index]
}

function addTextValuesToQuery(data, columnName, query, values, index) {
    if (data) {
        query += `, ${columnName}=$${index}`;
        values.push(data);
        index++;
    }
    return [query, values, index];
}

/**
 * 
 * @param {data} data from user input in an array 
 * @param {id} user id, post id, entity id 
 * @param {tableName} name of table to get ids from
 * @param {manyTableName} name of the many to many table  
 * @param {col1} column of many to many table (this is to indicate the entity id above)
 * @param {col2} column of many to many table  (this is to store id of the item selected)
 */

async function updateManyToMany(data, id, tableName, manyTableName, col1, col2) {

    if (data) {


        //get all ids
        let allIds = await db.query(`
            SELECT id FROM ${tableName}
        `);
        allIds = allIds.rows.map(i => i.id);


        //get all user input ids
        let userIds = await Promise.all(data.map(async (i) => {

            let ids = await db.query(
                `SELECT id 
                        FROM ${tableName}
                        WHERE name = $1`, [i]
            );

            return ids.rows[0].id;
        }));

        //for each id in tableName, did the user select it?

        allIds.forEach(async (i) => {

            if (userIds.includes(i)) {
                let result = await db.query(
                    `INSERT INTO ${manyTableName} (${col1},${col2})
                    SELECT $1,$2
                    WHERE NOT EXISTS (SELECT ${col1} FROM ${manyTableName} WHERE ${col1}=$1 AND ${col2}=$2)`, [id, i]
                );

            } else {

                //delete if it is in db
                let result = await db.query(
                    `DELETE FROM ${manyTableName} WHERE ${col1}=$1 AND ${col2}=$2`, [id, i]
                );
            };
        });
    } else {
        //not in table so just delete all rows with id
        let result = await db.query(
            `DELETE FROM ${manyTableName} WHERE ${col1}=$1`, [id]
        );
    };


};

async function insertCountryStateCity(dataEN, dataJA, tableName, userCol, id = null, col = null, query, values, index) {
    if (dataEN && dataJA) {
        let colName = '';
        let parameter = '';
        let parameterArray = [dataEN, dataJA];

        if (id) {
            //we want to insert an extra piece of data
            colName = `, ${col}`
            parameter = ',$3'
            parameterArray.push(id)
            console.log('not here')
        };

        //if already in db, we just return the id, otherwise we insert it
        let returnid;
        returnid = await db.query(
            `SELECT id FROM ${tableName} WHERE name_en=$1`, [dataEN]
        );

        if (!returnid.rows.length > 0) {
            returnid = await db.query(
                `INSERT INTO ${tableName} (name_en,name_ja ${colName})
            (SELECT CAST($1 AS VARCHAR),$2 ${parameter}) RETURNING id
            `, parameterArray
            );
        };

        query += index == 2 ? '' : ',';
        query += ` ${userCol}= $${index}`;
        index++;

        values.push(returnid.rows[0].id);
        console.log('values in function is', values);
        console.log('query is', query)
        return [query, values, index, returnid.rows[0].id];
    } else {
        //there's no data that means delete
        //if it is a country, we delete all country, state, city
        //if it is a state, we delete state, city
        //if it is a city, we delete just city
        if (tableName == "countries") {
            query += ` ${userCol}= $${index}`;
            index++;
            values.push(null)
        }
        return [query, values, index, null];
    }
}

async function deleteCountryStateCity() {

}

module.exports = {
    generateUpdateQuery,
    addTextValuesToQuery,
    updateManyToMany,
    insertCountryStateCity
};