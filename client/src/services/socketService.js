import io from 'socket.io-client';

class SocketService {
    socket;

    connect() {
        if (this.socket) return;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        this.socket = io(API_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });
    }

    joinUserRoom(userId) {
        if (!this.socket) return;
        this.socket.emit('join_user', userId);
    }

    joinMentorRoom(userId) {
        if (!this.socket) return;
        this.socket.emit('join_mentor', userId);
    }

    on(eventName, callback) {
        if (!this.socket) return;
        this.socket.on(eventName, callback);
    }

    off(eventName) {
        if (!this.socket) return;
        this.socket.off(eventName);
    }

    emit(eventName, data) {
        if (!this.socket) return;
        this.socket.emit(eventName, data);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

const socketService = new SocketService();
export default socketService;