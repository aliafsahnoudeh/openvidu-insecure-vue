import axios from 'axios'
import config from '@/config'

class ApiService {
  /**
     * --------------------------
     * SERVER-SIDE RESPONSIBILITY
     * --------------------------
     * These methods retrieve the mandatory user token from OpenVidu Server.
     * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
     * the API REST, openvidu-java-client or openvidu-node-client):
     *   1) Initialize a session in OpenVidu Server	(POST /api/sessions)
     *   2) Generate a token in OpenVidu Server		(POST /api/tokens)
     *   3) The token must be consumed in Session.connect() method
     */
  getToken(sessionId) {
    return this.createSession(sessionId).then((id) => this.createToken(id))
  }
  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ customSessionId: sessionId })
      console.log(`createSession: ${data}`)

      axios
        .post(config.OPENVIDU_SERVER_URL + '/api/sessions', data, {
          headers: {
            Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + config.OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          console.log('CREATE SESION', response)
          resolve(response.data.id)
        })
        .catch((response) => {
          console.error(response)
          const error = Object.assign({}, response)
          if (error.response.status === 409) {
            resolve(sessionId)
          } else {
            console.log(error)
            console.warn(
              'No connection to OpenVidu Server. This may be a certificate error at ' +
                              config.OPENVIDU_SERVER_URL
            )
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                                  config.OPENVIDU_SERVER_URL +
                                  '"\n\nClick OK to navigate and accept it. ' +
                                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                  config.OPENVIDU_SERVER_URL +
                                  '"'
              )
            ) {
              window.location.assign(config.OPENVIDU_SERVER_URL + '/accept-certificate')
            }
          }
        })
    })
  }
  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      console.log(`createToken: ${sessionId}`)
      const data = JSON.stringify({ session: sessionId })
      axios
        .post(config.OPENVIDU_SERVER_URL + '/api/tokens', data, {
          headers: {
            Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + config.OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          console.log('TOKEN', response)
          resolve(response.data.token)
        })
        .catch((error) => reject(error))
    })
  }
}

export default ApiService
