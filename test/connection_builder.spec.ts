import { describe, it, expect, vi } from "vitest";
import { Test } from "@nestjs/testing";

import { createConfigurableConnectionModuleBuilder } from "../src/builders/connection/mod.js";

const NOOP = () => {};

const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  createConfigurableConnectionModuleBuilder<{}, { connectionName: string }>(
    "test",
    NOOP
  ).build();

class TestModule extends ConfigurableModuleClass {}

describe("Connection Builder", async () => {
  it("Should have the default options", async () => {
    const module = await Test.createTestingModule({
      imports: [TestModule.register({})],
    }).compile();
    const options = module.get(MODULE_OPTIONS_TOKEN);
    expect(options).toEqual({});
  });
  it("Should have the connection name", async () => {
    const module = await Test.createTestingModule({
      imports: [TestModule.register({ connectionName: "test" })],
    }).compile();
    const options = module.get(MODULE_OPTIONS_TOKEN);
    expect(options).toEqual({ connectionName: "test" });
  });
});
