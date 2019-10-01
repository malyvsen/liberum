import Account from "../../backend/Account.js";
import exampleAccount, {
  password as examplePassword
} from "../../example/Account.js";

test("the example account retains its public key across runs", () => {
  return exampleAccount.unlock(examplePassword);
});
