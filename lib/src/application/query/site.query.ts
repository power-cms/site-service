import { ICollectionQuery } from '@power-cms/common/application';
import { ISingleQuery } from '@power-cms/common/application';
import { SiteView } from './site.view';

export interface ISiteQuery extends ISingleQuery<SiteView>, ICollectionQuery<SiteView> {}
