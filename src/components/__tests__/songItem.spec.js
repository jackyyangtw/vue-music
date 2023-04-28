
import { mount } from "@vue/test-utils";
import SongItem from "@/components/SongItem";

describe("SongItem.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = mount(SongItem, {
      props: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
