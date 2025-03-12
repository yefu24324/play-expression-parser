import { type ASTNode, Parser } from "@feiling/expression-parser";
import { createEffect, createSignal } from "solid-js";
import { Tree, type TreeClickEvent, type TreeNodeOptions } from "~/components/tree";
import { ASTNodeViewer } from "./expression-ast-node-viewer";

export interface AstTreeNodeOptions extends TreeNodeOptions {
  astNode: ASTNode;
}

export function ExpressionAstTree(props: { content?: string }) {
  const [tree, setTree] = createSignal<TreeNodeOptions[]>([]);
  const [selectedNode, setSelectedNode] = createSignal<ASTNode>();

  createEffect(() => {
    if (!props.content) return;
    try {
      const parser = new Parser(props.content);
      const ast = parser.parse();
      console.log(ast);
      setTree([toTreeNode(ast)]);
    } catch (error) {
      console.error(error);
    }
  });

  function handleClick(event: TreeClickEvent) {
    event.treeContext.toggleExpand(event.node);
    const origin = event.node.origin as AstTreeNodeOptions;
    setSelectedNode(origin.astNode);
  }

  return (
    <>
      <Tree data={tree()} onClick={handleClick} />
      <ASTNodeViewer node={selectedNode()} />
    </>
  );
}

export function toTreeNode(node: ASTNode): AstTreeNodeOptions {
  // 二元表达式
  if (node.isBinaryExpression()) {
    // 左值
    const leftNode = toTreeNode(node.left);
    leftNode.title = <div class="flex gap-x-1.5">left: {leftNode.title}</div>;
    // 操作符
    const operator = toTreeNode(node.operator);
    operator.title = <div class="flex gap-x-1.5">operator: {operator.title}</div>;
    // 右值
    const rightNode = toTreeNode(node.right);
    rightNode.title = <div class="flex gap-x-1.5">right: {rightNode.title}</div>;
    return {
      key: `${Math.random()}`,
      title: <div class="text-blue-500">BinaryExpression</div>,
      children: [leftNode, operator, rightNode],
      astNode: node,
    } as AstTreeNodeOptions;
  }
  // 函数调用
  if (node.isCallExpression()) {
    // 标识符
    const identifierNode = toTreeNode(node.identifier);
    identifierNode.title = <div class="flex gap-x-1.5">identifier: {identifierNode.title}</div>;
    // 参数
    const argsNode: AstTreeNodeOptions = {
      key: `${Math.random()}`,
      title: "arguments",
      astNode: node,
      children: node.args.map(toTreeNode),
    };
    return {
      key: `${Math.random()}`,
      title: <div class="text-blue-500">CallExpression</div>,
      astNode: node,
      children: [identifierNode, argsNode],
    } as AstTreeNodeOptions;
  }
  // 字符串字面量
  if (node.isStringLiteral()) {
    return {
      key: `${Math.random()}`,
      title: (
        <div class="flex text-blue-500">
          StringLiteral(<div class="text-[#40A02B]">{node.toText()}</div>)
        </div>
      ),
      isLeaf: true,
      astNode: node,
    } as AstTreeNodeOptions;
  }
  // 数字字面量
  if (node.isNumericLiteral()) {
    return {
      key: `${Math.random()}`,
      title: (
        <div class="flex text-blue-500">
          NumericLiteral(<div class="text-[#FE640B]">{node.toText()}</div>)
        </div>
      ),
      isLeaf: true,
      astNode: node,
    } as AstTreeNodeOptions;
  }
  // 标识符
  if (node.isIdentifier()) {
    return {
      key: `${Math.random()}`,
      title: (
        <div class="flex text-blue-500">
          Identifier(<div class="text-[#1E66F5]">{node.toText()}</div>)
        </div>
      ),
      isLeaf: true,
      astNode: node,
    } as AstTreeNodeOptions;
  }
  // 模板
  if (node.isTemplate()) {
    return {
      key: `${Math.random()}`,
      title: (
        <div class="flex text-blue-500">
          Template(<div class="text-[#1E66F5]">{node.content}</div>)
        </div>
      ),
      isLeaf: true,
      astNode: node,
    } as AstTreeNodeOptions;
  }

  if (node.isPlus()) {
    return {
      key: `${Math.random()}`,
      title: <div class="text-green-500">Plus</div>,
      isLeaf: true,
      astNode: node,
    } as AstTreeNodeOptions;
  }
  if (node.isMinus()) {
    return {
      key: `${Math.random()}`,
      title: <div class="text-green-500">Minus</div>,
      isLeaf: true,
      astNode: node,
    } as AstTreeNodeOptions;
  }
  if (node.isAsterisk()) {
    return {
      key: `${Math.random()}`,
      title: <div class="text-green-500">Asterisk</div>,
      isLeaf: true,
      astNode: node,
    } as AstTreeNodeOptions;
  }
  if (node.isSlash()) {
    return {
      key: `${Math.random()}`,
      title: <div class="text-green-500">Slash</div>,
      isLeaf: true,
      astNode: node,
    } as AstTreeNodeOptions;
  }
  throw new Error("Unknown node type");
}
