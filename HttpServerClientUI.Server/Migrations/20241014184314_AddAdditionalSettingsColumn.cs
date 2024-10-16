using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HttpServerClientUI.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAdditionalSettingsColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Y",
                table: "CanvasElements",
                newName: "PositionY");

            migrationBuilder.RenameColumn(
                name: "X",
                table: "CanvasElements",
                newName: "PositionX");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "CanvasElements",
                newName: "ElementType");

            migrationBuilder.AddColumn<string>(
                name: "AdditionalSettings",
                table: "CanvasElements",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalSettings",
                table: "CanvasElements");

            migrationBuilder.RenameColumn(
                name: "PositionY",
                table: "CanvasElements",
                newName: "Y");

            migrationBuilder.RenameColumn(
                name: "PositionX",
                table: "CanvasElements",
                newName: "X");

            migrationBuilder.RenameColumn(
                name: "ElementType",
                table: "CanvasElements",
                newName: "Type");
        }
    }
}
