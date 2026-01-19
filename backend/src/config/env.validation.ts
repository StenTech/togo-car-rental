import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Serveur
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),

  // Base de données
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432),

  // URL construite automatiquement par le ConfigModule ou Prisma, mais utile de valider si fournie
  DATABASE_URL: Joi.string().optional(),

  // Sécurité JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
});
