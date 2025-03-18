FROM node:20.18.0-alpine3.19

RUN npm install -g npm@10.9.0

RUN apk add --no-cache \
  openjdk21 \
  libreoffice \
  curl

# Font configuration (https://stackoverflow.com/questions/56937689/how-to-install-fonts-in-docker)
WORKDIR /root/fonts

RUN apk add --no-cache msttcorefonts-installer fontconfig
RUN update-ms-fonts
RUN apk add ttf-freefont font-terminus font-inconsolata font-dejavu font-noto font-noto-cjk font-awesome font-noto-extra

# Google fonts
RUN wget https://github.com/google/fonts/archive/main.tar.gz -O gf.tar.gz --no-check-certificate
RUN tar -xf gf.tar.gz
RUN mkdir -p /usr/share/fonts/truetype/google-fonts
RUN find $PWD/fonts-main/ -name "*.ttf" -exec install -m644 {} /usr/share/fonts/truetype/google-fonts/ \; || return 1
RUN rm -f gf.tar.gz
RUN fc-cache -f && rm -rf /var/cache/*

# PDF signer
WORKDIR /var/lib
RUN curl --location --output open-pdf-sign.jar https://github.com/open-pdf-sign/open-pdf-sign/releases/latest/download/open-pdf-sign.jar

ENV JAVA_HOME="/usr/lib/jvm/java-21-openjdk"
ENV PATH="$JAVA_HOME/bin:$PATH"

WORKDIR /usr/src/archiver

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x ./bin/boot-app.sh

CMD ["/usr/src/archiver/bin/boot-app.sh"]
