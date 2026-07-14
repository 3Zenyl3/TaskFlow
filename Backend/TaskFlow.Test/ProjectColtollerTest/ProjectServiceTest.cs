using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;
using TaskFlow.Services;
using Task = System.Threading.Tasks.Task;

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
        public async Task GetAllProjectTest()
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
        public async Task GetCurrentProjectTest()
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

        [Test]
        public async Task CreateProjectTest()
        {
            var user = new User
            {
                Id = 1,
            };

            var createProjectRequest = new CreateProjectRequest
            {
                Name = "Test",
                Description = "TestDesc",
            };

            var prDTO = await projectService.CreateProject(user, createProjectRequest);

            Assert.That(prDTO.Name, Is.EqualTo("Test"));
            Assert.That(prDTO.Description, Is.EqualTo("TestDesc"));

            var project = await context.Projects.FindAsync(prDTO.Id);
            Assert.That(project, Is.Not.Null);
            Assert.That(project.OwnerId, Is.EqualTo(user.Id));

            var member = await context.ProjectMembers.FirstOrDefaultAsync(pm => pm.ProjectId == prDTO.Id);
            Assert.That(member, Is.Not.Null);
            Assert.That(member.UserId, Is.EqualTo(user.Id));
            Assert.That(member.ProjectRole, Is.EqualTo(ProjectRole.Owner));
        }

        [Test]
        public async Task UpdateProject_Success()
        {
            var owner = new User
            {
                Id = 1
            };

            var project = new Project
            {
                Id = 1,
                Name = "OldName",
                Description = "OldDescription",
                OwnerId = owner.Id,
                Owner = owner,
                Status = StatusProject.Active
            };

            context.Projects.Add(project);
            await context.SaveChangesAsync();

            var request = new UpdateProjectRequest
            {
                Name = "NewName",
                Description = "NewDescription"
            };

            var result = await projectService.UpdateProject(request, owner.Id, project.Id);

            Assert.That(result.UpdateProjectResult, Is.EqualTo(ProjectOperationResult.Success));

            var updatedProject = await context.Projects.FindAsync(project.Id);

            Assert.That(updatedProject, Is.Not.Null);
            Assert.That(updatedProject.Name, Is.EqualTo("NewName"));
            Assert.That(updatedProject.Description, Is.EqualTo("NewDescription"));
        }

        [Test]
        public async Task DeleteProjectTest()
        {
            var owner = new User
            {
                Id = 1
            };

            var project = new Project
            {
                Id = 1,
                Owner = owner,
                OwnerId = owner.Id,
            };
            context.Projects.Add(project);
            await context.SaveChangesAsync();

            var deleteRes = await projectService.DeleteProject(owner.Id, project.Id);

            Assert.That(await context.Projects.FirstOrDefaultAsync(p => p.Id == project.Id), Is.Null);
            Assert.That(deleteRes, Is.EqualTo(ProjectOperationResult.Success));
        }
    }
}
