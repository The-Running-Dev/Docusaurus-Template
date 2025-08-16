import { type ReactNode } from 'react';
// @ts-ignore: @theme-original/* is a Docusaurus runtime alias
import DocItem from '@theme-original/DocItem';
import GiscusComments from '../../components/GiscusComments/GiscusComments';

interface DocItemProps {
  content: {
    frontMatter: Record<string, any>;
    metadata: Record<string, any>;
    contentTitle?: string;
  };
}

export default function DocItemWrapper(props: DocItemProps): ReactNode {
  const { frontMatter } = props.content;
  const showComments = frontMatter.comments ?? true;

  return (
    <>
      <DocItem {...props} />

      {/* Conditionally render GiscusComments based on frontmatter */}
      {showComments && <GiscusComments />}
    </>
  );
}
