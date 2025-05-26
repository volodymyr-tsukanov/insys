# Setup
```bash
cd proj
podman run -it --rm --name nj --volume .:/home/app localhost/simple-nodejs:alpha ash
```
inside _nj_
```sh
npx create-next-app@latest .
# 15.3.2
```

# Start
```bash
podman-compose run -d
```
