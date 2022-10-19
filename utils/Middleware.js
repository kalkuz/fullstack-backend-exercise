import Response from './Response.js';

const UnknownEndpoint = (req, res) => {
  Response.error(res, 'Unknown endpoint.', 'Unknown endpoint.');
};

export {
  UnknownEndpoint,
};
