class IntentRecognizer {
    constructor() {
        this.serviceTypes = {
            doctor: ['doctor', 'physician', 'medical', 'clinic', 'healthcare', 'dentist', 'dermatologist'],
            beauty: ['beauty', 'salon', 'hair', 'nail', 'spa', 'massage', 'facial'],
            consultant: ['consultant', 'advisor', 'counselor', 'therapist', 'coach'],
            general: ['appointment', 'meeting', 'session']
        };

        this.timeExpressions = {
            today: ['today', 'this day'],
            tomorrow: ['tomorrow', 'next day'],
            next_week: ['next week', 'following week'],
            specific_day: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            time_periods: ['morning', 'afternoon', 'evening', 'night'],
            specific_times: /\b(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?\b/g
        };

        this.urgencyIndicators = {
            high: ['urgent', 'emergency', 'asap', 'immediately', 'critical'],
            medium: ['soon', 'this week', 'preferred', 'important'],
            low: ['whenever', 'flexible', 'any time', 'convenient']
        };

        this.actionTypes = {
            book: ['book', 'schedule', 'arrange', 'set up', 'make'],
            reschedule: ['reschedule', 'change', 'move', 'shift'],
            cancel: ['cancel', 'remove', 'delete']
        };

        this.locationKeywords = ['near', 'close to', 'location', 'address'];
        this.durationRegex = /(\d+)\s*(minute|hour|min|hr)s?/gi;
        this.providerRegex = /(?:with|dr\.?)\s+([a-zA-Z\s]+)/i;

    }

    async recognizeIntent(transcribedText) {
        const normalizedText = transcribedText.toLowerCase();

        const intent = {
            action: this.extractFromKeywords(normalizedText, this.actionTypes, 'book'),
            serviceType: this.extractServiceType(normalizedText),
            timePreference: this.extractTimePreference(normalizedText),
            urgencyLevel: this.extractFromKeywords(normalizedText, this.urgencyIndicators, 'medium'),

            additionalInfo: this.extractAdditionalInfo(normalizedText),
            confidence: 0
        };

        intent.confidence = this.calculateConfidence(intent);

        if (intent.confidence < 0.7) {
            // Placeholder for NLP enhancement
            // intent = await this.enhanceWithNLP(transcribedText, intent);
        }

        return intent;
    }

    extractFromKeywords(text, keywordMap, defaultValue) {
        for (const [key, keywords] of Object.entries(keywordMap)) {
            if (keywords.some(keyword => this.containsWord(text, keyword))) {
                return key;
            }
        }
        return defaultValue;
    }

    extractServiceType(text) {
        let bestMatch = { service: 'general', count: 0 };
        for (const [service, keywords] of Object.entries(this.serviceTypes)) {
            const matchCount = keywords.reduce((count, keyword) => 
                count + (this.containsWord(text, keyword) ? 1 : 0), 0);
            if (matchCount > bestMatch.count) {
                bestMatch = { service, count: matchCount };
            }
        }
        return bestMatch.service;
    }

    extractTimePreference(text) {
        const timeInfo = { day: null, time: null, period: null, relative: null };

        for (const [period, expressions] of Object.entries(this.timeExpressions)) {
            if (period === 'specific_times') continue;
            if (expressions.some(expr => this.containsWord(text, expr))) {
                if (period === 'specific_day') {
                    timeInfo.day = expressions.find(day => this.containsWord(text, day));
                } else if (period === 'time_periods') {
                    timeInfo.period = expressions.find(period => this.containsWord(text, period));

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

    extractAdditionalInfo(text) {
        const additionalInfo = {};

        if (this.locationKeywords.some(keyword => this.containsWord(text, keyword))) {
            additionalInfo.locationPreference = true;
        }

        const durationMatch = text.match(this.durationRegex);
        if (/with|dr\.?|doctor/.test(text)) {
            const providerMatch = text.match(this.providerRegex);

            if (providerMatch) {
                additionalInfo.preferredProvider = providerMatch[1].trim();
            }
        }

        return additionalInfo;
    }

    containsWord(text, word) {
        // Use word boundaries for more accurate matching
        const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(text);
    }

    calculateConfidence(intent) {
        let confidence = 0;
        confidence += intent.action !== 'book' ? 0.2 : 0.1;
        confidence += intent.serviceType !== 'general' ? 0.3 : 0.1;

        if (intent.timePreference.day || intent.timePreference.time ||
            intent.timePreference.period || intent.timePreference.relative) {
            confidence += 0.3;
        }
        confidence += intent.urgencyLevel !== 'medium' ? 0.2 : 0;

        if (intent.urgencyLevel !== 'medium') confidence += 0.2;

        return Math.min(confidence, 1.0);
    }

    async enhanceWithNLP(text, baseIntent) {
        // Placeholder for future NLP API integration (e.g., Dialogflow, Hugging Face)
        return baseIntent;
    }
}

module.exports = IntentRecognizer;
