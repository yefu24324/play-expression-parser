import { describe, expect, test } from "vitest";
import { Kind, Lexer, type Token } from "./lexer";

describe("规则表达式 - 词法分析器", () => {
  test("数值解析", async () => {
    expect(new Lexer("123456").lex()).toStrictEqual([{ kind: Kind.NumericLiteral, content: "123456" }] as Token[]);
    expect(new Lexer("33.3333").lex()).toStrictEqual([{ kind: Kind.NumericLiteral, content: "33.3333" }] as Token[]);
    expect(new Lexer("0.111").lex()).toStrictEqual([{ kind: Kind.NumericLiteral, content: "0.111" }] as Token[]);
    expect(new Lexer("123.0").lex()).toStrictEqual([{ kind: Kind.NumericLiteral, content: "123.0" }] as Token[]);
  });

  test("字符串解析", async () => {
    expect(new Lexer('"name,age,test"').lex()).toStrictEqual([
      { kind: Kind.StringLiteral, content: "name,age,test" },
    ] as Token[]);
  });

  test("模板匹配", async () => {
    expect(new Lexer("{order}").lex()).toStrictEqual([{ kind: Kind.Template, content: "order" }] as Token[]);
    expect(new Lexer("{orderDetail}").lex()).toStrictEqual([
      { kind: Kind.Template, content: "orderDetail" },
    ] as Token[]);
    expect(new Lexer("{orderDetail.total}").lex()).toStrictEqual([
      { kind: Kind.Template, content: "orderDetail.total" },
    ] as Token[]);
  });

  test("二元表达式", async () => {
    expect(new Lexer("1 + 1").lex()).toStrictEqual([
      { kind: Kind.NumericLiteral, content: "1" },
      { kind: Kind.Plus, content: "+" },
      { kind: Kind.NumericLiteral, content: "1" },
    ] as Token[]);
    expect(new Lexer("128 + 2").lex()).toStrictEqual([
      { kind: Kind.NumericLiteral, content: "128" },
      { kind: Kind.Plus, content: "+" },
      { kind: Kind.NumericLiteral, content: "2" },
    ] as Token[]);
    expect(new Lexer("{order.total} / 100").lex()).toStrictEqual([
      { kind: Kind.Template, content: "order.total" },
      { kind: Kind.Slash, content: "/" },
      { kind: Kind.NumericLiteral, content: "100" },
    ] as Token[]);
    expect(new Lexer("{order.total} / 100 * 0.1 / {order.num}").lex()).toStrictEqual([
      { kind: Kind.Template, content: "order.total" },
      { kind: Kind.Slash, content: "/" },
      { kind: Kind.NumericLiteral, content: "100" },
      { kind: Kind.Asterisk, content: "*" },
      { kind: Kind.NumericLiteral, content: "0.1" },
      { kind: Kind.Slash, content: "/" },
      { kind: Kind.Template, content: "order.num" },
    ] as Token[]);
  });

  test("函数调用参数", async () => {
    expect(new Lexer("NumUpperRMB(29800)").lex()).toStrictEqual([
      { kind: Kind.Identifier, content: "NumUpperRMB" },
      { kind: Kind.LeftParen, content: "(" },
      { kind: Kind.NumericLiteral, content: "29800" },
      { kind: Kind.RightParen, content: ")" },
    ] as Token[]);
    expect(new Lexer("NumUpperRMB({order})").lex()).toStrictEqual([
      { kind: Kind.Identifier, content: "NumUpperRMB" },
      { kind: Kind.LeftParen, content: "(" },
      { kind: Kind.Template, content: "order" },
      { kind: Kind.RightParen, content: ")" },
    ] as Token[]);
  });

  test("复杂表达式", async () => {
    expect(new Lexer("100 + Sum({orderDetail.p} * {orderDetail.num}) / 100").lex()).toStrictEqual([
      { kind: Kind.NumericLiteral, content: "100" },
      { kind: Kind.Plus, content: "+" },
      { kind: Kind.Identifier, content: "Sum" },
      { kind: Kind.LeftParen, content: "(" },
      { kind: Kind.Template, content: "orderDetail.p" },
      { kind: Kind.Asterisk, content: "*" },

      { kind: Kind.Template, content: "orderDetail.num" },
      { kind: Kind.RightParen, content: ")" },
      { kind: Kind.Slash, content: "/" },
      { kind: Kind.NumericLiteral, content: "100" },
    ] as Token[]);
  });
});
