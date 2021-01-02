import { Entity } from "./Entity";
import { Effect } from "./Effect";
import { World } from "./World";

/**
 * Designed to be able to conveniently instantiate and extend Component
 */
export class Component {
  constructor(private options: ComponentOptions = {}) {}

  action(entity: Entity, world: World) {
    if (this.options.action) {
      return this.options.action(entity, world);
    }
    return "";
  }

  apply(entity: Entity, world: World) {
    if (this.options.apply) {
      return this.options.apply(entity, world);
    }
  }

  isActive(entity: Entity, world: World) {
    if (this.options.isActive) {
      return this.options.isActive(entity, world);
    }
    return true;
  }
}

export type ComponentOptions = {
  action?: Derive<string>;
  apply?: Derive<Effect | undefined | void>;
  isActive?: Derive<boolean>;
};

export type Derive<T> = (entity: Entity, world: World) => T;