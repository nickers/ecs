import { System } from "../../ecs/System";
import { createActions } from "../interactive/createActions";
import { InteractionMemory } from "../interactive/InteractionMemory";
import { describeAction } from "./describeAction";
import { describeEntities } from "./describeEntities";

export const describeSystem = (
  system: System,
  customDescribers: SystemDescribers = {}
) => {
  const { describeAction, describeEntities } = {
    ...defaultDescribers,
    ...customDescribers,
  };
  const parts: string[] = [];
  const memory = system.entities.findComponent(InteractionMemory)?.items;
  const lastResult = memory && memory[memory.length - 1];
  if (lastResult) {
    parts.push(lastResult);
  }
  const entitiesDescribed = describeEntities(system.entities);
  if (entitiesDescribed) {
    parts.push(entitiesDescribed);
  }
  const actions = createActions(system);
  if (actions.length) {
    const actionsDescribed = actions.map(describeAction).join("\n");
    parts.push(`Actions:\n${actionsDescribed}`);
  }
  return parts.join("\n");
};

const defaultDescribers = { describeAction, describeEntities };

export type SystemDescribers = Partial<typeof defaultDescribers>;