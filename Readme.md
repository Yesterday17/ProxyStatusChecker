# ProxyStatusChecker

## Docker

```bash
docker pull yesterday17/proxy-status-checker
docker run --name status-checker --env SERVER_IP="YOUR_IP_HERE" --env TCP_RANGE="YOUR_TCP_PORT_RANGE_HERE" -p=8888:8080 -d yesterday17/proxy-status-checker
```

## TCP Port Range

Follow the style below:

```
from_1-to_1;from_2-to_2;single_port_1;single_port_2
```
