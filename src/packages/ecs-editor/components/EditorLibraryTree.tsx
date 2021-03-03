import { ChangeEvent, useMemo, useState } from "react";
import { TreeView } from "@material-ui/lab";
import {
  LibraryNode,
  LibraryNodeId,
} from "../../ecs-serializable/types/LibraryNode";
import { LibraryDefinition } from "../../ecs-serializable/types/LibraryDefinition";
import { createLibraryTree } from "../functions/createLibraryTree";
import { createLibraryMap } from "../functions/createLibraryMap";
import { getLibraryNodeLabel } from "../functions/getLibraryNodeLabel";
import { TreeNode } from "../types/TreeNode";
import { EditorLibraryTreeItems } from "./EditorLibraryTreeItems";

export type EditorLibraryTreeProps = {
  selected?: LibraryNode;
  onSelectedChange: (newSelected: LibraryNode) => void;
  library: LibraryDefinition;
};

/**
 * Displays a LibraryDefinition as a MUI TreeView.
 */
export const EditorLibraryTree = ({
  library,
  selected,
  onSelectedChange,
}: EditorLibraryTreeProps) => {
  const [expanded, setExpanded] = useState<LibraryNodeId[]>([]);
  const [nodeMap, treeRoots] = useMemo(() => {
    const map = createLibraryMap(library);
    return [
      map,
      createLibraryTree(library, { compareFn: compareLibraryTreeNodes }),
    ] as const;
  }, [library]);

  const handleToggle = (e: ChangeEvent<{}>, nodeIds: string[]) =>
    setExpanded(nodeIds as LibraryNodeId[]);

  const handleSelect = (e: ChangeEvent<{}>, nodeIdStr: string) => {
    // Cannot select folders
    const nodeId = nodeIdStr as LibraryNodeId;
    const node = nodeMap.get(nodeId);
    if (node && node.type !== "folder") {
      onSelectedChange(node);
    }
  };

  return (
    <TreeView
      expanded={expanded}
      selected={selected?.id ?? ""}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    >
      <EditorLibraryTreeItems nodes={treeRoots} />
    </TreeView>
  );
};

const compareLibraryTreeNodes = (
  a: TreeNode<LibraryNode>,
  b: TreeNode<LibraryNode>
) => {
  const aLabel = getLibraryNodeLabel(a.value);
  const bLabel = getLibraryNodeLabel(b.value);
  return aLabel.localeCompare(bLabel);
};
