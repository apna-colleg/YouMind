const pkgs = [
  '@tiptap/starter-kit',
  '@tiptap/extension-link',
  '@tiptap/extension-image',
  '@tiptap/extension-placeholder',
  '@tiptap/extension-task-list',
  '@tiptap/extension-task-item',
  '@tiptap/extension-underline',
  '@tiptap/extension-highlight',
];
for (const pkg of pkgs) {
  try {
    const m = require(pkg);
    const keys = Object.keys(m);
    const hasDefault = 'default' in m;
    console.log(`${pkg}: default=${hasDefault} exports=[${keys.join(', ')}]`);
  } catch(e) {
    console.log(`${pkg}: ERROR ${e.message}`);
  }
}
