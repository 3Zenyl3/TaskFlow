using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlow.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectStageInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "ProjectStages",
                newName: "StartDate");

            migrationBuilder.AddColumn<string>(
                name: "ColorStage_Background",
                table: "ProjectStages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ColorStage_Name",
                table: "ProjectStages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ColorStage_Value",
                table: "ProjectStages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "ProjectStages",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "ProjectStages",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColorStage_Background",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "ColorStage_Name",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "ColorStage_Value",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "ProjectStages");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "ProjectStages",
                newName: "CreatedDate");
        }
    }
}
