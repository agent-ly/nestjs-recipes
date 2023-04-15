import type { FactoryProvider } from "@nestjs/common";
import type { Namespace } from "socket.io";

import { getConnectionToken } from "./builder.js";

export type SocketIoFactoryFn<Connection> = (
  connection: Connection
) => unknown | Promise<unknown>;

export type SocketIoAdapterCtor<AdapterCtor> = (nsp: Namespace) => AdapterCtor;

export const getAdapterCtorToken = (
  moduleName: string,
  connectionName?: string
) => `${getConnectionToken(moduleName, connectionName)}/adapter`;

export const getEmitterToken = (moduleName: string, connectionName?: string) =>
  `${getConnectionToken(moduleName, connectionName)}/emitter`;

export const createSocketIoAdapterCtorProvider = <Connection>(
  moduleName: string,
  connectionName: string | undefined,
  adapterFactory: SocketIoFactoryFn<Connection>
): FactoryProvider => ({
  inject: [getConnectionToken(moduleName, connectionName)],
  provide: getAdapterCtorToken(moduleName, connectionName),
  useFactory: adapterFactory,
});

export const createSocketIoEmitterProvider = <Connection>(
  moduleName: string,
  connectionName: string | undefined,
  emitterFactory: SocketIoFactoryFn<Connection>
): FactoryProvider => ({
  inject: [getConnectionToken(moduleName, connectionName)],
  provide: getEmitterToken(moduleName, connectionName),
  useFactory: emitterFactory,
});
