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
  className?: string;
}

export function Tabs({ tabs, defaultTab, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  // Filter and map children to tab contents
  const tabContents = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<TabContentProps> =>
        React.isValidElement(child) && child.type === TabContent
    )
    .reduce((acc, child) => {
      acc[child.props.id] = child.props.children;
      return acc;
    }, {} as Record<string, React.ReactNode>);

  return (
    <div className="flex flex-col h-full">
      {/* Tab Headers */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-4 px-4 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0",
                activeTab === tab.id
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          {tabContents[activeTab] || (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No content available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabContent({ id, children, className }: TabContentProps) {
  return (
    <div id={`tab-${id}`} role="tabpanel" className={cn("h-full", className)}>
      {children}
    </div>
  );
}

Tabs.Content = TabContent;
