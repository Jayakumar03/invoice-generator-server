const User = require("../model/user.js");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    if (!name || !password || !mobileNumber || !email) {
      return next(new Error("All fields are required"));
    }

    const isUserNameAlreadyPresent = await User.findOne({ email });

    if (isUserNameAlreadyPresent) {
      return res.status(409).json({
        message: "User is already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      mobileNumber,
    });

    res
      .json({
        success: true,
        user,
      })
      .status(200);
  } catch (error) {
    console.log(error);
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Error("Username and password are required"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(409).json({
        message: "User is not registered",
      });
    }

    const isPasswordCorrect = await user.isValidatedPassword(password);

    if (!isPasswordCorrect)
      return next(new Error("You are password is wrong", 400));

    res
      .json({
        success: true,
        user,
      })
      .status(200);
  } catch (error) {
    console.log(error);
  }
};

exports.logOut = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logout Success",
    });
  } catch (error) {
    console.log(error);
  }
};

// exports.getUserdetails = async (req, res, next) => {
//   try {
//     console.log(req.params.id);
//     const individualUserDetails = await User.findById(req.params.id);

//     if (!individualUserDetails) {
//       return res.status(400).json({
//         success: false,
//         message: "There are no stories avaiable ",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user: individualUserDetails,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };
