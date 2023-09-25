
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Test extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Test.init({
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        contact: DataTypes.STRING,
        q1: DataTypes.STRING,
        q2: DataTypes.STRING,
        q3: DataTypes.STRING,
        q4: DataTypes.STRING,
        q5: DataTypes.STRING,
        q6: DataTypes.STRING,
        q7: DataTypes.STRING,
        q8: DataTypes.STRING,
        q9: DataTypes.STRING,
        q10: DataTypes.STRING,
        q11: DataTypes.STRING,
        time : DataTypes.INTEGER,
        Marks : DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Test',
    });
    return Test;
};