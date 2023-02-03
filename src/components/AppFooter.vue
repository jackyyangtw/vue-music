<template>
  <div class="flex lg:hidden bg-gray-600">
    <router-link to="/" class="w-[33.333%] py-1 text-white text-center m-0">
      首頁<i class="block fas fa-home text-white"></i>
    </router-link>
    <router-link
      to="/manage"
      class="w-[33.333%] py-1 text-white text-center m-0"
    >
      上傳音樂<i class="block fas fa-upload text-white"></i>
    </router-link>
    <router-link
      to="/user-info"
      class="w-[33.333%] py-1 text-white text-center m-0"
    >
      管理<i class="block fas fa-tasks text-white"></i>
    </router-link>
  </div>
</template>

<script setup></script>
