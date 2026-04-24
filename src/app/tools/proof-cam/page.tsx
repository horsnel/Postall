'use client';

import Link from "next/link";

import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { sampleTasks } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MagicLinkModal from '@/components/layout/magic-link-modal';
import {
  ChevronLeft,
  Camera,
  Upload,
  Download,
  Clock,
  MapPin,
  FileText,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImagePlus,
  Trash2,
  Info,
  CalendarClock,
  Compass,
  X,
  RefreshCw,
} from 'lucide-react';

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: string;
  locationNote: string;
  associatedTask: string;
}

export default function ProofCamPage() {
  const { user } = useAuthStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [hasCamera] = useState(() => {
    if (typeof navigator === 'undefined') return true;
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  });
  const [locationNote, setLocationNote] = useState('');
  const [associatedTask, setAssociatedTask] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'capture' | 'history' | 'info'>('capture');

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch {
      setCameraError('Camera access denied or unavailable');
    }
  }, [user]);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    setCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Add watermark overlay
    const timestamp = new Date().toLocaleString();
    const watermarkHeight = 80;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, canvas.height - watermarkHeight, canvas.width, watermarkHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('PostAll Proof Cam', 16, canvas.height - watermarkHeight + 28);

    ctx.font = '14px sans-serif';
    ctx.fillText(timestamp, 16, canvas.height - watermarkHeight + 52);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText('VERIFIED PROOF', canvas.width - 180, canvas.height - watermarkHeight + 28);

    if (locationNote) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.fillText(
        `Location: ${locationNote}`,
        16,
        canvas.height - watermarkHeight + 72
      );
    }

    const dataUrl = canvas.toDataURL('image/png');

    const newPhoto: CapturedPhoto = {
      id: Date.now().toString(),
      dataUrl,
      timestamp,
      locationNote,
      associatedTask,
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    setCapturing(false);
    setLocationNote('');
    setAssociatedTask('');
  }, [locationNote, associatedTask]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!user) {
        setShowAuthModal(true);
        return;
      }
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          if (!canvasRef.current) return;
          const canvas = canvasRef.current;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(img, 0, 0);

          // Add watermark
          const timestamp = new Date().toLocaleString();
          const watermarkHeight = 80;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fillRect(
            0,
            canvas.height - watermarkHeight,
            canvas.width,
            watermarkHeight
          );
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px sans-serif';
          ctx.fillText(
            'PostAll Proof Cam',
            16,
            canvas.height - watermarkHeight + 28
          );
          ctx.font = '14px sans-serif';
          ctx.fillText(timestamp, 16, canvas.height - watermarkHeight + 52);
          ctx.fillStyle = '#10b981';
          ctx.font = '12px sans-serif';
          ctx.fillText(
            'VERIFIED PROOF',
            canvas.width - 180,
            canvas.height - watermarkHeight + 28
          );

          const dataUrl = canvas.toDataURL('image/png');
          const newPhoto: CapturedPhoto = {
            id: Date.now().toString(),
            dataUrl,
            timestamp,
            locationNote,
            associatedTask,
          };
          setPhotos((prev) => [newPhoto, ...prev]);
          setLocationNote('');
          setAssociatedTask('');
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [user, locationNote, associatedTask]
  );

  const downloadPhoto = useCallback((photo: CapturedPhoto) => {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = `postall-proof-${photo.id}.png`;
    link.click();
  }, []);

  const deletePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <div className="min-h-[60vh]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="bg-white/20 text-white mb-4 hover:bg-white/20">Evidence Tool</Badge>
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Camera className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Proof Cam</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Capture timestamped, watermarked photos as proof for your transactions.
            Every photo is verified and can be used as evidence in disputes.
          </p>
          <Link href="/browse#tools" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mt-6">
            <ChevronLeft className="h-4 w-4" />Back to All Tools
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-8">
          {[
            { id: 'capture' as const, label: 'Capture', icon: Camera },
            { id: 'history' as const, label: 'Proof History', icon: Clock },
            { id: 'info' as const, label: 'How It Works', icon: Info },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Capture Tab */}
        {activeTab === 'capture' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Camera / Upload Area */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-0 overflow-hidden">
                  {/* Camera Viewfinder */}
                  <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
                    {cameraActive ? (
                      <>
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          playsInline
                          muted
                        />
                        {/* Viewfinder overlay */}
                        <div className="absolute inset-4 border-2 border-white/30 rounded-lg pointer-events-none">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
                        </div>
                        {/* Capture button overlay */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                          <Button
                            onClick={capturePhoto}
                            disabled={capturing}
                            size="lg"
                            className="bg-emerald-500 hover:bg-emerald-600 rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-lg"
                          >
                            {capturing ? (
                              <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                              <Camera className="h-6 w-6" />
                            )}
                          </Button>
                          <Button
                            onClick={stopCamera}
                            size="lg"
                            variant="outline"
                            className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full h-14 px-4"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-white p-8">
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                          <Camera className="h-10 w-10 text-white/60" />
                        </div>
                        {cameraError ? (
                          <>
                            <AlertCircle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                            <p className="text-amber-300 mb-4">{cameraError}</p>
                          </>
                        ) : (
                          <p className="text-gray-300 mb-6">
                            {hasCamera
                              ? 'Open your camera to capture a proof photo'
                              : 'Camera not available on this device'}
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          {hasCamera && (
                            <Button
                              onClick={startCamera}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Open Camera
                            </Button>
                          )}
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="border-white/30 text-white hover:bg-white/10"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hidden canvas for processing */}
                  <canvas ref={canvasRef} className="hidden" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </CardContent>
              </Card>

              {/* Photo Meta Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location-note" className="flex items-center gap-1.5 mb-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    Location Note (optional)
                  </Label>
                  <Input
                    id="location-note"
                    placeholder="e.g., Starbucks on Main Street"
                    value={locationNote}
                    onChange={(e) => setLocationNote(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-1.5 mb-2">
                    <FileText className="h-3.5 w-3.5 text-gray-400" />
                    Associate with Task (optional)
                  </Label>
                  <Select value={associatedTask} onValueChange={setAssociatedTask}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleTasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Capture Info */}
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-emerald-900 flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    Proof Photo Features
                  </h3>
                  <ul className="space-y-2.5">
                    {[
                      { icon: CalendarClock, text: 'Auto-timestamped with date & time' },
                      { icon: MapPin, text: 'Geo-tagged with location data' },
                      { icon: Shield, text: 'PostAll watermark applied' },
                      { icon: CheckCircle2, text: 'Verifiable in disputes' },
                      { icon: Download, text: 'Downloadable as evidence' },
                    ].map((feature) => (
                      <li
                        key={feature.text}
                        className="flex items-start gap-2 text-sm text-emerald-800"
                      >
                        <feature.icon className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Today&apos;s Captures</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-600">{photos.length}</p>
                      <p className="text-xs text-gray-500">This Session</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-teal-600">
                        {photos.filter((p) => p.associatedTask).length}
                      </p>
                      <p className="text-xs text-gray-500">Linked to Tasks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4 text-amber-500" />
                    Pro Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">&#8226;</span>
                      Capture photos in well-lit areas for clearer evidence
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">&#8226;</span>
                      Always add a location note for context
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">&#8226;</span>
                      Link photos to tasks for organized records
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">&#8226;</span>
                      Download photos immediately as backup
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Proof History</h2>
              {photos.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPhotos([])}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            {photos.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Proof Photos Yet
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Capture your first proof photo to start building a verifiable record
                    of your transactions.
                  </p>
                  <Button
                    onClick={() => setActiveTab('capture')}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Start Capturing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden group">
                    <div className="relative aspect-[4/3]">
                      <img
                        src={photo.dataUrl}
                        alt={`Proof photo - ${photo.timestamp}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Timestamp overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="flex items-center gap-1.5 text-white text-xs">
                          <Clock className="h-3 w-3" />
                          <span>{photo.timestamp}</span>
                        </div>
                        {photo.locationNote && (
                          <div className="flex items-center gap-1.5 text-emerald-300 text-xs mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{photo.locationNote}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      {photo.associatedTask && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <FileText className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500 truncate">
                            Linked to:{' '}
                            {sampleTasks.find((t) => t.id === photo.associatedTask)?.title ||
                              'Unknown task'}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => downloadPhoto(photo)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePhoto(photo.id)}
                          className="text-rose-600 border-rose-200 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Info className="h-6 w-6 text-emerald-600" />
                  How Proof Cam Works
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      What is Proof Cam?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Proof Cam is a built-in tool that captures timestamped, watermarked photos
                      from your device camera or uploaded images. These photos serve as verifiable
                      evidence for transactions on the PostAll platform.
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Photo Features
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          icon: CalendarClock,
                          title: 'Timestamped',
                          desc: 'Every photo has an automatic date and time stamp embedded in the watermark.',
                        },
                        {
                          icon: Compass,
                          title: 'Location-Aware',
                          desc: 'Add location notes to provide context about where the photo was taken.',
                        },
                        {
                          icon: Shield,
                          title: 'Watermarked',
                          desc: 'Each photo is branded with the PostAll "Verified Proof" watermark.',
                        },
                        {
                          icon: FileText,
                          title: 'Task-Linked',
                          desc: 'Associate proof photos with specific tasks for organized evidence.',
                        },
                      ].map((feature) => (
                        <div
                          key={feature.title}
                          className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="p-2 rounded-lg bg-emerald-100 flex-shrink-0">
                            <feature.icon className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">
                              {feature.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">{feature.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      When to Use Proof Cam
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      {[
                        'Before and after a service delivery',
                        'When receiving an item from a seller',
                        'When handing over an item to a buyer',
                        'To document the condition of goods',
                        'To capture meeting locations and arrangements',
                        'As evidence in any dispute resolution process',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Important Notes
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                          Photos are stored locally on your device. Always download important
                          proofs as a backup.
                        </p>
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                          Proof photos can be used in PostAll dispute resolution but may
                          also be useful for external legal proceedings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <MagicLinkModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
}
