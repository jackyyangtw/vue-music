import { describe, expect, test } from "vitest";
import About from "@/views/AboutView.vue";
import { mount } from "@vue/test-utils";
describe("About.vue", () => {
  test("renders inner text", () => {
    const wrapper = mount(About, {
      shallow: true,
    }); // mount About at JSDOM

    expect(wrapper.text()).toContain("about"); // test About 中是否contain "about"
  });
});
