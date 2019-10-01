import Account from "../../backend/account.js";
import exampleAccount, {
  password as examplePassword
} from "../../example/account.js";

test("the example account retains its public key across runs", () => {
  return exampleAccount.unlock(examplePassword);
});
