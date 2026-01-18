// Axe-core integration for development
// Only runs in development mode to catch accessibility issues early

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000, {
      rules: [
        {
          id: 'color-contrast',
          enabled: false, // Disable due to okLCH custom colors
        },
      ],
    });
  });
}

export {};
