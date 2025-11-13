    const { Server } = require('socket.io');

    // Declare a variable to hold the Socket.IO instance
    let io; 

    // Function to initialize the Socket.IO server
    const initSocketServer = (server) => {
        // 1. Create the Socket.IO Server, attaching it to the existing HTTP server
        io = new Server(server, {
            // 2. Configure CORS to allow connections from your frontend (replace with your frontend URL)
            cors: {
                // Allows all origins for simplicity in development (Recommended: specify your frontend origin)
                origin: "*", 
                methods: ["GET", "POST", "PUT", "DELETE"]
            }
        });

        // 3. Handle connections
        io.on('connection', (socket) => {
            console.log(`A user connected: ${socket.id}`);

            // You can handle initial data sending here if needed, or specific events

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });

        return io;
    };

    // Function to get the running instance of io   
    const getIo = () => {
        if (!io) {
            throw new Error("Socket.IO not initialized!");
        }
        return io;
    };

    module.exports = {
        initSocketServer,
        getIo
    };