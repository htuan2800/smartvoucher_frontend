import {
  ChevronDown,
  Search,
  Settings,
  Wand2,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { sidebarItems } from "./SidebarItem"

interface SidebarProps {
  sidebarOpen: boolean;
  toggleExpanded: (title: string) => void
  isActivePath: (path: string) => boolean
  handleNavClick: (path: string) => void
  expandedItems: Record<string, boolean>;
}
const SidebarDesktop = ({ sidebarOpen, expandedItems, toggleExpanded, isActivePath, handleNavClick }: SidebarProps) => {

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:block",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl from-purple-600 to-blue-600 text-white">
              <Wand2 className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Designali</h2>
              <p className="text-xs text-muted-foreground">Creative Suite</p>
            </div>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2" />
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.title} className="mb-1">
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                    isActivePath(item.path) ? "bg-primary/10 text-primary" : "hover:bg-muted",
                  )}
                  onClick={() => {
                    if (item.items) {
                      toggleExpanded(item.title)
                    } else {
                      handleNavClick(item.path)
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {/* {item.badge && (
                      <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
                        {item.badge}
                      </Badge>
                    )} */}
                  {item.items && (
                    <ChevronDown
                      className={cn(
                        "ml-2 h-4 w-4 transition-transform",
                        expandedItems[item.title] ? "rotate-180" : "",
                      )}
                    />
                  )}
                </button>

                {item.items && expandedItems[item.title] && (
                  <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                    {item.items.map((subItem) => (
                      <button
                        key={subItem.title}
                        className={cn(
                          "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm",
                          isActivePath(subItem.path) ? "bg-primary/10 text-primary" : "hover:bg-muted",
                        )}
                        onClick={() => handleNavClick(subItem.path)}
                      >
                        {subItem.title}
                        {/* {subItem.badge && (
                            <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
                              {subItem.badge}
                            </Badge>
                          )} */}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-3">
          <div className="space-y-1">
            <button
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => handleNavClick("/settings")}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span>John Doe</span>
              </div>
              <Badge variant="outline" className="ml-auto">
                Pro
              </Badge>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarDesktop