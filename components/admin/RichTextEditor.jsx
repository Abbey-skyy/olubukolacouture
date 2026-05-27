'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
  Bold, Italic, List, ListOrdered, Link as LinkIcon,
  Heading2, Heading3, Quote, Undo, Redo,
} from 'lucide-react';

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-2 transition-colors hover:text-ebony ${active ? 'text-gold' : 'text-ebony-light'}`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[360px] outline-none p-6 text-[14px] text-ebony leading-relaxed prose max-w-none',
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = prompt('URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-4 py-2 border-b border-ivory-dark bg-ivory-dark/50">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">
          <Heading2 size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">
          <Heading3 size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          <List size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
          <ListOrdered size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
          <Quote size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="Link">
          <LinkIcon size={15} />
        </ToolbarBtn>
        <div className="ml-auto flex gap-1">
          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo">
            <Undo size={15} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo">
            <Redo size={15} />
          </ToolbarBtn>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
