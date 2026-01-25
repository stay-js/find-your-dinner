import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    authInterrupts: true,
  },
};

export default config;
