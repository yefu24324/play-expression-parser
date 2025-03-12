import type { Kind } from "../lexer";

export type ExpressionToken =
  | PlusToken
  | MinusToken
  | AsteriskToken
  | SlashToken
  | CallExpression
  | NumericLiteral
  | StringLiteral
  | Template
  | Identifier
  | BinaryExpressionType;

/**
 * 加号节点
 */
export type PlusToken = {
  kind: Kind.Plus;
};

/**
 * 减号节点
 */
export type MinusToken = {
  kind: Kind.Minus;
};

/**
 * 星号节点
 */
export type AsteriskToken = {
  kind: Kind.Asterisk;
};

/**
 * 斜杆节点
 */
export type SlashToken = {
  kind: Kind.Slash;
};

/**
 * CallExpression 函数调用表达式
 * Identifier([arguments])
 * 例:
 * - Sum(1, 2)
 * - Sum(1, Sum(2, 3))
 * - Sum({orderDetail.price} * {orderDetail.quantity}),
 * - Sum({orderDetail.total})
 */
export type CallExpression = {
  kind: Kind.CallExpression;
  identifier: Identifier;
  arguments: ExpressionToken[];
};

export type NumericLiteral = {
  kind: Kind.NumericLiteral;
  value: number;
};

export type StringLiteral = {
  kind: Kind.StringLiteral;
  value: string;
};

export type Template = {
  kind: Kind.Template;
  content: string;
};

/**
 * Identifier 标识符
 */
export type Identifier = {
  kind: Kind.Identifier;
  name: string;
};

/**
 * BinaryExpression 二元表达式
 */
export type BinaryExpressionType = {
  kind: Kind.BinaryExpression;
  operator: PlusToken | MinusToken | AsteriskToken | SlashToken;
  left: ExpressionToken;
  right: ExpressionToken;
};
