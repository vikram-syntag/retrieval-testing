"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, Square, Play, Download, Upload, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documentProgress, setDocumentProgress] = useState(0);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        uploadToGCS(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start recording. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const uploadToGCS = async (blob: Blob) => {
    setUploading(true);
    try {
      // Implement GCS upload logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated upload
      toast({
        title: "Success",
        description: "Audio uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload audio",
        variant: "destructive",
      });
    }
    setUploading(false);
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setDocumentProgress(0);
    const fileArray = Array.from(files);
    
    for (let i = 0; i < fileArray.length; i++) {
      const progress = ((i + 1) / fileArray.length) * 100;
      setDocumentProgress(progress);
      
      // Simulate document processing
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadedDocs(prev => [...prev, fileArray[i].name]);
    }

    toast({
      title: "Success",
      description: `${fileArray.length} documents processed successfully`,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Retrieval Testing</CardTitle>
          <CardDescription>
            Record an audio clip to test the retrieval system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className="w-full"
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4 mr-2" /> Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" /> Start Recording
                </>
              )}
            </Button>
          </div>

          {audioUrl && (
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => {
                  const audio = new Audio(audioUrl);
                  audio.play();
                }}
              >
                <Play className="w-4 h-4 mr-2" /> Play
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = audioUrl;
                  a.download = "recording.wav";
                  a.click();
                }}
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>
            Upload documents for vectorization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            multiple
            onChange={handleDocumentUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" /> Upload Documents
          </Button>

          {documentProgress > 0 && documentProgress < 100 && (
            <div className="space-y-2">
              <Progress value={documentProgress} />
              <div className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing documents...
              </div>
            </div>
          )}

          {uploadedDocs.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Processed Documents:</h3>
              <ul className="space-y-1">
                {uploadedDocs.map((doc, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}