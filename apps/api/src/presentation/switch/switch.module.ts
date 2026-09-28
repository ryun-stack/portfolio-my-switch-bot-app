import { Module } from "@nestjs/common";
import { EntraIdAuthGuard } from "../auth/entraIdAuthGuard";
import { mediatorProvider } from "./mediator.provider";
import { queueProviders } from "./queue.provider";
import { repositoryProviders } from "./repository.provider";
import { SwitchController } from "./switch.controller";
import { EdgeSwitchController } from "./edgeSwitch.controller";
import { RegisteredUserGuard } from "../auth/registeredUserGuard";
import { EdgeClientAuthGuard } from "../auth/edgeClientAuthGuard";
import { RegisteredApplicationGuard } from "../auth/registeredApplicationGuard";

@Module({
  controllers: [SwitchController, EdgeSwitchController],
  providers: [
    ...repositoryProviders,
    ...queueProviders,
    mediatorProvider,
    EntraIdAuthGuard,
    RegisteredUserGuard,
    EdgeClientAuthGuard,
    RegisteredApplicationGuard,
  ],
})
export class SwitchModule {}
