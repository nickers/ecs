import { MenuList, Paper } from "@material-ui/core";
import { memo } from "react";
import { useSelector } from "../store";
import { selectSelectedSystemDefinition } from "../selectors/selectSelectedSystemDefinition";
import { Center } from "../components/Center";
import { SystemSyncContext, useSystemSync } from "../hooks/useSystemSync";
import { SystemHeader } from "./SystemHeader";
import { PanelContainer } from "./PanelContainer";
import { RuntimePanel } from "./RuntimePanel";
import { InspectorPanel } from "./InspectorPanel";
import { HierarchyPanel } from "./HierarchyPanel";
import { LibraryPanel } from "./LibraryPanel";
import { useFileMenuItems } from "./FileMenu";

export const Content = memo(() => {
  const selectedSystem = useSelector(selectSelectedSystemDefinition);
  const systemSync = useSystemSync();
  const menuItems = useFileMenuItems();

  if (!selectedSystem) {
    return (
      <Center>
        <Paper>
          <MenuList>{menuItems}</MenuList>
        </Paper>
      </Center>
    );
  }
  return (
    <SystemSyncContext.Provider value={systemSync}>
      <SystemHeader />
      <PanelContainer>
        <LibraryPanel />
        <HierarchyPanel />
        <InspectorPanel />
        <RuntimePanel />
      </PanelContainer>
    </SystemSyncContext.Provider>
  );
});