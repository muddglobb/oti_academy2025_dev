# OmahTI Academy

OmahTI Academy Website.


---

## Commit Message Convention

We follow a structured commit message format:

```
<feat || fix || init || build || docs>(<additional info>): <commit_message>
```
### Keterangan:
- `feat = feature`
- `fix = fix`
- `init = initialization`
- `build = perubahan yang berkaitan dengan sistem build atau tools eksternal`
- `docs = documentation`
- `additional info dapat berupa nama folder atau bagian fitur`
### Contoh:
- `feat(auth): add auth service`
- `fix(ui): resolve navbar overlapping issue`
- `init(project): setup Next.js with TypeScript`
- `build(deps): update Dockerfile to use Node 18`
- `docs(readme): add README.md file`

---

## Installation

Ensure you have Docker and Docker Desktop installed and configured on your local machine. Then, follow these steps:
```bash
# Clone the repository
git clone https://github.com/muddglobb/oti_academy2025_dev.git
# Then, follow the instructions in the "Usage" section.
```

## How to access the API
On postman, set environment:
```bash
baseUrl: http://localhost:8080
```

Then access the endpoint:
```bash
{{baseUrl}}/serviceName/...
```

example:
```bash
{{baseUrl}}/auth/register
```

## How to start docker

- To start fresh without prebuilt images:
```bash
docker compose up --build
```

- To start an existing image (without applying new changes):
```bash
docker compose up
```

- To stop the development server:
```bash
docker compose down
```

- To apply new changes:
```bash
docker compose down && docker compose up --build
```

- To remove all data (volume included):
```bash
docker compose down -v
```