// biome-ignore lint/style/useEnumInitializers: <这是解析器指示token类型的枚举，不要保存这种数据>
export enum Kind {
  /** 加号 */
  Plus,
  /** 减号 */
  Minus,
  /** 星号 */
  Asterisk,
  /** 除号 */
  Slash,
  /** 左括号 */
  LeftParen,
  /** 右括号 */
  RightParen,
  /** 数值字面量 */
  NumericLiteral,
  /** 字符串字面量 */
  StringLiteral,
  /** 标识符 */
  Identifier,
  /** 二元表达式 */
  BinaryExpression,
  /** 模板变量 例: {order} */
  Template,
  /** 函数调用 */
  CallExpression,
  /** 逗号 */
  Comma,
  /** 结束符 */
  EOF,
}

/** 词法分析器的token类型 */
export type Token = {
  kind: Kind;
  content: string;
};

/** 词法分析器 */
export class Lexer {
  private current = 0;
  private tokens: Token[] = [];
  constructor(public readonly expression: string) {}

  /**
   * 一个有限状态机 用于表达式解析文本
   */
  lex(): Token[] {
    const len = this.expression.length;
    while (this.current < len) {
      const start = this.current;
      const ch = this.expression[start];
      // 跳过空白字符
      if (this.isBlank(ch)) {
        this.current++;
        continue;
      }
      // 如果是数字
      if (/\d/.test(ch)) {
        const token = this.lexNumericLiteral();
        this.tokens.push(token);
        continue;
      }
      // 如果是字符串
      if ('"' === ch) {
        const token = this.lexStringLiteral();
        this.tokens.push(token);
        continue;
      }
      // 符号
      if ("(" === ch) {
        this.tokens.push({ kind: Kind.LeftParen, content: ch });
        this.current++;
        continue;
      }
      if (")" === ch) {
        this.tokens.push({ kind: Kind.RightParen, content: ch });
        this.current++;
        continue;
      }
      if ("{" === ch) {
        const token = this.lexTemplate();
        this.tokens.push(token);
        continue;
      }
      if ("+" === ch) {
        this.tokens.push({ kind: Kind.Plus, content: ch });
        this.current++;
        continue;
      }
      if ("-" === ch) {
        this.tokens.push({ kind: Kind.Minus, content: ch });
        this.current++;
        continue;
      }
      if ("*" === ch) {
        this.tokens.push({ kind: Kind.Asterisk, content: ch });
        this.current++;
        continue;
      }
      if ("/" === ch) {
        this.tokens.push({ kind: Kind.Slash, content: ch });
        this.current++;
        continue;
      }
      if ("," === ch) {
        this.tokens.push({ kind: Kind.Comma, content: ch });
        this.current++;
        continue;
      }
      // 识别标识符
      const last = this.tokens[this.tokens.length - 1];
      // 如果上一个是标识符
      if (last && last.kind === Kind.Identifier) {
        last.content += ch;
        this.current++;
      } else {
        this.tokens.push({
          kind: Kind.Identifier,
          content: ch,
        });
        this.current++;
      }
    }
    return this.tokens;
  }

  /**
   * 提取数字字面量
   */
  private lexNumericLiteral(): Token {
    const start = this.current;
    while (/\d/.test(this.expression[this.current])) {
      this.current++;
    }
    if ("." === this.expression[this.current]) {
      this.current++;
      // 小数点后面的数字
      while (/\d/.test(this.expression[this.current])) {
        this.current++;
      }
    }
    return {
      kind: Kind.NumericLiteral,
      content: this.expression.slice(start, this.current),
    };
  }

  /**
   * 提取字符串字面量
   */
  private lexStringLiteral(): Token {
    const start = this.current;
    // 跳过第一个引号
    this.current++;
    // 只要没有遇到第二个引号就一直往后走
    while ('"' !== this.expression[this.current]) {
      this.current++;
      if (this.current >= this.expression.length) {
        throw new SyntaxError("字符串没有闭合");
      }
    }
    // 跳过第二个引号
    this.current++;

    return {
      kind: Kind.StringLiteral,
      content: this.expression.slice(start + 1, this.current - 1),
    };
  }

  /**
   * 提取模板
   */
  private lexTemplate(): Token {
    const start = this.current;
    // 跳过第一个引号
    this.current++;
    // 只要没有遇到第二个引号就一直往后走
    while ("}" !== this.expression[this.current]) {
      this.current++;
      if (this.current >= this.expression.length) {
        throw new SyntaxError("模板没有闭合");
      }
    }
    // 跳过第二个引号
    this.current++;

    return {
      kind: Kind.Template,
      content: this.expression.slice(start + 1, this.current - 1),
    };
  }

  /**
   * 判断是否是空白字符
   */
  isBlank(ch: string): boolean {
    return ch === " " || ch === "\t" || ch === "\n";
  }
}
