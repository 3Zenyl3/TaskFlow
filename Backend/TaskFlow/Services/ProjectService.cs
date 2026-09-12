using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Exceptions;
using TaskFlow.Models;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;
using TaskFlow.Services.Interfaces;

namespace TaskFlow.Services
{
    public class ProjectService : IProjectService
    {
        private ApplicationDbContext context;
        private IActivityService activityService;
        private IProjectPermissionService permissionService;
        public ProjectService(ApplicationDbContext context,
            IActivityService activityService,
            IProjectPermissionService permissionService)
        {
            this.context = context;
            this.activityService = activityService;
            this.permissionService = permissionService;
        }

        public async Task<List<ProjectListDto>> GetAllProjectUser(int userId)
        {
            return await context.Projects
                .Where(p =>
                    p.OwnerId == userId ||
                    p.Members.Any(m => m.UserId == userId)
                )
                .Select(p => new ProjectListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Color = new ProjectColor
                    {
                        Name = p.Color.Name,
                        Value = p.Color.Value,
                        Background = p.Color.Background
                    },
                    Icon = p.Icon,
                    TaskCount = p.Tasks.Count(),
                    CompletedTaskCount = p.Tasks
                        .Count(t => t.Status == StatusTask.Done),
                    ProgressPercent = p.Tasks.Count() == 0
                        ? 0
                        : (int)(p.Tasks.Count(t => t.Status == StatusTask.Done) * 100.0
                            / p.Tasks.Count()),
                    Members = p.Members
                        .Select(m => new UserDto
                        {
                            UserId = m.User.Id,
                            UserName = m.User.UserName,
                            AvatarUrl = m.User.AvatarUrl,
                        })
                        .ToList(),
                    Stages = p.Stages.ToList()
                })
                .ToListAsync();
        }

        public async Task<ProjectDetailsDto?> GetCurrentProject(int projectId, int userId)
        {
            var project = await context.Projects
                .Include(p => p.Owner)
                .Include(p => p.Members)
                    .ThenInclude(m => m.User)
                .Include(p => p.Activities)
                    .ThenInclude(a => a.User)
                .Include(p => p.Tasks)
                    .ThenInclude(t => t.Executor)
                .Include(p => p.Files)
                .Include(p => p.Color)
                .Where(p =>
                    p.Id == projectId &&
                    (p.Members.Any(m => m.UserId == userId) ||
                     p.OwnerId == userId)
                )
                .FirstOrDefaultAsync();

            if (project == null)
                return null;

            return await CreateProjectDetails(project);
        }

