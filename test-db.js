const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_onT1hpKRH9qM@ep-lucky-art-a1yrgcq7-pooler.ap-southeast-1.aws.neon.tech/neondb',
  ssl: { rejectUnauthorized: false }
});
client.connect().then(() => {
  client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'").then(res => {
    console.log("Tables in DB:", res.rows.map(r => r.table_name));
    process.exit(0);
  });
}).catch(console.error);
