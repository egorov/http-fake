module.exports = [
  {
    hostname: 'localhost',
    port: 80,
    path: '/api/users/login',
    body: {
      login: 'jack',
      password: 'P@ssw0rd'
    },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  {
    hostname: 'localhost',
    port: 80,
    path: '/api/email/confirm',
    body: {
      code: '29879384798'
    },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer unique value is here'
    }
  }  
];