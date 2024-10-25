"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Eye } from "lucide-react";
import { format } from "date-fns";

interface HistoryEntry {
  id: string;
  timestamp: string;
  audio_uri: string;
  transcript: string;
  query: string;
  retrieved_chunks: string[];
  response: string;
  config: Record<string, any>;
}

export function History() {
  const [selectedChunks, setSelectedChunks] = useState<string[] | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<Record<string, any> | null>(
    null
  );

  // Simulated data - replace with actual Supabase fetch
  const historyData: HistoryEntry[] = [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      audio_uri: "gs://bucket/audio1.wav",
      transcript: "Example transcript",
      query: "Sample query",
      retrieved_chunks: [
        "Relevant chunk 1",
        "Relevant chunk 2",
        "Relevant chunk 3",
      ],
      response: "AI response to the query",
      config: {
        model: "gpt-4",
        temperature: 0.7,
        max_tokens: 150,
      },
    },
    // Add more entries as needed
  ];

  const exportToCsv = () => {
    const headers = [
      "Timestamp",
      "Audio URI",
      "Transcript",
      "Query",
      "Retrieved Chunks",
      "Response",
      "Config",
    ];

    const csvContent = [
      headers.join(","),
      ...historyData.map((entry) => [
        entry.timestamp,
        entry.audio_uri,
        `"${entry.transcript.replace(/"/g, '""')}"`,
        `"${entry.query.replace(/"/g, '""')}"`,
        `"${entry.retrieved_chunks.join("; ").replace(/"/g, '""')}"`,
        `"${entry.response.replace(/"/g, '""')}"`,
        `"${JSON.stringify(entry.config).replace(/"/g, '""')}"`,
      ].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `retrieval_history_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={exportToCsv}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Audio URI</TableHead>
              <TableHead>Transcript</TableHead>
              <TableHead>Query</TableHead>
              <TableHead>Retrieved Chunks</TableHead>
              <TableHead>Response</TableHead>
              <TableHead>Config</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {format(new Date(entry.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {entry.audio_uri}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {entry.transcript}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {entry.query}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedChunks(entry.retrieved_chunks)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> View Chunks
                  </Button>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {entry.response}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedConfig(entry.config)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> View Config
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={selectedChunks !== null}
        onOpenChange={() => setSelectedChunks(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Retrieved Chunks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedChunks?.map((chunk, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-muted"
              >
                {chunk}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedConfig !== null}
        onOpenChange={() => setSelectedConfig(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuration</DialogTitle>
          </DialogHeader>
          <pre className="p-4 rounded-lg bg-muted overflow-auto">
            {JSON.stringify(selectedConfig, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}