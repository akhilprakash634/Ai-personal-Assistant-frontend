# Build stage
FROM node:20 as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_BETA_URL
ARG VITE_CONTACT_URL
ARG VITE_GOOGLE_CLIENT_ID

ENV VITE_BETA_URL=$VITE_BETA_URL
ENV VITE_CONTACT_URL=$VITE_CONTACT_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# Production stage
FROM nginx:stable-alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
