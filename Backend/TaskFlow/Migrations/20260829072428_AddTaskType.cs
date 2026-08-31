using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlow.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<string>>(
                name: "Tags",
                table: "Tasks",
                type: "text[]",
                nullable: false,
                defaultValue: new List<string>());

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Tasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Tasks");
        }
    }
}
