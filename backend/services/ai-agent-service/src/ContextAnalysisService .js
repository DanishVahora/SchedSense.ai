class ContextAnalysisService {
    constructor({ userHistoryProvider, scheduleProvider, preferencesProvider, calendarProvider }) {
        this.userHistoryProvider = userHistoryProvider;
        this.scheduleProvider = scheduleProvider;
        this.preferencesProvider = preferencesProvider;
        this.calendarProvider = calendarProvider;
    }

    /**
     * Enhanced context analysis with proper temporal reasoning and pattern detection
     */
    async analyze(userId, intent) {
        try {
            // Parallel data fetching
            const [history, schedule, preferences, calendarData] = await Promise.all([
                this.userHistoryProvider.getUserHistory(userId),
                this.scheduleProvider.getUserSchedule(userId),
                this.preferencesProvider.getUserPreferences(userId),
                this.calendarProvider?.getUserCalendar(userId) || Promise.resolve([])
            ]);

            // Include pending/future appointments from history in conflict detection
            const now = new Date();
            const pendingHistory = history.filter(
                appt => appt.status === "pending" && new Date(appt.datetime) > now
            );
            const allSchedule = [...schedule, ...pendingHistory];

            // Enhanced temporal processing
            const temporalContext = this.processTemporalIntent(intent.timePreference);

            // Multi-dimensional conflict detection (pass provider)
            const conflicts = await this.findAdvancedConflicts(
                temporalContext,
                allSchedule,
                calendarData,
                intent.provider || intent.additionalInfo?.provider || null
            );
            
            // Pattern-based preferences
            const behaviorPatterns = this.analyzeBehaviorPatterns(history, preferences);
            
            // Provider intelligence
            const providerContext = this.buildProviderContext(intent, history, preferences);
            
            // --- Add this block to check for unknown provider ---
            let providerNotFound = false;
            let requestedProvider =
                intent.provider ||
                intent.additionalInfo?.provider ||
                intent.additionalInfo?.preferredProvider ||
                null;

            if (requestedProvider) {
                // Normalize for comparison
                const normalize = name =>
                    name ? name.replace(/^dr\.?\s*/i, '').trim().toLowerCase() : '';
                const normalizedRequested = normalize(requestedProvider);

                // Gather all known providers from history, preferences, and rankings
                const knownProviders = [
                    ...(history?.map(h => h.provider) || []),
                    ...(preferences?.preferredProviders || []),
                    ...(providerContext?.providerRankings?.map(p => p.provider) || [])
                ].map(normalize);

                if (!knownProviders.includes(normalizedRequested)) {
                    providerNotFound = true;
                }
            }

            // Smart suggestions with ranking
            const rankedSuggestions = this.generateRankedSuggestions(
                temporalContext, 
                conflicts, 
                behaviorPatterns, 
                providerContext,
                schedule
            );
            
            let returnObj = { // <-- Fix: add 'let' here
                userId,
                originalIntent: intent,
                temporalContext,
                conflicts,
                behaviorPatterns,
                providerContext,
                suggestions: rankedSuggestions,
                contextConfidence: this.calculateContextConfidence(temporalContext, conflicts, behaviorPatterns),
                metadata: {
                    analysisTimestamp: new Date().toISOString(),
                    dataSourcesUsed: this.getDataSourcesMetadata(history, schedule, preferences)
                }
            };

            if (providerNotFound) {
                returnObj.warning = `Requested provider "${requestedProvider}" not found. Please choose from available providers.`;
                returnObj.availableProviders = [
                    ...new Set([
                        ...(history?.map(h => h.provider) || []),
                        ...(preferences?.preferredProviders || []),
                        ...(providerContext?.providerRankings?.map(p => p.provider) || [])
                    ])
                ];
            }

            return returnObj;
        } catch (error) {
            console.error('Context analysis failed:', error);
            return this.generateFallbackContext(userId, intent);
        }
    }

    /**
     * Convert natural language time expressions to specific datetime objects
     */
    processTemporalIntent(timePreference) {
        console.log('Processing temporal intent:', timePreference); // Debug log
        
        const now = new Date();
        const context = {
            requestedSlots: [],
            timeWindow: null,
            flexibility: 'medium',
            constraints: [],
            duration: timePreference.duration || 30 // Default to 30 minutes if not provided
        };
    
        // Handle relative dates first
        let targetDate = new Date();
        if (timePreference.relative) {
            switch (timePreference.relative) {
                case 'today':
                    targetDate = new Date();
                    targetDate.setHours(0, 0, 0, 0);
                    context.timeWindow = {
                        start: new Date(targetDate),
                        end: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
                    };
                    break;
                case 'tomorrow':
                    targetDate = new Date();
                    targetDate.setDate(targetDate.getDate() + 1);
                    targetDate.setHours(0, 0, 0, 0);
                    context.timeWindow = {
                        start: new Date(targetDate),
                        end: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
                    };
                    break;
                case 'next_week':
                    targetDate = new Date();
                    targetDate.setDate(targetDate.getDate() + 7);
                    targetDate.setHours(0, 0, 0, 0);
                    context.timeWindow = {
                        start: new Date(targetDate),
                        end: new Date(targetDate.getTime() + 7 * 24 * 60 * 60 * 1000)
                    };
                    context.flexibility = 'high';
                    break;
            }
        }
    
        // Handle specific day
        if (timePreference.day) {
            targetDate = this.getNextDateForDay(timePreference.day);
            context.timeWindow = {
                start: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
                end: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)
            };
        }
    
        // Handle specific time - FIXED
        if (timePreference.time) {
            const { hour, minute } = this.parseSpecificTime(timePreference.time);
            if (hour !== null && minute !== null) {
                // Use the target date (today/tomorrow) but with the specific time
                let finalDateTime = new Date(
                    targetDate.getFullYear(),
                    targetDate.getMonth(), 
                    targetDate.getDate(),
                    hour,
                    minute
                );
                // If the slot is today and already passed, move to tomorrow
                const now = new Date();
                if (
                    timePreference.relative === 'today' &&
                    finalDateTime.getTime() <= now.getTime()
                ) {
                    finalDateTime.setDate(finalDateTime.getDate() + 1);
                    // Also update timeWindow to tomorrow
                    targetDate.setDate(targetDate.getDate() + 1);
                    targetDate.setHours(0, 0, 0, 0);
                    context.timeWindow = {
                        start: new Date(targetDate),
                        end: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
                    };
                }
                context.requestedSlots = [finalDateTime];
                context.requestedSlotsIST = [
                    finalDateTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                ];
                context.flexibility = 'low';
                console.log('Final requested slot:', finalDateTime); // Debug log
            }
        }
    
        // Handle time periods
        if (timePreference.period) {
            const timeSlots = this.getTimeSlotsForPeriod(timePreference.period, targetDate);
            context.requestedSlots = timeSlots;
            context.requestedSlotsIST = timeSlots.map(slot =>
                slot.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            );
        }
    
        console.log('Final temporal context:', context); // Debug log
        return context;
    }
    
    /**
     * Advanced conflict detection with time buffers and travel time
     */
    normalizeProviderName(name) {
        if (!name) return '';
        return name
            .replace(/^dr\.?\s*/i, '') // Remove "Dr." prefix (case-insensitive)
            .trim()
            .toLowerCase();
    }

    async findAdvancedConflicts(temporalContext, schedule, calendarData, requestedProvider) {
        const conflicts = [];
        const bufferMinutes = 30; // Default buffer time
    
        // Normalize the requested provider name
        const normalizedRequestedProvider = this.normalizeProviderName(requestedProvider);
    
        if (!temporalContext.timeWindow && temporalContext.requestedSlots.length === 0) {
            return conflicts; // Ensure this returns an array
        }
    
        // Check against existing appointments
        const allAppointments = [...schedule, ...calendarData];
    
        for (const requestedSlot of temporalContext.requestedSlots) {
            for (const appointment of allAppointments) {
                // Normalize appointment provider name
                const normalizedAppointmentProvider = this.normalizeProviderName(appointment.provider);
    
                // Ensure the provider is known
                const isKnown = await this.isKnownProvider(normalizedAppointmentProvider);
                if (!isKnown) {
                    continue; // Skip if provider is not known
                }
    
                // Only check for conflict if provider matches (normalized)
                if (
                    normalizedRequestedProvider &&
                    normalizedAppointmentProvider &&
                    normalizedRequestedProvider !== normalizedAppointmentProvider
                ) {
                    continue; // Skip if provider is different
                }
    
                const appointmentTime = new Date(appointment.datetime || appointment.time);
                const requestedTime = new Date(requestedSlot);
    
                // Calculate end times using durations
                const appointmentEnd = new Date(appointmentTime.getTime() + (appointment.duration || 30) * 60000);
                const requestedEnd = new Date(requestedTime.getTime() + (temporalContext.duration || 30) * 60000);
    
                // Check for overlap
                if (
                    (requestedTime < appointmentEnd && requestedEnd > appointmentTime)
                ) {
                    conflicts.push({
                        type: 'time_conflict',
                        conflictingAppointment: appointment,
                        requestedSlot: requestedSlot,
                        bufferNeeded: bufferMinutes,
                        severity: 'high'
                    });
                }
            }
        }
    
        return conflicts; // Ensure this returns an array
    }

    // Helper method to check if a provider is known
    async isKnownProvider(providerName) {
        // Fetch user history and map over the result
        const history = await this.userHistoryProvider.getUserHistory();
        const historyProviders = history.map(h => this.normalizeProviderName(h.provider));
    
        const knownProviders = [
            ...historyProviders,
            ...(this.preferencesProvider?.preferredProviders?.map(this.normalizeProviderName) || []),
            ...(this.providerContext?.providerRankings?.map(p => this.normalizeProviderName(p.provider)) || [])
        ];
    
        return knownProviders.includes(providerName);
    }

    /**
     * Analyze user behavior patterns from historical data
     */
    analyzeBehaviorPatterns(history, preferences) {
        if (!history || history.length === 0) {
            return this.getDefaultBehaviorPatterns(preferences);
        }

        const patterns = {
            preferredTimeSlots: this.extractPreferredTimeSlots(history),
            bookingLeadTime: this.calculateAverageLeadTime(history),
            cancellationRate: this.calculateCancellationRate(history),
            preferredProviders: this.extractPreferredProviders(history),
            seasonalPatterns: this.detectSeasonalPatterns(history),
            appointmentDuration: this.calculateAverageAppoiintmentType(history)
        };

        return patterns;
    }

    /**
     * Build provider-specific context
     */
    buildProviderContext(intent, history, preferences) {
        const context = {
            serviceTypeContext: this.getServiceTypeContext(intent.serviceType, history),
            locationPreferences: this.extractLocationPreferences(history, preferences),
            providerRankings: this.rankProvidersForUser(history, preferences),
            specialRequirements: this.extractSpecialRequirements(intent, preferences)
        };

        return context;
    }

    /**
     * Generate ranked suggestions based on all context factors
     */
    generateRankedSuggestions(temporalContext, conflicts, behaviorPatterns, providerContext, schedule) {
        const suggestions = [];
        const now = new Date();

        // Generate time slot suggestions
        const availableSlots = this.generateAvailableTimeSlots(temporalContext, conflicts, schedule);

        availableSlots.forEach(slot => {
            const suggestion = {
                datetime: slot,
                score: 0,
                reasons: [],
                providerRecommendations: []
            };

            // Score based on user preferences
            if (this.matchesPreferredTimeSlots(slot, behaviorPatterns.preferredTimeSlots)) {
                suggestion.score += 30;
                suggestion.reasons.push('Matches your usual booking times');
            }

            // Score based on optimal lead time
            const leadTime = (slot - now) / (1000 * 60 * 60 * 24); // days
            if (Math.abs(leadTime - behaviorPatterns.bookingLeadTime) < 3) {
                suggestion.score += 20;
                suggestion.reasons.push('Optimal booking timeframe for you');
            }

            // Score based on provider availability (placeholder)
            suggestion.score += 10; // Base availability score

            suggestions.push(suggestion);
        });

        // Sort by score and return top suggestions
        return suggestions
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }

    /**
     * Helper methods
     */
    getNextDateForDay(dayName) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDay = days.indexOf(dayName.toLowerCase());
        const today = new Date();
        const currentDay = today.getDay();
        
        let daysUntilTarget = targetDay - currentDay;
        if (daysUntilTarget <= 0) {
            daysUntilTarget += 7; // Next week
        }
        
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysUntilTarget);
        return targetDate;
    }

    getTimeSlotsForPeriod(period, targetDate = new Date()) {
        const slots = [];
        
        switch (period) {
            case 'morning':
                for (let hour = 9; hour <= 11; hour++) {
                    slots.push(new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), hour, 0));
                }
                break;
            case 'afternoon':
                for (let hour = 13; hour <= 16; hour++) {
                    slots.push(new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), hour, 0));
                }
                break;
            case 'evening':
                for (let hour = 17; hour <= 19; hour++) {
                    slots.push(new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), hour, 0));
                }
                break;
        }
        
        return slots;
    }
    
    parseSpecificTime(timeString) {
        // Returns { hour, minute }
        const timeRegex = /(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?/;
        const match = timeString.match(timeRegex);

        if (match) {
            let hour = parseInt(match[1]);
            const minute = parseInt(match[2] || '0');
            const ampm = match[3]?.toLowerCase();

            if (ampm === 'pm' && hour !== 12) {
                hour += 12;
            } else if (ampm === 'am' && hour === 12) {
                hour = 0;
            }
            return { hour, minute };
        }
        return { hour: null, minute: null };
    }
    generateAvailableTimeSlots(temporalContext, conflicts, schedule) {
        // Generate available slots based on temporal context and conflicts
        const slots = [];
        const conflictTimes = conflicts.map(c => new Date(c.requestedSlot));
        
        if (temporalContext.requestedSlots.length > 0) {
            temporalContext.requestedSlots.forEach(slot => {
                if (!conflictTimes.some(ct => Math.abs(ct - slot) < 30 * 60 * 1000)) {
                    slots.push(slot);
                }
            });
        }
        
        return slots;
    }

    matchesPreferredTimeSlots(slot, preferredSlots) {
        if (!preferredSlots || preferredSlots.length === 0) return false;
        
        const slotHour = slot.getHours();
        return preferredSlots.some(preferred => 
            Math.abs(preferred.hour - slotHour) <= 1
        );
    }

    calculateContextConfidence(temporalContext, conflicts, behaviorPatterns) {
        let confidence = 0.5; // Base confidence
        
        if (temporalContext.requestedSlots.length > 0) confidence += 0.2;
        if (conflicts.length === 0) confidence += 0.2;
        if (behaviorPatterns.preferredTimeSlots.length > 0) confidence += 0.1;
        
        return Math.min(confidence, 1.0);
    }

    getDataSourcesMetadata(history, schedule, preferences) {
        return {
            historyRecords: history?.length || 0,
            scheduleEntries: schedule?.length || 0,
            preferencesSet: preferences ? Object.keys(preferences).length : 0
        };
    }

    generateFallbackContext(userId, intent) {
        return {
            userId,
            originalIntent: intent,
            temporalContext: { requestedSlots: [], flexibility: 'high' },
            conflicts: [],
            behaviorPatterns: this.getDefaultBehaviorPatterns(),
            suggestions: [{ 
                message: 'Unable to analyze context, will provide basic scheduling options',
                score: 50 
            }],
            contextConfidence: 0.3,
            fallback: true
        };
    }

    getDefaultBehaviorPatterns(preferences = {}) {
        return {
            preferredTimeSlots: preferences.preferredTimes?.map(time => ({ hour: parseInt(time) })) || [],
            bookingLeadTime: 7, // days
            cancellationRate: 0.1,
            preferredProviders: [],
            appointmentDuration: 30 // minutes
        };
    }

    // Placeholder methods for pattern analysis
    extractPreferredTimeSlots(history) {
        return history.map(appointment => ({
            hour: new Date(appointment.datetime).getHours(),
            count: 1
        }));
    }

    calculateAverageLeadTime(history) {
        if (history.length === 0) return 7;
        
        const leadTimes = history.map(appointment => {
            const bookingDate = new Date(appointment.bookingDate);
            const appointmentDate = new Date(appointment.datetime);
            return (appointmentDate - bookingDate) / (1000 * 60 * 60 * 24);
        });
        
        return leadTimes.reduce((sum, time) => sum + time, 0) / leadTimes.length;
    }

    calculateCancellationRate(history) {
        const cancelled = history.filter(appointment => appointment.status === 'cancelled').length;
        return cancelled / history.length;
    }

    extractPreferredProviders(history) {
        const providerCounts = {};
        history.forEach(appointment => {
            if (appointment.provider) {
                providerCounts[appointment.provider] = (providerCounts[appointment.provider] || 0) + 1;
            }
        });
        
        return Object.entries(providerCounts)
            .sort(([,a], [,b]) => b - a)
            .map(([provider, count]) => ({ provider, count }));
    }

    detectSeasonalPatterns(history) {
        // Analyze seasonal booking patterns
        const monthCounts = {};
        history.forEach(appointment => {
            const month = new Date(appointment.datetime).getMonth();
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });
        return monthCounts;
    }

    calculateAverageAppoiintmentType(history) {
        const durations = history.map(appointment => appointment.duration || 30);
        return durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
    }

    getServiceTypeContext(serviceType, history) {
        return {
            serviceType,
            pastExperience: history.filter(appointment => 
                appointment.serviceType === serviceType
            ).length > 0,
            averageDuration: 30 // placeholder
        };
    }

    extractLocationPreferences(history, preferences) {
        return {
            preferredLocations: preferences.preferredLocations || [],
            maxTravelDistance: preferences.maxTravelDistance || 10,
            transportMode: preferences.transportMode || 'driving'
        };
    }

    rankProvidersForUser(history, preferences) {
        // Combine historical satisfaction with stated preferences
        const rankings = [];
        
        // Add historical providers with ratings
        const historicalProviders = this.extractPreferredProviders(history);
        historicalProviders.forEach(provider => {
            rankings.push({
                provider: provider.provider,
                score: provider.count * 10, // Simple scoring
                reason: 'Previous positive experience'
            });
        });
        
        return rankings;
    }

    extractSpecialRequirements(intent, preferences) {
        const requirements = [];
        
        if (intent.additionalInfo?.locationPreference) {
            requirements.push('location_specific');
        }
        
        if (intent.additionalInfo?.preferredProvider) {
            requirements.push('provider_specific');
        }
        
        if (preferences?.accessibility) {
            requirements.push('accessibility_needs');
        }
        
        return requirements;
    }
}

module.exports = ContextAnalysisService;