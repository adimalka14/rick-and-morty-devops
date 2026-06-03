# Rick and Morty API

A Node.js REST API that fetches all **alive human characters from Earth** from the [Rick and Morty API](https://rickandmortyapi.com) and exposes them via two HTTP endpoints.

---

## Prerequisites

| Tool | Purpose |
|------|---------|
| Node.js 20+ | Local development |
| Docker | Build and run the container |
| kubectl | Deploy to Kubernetes manually |
| Helm | Deploy to Kubernetes via Helm chart |
| minikube | Local Kubernetes cluster |

---

## Local Development

```bash
npm install
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the server with ts-node (hot reload) |
| `npm test` | Run all tests |
| `npm run lint` | Run ESLint |
| `npm run build` | Compile TypeScript to `dist/` |

The server starts on port `3000` by default. Set a custom port with the `PORT` environment variable.

---

## Running with Docker

### Build the image

```bash
docker build -t adimalka/rick-and-morty-api:1.0.0 .
```

### Run the container

```bash
docker run -p 3000:3000 adimalka/rick-and-morty-api:1.0.0
```

The API is available at `http://localhost:3000`.

---

## Kubernetes Deployment with kubectl

### Create the namespace

```bash
kubectl create namespace rick-and-morty
```

### Apply all manifests

```bash
kubectl apply -f yamls/
```

### Verify

```bash
kubectl get all -n rick-and-morty
```

---

## Kubernetes Deployment with Helm

```bash
helm install rick-and-morty ./helm/rick-and-morty \
  --namespace rick-and-morty \
  --create-namespace
```

### Upgrade an existing release

```bash
helm upgrade rick-and-morty ./helm/rick-and-morty \
  --namespace rick-and-morty
```

### Uninstall

```bash
helm uninstall rick-and-morty --namespace rick-and-morty
```

---

## Accessing the Service

### Option 1 — minikube tunnel (Ingress)

Run in a separate terminal:

```bash
minikube tunnel
```

Then open in a browser or curl:

```
http://127.0.0.1/api/rick-and-morty/healthcheck
http://127.0.0.1/api/rick-and-morty/data
```

### Option 2 — minikube service URL (ClusterIP direct access)

```bash
minikube service rick-and-morty-api -n rick-and-morty --url
```

Use the printed URL to call the endpoints directly.

### Option 3 — minikube IP from terminal

```bash
MINIKUBE_IP=$(minikube ip)
curl http://$MINIKUBE_IP/api/rick-and-morty/healthcheck
curl http://$MINIKUBE_IP/api/rick-and-morty/data
```

---

## API Endpoints

### `GET /healthcheck`

Returns the health status of the service.

```bash
curl http://localhost:3000/healthcheck
```

```json
{ "status": "ok" }
```

---

### `GET /data`

Returns a list of alive human characters who originate from Earth.

```bash
curl http://localhost:3000/data
```

```json
[
  {
    "name": "Rick Sanchez",
    "location": "Citadel of Ricks",
    "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg"
  },
  {
    "name": "Morty Smith",
    "location": "Earth (C-137)",
    "image": "https://rickandmortyapi.com/api/character/avatar/2.jpeg"
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Character name |
| `location` | string | Current location |
| `image` | string | Avatar image URL |

---

## CI/CD

The project uses two GitHub Actions workflows:

### CI (`ci.yml`) — runs on every push and PR to `main`

| Step | Description |
|------|-------------|
| Install | `npm ci` |
| Lint | `npm run lint` |
| Test | `npm run test` |
| Build | `npm run build` |
| Docker push | Build and push image to DockerHub (push to `main` only) |

**Docker image tags generated automatically:**
- `latest` — always points to the latest build on `main`
- `sha-<short-sha>` — unique tag per commit (e.g. `sha-a1b2c3d`)
- `1.2.0` / `1.2` — created automatically when a git tag like `v1.2.0` is pushed

To release a new version:
```bash
git tag v1.2.0
git push origin v1.2.0
```

Required GitHub secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`

---

### CD (`cd.yml`) — runs automatically after CI succeeds on `main`

| Step | Description |
|------|-------------|
| Create kind cluster | Spins up a local Kubernetes cluster in the runner |
| Pull image | Pulls the image from DockerHub (built by CI) |
| Load image | Loads the image into the kind cluster |
| Helm deploy | `helm install` with `--create-namespace` and `imagePullPolicy=Never` |
| Rollout check | `kubectl rollout status` |
| Endpoint tests | `curl` on `/healthcheck` and `/data` |

---

## Running Tests

```bash
npm test
```

Jest runs all tests under `src/__tests__/` and prints a coverage summary.
After each run, an HTML report is generated at `jest_html_reporters.html` — open it in a browser for a visual test breakdown.
