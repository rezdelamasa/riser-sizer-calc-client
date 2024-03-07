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
        <RouterLink to="/account" class="link">
          <Button class="link__button" icon="pi pi-user" label="Account" text></Button>
        </RouterLink>
        <RouterLink to="/projects" class="link">
          <Button class="link__button" icon="pi pi-book" label="Projects" text></Button>
        </RouterLink>
        <RouterLink to="/calculator" class="link">
          <Button class="link__button" icon="pi pi-book" label="Calculator" text></Button>
        </RouterLink>
        <RouterLink to="/settings" class="link">
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

h2 {
  font-style: italic;
}

.router-link-active {
  background: #333;
}

.router-link-active:deep(*) {
  color: white;
}

.wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px; 
}

.link {
  overflow: hidden;
  border-radius: 6px;
}

.link__button {
  width: 100%;
  height: 3rem;
  color: #333;
}

.link:hover {
  background-color: #333;
}

.link__button:deep(.p-button-label) {
  text-align: left;
  font-weight: normal;
  margin-left: 0.5rem;
}

.link__button:deep(.p-button-icon) {
  font-size: 1.15rem;
}

.link__button:hover:deep(*) {
  color: white;
}

aside {
  max-width: 320px;
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: left;
}

.links {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
