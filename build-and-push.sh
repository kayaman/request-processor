#!/bin/sh

podman build -t ghcr.io/kayaman/processor:0.1.8 .
podman push ghcr.io/kayaman/processor:0.1.8