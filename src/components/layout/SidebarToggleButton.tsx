import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SidebarToggleButton({ className, ...rest }: { className?: string } & React.HTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={cn(
        "absolute top-9 right-0 translate-x-1/2 z-50",
        "h-8 w-8 rounded-full border border-orange-500 bg-white hover:!bg-white focus:!bg-white active:!bg-white",
        className
      )}
      {...rest}
    >
      {open ? (
        <ChevronLeft className="h-4 w-4 text-orange-500" />
      ) : (
        <ChevronRight className="h-4 w-4 text-orange-500" />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
