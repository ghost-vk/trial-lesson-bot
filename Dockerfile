FROM node:18-alpine as builder
WORKDIR /app
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY package.json .
RUN yarn workspaces focus
COPY . .
RUN yarn build

FROM node:18-alpine
WORKDIR /app
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY package.json .
RUN yarn workspaces focus --production
COPY . .
COPY --from=builder /app/dist dist
COPY src/seed/seed.xlsx dist/seed
EXPOSE 80
CMD ["yarn", "start:prod"]
