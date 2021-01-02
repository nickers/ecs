import { Component } from "../ecs/Component";
import { Entity } from "../ecs/Entity";
import { World } from "../ecs/World";

export class Collectable extends Component {
  isActive(entity: Entity, world: World) {
    return !world.inventory.includes(entity);
  }

  apply(entity: Entity, world: World) {
    world.inventory.push(entity);
    world.scene.remove(entity);
    return {
      description: `Picked up ${entity.name}.`,
    };
  }

  action(entity: Entity): string {
    return `Pick up ${entity.name}`;
  }
}