import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {User, UserProject} from '../models';
import {UserProjectRepository} from '../repositories';

@authenticate('jwt')
export class UserProjectUserController {
  constructor(
    @repository(UserProjectRepository)
    public userProjectRepository: UserProjectRepository,
  ) { }

  @get('/user-projects/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserProject',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof UserProject.prototype.id,
  ): Promise<User> {
    return this.userProjectRepository.user(id);
  }
}
