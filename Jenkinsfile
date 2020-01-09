pipeline {
  options {
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10')
    // cache doesn't keep symlink, which causes npm srcipts to fail
    // cache(caches: [[$class: 'ArbitraryFileCache', excludes: '', includes: '**/*', path: 'node_modules'], [$class: 'ArbitraryFileCache', excludes: '', includes: '**/*', path: 'ui/node_modules']], maxCacheSize: 1024)
    timeout(time: 1, unit: 'HOURS')
  }
  triggers {
    pollSCM 'H/5 * * * *'
  }
  agent {
    dockerfile {
      filename 'Dockerfile.build'
      reuseNode true
      // shell evaluation doens't work
      args '-v /var/run/docker.sock:/var/run/docker.sock -v /etc/timezone:/etc/timezone'
    }
  }
  environment {
    CI = 'true'
  }
  stages {
    stage('clean') {
      when {
        isRestartedRun()
      }
      steps {
        sh 'rm -rf build build.zip ui/build package-lock.json yarn.lock node_modules ui/package-lock.json ui/yarn.lock ui/node_modules'
        sh 'docker system prune -af --volumes'
      }
    }
    stage('install') {
      steps {
        sh 'npm i --unsafe-perm'
      }
    }
    stage('test') {
      steps {
        sh 'npm run lint'
        sh 'npm test'
        dir('ui') {
          sh 'npm run lint'
          sh 'npm test'
        }
      }
    }
    stage('build') {
      when {
        anyOf {
          branch 'master'
          buildingTag()
        }
      }
      stages {
        stage('compile') {
          environment {
            // Jenkins force env to be String or function call
            VERSION = "${env.TAG_NAME ? env.TAG_NAME.substring(1) : "0.0.0-${env.GIT_COMMIT}"}"
          }
          steps {
            sh 'npm run build'
          }
        }
        stage('package') {
          parallel {
            stage('package-native') {
              steps {
                sh 'npm run dist:ins'
                dir('build') {
                  sh 'zip -ry9D ../build-linux.zip .'
                }
                archiveArtifacts artifacts: 'build-linux.zip', fingerprint: true
              }
            }
            stage('package-docker') {
              steps {
                sh 'docker build -t vubui/apollo-react-template .'
                sh 'docker save vubui/apollo-react-template | gzip -9 > build-docker.tar.gz'
                archiveArtifacts artifacts: 'build-docker.tar.gz', fingerprint: true
              }
            }
            stage('package-docker-compose') {
              steps {
                dir('docker-compose') {
                  sh 'tar -cv . | gzip -9 > ../build-docker-compose.tar.gz'
                }
                archiveArtifacts artifacts: 'build-docker-compose.tar.gz', fingerprint: true
              }
            }
          }
        }
      }
    }
  }
}
