import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Play,
  Square,
  Upload,
  Trash2,
  Download,
  Volume2,
  Loader2,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User
} from 'lucide-react';
import SiriWave from 'react-siriwave';
import WavEncoder from 'wav-encoder';

interface RecordingSession {
  id: string;
  audioURL: string;
  audioBlob: Blob;
  transcript: string;
  timestamp: Date;
  duration: number;
  status: 'processing' | 'completed' | 'error';
}

const BookAppointment = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<RecordingSession[]>([]);
  const [currentRecording, setCurrentRecording] = useState<RecordingSession | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Add Siri wave states
  const [waveAmplitude, setWaveAmplitude] = useState(0.1);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const animationFrame = useRef<number | null>(null);

  // Audio level monitoring for Siri wave
  const monitorAudioLevel = () => {
    if (!analyser.current) return;

    const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
    analyser.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = average / 255;

    setAudioLevel(normalizedLevel);
    setWaveAmplitude(normalizedLevel * 3 + 0.1); // Scale amplitude for visual effect

    if (isRecording) {
      animationFrame.current = requestAnimationFrame(monitorAudioLevel);
    }
  };

  // Recording duration timer
  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
      setRecordingDuration(0);
    }

    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const startRecording = async () => {
    try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleRate: 44100
            }
        });

        // Set up audio analysis for Siri wave
        audioContext.current = new AudioContext();
        const source = audioContext.current.createMediaStreamSource(stream);
        analyser.current = audioContext.current.createAnalyser();
        analyser.current.fftSize = 256;
        source.connect(analyser.current);

        // Start monitoring audio level
        monitorAudioLevel();

        const mimeType = 'audio/webm';
        mediaRecorder.current = new MediaRecorder(stream, { mimeType });

        mediaRecorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.current.push(event.data);
            }
        };

        mediaRecorder.current.onstop = async () => {
            const audioBlob = new Blob(audioChunks.current, { type: mimeType });
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await audioContext.current!.decodeAudioData(arrayBuffer);

            const wavData = await WavEncoder.encode({
                sampleRate: audioBuffer.sampleRate,
                channelData: [audioBuffer.getChannelData(0)]
            });

            const wavBlob = new Blob([wavData], { type: 'audio/wav' });
            const url = URL.createObjectURL(wavBlob);

            const newRecording: RecordingSession = {
                id: generateId(),
                audioURL: url,
                audioBlob: wavBlob,
                transcript: '',
                timestamp: new Date(),
                duration: recordingDuration,
                status: 'processing'
            };

            setCurrentRecording(newRecording);
            setRecordings(prev => [newRecording, ...prev]);
            audioChunks.current = [];

            stream.getTracks().forEach(track => track.stop());

            // Clean up audio analysis
            if (animationFrame.current) {
              cancelAnimationFrame(animationFrame.current);
            }
            if (audioContext.current) {
              audioContext.current.close();
            }
            setWaveAmplitude(0.1);

            await processAudio(wavBlob, newRecording.id);
        };

        mediaRecorder.current.start(1000);
        setIsRecording(true);
    } catch (error) {
        console.error("Error starting recording:", error);
        setError("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);

      // Clean up audio monitoring
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    }
  };

  const processAudio = async (audioBlob: Blob, recordingId: string) => {
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const wavBlob = await convertToWav(audioBlob);

      const formData = new FormData();
      formData.append('audio', wavBlob, 'recording.wav');

      const response = await fetch('http://localhost/api/speech-to-text/api/speech-to-text/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setRecordings(prev =>
        prev.map(recording =>
          recording.id === recordingId
            ? { ...recording, transcript: data.transcript, status: 'completed' }
            : recording
        )
      );

      if (currentRecording?.id === recordingId) {
        setCurrentRecording(prev => prev ? { ...prev, transcript: data.transcript, status: 'completed' } : null);
      }

    } catch (error) {
      console.error("Error processing audio:", error);
      setError("Failed to process audio. Please try again. Make sure the API server is running on port 8000.");

      setRecordings(prev =>
        prev.map(recording =>
          recording.id === recordingId
            ? { ...recording, status: 'error' }
            : recording
        )
      );
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    if (audioBlob.type === 'audio/wav') {
      return audioBlob;
    }
    return new Blob([audioBlob], { type: 'audio/wav' });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError("Please select an audio file.");
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);

    const newRecording: RecordingSession = {
      id: generateId(),
      audioURL: url,
      audioBlob: file,
      transcript: '',
      timestamp: new Date(),
      duration: 0,
      status: 'processing'
    };

    setCurrentRecording(newRecording);
    setRecordings(prev => [newRecording, ...prev]);

    await processAudio(file, newRecording.id);
  };

  const playAudio = (audioURL: string) => {
    const audio = new Audio(audioURL);
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
      setError("Unable to play audio.");
    });
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => {
      const recording = prev.find(r => r.id === id);
      if (recording) {
        URL.revokeObjectURL(recording.audioURL);
      }
      return prev.filter(r => r.id !== id);
    });

    if (currentRecording?.id === id) {
      setCurrentRecording(null);
    }
  };

  const downloadRecording = (recording: RecordingSession) => {
    const link = document.createElement('a');
    link.href = recording.audioURL;
    link.download = `recording-${recording.timestamp.toISOString().slice(0, 10)}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Voice Appointment Booking
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium">
            Record your appointment request or upload an audio file. Our AI will transcribe and process your booking.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/40 text-red-100">
            <XCircle className="h-4 w-4 text-red-300" />
            <AlertDescription className="text-red-100 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recording Controls with Siri Wave */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center space-x-2 text-white">
                <Mic className="h-5 w-5 text-blue-400" />
                <span className="text-lg font-semibold">Voice Recording</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">

              {/* Siri Wave Visualization */}
              <div className="mb-6">
                <div className="h-32 relative overflow-hidden rounded-lg bg-black/30 flex items-center justify-center">
                  <div className="w-full h-full relative">
                    <SiriWave
                      theme="ios9"
                      ratio={2}
                      speed={0.2}
                      amplitude={isRecording ? waveAmplitude : 0.1}
                      frequency={6}
                      color="#ffffff"
                      cover={true}
                      width={600}
                      height={128}
                      autostart={true}
                      pixelDepth={0.02}
                      lerpSpeed={0.01}
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

                    {/* Recording status indicator */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <Badge
                        variant="outline"
                        className={`${
                          isRecording
                            ? 'bg-red-500/20 text-red-200 border-red-400/60'
                            : 'bg-gray-500/20 text-gray-200 border-gray-400/60'
                        } px-3 py-1`}
                      >
                        {isRecording ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                            <span className="font-medium">Recording: {formatDuration(recordingDuration)}</span>
                          </div>
                        ) : (
                          <span className="font-medium">Ready to Record</span>
                        )}
                      </Badge>
                    </div>

                    {/* Audio level indicator */}
                    {isRecording && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 rounded-full transition-all duration-100 ${
                                audioLevel * 5 > i ? 'bg-white h-4' : 'bg-white/30 h-2'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Record Button */}
              <div className="text-center">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  size="lg"
                  className={`${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25'
                      : 'bg-green-500 hover:bg-green-600 shadow-green-500/25'
                  } text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg`}
                >
                  {isRecording ? (
                    <>
                      <Square className="mr-2 h-5 w-5" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-5 w-5" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>

              {/* File Upload */}
              <div className="border-t border-white/20 pt-6">
                <Label className="block text-gray-200 mb-3 font-medium">Or upload an audio file:</Label>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/20 bg-white/10 font-medium"
                    disabled={isProcessing}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Processing Status */}
              {isProcessing && (
                <div className="space-y-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center space-x-2 text-blue-200">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="font-medium">Processing audio...</span>
                  </div>
                  {uploadProgress > 0 && (
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Transcript */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center space-x-2 text-white">
                <Volume2 className="h-5 w-5 text-purple-400" />
                <span className="text-lg font-semibold">Latest Transcript</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {currentRecording ? (
                <div className="space-y-4">
                  {/* Audio Player */}
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => playAudio(currentRecording.audioURL)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <div className="text-sm text-gray-200 font-medium">
                        {currentRecording.timestamp.toLocaleTimeString()}
                        {currentRecording.duration > 0 && (
                          <span className="ml-2 text-gray-300">({formatDuration(currentRecording.duration)})</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => downloadRecording(currentRecording)}
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/20 bg-white/10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Transcript */}
                  <div>
                    <Label className="block text-gray-200 mb-2 font-medium">Transcript:</Label>
                    <div className="relative">
                      <Textarea
                        value={currentRecording.transcript || 'Processing...'}
                        readOnly
                        className="bg-white/10 border-white/30 text-gray-100 min-h-[120px] resize-none font-medium placeholder:text-gray-400"
                        placeholder="Your transcribed text will appear here..."
                      />
                      <div className="absolute top-2 right-2">
                        {currentRecording.status === 'processing' && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                        )}
                        {currentRecording.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                        {currentRecording.status === 'error' && (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-300">
                  <Mic className="h-12 w-12 mx-auto mb-4 opacity-60" />
                  <p className="font-medium">No recordings yet. Start recording or upload a file to see the transcript.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recording History */}
        {recordings.length > 0 && (
          <Card className="mt-8 bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center space-x-2 text-white">
                <Clock className="h-5 w-5 text-orange-400" />
                <span className="text-lg font-semibold">Recording History</span>
                <Badge variant="outline" className="ml-auto bg-white/10 text-gray-200 border-white/30">
                  {recordings.length} recording{recordings.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      currentRecording?.id === recording.id
                        ? 'bg-blue-500/20 border-blue-400/50'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <Button
                            onClick={() => playAudio(recording.audioURL)}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 flex-shrink-0 text-white"
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                          <div className="text-sm text-gray-200 font-medium">
                            {recording.timestamp.toLocaleString()}
                            {recording.duration > 0 && (
                              <span className="ml-2 text-gray-300">({formatDuration(recording.duration)})</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {recording.status === 'processing' && (
                              <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                            )}
                            {recording.status === 'completed' && (
                              <CheckCircle className="h-3 w-3 text-green-400" />
                            )}
                            {recording.status === 'error' && (
                              <XCircle className="h-3 w-3 text-red-400" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-200 truncate font-medium">
                          {recording.transcript || 'Processing...'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          onClick={() => setCurrentRecording(recording)}
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/20 bg-white/10 font-medium"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => downloadRecording(recording)}
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/20 bg-white/10"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => deleteRecording(recording.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-400/40 text-red-300 hover:bg-red-500/20 bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        {currentRecording?.transcript && currentRecording.status === 'completed' && (
          <Card className="mt-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <h3 className="text-lg font-semibold text-green-300">Ready to Book</h3>
              </div>
              <p className="text-gray-200 mb-4 font-medium">
                Your appointment request has been transcribed successfully. You can now proceed with booking.
              </p>
              <div className="flex space-x-4">
                <Button className="bg-green-500 hover:bg-green-600 text-white font-medium shadow-lg">
                  <Calendar className="mr-2 h-4 w-4" />
                  Process Booking
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 bg-white/10 font-medium">
                  <User className="mr-2 h-4 w-4" />
                  Review Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
