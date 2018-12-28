import { BaseDeleteCommandHandler } from '@power-cms/common/application';
import { ISiteRepository } from '../../domain/site.repository';
import { IDeleteSiteCommand } from './delete-site.command';

export class DeleteSiteCommandHandler extends BaseDeleteCommandHandler<IDeleteSiteCommand> {
  constructor(private siteRepository: ISiteRepository) {
    super(siteRepository);
  }

  protected getId(command: IDeleteSiteCommand): string {
    return command.id;
  }
}
