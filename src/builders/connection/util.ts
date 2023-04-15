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
        delay(error, attempt) {
          logger.error(
            `(attempts: ${attempt}/${retryAttempts}, delay: ${retryDelay}ms) Failed to connect: ${error.message}`
          );
          return timer(retryDelay);
        },
      })
    )
  );
