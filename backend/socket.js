/**
 * Socket.IO Handler - Real-time bidirectional communication
 * 
 * Events: identity (user connection), updateLocation (delivery tracking)
 * Features: User socket ID storage, delivery boy location broadcasts
 * Used for order status updates, delivery tracking, new order notifications
 */
import User from "./models/user.model.js";
export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("identity", async ({ userId }) => {
      try {
        await User.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true,
          },
          { new: true }
        );
        
        socket.join(userId);
      } catch (error) {
        console.error("Identity error:", error);
      }
    });

    socket.on("updateLocation", async ({ latitude, longitude, userId }) => {
      try {
        await User.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          isOnline: true,
          socketId: socket.id,
        });

        if (userId) {
          io.emit("updateDeliveryLocation", {
            deliveryBoyId: userId,
            latitude,
            longitude,
          });
        }
      } catch (error) {
        console.error("updateDeliveryLocation error", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          {
            socketId: null,
            isOnline: false,
          }
        );
      } catch (error) {
        console.error(error);
      }
    });
  });
};
