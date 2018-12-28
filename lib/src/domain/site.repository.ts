import { ICreateRepository, IDeleteRepository, IUpdateRepository } from '@power-cms/common/domain';
import { Site } from './site';

export interface ISiteRepository extends ICreateRepository<Site>, IUpdateRepository<Site>, IDeleteRepository {}
