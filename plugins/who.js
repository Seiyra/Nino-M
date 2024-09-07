import makeWASocket, { DisconnectReason, useMultiFileAuthState, jidDecode } from '@adiwajshing/baileys';
import { Boom } from '@hapi/boom';

const adminList = new Map(); // Store admin lists for each group

// Fetch and update the admin list for a group
async function fetchAndUpdateAdminList(sock, groupId) {
    try {
        const groupMetadata = await sock.groupMetadata(groupId);
        const admins = new Set(groupMetadata.participants.filter(p => p.admin).map(p => p.id));
        adminList.set(groupId, admins);
        return admins;
    } catch (error) {
        console.error('Error fetching admin list:', error);
        return new Set(); // Return an empty set in case of an error
    }
}

// Fetch and initialize admin lists for all groups the bot is a part of
async function fetchAllGroupsAdminLists(sock) {
    try {
        const groups = await sock.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);
        for (const groupId of groupIds) {
            await fetchAndUpdateAdminList(sock, groupId);
        }
        console.log('Admin lists for all groups updated.');
    } catch (error) {
        console.error('Error fetching all group metadata:', error);
    }
}

// Handle group participant updates (promotions/demotions)
async function handleParticipantUpdate(sock, update) {
    console.log('Group Participants Update Event:', update);

    const { id: groupId, participants, action } = update;

    // Fetch old and new admin lists
    const oldAdmins = adminList.get(groupId) || new Set();
    const newAdmins = await fetchAndUpdateAdminList(sock, groupId);

    console.log('Old Admins:', oldAdmins);
    console.log('New Admins:', newAdmins);

    // Find out who was promoted or demoted
    for (const participant of participants) {
        const user = jidDecode(participant)?.user || participant;

        // Get a list of current admins in the group to try and infer the admin responsible
        const currentGroupMetadata = await sock.groupMetadata(groupId);
        const currentAdmins = new Set(currentGroupMetadata.participants.filter(p => p.admin).map(p => p.id));

        if (action === 'promote') {
            if (newAdmins.has(participant) && !oldAdmins.has(participant)) {
                const responsibleAdmin = [...currentAdmins].find(admin => oldAdmins.has(admin));
                console.log(`User ${user} was promoted to admin by ${responsibleAdmin || 'an admin'}.`);
                await sock.sendMessage(groupId, { text: `User ${user} was promoted to admin by @${responsibleAdmin || 'an admin'}. 🎉`, mentions: [responsibleAdmin] });
            }
        } else if (action === 'demote') {
            if (oldAdmins.has(participant) && !newAdmins.has(participant)) {
                const responsibleAdmin = [...currentAdmins].find(admin => oldAdmins.has(admin));
                console.log(`User ${user} was demoted from admin by ${responsibleAdmin || 'an admin'}.`);
                await sock.sendMessage(groupId, { text: `User ${user} was demoted from admin by @${responsibleAdmin || 'an admin'}. 😔`, mentions: [responsibleAdmin] });
            }
        }
    }
}

// Initialize and connect to WhatsApp
async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    // Listen for connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed, reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                startSock();
            }
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp');
            // Fetch admin lists for all groups when the connection opens
            fetchAllGroupsAdminLists(sock);
        }
    });

    // Listen for participant updates (promote/demote)
    sock.ev.on('group-participants.update', async (update) => {
        await handleParticipantUpdate(sock, update);
    });

    // Save credentials
    sock.ev.on('creds.update', saveCreds);
}

startSock();
