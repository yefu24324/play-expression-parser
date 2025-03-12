import {
  type ASTNode,
  AsteriskNode,
  BinaryExpressionNode,
  CallExpressionNode,
  type ExpressionToken,
  IdentifierNode,
  MinusNode,
  NumericLiteralNode,
  PlusNode,
  SlashNode,
  StringLiteralNode,
  TemplateNode,
} from "./ast-nodes";
import { Kind, Lexer, type Token } from "./lexer";

export class Parser {
  current = 0;
  tokens: Token[];
  stack: ExpressionToken[] = [];

  constructor(expression: string) {
    this.tokens = new Lexer(expression).lex();
  }

  /**
   * 递归下降解析 - 语法分析器最高层结构：加减
   */
  parse(): ASTNode {
    let node = this.term();
    while (this.peek().kind === Kind.Plus || this.peek().kind === Kind.Minus) {
      if (this.peek().kind === Kind.Plus) {
        this.consume(Kind.Plus);
        node = new BinaryExpressionNode(new PlusNode(), node, this.term());
      }
      if (this.peek().kind === Kind.Minus) {
        this.consume(Kind.Minus);
        node = new BinaryExpressionNode(new MinusNode(), node, this.term());
      }
    }
    return node;
  }

  /**
   * 递归下降解析 -语法分析器中间层结构：乘除
   */
  term(): ASTNode {
    const token = this.factor();
    while (this.peek().kind === Kind.Asterisk || this.peek().kind === Kind.Slash) {
      if (this.peek().kind === Kind.Asterisk) {
        this.consume(Kind.Asterisk);
        return new BinaryExpressionNode(new AsteriskNode(), token, this.factor());
      }
      if (this.peek().kind === Kind.Slash) {
        this.consume(Kind.Slash);
        return new BinaryExpressionNode(new SlashNode(), token, this.factor());
      }
    }
    return token;
  }

  /**
   * 递归下降解析 - 语法分析器最底层结构：(整数,字符串,模板)或括号
   */
  factor(): ASTNode {
    const token = this.peek();
    // 数字
    if (token.kind === Kind.NumericLiteral) {
      this.consume(Kind.NumericLiteral);
      return new NumericLiteralNode(Number(token.content));
    }
    // 字符串
    if (token.kind === Kind.StringLiteral) {
      this.consume(Kind.StringLiteral);
      return new StringLiteralNode(token.content);
    }
    // 模板变量
    if (token.kind === Kind.Template) {
      this.consume(Kind.Template);
      return new TemplateNode(token.content);
    }
    // 括号
    if (token.kind === Kind.LeftParen) {
      this.consume(Kind.LeftParen);
      const node = this.parse();
      this.consume(Kind.RightParen);
      return node;
    }
    // 标识符
    if (token.kind === Kind.Identifier) {
      const id = this.consume(Kind.Identifier);
      const node = new IdentifierNode(id.content);
      // 升级成函数调用
      if (this.peek().kind === Kind.LeftParen) {
        // 参数列表
        const args = this.parseArguments();
        return new CallExpressionNode(node, args);
      }
      return new StringLiteralNode(token.content);
    }
    throw new Error(`Unexpected token ${token.content}`);
  }

  /** 解析参数列表 */
  parseArguments(): ASTNode[] {
    if (this.peek().kind !== Kind.LeftParen) {
      throw new Error("Expected '('");
    }
    // 消费左括号
    this.consume(Kind.LeftParen);
    const args: ASTNode[] = [];
    // 递归解析参数
    while (this.peek().kind !== Kind.RightParen) {
      args.push(this.parse());
      if (this.peek().kind === Kind.Comma) {
        this.consume(Kind.Comma);
      }
    }
    // 消费右括号
    this.consume(Kind.RightParen);
    return args;
  }

  /**
   * 获取当前 token
   */
  peek(): Token {
    const token = this.tokens[this.current];
    if (!token) {
      return { kind: Kind.EOF, content: "" };
    }
    return token;
  }

  /**
   * 消费当前 token
   */
  consume(kind: Kind): Token {
    const token = this.peek();
    if (token.kind === kind) {
      this.current++;
      return token;
    }
    throw new Error(`Unexpected token ${token.content}`);
  }
}
