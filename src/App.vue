<script setup lang="ts">

</script>

<template>
  <div class="wrapper">
    <aside>
      <h2>RiserSizer</h2>
      <div class="links">
        <RouterLink to="/" class="link">
          <Button class="link__button" icon="pi pi-home" label="Home" text></Button>
        </RouterLink>
        <RouterLink to="/" class="link">
          <Button class="link__button" icon="pi pi-user" label="Account" text></Button>
        </RouterLink>
        <RouterLink to="/calculator" class="link">
          <Button class="link__button" icon="pi pi-book" label="Projects" text></Button>
        </RouterLink>
        <RouterLink to="/" class="link">
          <Button class="link__button" icon="pi pi-cog" label="Settings" text></Button>
        </RouterLink>
      </div>
    </aside>
    <RouterView />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  border-bottom: 2px solid #dee2e6;
  background: white;
  position: relative;
  z-index: 10;
  height: 100px;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  max-width: 100vw;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.sidebarComp {
}

.content {
  width: 80%;
  flex: 80% 1 1;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
