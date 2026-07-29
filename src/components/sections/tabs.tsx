"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SectionTabs() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="delivery">Delivery</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Premium foundation content goes here.</TabsContent>
      <TabsContent value="delivery">Systems, engineering, and scale readiness go here.</TabsContent>
    </Tabs>
  );
}