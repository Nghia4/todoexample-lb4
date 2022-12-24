import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {UserProject, Project} from '../models';
import {UserProjectRepository} from '../repositories';

export class UserProjectProjectController {
  constructor(
    @repository(UserProjectRepository)
    public userProjectRepository: UserProjectRepository,
  ) {}

  @get('/user-projects/{id}/project', {
    responses: {
      '200': {
        description: 'Project belonging to UserProject',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getProject(
    @param.path.string('id') id: typeof UserProject.prototype.id,
  ): Promise<Project> {
    return this.userProjectRepository.project(id);
  }
}
