# HYCON Docker Image

This document deals with the way to run the released docker image. 
You can run hycon code using released docker images in every platform which supports docker.

### Prerequisites

You need sudo or administrator permission, and docker installed.
Please refer [this link](https://docs.docker.com/install) to install docker on your machine.

##### Please do not forget to enable BIOS setting for CPU Virtual Technology.
On Windows, you need to run docker desktop that can be installed as described [here](https://docs.docker.com/docker-for-windows/install/).

### How to run

After copying the tar file released which is named as "HYCON_\[version\]\_\[build-date\]\_\[build-time-HHMM\]_docker.tar",

You can run the docker image by entering the following commands

#### On Unix-like OS

$`sudo docker load -i hycon_[version]_[build-date]_[build-time-HHMM]_docker.tar`

$`sudo docker run -it --network="host" hycon_[version]_[build-date]_[build-time-HHMM]`

#### On Windows OS

$`docker load -i hycon_[version]_[build-date]_[build-time-HHMM]_docker.tar`

$`docker run -it --network="host" hycon_[version]_[build-date]_[build-time-HHMM]`

