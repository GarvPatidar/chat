// import { createContext, useContext, useEffect, useState, useRef } from "react";
// import { useSocket } from "./SocketContext";
// import { useAuth } from "./AuthContext";
// import toast from "react-hot-toast";

// const CallContext = createContext();

// const peerConfiguration = {
//   iceServers: [
//     {
//       urls: [
//         "stun:stun.l.google.com:19302",
//         "stun:stun1.l.google.com:19302",
//         "stun:stun2.l.google.com:19302",
//       ],
//     },
//   ],
// };

// export const CallProvider = ({ children }) => {
//   const { user } = useAuth();
//   const { socket } = useSocket();

//   const [stream, setStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [isCalling, setIsCalling] = useState(false);
//   const [isReceivingCall, setIsReceivingCall] = useState(false);
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [callType, setCallType] = useState("video"); // 'audio' | 'video'
//   const [callerInfo, setCallerInfo] = useState({ id: "", name: "" });
//   const [muted, setMuted] = useState(false);
//   const [cameraOff, setCameraOff] = useState(false);

//   const peerConnectionRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const pendingCandidatesRef = useRef([]);

//   // Cleanup helper
//   const cleanUpCall = () => {
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => track.stop());
//       localStreamRef.current = null;
//     }
//     setStream(null);
//     setRemoteStream(null);
//     setIsCalling(false);
//     setIsReceivingCall(false);
//     setCallAccepted(false);
//     setMuted(false);
//     setCameraOff(false);
//     setCallerInfo({ id: "", name: "" });
//     pendingCandidatesRef.current = [];
//   };

//   // Start Call (Caller)
//   const makeCall = async (targetUserId, targetUserName, type) => {
//     if (!socket) return;
//     setIsCalling(true);
//     setCallType(type);
//     setCallerInfo({ id: targetUserId, name: targetUserName });

//     try {
//       const constraints = {
//         video: type === "video",
//         audio: true,
//       };
//       const localStream = await navigator.mediaDevices.getUserMedia(constraints);
//       setStream(localStream);
//       localStreamRef.current = localStream;

//       const pc = new RTCPeerConnection(peerConfiguration);
//       peerConnectionRef.current = pc;

//       // Add local stream tracks to WebRTC connection
//       localStream.getTracks().forEach((track) => {
//         pc.addTrack(track, localStream);
//       });

//       // Handle remote tracks
//       pc.ontrack = (event) => {
//         if (event.streams && event.streams[0]) {
//           setRemoteStream(event.streams[0]);
//         }
//       };

//       // Emit ICE candidates
//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket.emit("ice_candidate", {
//             to: targetUserId,
//             candidate: event.candidate,
//           });
//         }
//       };

//       // Create WebRTC Offer
//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);

//       // Notify backend to relay call to target user
//       socket.emit("call_user", {
//         userToCall: targetUserId,
//         signalData: offer,
//         from: user._id,
//         name: user.name,
//         callType: type,
//       });
//     } catch (err) {
//       console.error("Failed to access media devices:", err);
//       toast.error("Could not access your camera or microphone.");
//       cleanUpCall();
//     }
//   };

//   // Accept Call (Receiver)
//   const answerCall = async () => {
//     if (!socket || !callerInfo.id) return;

//     try {
//       const constraints = {
//         video: callType === "video",
//         audio: true,
//       };
//       const localStream = await navigator.mediaDevices.getUserMedia(constraints);
//       setStream(localStream);
//       localStreamRef.current = localStream;

//       const pc = new RTCPeerConnection(peerConfiguration);
//       peerConnectionRef.current = pc;

//       localStream.getTracks().forEach((track) => {
//         pc.addTrack(track, localStream);
//       });

//       pc.ontrack = (event) => {
//         if (event.streams && event.streams[0]) {
//           setRemoteStream(event.streams[0]);
//         }
//       };

//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket.emit("ice_candidate", {
//             to: callerInfo.id,
//             candidate: event.candidate,
//           });
//         }
//       };

//       // Set Remote Description (Caller's Offer)
//       const offerDesc = new RTCSessionDescription(callerInfo.signal);
//       await pc.setRemoteDescription(offerDesc);

//       // Add any ice candidates received before RemoteDescription was set
//       if (pendingCandidatesRef.current.length > 0) {
//         for (const cand of pendingCandidatesRef.current) {
//           try {
//             await pc.addIceCandidate(new RTCIceCandidate(cand));
//           } catch (e) {
//             console.error("Error adding pending candidate:", e);
//           }
//         }
//         pendingCandidatesRef.current = [];
//       }

//       // Create Answer
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);

//       // Emit accept signal
//       socket.emit("answer_call", {
//         to: callerInfo.id,
//         signal: answer,
//       });

