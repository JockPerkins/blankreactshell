'use strict';

module.exports = function(sequelize, DataTypes) {
  var NewsStories = sequelize.define('NewsStories', {
    id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      },
      primaryKey: true
    },
    Title: {
      type: DataTypes.STRING,
    },
    Content: {
      type: DataTypes.STRING,
    },
    HeadImageURL: {
      type: DataTypes.STRING,
    },
  });
  return NewsStories;
};
