const catchError = require("../utils/catchError");
const User = require("../modelos/User");
const bycrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const { link } = require("fs");
const EmailCode = require("../modelos/EmailCode");
const { use } = require("../routes");
const { verify } = require("crypto");
const verifyJWT = require("../utils/verifyJWT");
const getAll = catchError(async (req, res) => {
  const results = await User.findAll();
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const { email, pasword, firstName, lastName, coutry, Image, frontBase } =
    req.body;
  const encri = await bycrypt.hash(pasword, 10);
  const result = await User.create({
    email,
    firstName,
    lastName,
    coutry,
    Image,
    pasword: encri,
  });

  const code = require("crypto").randomBytes(32).toString("hex");

  const link = `${frontBase}/${code}`;

  await EmailCode.create({
    CLAVE: code,

    userId: result.id,
  });

  await sendEmail({
    to: email,
    subject: "VERIFICATE EMAIL FROM USER APP",
    html: `
<h1>hola ${firstName} ${lastName}</h1>
<p>verificacio complta </p>
<a href="${link}">${link} </a>

`,
  });

  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;

  const { email, pasword, firstName, lastName, coutry, Image } = req.body;
  const result = await User.update(
    {
      email,
      firstName,
      lastName,
      coutry,
      Image,
    },
    { where: { id }, returning: true }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const VERIFCI = catchError(async (req, res) => {
  const { CLAVE } = req.params;
  const emailcode = await EmailCode.findOne({ where: { CLAVE: CLAVE } });

  if (!emailcode) return res.status(401).json({ Message: "invlido codifo" });

  const user = await User.findByPk(emailcode.userId);
  user.isVerify = true;
  await user.save();

  await emailcode.destroy();

  return res.json(user);
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;

  const use = await User.findOne({ where: { email: email } });
  if (!use) return res.status(401).json({ message: "no user" });
  const isvalid = await bycrypt.compare(password, use.password);
  if (!isvalid) return res.status(401).json({ message: "mal contraseña" });

  const token = jwt.sign({ use }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return res.json({ use, token });
});


module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  VERIFCI,
  login
};
