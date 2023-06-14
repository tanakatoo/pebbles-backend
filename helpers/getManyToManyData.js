const db = require('../db')


/**
 * To get names of user selections from a many to many table with only ids
 * 
 * @param {tableName} name of table to get data from (must have an id column and a name column)
 * @param {manyTableName} the many to many table name  
 * @param {col1} entity to get data for, their column name
 * * @param {col2} column to get data from tableName for
 * * @param {id} entity to get data for (e.g. user, post)
 */
async function getManyToManyData(tableName, manyTableName, col1, col2, id) {

    const names = await db.query(
        `SELECT a.name FROM ${tableName} a
        INNER JOIN ${manyTableName} m on m.${col2}=a.id
        WHERE m.${col1}=$1`, [id]
    );
    return names.rows
}
module.exports = { getManyToManyData }