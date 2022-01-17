import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => {
    return {
        getTasks: jest.fn(),
        findOne: jest.fn(),
    };
};

const mockUser = {
    username: 'gilfoyle',
    id: 'someId',
    password: 'somePassword',
    tasks: [],
};
describe('TasksService', () => {
    let tasksService: TasksService;
    let tasksRepository; // was getting an issue with autoSuggest and mockResolveValue not working properly when type was declared here

    beforeEach(async () => {
        // initialize a NestJS module with tasksService and tasksRepository
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: TasksRepository,
                    useFactory: mockTasksRepository
                },
            ]
        }).compile();

        tasksService = module.get<TasksService>(TasksService);
        tasksRepository = module.get<TasksRepository>(TasksRepository);
    });

    describe('getTasks', () => {
        it ('calls TasksRepository.getTasks and returns the result', async () => {
            // #### using mockResolvedValue because getTasks returns a Promise
            tasksRepository.getTasks.mockResolvedValue('someValue');
            const result = await tasksService.getTasks(null, mockUser);
            
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it ('calls TasksRepository.findOne and returns the result', async () => {
            const mockTask = {
                title: 'Test title',
                description: 'Test desc',
                id: 'someId',
                status: TaskStatus.OPEN,
            };

            tasksRepository.findOne.mockResolvedValue(mockTask);
            const result = await tasksService.getTaskById('someId', mockUser);
            expect(result).toEqual(mockTask);
        });
        it ('calls TasksRepository.findOne and handles an error', async () => {
            tasksRepository.findOne.mockResolvedValue(null);
            
            expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(NotFoundException);
        });
    });    
});