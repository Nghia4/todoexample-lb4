import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository, HasManyRepositoryFactory,
  HasOneRepositoryFactory, repository
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Task, User, UserCredentials, UserProject, UserRelations} from '../models';
import {TaskRepository} from './task.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserProjectRepository} from './user-project.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly tasks: HasManyRepositoryFactory<
    Task,
    typeof User.prototype.id
  >;

  public readonly userProjects: HasManyRepositoryFactory<
    UserProject,
    typeof User.prototype.id
  >;

  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TaskRepository')
    protected taskRepositoryGetter: Getter<TaskRepository>,
    @repository.getter('UserProjectRepository')
    protected userProjectRepositoryGetter: Getter<UserProjectRepository>,
    @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(User, dataSource);
    this.userProjects = this.createHasManyRepositoryFactoryFor(
      'userProjects',
      userProjectRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userProjects',
      this.userProjects.inclusionResolver,
    );

    this.tasks = this.createHasManyRepositoryFactoryFor(
      'tasks',
      taskRepositoryGetter,
    );
    this.registerInclusionResolver(
      'tasks',
      this.tasks.inclusionResolver
    );

    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter);
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver);
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
