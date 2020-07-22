module.exports = [
  {
    statusCode: 200,
    body: {
      token: 'unique value is here'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  },
  {
    statusCode: 200,
    body: {
      email: 'jack@mail.local'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }
];