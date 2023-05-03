import { shallowMount } from "@vue/test-utils";
import HomeView from "../../views/HomeView.vue";
import SongItem from "../SongItem.vue";
import { expect } from "vitest";
import { createPinia } from "pinia";
import { createApp } from "vue";

// 測試HomeView.vue是否正常render SongItem.vue
describe("HomeView.vue", () => {
  let pinia;
  const app = createApp({});

  beforeEach(() => {
    pinia = createPinia();
    app.use(pinia);
  });

  test("render list of songs", () => {
    const songs = [];

    const component = shallowMount(HomeView, {
      data() {
        return {
          songs,
        };
      },
      global: {
        mocks: {
          $t: (msg) => msg,
        },
      },
      computed: {
        filteredSongs: () => songs, //模擬 filteredSongs 為 songs
      },
    });
    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);

    // 檢查是否有正確傳入 song prop
    items.forEach((item, index) => {
      expect(item.props("song")).toBe(songs[index]);
    });
  });
});
