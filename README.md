# SchedSense.ai 📅✨

<div align="center">

![SchedSense.ai Logo](assets/frontend/public/travel-planning-demo.png)

[![TypeScript](https://img.shields.io/badge/TypeScript-76.4%25-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-14.7%25-green)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-5.1%25-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**An intelligent scheduling platform powered by AI to optimize your time and productivity**

[Key Features](#key-features) • [Demo](#live-demo) • [Installation](#installation) • [Usage](#usage) • [API](#api) • [Contributing](#contributing) • [License](#license)

</div>

## 🌟 Overview

SchedSense.ai is an intelligent scheduling and time management platform that leverages artificial intelligence to help individuals and teams optimize their schedules. By analyzing patterns, preferences, and priorities, SchedSense.ai provides smart scheduling recommendations to maximize productivity and work-life balance.

<div align="center">
  <img src="assets/screenshot.png" alt="SchedSense.ai Dashboard" width="80%">
</div>

## ✨ Key Features

- **AI-Powered Scheduling**: Intelligent algorithm that learns your preferences and optimizes your calendar
- **Smart Calendar Integration**: Seamless integration with popular calendar services
- **Meeting Optimization**: Suggests ideal meeting times based on participants' availability and preferences
- **Priority-Based Scheduling**: Automatically allocates time for high-priority tasks
- **Focus Time Protection**: Guards your deep work sessions from interruptions
- **Real-Time Collaboration**: Team scheduling with conflict resolution
- **Productivity Analytics**: Insights into time usage patterns and productivity metrics
- **Customizable Workflows**: Adapt the system to your unique scheduling needs
- **Cross-Platform Support**: Available on web, desktop, and mobile devices

## 🚀 Live Demo

Experience SchedSense.ai in action: [demo.schedsense.ai](https://demo.schedsense.ai)

## 💻 Technologies Used

SchedSense.ai is built using a modern tech stack:

| Component | Technologies |
|-----------|-------------|
| **Frontend** | TypeScript, React, Next.js |
| **Backend** | Python, FastAPI |
| **Database** | MongoDB, Redis |
| **AI/ML** | TensorFlow, scikit-learn |
| **DevOps** | Docker, GitHub Actions |
| **Authentication** | OAuth 2.0, JWT |
| **Cloud Services** | AWS/Azure/GCP |

## 📦 Installation

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- Docker and Docker Compose
- MongoDB
- Redis

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/DanishVahora/SchedSense.ai.git
cd SchedSense.ai
```

2. **Install frontend dependencies**

```bash
cd frontend
npm install
```

3. **Install backend dependencies**

```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. **Set up environment variables**

```bash
# Frontend (.env.local)
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your configuration

# Backend (.env)
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

5. **Start the application with Docker**

```bash
docker-compose up
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection URL | `mongodb://localhost:27017/schedsense` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `JWT_SECRET` | Secret for JWT authentication | N/A (required) |
| `AI_MODEL_PATH` | Path to trained AI model | `./models/scheduler_v3.h5` |
| `PORT` | Port for the API server | `8000` |

### Customization

SchedSense.ai can be customized via the `config.yml` file:

```yaml
scheduling:
  default_meeting_duration: 30  # minutes
  min_focus_block: 90  # minutes
  buffer_between_meetings: 15  # minutes

ai:
  learning_rate: 0.002
  model_update_frequency: "weekly"
  confidence_threshold: 0.75
```

## 📝 Usage

### Quick Start Guide

1. **Sign up or log in** to your SchedSense.ai account
2. **Connect your calendars** via the integrations page
3. **Set your preferences** including working hours, focus time, and meeting preferences
4. **Create your first schedule** by clicking "Generate Optimal Schedule"
5. **Review and adjust** the AI-generated schedule as needed
6. **Sync back** to your connected calendars

### Code Example: Custom Schedule Integration

```typescript
import { SchedSenseClient } from '@schedsense/client';

const client = new SchedSenseClient({
  apiKey: 'YOUR_API_KEY',
  userId: 'user_123'
});

// Get optimized schedule for next week
const schedule = await client.generateSchedule({
  startDate: '2025-06-01',
  endDate: '2025-06-07',
  priorities: [
    { taskId: 'task_1', weight: 0.8 },
    { taskId: 'task_2', weight: 0.5 }
  ],
  constraints: [
    { type: 'focus-time', minimumHours: 4 }
  ]
});

console.log(schedule.events);
console.log(schedule.metrics.productivityScore);
```

## 🔄 Integration Options

SchedSense.ai integrates with:

- Google Calendar
- Microsoft Outlook
- Apple Calendar
- Zoom
- Microsoft Teams
- Slack
- Notion
- Trello
- Asana
- Jira

## 📊 Analytics Dashboard

Get comprehensive insights about your time usage with our analytics dashboard:

- Time allocation by project/category
- Focus time vs. meeting time
- Productivity score trends
- Meeting efficiency metrics
- Work pattern analysis

<div align="center">
  <img src="assets/analytics.png" alt="SchedSense.ai Analytics" width="70%">
</div>

## 🧠 AI Features

SchedSense.ai uses several AI capabilities:

- **Pattern Recognition**: Learns from your past scheduling preferences
- **Predictive Scheduling**: Anticipates optimal times for different types of work
- **Natural Language Processing**: Interprets meeting requests and emails to automate scheduling
- **Adaptive Optimization**: Continuously improves scheduling recommendations based on feedback

## 🌐 API Reference

SchedSense.ai provides a comprehensive REST API for developers:

### Base URL

```
https://api.schedsense.ai/v1
```

### Authentication

```bash
curl -X POST https://api.schedsense.ai/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

### Example Endpoints

```
GET    /schedules             # List all schedules
POST   /schedules             # Create new schedule
GET    /schedules/{id}        # Get schedule by ID
PUT    /schedules/{id}        # Update schedule
DELETE /schedules/{id}        # Delete schedule
POST   /schedules/optimize    # Generate optimized schedule
GET    /analytics             # Get analytics data
```

[Full API Documentation](https://docs.schedsense.ai/api)

## 🔒 Security

SchedSense.ai prioritizes the security of your data:

- End-to-end encryption
- GDPR compliance
- SOC 2 compliance
- Regular security audits
- Two-factor authentication
- Data deletion options

## 💪 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to:

- Report bugs
- Request features
- Submit pull requests
- Set up the development environment
- Run tests

### Development Setup

```bash
# Install development dependencies
npm run setup:dev

# Run in development mode
npm run dev

# Run tests
npm test
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [TensorFlow](https://www.tensorflow.org/) for ML capabilities
- [React](https://reactjs.org/) for the UI framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend API
- [All contributors](https://github.com/DanishVahora/SchedSense.ai/graphs/contributors) who have helped build SchedSense.ai

## 📞 Contact & Support

- Website: [schedsense.ai](https://schedsense.ai)
- Email: support@schedsense.ai
- Twitter: [@SchedSenseAI](https://twitter.com/SchedSenseAI)
- GitHub Issues: [Issue Tracker](https://github.com/DanishVahora/SchedSense.ai/issues)

---

<div align="center">
  <p>Made with ❤️ by the SchedSense.ai Team</p>
  <p>© 2025 SchedSense.ai — Intelligent scheduling for productive lives</p>
</div>
