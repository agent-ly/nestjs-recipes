import type { FactoryProvider } from "@nestjs/common";

import { getConnectionToken } from "./builder.js";

export type SocketIoFactory = (connection: any) => unknown | Promise<unknown>;

export const getAdapterCtorToken = (
  moduleName: string,
  connectionName?: string
) => `${getConnectionToken(moduleName, connectionName)}/adapter`;

export const getEmitterToken = (moduleName: string, connectionName?: string) =>
  `${getConnectionToken(moduleName, connectionName)}/emitter`;

export const createSocketIoAdapterProvider = (
  moduleName: string,
  connectionName: string | undefined,
  adapterFactory: SocketIoFactory
): FactoryProvider => ({
  inject: [getConnectionToken(moduleName, connectionName)],
  provide: getAdapterCtorToken(moduleName, connectionName),
  useFactory: adapterFactory,
});

export const createSocketIoEmitterProvider = (
  moduleName: string,
  connectionName: string | undefined,
  emitterFactory: SocketIoFactory
): FactoryProvider => ({
  inject: [getConnectionToken(moduleName, connectionName)],
  provide: getEmitterToken(moduleName, connectionName),
  useFactory: emitterFactory,
});
