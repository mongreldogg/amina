FROM debian:stretch

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get -y install build-essential gcc automake autoconf libtool \
    swig python3-dev python3-numpy python3-scipy \
    bison pkg-config cmake \
    pulseaudio alsa-utils liblapack-dev gcc binutils-avr \
    mingw-w64 mt-st pulseaudio-utils libasound2-dev libpulse-dev \
    python3 cross-gcc-dev mysql-server nginx-full php7.0 \
    php7.0-fpm php7.0-mysqli php7.0-gd php7.0-curl

ADD sphinxbase.tar.gz /usr/share/sphinxbase/
WORKDIR /usr/share/sphinxbase
RUN ./autogen.sh
RUN ./configure
RUN make
RUN make install

ADD pocketsphinx.tar.gz /usr/share/pocketsphinx/
WORKDIR /usr/share/pocketsphinx
RUN ./autogen.sh
RUN ./configure --with-swig-python
RUN make clean all
RUN make check
RUN make install

ENV LD_LIBRARY_PATH=/usr/local/lib
ENV PKG_CONFIG_PATH=/usr/local/lib/pkgconfig

RUN apt-get -y install software-properties-common curl
RUN apt-get -y remove nodejs
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get -y install nodejs espeak

ADD core.tar.gz /usr/share/amina/
WORKDIR /usr/share/amina

RUN npm install cmake-js --save-dev && npm install pocketsphinx --save-dev

COPY config/amina.web.conf /etc/nginx/sites-enabled/amina.web.conf
COPY config/php-www.conf /etc/php/7.0/fpm/pool.d/www.conf

RUN service php7.0-fpm start
RUN service nginx start
#RUN service mysql start

STOPSIGNAL SIGTERM

EXPOSE 80
EXPOSE 3306