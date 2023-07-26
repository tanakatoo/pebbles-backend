const db = require("../db")
const { NotFoundError } = require("../error")
const pg = require('pg')

async function generateUpdateQuery(data, fromTableName, columnName, query, values, index) {


    if (data) {

        const id = await db.query(
            `SELECT id 
                FROM ${fromTableName}
                WHERE name=$1`, [data]
        );
        if (id.rows.length === 0) {
            throw new NotFoundError;
        };

        values.push(id.rows[0].id);

    } else if (data === '') {

        values.push(null);
    }
    query += index === 1 ? '' : ',';
    query += ` ${columnName}= $${index}`;
    index = index + 1;
    return [query, values, index];
}



function addTextValuesToQuery(data, columnName, query, values, index) {
    if (data) {
        values.push(data);
    }
    else if (data === '') {
        values.push(null);
    }
    query += `, ${columnName}=$${index}`;
    index++;
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
            console.log(ids.rows[0])
            return ids.rows[0].id;
        })).catch((error) => console.log("error", error));

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

    let colName = '';
    let parameter = '';
    let parameterArray = [dataEN, dataJA];

    if (id) {
        //we want to insert an extra piece of data
        colName = `, ${col}`
        parameter = ',$3'
        parameterArray.push(id)

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

    query += index == 1 ? '' : ',';
    query += ` ${userCol}= $${index}`;
    index++;

    values.push(returnid.rows[0].id);
    return [query, values, index, returnid.rows[0].id];

}


module.exports = {
    generateUpdateQuery,
    addTextValuesToQuery,
    updateManyToMany,
    insertCountryStateCity
};