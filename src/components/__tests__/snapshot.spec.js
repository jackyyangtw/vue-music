import { shallowMount } from "@vue/test-utils";
import SongItem from "../songItem.vue";
import { describe } from "vitest";
import { RouterLinkStub } from "@vue/test-utils";
describe("Snapshots SongItem.vue", () => {
  test("render correctly", () => {
    const song = {
      displayName: "test",
      docID: "abs",
      modifiedName: "test",
      commentCount: 5,
    };
    const wrapper = shallowMount(SongItem, {
      props: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
