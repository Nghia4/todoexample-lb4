import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Project, ProjectRelations, Task, UserProject} from '../models';
import {TaskRepository} from './task.repository';
import {UserProjectRepository} from './user-project.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {
  public readonly tasks: HasManyRepositoryFactory<
    Task,
    typeof Project.prototype.id
  >;

  public readonly userProjects: HasManyRepositoryFactory<
    UserProject,
    typeof Project.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TaskRepository')
    protected taskRepositoryGetter: Getter<TaskRepository>,
    @repository.getter('UserProjectRepository')
    protected userProjectRepositoryGetter: Getter<UserProjectRepository>,
  ) {
    super(Project, dataSource);
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
    this.registerInclusionResolver('tasks', this.tasks.inclusionResolver);
  }
}
