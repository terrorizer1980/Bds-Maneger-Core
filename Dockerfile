# bdsmaneger/node_image
# Base
FROM debian:latest AS bdsbase
USER root
ENV DEBIAN_FRONTEND=noninteractive DOCKER_IMAGE="true"
RUN apt update && \
apt -y install curl wget git zsh sudo unzip zip jq python python3 ca-certificates make build-essential screen procps lsb-release xdg-utils g++ \
    libnss3 libatk-bridge2.0-0 gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
    libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 \
    libxdamage1 libxext6 libxfixes3 libxrandr2 libxrender1 libxss1 libxtst6 fonts-liberation libappindicator1 libnss3 libgbm-dev && \
apt autoremove -y && \
apt clean -y && \
rm -rf /var/lib/apt/lists/* /root/.gnupg /tmp/library-scripts /tmp/*
RUN wget -qO- https://raw.githubusercontent.com/Sirherobrine23/MSQ-files/main/DockerBuild/Build/bin/NodeInstall.sh | bash -

# Bds Maneger Core
FROM bdsbase AS bdscore
RUN apt update && apt install -y openjdk-11-jdk openjdk-11-jre nginx && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* /tmp/* /etc/nginx/sites-*/default && mkdir -p /home/bds/
RUN case $(uname -m) in \
    "x86_64") echo "Do not need dependency on the x86_64";;\
    *) \
        apt update; apt install -y qemu-user-static ;\
        wget -q https://raw.githubusercontent.com/The-Bds-Maneger/Raw_files/main/linux_libries.zip -O /tmp/libries.zip ;\
        unzip /tmp/libries.zip -d / ;\
        rm -rfv /tmp/libries.zip ;\
        mkdir -p /lib64 ;\
        rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* /tmp/* \
    ;;\
esac

COPY ./ /opt/bds_core/
WORKDIR /opt/bds_core/
RUN chmod a+x bin/* && npm install --no-save
ENV TELEGRAM_TOKEN="null" DESCRIPTION="running Minecraft Bedrock Server on the docker by Bds Manager" WORLD_NAME="Bds Maneger Docker" GAMEMODE="survival" DIFFICULTY="normal" XBOX_ACCOUNT="false" PLAYERS="13" SERVER="bedrock" ENABLE_COMMANDS="false" BDS_DOCKER_IMAGE="true"

# Non Root User
RUN export username="thebds" && export password="123aa3456s7" && pass=$(perl -e 'print crypt($ARGV[0], "password")' $password); useradd -m -p "$pass" "$username"; addgroup ${username} sudo; addgroup ${username} root; usermod --shell /bin/bash --home /home/bds ${username}; echo "${username}   ALL=(ALL:ALL) NOPASSWD: ALL" >> /etc/sudoers && mkdir -p /home/ /base/

EXPOSE 19132/udp 19133/udp
VOLUME [ "/home/bds/bds_core" ]
RUN chmod -Rv 7777 /home/ /base/ && chown thebds:thebds -Rv /home/ /base/
USER thebds

# Entrypint
WORKDIR /home/bds/
ENTRYPOINT [ "/opt/bds_core/bin/bds_maneger" ,"--DOCKER_IMAGE" ,"-s" ]