//       setCallAccepted(true);
//       setIsReceivingCall(false);
//     } catch (err) {
//       console.error("Error answering call:", err);
//       toast.error("Failed to connect call.");
//       declineCall();
//     }
//   };

//   // Decline/Reject Call (Receiver)
//   const declineCall = () => {
//     if (socket && callerInfo.id) {
//       socket.emit("end_call", { to: callerInfo.id });
//     }
//     cleanUpCall();
//   };

//   // End Call (Caller or Receiver)
//   const endCall = () => {
//     if (socket && callerInfo.id) {
//       socket.emit("end_call", { to: callerInfo.id });
//     }
//     cleanUpCall();
//   };

//   // Toggle Microphone
//   const toggleMute = () => {
//     if (localStreamRef.current) {
//       const audioTrack = localStreamRef.current.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setMuted(!audioTrack.enabled);
//       }
//     }
//   };

//   // Toggle Camera
//   const toggleCamera = () => {
//     if (localStreamRef.current && callType === "video") {
//       const videoTrack = localStreamRef.current.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setCameraOff(!videoTrack.enabled);
//       }
//     }
//   };

//   // Socket Listener Setup
//   useEffect(() => {
//     if (!socket) return;

//     // 1. Listen for incoming calls
//     socket.on("call_user", ({ signal, from, name, callType }) => {
//       // If already in a call, auto-reject or ignore (in WebRTC call state)
//       if (peerConnectionRef.current) {
//         socket.emit("end_call", { to: from });
//         return;
//       }

//       setCallerInfo({ id: from, name, signal });
//       setCallType(callType);
//       setIsReceivingCall(true);
//     });

//     // 2. Listen for call accept
//     socket.on("answer_call", async ({ signal }) => {
//       const pc = peerConnectionRef.current;
//       if (pc) {
//         try {
//           await pc.setRemoteDescription(new RTCSessionDescription(signal));
//           setCallAccepted(true);
//           setIsCalling(false);

//           // Add any ice candidates received before RemoteDescription was set
//           if (pendingCandidatesRef.current.length > 0) {
//             for (const cand of pendingCandidatesRef.current) {
//               try {
//                 await pc.addIceCandidate(new RTCIceCandidate(cand));
//               } catch (e) {
//                 console.error("Error adding pending candidate:", e);
//               }
//             }
//             pendingCandidatesRef.current = [];
//           }
//         } catch (err) {
//           console.error("Error setting remote answer:", err);
//           cleanUpCall();
//         }
//       }
//     });

//     // 3. Listen for ICE candidates
//     socket.on("ice_candidate", async ({ candidate }) => {
//       const pc = peerConnectionRef.current;
//       if (pc) {
//         if (pc.remoteDescription && pc.remoteDescription.type) {
//           try {
//             await pc.addIceCandidate(new RTCIceCandidate(candidate));
//           } catch (e) {
//             console.error("Error adding IceCandidate:", e);
//           }
//         } else {
//           pendingCandidatesRef.current.push(candidate);
//         }
//       }
//     });

//     // 4. Listen for call termination
//     socket.on("end_call", () => {
//       toast("Call ended", { icon: "📞" });
//       cleanUpCall();
//     });

//     return () => {
//       socket.off("call_user");
//       socket.off("answer_call");
//       socket.off("ice_candidate");
//       socket.off("end_call");
//     };
//   }, [socket, callerInfo, callType]);

//   return (
//     <CallContext.Provider
//       value={{
//         stream,
//         remoteStream,
//         isCalling,
//         isReceivingCall,
//         callAccepted,
//         callType,
//         callerInfo,
//         muted,
//         cameraOff,
//         makeCall,
//         answerCall,
//         declineCall,
//         endCall,
//         toggleMute,
//         toggleCamera,
//       }}
//     >
//       {children}
//     </CallContext.Provider>
//   );
// };

// export const useCall = () => useContext(CallContext);



import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CallContext = createContext();

const peerConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
  ],
};

