const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'WISATA BATU DATABASE',
    password: 'rizky1',
    port: 5433,
});

app.get('/wisata', async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM wisatabatu
        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).send('Server Error');

    }

});

app.listen(3000, () => {

    console.log('Server running on port 3000');

});