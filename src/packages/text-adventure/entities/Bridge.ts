import { Effect } from "../../ecs/Effect";
import { Entity } from "../../ecs/Entity";
import { Component } from "../../ecs/Component";
import { Describable } from "../../ecs-collectable/Describable";
import { Scenes } from "../Scenes";

const fallDown: Effect = {
  description: "The bridge collapses under your weight. You fall down a pit.",
};

export type BridgeState = "fragile" | "broken" | "sturdy";

export class Bridge extends Entity<BridgeState> {
  constructor() {
    super("bridge", "fragile", (state, world) => [
      new Component({
        action: (entity) => `Cross the ${entity.name}`,
        isActive: (entity, world) => world.sceneId === Scenes.cliff,
        apply: (entity, world) => {
          if (state === "sturdy") {
            world.sceneId = Scenes.otherSide;
          } else if (state === "fragile") {
            world.sceneId = Scenes.bridge;
          } else if (state === "broken") {
            world.sceneId = Scenes.pit;
            return fallDown;
          }
        },
      }),
      new Component({
        action: () => "Proceed",
        isActive: (entity, world) => world.sceneId === Scenes.bridge,
        apply: (entity, world) => {
          if (state === "sturdy") {
            world.sceneId = Scenes.otherSide;
          } else {
            entity.state = "broken";
            world.sceneId = Scenes.pit;
            return fallDown;
          }
        },
      }),
      new Component({
        action: () => "Go back",
        isActive: (entity, world) => world.sceneId === Scenes.bridge,
        apply: (entity, world) => {
          world.sceneId = Scenes.cliff;
        },
      }),
      new Describable({
        describe: () =>
          world.sceneId === Scenes.bridge
            ? "You are standing on the bridge. It seems very unstable."
            : `You stand in front of a bridge. It looks ${state}.`,
      }),
    ]);
  }
}
