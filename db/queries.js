const pool = require("./pool");

async function testConnection() {

    const { rows } = await pool.query("SELECT NOW();");

    return rows;
}

module.exports = {
    testConnection,
};