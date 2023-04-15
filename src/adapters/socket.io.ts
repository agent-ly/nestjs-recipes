import type { INestApplication } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import type { ServerOptions } from "socket.io";

type Ctor = (nsp: any) => any;

export class IoCtorAdapter extends IoAdapter {
  constructor(app: INestApplication, private readonly adapterCtor: Ctor) {
    super(app);
  }

  create(port: number, options?: ServerOptions & { namespace?: string }) {
    if (!options) return this.createIOServer(port);
    const { namespace, ...serverOptions } = options;
    const server = this.createIOServer(port, serverOptions);
    return namespace ? server.of(namespace) : server;
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterCtor);
    return server;
  }
}
