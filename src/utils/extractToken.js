const extractToken = (authorizationHeader) => {
  if (authorizationHeader.startsWith("Bearer")) {
    const token = authorizationHeader.split(" ")[1];

    return token;
  }

  return null;
};

module.exports = extractToken;
