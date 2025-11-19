/**
 * DNS resolution utilities
 * Uses Caido backend modules for DNS resolution
 */

import dns from "dns";

function lookup(host: string, family: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    dns.lookup(host, { family, all: true }, (err, addresses) => {
      if (err) reject(err);
      resolve(addresses.map((address) => address.address));
    });
  });
}

/**
 * Resolve a hostname to IP addresses
 * Returns array of IP addresses (both IPv4 and IPv6)
 */
export async function resolveHost(host: string): Promise<string[]> {
  console.log(`[SURF - DNS] resolveHost: Resolving ${host}`);
  try {
    console.log(
      `[SURF - DNS] resolveHost: Using dns/promises module for ${host}`,
    );

    // Try to resolve both IPv4 and IPv6
    const [ipv4, ipv6] = await Promise.allSettled([
      lookup(host, 4),
      lookup(host, 6),
    ]);

    const ips: string[] = [];

    if (ipv4.status === "fulfilled") {
      ips.push(...ipv4.value);
      console.log(
        `[SURF - DNS] resolveHost: ${host} IPv4 lookup succeeded: ${ips.length} address(es)`,
      );
    } else {
      console.log(
        `[SURF - DNS] resolveHost: ${host} IPv4 lookup failed: ${ipv4.reason}`,
      );
    }

    if (ipv6.status === "fulfilled") {
      ips.push(...ipv6.value);
      console.log(`[SURF - DNS] resolveHost: ${host} IPv6 lookup succeeded`);
    } else {
      console.log(
        `[SURF - DNS] resolveHost: ${host} IPv6 lookup failed: ${ipv6.reason}`,
      );
    }

    if (ips.length > 0) {
      console.log(
        `[SURF - DNS] resolveHost: ${host} resolved to ${
          ips.length
        } IP(s): ${ips.join(", ")}`,
      );
    }
    return ips;
  } catch (error) {
    console.log(
      `[SURF - DNS] resolveHost: ${host} resolution error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
    return [];
  }
}
