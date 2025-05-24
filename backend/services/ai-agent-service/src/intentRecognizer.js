class IntentRecognizer {
    constructor() {
        this.serviceTypes = {
            'doctor': ['doctor', 'physician', 'medical', 'clinic', 'healthcare', 'dentist', 'dermatologist'],
            'beauty': ['beauty', 'salon', 'hair', 'nail', 'spa', 'massage', 'facial'],
            'consultant': ['consultant', 'advisor', 'counselor', 'therapist', 'coach'],
            'general': ['appointment', 'meeting', 'session']
        };

        this.timeExpressions = {
            'today': ['today', 'this day'],
            'tomorrow': ['tomorrow', 'next day'],
            'next_week': ['next week', 'following week'],
            'specific_day': ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            'time_periods': ['morning', 'afternoon', 'evening', 'night'],
            'specific_times': /\b(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?\b/g
        };

        this.urgencyIndicators = {
            'high': ['urgent', 'emergency', 'asap', 'immediately', 'critical'],
            'medium': ['soon', 'this week', 'preferred', 'important'],
            'low': ['whenever', 'flexible', 'any time', 'convenient']
        };

        this.actionTypes = {
            'book': ['book', 'schedule', 'arrange', 'set up', 'make'],
            'reschedule': ['reschedule', 'change', 'move', 'shift'],
            'cancel': ['cancel', 'remove', 'delete']
        };
    }

    async recognizeIntent(transcribedText) {
        const normalizedText = transcribedText.toLowerCase();

        const intent = {
            action: this.extractAction(normalizedText),
            serviceType: this.extractServiceType(normalizedText),
            timePreference: this.extractTimePreference(normalizedText),
            urgencyLevel: this.extractUrgencyLevel(normalizedText),
            additionalInfo: this.extractAdditionalInfo(normalizedText),
            confidence: 0
        };

        intent.confidence = this.calculateConfidence(intent, normalizedText);

        if (intent.confidence < 0.7) {
            // Placeholder for NLP enhancement
            // intent = await this.enhanceWithNLP(transcribedText, intent);
        }

        return intent;
    }

    extractAction(text) {
        for (const [action, keywords] of Object.entries(this.actionTypes)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return action;
            }
        }
        return 'book';
    }

    extractServiceType(text) {
        const matches = [];

        for (const [service, keywords] of Object.entries(this.serviceTypes)) {
            const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
            if (matchCount > 0) {
                matches.push({ service, count: matchCount });
            }
        }

        if (matches.length > 0) {
            return matches.sort((a, b) => b.count - a.count)[0].service;
        }

        return 'general';
    }

    extractTimePreference(text) {
        const timeInfo = {
            day: null,
            time: null,
            period: null,
            relative: null
        };

        for (const [period, expressions] of Object.entries(this.timeExpressions)) {
            if (period === 'specific_times') continue;

            if (expressions.some(expr => text.includes(expr))) {
                if (period === 'specific_day') {
                    timeInfo.day = expressions.find(day => text.includes(day));
                } else if (period === 'time_periods') {
                    timeInfo.period = expressions.find(period => text.includes(period));
                } else {
                    timeInfo.relative = period;
                }
            }
        }

        const timeMatches = text.match(this.timeExpressions.specific_times);
        if (timeMatches) {
            timeInfo.time = timeMatches[0];
        }

        return timeInfo;
    }

    extractUrgencyLevel(text) {
        for (const [level, indicators] of Object.entries(this.urgencyIndicators)) {
            if (indicators.some(indicator => text.includes(indicator))) {
                return level;
            }
        }
        return 'medium';
    }

    extractAdditionalInfo(text) {
        const additionalInfo = {};

        const locationKeywords = ['near', 'close to', 'location', 'address'];
        if (locationKeywords.some(keyword => text.includes(keyword))) {
            additionalInfo.locationPreference = true;
        }

        const durationRegex = /(\d+)\s*(minute|hour|min|hr)s?/gi;
        const durationMatch = text.match(durationRegex);
        if (durationMatch) {
            additionalInfo.duration = durationMatch[0];
        }

        if (text.includes('with') || text.includes('dr.') || text.includes('doctor')) {
            const providerMatch = text.match(/(?:with|dr\.?)\s+([a-zA-Z\s]+)/i);
            if (providerMatch) {
                additionalInfo.preferredProvider = providerMatch[1].trim();
            }
        }

        return additionalInfo;
    }

    calculateConfidence(intent, text) {
        let confidence = 0;

        if (intent.action !== 'book') confidence += 0.2;
        else confidence += 0.1;

        if (intent.serviceType !== 'general') confidence += 0.3;
        else confidence += 0.1;

        if (intent.timePreference.day || intent.timePreference.time ||
            intent.timePreference.period || intent.timePreference.relative) {
            confidence += 0.3;
        }

        if (intent.urgencyLevel !== 'medium') confidence += 0.2;

        return Math.min(confidence, 1.0);
    }

    async enhanceWithNLP(text, baseIntent) {
        // Placeholder for future NLP API integration (e.g., Dialogflow, Hugging Face)
        return baseIntent;
    }
}

module.exports = IntentRecognizer;
