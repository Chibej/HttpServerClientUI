HttpServerClientUI
Overview
HttpServerClientUI is a .NET 8 application with a React-based drag-and-drop UI for configuring and managing HTTP servers and clients. The application allows users to:

Set up HTTP server/client parameters using a visual drag-and-drop interface.
Configure communication between clients and servers through real-time messaging using SignalR.
Save configurations to SQLite and load them upon reopening the app.
Discard configurations and reset to default states as needed.
Prerequisites
Before setting up the project, ensure you have the following installed:

.NET 8 SDK - Required for building and running the backend.
Node.js - Required for running the React frontend.
SQLite Browser - For browsing and inspecting the SQLite database used for saving configurations.
A modern web browser
Packages
Id	Versions
Microsoft.AspNetCore.SpaProxy	8.0.10
Microsoft.EntityFrameworkCore.Sqlite	8.0.0
Swashbuckle.AspNetCore	6.4.0
Newtonsoft.Json	13.0.3
Microsoft.EntityFrameworkCore.Design	8.0.0
---------------------------------------	----------
Key Dependencies
React and React DOM: react, react-dom - Core libraries for building the user interface.
Vite and React plugin for Vite: vite, @vitejs/plugin-react - Fast development server and build tool for the React app.
ESLint for code quality: eslint, eslint-plugin-react - Ensures consistent coding style and catches common errors.
Drag-and-drop functionality: react-dnd, react-dnd-html5-backend - Enables the drag-and-drop interface for server and client configuration.
Real-time communication: @microsoft/signalr - Facilitates real-time messaging between the HTTP client and server.
Installation and Setup
Clone the repository: git clone https://github.com/Chibej/HttpServerClientUI.git cd your-repo-name
Backend setup Navigate to the backend project folder: cd HttpServerClientUI/Backend

Restore the .NET dependencies: dotnet restore

Build and run the server: dotnet run

The backend will run at https://localhost:7150.

Frontend setup Navigate to the React frontend folder: cd HttpServerClientUI/Frontend

Install the dependencies: npm install

Start the development server: npm run dev

The app will be accessible at https://localhost:5173.

Running the Application Starting the backend server: After building, navigate to the published backend directory and run: dotnet YourProjectName.dll

Starting the frontend: After building, serve the dist folder using a static server like serve or configure your web server to serve the built files.

Features
Drag-and-Drop Configuration: Easily configure HTTP servers and clients by dragging them onto a canvas. Set parameters like inbound and outbound addresses and ports.

Real-Time Messaging: Clients and servers can communicate in real-time using SignalR, allowing for instant data exchange.

Save and Load Configurations: Save your current server and client setup to an SQLite database, and load it automatically when you reopen the app.

Discard Changes: Reset the current configuration to a default state when needed.

Adding and Configuring Servers/Clients
Drag server and client elements from the sidebar onto the canvas.
Configure their inbound and outbound settings using the input fields.
Attach clients to servers by dragging them close to each other until they snap into place.
Sending Messages
Enter a message body in the client’s input field and click 'Send' to transmit it to the connected server.
The server displays incoming messages with a timestamp in the 'Received' section.
Saving and Loading Configurations
Click 'Save' to store the current setup.
When the app starts, it automatically loads the last saved configuration.
