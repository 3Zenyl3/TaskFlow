using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Exceptions;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;
using TaskFlow.Services;
using TaskFlow.Services.Interfaces;

namespace TaskFlow.Test.StageServiceTest
{
    [TestFixture]
    public class StageServiceTest
    {
        private ApplicationDbContext context;
        private StagesService stagesService;
        private IActivityService activityService;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            

            context = new ApplicationDbContext(options);
            activityService = new ActivityService(context);
            stagesService = new StagesService(context, activityService);
        }

        [TearDown]
        public void TearDown()
        {
            context.Database.EnsureDeleted();
            context.Dispose();
        }

        private Project CreateProject(int id, int ownerId)
        {
            return new Project
            {
                Id = id,
                Name = "Test project",
                Description = "Description",
                OwnerId = ownerId,
                Key = $"TEST{id}",
                Icon = "globe",
                Category = "Development",
                Members = new List<ProjectMember>()
            };
        }

        [Test]
        public async System.Threading.Tasks.Task GetStages_ReturnsStagesInCorrectOrder()
        {
            var project = CreateProject(1, 1);

            context.Projects.Add(project);

            context.ProjectStages.AddRange(
                new ProjectStage
                {
                    Id = 1,
                    ProjectId = 1,
                    Name = "Frontend",
                    Description = "Frontend development",
                    Position = 2,
                    StartDate = DateTime.UtcNow,
                    Icon = "code"
                },
                new ProjectStage
                {
                    Id = 2,
                    ProjectId = 1,
                    Name = "Backend",
                    Description = "Backend development",
                    Position = 1,
                    StartDate = DateTime.UtcNow,
                    Icon = "code"
                }
            );

            await context.SaveChangesAsync();

            var result = await stagesService.GetStages(1);

            Assert.That(result, Has.Count.EqualTo(2));

            Assert.That(result[0].Name, Is.EqualTo("Backend"));
            Assert.That(result[0].Position, Is.EqualTo(1));

            Assert.That(result[1].Name, Is.EqualTo("Frontend"));
            Assert.That(result[1].Position, Is.EqualTo(2));
        }

        [Test]
        public async System.Threading.Tasks.Task GetStages_ReturnsEmptyList_WhenProjectHasNoStages()
        {
            var project = CreateProject(1, 1);

            context.Projects.Add(project);
            await context.SaveChangesAsync();

            var result = await stagesService.GetStages(1);

            Assert.That(result, Is.Empty);
        }

        [Test]
        public async System.Threading.Tasks.Task CreateStage_CreatesFirstStageWithPositionOne()
        {
            var project = CreateProject(1, 1);

            context.Projects.Add(project);
            await context.SaveChangesAsync();

            var request = new CreateProjectStageRequest
            {
                Name = "Backend",
                Description = "Backend development",
                Icon = "code"
            };

            var result = await stagesService.CreateStage(request, 1, 1);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo("Backend"));
            Assert.That(result.Description, Is.EqualTo("Backend development"));
            Assert.That(result.ProjectId, Is.EqualTo(1));
            Assert.That(result.Position, Is.EqualTo(1));

            var stage = await context.ProjectStages.FirstAsync();

            Assert.That(stage.Name, Is.EqualTo("Backend"));
            Assert.That(stage.Position, Is.EqualTo(1));
        }

        [Test]
        public async System.Threading.Tasks.Task CreateStage_CreatesStageWithNextPosition()
        {
            var project = CreateProject(1, 1);

            context.Projects.Add(project);

            context.ProjectStages.AddRange(
                new ProjectStage
                {
                    ProjectId = 1,
                    Name = "Backend",
                    Position = 1,
                    StartDate = DateTime.UtcNow,
                    Icon = "code"
                },
                new ProjectStage
                {
                    ProjectId = 1,
                    Name = "Frontend",
                    Position = 2,
                    StartDate = DateTime.UtcNow,
                    Icon = "code"
                }
            );

            await context.SaveChangesAsync();

            var request = new CreateProjectStageRequest
            {
                Name = "Testing",
                Description = "Testing stage",
                Icon = "code"
            };

            var result = await stagesService.CreateStage(request, 1, 1);

            Assert.That(result.Position, Is.EqualTo(3));
            Assert.That(result.Name, Is.EqualTo("Testing"));
        }

        [Test]
        public async System.Threading.Tasks.Task CreateStage_CalculatesPositionOnlyInsideProject()
        {
            var project1 = CreateProject(1, 1);

            var project2 = CreateProject(2, 1);

            context.Projects.AddRange(project1, project2);

            context.ProjectStages.AddRange(
                new ProjectStage
                {
                    ProjectId = 1,
                    Name = "Backend",
                    Position = 1,
                    StartDate = DateTime.UtcNow,
                    Icon = "code"
                },
                new ProjectStage
                {
                    ProjectId = 2,
                    Name = "Stage 1",
                    Position = 1,
                    StartDate = DateTime.UtcNow,
                    Icon = "code"
                },
                new ProjectStage
                {
                    ProjectId = 2,
                    Name = "Stage 2",
                    Position = 2,
                    StartDate = DateTime.UtcNow,
                    Icon = "code"
                },
                new ProjectStage
                {
                    ProjectId = 2,
                    Name = "Stage 3",
                    Position = 3,
                    StartDate = DateTime.UtcNow,
                    Icon = "code"
                }
            );

            await context.SaveChangesAsync();

            var request = new CreateProjectStageRequest
            {
                Name = "Frontend",
                Description = "Frontend development",
                Icon = "code"
            };

            var result = await stagesService.CreateStage(request, 1, 1);

            Assert.That(result.Position, Is.EqualTo(2));
        }

        [Test]
        public async System.Threading.Tasks.Task UpdateStage_UpdatesStageSuccessfully()
        {
            var project = CreateProject(1, 1);

            var stage = new ProjectStage
            {
                Id = 1,
                ProjectId = 1,
                Name = "Backend",
                Description = "Old description",
                Position = 1,
                StartDate = DateTime.UtcNow,
                Icon = "code"
            };

            context.Projects.Add(project);
            context.ProjectStages.Add(stage);

            await context.SaveChangesAsync();

            var request = new CreateProjectStageRequest
            {
                Name = "New Backend",
                Description = "New description"
            };

            var result = await stagesService.UpdateStage(request, 1, 1, 1);

            Assert.That(result.Name, Is.EqualTo("New Backend"));
            Assert.That(result.Description, Is.EqualTo("New description"));
            Assert.That(result.Position, Is.EqualTo(1));
            Assert.That(result.ProjectId, Is.EqualTo(1));
        }

        [Test]
        public void UpdateStage_ThrowsNotFound_WhenStageDoesNotExist()
        {
            var request = new CreateProjectStageRequest
            {
                Name = "Backend",
                Description = "Backend development"
            };

            Assert.ThrowsAsync<NotFoundException>(
                async () => await stagesService.UpdateStage(request, 1, 999, 1)
            );
        }

        [Test]
        public async System.Threading.Tasks.Task UpdateStage_ThrowsNotFound_WhenStageBelongsToAnotherProject()
        {
            var project1 = CreateProject(1, 1);

            var project2 = CreateProject(2, 1);

            var stage = new ProjectStage
            {
                Id = 1,
                ProjectId = 2,
                Name = "Backend",
                Position = 1,
                StartDate = DateTime.UtcNow,
                Icon = "code"
            };

            context.Projects.AddRange(project1, project2);
            context.ProjectStages.Add(stage);

            await context.SaveChangesAsync();

            var request = new CreateProjectStageRequest
            {
                Name = "Hacked Stage",
                Description = "Should not be updated"
            };

            Assert.ThrowsAsync<NotFoundException>(
                async () => await stagesService.UpdateStage(request, 1, 1, 1)
            );

            var savedStage = await context.ProjectStages.FindAsync(1);

            Assert.That(savedStage!.Name, Is.EqualTo("Backend"));
            Assert.That(savedStage.ProjectId, Is.EqualTo(2));
        }

        [Test]
        public async System.Threading.Tasks.Task DeleteStage_DeletesStageSuccessfully()
        {
            var project = CreateProject(1, 1);

            var stage = new ProjectStage
            {
                Id = 1,
                ProjectId = 1,
                Name = "Backend",
                Position = 1,
                StartDate = DateTime.UtcNow,
                Icon = "code"
            };

            context.Projects.Add(project);
            context.ProjectStages.Add(stage);

            await context.SaveChangesAsync();

            await stagesService.DeleteStage(1, 1, 1);

            var deletedStage = await context.ProjectStages.FindAsync(1);

            Assert.That(deletedStage, Is.Null);
        }

        [Test]
        public void DeleteStage_ThrowsNotFound_WhenStageDoesNotExist()
        {
            Assert.ThrowsAsync<NotFoundException>(
                async () => await stagesService.DeleteStage(1, 999, 1)
            );
        }

        [Test]
        public async System.Threading.Tasks.Task DeleteStage_ThrowsNotFound_WhenStageBelongsToAnotherProject()
        {
            var project1 = CreateProject(1, 1);

            var project2 = CreateProject(2, 1);

            var stage = new ProjectStage
            {
                Id = 1,
                ProjectId = 2,
                Name = "Backend",
                Position = 1,
                StartDate = DateTime.UtcNow,
                Icon = "code"
            };

            context.Projects.AddRange(project1, project2);
            context.ProjectStages.Add(stage);

            await context.SaveChangesAsync();

            Assert.ThrowsAsync<NotFoundException>(
                async () => await stagesService.DeleteStage(1, 1, 1)
            );

            var savedStage = await context.ProjectStages.FindAsync(1);

            Assert.That(savedStage, Is.Not.Null);
            Assert.That(savedStage.ProjectId, Is.EqualTo(2));
        }
    }
}