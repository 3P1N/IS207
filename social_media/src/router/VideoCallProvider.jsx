// VideoCallProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthProvider";
import VideoCallModal from "../pages/message/VideoCallModal";
import { CALL_STATUS } from "../shared/constants";

export const VideoCallContext = createContext();

export default function VideoCallProvider({ children }) {
    const { userData, echoInstance } = useContext(AuthContext);

    // --- State quản lý cuộc gọi ---
    const [callState, setCallState] = useState({
        status: CALL_STATUS.IDLE,
        conversationId: null,
        caller: null, // Thông tin người gọi (nếu là incoming)
        isMicOn: true,
        isCamOn: true,
    });

    // --- Refs (Dữ liệu không gây re-render) ---
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const incomingRingTone = useRef(new Audio('/sounds/ringtone.mp3')); // Ví dụ nhạc chuông

    // --- Helper: Get Media (Updated) ---
    const getMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;

            // Đồng bộ state mặc định với stream thực tế
            setCallState(prev => ({ ...prev, isMicOn: true, isCamOn: true }));
            return true;
        } catch (err) {
            console.error("Failed to get local stream", err);
            return false;
        }
    };



    // --- 1. SETUP ECHO LISTENER (Lắng nghe cuộc gọi đến) ---
    useEffect(() => {
        if (!echoInstance || !userData) return;

        // Lắng nghe kênh riêng của user để nhận tín hiệu gọi đến
        const channelName = `user.${userData.id}`;
        echoInstance.private(channelName)
            .listen("CallIncoming", (e) => {
                // e: { conversationId, callerInfo, ... }
                handleIncomingCall(e);
            })
            .listen("CallEnded", () => {
                endCall(false); // Kết thúc không emit lại
            });

        // Ngoài ra cần listen các sự kiện WebRTC Signal (Offer, Answer, ICE) ở đây hoặc trong useEffect khác khi status != IDLE

        return () => {
            echoInstance.leave(channelName);
        };
    }, [echoInstance, userData]);


    // --- 2. LOGIC XỬ LÝ ---

    const handleIncomingCall = (data) => {
        if (callState.status !== CALL_STATUS.IDLE) return; // Đang bận
        setCallState(prev => ({
            ...prev,
            status: CALL_STATUS.INCOMING,
            conversationId: data.conversationId,
            caller: data.caller
        }));
        incomingRingTone.current.play().catch(() => { });
    };

    const startCall = async (conversationId, receiverInfo) => {
        // 1. Set state sang Calling ngay để hiện Modal
        setCallState(prev => ({
            ...prev,
            status: CALL_STATUS.CALLING,
            conversationId,
            caller: receiverInfo // Lúc này 'caller' đóng vai trò là người mình đang gọi (Receiver)
        }));

        // 2. Lấy quyền Camera ngay lập tức để hiện Preview
        const success = await getMediaStream();
        if (!success) {
            endCall(); // Nếu từ chối quyền thì tắt luôn
            alert("Không thể truy cập Camera/Microphone");
        }

        // 3. TODO: Gửi tín hiệu Socket/API báo cuộc gọi đi tại đây
    };

    const acceptCall = async () => {
        incomingRingTone.current.pause();
        // Khi nghe máy cũng cần lấy quyền camera
        await getMediaStream();
        setCallState(prev => ({ ...prev, status: CALL_STATUS.CONNECTED }));
        // TODO: Init WebRTC here
    };

    const declineCall = () => {
        incomingRingTone.current.pause();
        // Gửi API/Socket báo từ chối
        // axios.post('/api/video-call/decline', ...)
        resetCallState();
    };

    const endCall = () => {
        incomingRingTone.current.pause();
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        // Cleanup PeerConnection...
        resetCallState();
    };

    const resetCallState = () => {
        setCallState({
            status: CALL_STATUS.IDLE,
            conversationId: null,
            caller: null,
            isMicOn: true,
            isCamOn: true,
        });
    };

    // Toggle Mic/Cam Logic (Update trực tiếp vào track và state)
    const toggleMic = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
            setCallState(prev => ({ ...prev, isMicOn: !prev.isMicOn }));
        }
    };

    const toggleCam = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
            setCallState(prev => ({ ...prev, isCamOn: !prev.isCamOn }));
        }
    };

    // Context Value
    // const value = {
    //     callState,
    //     startCall,
    //     acceptCall,
    //     declineCall,
    //     endCall,
    //     toggleMic,
    //     toggleCam,
    //     localStreamRef, // Pass ref xuống Modal để attach vào video element
    //     remoteStreamRef
    // };

    return (
        <VideoCallContext.Provider value={{
            callState, startCall, acceptCall, declineCall, endCall,
            toggleMic, toggleCam, localStreamRef, remoteStreamRef
        }}>
            {children}
            <VideoCallModal />
        </VideoCallContext.Provider>
    );
}