import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  db: {
    url: string;
  },
  api: {
    secret: string;
  }
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    url: process.env.DATABASE_URL!,
  },
  api: {
    secret: process.env.SECRET!
  }
};

export default config;
