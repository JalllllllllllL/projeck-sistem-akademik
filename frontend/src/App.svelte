<script>
  import { onDestroy } from 'svelte';
  import { authStore } from './stores/authStore';
  import LoadingSpinner from './components/LoadingSpinner.svelte';
  import LoginPage from './routes/LoginPage.svelte';
  import RegisterPage from './routes/RegisterPage.svelte';
  import DashboardPage from './routes/DashboardPage.svelte';

  let auth;
  let loading = false;
  let view = 'login';

  const unsubscribe = authStore.subscribe((value) => {
    auth = value;
    if (auth?.token) view = 'dashboard';
  });

  onDestroy(() => unsubscribe());

  const logout = () => {
    authStore.set({ token: null, user: null });
    view = 'login';
  };

  const openRegister = () => {
    view = 'register';
  };

  const openLogin = () => {
    view = 'login';
  };
</script>

<header class="container">
  <nav class="grid-2" style="align-items:center; padding: 1rem 0; gap:1rem;">
    <div>
      <strong>Sistem Absensi dan Akademik Siswa</strong>
    </div>
    <div style="text-align:right;">
      {#if auth?.token}
        <button on:click={logout}>Logout</button>
      {/if}
    </div>
  </nav>
</header>

<main class="container">
  {#if loading}
    <LoadingSpinner />
  {:else if auth?.token}
    <DashboardPage {auth} on:logout={logout} />
  {:else if view === 'register'}
    <RegisterPage on:gotoLogin={openLogin} />
  {:else}
    <LoginPage on:gotoRegister={openRegister} />
  {/if}
</main>

<footer class="container" style="padding: 1rem 0; text-align:center;">
  <p>© 2026 Sistem Absensi dan Akademik Siswa</p>
</footer>
