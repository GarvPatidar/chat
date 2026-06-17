// import { useEffect, useRef, useState } from "react";
// import { useCall } from "../context/CallContext";
// import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";

// const CallOverlay = () => {
//   const {
//     stream,
//     remoteStream,
//     isCalling,
//     isReceivingCall,
//     callAccepted,
//     callType,
//     callerInfo,
//     muted,
//     cameraOff,
//     answerCall,
//     declineCall,
//     endCall,
//     toggleMute,
//     toggleCamera,
//   } = useCall();

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const [timer, setTimer] = useState(0);

//   // Setup local video source
//   useEffect(() => {
//     if (stream && localVideoRef.current) {
//       localVideoRef.current.srcObject = stream;
//     }
//   }, [stream]);

//   // Setup remote video source
//   useEffect(() => {
//     if (remoteStream && remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [remoteStream]);

//   // Call duration timer
//   useEffect(() => {
//     let interval;
//     if (callAccepted) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev + 1);
//       }, 1000);
//     } else {
//       setTimer(0);
//     }
//     return () => clearInterval(interval);
//   }, [callAccepted]);

//   const formatTime = (secs) => {
//     const m = Math.floor(secs / 60)
//       .toString()
//       .padStart(2, "0");
//     const s = (secs % 60).toString().padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   if (!isCalling && !isReceivingCall && !callAccepted) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white font-sans overflow-hidden">
//       {/* 1. OUTGOING CALL SCREEN */}
//       {isCalling && !callAccepted && (
//         <div className="flex flex-col items-center justify-between h-full py-20 px-6 w-full max-w-md text-center animate-fade-in">
//           <div className="mt-10">
//             <div className="relative flex items-center justify-center">
//               {/* Outer pulsing rings */}
//               <div className="absolute w-36 h-36 bg-blue-500/20 rounded-full animate-ping duration-1000" />
//               <div className="absolute w-28 h-28 bg-blue-500/30 rounded-full animate-pulse" />
//               <div className="relative w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-700 shadow-xl">
//                 {callerInfo.name ? callerInfo.name.charAt(0).toUpperCase() : "?"}
//               </div>
//             </div>
//             <h2 className="mt-8 text-2xl font-bold tracking-wide">{callerInfo.name}</h2>
//             <p className="mt-2 text-slate-400 text-sm font-medium tracking-widest animate-pulse">
//               RINGING...
//             </p>
//           </div>

//           <button
//             onClick={endCall}
//             className="w-16 h-16 flex items-center justify-center bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-full border border-rose-500 shadow-lg cursor-pointer"
//             title="Cancel Call"
//           >
//             <PhoneOff className="h-7 w-7" />
//           </button>
//         </div>
//       )}

//       {/* 2. INCOMING CALL SCREEN */}
//       {isReceivingCall && !callAccepted && (
//         <div className="flex flex-col items-center justify-between h-full py-20 px-6 w-full max-w-md text-center animate-fade-in">
//           <div className="mt-10">
//             <div className="relative flex items-center justify-center">
//               <div className="absolute w-36 h-36 bg-emerald-500/20 rounded-full animate-ping duration-1000" />
//               <div className="absolute w-28 h-28 bg-emerald-500/30 rounded-full animate-pulse" />
//               <div className="relative w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-700 shadow-xl">
//                 {callerInfo.name ? callerInfo.name.charAt(0).toUpperCase() : "?"}
//               </div>
//             </div>
//             <h2 className="mt-8 text-2xl font-bold tracking-wide">{callerInfo.name}</h2>
//             <p className="mt-2 text-emerald-400 text-sm font-medium tracking-wider flex items-center gap-1.5 justify-center">
//               Incoming {callType === "video" ? "Video" : "Voice"} Call...
//             </p>
//           </div>

//           <div className="flex gap-8 mb-4">
//             <button
//               onClick={declineCall}
//               className="w-16 h-16 flex items-center justify-center bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-full shadow-lg cursor-pointer"
//               title="Decline"
//             >
//               <PhoneOff className="h-7 w-7" />
//             </button>
//             <button
//               onClick={answerCall}
//               className="w-16 h-16 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all rounded-full shadow-lg animate-bounce cursor-pointer"
//               title="Accept"
//             >
//               {callType === "video" ? <Video className="h-7 w-7" /> : <Phone className="h-7 w-7" />}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 3. ACTIVE CALL SCREEN */}
//       {callAccepted && (
//         <div className="relative w-full h-full flex flex-col items-center justify-between">
//           {/* A. VIDEO CALL LAYOUT */}
//           {callType === "video" ? (
//             <div className="absolute inset-0 w-full h-full bg-slate-950">
//               {/* Remote Video Stream (Full Screen) */}
//               {remoteStream ? (
//                 <video
//                   ref={remoteVideoRef}
//                   autoPlay
//                   playsInline
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
//                   <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-slate-700 mb-4">
//                     {callerInfo.name ? callerInfo.name.charAt(0).toUpperCase() : "?"}
//                   </div>
//                   <p className="text-slate-400 text-sm">Waiting for remote camera...</p>
//                 </div>
//               )}

