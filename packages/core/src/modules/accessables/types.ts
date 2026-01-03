import type { Database } from '@accessly/types';

export type Accessable = Database['public']['Tables']['accessables']['Row'];
export type AccessableInsert =
  Database['public']['Tables']['accessables']['Insert'];
export type AccessableUpdate =
  Database['public']['Tables']['accessables']['Update'];

export const ACCESSABLE_TYPES = [
  'shared_account',
  'database',
  'api_key',
  'document',
  'service',
] as const;

export type AccessableType = (typeof ACCESSABLE_TYPES)[number];

export const ACCESSABLE_SERVICES = [
  'github',
  'gitlab',
  'bitbucket',
  'slack',
  'discord',
  'notion',
  'figma',
  'jira',
  'confluence',
  'trello',
  'asana',
  'linear',
  'vercel',
  'netlify',
  'aws',
  'gcp',
  'azure',
  'digitalocean',
  'heroku',
  'cloudflare',
  'stripe',
  'twilio',
  'sendgrid',
  'mailchimp',
  'hubspot',
  'salesforce',
  'zendesk',
  'intercom',
  'datadog',
  'sentry',
  'mongodb',
  'postgresql',
  'mysql',
  'redis',
  'elasticsearch',
  'supabase',
  'firebase',
  'auth0',
  'okta',
  'google',
  'microsoft',
  'dropbox',
  'box',
  'zoom',
  'calendly',
  'openai',
  'anthropic',
  'other',
] as const;

export type AccessableService = (typeof ACCESSABLE_SERVICES)[number];

type BaseMetadata = {
  service?: AccessableService;
  iconUrl?: string;
  accessGuide?: string;
  notes?: string;
};

type SharedAccountMetadata = BaseMetadata & {
  username?: string;
  password?: string;
  email?: string;
  recoveryEmail?: string;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: string;
};

type DatabaseMetadata = BaseMetadata & {
  host?: string;
  port?: number;
  databaseName?: string;
  username?: string;
  password?: string;
  connectionString?: string;
  sslRequired?: boolean;
};

type ApiKeyMetadata = BaseMetadata & {
  key?: string;
  secret?: string;
  environment?: 'production' | 'staging' | 'development';
  expiresAt?: string;
  scopes?: string[];
};

type DocumentMetadata = BaseMetadata & {
  fileUrl?: string;
  mimeType?: string;
};

type ServiceMetadata = BaseMetadata & {
  endpoint?: string;
  authMethod?: 'api_key' | 'oauth' | 'basic' | 'bearer';
};

export type AccessableMetadataMap = {
  shared_account: SharedAccountMetadata;
  database: DatabaseMetadata;
  api_key: ApiKeyMetadata;
  document: DocumentMetadata;
  service: ServiceMetadata;
};

export type AccessableMetadata = AccessableMetadataMap[AccessableType];

export type TypedAccessable<T extends AccessableType = AccessableType> = Omit<
  Accessable,
  'type' | 'metadata'
> & {
  type: T;
  metadata: T extends AccessableType ? AccessableMetadataMap[T] : never;
};

export type TypedAccessableInsert = Omit<
  AccessableInsert,
  'user_id' | 'type' | 'metadata'
> & {
  user_id?: string;
  type: AccessableType;
  metadata?: AccessableMetadata;
};

export type TypedAccessableUpdate = Omit<
  AccessableUpdate,
  'type' | 'metadata'
> & {
  type?: AccessableType;
  metadata?: AccessableMetadata;
};
