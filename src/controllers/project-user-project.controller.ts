import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {Project, UserProject} from '../models';
import {ProjectRepository} from '../repositories';

@authenticate('jwt')
export class ProjectUserProjectController {
  constructor(
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/user-projects', {
    responses: {
      '200': {
        description: 'Array of Project has many UserProject',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserProject)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserProject>,
  ): Promise<UserProject[]> {
    return this.projectRepository.userProjects(id).find(filter);
  }

  @post('/projects/{id}/user-projects', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserProject)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProject, {
            title: 'NewUserProjectInProject',
            exclude: ['id'],
            optional: ['projectId'],
          }),
        },
      },
    })
    userProject: Omit<UserProject, 'id'>,
  ): Promise<UserProject> {
    return this.projectRepository.userProjects(id).create(userProject);
  }

  @patch('/projects/{id}/user-projects', {
    responses: {
      '200': {
        description: 'Project.UserProject PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProject, {partial: true}),
        },
      },
    })
    userProject: Partial<UserProject>,
    @param.query.object('where', getWhereSchemaFor(UserProject))
    where?: Where<UserProject>,
  ): Promise<Count> {
    return this.projectRepository.userProjects(id).patch(userProject, where);
  }

  @del('/projects/{id}/user-projects', {
    responses: {
      '200': {
        description: 'Project.UserProject DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserProject))
    where?: Where<UserProject>,
  ): Promise<Count> {
    return this.projectRepository.userProjects(id).delete(where);
  }
}
