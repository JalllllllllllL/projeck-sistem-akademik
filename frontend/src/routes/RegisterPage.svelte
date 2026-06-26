<script>
  import { createEventDispatcher } from 'svelte';
  import LoadingSpinner from '../components/LoadingSpinner.svelte';
  import { apiFetch } from '../lib/api.js';

  const dispatch = createEventDispatcher();
  let role = 'siswa';
  let nama = '';
  let nis = '';
  let nip = '';
  let email = '';
  let password = '';
  let kelas = '';
  let jenisKelamin = 'Laki-laki';
  let mataPelajaran = '';
  let error = '';
  let loading = false;
  let success = '';

  const register = async () => {
    loading = true;
    error = '';
    success = '';

    try {
      const endpoint = role === 'siswa' ? '/auth/register-siswa' : '/auth/register-guru';
      const body = role === 'siswa'
        ? { nama, nis, email, password, kelas, jenisKelamin }
        : { nama, nip, email, password, mataPelajaran };

      const response = await apiFetch(endpoint, { method: 'POST', body });
      if (!response.ok) throw new Error(response.data?.message || 'Registrasi gagal');
      success = 'Registrasi berhasil. Silakan login.';
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  };
</script>

<section class="card" style="margin-top: 2rem;">
  <h1>Registrasi</h1>
  <div class="form-group">
    <label for="role">Daftar sebagai</label>
    <select id="role" bind:value={role}>
      <option value="siswa">Siswa</option>
      <option value="guru">Guru</option>
    </select>
  </div>

  <div class="form-group">
    <label for="nama">Nama Lengkap</label>
    <input id="nama" bind:value={nama} placeholder="Nama Lengkap" />
  </div>

  {#if role === 'siswa'}
    <div class="form-group">
      <label for="nis">NIS</label>
      <input id="nis" bind:value={nis} placeholder="NIS" />
    </div>
    <div class="form-group">
      <label for="kelas">Kelas</label>
      <input id="kelas" bind:value={kelas} placeholder="Kelas" />
    </div>
    <div class="form-group">
      <label for="jenisKelamin">Jenis Kelamin</label>
      <select id="jenisKelamin" bind:value={jenisKelamin}>
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>
    </div>
  {:else}
    <div class="form-group">
      <label for="nip">NIP</label>
      <input id="nip" bind:value={nip} placeholder="NIP" />
    </div>
    <div class="form-group">
      <label for="mataPelajaran">Mata Pelajaran</label>
      <input id="mataPelajaran" bind:value={mataPelajaran} placeholder="Mata Pelajaran" />
    </div>
  {/if}

  <div class="form-group">
    <label for="email">Email</label>
    <input id="email" type="email" bind:value={email} placeholder="Email" />
  </div>

  <div class="form-group">
    <label for="password">Password</label>
    <input id="password" type="password" bind:value={password} placeholder="Password" />
  </div>

  {#if error}
    <p style="color:#dc2626; margin-bottom:1rem;">{error}</p>
  {/if}
  {#if success}
    <p style="color:#16a34a; margin-bottom:1rem;">{success}</p>
  {/if}

  <button on:click={register} style="padding: 1rem 1.5rem; background:#2563eb; color:#fff;">Daftar</button>
  <button type="button" style="margin-left:1rem; padding:1rem 1.5rem;" on:click={() => dispatch('gotoLogin')}>
    Kembali ke Login
  </button>

  {#if loading}
    <div style="margin-top:1.5rem;"><LoadingSpinner /></div>
  {/if}
</section>
