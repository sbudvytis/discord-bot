import { ChannelType, Client, TextChannel } from 'discord.js';
import config from '../../config';
import createRepository from './repository';
import { getRandomExcitedGif } from './giphy';
import createDatabase from '@/database';

const db = createDatabase(config.DATABASE_URL);
const repository = createRepository(db);

const {
  saveMessageToDatabase,
  getTitleBySprintCode,
  getRandomMessageTemplate,
} = repository;

const client = new Client({ intents: ['Guilds', 'GuildMessages'] });

client.once('ready', () => {
  console.log('Bot is ready!');
});

export async function handleAccomplishmentTrigger(
  username: string,
  sprintCode: string
) {
  const guild = client.guilds.cache.get(config.GUILD_ID);

  if (guild) {
    try {
      // fetches user's ID by their username
      const user = await guild.members.fetch({ query: username, limit: 1 });

      if (user && user.size === 1) {
        const userMention = `<@${user?.first()?.id}>`;
        const title = await getTitleBySprintCode(sprintCode);
        const randomTemplate = await getRandomMessageTemplate();

        if (title) {
          const accomplishmentsChannel = guild.channels.cache.find(
            (channel) =>
              channel.name === 'accomplishments' &&
              channel.type === ChannelType.GuildText
          ) as TextChannel | undefined;

          if (accomplishmentsChannel) {
            const randomGif = await getRandomExcitedGif();

            const congratulatoryMessage = `${userMention} has just completed ${title}!\n${randomTemplate}!`;

            accomplishmentsChannel
              .send(congratulatoryMessage)
              .then(() => {
                const currentTime = Date.now();

                saveMessageToDatabase({
                  messageText: congratulatoryMessage,
                  sprint: title,
                  username,
                  createdAt: currentTime,
                });

                if (randomGif) {
                  accomplishmentsChannel.send(randomGif);
                } else {
                  console.error('No GIF URL available.');
                }
              })
              .catch((error) => {
                console.error('Error sending messages:', error);
              });
          } else {
            console.error('Accomplishments channel not found.');
          }
        } else {
          console.error(`Sprint with the code '${sprintCode}' not found.`);
        }
      } else {
        console.error(`User '${username}' not found.`);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  } else {
    console.error('Guild not found.');
  }
}

client.login(config.DISCORD_TOKEN);

export default { handleAccomplishmentTrigger, client };
