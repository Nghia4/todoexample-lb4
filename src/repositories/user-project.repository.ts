import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserProject, UserProjectRelations, Project, User} from '../models';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';

export class UserProjectRepository extends DefaultCrudRepository<
  UserProject,
  typeof UserProject.prototype.id,
  UserProjectRelations
> {
  public readonly project: BelongsToAccessor<
    Project,
    typeof UserProject.prototype.id
  >;

  public readonly user: BelongsToAccessor<
    User,
    typeof UserProject.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProjectRepository')
    protected projectRepositoryGetter: Getter<ProjectRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserProject, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.project = this.createBelongsToAccessorFor(
      'project',
      projectRepositoryGetter,
    );
    this.registerInclusionResolver('project', this.project.inclusionResolver);
  }
}
