import { useState, useEffect, useCallback } from "react";
import queueService from "../services/queueService";
import useSocketStore from "../store/socketStore";

/**
 * useQueue
 * Manages real-time queue state for a given doctor/hospital.
 *
 * Usage:
 *   const { queue, myToken, loading, joinQueue, leaveQueue } = useQueue(doctorId);
 */
const useQueue = (doctorId = null) => {
  const [queue, setQueue] = useState([]);
  const [myToken, setMyToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { socket } = useSocketStore();

  const fetchQueue = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await queueService.getQueue(doctorId);
      setQueue(data.queue || []);
      setMyToken(data.myToken || null);
    } catch (err) {
      setError(err.message || "Failed to fetch queue.");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Real-time queue updates
  useEffect(() => {
    if (!socket || !doctorId) return;

    socket.emit("join-queue-room", doctorId);

    socket.on("queue-updated", (updatedQueue) => {
      setQueue(updatedQueue);
    });

    socket.on("token-called", (token) => {
      if (myToken?.tokenNumber === token.tokenNumber) {
        // Browser notification / toast can be triggered here
        console.log("Your turn!", token);
      }
    });

    return () => {
      socket.off("queue-updated");
      socket.off("token-called");
      socket.emit("leave-queue-room", doctorId);
    };
  }, [socket, doctorId]);

  const joinQueue = async (payload) => {
    try {
      const token = await queueService.joinQueue(doctorId, payload);
      setMyToken(token);
      return token;
    } catch (err) {
      setError(err.message || "Failed to join queue.");
      throw err;
    }
  };

  const leaveQueue = async () => {
    try {
      await queueService.leaveQueue(myToken?._id);
      setMyToken(null);
    } catch (err) {
      setError(err.message || "Failed to leave queue.");
      throw err;
    }
  };

  const advanceQueue = async () => {
    try {
      const updated = await queueService.advanceQueue(doctorId);
      setQueue(updated);
    } catch (err) {
      setError(err.message || "Failed to advance queue.");
      throw err;
    }
  };

  return { queue, myToken, loading, error, joinQueue, leaveQueue, advanceQueue, refetch: fetchQueue };
};

export default useQueue;