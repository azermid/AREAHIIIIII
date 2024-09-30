cd server;
npm install;
cd ../client/area;
npm install;
cd ../..;
docker compose -f docker-compose.yml -f docker-compose-dev.yml up --build;