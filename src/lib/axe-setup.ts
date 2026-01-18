// Axe-core integration for development
// Only runs in development mode to catch accessibility issues early

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  Promise.all([
    import('react'),
    import('react-dom'),
    import('@axe-core/react')
  ]).then(([React, ReactDOM, axe]) => {
    axe.default(React, ReactDOM, 1000, {
      rules: [
        {
          id: 'color-contrast',
          enabled: false, // Disable due to okLCH custom colors
        },
      ],
    });
  }).catch(console.error);
}

export {};
