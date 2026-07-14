using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Services;

namespace TaskFlow.Test.ProjectServiceTest
{
    [TestFixture]
    class ProjectServiceTest
    {
        private ProjectService projectService;
        private ApplicationDbContext context;
        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            context = new ApplicationDbContext(options);
            projectService = new ProjectService(context);
        }
        [TearDown]
        public void TearDown()
        {
            context.Dispose();
        }

        [Test]
        public async System.Threading.Tasks.Task GetAllProjectTest()
        {
            var ownerFirst = new User
            {
                Id = 1
            };

            context.Projects.Add(new Project
            {
                Id = 1,
                Name = "FirstTest",
                Description = "FirstTestDescr",
                Owner = ownerFirst,
                OwnerId = ownerFirst.Id,
                Status = StatusProject.Active
            });
            context.Projects.Add(new Project
            {
                Id = 2,
                Name = "SecondTest",
                Description = "SecondTestDescr",
                Owner = ownerFirst,
                OwnerId = ownerFirst.Id,
                Status = StatusProject.Completed
            });
            await context.SaveChangesAsync();
            var projects = await projectService.GetAllProjectUser(ownerFirst.Id);

            Assert.That(projects.Count, Is.EqualTo(2));

            Assert.That(projects.All(p => p.OwnerId == 1), Is.True);

            var firstName = projects.First(prDTO => prDTO.Id == 1).Name;
            Assert.That(firstName, Is.EqualTo("FirstTest"));

            var secondStatus = projects.First(prDTO => prDTO.Id == 2).Status;
            Assert.That(secondStatus == StatusProject.Completed, Is.True);
        }

        [Test]
        public async System.Threading.Tasks.Task GetCurrentProjectTest()
        {
            var ownerFirst = new User
            {
                Id = 1
            };

            context.Projects.Add(new Project
            {
                Id = 1,
                Name = "FirstTest",
                Description = "FirstTestDescr",
                Owner = ownerFirst,
                OwnerId = ownerFirst.Id,
                Status = StatusProject.Active
            });
            var memberUser = new User
            {
                Id = 3,
                UserName = "Member"
            };
            context.Projects.Add(new Project
            {
                Id = 2,
                Name = "SecondTest",
                Description = "SecondTestDescr",
                Owner = ownerFirst,
                OwnerId = ownerFirst.Id,
                Status = StatusProject.Completed,
                Members = new []
                    {
                        new ProjectMember
                        {
                            UserId = memberUser.Id,
                            ProjectId = 2,
                            User = memberUser
                        }
                    }
            });
            await context.SaveChangesAsync();

            var Owner = ownerFirst.Id;
            var projectId = 1;
            var projectOwner = await projectService.GetCurrentProject(projectId, Owner);

            Assert.That(projectOwner.Id, Is.EqualTo(projectId));
            Assert.That(projectOwner.Name, Is.EqualTo("FirstTest"));
            Assert.That(projectOwner.Owner.UserId, Is.EqualTo(Owner));

            var userId = 3;
            projectId = 2;
            var projectMember = await projectService.GetCurrentProject(projectId, userId);
            Assert.That(projectMember.Id, Is.EqualTo(projectId));
            Assert.That(projectMember.Name, Is.EqualTo("SecondTest"));
            Assert.That(projectMember.Members.All(m => m.UserId == userId), Is.True);

            var stranger = await projectService.GetCurrentProject(2, 99);

            Assert.That(stranger, Is.Null);
        }
        
    }
}
