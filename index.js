const tcping = require("tcp-ping");
const ping = require("ping");

/**
 * IP: xxx.xxx.xxx.xxx
 * TCP Ports: xxx-xxx;xxx-xxx;xxx
 */
module.exports = function(ip, tcports, cb_pingd) {
  const result = {
    ping: undefined,
    port_count: 0,
    ports: {}
  };
  let retry = 50;

  // ICMP Ping
  ping.sys.probe(ip, function(isAlive) {
    result.ping = isAlive;
  });

  // TCP Ping
  rangePorts(tcports, tcp_ping);

  function tcp_ping(port) {
    tcping.ping(
      { address: ip, port: port, attempts: 5, timeout: 2000 },
      (err, pr) => {
        if (err) {
          result.ports[port.toString()] = {
            ping: false,
            avg: NaN
          };
          console.err(err);
          return;
        }

        result.ports[port.toString()] = {
          ping: false,
          avg: isNaN(pr.avg)
            ? (rpt => {
                let ans = 0,
                  c = 0;
                for (const i of rpt.results) {
                  if (!isNaN(i.time)) {
                    ans += i.time;
                    c++;
                  }
                }
                return (ans / c).toFixed(2);
              })(pr)
            : pr.avg.toFixed(2)
        };
        if (
          result.ports[port.toString()].avg !== null &&
          !isNaN(result.ports[port.toString()].avg)
        ) {
          result.ports[port.toString()].ping = true;
        }
      }
    );
  }

  const check = setInterval(function() {
    retry--;
    if (retry > 0) {
      if (result.ping === undefined) return;
      for (const t in result.ports) {
        if (result.ports[t] === undefined) return;
      }
    }
    // Output
    cb_pingd(result);
    // console.log(JSON.stringify(result, null, 2));
    clearInterval(check);
  }, 5000);

  /**
   * Generate range object.
   * @param {*} rangeStr
   * @param {*} callback
   */
  function rangePorts(rangeStr, callback) {
    if (typeof rangeStr !== "string") return;

    for (const range of rangeStr.split(";")) {
      let port_range = range.split("-");
      if (port_range.length === 1) port_range = [port_range[0], port_range[0]];
      if (port_range.length !== 2) continue;

      let start = parseInt(port_range[0]),
        end = parseInt(port_range[1]);

      if (isNaN(start) || isNaN(end)) continue;
      if (start > end) {
        [start, end] = [end, start];
      }

      for (let i = start; i <= end; i++) {
        if (result.ports[i.toString()]) continue;

        result.port_count++;
        result.ports[i.toString()] = undefined;
        callback(i);
      }
    }
  }
};