export const CallProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callType, setCallType] = useState("video"); // 'audio' | 'video'
  const [callerInfo, setCallerInfo] = useState({ id: "", name: "" });
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  // Cleanup helper
  const cleanUpCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setStream(null);
    setRemoteStream(null);
    setIsCalling(false);
    setIsReceivingCall(false);
    setCallAccepted(false);
    setMuted(false);
    setCameraOff(false);
    setCallerInfo({ id: "", name: "" });
    pendingCandidatesRef.current = [];
  };

  // Start Call (Caller)
  const makeCall = async (targetUserId, targetUserName, type) => {
    if (!socket) return;
    pendingCandidatesRef.current = []; // Clear leftovers
    setIsCalling(true);
    setCallType(type);
    setCallerInfo({ id: targetUserId, name: targetUserName });

    try {
      const constraints = {
        video: type === "video",
        audio: true,
      };
      const localStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(localStream);
      localStreamRef.current = localStream;

      const pc = new RTCPeerConnection(peerConfiguration);
      peerConnectionRef.current = pc;

      // Add local stream tracks to WebRTC connection
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      // Handle remote tracks
      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      // Emit ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice_candidate", {
            to: targetUserId,
            candidate: event.candidate,
          });
        }
      };

      // Create WebRTC Offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Notify backend to relay call to target user
      socket.emit("call_user", {
        userToCall: targetUserId,
        signalData: offer,
        from: user._id,
        name: user.name,
        callType: type,
      });
    } catch (err) {
      console.error("Failed to access media devices:", err);
      toast.error("Could not access your camera or microphone.");
      cleanUpCall();
    }
  };

  // Accept Call (Receiver)
  const answerCall = async () => {
    if (!socket || !callerInfo.id) return;

    try {
      const constraints = {
        video: callType === "video",
        audio: true,
      };
      const localStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(localStream);
      localStreamRef.current = localStream;

      const pc = new RTCPeerConnection(peerConfiguration);
      peerConnectionRef.current = pc;

      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice_candidate", {
            to: callerInfo.id,
            candidate: event.candidate,
          });
        }
      };

      // Set Remote Description (Caller's Offer)
      const offerDesc = new RTCSessionDescription(callerInfo.signal);
      await pc.setRemoteDescription(offerDesc);

      // Add any ice candidates received before RemoteDescription was set
      if (pendingCandidatesRef.current.length > 0) {
        for (const cand of pendingCandidatesRef.current) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          } catch (e) {
            console.error("Error adding pending candidate:", e);
          }
        }
        pendingCandidatesRef.current = [];
      }

      // Create Answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Emit accept signal
      socket.emit("answer_call", {
        to: callerInfo.id,
        signal: answer,
      });

      setCallAccepted(true);
      setIsReceivingCall(false);
    } catch (err) {
      console.error("Error answering call:", err);
      toast.error("Failed to connect call.");
      declineCall();
    }
  };

  // Decline/Reject Call (Receiver)
  const declineCall = () => {
    if (socket && callerInfo.id) {
      socket.emit("end_call", { to: callerInfo.id });
    }
    cleanUpCall();
  };

  // End Call (Caller or Receiver)
  const endCall = () => {
    if (socket && callerInfo.id) {
      socket.emit("end_call", { to: callerInfo.id });
    }
    cleanUpCall();
  };

  // Toggle Microphone
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle Camera
  const toggleCamera = () => {
    if (localStreamRef.current && callType === "video") {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraOff(!videoTrack.enabled);
      }
    }
  };

  // Socket Listener Setup
  useEffect(() => {
    if (!socket) return;

    // 1. Listen for incoming calls
    socket.on("call_user", ({ signal, from, name, callType }) => {
      // If already in a call, auto-reject or ignore (in WebRTC call state)
      if (peerConnectionRef.current) {
        socket.emit("end_call", { to: from });
        return;
      }

      pendingCandidatesRef.current = []; // Clear leftovers
      setCallerInfo({ id: from, name, signal });
      setCallType(callType);
      setIsReceivingCall(true);
    });

    // 2. Listen for call accept
    socket.on("answer_call", async ({ signal }) => {
      const pc = peerConnectionRef.current;
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          setCallAccepted(true);
          setIsCalling(false);

          // Add any ice candidates received before RemoteDescription was set
          if (pendingCandidatesRef.current.length > 0) {
            for (const cand of pendingCandidatesRef.current) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(cand));
              } catch (e) {
                console.error("Error adding pending candidate:", e);
              }
            }
            pendingCandidatesRef.current = [];
          }
        } catch (err) {
          console.error("Error setting remote answer:", err);
          cleanUpCall();
        }
      }
    });

    // 3. Listen for ICE candidates
    socket.on("ice_candidate", async ({ candidate }) => {
      const pc = peerConnectionRef.current;
      if (pc && pc.remoteDescription && pc.remoteDescription.type) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding IceCandidate:", e);
        }
      } else {
        pendingCandidatesRef.current.push(candidate);
      }
    });

    // 4. Listen for call termination
    socket.on("end_call", () => {
      toast("Call ended", { icon: "📞" });
      cleanUpCall();
    });

    return () => {
      socket.off("call_user");
      socket.off("answer_call");
      socket.off("ice_candidate");
      socket.off("end_call");
    };
  }, [socket]);

  return (
    <CallContext.Provider
      value={{
        stream,
        remoteStream,
        isCalling,
        isReceivingCall,
        callAccepted,
        callType,
        callerInfo,
        muted,
        cameraOff,
        makeCall,
        answerCall,
        declineCall,
        endCall,
        toggleMute,
        toggleCamera,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);

