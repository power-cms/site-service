import { Acl, BaseUpdateAction, IActionData } from '@power-cms/common/application';
import { JoiObject } from 'joi';
import { UpdateSiteCommandHandler } from '../command/update-site.command-handler';
import { ISiteQuery } from '../query/site.query';
import { SiteView } from '../query/site.view';
import { validator } from '../validator/update.validator';

export class UpdateAction extends BaseUpdateAction<SiteView> {
  public validator: JoiObject = validator;

  constructor(updateSiteHandler: UpdateSiteCommandHandler, siteQuery: ISiteQuery, private acl: Acl) {
    super(updateSiteHandler, siteQuery);
  }

  public authorize(action: IActionData): Promise<boolean> {
    return this.acl
      .createBuilder(action)
      .isAdmin()
      .check();
  }
}