        private async Task<ProjectDetailsDto> CreateProjectDetails(Project project)
        {
            return new ProjectDetailsDto
            {
                Id = project.Id,
                Name = project.Name,
                Status = project.Status,
                Description = project.Description,

                Members = project.Members
                    .Where(m => m.UserId != project.OwnerId)
                    .Select(m => new ProjectMemberDto
                    {
                        UserDto = new UserDto
                        {
                            UserId = m.User.Id,
                            UserName = m.User.UserName,
                            AvatarUrl = m.User.AvatarUrl
                        },
                        Email = m.User.Email,
                        Role = m.ProjectRole
                    })
                .ToList(),

                Owner = new UserDto
                {
                    UserId = project.Owner.Id,
                    UserName = project.Owner.UserName,
                    AvatarUrl = project.Owner.AvatarUrl
                },

                ProgressPercent = project.Tasks.Count == 0
                ? 0
                : (int)(
                    project.Tasks.Count(t => t.Status == StatusTask.Done) * 100.0
                    / project.Tasks.Count
                ),
                CompletedTaskCount = project.Tasks
                .Count(t => t.Status == StatusTask.Done),

                LeftTaskCount = project.Tasks.Count -
                        project.Tasks.Count(t => t.Status == StatusTask.Done),

                OverdueTaskCount = project.Tasks
                    .Count(t => t.Status == StatusTask.Overdue),

                TaskCount = project.Tasks.Count,

                TaskInProgressCount = project.Tasks
                    .Count(t => t.Status == StatusTask.InProgress),

                TaskInReviewCount = project.Tasks
                    .Count(t => t.Status == StatusTask.Review),

                Tasks = project.Tasks
                    .Select(t => new TaskDto
                    {
                        Id = t.Id,
                        ProjectId = t.ProjectId,
                        Key = $"{project.Key}-{t.Id}",
                        Title = t.Title,
                        Description = t.Description,
                        Priority = t.Priority,
                        Status = t.Status,
                        Deadline = t.Deadline,
                        ProjectName = t.Project.Name,
                        ExecutorName = t.Executor != null
                            ? t.Executor.UserName
                            : null,
                        ExecutorId = t.Executor.Id,
                        StageId = t.StageId,
                        Tags = t.Tags,
                        Comments = t.Comments
                            .Select(c => new CommentDTO
                            {
                                Id = c.Id,
                                Author = new UserDto
                                {
                                    UserId = c.Author.Id,
                                    AvatarUrl = c.Author.AvatarUrl,
                                    UserName = c.Author.UserName
                                },
                                CreateAt = c.CreatedAt,
                                Text = c.Text
                            })
                            .ToList(),
                        Type = t.Type,
                        StartDate = t.StartDate,
                    })
                    .ToList(),

                Category = project.Category,

                Deadline = project.Deadline,

                StartDate = project.StartDate,

                Tags = project.Tags,

                Files = project.Files
                    .OrderByDescending(f => f.UploadedAt)
                    .Select(f => new ProjectFileDTO
                    {
                        Id = f.Id,
                        FileName = f.FileName,
                        ContentType = f.ContentType,
                        Size = f.Size,
                        UploadedAt = f.UploadedAt
                    })
                    .ToList(),

                Color = project.Color == null
                ? null
                : new ProjectColor
                {
                    Name = project.Color.Name,
                    Value = project.Color.Value,
                    Background = project.Color.Background
                },

                Icon = project.Icon,

                Key = project.Key,
                Activities = project.Activities
                    .OrderByDescending(a => a.CreatedAt)
                    .Select(a => new ActivityDTO
                    {
                        Id = a.Id,
                        User = new UserDto
                        {
                            UserId = a.User.Id,
                            UserName = a.User.UserName,
                            AvatarUrl = a.User.AvatarUrl
                        },
                        Type = a.Type,
                        Description = a.Description,
                        CreatedAt = a.CreatedAt
                    })
                    .ToList(),
            };
        }

        public async Task<ProjectCreateDto> CreateProject(User user, CreateProjectRequest request)
        {
            var keyExists = await context.Projects
                    .AnyAsync(p => p.Key == request.Key);

            if (keyExists)
            {
                throw new ConflictException(
                    $"Проект с ключом '{request.Key}' уже существует.");
            }

            if (user != null)
            {
                var project = new Project
                {
                    Name = request.Name,
                    Description = request.Description,
                    Icon = request.Icon,
                    Key = request.Key,
                    Category = request.Category,
                    Color = request.Color,
                    StartDate = request.StartDate,
                    Deadline = request.Deadline,
                    Tags = request.Tags,
                    OwnerId = user.Id,
                    CreatedDate = DateTime.UtcNow,
                    Status = StatusProject.Active,
                };
                context.Projects.Add(project);
                await context.SaveChangesAsync();

                await SyncProjectMembers(request.Members, project, user);

                context.ProjectMembers.Add(new ProjectMember
                {
                    ProjectId = project.Id,
                    UserId = user.Id,
                    ProjectRole = ProjectRole.Owner
                });

                await context.SaveChangesAsync();

                return new ProjectCreateDto
                {
                    Id = project.Id,
                    Name = project.Name,
                    Description = project.Description,
                    Status = project.Status
                };
            }
            return null;
        }

        

        public async Task<UpdateProjectResponse> UpdateProject(
            UpdateProjectRequest request,
            int userId,
            int projectId)
        {
            if (!await permissionService.HasPermission(
                userId,
                projectId,
                ProjectPermission.EditProject))
            {
                throw new ForbiddenException("Недостаточно прав для редактирования проекта");
            }
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new NotFoundException("Пользователь не найден");
            }

