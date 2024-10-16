namespace HttpServerClientUI.Server.Models
{
    public class CanvasElement
    {
        public long Id { get; set; }
        public string ElementType { get; set; }
        public int PositionX { get; set; }
        public int PositionY { get; set; }
        public string Address { get; set; }
        public int Port { get; set; }
        public string Request { get; set; }
        public string Body { get; set; }
        public string CurrentCells { get; set; }
        public string AdditionalSettings { get; set; }
    }

}
