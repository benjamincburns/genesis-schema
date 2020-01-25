String cacheFolder = '/yarn-cache'
def DEFAULT_BRANCH = 'master'
def BINARIES_BUCKET = 'assets.whiteblock.io'

pipeline {
  agent {
    kubernetes {
      cloud 'kubernetes-dev-gke'
      idleMinutes 1440   // 1 day (to make use of yarn cache)
      label 'node-yarn-cicd'
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    cicd: true
spec:
  containers:
  - name: node
    image: node:alpine
    command:
    - cat
    tty: true
    volumeMounts:
    - mountPath: ${cacheFolder}
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
"""
    }
  }

  environment {
    YARN_CACHE_FOLDER = '/yarn-cache'
  }

  stages {
    stage('build') {
      steps {
        container('node') {
          sh 'apk add git'
          sh 'yarn install'
          sh 'yarn test'
        }
      }
    }
  }
}
