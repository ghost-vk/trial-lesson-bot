# TODO: break into multiple stages
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn workspaces focus nestjs-core-template 
RUN yarn workspace nestjs-core-template build
EXPOSE 80
CMD ["yarn", "workspace", "nestjs-core-template", "start:prod"]
