FROM justadudewhohacks/opencv-nodejs
ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1
ENV UDEV=1
RUN apt-get update
RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -

#RUN apt-get install -y libgtk2.0-dev

RUN apt-get install -y nodejs

RUN npm cache clean -f
RUN npm install -g n
RUN n stable

COPY package.json .


RUN apt-get install -y build-essential
RUN apt-get install -y cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
RUN apt-get install -y python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev

#RUN npm i opencv4nodejs

RUN mkdir /root/.node-red/

WORKDIR /root/.node-red/

COPY src .

COPY flows.json /data/
COPY package.json /root/.node-red/
ENV FLOWS=/data/flows.json

RUN npm i

CMD ["npm", "start", "--"]


