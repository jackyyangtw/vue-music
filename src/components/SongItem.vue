<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-white/[0.1]"
    :id="`song-${song.docID}`"
  >
    <div class="mr-3 max-w-[80%]">
      <router-link
        :to="{ name: 'song', params: { id: song.docID } }"
        class="font-bold block text-white composition-name"
      >
        {{ song.modifiedName }}
      </router-link>
      <span class="text-white text-sm composition-author">{{
        song.displayName
      }}</span>
    </div>

    <div class="text-white text-lg">
      <router-link
        custom
        :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments text-sm md:text-lg" @click="navigate">
          <i class="fa fa-comments text-white"></i>
          {{ song.commentCount }}
        </span>
      </router-link>
    </div>
  </li>
</template>

<script>
export default {
  name: "SongItem",
  props: ["song"],
};
</script>

<style lang="scss" scoped></style>
