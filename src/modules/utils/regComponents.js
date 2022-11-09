import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
export const regComponents = (vm) => {
  const requireComponent = require.context(
    "@/components",
    false,
    /App[\w-]+\.vue$/
  );
  requireComponent.keys().forEach((file) => {
    const componentConf = requireComponent(file);
    const componentName = upperFirst(
      camelCase(file.replace(/^\.\//, "").replace(/\.\w+$/, ""))
    );
    vm.component(componentName, componentConf.default || componentConf);
  });
};
