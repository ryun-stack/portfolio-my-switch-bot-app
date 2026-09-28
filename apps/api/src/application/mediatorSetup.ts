import "reflect-metadata";
import { Mediator, Resolver } from "mediatr-ts";
import { PressSwitchCommand } from "./commands/PressSwitchCommand";
import { PressSwitchCommandHandler } from "./commands/PressSwitchCommandHandler";
import { CompleteSwitchRequestCommand } from "./commands/CompleteSwitchRequestCommand";
import { CompleteSwitchRequestCommandHandler } from "./commands/CompleteSwitchRequestCommandHandler";
import { GetSwitchStatusQuery } from "./queries/GetSwitchStatusQuery";
import { GetSwitchStatusQueryHandler } from "./queries/GetSwitchStatusQueryHandler";
import type { SwitchQueueSender } from "./ports/SwitchQueueSender";
import type { SwitchRequestRepository } from "../domain/repositories/SwitchRequestRepository";

export interface ApplicationDependencies {
  repository: SwitchRequestRepository;
  queueSender: SwitchQueueSender;
}

/**
 * Composition root for the Application layer's Mediator.
 *
 * mediatr-ts's default resolver only knows how to build handlers via a
 * zero-argument constructor, but our handlers need Infrastructure
 * dependencies (repository/queueSender) injected. We provide a small
 * custom Resolver that hands back pre-built handler instances instead,
 * keeping the dependency-inversion wiring in one place (this file) rather
 * than scattering `new XxxHandler(...)` calls across Presentation code.
 */
export function createMediator(deps: ApplicationDependencies): Mediator {
  const pressSwitchHandler = new PressSwitchCommandHandler(
    deps.repository,
    deps.queueSender
  );
  const getSwitchStatusHandler = new GetSwitchStatusQueryHandler(
    deps.repository
  );
  const completeSwitchRequestHandler = new CompleteSwitchRequestCommandHandler(
    deps.repository
  );

  const instances = new Map<Function, unknown>([
    [PressSwitchCommandHandler, pressSwitchHandler],
    [GetSwitchStatusQueryHandler, getSwitchStatusHandler],
    [CompleteSwitchRequestCommandHandler, completeSwitchRequestHandler],
  ]);

  const resolver: Resolver = {
    resolve<T>(type: new (...args: unknown[]) => T): T {
      const instance = instances.get(type);
      if (instance === undefined) {
        throw new Error(`No handler instance registered for ${type.name}`);
      }
      return instance as T;
    },
    add<T>(_type: new (...args: unknown[]) => T): void {
      // No-op: all handler instances are pre-built above via constructor
      // injection, so there is nothing left to register lazily.
    },
  };

  const mediator = new Mediator({ resolver });

  // mediatr-ts's registerHandler() type signature expects handler classes
  // with a `new (...args: unknown[])` constructor, which doesn't match our
  // handlers' typed constructor parameters. This is safe to cast away here:
  // mediatr-ts never calls `new HandlerClass(...)` itself when a custom
  // resolver is supplied — it only uses the class reference as a lookup key
  // passed to our resolver's `resolve()`, which returns the pre-built
  // instances constructed above.
  mediator.registerHandler(
    PressSwitchCommand,
    PressSwitchCommandHandler as unknown as new (
      ...args: unknown[]
    ) => PressSwitchCommandHandler
  );
  mediator.registerHandler(
    GetSwitchStatusQuery,
    GetSwitchStatusQueryHandler as unknown as new (
      ...args: unknown[]
    ) => GetSwitchStatusQueryHandler
  );
  mediator.registerHandler(
    CompleteSwitchRequestCommand,
    CompleteSwitchRequestCommandHandler as unknown as new (
      ...args: unknown[]
    ) => CompleteSwitchRequestCommandHandler
  );

  return mediator;
}
