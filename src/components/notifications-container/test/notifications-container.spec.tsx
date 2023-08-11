import { newSpecPage } from '@stencil/core/testing';
import { NotificationsContainer } from '../notifications-container';

describe('notifications-container', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NotificationsContainer],
      html: `<notifications-container></notifications-container>`,
    });
    expect(page.root).toEqualHtml(`
      <notifications-container>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </notifications-container>
    `);
  });
});
