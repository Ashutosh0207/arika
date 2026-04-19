import type { NextConfig } from "next";

function storageRemotePatterns(): NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) {
    return [];
  }
  try {
    const u = new URL(raw);
    const protocol =
      u.protocol === "http:"
        ? ("http" as const)
        : u.protocol === "https:"
          ? ("https" as const)
          : ("https" as const);
    return [
      {
        protocol,
        hostname: u.hostname,
        port: u.port === "" ? undefined : u.port,
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: storageRemotePatterns(),
  },
};

export default nextConfig;
