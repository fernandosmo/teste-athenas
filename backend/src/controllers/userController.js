import User from '../database/models/User.js';

export const createUsersHandler = async (req, res, next) => {
  try {
    const { name, lastName, gender, email, birthDate } = req.body;

    const user = await User.create({
      name,
      lastName,
      gender,
      email,
      birthDate,
    });

    res.status(201).json({
      status: 'success',
      user,
      message: 'user created successfully!!',
    });
  } catch (err) {
    next(err);
  }
};

export const getUsersHandler = async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      status: 'success',
      users,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserByIdHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });

    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserHandler = async (req, res, next) => {
  try {
    const { name, lastName, gender, email, birthDate } = req.body;
    const userId = req.params.id;

    const user = await User.update(
      {
        name,
        lastName,
        gender,
        email,
        birthDate,
      },
      { where: { id: userId } }
    );

    res.status(200).json({
      status: 'success',
      user,
      message: 'user updated successfully!',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUserHandler = async (req, res, next) => {
  try {
    await User.destroy({ where: { id: req.params.id } });

    res.status(200).json({
      status: 'sucess',
      message: 'user deleted successfully!',
    });
  } catch (err) {
    next(err);
  }
};