//               {/* Local Video Stream (Mini Floating Preview) */}
//               <div className="absolute top-6 right-6 w-32 h-44 md:w-40 md:h-56 bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-700 shadow-2xl z-10">
//                 {stream && !cameraOff ? (
//                   <video
//                     ref={localVideoRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     className="w-full h-full object-cover scale-x-[-1]"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-slate-800 text-xs text-slate-400">
//                     Camera Off
//                   </div>
//                 )}
//               </div>

//               {/* Call Header Overlay (Name & Duration) */}
//               <div className="absolute top-6 left-6 z-10 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/50 flex items-center gap-3">
//                 <span className="font-semibold text-sm">{callerInfo.name}</span>
//                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
//                 <span className="text-xs text-slate-300 font-mono">{formatTime(timer)}</span>
//               </div>
//             </div>
//           ) : (
//             /* B. AUDIO CALL LAYOUT */
//             <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md text-center py-10">
//               <div className="relative flex items-center justify-center mb-8">
//                 <div className="absolute w-44 h-44 bg-blue-500/10 rounded-full animate-pulse" />
//                 <div className="absolute w-36 h-36 bg-blue-500/20 rounded-full animate-pulse delay-75" />
//                 <div className="relative w-28 h-28 bg-slate-800 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-slate-700 shadow-xl">
//                   {callerInfo.name ? callerInfo.name.charAt(0).toUpperCase() : "?"}
//                 </div>
//               </div>
//               <h2 className="text-2xl font-bold">{callerInfo.name}</h2>
//               <div className="mt-3 flex items-center gap-2 text-slate-400 text-sm">
//                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//                 <span>In Call</span>
//                 <span className="text-slate-500">•</span>
//                 <span className="font-mono text-slate-300">{formatTime(timer)}</span>
//               </div>
//             </div>
//           )}

//           {/* CONTROLS PANEL */}
//           <div className="relative z-10 pb-12 pt-6 w-full flex items-center justify-center gap-6 px-4 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
//             {/* Mute Button */}
//             <button
//               onClick={toggleMute}
//               className={`w-14 h-14 flex items-center justify-center rounded-full transition-all border shadow-lg cursor-pointer ${
//                 muted
//                   ? "bg-rose-600/80 border-rose-500 text-white"
//                   : "bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200"
//               }`}
//               title={muted ? "Unmute Mic" : "Mute Mic"}
//             >
//               {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
//             </button>

//             {/* End Call Button */}
//             <button
//               onClick={endCall}
//               className="w-16 h-16 flex items-center justify-center bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-full border border-rose-500 shadow-lg cursor-pointer"
//               title="End Call"
//             >
//               <PhoneOff className="h-7 w-7" />
//             </button>

//             {/* Camera Toggle Button (Only for video calls) */}
//             {callType === "video" && (
//               <button
//                 onClick={toggleCamera}
//                 className={`w-14 h-14 flex items-center justify-center rounded-full transition-all border shadow-lg cursor-pointer ${
//                   cameraOff
//                     ? "bg-rose-600/80 border-rose-500 text-white"
//                     : "bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200"
//                 }`}
//                 title={cameraOff ? "Turn Camera On" : "Turn Camera Off"}
//               >
//                 {cameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CallOverlay;


import { useEffect, useCallback, useState } from "react";
import { useCall } from "../context/CallContext";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";

