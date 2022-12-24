import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {User, UserProject} from '../models';
import {UserRepository} from '../repositories';

export class UserUserProjectController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/user-projects', {
    responses: {
      '200': {
        description: 'Array of User has many UserProject',
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
    return this.userRepository.userProjects(id).find(filter);
  }

  @post('/users/{id}/user-projects', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserProject)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProject, {
            title: 'NewUserProjectInUser',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    userProject: Omit<UserProject, 'id'>,
  ): Promise<UserProject> {
    return this.userRepository.userProjects(id).create(userProject);
  }

  @patch('/users/{id}/user-projects', {
    responses: {
      '200': {
        description: 'User.UserProject PATCH success count',
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
    return this.userRepository.userProjects(id).patch(userProject, where);
  }

  @del('/users/{id}/user-projects', {
    responses: {
      '200': {
        description: 'User.UserProject DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserProject))
    where?: Where<UserProject>,
  ): Promise<Count> {
    return this.userRepository.userProjects(id).delete(where);
  }
}
