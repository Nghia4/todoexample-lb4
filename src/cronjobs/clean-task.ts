import {createBindingFromClass} from '@loopback/core';
import {CronJob, cronJob} from '@loopback/cron';
import {repository} from '@loopback/repository';
import isEmpty from 'lodash/isEmpty';
import {Status} from '../enums/status-enum';
import {Task} from '../models';
import {TaskRepository} from '../repositories';


@cronJob()
class CleanTaskWhenDone extends CronJob {
  constructor(
    @repository(TaskRepository)
    public taskRepository: TaskRepository,
  ) {
    super({
      name: 'clean-task-when-done-cronjob',
      onTick: async () => {
        console.log('cronJobs is running')
        await cleanTaskWhenDone(taskRepository);
      },
      cronTime: '* 1 * * * *',
      timeZone: 'Asia/Ho_Chi_Minh',
      start: true,
      runOnInit: true
    })
  }
}

const cleanTaskBinding = createBindingFromClass(CleanTaskWhenDone)
export default cleanTaskBinding;

async function cleanTaskWhenDone(taskRepository: TaskRepository) {
  let page = 0;
  const pageSize = 50;
  let tasks: Task[] = [];
  const updatingTasks: Task[] = [];
  try {
    while (!isEmpty(tasks) || page === 0) {
      tasks = await taskRepository.find({
        where: {
          status: Status.DONE,
        },
        skip: page * pageSize,
        limit: pageSize,
      });
      updatingTasks.push(...tasks);
      page++;
    }
    await Promise.all(
      updatingTasks.map(item => taskRepository.deleteById(item.id)),
    );
    console.log('Cronjob: CleanTaskWhenDone ran successfully!');
  } catch (error) {
    console.warn('Cronjob: CleanTaskWhenDone ran failed! Error: ', error);
  }
}
