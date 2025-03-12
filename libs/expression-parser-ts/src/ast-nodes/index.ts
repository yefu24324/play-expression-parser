import { Kind } from "../lexer";
import type {
  AsteriskToken,
  ExpressionToken,
  Identifier,
  MinusToken,
  NumericLiteral,
  PlusToken,
  SlashToken,
  StringLiteral,
  Template,
} from "./types";

export * from "./types";

/** AST 节点 */
export abstract class ASTNode {
  kind: Kind;

  protected constructor(type: Kind) {
    this.kind = type;
  }

  abstract toText(): string;

  abstract toJSON(): ExpressionToken;

  /** 是否是数字字面量 */
  isNumericLiteral(): this is NumericLiteralNode {
    return this.kind === Kind.NumericLiteral;
  }

  /** 是否是字符串字面量 */
  isStringLiteral(): this is StringLiteralNode {
    return this.kind === Kind.StringLiteral;
  }

  /** 是否是加号 */
  isPlus(): this is PlusNode {
    return this.kind === Kind.Plus;
  }

  /** 是否是减号 */
  isMinus(): this is MinusNode {
    return this.kind === Kind.Minus;
  }

  /** 是否是星号 */
  isAsterisk(): this is AsteriskNode {
    return this.kind === Kind.Asterisk;
  }

  /** 是否是斜杆 */
  isSlash(): this is SlashNode {
    return this.kind === Kind.Slash;
  }

  /** 是否是二元表达式 */
  isBinaryExpression(): this is BinaryExpressionNode {
    return this.kind === Kind.BinaryExpression;
  }

  /** 是否是模板 */
  isTemplate(): this is TemplateNode {
    return this.kind === Kind.Template;
  }

  /** 是否是标识符 */
  isIdentifier(): this is IdentifierNode {
    return this.kind === Kind.Identifier;
  }

  /** 是否是函数调用 */
  isCallExpression(): this is CallExpressionNode {
    return this.kind === Kind.CallExpression;
  }
}

/** 加号节点 */
export class PlusNode extends ASTNode {
  constructor() {
    super(Kind.Plus);
  }

  toText(): string {
    return "+";
  }

  toJSON(): PlusToken {
    return {
      kind: Kind.Plus,
    };
  }
}

/** 减号节点 */
export class MinusNode extends ASTNode {
  constructor() {
    super(Kind.Minus);
  }

  toText(): string {
    return "-";
  }

  toJSON(): MinusToken {
    return {
      kind: Kind.Minus,
    };
  }
}

/** 星号节点 */
export class AsteriskNode extends ASTNode {
  constructor() {
    super(Kind.Asterisk);
  }

  toText(): string {
    return "*";
  }

  toJSON(): AsteriskToken {
    return {
      kind: Kind.Asterisk,
    };
  }
}

/** 斜杆节点 */
export class SlashNode extends ASTNode {
  constructor() {
    super(Kind.Slash);
  }

  toText(): string {
    return "/";
  }

  toJSON(): SlashToken {
    return {
      kind: Kind.Slash,
    };
  }
}

/** 数字字面量节点 */
export class NumericLiteralNode extends ASTNode {
  constructor(public value: number) {
    super(Kind.NumericLiteral);
  }

  toText(): string {
    return this.value.toString();
  }

  toJSON(): NumericLiteral {
    return {
      kind: Kind.NumericLiteral,
      value: this.value,
    };
  }
}

/** 字符串字面量节点 */
export class StringLiteralNode extends ASTNode {
  constructor(public value: string) {
    super(Kind.StringLiteral);
  }

  toText(): string {
    return `"${this.value}"`;
  }

  toJSON(): StringLiteral {
    return {
      kind: Kind.StringLiteral,
      value: this.value,
    };
  }
}

/** 二元表达式节点 */
export class BinaryExpressionNode extends ASTNode {
  constructor(
    public operator: PlusNode | MinusNode | AsteriskNode | SlashNode,
    public left: ASTNode,
    public right: ASTNode,
  ) {
    super(Kind.BinaryExpression);
  }

  toText(): string {
    return `${this.left.toText()} ${this.operator.toText()} ${this.right.toText()}`;
  }

  toJSON(): ExpressionToken {
    return {
      kind: Kind.BinaryExpression,
      operator: this.operator.toJSON(),
      left: this.left.toJSON(),
      right: this.right.toJSON(),
    };
  }
}

/** 模板节点 */
export class TemplateNode extends ASTNode {
  constructor(public content: string) {
    super(Kind.Template);
  }

  toText(): string {
    return `{${this.content}}`;
  }

  toJSON(): Template {
    return {
      kind: Kind.Template,
      content: this.content,
    };
  }
}

/** 标识符节点 */
export class IdentifierNode extends ASTNode {
  constructor(public name: string) {
    super(Kind.Identifier);
  }

  toText(): string {
    return this.name;
  }

  toJSON(): Identifier {
    return {
      kind: Kind.Identifier,
      name: this.name,
    };
  }
}

/** 函数调用节点 */
export class CallExpressionNode extends ASTNode {
  constructor(
    public identifier: IdentifierNode,
    public args: ASTNode[],
  ) {
    super(Kind.CallExpression);
  }

  toText(): string {
    return `${this.identifier.toText()}(${this.args.map((arg) => arg.toText()).join(", ")})`;
  }

  toJSON(): ExpressionToken {
    return {
      kind: Kind.CallExpression,
      identifier: this.identifier.toJSON(),
      arguments: this.args.map((arg) => arg.toJSON()),
    };
  }
}
