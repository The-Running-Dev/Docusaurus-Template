import React from 'react';

export default function Heading({ as: Tag = 'h1', children, ...rest }: any) {
  return React.createElement(Tag, rest, children);
}

