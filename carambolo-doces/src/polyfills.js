// Polyfill para process.env
if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {
      NODE_ENV: 'development'
    }
  };
}

// Polyfill para global
if (typeof window !== 'undefined' && !window.global) {
  window.global = window;
}

