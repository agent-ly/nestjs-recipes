import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  hooks: {
    "build:before"(ctx) {
      for (const entry of ctx.options.entries)
        entry.name = entry.input.replace(/^.*src\//, "");
    },
  },
});
