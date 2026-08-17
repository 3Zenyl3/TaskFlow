using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public ProjectService(ApplicationDbContext context)
        {
            this.context = context;
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
                })
                .ToListAsync();
        }

        public async Task<ProjectDetailsDto?> GetCurrentProject(int projectId, int userId)
        {
            return await context.Projects
                .Where(p => p.Id == projectId && (p.Members.Any(m => m.UserId == userId) || p.OwnerId == userId))
                .Select(p => new ProjectDetailsDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Status = p.Status,
                    Description = p.Description,
                    Members = p.Members
                        .Where(m => m.UserId != p.OwnerId)
                        .Select(m => new ProjectMemberDto
                        {
                            UserDto = new UserDto
                            {
                                UserId = m.User.Id,
                                UserName = m.User.UserName,
                                AvatarUrl = m.User.AvatarUrl,
                            },
                            Email = m.User.Email,
                            Role = m.ProjectRole
                        })
                        .ToList(),
                    Owner = new UserDto
                    {
                        UserId = p.Owner.Id,
                        UserName = p.Owner.UserName,
                        AvatarUrl = p.Owner.AvatarUrl
                    },
                    ProgressPercent = p.Tasks.Count() == 0
                        ? 0
                        : (int)(p.Tasks.Count(t => t.Status == StatusTask.Done) * 100.0
                            / p.Tasks.Count()),
                    CompletedTaskCount = p.Tasks
                        .Where(t => t.Status == StatusTask.Done)
                        .Count(),
                    LeftTaskCount = p.Tasks.Count - p.Tasks
                        .Where(t => t.Status == StatusTask.Done)
                        .Count(),
                    OverdueTaskCount = p.Tasks
                        .Where(t => t.Status == StatusTask.Overdue)
                        .Count(),
                    TaskCount = p.Tasks.Count(),
                    TaskInProgressCount = p.Tasks
                        .Where(t => t.Status == StatusTask.InProgress)
                        .Count(),
                    Tasks = p.Tasks
                        .Select(t => new TaskDto
                        {
                            Id = t.Id,
                            Title = t.Title,
                            Priority = t.Priority,
                            Status = t.Status,
                            Deadline = t.Deadline,
                            Description = t.Description,
                            ExecutorName = t.Executor.UserName,
                        })
                        .ToList(),
                    TaskInReviewCount = p.Tasks.Count(t => t.Status == StatusTask.Review),
                    Category = p.Category,
                    Deadline = p.Deadline,
                    StartDate = p.StartDate,
                    Tags = p.Tags,
                    Activities = context.Activities
                        .Where(a => a.ProjectId == p.Id)
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
                            CreatedAt = a.CreatedAt,
                        })
                        .ToList(),
                    Files = p.Files
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
                    Color = new ProjectColor
                    {
                        Name = p.Color.Name,
                        Value = p.Color.Value,
                        Background = p.Color.Background
                    },
                    Icon = p.Icon,
                    Key = p.Key
                })
                .FirstOrDefaultAsync();
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

                await AddNewMemberToProject(request, project, user);

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

        private async System.Threading.Tasks.Task AddNewMemberToProject(
            CreateProjectRequest request,
            Project project,
            User user)
        {
            foreach (var memberRequest in request.Members)
            {
                var memberUser = await context.Users
                    .FirstOrDefaultAsync(u => u.Email == memberRequest.Email);

                if (memberUser == null || memberUser.Id == user.Id)
                    continue;

                var member = new ProjectMember
                {
                    ProjectId = project.Id,
                    UserId = memberUser.Id,
                    ProjectRole = memberRequest.Role
                };

                context.ProjectMembers.Add(member);
            }
        }

        public async Task<UpdateProjectResponse> UpdateProject(
            UpdateProjectRequest request,
            int userId,
            int projectId)
        {
            var project = await context.Projects
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

            return new UpdateProjectResponse
            {
                UpdateProjectResult = ProjectOperationResult.Success,
                Project = project
            };
        }

        public async Task<ProjectOperationResult> DeleteProject(int userId, int projectId)
        {
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
