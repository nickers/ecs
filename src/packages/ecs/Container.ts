import { ObservableArray } from "./util/ObservableArray";

export class Container<T> extends ObservableArray<T> {
  remove(...toRemove: T[]) {
    for (const item of toRemove) {
      const index = this.indexOf(item);
      if (index !== -1) {
        this.splice(index, 1);
      }
    }
  }

  filterType<C extends T>(type: Class<C>) {
    return this.filter((item) => item instanceof type) as C[];
  }

  findType<C extends T>(type: Class<C>) {
    return this.find((item) => item instanceof type) as C | undefined;
  }

  resolveType<C extends T>(type: Class<C>) {
    const instance = this.findType(type);
    if (!instance) {
      throw new Error(`Could not resolve instance of ${type.name}`);
    }
    return instance;
  }

  connect(plugin: (...items: T[]) => void, detach: (...items: T[]) => void) {
    plugin(...this);
    const handleChange = (added: T[], removed: T[]) => {
      if (added.length) {
        plugin(...added);
      }
      if (removed.length) {
        detach(...removed);
      }
    };
    this.events.on("change", handleChange);
    return () => {
      this.events.off("change", handleChange);
      detach(...this);
    };
  }
}

export type Class<T> = new (...args: any[]) => T;
