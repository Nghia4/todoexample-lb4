import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Project, ProjectWithRelations} from './project.model';
import {User, UserWithRelations} from './user.model';

@model()
export class UserProject extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;
  @belongsTo(() => Project)
  projectId: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<UserProject>) {
    super(data);
  }
}

export interface UserProjectRelations {
  // describe navigational properties here
  user?: UserWithRelations
  project?: ProjectWithRelations
}

export type UserProjectWithRelations = UserProject & UserProjectRelations;