const CallOverlay = () => {
  const {
    stream,
    remoteStream,
    isCalling,
    isReceivingCall,
    callAccepted,
    callType,
    callerInfo,
    muted,
    cameraOff,
    answerCall,
    declineCall,
    endCall,
    toggleMute,
    toggleCamera,
  } = useCall();

  const [timer, setTimer] = useState(0);

  // Callback refs to handle element mounting/updating and setting srcObject
  const localVideoCallback = useCallback((node) => {
    if (node) {
      node.srcObject = stream;
    }
  }, [stream]);

  const remoteVideoCallback = useCallback((node) => {
    if (node) {
      node.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const remoteAudioCallback = useCallback((node) => {
    if (node) {
      node.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (callAccepted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [callAccepted]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isCalling && !isReceivingCall && !callAccepted) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white font-sans overflow-hidden">
      {/* 1. OUTGOING CALL SCREEN */}
      {isCalling && !callAccepted && (
        <div className="flex flex-col items-center justify-between h-full py-20 px-6 w-full max-w-md text-center animate-fade-in">
          <div className="mt-10">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing rings */}
              <div className="absolute w-36 h-36 bg-blue-500/20 rounded-full animate-ping duration-1000" />
              <div className="absolute w-28 h-28 bg-blue-500/30 rounded-full animate-pulse" />
              <div className="relative w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-700 shadow-xl">
                {callerInfo.name ? callerInfo.name.charAt(0).toUpperCase() : "?"}
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-bold tracking-wide">{callerInfo.name}</h2>
            <p className="mt-2 text-slate-400 text-sm font-medium tracking-widest animate-pulse">
              RINGING...
            </p>
          </div>

          <button
            onClick={endCall}
            className="w-16 h-16 flex items-center justify-center bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-full border border-rose-500 shadow-lg cursor-pointer"
            title="Cancel Call"
          >
            <PhoneOff className="h-7 w-7" />
          </button>
        </div>
      )}

      {/* 2. INCOMING CALL SCREEN */}
      {isReceivingCall && !callAccepted && (
        <div className="flex flex-col items-center justify-between h-full py-20 px-6 w-full max-w-md text-center animate-fade-in">
          <div className="mt-10">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-36 h-36 bg-emerald-500/20 rounded-full animate-ping duration-1000" />
              <div className="absolute w-28 h-28 bg-emerald-500/30 rounded-full animate-pulse" />
              <div className="relative w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-700 shadow-xl">
                {callerInfo.name ? callerInfo.name.charAt(0).toUpperCase() : "?"}
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-bold tracking-wide">{callerInfo.name}</h2>
            <p className="mt-2 text-emerald-400 text-sm font-medium tracking-wider flex items-center gap-1.5 justify-center">
              Incoming {callType === "video" ? "Video" : "Voice"} Call...
            </p>
          </div>

          <div className="flex gap-8 mb-4">
            <button
              onClick={declineCall}
              className="w-16 h-16 flex items-center justify-center bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-full shadow-lg cursor-pointer"
              title="Decline"
            >
              <PhoneOff className="h-7 w-7" />
            </button>
            <button
              onClick={answerCall}
              className="w-16 h-16 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all rounded-full shadow-lg animate-bounce cursor-pointer"
              title="Accept"
            >
              {callType === "video" ? <Video className="h-7 w-7" /> : <Phone className="h-7 w-7" />}
            </button>
          </div>
        </div>
      )}

      {/* 3. ACTIVE CALL SCREEN */}
      {callAccepted && (
        <div className="relative w-full h-full flex flex-col items-center justify-between">
          {/* A. VIDEO CALL LAYOUT */}
          {callType === "video" ? (
            <div className="absolute inset-0 w-full h-full bg-slate-950">
              {/* Remote Video Stream (Full Screen) */}
              <video
                ref={remoteVideoCallback}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${remoteStream ? "" : "hidden"}`}
              />
              {!remoteStream && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-slate-700 mb-4">
                    {callerInfo.name ? callerInfo.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <p className="text-slate-400 text-sm">Waiting for remote camera...</p>
                </div>
              )}

              {/* Local Video Stream (Mini Floating Preview) */}
              <div className="absolute top-6 right-6 w-32 h-44 md:w-40 md:h-56 bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-700 shadow-2xl z-10">
                <video
                  ref={localVideoCallback}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover scale-x-[-1] ${stream && !cameraOff ? "" : "hidden"}`}
                />
                {(!stream || cameraOff) && (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-xs text-slate-400">
                    Camera Off
                  </div>
                )}
              </div>

              {/* Call Header Overlay (Name & Duration) */}
              <div className="absolute top-6 left-6 z-10 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/50 flex items-center gap-3">
                <span className="font-semibold text-sm">{callerInfo.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-slate-300 font-mono">{formatTime(timer)}</span>
              </div>
            </div>
          ) : (
            /* B. AUDIO CALL LAYOUT */
            <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md text-center py-10">
              <audio
                ref={remoteAudioCallback}
                autoPlay
                className="hidden"
              />
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute w-44 h-44 bg-blue-500/10 rounded-full animate-pulse" />
                <div className="absolute w-36 h-36 bg-blue-500/20 rounded-full animate-pulse delay-75" />
                <div className="relative w-28 h-28 bg-slate-800 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-slate-700 shadow-xl">
                  {callerInfo.name ? callerInfo.name.charAt(0).toUpperCase() : "?"}
                </div>
              </div>
              <h2 className="text-2xl font-bold">{callerInfo.name}</h2>
              <div className="mt-3 flex items-center gap-2 text-slate-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>In Call</span>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-slate-300">{formatTime(timer)}</span>
              </div>
            </div>
          )}

          {/* CONTROLS PANEL */}
          <div className="relative z-10 pb-12 pt-6 w-full flex items-center justify-center gap-6 px-4 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={`w-14 h-14 flex items-center justify-center rounded-full transition-all border shadow-lg cursor-pointer ${
                muted
                  ? "bg-rose-600/80 border-rose-500 text-white"
                  : "bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200"
              }`}
              title={muted ? "Unmute Mic" : "Mute Mic"}
            >
              {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="w-16 h-16 flex items-center justify-center bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-full border border-rose-500 shadow-lg cursor-pointer"
              title="End Call"
            >
              <PhoneOff className="h-7 w-7" />
            </button>

            {/* Camera Toggle Button (Only for video calls) */}
            {callType === "video" && (
              <button
                onClick={toggleCamera}
                className={`w-14 h-14 flex items-center justify-center rounded-full transition-all border shadow-lg cursor-pointer ${
                  cameraOff
                    ? "bg-rose-600/80 border-rose-500 text-white"
                    : "bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200"
                }`}
                title={cameraOff ? "Turn Camera On" : "Turn Camera Off"}
              >
                {cameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CallOverlay;

