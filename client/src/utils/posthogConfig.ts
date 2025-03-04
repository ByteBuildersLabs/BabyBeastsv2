import posthog from 'posthog-js';
import type { PostHog } from 'posthog-js'; 

interface CustomEnv {
  VITE_POSTHOG_API_KEY: string;
  VITE_POSTHOG_HOST: string;
  DEV: boolean;
}

interface PostHogSetupResult {
  initialized: boolean;
  client: PostHog | null; 
}

export function setupPostHog(): PostHogSetupResult {
  const env = import.meta.env as unknown as CustomEnv;

  const apiKey = env.VITE_POSTHOG_API_KEY;
  const apiHost = env.VITE_POSTHOG_HOST;
  const isDevelopment = env.DEV;

  if (!apiKey) {
    console.warn('PostHog API key not found. Analytics will not be loaded.');
    return { initialized: false, client: null };
  }

  if (!apiHost) console.warn('PostHog API host not found. Using default host.');

  const options = {
    api_host: apiHost,
    autocapture: true,
    loaded: (ph: PostHog) => {
      if (isDevelopment) {
        // Descomment this line to disable capturing events in development
        // ph.opt_out_capturing();
        ph.debug(true);
      }
    },
  };

  try {
    posthog.init(apiKey, options);
    return { 
      initialized: true, 
      client: posthog 
    };
  } catch (error) {
    console.error('PostHog Error:', error);
    return { initialized: false, client: null };
  }
}

export const posthogInstance = setupPostHog();
