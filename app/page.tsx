"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Recorder } from "@/components/recorder";
import { History } from "@/components/history";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="recorder" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="recorder">Recorder</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recorder">
          <Recorder />
        </TabsContent>
        
        <TabsContent value="history">
          <History />
        </TabsContent>
      </Tabs>
    </div>
  );
}