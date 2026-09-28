import { Module } from "@nestjs/common";
import { SwitchModule } from "./presentation/switch/switch.module";

@Module({
  imports: [SwitchModule],
})
export class AppModule {}
