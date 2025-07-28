import { Module } from '@nestjs/common';
import { TasksStatusesService } from './tasks-statuses.service';
import { TasksStatusesController } from './tasks-statuses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksStatus } from './entities/tasks-status.entity';

@Module({
  controllers: [TasksStatusesController],
  imports: [TypeOrmModule.forFeature([TasksStatus])],
  providers: [TasksStatusesService],
})
export class TasksStatusesModule {}
