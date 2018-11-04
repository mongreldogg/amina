FROM debian:stretch
#TODO: possibly migrate to CentOS to reduce image size

RUN apt-get -y update

RUN apt-get -y install build-essential gcc automake autoconf libtool \
    swig python2.7 python2.7-dev python2.7-numpy python2.7-scipy \
    bison pkg-config cmake \
    pulseaudio alsa-utils liblapack-dev gcc binutils-avr \
    mingw-w64 mt-st pulseaudio-utils libasound2-dev libpulse-dev \
    python3 cross-gcc-dev software-properties-common curl

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get -y install nodejs

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

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get -y install nodejs git

ADD core.tar.gz /usr/share/amina/
WORKDIR /usr/share/amina

RUN npm install cmake-js --save-dev && npm install pocketsphinx --save-dev && npm install

STOPSIGNAL SIGTERM