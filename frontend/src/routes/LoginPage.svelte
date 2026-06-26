<script>
  import { onMount } from "svelte";
  import { authStore } from "../stores/authStore";
  import LoadingSpinner from "../components/LoadingSpinner.svelte";

  let role = "siswa";
  let nis = "";
  let nip = "";
  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  const apiUrl = "http://localhost:5000/api/auth";

  const login = async () => {
    loading = true;
    error = "";

    try {
      const endpoint = role === "siswa" ? "login-siswa" : "login-guru";
      const body = role === "siswa" ? { nis, password } : { nip, password };
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login gagal");
      authStore.set({ token: data.token, user: data.user });
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  };
</script>

<div class="login-container">
  <div class="login-box">
    <div class="login-header">
      <div class="login-icon">🎓</div>
      <h1>Sistem Akademik</h1>
      <p>Absensi & Manajemen Nilai Siswa</p>
    </div>

    <form on:submit|preventDefault={login} class="login-form">
      <div class="form-group">
        <label for="role">👤 Login sebagai</label>
        <select id="role" bind:value={role} class="select-role">
          <option value="siswa">📚 Siswa</option>
          <option value="guru">👨‍🏫 Guru</option>
        </select>
      </div>

      {#if role === "siswa"}
        <div class="form-group">
          <label for="nis">🆔 NIS (Nomor Induk Siswa)</label>
          <input
            id="nis"
            type="text"
            bind:value={nis}
            placeholder="Masukkan NIS Anda"
            required
          />
        </div>
      {:else}
        <div class="form-group">
          <label for="nip">🆔 NIP (Nomor Induk Pegawai)</label>
          <input
            id="nip"
            type="text"
            bind:value={nip}
            placeholder="Masukkan NIP Anda"
            required
          />
        </div>
      {/if}

      <div class="form-group">
        <label for="password">🔐 Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="Masukkan password"
          required
        />
      </div>

      {#if error}
        <div class="alert alert-error">
          ⚠️ {error}
        </div>
      {/if}

      <button type="submit" class="btn-login primary" disabled={loading}>
        {#if loading}
          Sedang Login...
        {:else}
          Masuk
        {/if}
      </button>
    </form>

    {#if loading}
      <div style="margin-top: 1.5rem;">
        <LoadingSpinner />
      </div>
    {/if}

    <div class="login-footer">
      <p style="color: #6b7280; font-size: 0.85rem;">
        Test Credentials:<br />
        Siswa: S1001 / Guru: G1001<br />
        Password: password123
      </p>
    </div>
  </div>

  <div class="login-side">
    <div class="feature-list">
      <div class="feature-item">
        <span class="feature-icon">📅</span>
        <h4>Jadwal Pelajaran</h4>
      </div>
      <div class="feature-item">
        <span class="feature-icon">📊</span>
        <h4>Manajemen Nilai</h4>
      </div>
      <div class="feature-item">
        <span class="feature-icon">✅</span>
        <h4>Pencatatan Absensi</h4>
      </div>
      <div class="feature-item">
        <span class="feature-icon">🏆</span>
        <h4>Ranking Siswa</h4>
      </div>
      <div class="feature-item">
        <span class="feature-icon">📰</span>
        <h4>Berita Sekolah</h4>
      </div>
    </div>
  </div>
</div>

<style>
  .login-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
    gap: 0;
  }

  .login-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3rem 2rem;
    background: white;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .login-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .login-header h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .login-header p {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .login-form {
    width: 100%;
    max-width: 380px;
  }

  .select-role {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }

  .btn-login {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    margin-top: 1rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .btn-login:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .login-footer {
    margin-top: 2rem;
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .login-side {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    position: relative;
    overflow: hidden;
  }

  .login-side::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    );
    background-size: 50px 50px;
    animation: drift 20s linear infinite;
  }

  @keyframes drift {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, 50px);
    }
  }

  .feature-list {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-item {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1.5rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    transition: all 0.3s ease;
  }

  .feature-item:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(8px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .feature-icon {
    font-size: 2rem;
  }

  .feature-item h4 {
    margin: 0;
    font-weight: 600;
    color: white;
  }

  @media (max-width: 768px) {
    .login-container {
      grid-template-columns: 1fr;
    }

    .login-side {
      display: none;
    }

    .login-box {
      padding: 2rem 1.5rem;
    }

    .login-form {
      width: 100%;
      max-width: 100%;
    }
  }
</style>
