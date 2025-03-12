import { type Accessor, type Setter, createSignal, untrack } from "solid-js";
import { FlattenNode, type TreeNodeOptions } from "../common";

export class TreeDataHelper {
  roots: FlattenNode[] = [];
  flattenList: Accessor<FlattenNode[]>;
  setFlattenList: Setter<FlattenNode[]>;
  expandedKeys: Accessor<string[]>;
  setExpandedKeys: Setter<string[]>;

  constructor(public data: TreeNodeOptions[]) {
    const [flattenList, setFlattenList] = createSignal<FlattenNode[]>([]);
    const [expandedKeys, setExpandedKeys] = createSignal<string[]>([]);
    this.flattenList = flattenList;
    this.setFlattenList = setFlattenList;
    this.expandedKeys = expandedKeys;
    this.setExpandedKeys = setExpandedKeys;
  }

  flattenTreeData() {
    this.setFlattenList(flattenTreeData(this.roots, this.expandedKeys()));
  }

  /**
   * @deprecated
   */
  setRoots(roots: TreeNodeOptions[]) {
    untrack(() => {
      this.roots = roots.map((node) => new FlattenNode(node));
      this.flattenTreeData();
    });
  }

  /**
   * 展开/收起节点
   */
  toggleExpand(flattenNode: FlattenNode, expanded?: boolean) {
    const expandedKeys = this.expandedKeys();
    const key = flattenNode.key();
    const index = expandedKeys.indexOf(key);
    if (expanded === undefined) {
      if (index === -1) {
        expandedKeys.push(key);
      } else {
        expandedKeys.splice(index, 1);
      }
    } else {
      if (expanded) {
        if (index === -1) {
          expandedKeys.push(key);
        }
      } else {
        if (index !== -1) {
          expandedKeys.splice(index, 1);
        }
      }
    }
    this.setExpandedKeys([...expandedKeys]);
    this.flattenTreeData();
  }
}

export function flattenTreeData(treeNodeList: FlattenNode[], expandedKeys: string[] | true): FlattenNode[] {
  const flattenList: FlattenNode[] = [];
  const expandedKeySet = new Set(expandedKeys === true ? [] : expandedKeys);

  function dig(list: FlattenNode[], parent: FlattenNode | null = null): FlattenNode[] {
    return list.map((flattenNode, index) => {
      flattenList.push(flattenNode);
      if (expandedKeys === true || expandedKeySet.has(flattenNode.key())) {
        dig(flattenNode.children || [], flattenNode);
      }
      return flattenNode;
    });
  }

  dig(treeNodeList);
  return flattenList;
}
