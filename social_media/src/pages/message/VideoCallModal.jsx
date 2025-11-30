// VideoCallModal.jsx
import React, { useContext, useEffect, useRef } from "react";
import { Dialog, Box, Typography, Avatar, IconButton, Stack } from "@mui/material";
import { CallEnd, Call, Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import { VideoCallContext } from "../../router/VideoCallProvider";
import { CALL_STATUS } from "../../shared/constants";



export default function VideoCallModal() {
  const {
    callState, acceptCall, declineCall, endCall,
    toggleMic, toggleCam, localStreamRef, remoteStreamRef
  } = useContext(VideoCallContext);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const isIncoming = callState.status === CALL_STATUS.INCOMING;
  const isCalling = callState.status === CALL_STATUS.CALLING;
  const isConnected = callState.status === CALL_STATUS.CONNECTED;

  

    // --- 1. Xử lý Attach Stream ---
    useEffect(() => {
      // Attach Local Stream
      if ((isCalling || isConnected) && localStreamRef.current && localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      // Attach Remote Stream
      if (isConnected && remoteStreamRef.current && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    }); // Lưu ý: Tốt nhất nên thêm dependency array [isCalling, isConnected] để tránh re-render thừa

    if (callState.status === CALL_STATUS.IDLE) return null;

    return (
      <Dialog
        open={true}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: "#202124", // Màu nền tối google meet
            color: "white",
            overflow: "hidden" // QUAN TRỌNG: Chặn scroll tuyệt đối
          }
        }}
      >
        {/* Container chính: Relative để các con Absolute bám theo */}
        <Box sx={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", bgcolor: "black" }}>

          {/* ================= LAYER 1: BACKGROUND / MAIN VIDEO ================= */}
          <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
            {/* 1.1: Hiện Remote Video (Full màn hình) khi đã kết nối */}
            {isConnected && (
              <video
                ref={remoteVideoRef}
                autoPlay playsInline
                style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "black" }}
              />
            )}

            {/* 1.2: Hiện Local Video (Full màn hình - Gương) khi đang gọi đi */}
            {isCalling && (
              <video
                ref={localVideoRef}
                autoPlay muted playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", opacity: 0.5 }}
              />
            )}

            {/* 1.3: Background Avatar khi đang đổ chuông đến */}
            {isIncoming && (
              <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#202124" }}>
                {/* Background blur effect cho đẹp */}
                <Avatar
                  src={callState.caller?.avatar}
                  sx={{ width: 300, height: 300, position: 'absolute', opacity: 0.1, filter: 'blur(10px)' }}
                />
              </Box>
            )}
          </Box>


          {/* ================= LAYER 2: INFO & ALERTS (CENTER) ================= */}
          {/* Hiển thị thông tin người gọi khi chưa kết nối */}
          {(isIncoming || isCalling) && (
            <Box sx={{
              position: "absolute", inset: 0, zIndex: 2,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              pointerEvents: "none" // Để click xuyên qua nếu cần (tuy nhiên ở đây full screen nên ko quan trọng lắm)
            }}>
              <Avatar
                src={callState.caller?.avatar}
                sx={{ width: 120, height: 120, mb: 3, border: "4px solid rgba(255,255,255,0.2)", boxShadow: 10 }}
              />
              <Typography variant="h4" fontWeight="bold" sx={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                {callState.caller?.name || "Unknown"}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, mt: 1, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                {isIncoming ? "Đang gọi video cho bạn..." : "Đang đổ chuông..."}
              </Typography>
            </Box>
          )}


          {/* ================= LAYER 3: PICTURE-IN-PICTURE (Góc phải) ================= */}
          {isConnected && (
            <Box sx={{
              position: "absolute", top: 24, right: 24,
              width: { xs: 100, md: 180 }, // Responsive size
              aspectRatio: "3/4",
              bgcolor: "#333", borderRadius: 3, overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              zIndex: 10,
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <video
                ref={localVideoRef}
                autoPlay muted playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
              />
            </Box>
          )}


          {/* ================= LAYER 4: CONTROLS (Bottom Bar) ================= */}
          <Box sx={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            zIndex: 20,
            pb: 4, pt: 8, // Padding bottom cho nút, Padding top để tạo vùng gradient
            display: "flex", justifyContent: "center", gap: 3,
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)" // Gradient đen dần xuống dưới để nút nổi bật
          }}>

            {/* === NÚT CHO NGƯỜI NHẬN (INCOMING) === */}
            {isIncoming ? (
              <Stack direction="row" spacing={6}>
                <IconButton
                  onClick={declineCall}
                  className="pulse-animation-red" // Bạn có thể thêm css animation rung rung ở file css ngoài
                  sx={{
                    bgcolor: "#ff4d4f", width: 64, height: 64,
                    "&:hover": { bgcolor: "#d9363e" } // Hover rõ ràng
                  }}
                >
                  <CallEnd sx={{ fontSize: 32, color: "white" }} />
                </IconButton>

                <IconButton
                  onClick={acceptCall}
                  className="pulse-animation-green"
                  sx={{
                    bgcolor: "#52c41a", width: 64, height: 64,
                    "&:hover": { bgcolor: "#389e0d" } // Hover rõ ràng
                  }}
                >
                  <Call sx={{ fontSize: 32, color: "white" }} />
                </IconButton>
              </Stack>
            ) : (
              /* === NÚT ĐIỀU KHIỂN (CALLING / CONNECTED) === */
              <Stack direction="row" spacing={2} alignItems="center">

                {/* Nút Micro */}
                <IconButton
                  onClick={toggleMic}
                  sx={{
                    width: 50, height: 50,
                    bgcolor: callState.isMicOn ? "rgba(255,255,255,0.2)" : "white", // On: Trong suốt / Off: Trắng
                    color: callState.isMicOn ? "white" : "black",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: callState.isMicOn ? "rgba(255,255,255,0.35)" : "#e0e0e0" // Fix hover bị mất
                    }
                  }}
                >
                  {callState.isMicOn ? <Mic /> : <MicOff />}
                </IconButton>

                {/* Nút Ngắt cuộc gọi */}
                <IconButton
                  onClick={endCall}
                  sx={{
                    bgcolor: "#f44336", width: 64, height: 64,
                    boxShadow: "0 4px 10px rgba(244, 67, 54, 0.4)",
                    "&:hover": { bgcolor: "#d32f2f" }
                  }}
                >
                  <CallEnd sx={{ fontSize: 32, color: "white" }} />
                </IconButton>

                {/* Nút Camera */}
                <IconButton
                  onClick={toggleCam}
                  sx={{
                    width: 50, height: 50,
                    bgcolor: callState.isCamOn ? "rgba(255,255,255,0.2)" : "white",
                    color: callState.isCamOn ? "white" : "black",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: callState.isCamOn ? "rgba(255,255,255,0.35)" : "#e0e0e0" // Fix hover bị mất
                    }
                  }}
                >
                  {callState.isCamOn ? <Videocam /> : <VideocamOff />}
                </IconButton>

              </Stack>
            )}
          </Box>

        </Box>
      </Dialog>
    );
  }
