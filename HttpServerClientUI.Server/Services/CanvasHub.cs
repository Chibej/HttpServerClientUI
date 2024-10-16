namespace HttpServerClientUI.Server.Services
{
    using Microsoft.AspNetCore.SignalR;

    public class CanvasHub : Hub
    {
        // Send message to all connected clients
        public async Task UpdateServerRequest(string serverId, string message)
        {
            await Clients.All.SendAsync("ReceiveServerRequest", serverId, message);
        }
    }
}
