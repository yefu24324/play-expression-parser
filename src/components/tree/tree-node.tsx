import { type Component, type JSX, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { FlattenNode, TreeNodeOptions } from "./common";
import {
  type TreeClickEvent,
  type TreeContextMenuEvent,
  type TreeDblClickEvent,
  type TreeExpandEvent,
  useTreeContext,
} from "./tree";

export interface TreeNodeBaseProps<T extends TreeNodeOptions = TreeNodeOptions> {
  key: string;
  title: string | JSX.Element;
  expanded: boolean;
  icon: JSX.Element;
  treeNode: FlattenNode<T>;
}

export interface TreeNodeProps<T extends TreeNodeOptions = TreeNodeOptions> extends TreeNodeBaseProps<T> {
  ref?: HTMLDivElement;
  style?: JSX.CSSProperties;

  /** 自定义节点渲染 */
  iconRender?: (props: TreeNodeBaseProps) => JSX.Element;

  /** 事件: 节点单击触发 */
  onClick: (event: TreeClickEvent) => void;
  /** 事件: 节点双击触发 */
  onDblClick: (event: TreeDblClickEvent) => void;
  /** 事件: 节点右键菜单触发 */
  onContextMenu: (event: TreeContextMenuEvent<T>) => void;
  /** 事件: 节点展开/折叠触发 */
  onExpand: (event: TreeExpandEvent<T>) => void;
}

export function TreeNode<T extends TreeNodeOptions = TreeNodeOptions>(props: TreeNodeProps<T>) {
  const treeContext = useTreeContext();
  return (
    <div
      class="py-0.5 flex items-center gap-x-0.5 w-full"
      classList={{
        "fl-tree-node": true,
        "fl-tree-node-expanded": props.expanded,
      }}
      ref={props.ref}
      style={props.style}
      onClick={(event) => props.onClick({ node: props.treeNode, event, treeContext })}
      onDblClick={(event) => props.onDblClick({ node: props.treeNode, event })}
      onContextMenu={(event) => props.onContextMenu({ node: props.treeNode, event })}
      onKeyDown={() => {}}
    >
      <div class="fl-tree-node-indent" style={{ "padding-left": `${props.treeNode.indent * 20}px` }} />
      <TreeNodeToggle
        isLeaf={props.treeNode.isLeaf()}
        expanded={props.expanded}
        onClick={(event) => props.onExpand({ node: props.treeNode, expanded: !props.expanded, event })}
      />

      <TreeNodeTitle
        treeNode={props.treeNode}
        key={props.key}
        title={props.title}
        icon={props.icon}
        expanded={!props.expanded}
        iconRender={props.iconRender}
      />
    </div>
  );
}

export function TreeNodeTitle(props: TreeNodeBaseProps & { iconRender?: Component<TreeNodeBaseProps> }) {
  const icon = props.iconRender || props.icon;
  return (
    <div class="px-1.5 rounded-md cursor-pointer select-none">
      <Show when={icon}>
        <div class="fl-tree-node-title-icon">
          {typeof icon === "function" ? <Dynamic component={icon} {...props} /> : icon}
        </div>
      </Show>
      <span class="text-sm text-gray-800 dark:text-neutral-200">{props.title}</span>
    </div>
  );
}

export function TreeNodeToggle(props: { isLeaf: boolean; expanded?: boolean; onClick?: (event: MouseEvent) => void }) {
  return (
    <Show when={!props.isLeaf} fallback={<div class="size-6" />}>
      <button
        class="size-6 flex justify-center items-center cursor-pointer hover:bg-gray-100 rounded-md focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
        onClick={(event) => {
          event.stopPropagation();
          props.onClick?.(event);
        }}
        onKeyDown={() => {}}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-4 text-gray-800 dark:text-neutral-200 transition-all"
          classList={{
            "rotate-90": props.expanded,
          }}
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </Show>
  );
}
