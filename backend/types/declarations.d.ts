export {};

// ─── Express Request Augmentation ────────────────────────────────────────────

declare module 'express-serve-static-core' {
  interface Request {
    user?: import('./index').AuthenticatedUser;
    auditLog?: (action: string, details?: Record<string, unknown>) => void;
    requestId?: string;
  }
}

// ─── Utility Modules (ambient declarations for JS utilities) ─────────────────

declare module '../utils/emailService' {
  import { EmailOptions } from './index';
  const sendEmail: (options: EmailOptions) => Promise<void>;
  export default sendEmail;
}

declare module '../utils/emailTemplates' {
  import { EmailTemplate } from './index';
  const emailTemplates: {
    verification: (name: string, token: string) => EmailTemplate;
    welcomeVerified: (name: string) => EmailTemplate;
    passwordReset: (name: string, token: string) => EmailTemplate;
    appointmentConfirmation: (name: string, date: string) => EmailTemplate;
    doctorOnboard: (name: string, email: string, password: string) => EmailTemplate;
  };
  export default emailTemplates;
}

// ─── CommonJS Module Compatibility ───────────────────────────────────────────

declare module 'node-cache' {
  class NodeCache {
    constructor(options?: { stdTTL?: number; checkperiod?: number });
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T, ttl?: number): boolean;
    del(keys: string | string[]): number;
    keys(): string[];
  }
  export default NodeCache;
}

declare module 'multer-s3' {
  import multer from 'multer';
  const multerS3: (options: any) => multer.StorageEngine;
  export default multerS3;
}

declare module 'rate-limit-redis' {
  import { Store } from 'express-rate-limit';
  interface RedisStoreOptions {
    sendCommand: (...args: string[]) => Promise<unknown>;
    prefix?: string;
    resetExpiryOnChange?: boolean;
    windowMs?: number;
  }
  const RedisStore: new (options: RedisStoreOptions) => Store;
  export default RedisStore;
}

declare module 'ioredis' {
  interface RedisOptions {
    host?: string;
    port?: number;
    password?: string;
    db?: number;
    maxRetriesPerRequest?: number;
    enableReadyCheck?: boolean;
  }
  class Redis {
    constructor(options?: RedisOptions);
    connect(): Promise<void>;
    disconnect(): void;
    quit(): Promise<void>;
    set(key: string, value: string, ...args: unknown[]): Promise<string>;
    get(key: string): Promise<string | null>;
    del(...keys: string[]): Promise<number>;
    expire(key: string, seconds: number): Promise<number>;
  }
  export default Redis;
}
