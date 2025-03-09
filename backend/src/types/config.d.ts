declare module '../config' {
  export const PORT: number;
  export const JWT_SECRET: string;
  export const JWT_EXPIRES_IN: string;
  export const DB_CONFIG: {
    uri: string;
    host: string;
    database: string;
  };
}
