import { IContainer } from '@power-cms/common/application';
import { createContainer } from '../../infrastructure/awilix.container';
import { SiteService } from './service';

describe('Service', () => {
  let container: IContainer;

  beforeAll(async () => {
    container = await createContainer();
  });

  it('Creates service', async () => {
    const service = container.resolve<SiteService>('service');

    expect(service.name).toBe('site');
    expect(Array.isArray(service.actions)).toBeTruthy();
  });
});
