<template>
  <div
    class="bg-white rounded border border-gray-200 mb-5 flex"
    v-if="!isContentLoading"
  >
    <div class="w-1/2 p-5">
      <div class="rounded-full overflow-hidden">
        <img
          src="https://teameowdev.files.wordpress.com/2016/04/avatar24-01.png"
          alt=""
        />
      </div>
    </div>
    <div class="p-5 flex flex-col justify-around align-center">
      <div>name: {{ userData.name }}</div>
      <div>country: {{ userData.country }}</div>
      <div>email: {{ userData.email }}</div>
      <div>age: {{ userData.age }}</div>
    </div>
  </div>
  <div
    class="bg-white rounded border border-gray-200 mb-5 flex animate-pulse"
    v-else
  >
    <div class="w-1/2 p-5">
      <div class="rounded-full overflow-hidden">
        <img
          src="https://teameowdev.files.wordpress.com/2016/04/avatar24-01.png"
          alt=""
        />
      </div>
    </div>
    <div class="p-5 flex flex-col justify-around align-center">
      <div
        v-for="i in 4"
        :key="i"
        class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-2"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["userData", "isContentLoading"],
};
</script>

<style lang="scss" scoped></style>
