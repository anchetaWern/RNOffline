const sortUsers = users => {
  return users.slice().sort((x, y) => {
    return y.is_online - x.is_online;
  });
};

export default sortUsers;
