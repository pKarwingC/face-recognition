FROM node:latest

WORKDIR /usr/src/face-recognition

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]