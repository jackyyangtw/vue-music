import { expect } from "vitest";
import SongItem from "../songItem.vue";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";

// 測試SongItem.vue，.composition-author是否有顯示song.displayName
describe("SongItem.vue", () => {
  test("render song.displayName", () => {
    const song = { displayName: "test" };
    const wrapper = shallowMount(SongItem, {
      props: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });
    // querySelector
    const compositionAuthor = wrapper.find(".composition-author");
    expect(compositionAuthor.text()).toBe(song.displayName);
  });
  test("render song.docID in id attr", () => {
    const song = { docID: "abs" };
    const wrapper = shallowMount(SongItem, {
      props: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });
    expect(wrapper.attributes("id")).toBe(`song-${song.docID}`);
  });
});
