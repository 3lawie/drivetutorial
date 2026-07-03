import "~/styles/globals.css";
import { type Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { PostHogProvider } from "./_providers/posthog-provider";
import { Toaster } from "sonner";
import { NavigationProgress } from "~/components/navigation-progress";

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
      {/* MUST be lowercase html and body */}
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <NavigationProgress />
          <PostHogProvider>
            {children}
          </PostHogProvider>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(225 10% 14%)",
                border: "1px solid hsl(225 10% 20%)",
                color: "hsl(0 0% 85%)",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}