using Microsoft.EntityFrameworkCore;
using TaskFlow.Entities;

namespace TaskFlow.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Entities.Task> Tasks { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ProjectMember> ProjectMembers { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ProjectFile> ProjectFiles { get; set; }
        public DbSet<ProjectStage> ProjectStages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Entities.Task>()
                .HasOne(t => t.Creator)
                .WithMany(u => u.CreatedTasks)
                .HasForeignKey(t => t.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProjectStage>()
                .HasOne(s => s.Project)
                .WithMany(s => s.Stages)
                .HasForeignKey(s => s.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProjectStage>()
                .OwnsOne(s => s.ColorStage);

            modelBuilder.Entity<Entities.Task>()
                .HasOne(t => t.Stage)
                .WithMany()
                .HasForeignKey(t => t.StageId)
                .OnDelete(DeleteBehavior.SetNull);


            modelBuilder.Entity<Entities.Task>()
                .HasOne(t => t.Executor)
                .WithMany(u => u.AssignedTasks)
                .HasForeignKey(t => t.ExecutorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Activity>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Activity>()
                .HasOne(a => a.Task)
                .WithMany()
                .HasForeignKey(a => a.TaskId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Activity>()
                .HasOne(a => a.Project)
                .WithMany(p => p.Activities)
                .HasForeignKey(a => a.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .OwnsOne(p => p.Color);
            modelBuilder.Entity<Project>()
                .Property(p => p.Tags)
                .HasDefaultValueSql("'{}'");

            modelBuilder.Entity<Project>()
                .HasIndex(p => p.Key)
                .IsUnique();
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
    }
}
