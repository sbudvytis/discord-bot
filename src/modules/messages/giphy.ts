import axios, { AxiosResponse } from 'axios';
import config from '../../config';

export async function getRandomExcitedGif(): Promise<string | null> {
  try {
    const response: AxiosResponse = await axios.get(
      config.GIPHY_RANDOM_ENDPOINT,
      {
        params: {
          api_key: config.GIPHY_API_KEY,
          tag: 'congratulations',
          rating: 'g',
        },
      }
    );

    if (response.data.data && response.data.data.url) {
      return response.data.data.url; // Retrieves GIF URL from the response
    }
    return null;
  } catch (error) {
    console.error('Error fetching random GIF:', error);
    return null;
  }
}