            var project = await context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
            {
                return new UpdateProjectResponse
                {
                    UpdateProjectResult = ProjectOperationResult.NotFound
                };
            }

            var keyExists = await context.Projects
                .AnyAsync(p => p.Key == request.Key && p.Id != projectId);

            if (keyExists)
            {
                throw new ConflictException(
                    $"Проект с ключом '{request.Key}' уже существует.");
            }

            if (project.OwnerId != userId)
            {
                return new UpdateProjectResponse
                {
                    UpdateProjectResult = ProjectOperationResult.Forbidden
                };
            }

            if (request.Members != null)
            {
                await SyncProjectMembers(request.Members, project, user);
            }

            

            project.Name = request.Name;
            project.Description = request.Description;
            project.Icon = request.Icon;
            project.Tags = request.Tags;
            project.Key = request.Key;
            project.StartDate = request.StartDate;
            project.Color = request.Color;
            project.Deadline = request.Deadline;
            project.Category = request.Category;

            await context.SaveChangesAsync();

            await activityService.CreateActivity(
                userId: userId,
                activityType: ActivityType.UpdatedProject,
                description: $"изменил(a) настройки проекта {project.Name}",
                projectId: project.Id,
                taskId: null
            );

            var projectDTO = new ProjectCreateDto
            {
                Id = projectId,
                Description = project.Description,
                Name = project.Name,
                Status = project.Status
            };

