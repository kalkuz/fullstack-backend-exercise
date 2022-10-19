import Logger from './Logger.js';

const success = (res, data, message, total) => res
  .status(200)
  .json({
    ...(Array.isArray(data) ? { count: data.length } : null),
    data,
    message,
    total,
  });

const error = (res, log, message) => {
  Logger.error(log);
  res.status(400)
    .json({ log, message });
};

export default { success, error };
