import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Project, ProjectWithRelations} from './project.model';
import {User, UserWithRelations} from './user.model';

@model()
export class Task extends Entity {
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
    type: 'boolean',
  })
  isCreatedByAdmin?: boolean;

  @property({
    type: 'string',
    default: "ongoing",
  })
  status?: string;

  @property({
    type: 'string',
  })
  createdBy: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: string;

  @property({
    type: 'string',
  })
  updatedBy: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt: string;

  @belongsTo(() => Project, {name: 'ofProject'})
  projectId: string;

  @belongsTo(() => User, {name: 'assignedTo'})
  userId: string;

  @belongsTo(() => Task, {name: 'linkedTo'})
  linkedToTask: string;

  constructor(data?: Partial<Task>) {
    super(data);
  }
}

export interface TaskRelations {
  // describe navigational properties here
  user?: UserWithRelations
  project?: ProjectWithRelations
  linked?: TaskWithRelations
}

export type TaskWithRelations = Task & TaskRelations;
