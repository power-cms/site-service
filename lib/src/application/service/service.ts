import { IActionHandler, IService } from '@power-cms/common/application';

export class SiteService implements IService {
  public name: string = 'site';

  constructor(public actions: IActionHandler[]) {}
}
