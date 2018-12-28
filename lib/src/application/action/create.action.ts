import { Acl, BaseCreateAction, IActionData } from '@power-cms/common/application';
import { JoiObject } from 'joi';
import { CreateSiteCommandHandler } from '../command/create-site.command-handler';
import { ISiteQuery } from '../query/site.query';
import { SiteView } from '../query/site.view';
import { validator } from '../validator/create.validator';

export class CreateAction extends BaseCreateAction<SiteView> {
  public validator: JoiObject = validator;

  constructor(createSiteHandler: CreateSiteCommandHandler, siteQuery: ISiteQuery, private acl: Acl) {
    super(createSiteHandler, siteQuery);
  }

  public authorize(action: IActionData): Promise<boolean> {
    return this.acl
      .createBuilder(action)
      .isAdmin()
      .check();
  }
}
