import { randomUUID } from "node:crypto";
import { ConfigurableModuleBuilder } from "@nestjs/common";

export type ConnectionFactoryFn<ModuleOptions, ExtraModuleDefinitionOptions> = (
  options: ModuleOptions & Partial<ExtraModuleDefinitionOptions>
) => unknown | Promise<unknown>;

export interface ConnectionModuleDefinitionOptions {
  connectionName?: string;
}

export const createConfigurableConnectionModuleBuilder = <
  ModuleOptions,
  ExtraModuleDefinitionOptions extends ConnectionModuleDefinitionOptions
>(
  moduleName: string,
  connectionFactory: ConnectionFactoryFn<
    ModuleOptions,
    ExtraModuleDefinitionOptions
  >
) => {
  const optionsInjectionToken = randomUUID();
  const connectionNameInjectionToken = getConnectionNameToken(moduleName);
  return new ConfigurableModuleBuilder<ModuleOptions>({
    moduleName,
    optionsInjectionToken,
  }).setExtras<ExtraModuleDefinitionOptions>(
    {} as ExtraModuleDefinitionOptions,
    (definition, { connectionName = "default" }) => {
      const connectionNameProvider = createConnectionNameProvider(
        connectionNameInjectionToken,
        connectionName
      );
      const connectionInjectionToken = getConnectionToken(
        moduleName,
        connectionName
      );
      const connectionProvider = createConnectionProvider(
        optionsInjectionToken,
        connectionInjectionToken,
        connectionFactory
      );
      definition.providers = [
        ...(definition.providers ?? []),
        connectionNameProvider,
        connectionProvider,
      ];
      definition.exports = [
        ...(definition.exports ?? []),
        connectionInjectionToken,
      ];
      return definition;
    }
  );
};

export const getConnectionNameToken = (moduleName: string) =>
  `${moduleName}/connection_name`;

export const getConnectionToken = (
  moduleName: string,
  connectionName = "default"
) => `${moduleName}/${connectionName}_connection`;

const createConnectionNameProvider = (
  connectionNameInjectionToken: string,
  connectionName: string
) => ({
  provide: connectionNameInjectionToken,
  useValue: connectionName,
});

const createConnectionProvider = <ModuleOptions, ExtraModuleDefinitionOptions>(
  optionInjectionToken: string,
  connectionInjectionToken: string,
  useFactory: ConnectionFactoryFn<ModuleOptions, ExtraModuleDefinitionOptions>
) => ({
  inject: [optionInjectionToken],
  provide: connectionInjectionToken,
  useFactory,
});
