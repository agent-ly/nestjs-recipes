import type { Logger } from "@nestjs/common";
import { lastValueFrom, defer, retry, timer } from "rxjs";

export type AutoRetryConnectFn = () => Promise<unknown>;

export const autoRetryConnect = (
  retryAttempts: number,
  retryDelay: number,
  logger: Logger,
  connect: AutoRetryConnectFn
) =>
  lastValueFrom(
    defer(() => connect()).pipe(
      retry({
        count: retryAttempts,
        delay(error, count) {
          logger.error(
            `Failed to connect to server. Retrying in ${retryDelay}ms. Attempt ${count} of ${retryAttempts}. Error: ${error.message}`
          );
          return timer(retryDelay);
        },
      })
    )
  );
