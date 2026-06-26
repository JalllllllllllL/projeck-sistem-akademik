<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import LoadingSpinner from '../components/LoadingSpinner.svelte';
  import { apiFetch } from '../lib/api.js';

  export let auth;
  const dispatch = createEventDispatcher();

  let page = 'overview';
  let dashboard = null;
  let jadwal = [];
  let nilai = null;
  let profil = null;
  let absensi = [];
  let berita = [];
  let ranking = [];
  let kelasDetail = [];
  let kelasList = [];
  let selectedKelas = '';
  let nilaiForm = { siswaId: '', tugas: '', uts: '', uas: '' };
  let absensiForm = { siswaId: '', tanggal: '', jam: '', status: 'Hadir', keterangan: '' };
  let profileForm = { nama: '', email: '', kelas: '', jenis_kelamin: '', nip: '', mata_pelajaran: '' };
  let passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
  let showPasswordForm = false;
  let weightForm = { bobotAkademik: 0.7, bobotKeteladanan: 0.3 };
  let loading = true;
  let error = '';
  let successMessage = '';

  const authHeader = { Authorization: `Bearer ${auth.token}` };

  const resetProfileForm = () => {
    profileForm = {
      nama: profil?.nama || '',
      email: profil?.email || '',
      kelas: profil?.kelas || '',
      jenis_kelamin: profil?.jenis_kelamin || '',
      nip: profil?.nip || '',
      mata_pelajaran: profil?.mata_pelajaran || ''
    };
  };

  const fetchDashboard = async () => {
    loading = true;
    error = '';

    try {
      const response = await apiFetch(`/${auth.user.role}/dashboard`, { headers: authHeader });
      if (!response.ok) throw new Error(response.data?.message || 'Gagal memuat dashboard');
      dashboard = response.data;
      if (response.data.jadwal) {
        jadwal = response.data.jadwal;
      }
      if (response.data.berita) {
        berita = response.data.berita;
      }
      if (auth.user.role === 'guru') {
        kelasList = Array.from(new Set((response.data.jadwal || []).map((item) => item.kelas)));
      }
      if (auth.user.role === 'siswa') {
        profileForm = {
          nama: response.data.siswa?.nama || '',
          email: response.data.siswa?.email || '',
          kelas: response.data.siswa?.kelas || '',
          jenis_kelamin: response.data.siswa?.jenis_kelamin || '',
          nip: '',
          mata_pelajaran: ''
        };
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  };

  const loadPage = async (target) => {
    page = target;
    successMessage = '';
    error = '';

    if (target === 'jadwal') {
      const response = await apiFetch(`/${auth.user.role}/jadwal`, { headers: authHeader });
      if (!response.ok) return error = response.data?.message || 'Gagal memuat jadwal';
      jadwal = response.data;
    }

    if (target === 'nilai') {
      const response = await apiFetch(`/${auth.user.role}/nilai`, { headers: authHeader });
      if (!response.ok) return error = response.data?.message || 'Gagal memuat nilai';
      nilai = response.data;
    }

    if (target === 'profil') {
      const response = await apiFetch(`/${auth.user.role}/profil`, { headers: authHeader });
      if (!response.ok) return error = response.data?.message || 'Gagal memuat profil';
      profil = response.data;
      resetProfileForm();
    }

    if (target === 'absensi' && auth.user.role === 'siswa') {
      const response = await apiFetch('/siswa/absensi', { headers: authHeader });
      if (!response.ok) return error = response.data?.message || 'Gagal memuat absensi';
      absensi = response.data;
    }

    if (target === 'berita') {
      const response = await apiFetch('/berita', { headers: authHeader });
      if (!response.ok) return error = response.data?.message || 'Gagal memuat berita';
      berita = response.data;
    }

    if (target === 'ranking') {
      const response = await apiFetch('/ranking', { headers: authHeader });
      if (!response.ok) return error = response.data?.message || 'Gagal memuat ranking';
      ranking = response.data;
      if (response.data.length) {
        weightForm = {
          bobotAkademik: Number(response.data[0].bobot_akademik) || weightForm.bobotAkademik,
          bobotKeteladanan: Number(response.data[0].bobot_keteladanan) || weightForm.bobotKeteladanan
        };
      }
    }

    if (target === 'kelas' && auth.user.role === 'guru') {
      kelasDetail = [];
      selectedKelas = '';
      if (!kelasList.length) {
        const response = await apiFetch('/guru/jadwal', { headers: authHeader });
        if (!response.ok) return error = response.data?.message || 'Gagal memuat daftar kelas';
        kelasList = Array.from(new Set(response.data.map((item) => item.kelas)));
      }
    }
  };

  const fetchKelasDetail = async (kelas) => {
    selectedKelas = kelas;
    const response = await apiFetch(`/guru/kelas/${kelas}`, { headers: authHeader });
    if (!response.ok) return error = response.data?.message || 'Gagal memuat detail kelas';
    kelasDetail = response.data;
    nilaiForm = { siswaId: '', tugas: '', uts: '', uas: '' };
  };

  const setStudentForNilai = (siswaId) => {
    nilaiForm.siswaId = siswaId;
  };

  const submitNilai = async () => {
    successMessage = '';
    error = '';
    if (!nilaiForm.siswaId) return error = 'Silakan pilih ID siswa terlebih dahulu';
    const response = await apiFetch('/guru/nilai', {
      method: 'POST',
      headers: authHeader,
      body: {
        siswaId: nilaiForm.siswaId,
        tugas: Number(nilaiForm.tugas),
        uts: Number(nilaiForm.uts),
        uas: Number(nilaiForm.uas)
      }
    });
    if (!response.ok) return error = response.data?.message || 'Gagal menyimpan nilai';
    successMessage = 'Nilai berhasil disimpan';
  };

  const submitAbsensi = async () => {
    successMessage = '';
    error = '';
    const response = await apiFetch('/guru/absensi', {
      method: 'PUT',
      headers: authHeader,
      body: absensiForm
    });
    if (!response.ok) return error = response.data?.message || 'Gagal mencatat absensi';
    successMessage = 'Absensi berhasil dicatat';
  };

  const updateProfile = async () => {
    successMessage = '';
    error = '';
    const updateBody = auth.user.role === 'siswa'
      ? { nama: profileForm.nama, kelas: profileForm.kelas, jenisKelamin: profileForm.jenis_kelamin }
      : { nama: profileForm.nama, mataPelajaran: profileForm.mata_pelajaran };
    const response = await apiFetch(`/${auth.user.role}/profil`, {
      method: 'PUT',
      headers: authHeader,
      body: updateBody
    });
    if (!response.ok) return error = response.data?.message || 'Gagal memperbarui profil';
    profil = response.data.data || response.data;
    resetProfileForm();
    successMessage = 'Profil berhasil diperbarui';
  };

  const changePassword = async () => {
    successMessage = '';
    error = '';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return error = 'Password baru dan konfirmasinya tidak cocok';
    }
    const response = await apiFetch(`/${auth.user.role}/change-password`, {
      method: 'PUT',
      headers: authHeader,
      body: { oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword }
    });
    if (!response.ok) return error = response.data?.message || 'Gagal mengubah password';
    passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
    showPasswordForm = false;
    successMessage = 'Password berhasil diubah';
  };

  const updateWeights = async () => {
    successMessage = '';
    error = '';
    const response = await apiFetch('/ranking/weights', {
      method: 'PUT',
      headers: authHeader,
      body: {
        bobotAkademik: Number(weightForm.bobotAkademik),
        bobotKeteladanan: Number(weightForm.bobotKeteladanan)
      }
    });
    if (!response.ok) return error = response.data?.message || 'Gagal memperbarui bobot';
    successMessage = 'Bobot ranking diperbarui';
  };

  const recalculateRanking = async () => {
    successMessage = '';
    error = '';
    const response = await apiFetch('/ranking/recalculate', {
      method: 'POST',
      headers: authHeader
    });
    if (!response.ok) return error = response.data?.message || 'Gagal menghitung ulang ranking';
    successMessage = 'Ranking berhasil dihitung ulang';
  };

  const goToOverview = () => {
    page = 'overview';
  };

  onMount(fetchDashboard);
</script>

<section style="margin-top:2rem;">
  {#if loading}
    <LoadingSpinner />
  {:else if error}
    <p style="color:#dc2626;">{error}</p>
  {:else}
    <header class="card" style="margin-bottom:1rem;">
      <h2>Dashboard {auth.user.role === 'siswa' ? 'Siswa' : 'Guru'}</h2>
      <div class="tab-nav">
        <button class="tab-button" class:active={page === 'overview'} on:click={goToOverview}>Overview</button>
        <button class="tab-button" class:active={page === 'jadwal'} on:click={() => loadPage('jadwal')}>Jadwal</button>
        <button class="tab-button" class:active={page === 'berita'} on:click={() => loadPage('berita')}>Berita</button>
        <button class="tab-button" class:active={page === 'profil'} on:click={() => loadPage('profil')}>Profil</button>
        {#if auth.user.role === 'siswa'}
          <button class="tab-button" class:active={page === 'nilai'} on:click={() => loadPage('nilai')}>Nilai</button>
          <button class="tab-button" class:active={page === 'absensi'} on:click={() => loadPage('absensi')}>Absensi</button>
        {:else}
          <button class="tab-button" class:active={page === 'ranking'} on:click={() => loadPage('ranking')}>Ranking</button>
          <button class="tab-button" class:active={page === 'kelas'} on:click={() => loadPage('kelas')}>Kelas</button>
          <button class="tab-button" class:active={page === 'input-nilai'} on:click={() => page = 'input-nilai'}>Input Nilai</button>
          <button class="tab-button" class:active={page === 'absensi-guru'} on:click={() => page = 'absensi-guru'}>Absensi</button>
        {/if}
      </div>
    </header>

    {#if page === 'overview'}
      <div class="grid-2" style="gap:1rem; margin-bottom:1rem;">
        <article class="card">
          <h3>Profil</h3>
          <p>{auth.user.role === 'siswa' ? dashboard.siswa.nama : dashboard.guru.nama}</p>
          <p>{auth.user.role === 'siswa' ? `Kelas: ${dashboard.siswa.kelas}` : `Mata Pelajaran: ${dashboard.guru.mata_pelajaran}`}</p>
          <p>{auth.user.role === 'siswa' ? dashboard.siswa.jenis_kelamin : ''}</p>
        </article>
        <article class="card">
          <h3>Berita Terbaru</h3>
          {#each berita as item}
            <article style="margin-bottom:1rem;">
              <strong>{item.judul}</strong>
              <p style="font-size:0.95rem; color:#475569;">{item.tanggal_publikasi}</p>
            </article>
          {/each}
        </article>
      </div>

      {#if auth.user.role === 'siswa'}
        <div class="grid-3" style="gap:1rem; margin-bottom:1rem;">
          <article class="card">
            <h3>Statistik Kehadiran</h3>
            <ul style="list-style:none; padding-left:0;">
              <li>Hadir: {dashboard.absensiSummary.hadir || 0}</li>
              <li>Izin: {dashboard.absensiSummary.izin || 0}</li>
              <li>Sakit: {dashboard.absensiSummary.sakit || 0}</li>
              <li>Alpha: {dashboard.absensiSummary.alpha || 0}</li>
            </ul>
          </article>
          <article class="card">
            <h3>Nilai</h3>
            <p>Tugas: {dashboard.nilai?.tugas ?? '-'}</p>
            <p>UTS: {dashboard.nilai?.uts ?? '-'}</p>
            <p>UAS: {dashboard.nilai?.uas ?? '-'}</p>
            <p>Nilai Akhir: {dashboard.nilai?.nilai_akhir ?? '-'}</p>
          </article>
          <article class="card">
            <h3>Ranking</h3>
            <p>{dashboard.ranking?.ranking_score ?? '-'}</p>
          </article>
        </div>
      {:else}
        <div class="grid-2" style="gap:1rem; margin-bottom:1rem;">
          <article class="card">
            <h3>Ringkasan Guru</h3>
            <p>Kelas diajar: {dashboard.jumlahKelas}</p>
            <p>Jumlah siswa: {dashboard.jumlahSiswa}</p>
          </article>
          <article class="card">
            <h3>Jadwal Hari Ini</h3>
            {#each dashboard.jadwal.slice(0, 3) as item}
              <p>{item.hari} - {item.jam}: {item.mata_pelajaran}</p>
            {/each}
          </article>
        </div>
      {/if}
    {/if}

    {#if page === 'jadwal'}
      <article class="card">
        <h3>Jadwal {auth.user.role === 'siswa' ? 'Pelajaran' : 'Mengajar'}</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Hari</th>
              <th>Jam</th>
              <th>Mata Pelajaran</th>
              {#if auth.user.role === 'siswa'}<th>Guru</th>{/if}
            </tr>
          </thead>
          <tbody>
            {#each jadwal as item}
              <tr>
                <td>{item.hari}</td>
                <td>{item.jam}</td>
                <td>{item.mata_pelajaran}</td>
                {#if auth.user.role === 'siswa'}<td>{item.guru}</td>{/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </article>
    {/if}

    {#if page === 'nilai' && auth.user.role === 'siswa'}
      <article class="card">
        <h3>Nilai Akademik</h3>
        <p>Tugas: {nilai?.tugas ?? '-'}</p>
        <p>UTS: {nilai?.uts ?? '-'}</p>
        <p>UAS: {nilai?.uas ?? '-'}</p>
        <p>Nilai Akhir: {nilai?.nilai_akhir ?? '-'}</p>
      </article>
    {/if}

    {#if page === 'profil'}
      <article class="card">
        <h3>Profil</h3>
        <div class="form-group">
          <label for="profileName">Nama</label>
          <input id="profileName" bind:value={profileForm.nama} />
        </div>
        <div class="form-group">
          <label for="profileEmail">Email</label>
          <input id="profileEmail" type="email" value={profileForm.email} disabled />
        </div>
        {#if auth.user.role === 'siswa'}
          <div class="form-group">
            <label for="profileKelas">Kelas</label>
            <input id="profileKelas" bind:value={profileForm.kelas} />
          </div>
          <div class="form-group">
            <label for="profileGender">Jenis Kelamin</label>
            <select id="profileGender" bind:value={profileForm.jenis_kelamin}>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        {:else}
          <div class="form-group">
            <label for="profileNip">NIP</label>
            <input id="profileNip" type="text" value={profileForm.nip} disabled />
          </div>
          <div class="form-group">
            <label for="profileMapel">Mata Pelajaran</label>
            <input id="profileMapel" bind:value={profileForm.mata_pelajaran} />
          </div>
        {/if}
        <button on:click={updateProfile}>Perbarui Profil</button>
        <button type="button" style="margin-left:1rem;" on:click={() => showPasswordForm = !showPasswordForm}>
          {showPasswordForm ? 'Batal Ubah Password' : 'Ubah Password'}
        </button>
        {#if showPasswordForm}
          <div style="margin-top:1rem;">
            <div class="form-group">
              <label for="oldPassword">Password Lama</label>
              <input id="oldPassword" type="password" bind:value={passwordForm.oldPassword} />
            </div>
            <div class="form-group">
              <label for="newPassword">Password Baru</label>
              <input id="newPassword" type="password" bind:value={passwordForm.newPassword} />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Konfirmasi Password Baru</label>
              <input id="confirmPassword" type="password" bind:value={passwordForm.confirmPassword} />
            </div>
            <button on:click={changePassword}>Simpan Password Baru</button>
          </div>
        {/if}
      </article>
    {/if}

    {#if page === 'absensi' && auth.user.role === 'siswa'}
      <article class="card">
        <h3>Riwayat Absensi</h3>
        <table class="table">
          <thead>
            <tr><th>Tanggal</th><th>Jam</th><th>Status</th><th>Keterangan</th></tr>
          </thead>
          <tbody>
            {#each absensi as item}
              <tr>
                <td>{item.tanggal}</td>
                <td>{item.jam}</td>
                <td>{item.status}</td>
                <td>{item.keterangan}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </article>
    {/if}

    {#if page === 'berita'}
      <article class="card">
        <h3>Berita Sekolah</h3>
        {#each berita as item}
          <article style="margin-bottom:1.25rem;">
            <h4>{item.judul}</h4>
            <p style="font-size:0.95rem; color:#475569;">{item.tanggal_publikasi}</p>
            <p>{item.isi}</p>
          </article>
        {/each}
      </article>
    {/if}

    {#if page === 'kelas' && auth.user.role === 'guru'}
      <article class="card">
        <h3>Detail Kelas</h3>
        <div class="form-group">
          <label for="kelasSelect">Pilih Kelas</label>
          <select id="kelasSelect" bind:value={selectedKelas} on:change={() => fetchKelasDetail(selectedKelas)}>
            <option value="" disabled selected>Pilih kelas</option>
            {#each kelasList as kelas}
              <option value={kelas}>{kelas}</option>
            {/each}
          </select>
        </div>
        {#if selectedKelas}
          <p>Menampilkan siswa untuk kelas <strong>{selectedKelas}</strong></p>
          <table class="table">
            <thead>
              <tr><th>ID</th><th>Nama</th><th>NIS</th><th>Jenis Kelamin</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {#each kelasDetail as siswa}
                <tr>
                  <td>{siswa.id}</td>
                  <td>{siswa.nama}</td>
                  <td>{siswa.nis}</td>
                  <td>{siswa.jenis_kelamin}</td>
                  <td>
                    <button on:click={() => setStudentForNilai(siswa.id)} style="padding:0.5rem 0.75rem;">Pilih untuk Input Nilai</button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </article>
    {/if}

    {#if page === 'ranking' && auth.user.role === 'guru'}
      <article class="card">
        <h3>Ranking Kelas</h3>
        <div class="grid-2" style="gap:1rem; margin-bottom:1rem;">
          <div>
            <label for="bobotAkademik">Bobot Akademik</label>
            <input id="bobotAkademik" type="number" step="0.01" min="0" max="1" bind:value={weightForm.bobotAkademik} />
          </div>
          <div>
            <label for="bobotKeteladanan">Bobot Keteladanan</label>
            <input id="bobotKeteladanan" type="number" step="0.01" min="0" max="1" bind:value={weightForm.bobotKeteladanan} />
          </div>
        </div>
        <button on:click={updateWeights}>Simpan Bobot</button>
        <button style="margin-left:1rem;" on:click={recalculateRanking}>Hitung Ulang Ranking</button>
        <table class="table" style="margin-top:1rem;">
          <thead><tr><th>Nama</th><th>Kelas</th><th>Skor</th></tr></thead>
          <tbody>
            {#each ranking as item}
              <tr><td>{item.nama}</td><td>{item.kelas}</td><td>{item.ranking_score}</td></tr>
            {/each}
          </tbody>
        </table>
      </article>
    {/if}

    {#if page === 'input-nilai' && auth.user.role === 'guru'}
      <article class="card">
        <h3>Input Nilai Siswa</h3>
        <div class="form-group">
          <label for="siswaId">Siswa ID</label>
          <input id="siswaId" bind:value={nilaiForm.siswaId} placeholder="Masukkan ID siswa" />
        </div>
        <div class="form-group">
          <label for="tugas">Nilai Tugas</label>
          <input id="tugas" type="number" bind:value={nilaiForm.tugas} min="0" max="100" />
        </div>
        <div class="form-group">
          <label for="uts">Nilai UTS</label>
          <input id="uts" type="number" bind:value={nilaiForm.uts} min="0" max="100" />
        </div>
        <div class="form-group">
          <label for="uas">Nilai UAS</label>
          <input id="uas" type="number" bind:value={nilaiForm.uas} min="0" max="100" />
        </div>
        <button on:click={submitNilai}>Simpan Nilai</button>
      </article>
    {/if}

    {#if page === 'absensi-guru' && auth.user.role === 'guru'}
      <article class="card">
        <h3>Catat Absensi</h3>
        <div class="form-group">
          <label for="siswaIdAbsensi">Siswa ID</label>
          <input id="siswaIdAbsensi" bind:value={absensiForm.siswaId} placeholder="ID siswa" />
        </div>
        <div class="form-group">
          <label for="tanggal">Tanggal</label>
          <input id="tanggal" type="date" bind:value={absensiForm.tanggal} />
        </div>
        <div class="form-group">
          <label for="jam">Jam</label>
          <input id="jam" placeholder="08:00" bind:value={absensiForm.jam} />
        </div>
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" bind:value={absensiForm.status}>
            <option>Hadir</option>
            <option>Izin</option>
            <option>Sakit</option>
            <option>Alpha</option>
          </select>
        </div>
        <div class="form-group">
          <label for="keterangan">Keterangan</label>
          <textarea id="keterangan" bind:value={absensiForm.keterangan} rows="3"></textarea>
        </div>
        <button on:click={submitAbsensi}>Simpan Absensi</button>
      </article>
    {/if}

    {#if successMessage}
      <p style="color:#16a34a; margin-top:1rem;">{successMessage}</p>
    {/if}
  {/if}
</section>
