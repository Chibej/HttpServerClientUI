using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HttpServerClientUI.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddElementDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "CanvasElements",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Body",
                table: "CanvasElements",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Headers",
                table: "CanvasElements",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Port",
                table: "CanvasElements",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Request",
                table: "CanvasElements",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "CanvasElements");

            migrationBuilder.DropColumn(
                name: "Body",
                table: "CanvasElements");

            migrationBuilder.DropColumn(
                name: "Headers",
                table: "CanvasElements");

            migrationBuilder.DropColumn(
                name: "Port",
                table: "CanvasElements");

            migrationBuilder.DropColumn(
                name: "Request",
                table: "CanvasElements");
        }
    }
}
