FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
ENV PGHOST=postgres
CMD ["npm", "start"] 

# FROM nginx
# COPY --from=builder /app /usr/share/nginx/html
