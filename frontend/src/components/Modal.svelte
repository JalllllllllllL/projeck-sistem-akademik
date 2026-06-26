<script>
  export let open = false;
  export let title = "";
  export let onClose = () => {};
</script>

{#if open}
  <div class="modal-backdrop" on:click={() => onClose()}>
    <article class="modal-card" on:click|stopPropagation>
      <header>
        <h2>{title}</h2>
      </header>
      <slot />
    </article>
  </div>
{/if}
