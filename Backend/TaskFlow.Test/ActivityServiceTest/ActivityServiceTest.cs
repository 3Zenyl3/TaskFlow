using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Services;

namespace TaskFlow.Test.ActivityServiceTest
{
    class ActivityServiceTest
    {
        private ApplicationDbContext context;
        private ActivityService service;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                            .UseInMemoryDatabase(Guid.NewGuid().ToString())
                            .Options;

            context = new ApplicationDbContext(options);
            service = new ActivityService(context);
        }
        [TearDown]
        public void TearDown()
        {
            context.Dispose();
        }

        [Test]
        public async System.Threading.Tasks.Task GetTeamActivity_UserInProject_ReturnsActivities()
        {
            var user = new User
            {
                Id = 1,
                UserName = "Kirill",
                AvatarUrl = "avatar.png"
            };

            var project = new Project
            {
                Id = 1,
                Name = "TaskFlow"
            };

            var member = new ProjectMember
            {
                UserId = 1,
                ProjectId = 1,
                User = user,
                Project = project
            };

            project.Members = new List<ProjectMember>
            {
                member
            };


            var activity = new Activity
            {
                Id = 1,
                UserId = 1,
                User = user,
                ProjectId = 1,
                Project = project,
                Description = "создал задачу",
                CreatedAt = DateTime.UtcNow
            };


            await context.Users.AddAsync(user);
            await context.Projects.AddAsync(project);
            await context.ProjectMembers.AddAsync(member);
            await context.Activities.AddAsync(activity);

            await context.SaveChangesAsync();
            var result = await service.GetTeamActivity(1);

            Assert.That(result.Count, Is.EqualTo(1));
            Assert.That(result[0].UserName, Is.EqualTo("Kirill"));
            Assert.That(result[0].Description, Is.EqualTo("создал задачу"));
        }


        [Test]
        public async System.Threading.Tasks.Task GetTeamActivity_UserNotInProject_ReturnsEmpty()
        {
            var project = new Project
            {
                Id = 1,
                Name = "Other project",
                Members = new List<ProjectMember>()
            };

            var activity = new Activity
            {
                Id = 1,
                ProjectId = 1,
                Project = project,
                Description = "изменил статус",
                CreatedAt = DateTime.UtcNow
            };


            await context.Projects.AddAsync(project);
            await context.Activities.AddAsync(activity);

            await context.SaveChangesAsync();

            var result = await service.GetTeamActivity(5);

            Assert.That(result, Is.Empty);
        }


        [Test]
        public async System.Threading.Tasks.Task GetTeamActivity_ReturnsLatestTenActivities()
        {
            var user = new User
            {
                Id = 1,
                UserName = "User"
            };

            var project = new Project
            {
                Id = 1,
                Name = "Project"
            };
            var member = new ProjectMember
            {
                UserId = 1,
                ProjectId = 1,
                User = user,
                Project = project
            };
            project.Members = new List<ProjectMember>
            {
                member
            };
            await context.Users.AddAsync(user);
            await context.Projects.AddAsync(project);
            await context.ProjectMembers.AddAsync(member);
            for (int i = 0; i < 20; i++)
            {
                await context.Activities.AddAsync(new Activity
                {
                    UserId = 1,
                    User = user,
                    ProjectId = 1,
                    Project = project,
                    Description = $"Activity {i}",
                    CreatedAt = DateTime.UtcNow.AddMinutes(i)
                });
            }
            await context.SaveChangesAsync();
            var result = await service.GetTeamActivity(1);
            Assert.That(result.Count, Is.EqualTo(10));
            Assert.That(result[0].Description, Is.EqualTo("Activity 19"));
        }
    }
}
