import expect from "expect";
import {
  random as randomPassword,
  isValid
} from "../../../backend/crypto/Password";

test("same seeds give same passwords", () => {
  const seed = "one two three";
  const password = randomPassword(seed);
  const samePassword = randomPassword(seed);
  expect(samePassword).toBe(password);
});

test("different seeds give different passwords", () => {
  const password = randomPassword("hello there");
  const samePassword = randomPassword("goodbye");
  expect(samePassword).not.toBe(password);
});

test("randomly generated password is valid", () => {
  const password = randomPassword("pa$$word");
  console.log(password);
  expect(isValid(password)).toBe(true);
});

test("invalid passwords don't pass isValid", () => {
  expect(isValid("123456!")).toBe(false);
  expect(isValid("1234567890")).toBe(false);
});
