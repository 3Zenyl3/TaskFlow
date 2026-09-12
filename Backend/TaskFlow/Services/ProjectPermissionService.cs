using Microsoft.EntityFrameworkCore;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Exceptions;
using TaskFlow.Services.Interfaces;

namespace TaskFlow.Services
{
    public class ProjectPermissionService : IProjectPermissionService
    {
        private readonly ApplicationDbContext context;
        private static readonly Dictionary<ProjectRole, HashSet<ProjectPermission>> RolePermissions = new()
        {
            [ProjectRole.Owner] = new()
            {
                ProjectPermission.ViewProject,
                ProjectPermission.CreateTask,
                ProjectPermission.EditTask,
                ProjectPermission.DeleteTask,
                ProjectPermission.ChangeTaskStatus,
                ProjectPermission.CommentTask,
                ProjectPermission.UploadTaskFile,
                ProjectPermission.ManageMembers,
                ProjectPermission.ManageMemberRoles,
                ProjectPermission.ManageStages,
                ProjectPermission.EditProject,
                ProjectPermission.DeleteProject
            },
            [ProjectRole.Admin] = new()
            {
                ProjectPermission.ViewProject,
                ProjectPermission.CreateTask,
                ProjectPermission.EditTask,
                ProjectPermission.DeleteTask,
                ProjectPermission.ChangeTaskStatus,
                ProjectPermission.CommentTask,
                ProjectPermission.UploadTaskFile,
                ProjectPermission.ManageMembers,
                ProjectPermission.ManageStages,
                ProjectPermission.EditProject
            },

            [ProjectRole.Member] = new()
            {
                ProjectPermission.ViewProject,
                ProjectPermission.CreateTask,
                ProjectPermission.EditTask,
                ProjectPermission.ChangeTaskStatus,
                ProjectPermission.CommentTask,
                ProjectPermission.UploadTaskFile
            },

            [ProjectRole.Viewer] = new()
            {
                ProjectPermission.ViewProject
            }
        };

        public ProjectPermissionService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<bool> HasPermission(int userId, int projectId, ProjectPermission permission)
        {
            var project = await context.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
            {
                throw new NotFoundException("Проект не найден");
            }

            if(project.OwnerId == userId)
            {
                return RolePermissions[ProjectRole.Owner].Contains(permission);
            }
            var projectMember = project.Members
                    .Where(m => m.UserId == userId)
                    .FirstOrDefault();

            if (projectMember == null)
            {
                throw new NotFoundException("Пользователь не найден в проекте");
            }

            var userRole = projectMember.ProjectRole;

            return RolePermissions[userRole].Contains(permission);
        }
    }
}
