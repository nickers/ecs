import { values } from "../../nominal";
import { EditorState } from "../types/EditorState";

export const selectListOfComponentDefinition = (
  state: EditorState,
  forSystemId = state.selection.system
) =>
  values(state.ecs.componentDefinitions).filter(
    (component) => component.systemId === forSystemId
  );
