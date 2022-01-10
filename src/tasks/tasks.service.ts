import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title, 
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);
        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        let idx = this.tasks.findIndex(task => task.id === id);

        this.tasks = [
            ...this.tasks.slice(0, idx),
            Object.assign({}, this.tasks[idx], {
                status
            }),
            ...this.tasks.slice(idx + 1)
        ];

        return this.tasks[idx];
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
}
