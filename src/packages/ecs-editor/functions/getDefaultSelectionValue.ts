import { EditorState } from "../types/EditorState";
import {
  EditorSelectionName,
  EditorSelectionValues,
} from "../types/EditorSelection";
import { values } from "../../ecs-common/nominal";

export function getDefaultSelectionValue<
  ObjectName extends EditorSelectionName
>(
  state: EditorState,
  objectName: ObjectName
): EditorSelectionValues[ObjectName];

/**
 * Returns the selection for the first object in the list for the specified object.
 * (Returns undefined if the list for the specified object is empty)
 */
export function getDefaultSelectionValue(
  state: EditorState,
  objectName: EditorSelectionName
): EditorSelectionValues[EditorSelectionName] {
  switch (objectName) {
    case "system":
      const firstSystem = values(state.ecs.systems)[0];
      return firstSystem?.id;
    case "scene":
      const scene = values(state.ecs.scenes).find(
        (scene) => scene.systemId === state.selection.system
      );
      return scene && scene.id;
  }
}