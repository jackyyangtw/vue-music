// 自動register components/base的.vue檔為global comoponent
// import _ from "lodash";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

export default {
  install(app) {
    const baseComponents = import.meta.glob("../components/base/*.vue", {
      eager: true, // 立即載入component
    });
    Object.entries(baseComponents).forEach(([path, module]) => {
      const componentName = upperFirst(
        camelCase(
          path
            .split("/")
            .pop()
            .replace(/\.\w+$/, "")
        )
      );

      // export default
      app.component(`Base${componentName}`, module.default);
    });
  },
};
