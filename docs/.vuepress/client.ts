import { defineClientConfig } from "vuepress/client";
import MountainBg from "./components/MountainBg.vue";

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("MountainBg", MountainBg);
  },
});
