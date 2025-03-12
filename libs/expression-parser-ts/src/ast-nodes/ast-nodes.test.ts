import { Kind, Parser } from "@feiling/expression-parser";
import { describe, expect, test } from "vitest";
import {
  AsteriskNode,
  BinaryExpressionNode,
  CallExpressionNode,
  IdentifierNode,
  MinusNode,
  NumericLiteralNode,
  PlusNode,
  SlashNode,
  StringLiteralNode,
  TemplateNode,
} from "./index";

describe("AST 节点 toText() 方法测试", () => {
  describe("基础字面量节点", () => {
    test("数值字面量", () => {
      expect(new NumericLiteralNode(123).toText()).toBe("123");
      expect(new NumericLiteralNode(-456).toText()).toBe("-456");
      expect(new NumericLiteralNode(0).toText()).toBe("0");
      expect(new NumericLiteralNode(3.14).toText()).toBe("3.14");
    });

    test("字符串字面量", () => {
      expect(new StringLiteralNode("hello").toText()).toBe(`"hello"`);
      expect(new StringLiteralNode("").toText()).toBe(`""`);
      expect(new StringLiteralNode("123").toText()).toBe(`"123"`);
      expect(new StringLiteralNode("hello world").toText()).toBe(`"hello world"`);
    });
  });

  describe("操作符节点", () => {
    test("加号", () => {
      expect(new PlusNode().toText()).toBe("+");
    });

    test("减号", () => {
      expect(new MinusNode().toText()).toBe("-");
    });

    test("乘号", () => {
      expect(new AsteriskNode().toText()).toBe("*");
    });

    test("除号", () => {
      expect(new SlashNode().toText()).toBe("/");
    });
  });

  describe("模板节点", () => {
    test("简单模板", () => {
      expect(new TemplateNode("order").toText()).toBe("{order}");
      expect(new TemplateNode("user.name").toText()).toBe("{user.name}");
      expect(new TemplateNode("items[0].price").toText()).toBe("{items[0].price}");
    });
  });

  describe("标识符节点", () => {
    test("简单标识符", () => {
      expect(new IdentifierNode("Sum").toText()).toBe("Sum");
      expect(new IdentifierNode("Average").toText()).toBe("Average");
      expect(new IdentifierNode("Count").toText()).toBe("Count");
    });
  });

  describe("函数调用节点", () => {
    test("无参数函数调用", () => {
      const call = new CallExpressionNode(new IdentifierNode("Now"), []);
      expect(call.toText()).toBe("Now()");
    });

    test("单参数函数调用", () => {
      const call = new CallExpressionNode(new IdentifierNode("Abs"), [new NumericLiteralNode(-123)]);
      expect(call.toText()).toBe("Abs(-123)");
    });

    test("多参数函数调用", () => {
      const call = new CallExpressionNode(new IdentifierNode("Sum"), [
        new NumericLiteralNode(1),
        new NumericLiteralNode(2),
        new NumericLiteralNode(3),
      ]);
      expect(call.toText()).toBe("Sum(1, 2, 3)");
    });

    test("嵌套函数调用", () => {
      const call = new CallExpressionNode(new IdentifierNode("Max"), [
        new NumericLiteralNode(1),
        new CallExpressionNode(new IdentifierNode("Min"), [new NumericLiteralNode(2), new NumericLiteralNode(3)]),
      ]);
      expect(call.toText()).toBe("Max(1, Min(2, 3))");
    });
  });

  describe("二元表达式节点", () => {
    test("简单加法", () => {
      const expr = new BinaryExpressionNode(new PlusNode(), new NumericLiteralNode(1), new NumericLiteralNode(2));
      expect(expr.toText()).toBe("1 + 2");
    });

    test("简单减法", () => {
      const expr = new BinaryExpressionNode(new MinusNode(), new NumericLiteralNode(5), new NumericLiteralNode(3));
      expect(expr.toText()).toBe("5 - 3");
    });

    test("简单乘法", () => {
      const expr = new BinaryExpressionNode(new AsteriskNode(), new NumericLiteralNode(4), new NumericLiteralNode(2));
      expect(expr.toText()).toBe("4 * 2");
    });

    test("简单除法", () => {
      const expr = new BinaryExpressionNode(new SlashNode(), new NumericLiteralNode(8), new NumericLiteralNode(4));
      expect(expr.toText()).toBe("8 / 4");
    });

    test("复杂表达式", () => {
      // 构建表达式: (1 + 2) * (3 - 4)
      const expr = new BinaryExpressionNode(
        new AsteriskNode(),
        new BinaryExpressionNode(new PlusNode(), new NumericLiteralNode(1), new NumericLiteralNode(2)),
        new BinaryExpressionNode(new MinusNode(), new NumericLiteralNode(3), new NumericLiteralNode(4)),
      );
      expect(expr.toText()).toBe("1 + 2 * 3 - 4");
    });

    test("混合表达式", () => {
      // 构建表达式: Sum(1, 2 + 3) * {order.price}
      const expr = new BinaryExpressionNode(
        new AsteriskNode(),
        new CallExpressionNode(new IdentifierNode("Sum"), [
          new NumericLiteralNode(1),
          new BinaryExpressionNode(new PlusNode(), new NumericLiteralNode(2), new NumericLiteralNode(3)),
        ]),
        new TemplateNode("order.price"),
      );
      expect(expr.toText()).toBe("Sum(1, 2 + 3) * {order.price}");
    });
  });
});
