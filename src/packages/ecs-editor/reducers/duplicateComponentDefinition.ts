import { get, set } from "../../ecs-common/nominal";
import { createEditorStateReducer } from "../functions/createEditorStateReducer";
import {
  ComponentDefinition,
  ComponentDefinitionId,
} from "../../ecs-serializable/types/ComponentDefinition";
import { uuid } from "../../ecs-common/uuid";
import { duplicateName } from "../functions/duplicateName";

export const duplicateComponentDefinition = createEditorStateReducer<ComponentDefinitionId>(
  (state, { payload: id }) => {
    const def = get(state.ecs.componentDefinitions, id);
    if (!def) {
      throw new Error("Could not find component definition to duplicate");
    }

    const duplicate: ComponentDefinition = {
      ...def,
      id: uuid(),
      nodeId: uuid(),
      name: duplicateName(def.name),
    };
    set(state.ecs.componentDefinitions, duplicate.id, duplicate);
  }
);