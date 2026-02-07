export function printSceneGraph(root) {
  console.log("------ SCENE GRAPH ------");

  function recurse(obj, depth, path) {
    const indent = "  ".repeat(depth);
    const type = obj.isMesh ? "Mesh" : "Group";

    console.log(
      `${indent}- ${obj.name || "(no-name)"}  [${type}]   path: ${path}`
    );

    obj.children.forEach((child, i) => {
      recurse(child, depth + 1, `${path}/${child.name || "(no-name)"}`);
    });
  }

  recurse(root, 0, root.name || "root");
}
