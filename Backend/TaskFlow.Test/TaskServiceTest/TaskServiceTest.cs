using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Exceptions;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;
using TaskFlow.Services;
using Task = System.Threading.Tasks.Task;

namespace TaskFlow.Test.TaskServiceTest
{
    [TestFixture]
    public class TaskServiceTest
    {
        private ApplicationDbContext context;
        private TaskService taskService;


        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            context = new ApplicationDbContext(options);
            taskService = new TaskService(context);
        }


        [TearDown]
        public void TearDown()
        {
            context.Dispose();
        }


        private User CreateUser(int id, UserRole role = UserRole.User)
        {
            return new User
            {
                Id = id,
                UserName = $"user{id}",
                Email = $"user{id}@mail.com",
                UserRole = role
            };
        }


        private Project CreateProject(int id, int ownerId)
        {
            return new Project
            {
                Id = id,
                Name = "Test project",
                Description = "Description",
                OwnerId = ownerId,
                Members = new List<ProjectMember>()
            };
        }


        [Test]
        public async Task GetMyTasks_ReturnsExecutorTasks()
        {
            var user = CreateUser(1);
            var project = CreateProject(1, 1);

            context.Users.Add(user);
            context.Projects.Add(project);

            context.Tasks.Add(new TaskFlow.Entities.Task
            {
                Id = 1,
                Title = "Task 1",
                ExecutorId = 1,
                CreatorId = 1,
                ProjectId = 1,
                Project = project,
                Deadline = DateTime.UtcNow.AddDays(2)
            });

            context.Tasks.Add(new TaskFlow.Entities.Task
            {
                Id = 2,
                Title = "Other task",
                ExecutorId = 2,
                CreatorId = 2,
                ProjectId = 1,
                Project = project,
                Deadline = DateTime.UtcNow
            });

            await context.SaveChangesAsync();


            var result = await taskService.GetMyTasks(1);


            Assert.That(result.Count, Is.EqualTo(1));
            Assert.That(result[0].Title, Is.EqualTo("Task 1"));
        }


        [Test]
        public async Task GetMyCreatedTasks_ReturnsCreatedTasks()
        {
            var user = CreateUser(1);
            var project = CreateProject(1, 1);

            context.Users.Add(user);
            context.Projects.Add(project);

            context.Tasks.Add(new TaskFlow.Entities.Task
            {
                Id = 1,
                Title = "Created",
                CreatorId = 1,
                ExecutorId = 2,
                ProjectId = 1,
                Project = project
            });

            await context.SaveChangesAsync();


            var result = await taskService.GetMyCreatedTasks(1);


            Assert.That(result.Count, Is.EqualTo(1));
            Assert.That(result[0].Title, Is.EqualTo("Created"));
        }


        [Test]
        public async Task GetTaskById_UserIsExecutor_ReturnTask()
        {
            var project = CreateProject(1, 1);

            context.Tasks.Add(new TaskFlow.Entities.Task
            {
                Id = 1,
                Title = "Task",
                CreatorId = 2,
                ExecutorId = 1,
                ProjectId = 1,
                Project = project
            });

            await context.SaveChangesAsync();


            var result = await taskService.GetTaskById(1, 1);


            Assert.That(result, Is.Not.Null);
            Assert.That(result.Title, Is.EqualTo("Task"));
        }


        [Test]
        public async Task GetTaskById_UserHasNoAccess_ReturnNull()
        {
            var project = CreateProject(1, 1);

            context.Tasks.Add(new TaskFlow.Entities.Task
            {
                Id = 1,
                Title = "Secret",
                CreatorId = 2,
                ExecutorId = 3,
                ProjectId = 1,
                Project = project
            });

            await context.SaveChangesAsync();


            var result = await taskService.GetTaskById(1, 10);


            Assert.That(result, Is.Null);
        }


        [Test]
        public async Task CreateTask_CreatesTaskAndNotification()
        {
            var owner = CreateUser(1);
            var executor = CreateUser(2);

            var project = CreateProject(1, 1);

            project.Members.Add(new ProjectMember
            {
                UserId = 2,
                ProjectRole = ProjectRole.Executor
            });


            context.Users.AddRange(owner, executor);
            context.Projects.Add(project);

            await context.SaveChangesAsync();


            var request = new CreateTaskRequest
            {
                Title = "New task",
                Description = "Desc",
                ProjectId = 1,
                ExecutorId = 2,
                DeadLine = DateTime.UtcNow.AddDays(5),
                Priority = Priority.High
            };


            var id = await taskService.CreateTask(request, 1);


            var task = await context.Tasks.FindAsync(id);
            var notification = await context.Notifications.FirstOrDefaultAsync();


            Assert.That(task, Is.Not.Null);
            Assert.That(task.Title, Is.EqualTo("New task"));

            Assert.That(notification, Is.Not.Null);
            Assert.That(notification.UserId, Is.EqualTo(2));
        }


        [Test]
        public async Task CreateTask_UserNotInProject_Throws()
        {
            var project = CreateProject(1, 5);

            context.Projects.Add(project);

            await context.SaveChangesAsync();


            var request = new CreateTaskRequest
            {
                Title = "Task",
                ProjectId = 1,
                ExecutorId = 2
            };


            Assert.ThrowsAsync<ForbiddenException>(
                async () =>
                    await taskService.CreateTask(request, 10)
            );
        }


        [Test]
        public async Task UpdateTaskStatus_DoneWithoutComment_Throws()
        {
            var project = CreateProject(1, 1);

            var task = new TaskFlow.Entities.Task
            {
                Id = 1,
                ProjectId = 1,
                Project = project,
                Status = StatusTask.Todo
            };

            context.Projects.Add(project);
            context.Tasks.Add(task);

            await context.SaveChangesAsync();


            var request = new UpdateTaskStatusRequest
            {
                Status = StatusTask.Done
            };


            Assert.ThrowsAsync<BadRequestException>(
                async () =>
                    await taskService.UpdateTaskStatus(1, request, 1)
            );
        }


        [Test]
        public async Task DeleteTask_AdminCanDelete()
        {
            var admin = CreateUser(1, UserRole.Admin);

            var project = CreateProject(2, 5);

            var task = new TaskFlow.Entities.Task
            {
                Id = 1,
                ProjectId = 2,
                Project = project
            };


            context.Users.Add(admin);
            context.Projects.Add(project);
            context.Tasks.Add(task);

            await context.SaveChangesAsync();


            await taskService.DeleteTask(1, 1);


            var result = await context.Tasks.FindAsync(1);

            Assert.That(result, Is.Null);
        }
    }
}