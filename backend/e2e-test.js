const BASE = 'http://localhost:5000/api';

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

async function get(path, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(BASE + path, { headers });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

(async () => {
  try {
    console.log('1) Login as guru (nip=G1001)');
    const loginGuru = await post('/login-guru', { nip: 'G1001', password: 'password123' });
    console.log('  ->', loginGuru.ok ? 'OK' : 'FAIL', loginGuru.status, loginGuru.data?.message || loginGuru.data);
    if (!loginGuru.ok) return process.exit(1);
    const guruToken = loginGuru.data.token;

    console.log('2) Fetch guru dashboard');
    const dashGuru = await get('/guru/dashboard', guruToken);
    console.log('  ->', dashGuru.ok ? 'OK' : 'FAIL', dashGuru.status);
    console.log('     dashboard keys:', Object.keys(dashGuru.data || {}));

    console.log('3) Fetch guru jadwal');
    const jadwal = await get('/guru/jadwal', guruToken);
    console.log('  ->', jadwal.ok ? 'OK' : 'FAIL', jadwal.status, `items=${(jadwal.data||[]).length}`);

    console.log('4) Fetch kelas detail for first kelas if any');
    const kelasList = Array.from(new Set(((jadwal.data||[]).map(it=>it.kelas))));
    console.log('  -> kelasList:', kelasList);
    let siswaId;
    if (kelasList.length) {
      const kelas = kelasList[0];
      const kelasDet = await get(`/guru/kelas/${encodeURIComponent(kelas)}`, guruToken);
      console.log('  -> kelas detail ok:', kelasDet.ok, `items=${(kelasDet.data||[]).length}`);
      if (kelasDet.ok && (kelasDet.data||[]).length) siswaId = kelasDet.data[0].id;
    }

    if (siswaId) {
      console.log('5) Input nilai for siswaId', siswaId);
      const nilaiRes = await post('/guru/nilai', { siswaId, tugas: 70, uts: 75, uas: 80 });
      console.log('  ->', nilaiRes.ok ? 'OK' : 'FAIL', nilaiRes.status, nilaiRes.data);

      console.log('6) Catat absensi for siswaId', siswaId);
      const absRes = await fetch(BASE + '/guru/absensi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${guruToken}` },
        body: JSON.stringify({ siswaId, tanggal: new Date().toISOString().slice(0,10), jam: '08:00', status: 'Hadir', keterangan: 'Auto-test' })
      });
      const absData = await absRes.json().catch(()=>null);
      console.log('  ->', absRes.ok ? 'OK' : 'FAIL', absRes.status, absData);
    } else {
      console.log('No siswa found to test input nilai/absensi');
    }

    console.log('\nNow login as siswa (nis=S1001)');
    const loginSiswa = await post('/login-siswa', { nis: 'S1001', password: 'password123' });
    console.log('  ->', loginSiswa.ok ? 'OK' : 'FAIL', loginSiswa.status, loginSiswa.data?.message || loginSiswa.data);
    if (!loginSiswa.ok) return process.exit(1);
    const siswaToken = loginSiswa.data.token;

    console.log('7) Fetch siswa dashboard');
    const dashSiswa = await get('/siswa/dashboard', siswaToken);
    console.log('  ->', dashSiswa.ok ? 'OK' : 'FAIL', dashSiswa.status, Object.keys(dashSiswa.data||{}));

    console.log('8) Fetch siswa absensi riwayat');
    const absRiwayat = await get('/siswa/absensi', siswaToken);
    console.log('  ->', absRiwayat.ok ? 'OK' : 'FAIL', absRiwayat.status, `items=${(absRiwayat.data||[]).length}`);

    console.log('\nE2E test finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('E2E error', err);
    process.exit(1);
  }
})();
