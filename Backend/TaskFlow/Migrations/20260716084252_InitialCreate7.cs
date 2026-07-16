using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlow.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Users",
                newName: "UserRole");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "ProjectMembers",
                newName: "ProjectRole");

            migrationBuilder.RenameColumn(
                name: "isRead",
                table: "Notifications",
                newName: "IsRead");

            migrationBuilder.RenameColumn(
                name: "Created",
                table: "Notifications",
                newName: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserRole",
                table: "Users",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "ProjectRole",
                table: "ProjectMembers",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "IsRead",
                table: "Notifications",
                newName: "isRead");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Notifications",
                newName: "Created");
        }
    }
}
