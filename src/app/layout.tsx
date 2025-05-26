import "~/styles/globals.css";
import { type Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { env } from "~/env.js";
import { PostHogProvider } from "./_providers/posthog-provider";

export const metadata: Metadata = {
  title: "Drive Tutorial",
  description: "It's like Google Drive but worse!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}