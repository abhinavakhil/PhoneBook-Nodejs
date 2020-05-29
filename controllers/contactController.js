const Contact = require("./../models/contactModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// exports.aliasTopTours = (req, res, next) => {
//   q.query.limit = "4";
//   req.query.sort = "name";
//   req.query.fields = "name,number,email";
//   next();
// };

exports.createContacts = catchAsync(async (req, res, next) => {
  const contactNew = await Contact.create(req.body);
  // console.log(req.body);
  res.status(201).json({
    status: "success",
    data: {
      contact: contactNew,
    },
  });
});

exports.updateContacts = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contact) {
    return next(new AppError("No Contact found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      contact,
    },
  });
});

exports.deleteContacts = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new AppError("No Contacts found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.searchContacts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Contact.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const contact = await features.query;
  res.status(200).json({
    status: "success",
    //result: contact.length,
    data: {
      contact,
    },
  });
});
