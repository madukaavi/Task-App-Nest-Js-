
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Task, TaskDocument } from './task.schema.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  // Create a task for the logged-in user
  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ) {
    const task = new this.taskModel({
      ...createTaskDto,
      userId: new Types.ObjectId(userId),
    });

    return task.save();
  }

  // Get only the logged-in user's tasks
  async findAll(
    userId: string,
    query: {
      search?: string;
      completed?: string;
      page?: string;
      limit?: string;
    },
  ) {
    const pageNumber = Number(query.page);
    const limitNumber = Number(query.limit);

    const page =
      Number.isInteger(pageNumber) && pageNumber > 0
        ? pageNumber
        : 1;

    const limit =
      Number.isInteger(limitNumber) && limitNumber > 0
        ? Math.min(limitNumber, 100)
        : 10;

    const filter: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
    };

    if (query.search?.trim()) {
      const escapedSearch = query.search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      filter.title = {
        $regex: escapedSearch,
        $options: 'i',
      };
    }

    if (query.completed === 'true') {
      filter.completed = true;
    } else if (query.completed === 'false') {
      filter.completed = false;
    } else if (
      query.completed !== undefined &&
      query.completed !== ''
    ) {
      throw new BadRequestException(
        'completed must be true or false',
      );
    }

    const [tasks, total] = await Promise.all([
      this.taskModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),

      this.taskModel.countDocuments(filter).exec(),
    ]);

    return {
      data: tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Find a task owned by the logged-in user
  async findOne(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid task ID');
    }

    const task = await this.taskModel
      .findOne({
        _id: id,
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  // Update only the owner's task
  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid task ID');
    }

    const task = await this.taskModel
      .findOneAndUpdate(
        {
          _id: id,
          userId: new Types.ObjectId(userId),
        },
        updateTaskDto,
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  // Delete only the owner's task
  async remove(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid task ID');
    }

    const task = await this.taskModel
      .findOneAndDelete({
        _id: id,
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      message: 'Task deleted successfully',
      id: task._id.toString(),
    };
  }
}
