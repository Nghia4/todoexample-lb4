import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {UserProject} from '../models';
import {UserProjectRepository} from '../repositories';

@authenticate('jwt')
export class UserProjectController {
  constructor(
    @repository(UserProjectRepository)
    public userProjectRepository: UserProjectRepository,
  ) { }

  @post('/user-projects')
  @response(200, {
    description: 'UserProject model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserProject)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProject, {
            title: 'NewUserProject',
            exclude: ['id'],
          }),
        },
      },
    })
    userProject: Omit<UserProject, 'id'>,
  ): Promise<UserProject> {
    return this.userProjectRepository.create(userProject);
  }

  @get('/user-projects/count')
  @response(200, {
    description: 'UserProject model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserProject) where?: Where<UserProject>,
  ): Promise<Count> {
    return this.userProjectRepository.count(where);
  }

  @get('/user-projects')
  @response(200, {
    description: 'Array of UserProject model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserProject, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserProject) filter?: Filter<UserProject>,
  ): Promise<UserProject[]> {
    return this.userProjectRepository.find(filter);
  }

  @patch('/user-projects')
  @response(200, {
    description: 'UserProject PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProject, {partial: true}),
        },
      },
    })
    userProject: UserProject,
    @param.where(UserProject) where?: Where<UserProject>,
  ): Promise<Count> {
    return this.userProjectRepository.updateAll(userProject, where);
  }

  @get('/user-projects/{id}')
  @response(200, {
    description: 'UserProject model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserProject, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserProject, {exclude: 'where'})
    filter?: FilterExcludingWhere<UserProject>,
  ): Promise<UserProject> {
    return this.userProjectRepository.findById(id, filter);
  }

  @patch('/user-projects/{id}')
  @response(204, {
    description: 'UserProject PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProject, {partial: true}),
        },
      },
    })
    userProject: UserProject,
  ): Promise<void> {
    await this.userProjectRepository.updateById(id, userProject);
  }

  @put('/user-projects/{id}')
  @response(204, {
    description: 'UserProject PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userProject: UserProject,
  ): Promise<void> {
    await this.userProjectRepository.replaceById(id, userProject);
  }

  @del('/user-projects/{id}')
  @response(204, {
    description: 'UserProject DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userProjectRepository.deleteById(id);
  }
}
