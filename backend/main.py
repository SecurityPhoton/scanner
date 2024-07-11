import nmap
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    ip_range: str
    scan_type: str

@app.get("/")
def read_root():
    logger.debug("Processing root request")
    return {"Hello": "World"}

@app.post("/scan-network")
def scan_network(request: ScanRequest):
    ip_range = request.ip_range
    scan_type = request.scan_type
    logger.debug("Processing scan request")
    
    if not ip_range:
        raise HTTPException(status_code=400, detail="Invalid IP range")
    

    nm = nmap.PortScanner()
    logger.debug("Scan type: %s",scan_type)

    if scan_type == "discovery":
        arguments='-sP'
    elif scan_type == "common_ports":
        arguments='-A -p 21,22,23,25,53,80,110,139,143,443,445,3389,8080,8443'
    elif scan_type == "all_ports":
        arguments='-A -p- -sU -sT'

    nm.scan(ip_range, arguments=arguments)
    logger.debug("Scan start: for %s type %s",scan_type,ip_range)

    hosts = []

    for host in nm.all_hosts():
        host_info = {
            'ip': host,
            'hostname': nm[host].hostname(),
            'state': nm[host].state(),
            'protocols': []
        }
        
        for proto in nm[host].all_protocols():
            ports = []
            for port in nm[host][proto].keys():
                port_info = {
                    'port': port,
                    'state': nm[host][proto][port]['state'],
                    'name': nm[host][proto][port].get('name', ''),
                    'product': nm[host][proto][port].get('product', ''),
                    'version': nm[host][proto][port].get('version', ''),
                    'extrainfo': nm[host][proto][port].get('extrainfo', ''),
                }
                ports.append(port_info)
            host_info['protocols'].append({'protocol': proto, 'ports': ports})
        
        hosts.append(host_info)
    
    logger.debug("Scan finished: for %s type %s",scan_type,ip_range)
    #hosts = [(x, nm[x]['status']['state'], nm[x].all_protocols()) for x in nm.all_hosts()]
    return {"message": f"Network scan completed for range: {ip_range}", "hosts": hosts}

# Add more routes as needed
