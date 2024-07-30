import axios from 'axios';
import { getRandomExcitedGif } from '../giphy';

describe('getRandomExcitedGif', () => {
  const mockGet = vi.spyOn(axios, 'get');

  it('should return the URL of an excited GIF', async () => {
    const mockGifUrl = 'https://example.com/excited.gif';

    // Mocking axios GET request
    mockGet.mockResolvedValue({
      data: {
        data: {
          url: mockGifUrl,
        },
      },
    });

    const gifUrl = await getRandomExcitedGif();

    expect(gifUrl).toBe(mockGifUrl);
    expect(mockGet).toHaveBeenCalledWith(expect.any(String), {
      params: {
        api_key: expect.any(String),
        tag: 'congratulations',
        rating: 'g',
      },
    });
  });

  it('should return null if the response does not contain a GIF URL', async () => {
    // Mocking axios GET request without a URL
    mockGet.mockResolvedValue({
      data: {
        data: {},
      },
    });

    const gifUrl = await getRandomExcitedGif();

    expect(gifUrl).toBeNull();
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
      params: {
        api_key: expect.any(String),
        tag: 'congratulations',
        rating: 'g',
      },
    });
  });

  it('should return null if there is an error fetching the GIF', async () => {
    // Mocking axios GET request with a rejected promise to simulate an error
    mockGet.mockResolvedValue(new Error('Network Error'));

    const gifUrl = await getRandomExcitedGif();

    expect(gifUrl).toBeNull();
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
      params: {
        api_key: expect.any(String),
        tag: 'congratulations',
        rating: 'g',
      },
    });
  });
});
