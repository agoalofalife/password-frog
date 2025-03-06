FROM node

RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libxkbcommon0 \
    libxss1 \
    libasound2 \
    libgbm1 \
    libcups2\
    libgtk-3-0 \
    libnss3\
    dbus \
    dbus-x11\
    xvfb\
    libcanberra-gtk-module\
    libcanberra-gtk3-module\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /frog-app

COPY package*.json ./

RUN npm install

ENV DBUS_SESSION_BUS_ADDRESS="unix:path=/var/run/dbus/system_bus_socket"

COPY . .    

EXPOSE 4000

CMD ["sh", "-c", "service dbus start && npm run dev & until curl -s http://localhost:4000/ > /dev/null; do sleep 1; done && npm run start-electron"]
