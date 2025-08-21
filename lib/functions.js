// lib/functions.js
const fs = require('fs');
const os = require('os');
const util = require('util');
const { exec } = require("child_process");
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    /**
     * Format process uptime to human readable format
     * @param {number} seconds - Uptime in seconds
     * @returns {string} Formatted uptime
     */
    runtime: function(seconds) {
        seconds = Number(seconds);
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor(seconds % (3600 * 24) / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        const s = Math.floor(seconds % 60);
        
        const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    },

    /**
     * Format bytes to human readable format
     * @param {number} bytes - Number of bytes
     * @returns {string} Formatted size
     */
    formatp: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Check if a string is a valid URL
     * @param {string} url - String to check
     * @returns {boolean} True if valid URL
     */
    isUrl: function(url) {
        if (!url) return false;
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Download content from a message
     * @param {object} message - WhatsApp message object
     * @param {string} type - Type of content ('image', 'video', 'audio')
     * @returns {Promise} Stream of content
     */
    downloadContentFromMessage: async function(message, type) {
        // This is a simplified implementation
        // In a real WhatsApp bot library, this would use the library's built-in methods
        return {
            [Symbol.asyncIterator]: async function* () {
                // In a real implementation, this would yield chunks of data from the message
                if (message.url) {
                    // If the message has a direct URL, download from it
                    try {
                        const response = await axios({
                            method: 'GET',
                            url: message.url,
                            responseType: 'stream'
                        });
                        
                        for await (const chunk of response.data) {
                            yield chunk;
                        }
                    } catch (error) {
                        console.error('Error downloading media:', error);
                    }
                } else if (message.directPath) {
                    // Alternative approach for some WhatsApp web implementations
                    try {
                        // This would be implementation-specific based on your WhatsApp library
                        const mediaData = await downloadMediaFromDirectPath(message.directPath);
                        yield mediaData;
                    } catch (error) {
                        console.error('Error downloading media from direct path:', error);
                    }
                } else {
                    // Fallback: return mock data
                    yield Buffer.from('mock media data');
                }
            }
        };
    },

    /**
     * Execute shell command
     * @param {string} cmd - Command to execute
     * @returns {Promise} Promise with stdout and stderr
     */
    execute: function(cmd) {
        return new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve({ stdout, stderr });
            });
        });
    },

    /**
     * Generate random ID
     * @param {number} length - Length of ID
     * @returns {string} Random ID
     */
    generateId: function(length = 16) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },

    /**
     * Delay execution
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after delay
     */
    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Get formatted time
     * @returns {string} Formatted time string
     */
    getTime: function() {
        const now = new Date();
        return now.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    },

    /**
     * Get formatted date
     * @returns {string} Formatted date string
     */
    getDate: function() {
        const now = new Date();
        return now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Check if user is admin in group
     * @param {object} m - Message object
     * @param {string} userId - User ID to check
     * @returns {boolean} True if user is admin
     */
    isAdmin: async function(m, userId) {
        if (!m.isGroup) return false;
        try {
            const metadata = await HazelXmichie.groupMetadata(m.chat);
            const participants = metadata.participants;
            const user = participants.find(p => p.id === userId);
            return user && user.admin;
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    },

    /**
     * Parse mention users from message
     * @param {object} m - Message object
     * @returns {Array} Array of mentioned user IDs
     */
    getMentionedUsers: function(m) {
        const mentionedUsers = [];
        if (m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo) {
            const mentionedJids = m.message.extendedTextMessage.contextInfo.mentionedJid || [];
            mentionedJids.forEach(jid => {
                if (jid) mentionedUsers.push(jid);
            });
        }
        return mentionedUsers;
    },

    /**
     * Upload file to temporary storage
     * @param {Buffer} buffer - File buffer
     * @param {string} filename - File name
     * @returns {Promise<string>} URL of uploaded file
     */
    uploadFile: async function(buffer, filename) {
        try {
            const form = new FormData();
            form.append('file', buffer, filename);
            
            const response = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
                headers: form.getHeaders()
            });
            
            if (response.data.data.url) {
                return response.data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
            }
            throw new Error('Upload failed');
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    },

    /**
     * Fetch JSON from URL
     * @param {string} url - URL to fetch
     * @returns {Promise<object>} JSON data
     */
    fetchJson: async function(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching JSON:', error);
            throw error;
        }
    },

    /**
     * Fetch text from URL
     * @param {string} url - URL to fetch
     * @returns {Promise<string>} Text data
     */
    fetchText: async function(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching text:', error);
            throw error;
        }
    },

    /**
     * Check if string is numeric
     * @param {string} str - String to check
     * @returns {boolean} True if numeric
     */
    isNumeric: function(str) {
        return !isNaN(str) && !isNaN(parseFloat(str));
    },

    /**
     * Format number with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

// Helper function for media download (implementation will vary based on your WhatsApp library)
async function downloadMediaFromDirectPath(directPath) {
    // This is a placeholder implementation
    // The actual implementation depends on your WhatsApp library
    try {
        // Most WhatsApp libraries have their own method for this
        // For example, in Baileys: await downloadContentFromMessage(message, type)
        return Buffer.from('media data from direct path');
    } catch (error) {
        console.error('Error downloading media from direct path:', error);
        throw error;
    }
}
