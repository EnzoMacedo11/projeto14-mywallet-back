import { MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

import connectMongoDB from "../db.js";
import registerschema from "../schemas/registerSchema.js";
import valueschema from "../schemas/valueSchema.js";

export async function SignUp(req, res) {
  const { name, email, password, passwordConfirmation } = req.body;
  console.log(req.body);
  const data = { name, email, password, passwordConfirmation };
  const { error } = registerschema.validate(data, { abortEarly: false });
  const cryptPassword = bcrypt.hashSync(password, 10);
  if (error) {
    console.log(error);
    res.status(422).send(
      validate.error.details.map((err) => {
        return err.message;
      })
    );
    return;
  }
  const user = { name, email, password: cryptPassword };

  try {
    const database = await connectMongoDB();
    const registeredUser = await database
      .collection("users")
      .findOne({ email });
    if (registeredUser) {
      return res.status(409).send("E-mail já cadastrado. Escolha outro!");
    }
    await database.collection("users").insertOne(user);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(409).send(err);
  }
}

export async function SignIn(req, res) {
  const { email, password } = req.body;
  try {
    const database = await connectMongoDB();
    const registeredUser = await database
      .collection("users")
      .findOne({ email });
    if (!registeredUser) {
      return res.status(404).send("Usuário não encontrado");
    }
    const returnPassword = bcrypt.compareSync(
      password,
      registeredUser.password
    );
    if (!returnPassword) {
      return res.status(401).send("E-mail ou senha inválidos");
    }
    const token = uuid();
    await database.collection("sessions").insertOne({
      token,
      userId: registeredUser._id,
    });

    res.status(200).send({ token, user: registeredUser.name });
  } catch (err) {
    console.log(err);
    res.status(409).send(err);
  }
}

export async function WalletN(req, res) {
  const { date, operation, value } = req.body;
  const { id } = req.headers;
  const { error } = valueschema.validate(value, { abortEarly: false });
  if (error) {
    console.log(error);
    res.status(422).send(
      validate.error.details.map((err) => {
        return err.message;
      })
    );
    return;
  }

  console.log("reqa", req.body);
  try {
    const database = await connectMongoDB();
    await database.collection("walletN").insertOne({ date, operation, value,user: id });
    //res.status(200).send({ date, operation, value });
  } catch (err) {
    console.log(err);
    res.status(409).send(err);
  }
}

export async function WalletP(req, res) {
  const { date, operation, value } = req.body;
  const { id } = req.headers;
  const { error } = valueschema.validate(value, { abortEarly: false });
  if (error) {
    console.log(error);
    res.status(422).send(
      validate.error.details.map((err) => {
        return err.message;
      })
    );
    return;
  }

  try {
    const database = await connectMongoDB();

    await database.collection("walletP").insertOne({ date, operation, value, user: id });
    res.status(200).send({ date, operation, value });
  } catch (err) {
    console.log(err);
    res.status(409).send(err);
  }
}

export async function WalletNegative(req, res) {
  const { id } = req.headers;
  console.log(id);

  try {
    const database = await connectMongoDB();
    const isUser = await database.collection("walletN").find({ user: id }).toArray();
    console.log(isUser);
    if (!isUser) {
      return res.sendStatus(401);
    }

    res.send({ isUser });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function WalletPositive(req, res) {
  const { id } = req.headers;
  console.log(id);

  try {
    const database = await connectMongoDB();
    const isUser = await database.collection("walletP").find({ user: id }).toArray();
    console.log(isUser);
    if (!isUser) {
      return res.sendStatus(401);
    }

    res.send({ isUser });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}


