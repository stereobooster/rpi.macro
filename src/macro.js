const path = require("path");
const { execSync } = require("child_process");

const { createMacro } = require("babel-plugin-macros");

export default createMacro(rpiMacros);

function rpiMacros({ references, state, babel }) {
  references.default.map(referencePath => {
    if (referencePath.parentPath.type === "CallExpression") {
      requireRpi({ referencePath, state, babel });
    } else {
      throw new Error(
        `This is not supported: \`${referencePath
          .findParent(babel.types.isExpression)
          .getSource()}\`. Please see the rpi.macro documentation`,
      );
    }
  });
}

function requireRpi({ referencePath, state, babel }) {
  const filename = state.file.opts.filename;
  const t = babel.types;
  const callExpressionPath = referencePath.parentPath;
  const dirname = path.dirname(filename);
  let rpiPath;

  try {
    rpiPath = callExpressionPath.get("arguments")[0].evaluate().value;
  } catch (err) {
    // swallow error, print better error below
  }

  if (rpiPath === undefined) {
    throw new Error(
      `There was a problem evaluating the value of the argument for the code: ${callExpressionPath.getSource()}. ` +
        `If the value is dynamic, please make sure that its value is statically deterministic.`,
    );
  }

  const fullPath = path.resolve(dirname, rpiPath);
  let lqip, meta;
  try {
    lqip = syncLqip(fullPath);
    meta = syncMeta(fullPath);
  } catch (err) {
    throw new Error(
      `There was a problem getting rpi for: ${rpiPath}. ` +
        `Unsupported image format`,
    );
  }

  referencePath.parentPath.replaceWith(
    t.objectExpression([
      t.objectProperty(
        t.Identifier("placeholder"),
        t.objectExpression([
          t.objectProperty(t.Identifier("lqip"), t.stringLiteral(lqip)),
        ]),
      ),
      t.objectProperty(t.Identifier("width"), t.NumericLiteral(meta.width)),
      t.objectProperty(t.Identifier("height"), t.NumericLiteral(meta.height)),
      t.objectProperty(t.Identifier("size"), t.NumericLiteral(meta.size)),
    ]),
  );
}

function syncLqip(path) {
  return execSync("node " + __dirname + "/lqip.js " + path, { shell: false })
    .toString("utf8")
    .trim();
}

function syncMeta(path) {
  return JSON.parse(
    execSync("node " + __dirname + "/meta.js " + path, { shell: false })
      .toString("utf8")
      .trim(),
  );
}
