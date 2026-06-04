import { useState, useEffect, useRef, useCallback } from "react";
import useSocketStore from "../store/socketStore";

/**
 * useWebRTC
 * Manages peer-to-peer video call using WebRTC + Socket.IO signaling.
 *
 * Usage:
 *   const {
 *     localStream, remoteStream,
 *     callStatus, isMuted, isVideoOff,
 *     startCall, acceptCall, endCall,
 *     toggleMute, toggleVideo, toggleScreenShare
 *   } = useWebRTC(roomId);
 */

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const useWebRTC = (roomId) => {
  const { socket } = useSocketStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState("idle"); // idle | calling | ringing | connected | ended
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [error, setError] = useState(null);

  // ─── Helpers ────────────────────────────────────────────────

  const getLocalMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    setLocalStream(stream);
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    return stream;
  };

  const createPeerConnection = (stream) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (e) => {
      setRemoteStream(e.streams[0]);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate && socket) {
        socket.emit("ice-candidate", { roomId, candidate: e.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        setCallStatus("ended");
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  // ─── Socket signaling ────────────────────────────────────────

  useEffect(() => {
    if (!socket) return;

    socket.on("call-offer", async ({ offer, from }) => {
      setCallStatus("ringing");
      try {
        const stream = await getLocalMedia();
        const pc = createPeerConnection(stream);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        // Store for acceptCall
        peerConnectionRef._pendingOffer = offer;
        peerConnectionRef._caller = from;
      } catch (err) {
        setError("Failed to handle incoming call.");
      }
    });

    socket.on("call-answer", async ({ answer }) => {
      await peerConnectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      setCallStatus("connected");
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {}
    });

    socket.on("call-ended", () => {
      endCall(false);
    });

    return () => {
      socket.off("call-offer");
      socket.off("call-answer");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, [socket, roomId]);

  // ─── Public API ──────────────────────────────────────────────

  const startCall = useCallback(async () => {
    if (!socket) return;
    setCallStatus("calling");
    try {
      const stream = await getLocalMedia();
      const pc = createPeerConnection(stream);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("call-offer", { roomId, offer });
    } catch (err) {
      setError("Could not access camera/microphone.");
      setCallStatus("idle");
    }
  }, [socket, roomId]);

  const acceptCall = useCallback(async () => {
    if (!peerConnectionRef.current) return;
    setCallStatus("connected");
    try {
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("call-answer", { roomId, answer });
    } catch (err) {
      setError("Failed to accept call.");
    }
  }, [socket, roomId]);

  const endCall = useCallback(
    (notify = true) => {
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;

      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;

      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;

      setLocalStream(null);
      setRemoteStream(null);
      setCallStatus("ended");
      setIsSharingScreen(false);

      if (notify && socket) socket.emit("end-call", { roomId });
    },
    [socket, roomId]
  );

  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMuted((p) => !p);
  }, []);

  const toggleVideo = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsVideoOff((p) => !p);
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (!peerConnectionRef.current) return;

    if (!isSharingScreen) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track?.kind === "video");
        await sender?.replaceTrack(screenTrack);

        screenTrack.onended = () => toggleScreenShare();
        setIsSharingScreen(true);
      } catch {}
    } else {
      const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
      const sender = peerConnectionRef.current
        .getSenders()
        .find((s) => s.track?.kind === "video");
      if (cameraTrack) await sender?.replaceTrack(cameraTrack);
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setIsSharingScreen(false);
    }
  }, [isSharingScreen]);

  return {
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    callStatus,
    isMuted,
    isVideoOff,
    isSharingScreen,
    error,
    startCall,
    acceptCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
  };
};

export default useWebRTC;