import React from 'react';

export default function Link({ to, children, ...rest }: any) {
  return React.createElement('a', { href: to, ...rest }, children);
}

