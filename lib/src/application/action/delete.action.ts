import { Acl, BaseDeleteAction, IActionData } from '@power-cms/common/application';
import { DeleteSiteCommandHandler } from '../command/delete-site.command-handler';

export class DeleteAction extends BaseDeleteAction {
  constructor(deleteSiteHandler: DeleteSiteCommandHandler, private acl: Acl) {
    super(deleteSiteHandler);
  }

  public authorize(action: IActionData): Promise<boolean> {
    return this.acl
      .createBuilder(action)
      .isAdmin()
      .check();
  }
}
