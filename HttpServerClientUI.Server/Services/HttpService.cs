using Microsoft.AspNetCore.SignalR;
using System.Net;

namespace HttpServerClientUI.Server.Services
{
    public class HttpService
    {
        private readonly Dictionary<string, HttpListener> _listeners = new(); // Track all running servers
        private readonly HttpClient _httpClient = new HttpClient(); // Single client for making HTTP requests
        private readonly IHubContext<CanvasHub> _hubContext;

        public HttpService(IHubContext<CanvasHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public void StartServer(string address, int port)
        {
            string url = $"http://{address}:{port}/";

            if (!_listeners.ContainsKey(url))
            {
                var listener = new HttpListener();
                listener.Prefixes.Add(url);
                listener.Start();
                _listeners[url] = listener;

                Task.Run(() => HandleIncomingRequests(listener));

                Console.WriteLine($"HTTP server started on {url}");
            }
            else
            {
                Console.WriteLine($"Server is already running on {url}");
            }
        }

        public void StopServer(string address, int port)
        {
            string url = $"http://{address}:{port}/";
            if (_listeners.ContainsKey(url))
            {
                _listeners[url].Stop();
                _listeners[url].Close();
                _listeners.Remove(url);
                Console.WriteLine($"HTTP server stopped on {url}");
            }
        }

        public async Task SendMessage(string address, int port, string headers, string body)
        {
            var outboundUrl = $"http://{address}:{port}/";

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, outboundUrl)
            {
                Content = new StringContent(body)
            };
            System.Diagnostics.Debug.WriteLine("test");
            // Parse headers from string to dictionary
            var parsedHeaders = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, string>>(headers);
            // Handle Content-Type header separately

            if (parsedHeaders.TryGetValue("Content-Type", out var contentType))
            {
                requestMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(contentType);
                parsedHeaders.Remove("Content-Type"); // Remove it so we don't add it to regular headers
            }
            foreach (var header in parsedHeaders)
            {
                requestMessage.Headers.Add(header.Key, header.Value);
            }

            var response = await _httpClient.SendAsync(requestMessage);
            var responseBody = await response.Content.ReadAsStringAsync();

            System.Diagnostics.Debug.WriteLine($"Message sent to {outboundUrl}. Response: {responseBody}");
        }

        private async Task HandleIncomingRequests(HttpListener listener)
        {
            while (listener.IsListening)
            {
                var context = await listener.GetContextAsync();
                var request = context.Request;
                var response = context.Response;

                string messageBody = new StreamReader(request.InputStream).ReadToEnd();
                messageBody = messageBody.Replace("\r\n", " ").Replace("\n", " ");

                var address = context.Request.UserHostName.Split(":")[0];
                var port = context.Request.UserHostName.Split(":")[1];
                await _hubContext.Clients.All.SendAsync("ReceiveServerRequest", address, port, messageBody);

                // Send response back to client
                var buffer = System.Text.Encoding.UTF8.GetBytes("Request received successfully!");
                response.ContentLength64 = buffer.Length;
                await response.OutputStream.WriteAsync(buffer, 0, buffer.Length);
                response.OutputStream.Close();
            }
        }
    }

}
