import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';

// React component rendered for each wiki-link in the editor
function WikiLinkComponent({ node, editor }) {
  const title = node.attrs.title || 'Untitled';

  const handleClick = () => {
    // Dispatch custom event to navigate to linked note
    window.dispatchEvent(
      new CustomEvent('navigate-wikilink', {
        detail: { title },
      })
    );
  };

  return (
    <NodeViewWrapper as="span" className="wiki-link-wrapper" style={{ display: 'inline' }}>
      <span className="wiki-link" onClick={handleClick} title={`Go to: ${title}`}>
        {title}
      </span>
    </NodeViewWrapper>
  );
}

// Custom Tiptap Node for [[wiki-links]]
const WikiLink = Node.create({
  name: 'wikiLink',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      title: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-wiki-link]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-wiki-link': '',
        class: 'wiki-link',
      }),
      HTMLAttributes.title,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(WikiLinkComponent);
  },

  addInputRules() {
    return [
      {
        // Match [[Some Title]] pattern
        find: /\[\[([^\]]+)\]\]$/,
        handler: ({ state, range, match }) => {
          const title = match[1];
          const { tr } = state;
          const node = this.type.create({ title });

          tr.replaceWith(range.from, range.to, node);

          // Add a space after the wiki-link node
          const spaceNode = state.schema.text(' ');
          tr.insert(tr.mapping.map(range.to), spaceNode);
        },
      },
    ];
  },
});

export default WikiLink;
