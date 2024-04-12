"use client";

import { AccordionItem } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { IOrganization } from "@/types/organization";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import { Activity, CreditCard, Layout, Settings } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavItemProps {
  isActive: boolean;
  isExpanded: boolean;
  organization: IOrganization;
  onExpand: (id: string) => void;
}
const NavItem = ({
  isActive,
  isExpanded,
  organization,
  onExpand,
}: NavItemProps) => {
  const router = useRouter();

  const routes = [
    {
      label: "Boards",
      icon: <Layout className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: "Activity",
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/settings`,
    },
    {
      label: "Billing",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/billing`,
    },
  ];

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
          isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-7 h-7 relative">
            <Image
              fill
              src={organization.imageUrl}
              alt="organization"
              className="rounded-sm object-cover"
            />
          </div>
          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
};

export default NavItem;
