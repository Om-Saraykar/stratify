"use client";

import * as React from "react";
import {
  IconNotes,
  IconChecklist,
  IconCalendar,
  IconNotebook,
  IconSettings,
  IconSparkles,
  IconBulb,
  IconInnerShadowTop,
} from "@tabler/icons-react";

import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/dashboard/nav-user";
import { Session } from "next-auth";
import { useTransition } from "react";
import { useDashboardLoading } from "@/lib/use-dashboard-loading";

interface AppSidebarProps
  extends Omit<React.ComponentProps<typeof Sidebar>, "onSelect"> {
  session: Session | null;
}

const navMain = [
  { title: "Notes", icon: IconNotes, path: "/dashboard/notes" },
  { title: "Tasks", icon: IconChecklist, path: "/dashboard/tasks" },
  { title: "Journal", icon: IconNotebook, path: "/dashboard/journal" },
  { title: "Calendar", icon: IconCalendar, path: "/dashboard/calendar" },
];

const navSecondary = [
  { title: "AI Chat", icon: IconSparkles, path: "/dashboard/ai-chat" },
  // { title: "Settings", icon: IconSettings, path: "/dashboard/settings" },
];

export function AppSidebar({ session, ...props }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { setLoading } = useDashboardLoading();

  const user = session?.user;
  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "guest@example.com";
  const userAvatar = user?.image || "";

  const isActive = (path: string) => pathname === path;

  const navigate = (path: string) => {
    if (pathname !== path) {
      setLoading(true);
      startTransition(() => {
        router.push(path);
      });
    }
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Stratify</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                data-active={isActive(item.path)}
                className={`cursor-pointer ${isActive(item.path)
                    ? "bg-muted text-primary"
                    : "hover:bg-muted/50"
                  }`}
              >
                <item.icon className="size-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarMenu className="mt-6 border-t pt-4">
          {navSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                data-active={isActive(item.path)}
                className={`cursor-pointer ${isActive(item.path)
                    ? "bg-muted text-primary"
                    : "hover:bg-muted/50"
                  }`}
              >
                <item.icon className="size-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: userName,
            email: userEmail,
            avatar: userAvatar,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
