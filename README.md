# task-hello

A tiny Dockerized TypeScript “Hello World” service.

## How to run locally

```bash
# build image
docker build -t task-hello .

# run container
docker run --rm -p 3000:3000 task-hello

# visit in browser or:
curl http://localhost:3000/
```
