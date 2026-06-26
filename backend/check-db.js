const { query } = require('./db');

const checkData = async () => {
  console.log('=== CHECKING DATABASE DATA ===\n');

  try {
    const [users] = await query('SELECT * FROM users');
    console.log('USERS:', users);

    const [siswa] = await query('SELECT * FROM siswa');
    console.log('\nSISWA:', siswa);

    const [guru] = await query('SELECT * FROM guru');
    console.log('\nGURU:', guru);

    const [siswaWithUser] = await query('SELECT s.*, u.email, u.password FROM siswa s JOIN users u ON s.user_id = u.id');
    console.log('\nSISWA WITH USER:', siswaWithUser);
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  process.exit(0);
};

checkData();
