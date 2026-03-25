import socket
import requests
from concurrent.futures import ThreadPoolExecutor

def scan_node(ip):
    try:
        # Pinging the A2A standard port
        response = requests.get(f"http://{ip}:8080/.well-known/agent.json", timeout=0.5)
        if response.status_code == 200:
            print(f"✅ Liquid Node Found: {ip}")
            return ip
    except:
        return None

def find_my_mesh():
    # Automatically get local IP range (e.g., 192.168.1.0/24)
    local_ip_prefix = ".".join(socket.gethostbyname(socket.gethostname()).split('.')[:-1])
    print(f"🔍 SEO Agent: Scanning network {local_ip_prefix}.x...")
    
    with ThreadPoolExecutor(max_workers=50) as executor:
        ips = [f"{local_ip_prefix}.{i}" for i in range(1, 255)]
        results = list(executor.map(scan_node, ips))
    
    active_nodes = [ip for ip in results if ip]
    return active_nodes

if __name__ == "__main__":
    nodes = find_my_mesh()
    with open("active_mesh.txt", "w") as f:
        f.write(",".join(nodes))
