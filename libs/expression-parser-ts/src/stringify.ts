import type { ASTNode } from "./ast-nodes";

/**
 * 将 AST 节点转换为表达式字符串
 * @param node AST 节点
 * @returns 表达式字符串
 */
export function stringify(node: ASTNode): string {
  return node.toText();
}
