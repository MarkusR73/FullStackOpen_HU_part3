import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject) => {
  console.log('Entered create in perser.js')
  return axios
    .post(baseUrl, newObject)
    .then(response => response.data)
    .catch(error => {
      console.error('Error:', error.response ? error.response.data : error.message);
      return Promise.reject(error.response ? error.response.data : error.message);
    })
  console.log("Exiting create in perser.js")
}

const remove = (id) => {
  return axios
    .delete(`${baseUrl}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error:', error.response ? error.response.data : error.message);
      return Promise.reject(error.response ? error.response.data : error.message);
    })
}

const update = (id, newObject) => {
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then(response => response.data)
    .catch(error => {
      console.error('Error:', error.response ? error.response.data : error.message);
      return Promise.reject(error.response ? error.response.data : error.message);
    })
}

export default {getAll, create, remove, update}