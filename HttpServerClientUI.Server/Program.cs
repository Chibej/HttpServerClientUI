using HttpServerClientUI.Server.Data;
using HttpServerClientUI.Server.Models;
using HttpServerClientUI.Server.Services;
using Microsoft.EntityFrameworkCore;
using System.Net;

var builder = WebApplication.CreateBuilder(args);
var frontendUrl = builder.Configuration["VITE_BASE_URL"] ?? "https://localhost:5173";
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register HttpService with the DI container
builder.Services.AddSingleton<HttpService>();
builder.Services.AddSignalR();

// Register DbContext with DI and use SQLite connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(frontendUrl)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});


var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseDefaultFiles();
app.UseStaticFiles();

var httpService = app.Services.GetRequiredService<HttpService>();

app.MapPost("/start-server", async (HttpContext context, HttpService httpService) =>
{
    var requestData = await context.Request.ReadFromJsonAsync<StartServerRequest>();

    if (requestData == null || string.IsNullOrWhiteSpace(requestData.Address) || requestData.Port <= 0)
    {
        return Results.BadRequest(new { success = false, message = "Invalid address or port" });
    }

    try
    {
        httpService.StartServer(requestData.Address, requestData.Port);
        return Results.Ok(new { success = true, message = $"Server started at http://{requestData.Address}:{requestData.Port}/" });
    }
    catch (HttpListenerException ex)
    {
        return Results.Problem(
            detail: $"{ex.Message}",
            statusCode: 500,
            title: "Server Start Error"
        );
    }
});


app.MapPost("/stop-server", async (HttpContext context) =>
{
    var requestData = await context.Request.ReadFromJsonAsync<StopServerRequest>();
    if (requestData == null || string.IsNullOrWhiteSpace(requestData.Address) || requestData.Port == 0)
    {
        return Results.BadRequest("Invalid address or port");
    }

    httpService.StopServer(requestData.Address, requestData.Port);
    return Results.Ok($"Server stopped at http://{requestData.Address}:{requestData.Port}/");
});


app.MapPost("/send-message", async (SendMessageRequest request, HttpService httpService) =>
{
    await httpService.SendMessage(request.Address, request.Port, request.Headers, request.Body);
    return Results.Ok($"Message sent to {request.Address}:{request.Port}");
});

app.MapHub<CanvasHub>("/canvasHub");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
