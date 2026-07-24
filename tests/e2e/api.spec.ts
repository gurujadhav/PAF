import { test, expect } from '../../src/core/fixtures.js';

test.describe('PAF API Automation Suite', () => {

  test('should fetch sample JSON API endpoint', async ({ request, pafLogger }) => {
    pafLogger.info('Sending GET request to JSONPlaceholder API...');
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

    expect(response.status()).toBe(200);

    const body = await response.json();
    pafLogger.info(`API Response received: Title="${body.title}"`);
    expect(body.id).toBe(1);
    expect(body.title).toBeTruthy();
  });

});
