import {Entity, hasMany, model, property} from '@loopback/repository';
import {Task, TaskWithRelations} from './task.model';
import {UserProject, UserProjectWithRelations} from './user-project.model';

@model()
export class Project extends Entity {
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
  name: string;

  @property({
    type: 'string',
  })
  createdBy: string;

  @property({
    type: 'string',
  })
  updatedBy: string;

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
    default: 'ongoing',
  })
  status?: string;

  @hasMany(() => Task)
  tasks: Task[];

  @hasMany(() => UserProject)
  userProjects: UserProject[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
  userProjects?: UserProjectWithRelations[]
  tasks?: TaskWithRelations[]
}

export type ProjectWithRelations = Project & ProjectRelations;
