# openvidu-insecure-vue
A small and easy-to-use sample created with vue.js to start working with open vidu.
<br/>

## How to use
1. Intall project packages with:
```bash
npm i
```
2. Run a server to work with:
This project is just a web client and you need to run kurento media server (KMS) and open vidu on top of that.

- For development: There is an easy solution to run openvidu server + KMS with a docker. https://hub.docker.com/r/openvidu/openvidu-server-kms

Note: Because this image uses open-vidu 2.14.0, I had to downgrade the version of openvidu-browser to 2.14.0 for campatibility reasons. When you switching between master and dev branches, that will make a problem to build.

- For production:
Please visit:

[open vidu website](https://openvidu.io/)

[Kurento website](https://www.kurento.org/)


3. Run the project
```bash
npm run serve
```
## Dependencies
- [vue.js](https://github.com/vuejs/vue): For building the app.
- [openvidu-browser](https://github.com/OpenVidu/openvidu/tree/master/openvidu-browser): To connect with open vidu server.
- [axios](https://github.com/axios/axios): To make RESTful requests.