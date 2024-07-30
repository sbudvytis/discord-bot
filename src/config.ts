import dotenv from 'dotenv';

dotenv.config();

const {
  CLIENT_ID,
  GUILD_ID,
  DISCORD_TOKEN,
  GIPHY_API_KEY,
  DATABASE_URL,
  GIPHY_RANDOM_ENDPOINT,
} = process.env;

if (
  !CLIENT_ID ||
  !GUILD_ID ||
  !DISCORD_TOKEN ||
  !GIPHY_API_KEY ||
  !DATABASE_URL ||
  !GIPHY_RANDOM_ENDPOINT
) {
  throw new Error('Missing enviroment variables');
}

const config: Record<string, string> = {
  CLIENT_ID,
  GUILD_ID,
  DISCORD_TOKEN,
  GIPHY_API_KEY,
  DATABASE_URL,
  GIPHY_RANDOM_ENDPOINT,
};

export default config;
