const express = require("express");
const contactController = require("./../controllers/contactController");

const router = express.Router();

router
  .route("/")
  .post(contactController.createContacts)
  .get(contactController.searchContacts);

router
  .route("/:id")
  .patch(contactController.updateContacts)
  .delete(contactController.deleteContacts);

module.exports = router;