            return new UpdateProjectResponse
            {
                UpdateProjectResult = ProjectOperationResult.Success,
                Project = projectDTO
            };
        }

        private async System.Threading.Tasks.Task SyncProjectMembers(
            List<ProjectMemberRequest> members,
            Project project,
            User user)
        {
            var projectMembers = context.ProjectMembers
                .Where(m => m.ProjectId == project.Id)
                .Select(m => m.UserId)
                .ToHashSet();
            var requestedUserIds = new HashSet<int>();
            foreach (var memberRequest in members)
            {
                if (memberRequest.Role == ProjectRole.Owner)
                {
                    throw new BadRequestException(
                        "Владельца проекта нельзя добавить в список участников");
                }
                var memberUser = await context.Users
                    .FirstOrDefaultAsync(u => u.Email == memberRequest.Email);

                if (memberUser == null)
                    throw new ForbiddenException($"Пользователь с емайлом {memberRequest.Email} не найден");
                requestedUserIds.Add(memberUser.Id);
                if (projectMembers.Contains(memberUser.Id))
                {
                    var existingMember = project.Members
                        .FirstOrDefault(m => m.UserId == memberUser.Id);

                    if (existingMember != null)
                    {
                        if (existingMember.ProjectRole != memberRequest.Role)
                        {
                            existingMember.ProjectRole = memberRequest.Role;
                        }
                        continue;
                    }
                }
                    

                var member = new ProjectMember
                {
                    ProjectId = project.Id,
                    UserId = memberUser.Id,
                    ProjectRole = memberRequest.Role
                };
                projectMembers.Add(member.UserId);
                context.ProjectMembers.Add(member);

                await activityService.CreateActivity(
                    userId: user.Id,
                    activityType: ActivityType.AddedMember,
                    description: $"добавил(а) пользователя {memberUser.UserName} в проект {project.Name}",
                    projectId: project.Id,
                    taskId: null
                );
            }
            var membersToRemove = await context.ProjectMembers
                    .Where(m =>
                        m.ProjectId == project.Id &&
                        m.UserId != project.OwnerId &&
                        !requestedUserIds.Contains(m.UserId))
                    .ToListAsync();

            context.ProjectMembers.RemoveRange(membersToRemove);
        }

        public async Task<ProjectOperationResult> DeleteProject(int userId, int projectId)
        {
            if (!await permissionService.HasPermission(
                userId,
                projectId,
                ProjectPermission.DeleteProject))
            {
                throw new ForbiddenException("Недостаточно прав для удаления проекта");
            }

            var project = await context.Projects.FindAsync(projectId);

            if (project == null)
                return ProjectOperationResult.NotFound;
            if (project.OwnerId != userId)
                return ProjectOperationResult.Forbidden;

            context.Projects.Remove(project);
            await context.SaveChangesAsync();
            return ProjectOperationResult.Success;
        }

        public async Task<ProjectFileDTO> UploadProjectFile(int userId, int projectId, IFormFile file)
        {
            if (!await permissionService.HasPermission(
                userId,
                projectId,
                ProjectPermission.UploadTaskFile))
            {
                throw new ForbiddenException("Недостаточно прав для загрузки файлов");
            }

            var allowedExtensions = new HashSet<string>(
                StringComparer.OrdinalIgnoreCase)
            {
                ".pdf",
                ".png",
                ".jpg",
                ".jpeg",
                ".docx",
                ".xlsx",
                ".txt",
                ".zip"
            };

            if (file == null)
            {
                throw new BadRequestException("Файл не найден");
            }
            var maxFileSize = 10 * 1024 * 1024l;

            if (file.Length > maxFileSize)
            {
                throw new BadRequestException("Максимальный размер файла — 10 МБ");
            }
            if (file.Length == 0)
            {
                throw new BadRequestException("Файл пустой");
            }

            var hasProjectAccess = await context.Projects
                .Where(p => p.Id == projectId)
                .AnyAsync(p => p.OwnerId == userId || p.Members
                    .Any(m => m.UserId == userId)
                );
            if (!hasProjectAccess)
            {
                throw new ForbiddenException();
            }
            var projectFolder = Path.Combine(
                "uploads",
                "projects",
                projectId.ToString()
            );
            Directory.CreateDirectory(projectFolder);
            var fileName = Path.GetFileName(file.FileName);

            var extension = Path.GetExtension(fileName);

            if (!allowedExtensions.Contains(extension))
            {
                throw new BadRequestException("Тип файла не поддерживается");
            }

            var storedFileName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";

            var filePath = Path.Combine(
                projectFolder,
                storedFileName
            );
            await using var stream = new FileStream(
                filePath,
                FileMode.Create
            );

            await file.CopyToAsync(stream);

            var projectFile = new ProjectFile
            {
                ProjectId = projectId,
                UploadedById = userId,
                ContentType = file.ContentType,
                Size = file.Length,
                StoragePath = filePath,
                StoredFileName = storedFileName,
                UploadedAt = DateTime.UtcNow,
                FileName = fileName,
            };

            await context.ProjectFiles.AddAsync(projectFile);
            await context.SaveChangesAsync();

            var projectName = await context.Projects
                .Where(p => p.Id == projectId)
                .Select(p => p.Name)
                .FirstAsync();

            await activityService.CreateActivity(
                userId: userId,
                activityType: ActivityType.UploadedFile,
                description: $"загрузил(а) файл {fileName} в проект {projectName}",
                projectId: projectId,
                taskId: null
            );

            return new ProjectFileDTO
            {
                Id = projectFile.Id,
                ContentType = projectFile.ContentType,
                FileName = projectFile.FileName,
                Size = file.Length,
                UploadedAt = projectFile.UploadedAt
            };
        }

        public async Task<ProjectFile> GetFileForDownload(int userId, int projectId, int fileId)
        {
            var hasProjectAccess = await context.Projects
                .Where(p => p.Id == projectId)
                .AnyAsync(p => p.OwnerId == userId || p.Members
                    .Any(m => m.UserId == userId)
                    );

            if (!hasProjectAccess)
            {
                throw new ForbiddenException();
            }

            var file = await context.ProjectFiles
                .FirstOrDefaultAsync(f => f.Id == fileId && f.ProjectId == projectId);

            if (file == null)
            {
                throw new NotFoundException("Файл не найден");
            }

            if (!System.IO.File.Exists(file.StoragePath))
            {
                throw new NotFoundException("Файл не найден на сервере");
            }
            var fileInfo = new FileInfo(file.StoragePath);

            return file;
        }
    }
}
