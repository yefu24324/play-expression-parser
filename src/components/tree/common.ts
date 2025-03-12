import { type Accessor, type JSX, type Setter, createSignal } from "solid-js";

/**
 * 树节点选项
 */
export interface TreeNodeOptions {
  key: string;
  title: string | JSX.Element;
  isLeaf?: boolean;
  expanded?: boolean;
  icon?: JSX.Element;
  children?: TreeNodeOptions[];
}

export class FlattenNode<T extends TreeNodeOptions = TreeNodeOptions> {
  indent = 0;
  key: Accessor<string>;
  isLeaf: Accessor<boolean>;

  origin: T;
  children: FlattenNode[] = [];

  private setKey: Setter<string>;
  setIsLeaf: Setter<boolean>;

  constructor(origin: T, indent = 0) {
    this.origin = origin;
    this.indent = indent;
    const [key, setKey] = createSignal<string>(origin.key);
    const [isLeaf, setIsLeaf] = createSignal<boolean>(origin.isLeaf || false);

    // getter
    this.key = key;
    this.isLeaf = isLeaf;
    // setter
    this.setKey = setKey;
    this.setIsLeaf = setIsLeaf;
    this.children = origin.children?.map((child) => new FlattenNode(child, indent + 1)) || [];
  }
}
