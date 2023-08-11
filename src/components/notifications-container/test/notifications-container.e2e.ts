import { newE2EPage } from '@stencil/core/testing';

describe('notifications-container', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<notifications-container></notifications-container>');

    const element = await page.find('notifications-container');
    expect(element).toHaveClass('hydrated');
  });
});
