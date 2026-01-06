# Project Documentation: Local, Docker, and GCP

This document provides a complete guide on how to run, containerize, and deploy this React/Node.js/Postgres application.

---

## 1. Running Locally (Non-Docker)
Earlier, we set up the project to run directly on your machine without Docker. This is useful for fast development.

### How it works:
- **Root Controller**: We created a [package.json](file:///home/armourai-nagabhushan/Desktop/ArmourAI/DemoForDocker/package.json) in the project root. It uses a tool called `concurrently` to run both the frontend and backend at the same time.
- **Frontend Proxy**: We added `"proxy": "http://localhost:5000"` in [client/package.json](file:///home/armourai-nagabhushan/Desktop/ArmourAI/DemoForDocker/client/package.json). This tells React that any API request it doesn't recognize should be sent to the backend.
- **Environment**: You use a [.env](file:///home/armourai-nagabhushan/Desktop/ArmourAI/DemoForDocker/server/.env) file in the server folder to tell the code how to connect to your local Postgres.

### Common Local Commands:
- `npm run dev`: Starts both frontend and backend.
- `npm run install:all`: Installs all dependencies for both folders.

---

## 2. Understanding Docker
Docker is a tool that "packages" your code, its settings, and its dependencies into a single unit called a **Container**.

### Why use Docker?
- **"It works on my machine"**: Containers run the same way on your laptop, your friend's laptop, and the cloud.
- **Isolation**: You don't need to install Postgres or Node locally; Docker runs them inside isolated boxes.
- **Scaling**: It's easy to run 10 copies of your server if traffic increases.

### Key Files & Their Importance:
1. **[Dockerfile.dev](file:///home/armourai-nagabhushan/Desktop/ArmourAI/DemoForDocker/client/Dockerfile.dev)**: The "recipe" for creating a development container. It specifies the Node version, copies code, and runs `npm start`.
2. **[docker-compose.yml](file:///home/armourai-nagabhushan/Desktop/ArmourAI/DemoForDocker/docker-compose.yml)**: The "conductor". It tells Docker how to start multiple containers (client, server, postgres, nginx) together and how they should talk to each other.
3. **NGINX**: Acts as a "traffic cop". It sits in front of your app and decides which requests go to the React frontend and which go to the Node backend.

### Running it with Docker:
```bash
docker-compose up --build
```

---

## 3. Deploying to Google Cloud Platform (GCP)
Deploying to the cloud involves moving your local containers to GCP's infrastructure.

### Steps to Deploy:

#### Phase A: Preparation
1. **Google Cloud SDK**: Install the `gcloud` CLI on your machine.
2. **Project Setup**: Create a new project in the [GCP Console](https://console.cloud.google.com/).

#### Phase B: Database (Cloud SQL)
Instead of running Postgres in a container, you should use **Cloud SQL** (highly recommended for production).
1. Create a Cloud SQL (PostgreSQL) instance.
2. Get the connection string and credentials.

#### Phase C: Container Registry (Artifact Registry)
1. Build your images for production (using the production `Dockerfile` instead of `.dev`).
2. Push them to **Google Artifact Registry**:
   ```bash
   docker build -t gcr.io/[PROJECT_ID]/api ./server
   docker push gcr.io/[PROJECT_ID]/api
   ```

#### Phase D: Deployment (Cloud Run vs. GKE)
- **Cloud Run (Recommended for beginners)**:
  - Deploy your `api` and `client` images as separate services.
  - Cloud Run handles scaling and gives you a URL automatically.
- **Google Kubernetes Engine (GKE)**:
  - More complex but more powerful.
  - You would use Kubernetes "Deployments" and "Services" to manage your containers.

---

## Summary Table

| Feature | Local (npm) | Local (Docker) | GCP (Production) |
| :--- | :--- | :--- | :--- |
| **Speed** | Instant | Medium | Production Build |
| **Setup** | Manual | Automatic | Cloud Services |
| **Database** | Installed on OS | Docker Container | Cloud SQL |
| **Routing** | React Proxy | Nginx Container | Load Balancer |
