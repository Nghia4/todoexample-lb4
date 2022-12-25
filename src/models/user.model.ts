import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {RoleEnum} from './../enums/role-enum';
import {Task, TaskWithRelations} from './task.model';
import {UserCredentials, UserCredentialsWithRelations} from './user-credentials.model';
import {UserProject, UserProjectWithRelations} from './user-project.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  userName: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt: string;


  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(RoleEnum),
    },
  })
  role?: RoleEnum;

  @hasMany(() => Task)
  tasks: Task[];

  @hasMany(() => UserProject)
  userProjects: UserProject[];

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  tasks?: TaskWithRelations[]
  userProjects?: UserProjectWithRelations[]
  userCredentials?: UserCredentialsWithRelations
}

export type UserWithRelations = User & UserRelations;
