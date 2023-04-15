import type { INestApplication } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import type { Server, ServerOptions } from "socket.io";

type AdapterCtor = (nsp: any) => any;

export class CustomIoAadapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private readonly adapterCtor: AdapterCtor
  ) {
    super(app);
  }

  create(port: number, options?: ServerOptions & { namespace?: string }) {
    if (!options) return this.createIOServer(port);
    const { namespace, ...serverOptions } = options;
    const server = this.createIOServer(port, serverOptions);
    return namespace ? (server as Server).of(namespace) : server;
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    (server as Server).adapter(this.adapterCtor);
    return server;
  }
}
