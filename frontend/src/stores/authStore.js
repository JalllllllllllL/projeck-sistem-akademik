import { writable } from 'svelte/store';

const stored = localStorage.getItem('sistem-absensi-auth');
const initial = stored ? JSON.parse(stored) : { token: null, user: null };

export const authStore = writable(initial);

authStore.subscribe((value) => {
  localStorage.setItem('sistem-absensi-auth', JSON.stringify(value));
});
