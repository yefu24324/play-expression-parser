"use client";

import { type Component, For, createContext, createEffect, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import type { FlattenNode, TreeNodeOptions } from "./common";
import { TreeNode, type TreeNodeBaseProps } from "./tree-node";
import { TreeDataHelper } from "./utils";

export interface TreeProps<T extends TreeNodeOptions = TreeNodeOptions> {
  ref?: HTMLDivElement;
  data: T[];

  /** 自定义节点渲染 */
  iconRender?: Component<TreeNodeBaseProps<T>>;

  /** 事件: 节点单击触发 */
  onClick?: (event: TreeClickEvent) => void;
  /** 事件: 节点双击触发 */
  onDblClick?: (event: TreeDblClickEvent) => void;
  /** 事件: 节点右键菜单触发 */
  onContextMenu?: (event: TreeContextMenuEvent<T>) => void;
  /** 事件: 节点展开/折叠触发 */
  onExpand?: (event: TreeExpandEvent<T>) => void;
  /** 事件: 节点选中触发 */
  onSelect?: () => void;
}

/** 树节点双击事件 */
export interface TreeClickEvent<T extends TreeNodeOptions = TreeNodeOptions> {
  node: FlattenNode;
  event: MouseEvent;
  treeContext: TreeDataHelper;
}

/** 树节点双击事件 */
export interface TreeDblClickEvent<T extends TreeNodeOptions = TreeNodeOptions> {
  node: FlattenNode;
  event: MouseEvent;
}

/** 树节点右键菜单事件 */
export interface TreeContextMenuEvent<T extends TreeNodeOptions = TreeNodeOptions> {
  node: FlattenNode<T>;
  event: MouseEvent;
}

/** 树节点展开/折叠事件 */
export interface TreeExpandEvent<T extends TreeNodeOptions = TreeNodeOptions> {
  node: FlattenNode<T>;
  expanded: boolean;
  event: MouseEvent;
}

export const TreeContext = createContext<TreeDataHelper>();

export function useTreeContext() {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error("useTreeContext must be used within a Tree component");
  }
  return context;
}

export function Tree<T extends TreeNodeOptions = TreeNodeOptions>(props: TreeProps<T>) {
  const treeDataHelper = new TreeDataHelper([]);
  let elRef: HTMLDivElement | undefined;
  const [options, setOptions] = createStore({
    count: 0,
    getScrollElement: () => {
      return elRef || null;
    },
    estimateSize: () => 30,
    getItemKey: (index: number) => treeDataHelper.flattenList()[index]?.key(),
    overscan: 5,
  });
  createEffect(() => {
    setOptions({ ...options, count: treeDataHelper.flattenList().length });
  });
  createEffect(() => {
    treeDataHelper.setRoots(props.data);
  });

  function handleClick(event: TreeClickEvent) {
    props.onClick?.(event);
  }

  function handleDblClick(event: TreeDblClickEvent) {
    props.onDblClick?.(event);
  }

  function handleContextMenu(event: TreeContextMenuEvent<T>) {
    props.onContextMenu?.(event);
  }

  function handleExpand(event: TreeExpandEvent<T>) {
    props.onExpand?.(event);
    treeDataHelper.toggleExpand(event.node);
  }

  function handleSelect() {
    props.onSelect?.();
  }

  return (
    <TreeContext.Provider value={treeDataHelper}>
      <div ref={elRef} style={{ overflow: "auto" }}>
        <For each={treeDataHelper.flattenList()}>
          {(node) => {
            return (
              <TreeNode<T>
                treeNode={node as FlattenNode<T>}
                key={node.key()}
                title={node.origin.title}
                icon={node.origin.icon}
                expanded={treeDataHelper.expandedKeys().includes(node.key())}
                iconRender={props.iconRender as Component<TreeNodeBaseProps>}
                onClick={handleClick}
                onDblClick={handleDblClick}
                onContextMenu={handleContextMenu}
                onExpand={handleExpand}
              />
            );
          }}
        </For>
      </div>
    </TreeContext.Provider>
  );
}
