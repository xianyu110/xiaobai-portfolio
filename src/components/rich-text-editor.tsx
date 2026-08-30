// Tiptap-based rich text editor for database posts.
// Storage format stays markdown: value in → markdown-it → HTML for editing;
// edits out → turndown → markdown. The public rendering chain
// (MarkdownContent) is untouched.

import { useEffect, useRef } from 'react';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo,
  SquareCode,
  Strikethrough,
  Undo,
  Unlink,
} from 'lucide-react';
import MarkdownIt from 'markdown-it';
import { toast } from 'sonner';
import TurndownService from 'turndown';

import { cn } from '@/lib/utils';
import { markdownStyles } from '@/components/markdown-content';
import { Button } from '@/components/ui/button';

const md = new MarkdownIt({ html: false, linkify: true });

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
});
turndown.addRule('strikethrough', {
  filter: ['del', 's'],
  replacement: (content) => `~~${content}~~`,
});
// keep empty paragraphs from collapsing list/paragraph spacing
turndown.keep(['figure']);

function mdToHtml(markdown: string): string {
  return markdown ? md.render(markdown) : '';
}

function htmlToMd(html: string): string {
  return turndown.turndown(html);
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? 'secondary' : 'ghost'}
      size="icon"
      className="size-8"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );
}

function Toolbar({
  editor,
  uploading,
  onPickImage,
}: {
  editor: Editor;
  uploading: boolean;
  onPickImage: () => void;
}) {
  const chain = () => editor.chain().focus();

  function setLink() {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', previous || 'https://');
    if (url === null) return;
    if (url === '') {
      chain().extendMarkRange('link').unsetLink().run();
      return;
    }
    chain().extendMarkRange('link').setLink({ href: url }).run();
  }

  return (
    <div className="border-border bg-muted/30 flex flex-wrap items-center gap-0.5 border-b p-1">
      <ToolbarButton
        label="Bold"
        active={editor.isActive('bold')}
        onClick={() => chain().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive('italic')}
        onClick={() => chain().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive('strike')}
        onClick={() => chain().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Inline code"
        active={editor.isActive('code')}
        onClick={() => chain().toggleCode().run()}
      >
        <Code className="size-4" />
      </ToolbarButton>
      <span className="bg-border mx-1 h-5 w-px" />
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => chain().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => chain().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" />
      </ToolbarButton>
      <span className="bg-border mx-1 h-5 w-px" />
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => chain().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Ordered list"
        active={editor.isActive('orderedList')}
        onClick={() => chain().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Blockquote"
        active={editor.isActive('blockquote')}
        onClick={() => chain().toggleBlockquote().run()}
      >
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Code block"
        active={editor.isActive('codeBlock')}
        onClick={() => chain().toggleCodeBlock().run()}
      >
        <SquareCode className="size-4" />
      </ToolbarButton>
      <span className="bg-border mx-1 h-5 w-px" />
      <ToolbarButton
        label="Link"
        active={editor.isActive('link')}
        onClick={setLink}
      >
        <LinkIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Remove link"
        disabled={!editor.isActive('link')}
        onClick={() => chain().unsetLink().run()}
      >
        <Unlink className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Insert image"
        disabled={uploading}
        onClick={onPickImage}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ImageIcon className="size-4" />
        )}
      </ToolbarButton>
      <ToolbarButton
        label="Horizontal rule"
        onClick={() => chain().setHorizontalRule().run()}
      >
        <Minus className="size-4" />
      </ToolbarButton>
      <span className="bg-border mx-1 h-5 w-px" />
      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => chain().undo().run()}
      >
        <Undo className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => chain().redo().run()}
      >
        <Redo className="size-4" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: {
  /** markdown in */
  value: string;
  /** markdown out */
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
}) {
  // Tracks the markdown this editor last emitted, so external value updates
  // (e.g. dialog reopened with another post) reset content without clobbering
  // in-progress edits on every keystroke round-trip.
  const lastEmitted = useRef(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false },
        heading: { levels: [1, 2, 3] },
      }),
      TiptapImage,
      Placeholder.configure({ placeholder: placeholder || '' }),
    ],
    content: mdToHtml(value),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          markdownStyles,
          'min-h-[280px] max-w-none p-4 focus:outline-none'
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const markdown = editor.isEmpty ? '' : htmlToMd(editor.getHTML());
      lastEmitted.current = markdown;
      onChange(markdown);
    },
  });

  useEffect(() => {
    if (!editor || value === lastEmitted.current) return;
    lastEmitted.current = value;
    editor.commands.setContent(mdToHtml(value));
  }, [editor, value]);

  async function handleFiles(files: FileList | null) {
    if (!editor || !files?.length || uploadingRef.current) return;
    uploadingRef.current = true;
    try {
      const formData = new FormData();
      formData.append('files', files[0]);
      const res = await fetch('/api/storage/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      const url = data?.data?.urls?.[0];
      if (data.code === 0 && url) {
        editor.chain().focus().setImage({ src: url }).run();
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      uploadingRef.current = false;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  if (!editor) {
    return (
      <div
        className={cn(
          'border-input min-h-[330px] rounded-md border bg-transparent',
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'border-input focus-within:border-ring focus-within:ring-ring/50 overflow-hidden rounded-md border bg-transparent focus-within:ring-[3px]',
        className
      )}
    >
      <Toolbar
        editor={editor}
        uploading={uploadingRef.current}
        onPickImage={() => fileInputRef.current?.click()}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="max-h-[50vh] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
