"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  defaultTab?: string;
  children: React.ReactNode;
}

interface TabContentProps {
  id: string;
  children: React.ReactNode;
}

export function Tabs({ tabs, defaultTab, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const contents = React.Children.toArray(children).reduce(
    (acc, child: any) => {
      if (child.type?.displayName === "TabContent") {
        acc[child.props.id] = child.props.children;
      }
      return acc;
    },
    {} as Record<string, React.ReactNode>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-border">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2",
                activeTab === tab.id
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="py-4">{contents[activeTab]}</div>
    </div>
  );
}

function TabContent({ id, children }: TabContentProps) {
  return <>{children}</>;
}
TabContent.displayName = "TabContent";

Tabs.Content = TabContent;
