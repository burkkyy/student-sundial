<script setup>
import LogoIcon from "@/assets/LogoIcon.svg"
import Logo from "@/assets/Logo.svg"
</script>

<template>
  <div class="logo">
    <router-link to="/dashboard">
      <img
        class="d-sm-flex d-none"
        style="width: 300px"
        :src="Logo"
        alt="home"
      />
      <div class="d-sm-none d-flex">
        <img
          style="height: 28px"
          :src="LogoIcon"
          alt="home"
        />
        <div
          class="ml-3 mt-1"
          style=""
        >
          Digital Vault
        </div>
      </div>
    </router-link>
  </div>
</template>

<style>
.logo a {
  text-decoration: none !important;
  color: #fff;
  font-weight: 500;
}
</style>
