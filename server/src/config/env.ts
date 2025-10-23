const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required but was not provided`);
  }
  return value;
};

export const GOOGLE_CLIENT_ID = getRequiredEnv('GOOGLE_CLIENT_ID');
export const GOOGLE_CLIENT_SECRET = getRequiredEnv('GOOGLE_CLIENT_SECRET');
export const GOOGLE_CALLBACK_URL = getRequiredEnv('GOOGLE_CALLBACK_URL');
export const CLIENT_APP_URL = getRequiredEnv('CLIENT_APP_URL');
