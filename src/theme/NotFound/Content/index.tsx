import { type ReactNode } from 'react';
import Custom404 from '../../../components/Custom404';

/**
 * Custom NotFound Content Component
 * This is the proper Docusaurus way to handle ALL 404s globally,
 * including docs routes, page routes, and any other missing content.
 */
export default function ContentWrapper(): ReactNode {
  return (
    <>
      <Custom404 />
    </>
  );
}
