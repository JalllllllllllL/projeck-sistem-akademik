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

    if (target === 'absensi') {
      const response = await apiFetch(`/${auth.user.role}/absensi`, { headers: authHeader });
      if (!response.ok) return error = response.data?.message || 'Gagal memuat absensi';
      absensi = response.data;
    }

    if (target === 'ranking') {
      const response = await apiFetch('/ranking/daftar', { headers: authHeader });
      if (!response.ok) return error = response.data?.message || 'Gagal memuat ranking';
      ranking = response.data;
    }

    if (target === 'kelas') {
      const response = await apiFetch('/guru/kelas', { headers: authHeader });
      if (!response.ok) return error = response.data?.message || 'Gagal memuat kelas';
      kelasDetail = response.data;
    }

    if (target === 'berita') {
      const response = await apiFetch(`/${auth.user.role}/berita`, { headers: authHeader });
      if (!response.ok) return error = response.data?.message || 'Gagal memuat berita';
      berita = response.data;
    }
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

  onMount(fetchDashboard);
</script>

<div class="dashboard-container">
  {#if loading}
    <div class="loading-container">
      <LoadingSpinner />
    </div>
  {:else if error}
    <div class="alert alert-error">
      ⚠️ {error}
    </div>
  {:else}
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div>
        <h2>Dashboard {auth.user.role === 'siswa' ? 'Siswa' : 'Guru'}</h2>
        <p class="subtitle">Selamat datang kembali 👋</p>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="tabs" role="tablist">
      <button
        role="tab"
        class="tab-btn {page === 'overview' ? 'active' : ''}"
        on:click={() => { page = 'overview'; successMessage = ''; error = ''; }}
      >
        📊 Overview
      </button>
      <button
        role="tab"
        class="tab-btn {page === 'jadwal' ? 'active' : ''}"
        on:click={() => loadPage('jadwal')}
      >
        📅 Jadwal
      </button>
      <button
        role="tab"
        class="tab-btn {page === 'berita' ? 'active' : ''}"
        on:click={() => loadPage('berita')}
      >
        📰 Berita
      </button>
      <button
        role="tab"
        class="tab-btn {page === 'profil' ? 'active' : ''}"
        on:click={() => loadPage('profil')}
      >
        👤 Profil
      </button>
      {#if auth.user.role === 'siswa'}
        <button
          role="tab"
          class="tab-btn {page === 'nilai' ? 'active' : ''}"
          on:click={() => loadPage('nilai')}
        >
          📈 Nilai
        </button>
        <button
          role="tab"
          class="tab-btn {page === 'absensi' ? 'active' : ''}"
          on:click={() => loadPage('absensi')}
        >
          ✅ Absensi
        </button>
      {:else}
        <button
          role="tab"
          class="tab-btn {page === 'ranking' ? 'active' : ''}"
          on:click={() => loadPage('ranking')}
        >
          🏆 Ranking
        </button>
        <button
          role="tab"
          class="tab-btn {page === 'kelas' ? 'active' : ''}"
          on:click={() => loadPage('kelas')}
        >
          👥 Kelas
        </button>
        <button
          role="tab"
          class="tab-btn {page === 'input-nilai' ? 'active' : ''}"
          on:click={() => page = 'input-nilai'}
        >
          ✏️ Input Nilai
        </button>
        <button
          role="tab"
          class="tab-btn {page === 'absensi-guru' ? 'active' : ''}"
          on:click={() => page = 'absensi-guru'}
        >
          🔖 Absensi
        </button>
      {/if}
    </div>

    <!-- Content Area -->
    <div class="content">
      {#if successMessage}
        <div class="alert alert-success">
          ✅ {successMessage}
        </div>
      {/if}

      {#if page === 'overview'}
        <div class="overview-grid">
          <!-- Profil Card -->
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon">👤</span>
              <h3>Profil</h3>
            </div>
            <p class="stat-value">
              {auth.user.role === 'siswa' ? dashboard.siswa?.nama : dashboard.guru?.nama}
            </p>
            <p class="stat-detail">
              {#if auth.user.role === 'siswa'}
                Kelas: <strong>{dashboard.siswa?.kelas}</strong>
              {:else}
                Mapel: <strong>{dashboard.guru?.mata_pelajaran}</strong>
              {/if}
            </p>
          </div>

          <!-- News Card -->
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon">📰</span>
              <h3>Berita Terbaru</h3>
            </div>
            <div class="news-list">
              {#each berita.slice(0, 2) as item}
                <div class="news-item">
                  <strong>{item.judul}</strong>
                  <small>{item.tanggal_publikasi}</small>
                </div>
              {/each}
            </div>
          </div>

          {#if auth.user.role === 'siswa'}
            <!-- Attendance Stats -->
            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-icon">✅</span>
                <h3>Kehadiran</h3>
              </div>
              <div class="stat-grid">
                <div class="stat-item">
                  <span class="stat-number" style="color: #10b981;">{dashboard.absensiSummary?.hadir || 0}</span>
                  <span class="stat-label">Hadir</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number" style="color: #f59e0b;">{dashboard.absensiSummary?.izin || 0}</span>
                  <span class="stat-label">Izin</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number" style="color: #8b5cf6;">{dashboard.absensiSummary?.sakit || 0}</span>
                  <span class="stat-label">Sakit</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number" style="color: #ef4444;">{dashboard.absensiSummary?.alpha || 0}</span>
                  <span class="stat-label">Alpha</span>
                </div>
              </div>
            </div>

            <!-- Nilai Card -->
            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-icon">📊</span>
                <h3>Nilai Akademik</h3>
              </div>
              <div class="nilai-list">
                <div class="nilai-item">
                  <span>Tugas</span>
                  <span class="nilai-value">{dashboard.nilai?.tugas ?? '-'}</span>
                </div>
                <div class="nilai-item">
                  <span>UTS</span>
                  <span class="nilai-value">{dashboard.nilai?.uts ?? '-'}</span>
                </div>
                <div class="nilai-item">
                  <span>UAS</span>
                  <span class="nilai-value">{dashboard.nilai?.uas ?? '-'}</span>
                </div>
                <div class="nilai-item highlight">
                  <span>Rata-rata</span>
                  <span class="nilai-value">{dashboard.nilai?.nilai_akhir ?? '-'}</span>
                </div>
              </div>
            </div>

            <!-- Ranking Card -->
            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-icon">🏆</span>
                <h3>Ranking</h3>
              </div>
              <p class="stat-value" style="font-size: 2.5rem;">
                {dashboard.ranking?.ranking_score ?? '-'}
              </p>
              <p class="stat-detail">Posisi di kelas</p>
            </div>
          {:else}
            <!-- Guru Overview -->
            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-icon">👥</span>
                <h3>Ringkasan</h3>
              </div>
              <div class="stat-grid" style="grid-template-columns: 1fr 1fr;">
                <div class="stat-item">
                  <span class="stat-number">{dashboard.jumlahKelas || 0}</span>
                  <span class="stat-label">Kelas</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{dashboard.jumlahSiswa || 0}</span>
                  <span class="stat-label">Siswa</span>
                </div>
              </div>
            </div>

            <!-- Jadwal Hari Ini -->
            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-icon">📅</span>
                <h3>Jadwal Hari Ini</h3>
              </div>
              <div class="jadwal-list">
                {#each dashboard.jadwal?.slice(0, 3) || [] as item}
                  <div class="jadwal-item">
                    <strong>{item.hari}</strong>
                    <span>{item.jam} • {item.mata_pelajaran}</span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/if}

      {#if page === 'jadwal'}
        <div class="card">
          <h3>📅 Jadwal {auth.user.role === 'siswa' ? 'Pelajaran' : 'Mengajar'}</h3>
          <div class="table-container">
            <table class="data-table">
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
                    <td><strong>{item.mata_pelajaran}</strong></td>
                    {#if auth.user.role === 'siswa'}<td>{item.guru}</td>{/if}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}

      {#if page === 'berita'}
        <div class="card">
          <h3>📰 Berita Sekolah</h3>
          <div class="berita-grid">
            {#each berita as item}
              <div class="berita-card">
                <h4>{item.judul}</h4>
                <p class="berita-meta">Oleh: {item.penulis}</p>
                <p class="berita-date">{item.tanggal_publikasi}</p>
                <p class="berita-content">{item.isi}</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if page === 'profil'}
        <div class="card">
          <h3>👤 Edit Profil</h3>
          <div class="form-container">
            <div class="form-group">
              <label>Nama</label>
              <input type="text" bind:value={profileForm.nama} />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" value={profileForm.email} disabled />
            </div>
            {#if auth.user.role === 'siswa'}
              <div class="form-group">
                <label>Kelas</label>
                <input type="text" bind:value={profileForm.kelas} />
              </div>
              <div class="form-group">
                <label>Jenis Kelamin</label>
                <select bind:value={profileForm.jenis_kelamin}>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            {:else}
              <div class="form-group">
                <label>Mata Pelajaran</label>
                <input type="text" bind:value={profileForm.mata_pelajaran} />
              </div>
            {/if}
            <button class="primary" on:click={updateProfile}>💾 Simpan Perubahan</button>
          </div>

          <hr style="margin: 2rem 0;" />

          <h4>Ubah Password</h4>
          <button class="secondary" on:click={() => showPasswordForm = !showPasswordForm}>
            {showPasswordForm ? 'Batal' : '🔐 Ubah Password'}
          </button>
          {#if showPasswordForm}
            <div class="form-container" style="margin-top: 1rem;">
              <div class="form-group">
                <label>Password Lama</label>
                <input
                  type="password"
                  bind:value={passwordForm.oldPassword}
                  placeholder="Masukkan password lama"
                />
              </div>
              <div class="form-group">
                <label>Password Baru</label>
                <input
                  type="password"
                  bind:value={passwordForm.newPassword}
                  placeholder="Masukkan password baru"
                />
              </div>
              <div class="form-group">
                <label>Konfirmasi Password Baru</label>
                <input
                  type="password"
                  bind:value={passwordForm.confirmPassword}
                  placeholder="Konfirmasi password baru"
                />
              </div>
              <button class="success" on:click={changePassword}>✓ Ubah Password</button>
            </div>
          {/if}
        </div>
      {/if}

      {#if page === 'nilai' && auth.user.role === 'siswa'}
        <div class="card">
          <h3>📈 Nilai Akademik</h3>
          <div class="nilai-detail-grid">
            <div class="nilai-detail-card">
              <h4>Tugas</h4>
              <div class="nilai-display">{nilai?.tugas ?? '-'}</div>
            </div>
            <div class="nilai-detail-card">
              <h4>UTS</h4>
              <div class="nilai-display">{nilai?.uts ?? '-'}</div>
            </div>
            <div class="nilai-detail-card">
              <h4>UAS</h4>
              <div class="nilai-display">{nilai?.uas ?? '-'}</div>
            </div>
            <div class="nilai-detail-card highlight">
              <h4>Rata-rata</h4>
              <div class="nilai-display">{nilai?.nilai_akhir ?? '-'}</div>
            </div>
          </div>
        </div>
      {/if}

      {#if page === 'absensi' && auth.user.role === 'siswa'}
        <div class="card">
          <h3>✅ Riwayat Absensi</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jam</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {#each absensi as item}
                  <tr>
                    <td>{item.tanggal}</td>
                    <td>{item.jam}</td>
                    <td>
                      <span class="badge badge-{item.status === 'Hadir' ? 'success' : item.status === 'Izin' ? 'warning' : 'danger'}">
                        {item.status}
                      </span>
                    </td>
                    <td>{item.keterangan || '-'}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}

      {#if page === 'ranking' && auth.user.role === 'guru'}
        <div class="card">
          <h3>🏆 Ranking Siswa</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ranking</th>
                  <th>Nama Siswa</th>
                  <th>Nilai Akademik</th>
                  <th>Nilai Keteladanan</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {#each ranking as item, idx}
                  <tr>
                    <td><strong>#{idx + 1}</strong></td>
                    <td>{item.siswa_nama}</td>
                    <td>{item.nilai_akademik}</td>
                    <td>{item.nilai_keteladanan}</td>
                    <td><strong>{item.total_score}</strong></td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}

      {#if page === 'input-nilai' && auth.user.role === 'guru'}
        <div class="card">
          <h3>✏️ Input Nilai</h3>
          <div class="form-container">
            <div class="form-group">
              <label>ID Siswa</label>
              <input type="number" bind:value={nilaiForm.siswaId} placeholder="Masukkan ID siswa" />
            </div>
            <div class="form-group">
              <label>Tugas</label>
              <input type="number" bind:value={nilaiForm.tugas} placeholder="Masukkan nilai tugas" />
            </div>
            <div class="form-group">
              <label>UTS</label>
              <input type="number" bind:value={nilaiForm.uts} placeholder="Masukkan nilai UTS" />
            </div>
            <div class="form-group">
              <label>UAS</label>
              <input type="number" bind:value={nilaiForm.uas} placeholder="Masukkan nilai UAS" />
            </div>
            <button class="primary" on:click={submitNilai}>💾 Simpan Nilai</button>
          </div>
        </div>
      {/if}

      {#if page === 'absensi-guru' && auth.user.role === 'guru'}
        <div class="card">
          <h3>🔖 Pencatatan Absensi</h3>
          <div class="form-container">
            <div class="form-group">
              <label>ID Siswa</label>
              <input type="number" bind:value={absensiForm.siswaId} placeholder="Masukkan ID siswa" />
            </div>
            <div class="form-group">
              <label>Tanggal</label>
              <input type="date" bind:value={absensiForm.tanggal} />
            </div>
            <div class="form-group">
              <label>Jam</label>
              <input type="time" bind:value={absensiForm.jam} />
            </div>
            <div class="form-group">
              <label>Status</label>
              <select bind:value={absensiForm.status}>
                <option value="Hadir">Hadir</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
                <option value="Alpha">Alpha</option>
              </select>
            </div>
            <div class="form-group">
              <label>Keterangan</label>
              <textarea bind:value={absensiForm.keterangan} placeholder="Masukkan keterangan..."></textarea>
            </div>
            <button class="primary" on:click={submitAbsensi}>✓ Catat Absensi</button>
          </div>
        </div>
      {/if}

      {#if page === 'kelas' && auth.user.role === 'guru'}
        <div class="card">
          <h3>👥 Data Kelas</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>NIS</th>
                  <th>Nama Siswa</th>
                  <th>Kelas</th>
                  <th>Jenis Kelamin</th>
                </tr>
              </thead>
              <tbody>
                {#each kelasDetail as item}
                  <tr>
                    <td>{item.nis}</td>
                    <td>{item.nama}</td>
                    <td>{item.kelas}</td>
                    <td>{item.jenis_kelamin}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .dashboard-container {
    padding: 2rem 0;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  .dashboard-header {
    margin-bottom: 2rem;
  }

  .dashboard-header h2 {
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #6b7280;
    font-size: 1rem;
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .tab-btn {
    background: white;
    color: #6b7280;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 0.75rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .tab-btn:hover {
    background: #f3f4f6;
  }

  .tab-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Overview Grid */
  .overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .stat-card {
    background: white;
    border-radius: 1.2rem;
    padding: 1.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  .stat-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .stat-icon {
    font-size: 1.8rem;
  }

  .stat-card h3 {
    font-size: 1.1rem;
    margin: 0;
    color: #1f2937;
  }

  .stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #667eea;
    margin: 0.5rem 0;
  }

  .stat-detail {
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .stat-item {
    text-align: center;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.75rem;
  }

  .stat-number {
    display: block;
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #6b7280;
    letter-spacing: 0.5px;
  }

  /* News List */
  .news-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .news-item {
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .news-item:last-child {
    border-bottom: none;
  }

  .news-item strong {
    display: block;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .news-item small {
    display: block;
    color: #9ca3af;
    font-size: 0.8rem;
  }

  /* Nilai List */
  .nilai-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .nilai-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    font-weight: 500;
  }

  .nilai-item.highlight {
    background: linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%);
    border: 1px solid #667eea;
  }

  .nilai-value {
    font-weight: 700;
    color: #667eea;
    font-size: 1.1rem;
  }

  /* Jadwal List */
  .jadwal-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .jadwal-item {
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    border-left: 3px solid #667eea;
  }

  .jadwal-item strong {
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .jadwal-item span {
    color: #6b7280;
    font-size: 0.9rem;
  }

  /* Table Styles */
  .table-container {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table thead {
    background: linear-gradient(135deg, #f0f4ff 0%, #f5f1ff 100%);
  }

  .data-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #1f2937;
    border-bottom: 2px solid #667eea;
  }

  .data-table td {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .data-table tbody tr:hover {
    background: #f9fafb;
  }

  /* Badge Styles */
  .badge {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .badge-success {
    background: #d1fae5;
    color: #065f46;
  }

  .badge-warning {
    background: #fef3c7;
    color: #78350f;
  }

  .badge-danger {
    background: #fee2e2;
    color: #7f1d1d;
  }

  /* Berita Grid */
  .berita-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .berita-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
  }

  .berita-card:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }

  .berita-card h4 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
  }

  .berita-meta {
    color: #667eea;
    font-size: 0.85rem;
    margin: 0.25rem 0;
  }

  .berita-date {
    color: #9ca3af;
    font-size: 0.8rem;
    margin: 0.5rem 0 1rem 0;
  }

  .berita-content {
    color: #4b5563;
    line-height: 1.6;
  }

  /* Form Container */
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #1f2937;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.8rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  /* Buttons */
  button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }

  button.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
  }

  button.secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
  }

  button.secondary:hover {
    background: #f3f4f6;
  }

  button.success {
    background: #10b981;
    color: white;
  }

  button.success:hover {
    background: #059669;
  }

  button.danger {
    background: #ef4444;
    color: white;
  }

  button.danger:hover {
    background: #dc2626;
  }

  /* Nilai Detail Grid */
  .nilai-detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
  }

  .nilai-detail-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
  }

  .nilai-detail-card.highlight {
    background: linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%);
    border-color: #667eea;
  }

  .nilai-detail-card h4 {
    margin: 0 0 1rem 0;
    color: #6b7280;
    text-transform: uppercase;
    font-size: 0.85rem;
  }

  .nilai-display {
    font-size: 2.5rem;
    font-weight: 700;
    color: #667eea;
  }

  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
  }

  @media (max-width: 768px) {
    .overview-grid {
      grid-template-columns: 1fr;
    }

    .tabs {
      flex-wrap: wrap;
    }

    .stat-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>