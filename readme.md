# Network Scanner nmap GUI

Network Scanner is a web-based application that scans a given network range to detect devices and their open ports with nmap. It provides an easy-to-use interface for network scanning and displays detailed information about discovered devices.

![Image](/media/scanner-b.gif) 

## Features

- Scan network ranges to discover devices.
- Detect open ports and services on the discovered devices.
- Display detailed information including IP address, hostname, state, and port details.
- Lightweight and packaged with Docker.

## Technologies Used

- Frontend: React
- Backend: FastAPI
- Network Scanning: Nmap
- Containerization: Docker

## Prerequisites

- Docker

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/network-scanner.git
    cd network-scanner
    ```

2. Build and run the Docker containers:
    ```bash
    docker build -t network-scanner .
    docker run -p 80:80 -p 8000:8000 -d --name NETSCAN network-scanner
    ```
    or use ready image ghcr.io/securityphoton/nmap-gui:
    ```bash
    docker run -p 80:80 -p 8000:8000 -d --name NETSCAN ghcr.io/securityphoton/nmap-gui
    ```

3. Open your browser and navigate to `http://localhost:80` to access the application. Or you can change the default 80 port to your preference (for ex. 8080 -> 8080:80)

## Usage

1. Enter the IP range you want to scan (e.g., `192.168.1.0/24`) in the input field.
2. Select the type of scan from the dropdown (Discovery Scan, Most Common Ports, All Ports, Custom).
Most Common ports include - 21,22,23,25,53,80,110,139,143,443,445,3389,8080,8443.
3. Click the "Scan" button to initiate the scan.
4. View the scan results, which include detailed information about each discovered device.

## Project Structure

- `frontend/`: Contains the React frontend source code.
- `backend/`: Contains the FastAPI backend source code.
- `Dockerfile`: Dockerfile for building the Docker image.
- `nginx.conf`: Nginx global configuration file.
- `default.conf`: Nginx configuration file for app.

## Example Response

```json
{
  "message": "Network scan completed for range: 192.168.1.0/24",
  "hosts": [
    {
      "ip": "192.168.1.1",
      "hostname": "",
      "state": "up",
      "protocols": [
        {
          "protocol": "tcp",
          "ports": [
            {
              "port": 80,
              "state": "open",
              "name": "http",
              "product": "nginx",
              "version": "1.18.0",
              "extrainfo": ""
            },
            {
              "port": 443,
              "state": "open",
              "name": "https",
              "product": "nginx",
              "version": "1.18.0",
              "extrainfo": ""
            }
          ]
        }
      ]
    }
  ]
}
```

## Development

To start the development server for the frontend and backend:

### Frontend

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

The React app will be running at `http://localhost:3000`.

### Backend

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Start the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```

The FastAPI server will be running at `http://localhost:8000`.

### Building docker image

To build docker image run in project folder:
    ```bash
    docker build -t network-scanner .
    ```


## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any changes.

## License

This project is licensed under the MIT License.
