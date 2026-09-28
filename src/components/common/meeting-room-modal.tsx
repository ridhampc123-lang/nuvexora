"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Video,
  VideoOff,
  Mic,
  MicOff,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Users,
  ShieldCheck,
  PhoneOff,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface MeetingRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: {
    _id?: string;
    title: string;
    meetingLink?: string;
    timeSlot?: string;
    organizerName?: string;
    topic?: string;
  } | null;
}

export function MeetingRoomModal({ isOpen, onClose, meeting }: MeetingRoomModalProps) {
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [embedMode, setEmbedMode] = useState<"embedded" | "preview">("embedded");
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Compute a valid join link
  const rawLink = meeting?.meetingLink?.trim();
  const effectiveLink = rawLink && rawLink.length > 0
    ? rawLink
    : `https://meet.jit.si/nuvexora-${meeting?._id || "room"}`;

  // Check if link can be embedded cleanly
  const isJitsi = effectiveLink.includes("meet.jit.si");
  const isGoogleMeet = effectiveLink.includes("meet.google.com");
  const isZoom = effectiveLink.includes("zoom.us");

  // Manage camera preview in "preview" mode
  useEffect(() => {
    if (isOpen && embedMode === "preview") {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Camera preview not permitted:", err);
        });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, embedMode]);

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
      }
    } else {
      setIsCamOn(!isCamOn);
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    } else {
      setIsMicOn(!isMicOn);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(effectiveLink);
    setCopied(true);
    toast.success("Meeting link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const openInNewTab = () => {
    window.open(effectiveLink, "_blank", "noopener,noreferrer");
  };

  if (!isOpen || !meeting) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative w-full z-10 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isFullScreen ? "h-[96vh] max-w-[98vw]" : "h-[85vh] max-w-5xl"
          }`}
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Video className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                    {meeting.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live Room
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  Host: {meeting.organizerName || "Admin"} • {meeting.timeSlot || "Scheduled Slot"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 border border-slate-700/50"
                title="Copy Meeting Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy Link"}</span>
              </button>

              <button
                type="button"
                onClick={openInNewTab}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                title="Open in new window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open in Tab</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:flex"
                title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Leave Meeting Room"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Meeting Stage */}
          <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
            {embedMode === "embedded" ? (
              isJitsi ? (
                <iframe
                  src={`${effectiveLink}#config.prejoinPageEnabled=false&interfaceConfig.TOOLBAR_BUTTONS=['microphone','camera','closedcaptions','desktop','fullscreen','fodeviceselection','hangup','profile','chat','recording','livestreaming','etherpad','sharedvideo','settings','raisehand','videoquality','filmstrip','invite','feedback','stats','shortcuts','tileview','videobackgroundblur','download','help','mute-everyone','e2ee']`}
                  allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
                  className="w-full h-full border-0"
                  title="Virtual Meeting Room"
                />
              ) : (
                <div className="text-center p-8 max-w-lg space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-xl">
                    <Video className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white">{meeting.title}</h4>
                    <p className="text-xs text-slate-400">
                      {isGoogleMeet
                        ? "This session is hosted on Google Meet."
                        : isZoom
                        ? "This session is hosted on Zoom."
                        : "This session has an external conference link."}
                    </p>
                    <p className="text-xs font-mono text-indigo-400 bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800 break-all">
                      {effectiveLink}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={openInNewTab}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Launch External Call</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setEmbedMode("preview")}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      Test Camera & Mic
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* Pre-Call AV Test Mode */
              <div className="w-full h-full p-6 flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto text-center">
                <div className="relative w-full aspect-video rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl">
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${!isCamOn ? "hidden" : ""}`}
                  />
                  {!isCamOn && (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <VideoOff className="w-12 h-12" />
                      <span className="text-xs font-semibold">Camera is turned off</span>
                    </div>
                  )}

                  {/* Device Control Float */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 shadow-lg">
                    <button
                      type="button"
                      onClick={toggleCamera}
                      className={`p-3 rounded-xl transition-all ${
                        isCamOn ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMic}
                      className={`p-3 rounded-xl transition-all ${
                        isMicOn ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={openInNewTab}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    <span>Proceed to Call</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmbedMode("embedded")}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Info Footer */}
          <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Encrypted Nuvexora Enterprise Channel</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Leave Meeting</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
