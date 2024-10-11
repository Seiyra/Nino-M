import { MongoClient } from 'mongodb';

// MongoDB configuration
const uri = 'mongodb+srv://itachi3mk:mypassis1199@cluster0.zzyxjo3.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);
const dbName = 'bankDatabase';
const collectionName = 'userBalances';

// Initialize the database connection
async function initDB() {
    if (!client.isConnected()) {
        await client.connect();
        console.log("Connected to MongoDB");
    }
    return client.db(dbName).collection(collectionName);
}

// Function to add money to users
async function addMoney(collection, userIds, amount) {
    for (const userId of userIds) {
        await collection.updateOne(
            { userId },
            { $inc: { balance: amount } },
            { upsert: true }
        );
    }
}

// Function to get total balance of all users
async function getTotalBalance(collection) {
    const users = await collection.find({}).toArray();
    return users.reduce((total, user) => total + (user.balance || 0), 0);
}

// Function to get personal balance of a user
async function getPersonalBalance(collection, userId) {
    const user = await collection.findOne({ userId });
    return user ? user.balance : 0;
}

// Command handler object with metadata
const commandHandler = {
    help: ["ضف", ".بنك", ".بنكي"],
    tags: ["banking"],
    limit: true,

    async ضف(args, from, isAdmin) {
        if (!isAdmin) {
            return "You don't have permission to use this command.";
        }

        const amountToAdd = parseInt(args[0]);
        const userIds = args.slice(1); // User IDs are expected after the amount

        if (isNaN(amountToAdd) || userIds.length === 0) {
            return "Please provide a valid amount and user IDs.";
        }

        const collection = await initDB();
        await addMoney(collection, userIds, amountToAdd);
        return `Added ${amountToAdd} to the specified users' balances.`;
    },

    async '.بنك'() {
        const collection = await initDB();
        const totalBalance = await getTotalBalance(collection);
        return `Total bank balance: ${totalBalance}`;
    },

    async '.بنكي'(from) {
        const collection = await initDB();
        const personalBalance = await getPersonalBalance(collection, from);
        return `Your personal bank balance: ${personalBalance}`;
    },
};

// Main command handler function
async function handleCommand(command, args, from, isAdmin) {
    if (commandHandler[command]) {
        return await commandHandler[command](args, from, isAdmin);
    }
    return "Unknown command.";
}

// Message handler for incoming messages
async function messageHandler(message, from, isAdmin) {
    const [command, ...args] = message.body.split(' '); // Adjust based on your message object structure

    const response = await handleCommand(command, args, from, isAdmin);
    if (response) {
        // Send response to the user (implement this part based on your bot's existing functionality)
        console.log(response); // For testing purposes, log it to the console or replace with your send message logic
    }
}

// Attach command and tag info
const handler = {
    help: ["bank"],
    tags: ["main"],
    command: ['بنكي', '.بنك', 'بنكي'],
    limit: true,
    messageHandler,
};

export default handler;
