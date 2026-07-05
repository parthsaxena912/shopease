# Stage 1: Build the React app
FROM node:20-alpine AS build

ARG VITE_GOOGLE_CLIENT_ID

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
