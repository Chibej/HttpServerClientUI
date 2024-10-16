namespace HttpServerClientUI.Server.Models
{
    public class SendMessageRequest
    {
        public string Address { get; set; }
        public int Port { get; set; }
        public string Headers { get; set; }
        public string Body { get; set; }
    }

}
