import { describe, expect, test } from "vitest";
import {
  AsteriskNode,
  BinaryExpressionNode,
  CallExpressionNode,
  IdentifierNode,
  NumericLiteralNode,
  PlusNode,
  StringLiteralNode,
  TemplateNode,
} from "./ast-nodes";
import { Parser } from "./parser";

describe("规则表达式 - 语法分析器", () => {
  test("数值解析", async () => {
    expect(new Parser("010").parse()).toStrictEqual(new NumericLiteralNode(10));
    expect(new Parser("123456").parse()).toStrictEqual(new NumericLiteralNode(123456));
    // TODO 支持负数
    // expect(new Parser("-123456").parse()).toStrictEqual(new NumericLiteralNode(-123456));
    // expect(new Parser("123456+1").parse()).toStrictEqual(new NumericLiteralNode(123456));
  });

  test("字符串解析", async () => {
    expect(new Parser('"123456"').parse()).toStrictEqual(new StringLiteralNode("123456"));
    expect(new Parser('"name,age,test"').parse()).toStrictEqual(new StringLiteralNode("name,age,test"));
    expect(new Parser('"hello" + " " + "world"').parse()).toStrictEqual(
      new BinaryExpressionNode(
        new PlusNode(),
        new BinaryExpressionNode(new PlusNode(), new StringLiteralNode("hello"), new StringLiteralNode(" ")),
        new StringLiteralNode("world"),
      ),
    );
  });

  test("二元表达式(加法,减法)", async () => {
    expect(new Parser("1 + 2").parse()).toStrictEqual(
      new BinaryExpressionNode(new PlusNode(), new NumericLiteralNode(1), new NumericLiteralNode(2)),
    );
    expect(new Parser("33 + 44").parse()).toStrictEqual(
      new BinaryExpressionNode(new PlusNode(), new NumericLiteralNode(33), new NumericLiteralNode(44)),
    );
    expect(new Parser("33 + 44 + 55").parse()).toStrictEqual(
      new BinaryExpressionNode(
        new PlusNode(),
        new BinaryExpressionNode(new PlusNode(), new NumericLiteralNode(33), new NumericLiteralNode(44)),
        new NumericLiteralNode(55),
      ),
    );
  });

  test("二元表达式(乘法,除法)", async () => {
    expect(new Parser("10 * 20").parse()).toStrictEqual(
      new BinaryExpressionNode(new AsteriskNode(), new NumericLiteralNode(10), new NumericLiteralNode(20)),
    );
  });

  test("二元表达式(加减乘除混合)", async () => {
    expect(new Parser("1 + 2 * 3").parse()).toStrictEqual(
      new BinaryExpressionNode(
        new PlusNode(),
        new NumericLiteralNode(1),
        new BinaryExpressionNode(new AsteriskNode(), new NumericLiteralNode(2), new NumericLiteralNode(3)),
      ),
    );
    expect(new Parser("22 * 1 + 10").parse()).toStrictEqual(
      new BinaryExpressionNode(
        new PlusNode(),
        new BinaryExpressionNode(new AsteriskNode(), new NumericLiteralNode(22), new NumericLiteralNode(1)),
        new NumericLiteralNode(10),
      ),
    );
  });

  test("括号表达式", async () => {
    expect(new Parser("(1 + 2) * 3").parse()).toStrictEqual(
      new BinaryExpressionNode(
        new AsteriskNode(),
        new BinaryExpressionNode(new PlusNode(), new NumericLiteralNode(1), new NumericLiteralNode(2)),
        new NumericLiteralNode(3),
      ),
    );
  });

  test("括号表达式 - 混合", async () => {
    expect(new Parser("(1 + 2) * (3 + 4)").parse()).toStrictEqual(
      new BinaryExpressionNode(
        new AsteriskNode(),
        new BinaryExpressionNode(new PlusNode(), new NumericLiteralNode(1), new NumericLiteralNode(2)),
        new BinaryExpressionNode(new PlusNode(), new NumericLiteralNode(3), new NumericLiteralNode(4)),
      ),
    );
  });

  test("带变量的表达式", async () => {
    expect(new Parser("{order.total} + 100").parse()).toStrictEqual(
      new BinaryExpressionNode(new PlusNode(), new TemplateNode("order.total"), new NumericLiteralNode(100)),
    );
    expect(new Parser("{order.total} + {order.total}").parse()).toStrictEqual(
      new BinaryExpressionNode(new PlusNode(), new TemplateNode("order.total"), new TemplateNode("order.total")),
    );
  });

  test("调用函数表达式", async () => {
    expect(new Parser("Now()").parse()).toStrictEqual(new CallExpressionNode(new IdentifierNode("Now"), []));
    expect(new Parser("Sum(5)").parse()).toStrictEqual(
      new CallExpressionNode(new IdentifierNode("Sum"), [new NumericLiteralNode(5)]),
    );
    expect(new Parser(`CONCAT("Hello", "World")`).parse()).toStrictEqual(
      new CallExpressionNode(new IdentifierNode("CONCAT"), [
        new StringLiteralNode("Hello"),
        new StringLiteralNode("World"),
      ]),
    );
  });
});
