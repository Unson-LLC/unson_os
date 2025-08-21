/**
 * WARNING: DO NOT MODIFY THIS FILE
 * This file is auto-generated and any manual changes will be overwritten.
 */

import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import * as t from "@babel/types";

const traverse = _traverse.default;
const generate = _generate.default;

function componentSpecTree() {
  const cwd = process.cwd();
  const stats = {
    totalFiles: 0,
    processedFiles: 0,
    totalElements: 0,
  };
  return {
    name: "vite-plugin-spec-tree",
    enforce: "pre",
    async transform(code, id) {
      if (!/\.(jsx|tsx)$/.test(id) || id.includes("node_modules")) {
        return null;
      }

      try {
        const parserOptions = {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
        };

        const ast = parse(code, parserOptions);

        const visited = new Set();

        // 2. Traverse AST to modify JSX
        traverse(ast, {
          JSXElement(path) {
            const openingElement = path.node.openingElement;

            if (visited.has(path.node)) {
              return;
            }

            // Only process components starting with uppercase (custom components)
            if (
              t.isJSXIdentifier(openingElement.name) &&
              /^[A-Z]/.test(openingElement.name.name)
            ) {
              const componentName = openingElement.name.name;
              const lineNumber = openingElement.loc?.start.line || "unknown";

              if (
                componentName.startsWith("Route") ||
                componentName === "BrowserRouter"
              ) {
                return;
              }

              // Find data-spec-id
              let doraId = "";
              if (openingElement.attributes.length > 0) {
                const attr = openingElement.attributes.find(
                  (attr) =>
                    attr && attr.name && attr.name.name === "data-spec-id"
                );
                if (attr) {
                  doraId = attr.value.value;
                }
              }

              if (!doraId) {
                return;
              }

              // Generate <specai-tag-start> node
              const debugStart = t.jsxElement(
                t.jsxOpeningElement(
                  t.jsxIdentifier("specai-tag-start"),
                  [
                    t.jsxAttribute(
                      t.jsxIdentifier("data-component-name"),
                      t.stringLiteral(componentName)
                    ),
                    t.jsxAttribute(
                      t.jsxIdentifier("data-spec-id"),
                      t.stringLiteral(String(doraId))
                    ),
                  ],
                  true // Self-closing
                ),
                null,
                [],
                true
              );

              // Generate <specai-tag-end> node
              const debugEnd = t.jsxElement(
                t.jsxOpeningElement(
                  t.jsxIdentifier("specai-tag-end"),
                  [
                    t.jsxAttribute(
                      t.jsxIdentifier("data-component-name"),
                      t.stringLiteral(componentName)
                    ),
                    t.jsxAttribute(
                      t.jsxIdentifier("data-spec-id"),
                      t.stringLiteral(String(doraId))
                    ),
                  ],
                  true // Self-closing
                ),
                null,
                [],
                true
              );

              // Wrap original child nodes + debug tags with Fragment (<>)
              const fragment = t.jsxFragment(
                t.jsxOpeningFragment(),
                t.jsxClosingFragment(),
                [
                  debugStart, // <specai-tag-start>
                  path.node, // Original child nodes
                  debugEnd, // <specai-tag-end>
                ]
              );

              visited.add(path.node);
              // Replace current node with Fragment
              path.replaceWith(fragment);
            }
          },
        });

        // 3. Generate modified code
        return generate(ast).code;
      } catch (error) {
        console.error("Error processing file " + id + ":", error);
        stats.processedFiles++;
        return null;
      }
    },
  };
}

export { componentSpecTree };
