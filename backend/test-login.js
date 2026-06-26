const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login-siswa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nis: 'S1001', password: 'password123' })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  process.exit(0);
};

testLogin();
