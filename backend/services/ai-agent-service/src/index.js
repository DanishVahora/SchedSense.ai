const express = require('express');
const cors = require('cors');
const IntentRecognizer = require('./intentRecognizer');
const ContextAnalysisService = require('./ContextAnalysisService.js'); // Adjust the filename if needed
const app = express();
const port = 3000;


app.use(cors()); // Allow frontend requests
app.use(express.json());

const intentRecognizer = new IntentRecognizer();

class MockUserHistoryProvider {
    async getUserHistory(userId) {
        // Return realistic mock data instead of empty array
        return [
            {
                id: "apt_1",
                serviceType: "consultant",
                provider: "Dr. Johnson",
                datetime: "2025-05-25T08:30:00.000Z",
                duration: 60,
                status: "pending",
                rating: 5,
                bookingDate: "2025-05-13T10:00:00.000Z"
            },
            {
                id: "apt_2",
                serviceType: "consultant",
                provider: "Sarah Wilson",
                datetime: "2025-05-15T15:30:00.000Z",
                duration: 45,
                status: "completed",
                rating: 4,
                bookingDate: "2025-05-08T09:00:00.000Z"
            }
        ];
    }
}

class MockScheduleProvider {
    async getUserSchedule(userId) {
        // Return some existing appointments to test conflict detection
        return [
            {
                id: "meeting_1",
                title: "Team Meeting",
                datetime: "2025-05-24T15:00:00.000Z", // 3 PM today - should create conflict
                duration: 60
            },
            {
                id: "lunch_1",
                title: "Lunch Break",
                datetime: "2025-05-24T12:00:00.000Z", // 12 PM today
                duration: 60
            }
        ];
    }
}

class MockPreferencesProvider {
    async getUserPreferences(userId) {
        // Return user preferences instead of empty object
        return {
            preferredTimes: ["14:00", "15:00", "16:00"], // 2 PM, 3 PM, 4 PM
            preferredDays: ["tuesday", "wednesday", "thursday"],
            preferredLocations: ["downtown", "city center"],
            maxTravelDistance: 15,
            transportMode: "driving",
            preferredProviders: ["Dr. Johnson", "Sarah Wilson"],
            accessibility: ["parking", "elevator"],
            bufferTime: 15 // minutes between appointments
        };
    }
}

// Mock providers for demonstration
const mockProvider = {
    getUserHistory: async (userId) => [],
    getUserSchedule: async (userId) => [],
    getUserPreferences: async (userId) => ({}),
    getUserCalendar: async (userId) => []
};

const userHistoryProvider = new MockUserHistoryProvider();
const scheduleProvider = new MockScheduleProvider();
const preferencesProvider = new MockPreferencesProvider();

const contextAnalyzer = new ContextAnalysisService({
    userHistoryProvider,
    scheduleProvider,
    preferencesProvider,
    calendarProvider: mockProvider // keep as mock if you don't have a real one
});

app.post('/extract-intent', async (req, res) => {
    const { text, userId = 'demo-user' } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const intent = await intentRecognizer.recognizeIntent(text);
        // Use context analysis after intent recognition
        const context = await contextAnalyzer.analyze(userId, intent);

        res.json({ intent, context });
    } catch (error) {
        res.status(500).json({ error: 'Intent/context recognition failed', details: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ message: `AI Agent Service is running on ${port}` });
});

app.get('/health', (req, res) => {
    res.json({ status: 'AI Agent Service is healthy' });
});

app.listen(port, () => {
    console.log(`AI Agent Service running on port ${port}`);
});
