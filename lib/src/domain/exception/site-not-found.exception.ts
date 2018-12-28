import { Id, NotFoundException } from '@power-cms/common/domain';

export class SiteNotFoundException extends NotFoundException {
  public static withId(id: Id): SiteNotFoundException {
    return new SiteNotFoundException(`Site with id ${id.toString()} cannot be found.`);
  }
}
