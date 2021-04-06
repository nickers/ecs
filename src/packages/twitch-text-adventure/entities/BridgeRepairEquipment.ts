import { Collectable } from "../../ecs-collectable/Collectable";
import { Describable } from "../../ecs-describable/Describable";
import { Interactive } from "../../ecs-interactive/Interactive";
import { Inventory } from "../../ecs-collectable/Inventory";
import { Entity } from "../../ecs/Entity";
import { SceneManager } from "../../ecs-scene-manager/SceneManager";
import { Bridge } from "./Bridge";

export class BridgeRepairEquipment extends Entity {
  get sceneManager() {
    return this.system?.entities.findComponent(SceneManager);
  }
  get inventory() {
    return this.system?.entities.findComponent(Inventory);
  }
  get bridge() {
    return this.system?.entities.find(
      (entity): entity is Bridge => entity instanceof Bridge
    );
  }

  constructor() {
    super([], [], { name: "repair kit" });
    this.components.push(
      new Collectable(),
      new Describable({
        description: () =>
          `There's a ${this.name} conveniently laying on the ground.`,
      }),
      new Interactive({
        action: "Repair bridge",
        isActive: () =>
          !!this.inventory?.items.includes(this) &&
          this.sceneManager?.sceneId === "cliff" &&
          this.bridge?.state !== "sturdy",
        effect: () => {
          if (this.bridge) {
            this.bridge.state = "sturdy";
            return "You repaired the bridge.";
          }
        },
      })
    );
  }
}
