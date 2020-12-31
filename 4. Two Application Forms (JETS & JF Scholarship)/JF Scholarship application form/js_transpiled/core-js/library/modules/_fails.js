define(function (require, exports, module) {module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};
});
