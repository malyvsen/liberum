import expect from "expect";
import { random as randomPassword } from "../../backend/Password";

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
